# Policy granting just what the TUI needs on this PKI
resource "vault_policy" "pki_operator" {
  name = "pki-operator-${var.vault_engine_name}"

  policy = <<-EOT
path "${var.vault_engine_name}/issue/${var.pki_role_name}" {
  capabilities = ["create", "update", "read"]
}

path "${var.vault_engine_name}/certs" {
  capabilities = ["list"]
}

path "${var.vault_engine_name}/cert/*" {
  capabilities = ["read"]
}

path "${var.vault_engine_name}/revoke" {
  capabilities = ["create", "update"]
}

# Allow standard token introspection
path "auth/token/lookup-self" {
  capabilities = ["read"]
}
EOT
}