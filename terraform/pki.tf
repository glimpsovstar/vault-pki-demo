# Mount PKI at pki-demo (or var)
resource "vault_mount" "pki" {
  path                  = var.vault_engine_name
  type                  = "pki"
  max_lease_ttl_seconds = var.ca_max_ttl_h * 3600
  description           = "Demo PKI mount for ${var.vault_engine_name}"
}

# Generate an internal root (demo simplicity)
resource "vault_pki_secret_backend_root_cert" "root" {
  backend     = vault_mount.pki.path
  type        = "internal"
  common_name = "Demo Root CA (${var.vault_engine_name})"
  ttl         = "${var.ca_max_ttl_h}h"
}

# Set issuing certs/CRL URLs so revocation is demonstrable
resource "vault_pki_secret_backend_config_urls" "urls" {
  backend                 = vault_mount.pki.path
  issuing_certificates    = ["${var.vault_addr}/v1/${vault_mount.pki.path}/ca"]
  crl_distribution_points = ["${var.vault_addr}/v1/${vault_mount.pki.path}/crl"]
}

# Role for issuing leaf certs
resource "vault_pki_secret_backend_role" "demo" {
  backend           = vault_mount.pki.path
  name              = var.pki_role_name
  allowed_domains   = [var.common_domain]
  allow_subdomains  = true
  key_type          = "rsa"
  key_bits          = 2048
  max_ttl           = "${var.cert_max_ttl_h}h"
  require_cn        = true
}