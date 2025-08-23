output "vault_addr" {
  description = "The address of the Vault server."
  value       = var.vault_addr
}

output "vault_token" {
  description = "The Vault token used for authentication."
  value       = var.vault_token
  sensitive   = true
}

output "vault_namespace" {
  description = "The Vault namespace used."
  value       = var.vault_namespace
}

output "pki_path" {
  description = "The path where the PKI engine is mounted."
  value       = vault_mount.pki.path
}

output "pki_role_name" {
  description = "The name of the PKI role created."
  value       = vault_pki_secret_backend_role.demo.name
}

output "approle_name" {
  description = "The name of the AppRole used for PKI CLI."
  value       = vault_approle_auth_backend_role.pki_cli.role_name
}

# SSH Secrets Engine Outputs
output "ssh_mount_path" {
  description = "Path where SSH secrets engine is mounted"
  value       = vault_mount.ssh.path
}

output "ssh_ca_public_key" {
  description = "SSH CA public key for host verification"
  value       = vault_ssh_secret_backend_ca.ssh_ca.public_key
  sensitive   = false
}

output "ssh_roles" {
  description = "Available SSH roles for different use cases"
  value = {
    vm_admin           = vault_ssh_secret_backend_role.vm_admin.name
    ansible_automation = vault_ssh_secret_backend_role.ansible_automation.name
    otp_role           = vault_ssh_secret_backend_role.otp_role.name
    dynamic_key        = vault_ssh_secret_backend_role.dynamic_key.name
  }
}

output "ssh_endpoints" {
  description = "SSH secrets engine endpoints for different operations"
  value = {
    sign_vm_admin       = "${vault_mount.ssh.path}/sign/${vault_ssh_secret_backend_role.vm_admin.name}"
    sign_ansible        = "${vault_mount.ssh.path}/sign/${vault_ssh_secret_backend_role.ansible_automation.name}"
    otp_credentials     = "${vault_mount.ssh.path}/creds/${vault_ssh_secret_backend_role.otp_role.name}"
    dynamic_credentials = "${vault_mount.ssh.path}/creds/${vault_ssh_secret_backend_role.dynamic_key.name}"
    ca_public_key       = "${vault_mount.ssh.path}/public_key"
  }
}

output "ssh_approles" {
  description = "AppRole information for SSH authentication"
  value = {
    ansible = {
      role_name = vault_approle_auth_backend_role.ansible.role_name
      policies  = vault_approle_auth_backend_role.ansible.token_policies
    }
    vm_admin = {
      role_name = vault_approle_auth_backend_role.vm_admin.role_name
      policies  = vault_approle_auth_backend_role.vm_admin.token_policies
    }
  }
}

output "issuing_certs_url" {
  description = "URL for issuing certificates."
  value       = vault_pki_secret_backend_config_urls.urls.issuing_certificates
}

output "crl_url" {
  description = "URL for the CRL distribution points."
  value       = vault_pki_secret_backend_config_urls.urls.crl_distribution_points
}

output "common_domain" {
  description = "The common domain configured for certificate issuance."
  value       = var.common_domain
}

# AWS Auth Method Outputs
output "aws_auth_path" {
  description = "Path where AWS auth method is mounted"
  value       = vault_auth_backend.aws.path
}

output "aws_auth_roles" {
  description = "AWS auth roles for EC2 instance authentication"
  value = {
    ec2_pki_role      = vault_aws_auth_backend_role.ec2_pki_role.role
    ec2_ssh_role      = vault_aws_auth_backend_role.ec2_ssh_role.role
    ec2_combined_role = vault_aws_auth_backend_role.ec2_combined_role.role
  }
}

output "aws_auth_endpoints" {
  description = "AWS auth method endpoints for EC2 authentication"
  value = {
    login_pki      = "${vault_auth_backend.aws.path}/login"
    login_ssh      = "${vault_auth_backend.aws.path}/login"
    login_combined = "${vault_auth_backend.aws.path}/login"
    login_asg      = "${vault_auth_backend.aws.path}/login"
  }
}

output "aws_usage_examples" {
  description = "Example commands for EC2 instance authentication"
  value = {
    login_with_role = "vault write auth/${vault_auth_backend.aws.path}/login role=ec2-pki-role"
    get_token       = "vault write -field=token auth/${vault_auth_backend.aws.path}/login role=ec2-pki-role"
    note            = "Run these commands from an EC2 instance with proper IAM permissions"
  }
}