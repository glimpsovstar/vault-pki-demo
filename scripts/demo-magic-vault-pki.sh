#!/usr/bin/env bash
# demo-magic-vault-pki.sh
# Step 1 TUI: Vault PKI issue → list → read → re-issue ("renew") → revoke
# Requires: vault, jq, terraform; uses minimal demo-magic

set -Eeuo pipefail

# --- paths ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"
DEMO_MAGIC="$SCRIPT_DIR/lib/demo-magic.sh"

# --- demo-magic ---
# shellcheck source=/dev/null
. "$DEMO_MAGIC"
TYPE_SPEED="${TYPE_SPEED:-20}"
PROMPT_TIMEOUT="${PROMPT_TIMEOUT:-0}"
GREEN="$(printf '\033[0;32m')"
CYAN="$(printf '\033[0;36m')"
COLOR_RESET="$(printf '\033[0m')"
DEMO_PROMPT="${GREEN}➜ ${CYAN}\W ${COLOR_RESET}$ "

# --- checks ---
for cmd in vault jq terraform; do
  command -v "$cmd" >/dev/null || { echo "Missing dependency: $cmd"; exit 1; }
done
test -f "$TF_DIR/terraform.tfstate" || test -d "$TF_DIR/.terraform" || {
  echo "Terraform not initialized/applied yet in: $TF_DIR"
  echo "Run: terraform -chdir=\"$TF_DIR\" init && terraform -chdir=\"$TF_DIR\" apply"
  exit 1
}

# --- read TF outputs ---
VAULT_ADDR="$(terraform -chdir="$TF_DIR" output -raw vault_addr)"
VAULT_TOKEN="$(terraform -chdir="$TF_DIR" output -raw vault_token)"
VAULT_NAMESPACE="$(terraform -chdir="$TF_DIR" output -raw vault_namespace || true)"
PKI_PATH="$(terraform -chdir="$TF_DIR" output -raw pki_path)"
PKI_ROLE="$(terraform -chdir="$TF_DIR" output -raw pki_role_name)"
APPROLE_NAME="$(terraform -chdir="$TF_DIR" output -raw approle_name)"
CRL_URL="$(terraform -chdir="$TF_DIR" output -json crl_url | jq -r '.[0]')"
COMMON_DOMAIN="$(terraform -chdir="$TF_DIR" output -raw common_domain || echo "demo.local")"

export VAULT_ADDR
export VAULT_TOKEN
[[ -n "$VAULT_NAMESPACE" ]] && export VAULT_NAMESPACE

p "# Vault PKI Step-1 CLI Demo"
p "This will demonstrate the PKI certificate lifecycle: issue → list → read → re-issue → revoke."
p "Using existing Vault token from Terraform configuration."
p ""

section "Initial Setup - Token Verification"
pe "vault token lookup"

# --- demo vars ---
CN_BASE="${CN_BASE:-app}"
DOMAIN_DEMO="${DOMAIN_DEMO:-$COMMON_DOMAIN}"        # from TF output; override via env if needed
TTL_DEMO="${TTL_DEMO:-5m}"
CN="${CN_BASE}.$(date +%s).${DOMAIN_DEMO}"

section "1.1 Show PKI Mount (configured via Terraform)"
p "Displaying the PKI secrets engine mount and configuration"
pei "vault secrets list | grep -E \"\\b$PKI_PATH\\b\" || true"
pe  "vault read sys/mounts/${PKI_PATH} | sed -n '1,40p'"

section "1.2 Root CA Creation Process"
p "How Root CA certificates are typically created in Vault PKI:"
p "The following commands show how a Root CA would be generated:"
p ""
pe  "echo '# Root CA generation command (already done via Terraform):'"
pe  "echo 'vault write ${PKI_PATH}/root/generate/internal common_name=\"Demo Root CA\" ttl=8760h'"
p ""
p "Let's verify our Root CA exists and examine its properties:"

section "1.3 Verify Root CA Certificate (created via Terraform)"
p "Displaying the root Certificate Authority certificate and configuration"
pe  "vault read ${PKI_PATH}/cert/ca"
pe  "vault read ${PKI_PATH}/config/urls | grep -E '(issuing_certificates|crl_distribution)'"
p "Extracting and examining the Root CA certificate details:"
pe  "vault read -field=certificate ${PKI_PATH}/cert/ca | openssl x509 -text -noout | head -15"

section "1.4 Show PKI Role Configuration"
p "Displaying the PKI role settings for certificate issuance"
pe  "vault read ${PKI_PATH}/roles/${PKI_ROLE}"

section "1.4 Show PKI Role Configuration"
p "Displaying the PKI role settings for certificate issuance"
pe  "vault read ${PKI_PATH}/roles/${PKI_ROLE}"

section "Phase 1: Certificate Generation Workflows"
p ""
p "Vault PKI supports two main certificate generation workflows:"
p "  1. /issue - Vault generates private key AND certificate (simplified)"
p "  2. /sign  - You provide CSR with your own private key (traditional)"
p ""

