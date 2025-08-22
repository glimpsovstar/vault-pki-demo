provider "vault" {
  address   = var.vault_addr
  token     = var.vault_token
  namespace = var.vault_namespace
}