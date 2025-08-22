# Enable AppRole (if not already)
# resource "vault_auth_backend" "approle" {
#   type = "approle"
#   path = "approle" # default
# }

# AppRole used by the CLI demo (SecretID generated at runtime)
resource "vault_approle_auth_backend_role" "pki_cli" {
  backend        = "approle"
  role_name      = "pki-cli-${var.vault_engine_name}"
  token_policies = [vault_policy.pki_operator.name]
  token_ttl      = 1800         # 30m in seconds
  token_max_ttl  = 7200         # 2h in seconds

  # Security best-practice defaults:
  secret_id_num_uses = 1
  secret_id_ttl      = 1800     # 30m in seconds
}