section "1.5 Workflow A: Traditional CSR Signing (/sign endpoint)"
p "Demonstrating traditional CSR-based certificate workflow"
p "This is how most organizations currently handle certificates"
p ""
p "Step 1: Generate private key locally"
pe  "CN_CSR=\"csr-workflow.\$(date +%s).${DOMAIN_DEMO}\""
pe  "echo \"Certificate CN: \$CN_CSR\""
pe  "openssl genrsa -out /tmp/demo-csr.key 2048"
pe  "echo \"Private key generated and stays on your system\""
p ""
p "Step 2: Create Certificate Signing Request (CSR)"
pe  "openssl req -new -key /tmp/demo-csr.key -out /tmp/demo.csr -subj \"/CN=\$CN_CSR\""
pe  "echo \"CSR created with your private key (key never leaves your system)\""
pe  "openssl req -in /tmp/demo.csr -text -noout | head -10"
p ""
p "Step 3: Send CSR to Vault for signing (/sign endpoint)"
pe  "vault write -format=json ${PKI_PATH}/sign/${PKI_ROLE} csr=@/tmp/demo.csr ttl=\"${TTL_DEMO}\" | tee /tmp/csr-signed.json"
pe  "jq -r '.data.certificate' /tmp/csr-signed.json > /tmp/demo-csr.crt"
CSR_SERIAL="$(jq -r '.data.serial_number' /tmp/csr-signed.json)"
pe  "echo \"Certificate signed by Vault CA. Serial: \$CSR_SERIAL\""
p ""
p "Step 4: Verify the signed certificate"
pe  "openssl x509 -in /tmp/demo-csr.crt -text -noout | head -15"
pe  "echo \"✅ Traditional CSR workflow complete - you control the private key!\""

section "1.6 Workflow B: Direct Certificate Issuance (/issue endpoint)"
p "Demonstrating Vault's simplified certificate issuance workflow"
p "Vault generates BOTH the private key and certificate for you"
p ""
pe  "vault write -format=json ${PKI_PATH}/issue/${PKI_ROLE} common_name=\"${CN}\" ttl=\"${TTL_DEMO}\" | tee /tmp/pki-cert-1.json"
SERIAL1="$(jq -r '.data.serial_number' /tmp/pki-cert-1.json)"
pe  "echo \"Certificate issued directly by Vault. Serial: \$SERIAL1\""
pe  "echo \"Both private key and certificate provided by Vault\""

section "1.7 Compare Both Workflows"
p "Let's examine what we received from each workflow:"
p ""
p "CSR Workflow (/sign) - You keep private key secure:"
pe  "echo \"Private Key: Stays on your system (/tmp/demo-csr.key)\""
pe  "echo \"Certificate: \$(jq -r '.data.certificate' /tmp/csr-signed.json | openssl x509 -subject -noout)\""
p ""
p "Direct Issuance (/issue) - Vault provides both:"
pe  "echo \"Private Key: \$(jq -r '.data.private_key' /tmp/pki-cert-1.json | head -1)\""
pe  "echo \"Certificate: \$(jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -subject -noout)\""

section "1.8 Show Certificate Details"
p "Extracting and displaying certificate information using OpenSSL"
pe  "echo \"Certificate Serial: \$SERIAL1\""
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -text -noout | head -20"
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -enddate -noout"

section "1.9 List Existing Certificates"
p "Showing all certificates in the PKI store"
pe  "vault list ${PKI_PATH}/certs"

section "1.10 Verify Certificate Chain"
p "Validating the certificate's issuer and chain of trust"
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -issuer -noout"
pe  "vault read ${PKI_PATH}/cert/ca | grep -A5 'certificate' | openssl x509 -subject -noout"

section "1.11 Certificate Renewal"
p "Issuing a new certificate for the same Common Name (renewal process)"
pe  "vault write -format=json ${PKI_PATH}/issue/${PKI_ROLE} common_name=\"${CN}\" ttl=\"${TTL_DEMO}\" | tee /tmp/pki-cert-2.json"
SERIAL2="$(jq -r '.data.serial_number' /tmp/pki-cert-2.json)"

section "1.12 Show New Certificate Details"
p "Displaying details of the renewed certificate"
pe  "vault read ${PKI_PATH}/cert/${SERIAL2}"

section "1.13 Check Revocation Status (Before)"
p "Checking certificate status before revocation"
pe  "vault read ${PKI_PATH}/cert/${SERIAL1} | grep -E '(revocation_time|state)'"

section "1.14 Revoke Certificate"
p "Revoking the first certificate"
pe  "vault write ${PKI_PATH}/revoke serial_number=${SERIAL1}"

section "1.15 Check Revocation Status (After)"
p "Checking certificate status after revocation"
pe  "vault read ${PKI_PATH}/cert/${SERIAL1} | grep -E '(revocation_time|state)'"

section "1.16 Certificate Revocation List (CRL)"
p "Displaying the Certificate Revocation List with revoked certificates"
pe  "curl -s -H \"X-Vault-Token: \$VAULT_TOKEN\" -H \"X-Vault-Namespace: \$VAULT_NAMESPACE\" ${CRL_URL}/pem | head -n 10"

section "1.17 Cleanup"
p "Removing temporary files created during the demo"
pe  "rm -f /tmp/pki-cert-*.json /tmp/demo-csr.key /tmp/demo.csr /tmp/demo-csr.crt /tmp/csr-signed.json"

clear
p ""
p "✅ Demo complete! Enhanced PKI certificate lifecycle demonstration finished."
p "   CN=${CN}"
p ""
p "📚 What you learned:"
p "   • Root CA creation process and verification"
p "   • PKI mount configuration and setup"
p "   • Two certificate workflows:"
p "     - Traditional CSR signing (/sign) - You keep private keys"
p "     - Direct certificate issuance (/issue) - Vault provides both"
p "   • Certificate inspection and validation"
p "   • Certificate renewal/re-issuance process"
p "   • Certificate revocation and CRL management"
p "   • Chain of trust verification"
p ""
p "🎯 Key takeaway: Vault PKI offers flexibility to support both"
p "   traditional CSR workflows AND modern automated certificate"
p "   issuance, letting you choose the right approach for your use case."
p ""
p "🔐 Security considerations:"
p "   • /sign endpoint: Private keys never leave your environment"
p "   • /issue endpoint: Convenient but requires secure key retrieval"