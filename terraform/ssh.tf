# SSH Secrets Engine Configuration
# This provides SSH key management for VM automation scenarios

# Enable the SSH secrets engine at ssh/
resource "vault_mount" "ssh" {
  path        = "ssh"
  type        = "ssh"
  description = "SSH secrets engine for VM automation"
}

# Configure SSH CA (Certificate Authority) for key signing
resource "vault_ssh_secret_backend_ca" "ssh_ca" {
  backend              = vault_mount.ssh.path
  generate_signing_key = true
}

# VM Admin Role - For administrators to manage VMs directly
resource "vault_ssh_secret_backend_role" "vm_admin" {
  name                    = "vm-admin"
  backend                 = vault_mount.ssh.path
  key_type                = "ca"
  allow_user_certificates = true
  allowed_users           = "ubuntu,centos,root"
  default_user            = "ubuntu"

  # Certificate validity period
  ttl     = "3600"  # 1 hour
  max_ttl = "86400" # 24 hours max

  # Allowed principals (users who can use this role)
  allowed_extensions = "permit-pty,permit-port-forwarding"

  # SSH certificate templates
  algorithm_signer = "rsa-sha2-256"

  # Key usage constraints
  allow_subdomains        = false
  allow_host_certificates = false

  # Additional security constraints
  allowed_critical_options = ""
  default_critical_options = {
    force_command  = ""
    source_address = ""
  }
}

# Ansible Automation Role - For Ansible to manage VMs via SSH
resource "vault_ssh_secret_backend_role" "ansible_automation" {
  name                    = "ansible-automation"
  backend                 = vault_mount.ssh.path
  key_type                = "ca"
  allow_user_certificates = true
  allowed_users           = "ansible,ubuntu,centos"
  default_user            = "ansible"

  # Shorter validity for automation - security best practice
  ttl     = "1800" # 30 minutes
  max_ttl = "3600" # 1 hour max

  # Restrictive permissions for automation
  allowed_extensions = "permit-pty" # No port forwarding for automation

  # SSH certificate templates
  algorithm_signer = "rsa-sha2-256"

  # Automation-specific constraints
  allow_subdomains        = false
  allow_host_certificates = false

  # Force command for security (optional)
  default_critical_options = {
    force_command  = "" # Can be restricted to specific commands
    source_address = "" # Can restrict source IPs
  }
}

# OTP (One-Time Password) Role for temporary access
resource "vault_ssh_secret_backend_role" "otp_role" {
  name         = "otp-role"
  backend      = vault_mount.ssh.path
  key_type     = "otp"
  default_user = "ubuntu"
  cidr_list    = "10.0.0.0/8,192.168.0.0/16" # Restrict to private networks

  # OTP specific settings
  allowed_users = "ubuntu,centos"

  # Key usage constraints for OTP
  ttl     = "300" # 5 minutes - very short for security
  max_ttl = "600" # 10 minutes max
}
