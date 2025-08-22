variable "vault_addr" {
	description = "The address of the Vault server (e.g. https://vault-cluster-public-....hcp.hashicorp.cloud:8200)"
	type        = string
}

variable "vault_token" {
	description = "The Vault token used for authentication. Sensitive."
	type        = string
	sensitive   = true
}

variable "vault_namespace" {
	description = "The Vault namespace to use. Leave empty for root namespace."
	type        = string
	default     = ""
}

variable "vault_engine_name" {
	description = "The name of the Vault PKI engine mount."
	type        = string
	default     = "pki-demo"
}

# Demo knobs
variable "common_domain" {
	description = "The common domain for demo certificates."
	type        = string
	default     = "demo.local"
}

variable "pki_role_name" {
	description = "The name of the PKI role to create."
	type        = string
	default     = "demo"
}

variable "ca_max_ttl_h" {
	description = "Maximum TTL for the CA certificate in hours. Default is 1 year."
	type        = number
	default     = 8760
}

variable "cert_max_ttl_h" {
	description = "Maximum TTL for issued certificates in hours. Default is 72 hours."
	type        = number
	default     = 72
}