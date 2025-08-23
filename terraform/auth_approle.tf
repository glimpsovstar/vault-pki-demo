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
  token_ttl      = 1800 # 30m in seconds
  token_max_ttl  = 7200 # 2h in seconds

  # Security best-practice defaults:
  secret_id_num_uses = 1
  secret_id_ttl      = 1800 # 30m in seconds
}

# Ansible AppRole - combines SSH and PKI capabilities
resource "vault_approle_auth_backend_role" "ansible" {
  backend        = "approle"
  role_name      = "ansible"
  token_policies = [vault_policy.ansible_ssh.name, vault_policy.app_combined.name]

  # Ansible-specific token settings
  token_ttl     = 1800 # 30 minutes
  token_max_ttl = 3600 # 1 hour

  # Security settings for automation
  bind_secret_id = true
  secret_id_ttl  = 86400 # 24 hours for secret ID

  # Allow multiple tokens for parallel Ansible jobs
  token_num_uses = 0 # Unlimited uses

  # Restrict to specific CIDR blocks (configure as needed)
  secret_id_bound_cidrs = ["10.0.0.0/8", "192.168.0.0/16"]
  token_bound_cidrs     = ["10.0.0.0/8", "192.168.0.0/16"]
}

# VM Admin AppRole for human administrators
resource "vault_approle_auth_backend_role" "vm_admin" {
  backend        = "approle"
  role_name      = "vm-admin"
  token_policies = [vault_policy.vm_admin_ssh.name, vault_policy.pki_operator.name]

  # Human administrator token settings (longer TTL)
  token_ttl     = 3600  # 1 hour
  token_max_ttl = 28800 # 8 hours

  # Security settings
  bind_secret_id = true
  secret_id_ttl  = 86400 # 24 hours

  # Limited token uses for security
  token_num_uses = 100 # Reasonable limit for human use
}