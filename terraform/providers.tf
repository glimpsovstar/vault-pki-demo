provider "vault" {
  address   = var.vault_addr
  token     = var.vault_token
  namespace = var.vault_namespace
}

# AWS Provider for EC2 instance management
provider "aws" {
  region = var.aws_region
}