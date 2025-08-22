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

section "1.2 Show Root CA Certificate (created via Terraform)"
p "Displaying the root Certificate Authority certificate and URLs"
pe  "vault read ${PKI_PATH}/cert/ca"
pe  "vault read ${PKI_PATH}/config/urls | grep -E '(issuing_certificates|crl_distribution)'"

section "1.3 Show PKI Role Configuration"
p "Displaying the PKI role settings for certificate issuance"
pe  "vault read ${PKI_PATH}/roles/${PKI_ROLE}"

section "1.4 Issue a Certificate"
p "Issuing a new certificate (CN=${CN}, ttl=${TTL_DEMO})"
p "Note: Vault generates both CSR and certificate internally for this simple flow"
pe  "vault write -format=json ${PKI_PATH}/issue/${PKI_ROLE} common_name=\"${CN}\" ttl=\"${TTL_DEMO}\" | tee /tmp/pki-cert-1.json"
SERIAL1="$(jq -r '.data.serial_number' /tmp/pki-cert-1.json)"

section "1.5 Show Certificate Details and Expiration"
p "Extracting and displaying certificate information using OpenSSL"
pe  "echo \"Certificate Serial: \$SERIAL1\""
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -text -noout | head -20"
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -enddate -noout"

section "1.6 List Existing Certificates"
p "Showing all certificates in the PKI store"
pe  "vault list ${PKI_PATH}/certs"

section "1.7 Verify Certificate Chain"
p "Validating the certificate's issuer and chain of trust"
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -issuer -noout"
pe  "vault read ${PKI_PATH}/cert/ca | grep -A5 'certificate' | openssl x509 -subject -noout"

section "1.8 Certificate Renewal (Re-issuance)"
p "Issuing a new certificate for the same Common Name (renewal process)"
pe  "vault write -format=json ${PKI_PATH}/issue/${PKI_ROLE} common_name=\"${CN}\" ttl=\"${TTL_DEMO}\" | tee /tmp/pki-cert-2.json"
SERIAL2="$(jq -r '.data.serial_number' /tmp/pki-cert-2.json)"

section "1.9 Show New Certificate Details"
p "Displaying details of the renewed certificate"
pe  "vault read ${PKI_PATH}/cert/${SERIAL2}"

section "1.10 Check Revocation Status BEFORE Revoke"
p "Checking certificate status before revocation"
pe  "vault read ${PKI_PATH}/cert/${SERIAL1} | grep -E '(revocation_time|state)'"

section "1.11 Revoke Certificate"
p "Revoking the first certificate"
pe  "vault write ${PKI_PATH}/revoke serial_number=${SERIAL1}"

section "1.12 Check Revocation Status AFTER Revoke"
p "Checking certificate status after revocation"
pe  "vault read ${PKI_PATH}/cert/${SERIAL1} | grep -E '(revocation_time|state)'"

section "1.13 Generate CSR and Sign with Vault (Optional)"
p "Demonstrating traditional CSR-based certificate flow"
p "This shows the manual key generation and CSR signing process"
pe  "openssl genrsa -out /tmp/demo.key 2048"
pe  "openssl req -new -key /tmp/demo.key -out /tmp/demo.csr -subj \"/CN=csr.${CN}\""
pe  "vault write -format=json ${PKI_PATH}/sign/${PKI_ROLE} csr=@/tmp/demo.csr | jq -r '.data.certificate' > /tmp/demo.crt"
pe  "openssl x509 -in /tmp/demo.crt -text -noout | head -10"

section "1.14 Certificate Revocation List (CRL)"
p "Displaying the Certificate Revocation List with revoked certificates"
pe  "curl -s -H \"X-Vault-Token: \$VAULT_TOKEN\" -H \"X-Vault-Namespace: \$VAULT_NAMESPACE\" ${CRL_URL}/pem | head -n 10"

section "1.15 Cleanup"
p "Removing temporary files created during the demo"
pe  "rm -f /tmp/pki-cert-*.json /tmp/demo.key /tmp/demo.csr /tmp/demo.crt"

clear
p ""
p "✅ Demo complete! Certificate lifecycle demonstration finished."
p "   CN=${CN}"
p ""
p "📚 What you learned:"
p "   • Root CA and PKI mount configuration"
p "   • Certificate issuance (direct and CSR-based)"
p "   • Certificate inspection and validation"  
p "   • Certificate renewal/re-issuance process"
p "   • Certificate revocation and CRL management"
p "   • Chain of trust verification"