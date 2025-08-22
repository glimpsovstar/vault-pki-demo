# Enable AppRole (if not already)
resource "vault_auth_backend" "approle" {
  type = "approle"
  path = "approle" # default
}

# AppRole used by the CLI demo (SecretID generated at runtime)
resource "vault_approle_auth_backend_role" "pki_cli" {
  backend        = vault_auth_backend.approle.path
  role_name      = "pki-cli-${var.vault_engine_name}"
  token_policies = [vault_policy.pki_operator.name]
  token_ttl      = "30m"
  token_max_ttl  = "2h"

  # Security best-practice defaults:
  secret_id_num_uses = 1
  secret_id_ttl      = "30m"
}