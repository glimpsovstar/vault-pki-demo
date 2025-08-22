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