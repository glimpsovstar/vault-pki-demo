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

pe "vault token lookup"

# --- demo vars ---
CN_BASE="${CN_BASE:-app}"
DOMAIN_DEMO="${DOMAIN_DEMO:-$COMMON_DOMAIN}"        # from TF output; override via env if needed
TTL_DEMO="${TTL_DEMO:-5m}"
CN="${CN_BASE}.$(date +%s).${DOMAIN_DEMO}"

p ""
p "## 1.1 Show PKI mount (configured via Terraform)"
pei "vault secrets list | grep -E \"\\b$PKI_PATH\\b\" || true"
pe  "vault read sys/mounts/${PKI_PATH} | sed -n '1,40p'"

p ""
p "## 1.2 Show Root CA Certificate (created via Terraform)"
pe  "vault read ${PKI_PATH}/cert/ca"
pe  "vault read ${PKI_PATH}/config/ca | grep -E '(certificate|issuer)'"

p ""
p "## 1.3 Show PKI Role Configuration"
pe  "vault read ${PKI_PATH}/roles/${PKI_ROLE}"

p ""
p "## 1.4 Issue a certificate (CN=${CN}, ttl=${TTL_DEMO})"
p "Note: Vault generates both CSR and certificate internally for this simple flow"
pe  "vault write -format=json ${PKI_PATH}/issue/${PKI_ROLE} common_name=\"${CN}\" ttl=\"${TTL_DEMO}\" | tee /tmp/pki-cert-1.json"
SERIAL1="$(jq -r '.data.serial_number' /tmp/pki-cert-1.json)"

p ""
p "## 1.5 Show certificate details and expiration"
pe  "echo \"Certificate Serial: \$SERIAL1\""
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -text -noout | head -20"
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -enddate -noout"

p ""
p "## 1.6 List existing certs"
pe  "vault list ${PKI_PATH}/certs"

p ""
p "## 1.7 Verify certificate chain"
pe  "jq -r '.data.certificate' /tmp/pki-cert-1.json | openssl x509 -issuer -noout"
pe  "vault read ${PKI_PATH}/cert/ca | grep -A5 'certificate' | openssl x509 -subject -noout"

p ""
p "## 1.8 'Renew' by re-issuing a new cert for the same CN"
pe  "vault write -format=json ${PKI_PATH}/issue/${PKI_ROLE} common_name=\"${CN}\" ttl=\"${TTL_DEMO}\" | tee /tmp/pki-cert-2.json"
SERIAL2="$(jq -r '.data.serial_number' /tmp/pki-cert-2.json)"

p ""
p "## 1.9 Show details of the new certificate"
pe  "vault read ${PKI_PATH}/cert/${SERIAL2}"

p ""
p "## 1.10 Check revocation status BEFORE revoke"
pe  "vault read ${PKI_PATH}/cert/${SERIAL1} | grep -E '(revocation_time|state)'"

p ""
p "## 1.11 Revoke the first certificate"
pe  "vault write ${PKI_PATH}/revoke serial_number=${SERIAL1}"

p ""
p "## 1.12 Check revocation status AFTER revoke"
pe  "vault read ${PKI_PATH}/cert/${SERIAL1} | grep -E '(revocation_time|state)'"

p ""
p "## 1.13 (Optional) Generate CSR and sign it with Vault"
p "This shows the traditional CSR -> Certificate signing process"
pe  "openssl genrsa -out /tmp/demo.key 2048"
pe  "openssl req -new -key /tmp/demo.key -out /tmp/demo.csr -subj \"/CN=csr.${CN}\""
pe  "vault write -format=json ${PKI_PATH}/sign/${PKI_ROLE} csr=@/tmp/demo.csr | jq -r '.data.certificate' > /tmp/demo.crt"
pe  "openssl x509 -in /tmp/demo.crt -text -noout | head -10"

p ""
p "## 1.14 (Optional) Peek at the CRL (Certificate Revocation List)"
pe  "curl -s -H \"X-Vault-Token: \$VAULT_TOKEN\" -H \"X-Vault-Namespace: \$VAULT_NAMESPACE\" ${CRL_URL}/pem | head -n 10"

p ""
p "## 1.15 Clean up temporary files"
pe  "rm -f /tmp/pki-cert-*.json /tmp/demo.key /tmp/demo.csr /tmp/demo.crt"

p ""
p "✅ Demo complete. CN=${CN}"