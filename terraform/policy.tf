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

# SSH Admin Policy - Full access to SSH secrets engine
resource "vault_policy" "ssh_admin" {
  name = "ssh-admin"

  policy = <<EOT
# SSH Secrets Engine - Administrative Access
path "ssh/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# SSH CA configuration
path "ssh/config/ca" {
  capabilities = ["read", "update"]
}

# Manage SSH roles
path "ssh/roles/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Sign SSH certificates for all roles
path "ssh/sign/*" {
  capabilities = ["create", "update"]
}

# Generate OTP for SSH access
path "ssh/creds/*" {
  capabilities = ["create", "update"]
}

# List available roles
path "ssh/roles" {
  capabilities = ["list"]
}
EOT
}

# Ansible Automation Policy - Limited SSH access for automation
resource "vault_policy" "ansible_ssh" {
  name = "ansible-ssh"

  policy = <<EOT
# SSH access for Ansible automation
path "ssh/sign/ansible-automation" {
  capabilities = ["create", "update"]
}

# Read SSH CA public key for host verification
path "ssh/public_key" {
  capabilities = ["read"]
}

# Generate OTP if needed for fallback
path "ssh/creds/otp-role" {
  capabilities = ["create", "update"]
}
EOT
}

# VM Admin Policy - SSH access for human administrators
resource "vault_policy" "vm_admin_ssh" {
  name = "vm-admin-ssh"

  policy = <<EOT
# SSH access for VM administrators
path "ssh/sign/vm-admin" {
  capabilities = ["create", "update"]
}

# Generate OTP for emergency access
path "ssh/creds/otp-role" {
  capabilities = ["create", "update"]
}

# Read SSH CA public key
path "ssh/public_key" {
  capabilities = ["read"]
}
EOT
}

# Application-specific SSH policy (for apps that need SSH access)
resource "vault_policy" "app_ssh" {
  name = "app-ssh"

  policy = <<EOT
# Limited SSH access for applications
path "ssh/sign/ansible-automation" {
  capabilities = ["create", "update"]
}

# Read SSH CA public key
path "ssh/public_key" {
  capabilities = ["read"]
}
EOT
}

# Combined PKI + SSH policy for applications that need both
resource "vault_policy" "app_combined" {
  name = "app-combined"

  policy = <<EOT
# PKI access (from Phase 1)
path "pki/issue/webapp" {
  capabilities = ["create", "update"]
}

path "pki/issue/microservice" {
  capabilities = ["create", "update"]
}

# SSH access for automation
path "ssh/sign/ansible-automation" {
  capabilities = ["create", "update"]
}

# Read CA public keys
path "pki/ca/pem" {
  capabilities = ["read"]
}

path "ssh/public_key" {
  capabilities = ["read"]
}
EOT
}