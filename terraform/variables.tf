# AWS Region
variable "aws_region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "ap-southeast-2"
}

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

variable "cert_ttl_h" {
  description = "Default TTL for issued certificates in hours. Default is 1 year."
  type        = number
  default     = 8760
}

variable "cert_max_ttl_h" {
  description = "Maximum TTL for issued certificates in hours. Default is 72 hours."
  type        = number
  default     = 72
}

variable "ca_max_ttl_h" {
  description = "Maximum TTL for CA certificates in hours. Default is 10 years."
  type        = number
  default     = 87600  # 10 years
}

variable "pki_role_name" {
  description = "Name of the PKI role for demo certificates"
  type        = string
  default     = "demo"
}

# SSH-specific variables
variable "ssh_allowed_users" {
  description = "List of allowed SSH users for certificate signing"
  type        = list(string)
  default     = ["ubuntu", "centos", "ansible"]
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["10.0.0.0/8", "192.168.0.0/16", "172.16.0.0/12"]
}

variable "ssh_certificate_ttl" {
  description = "Default TTL for SSH certificates in seconds"
  type        = number
  default     = 3600  # 1 hour
}

variable "ssh_max_ttl" {
  description = "Maximum TTL for SSH certificates in seconds"
  type        = number
  default     = 86400  # 24 hours
}

# AWS Auth Method Variables
variable "aws_account_id" {
  description = "AWS Account ID allowed for EC2 authentication"
  type        = string
  default     = ""  # Set in terraform.auto.tfvars
}

variable "aws_allowed_regions" {
  description = "List of AWS regions allowed for EC2 authentication"
  type        = list(string)
  default     = ["us-east-1", "us-west-2", "eu-west-1"]
}

variable "aws_allowed_instance_ids" {
  description = "List of specific EC2 instance IDs allowed (empty = all instances in account/region)"
  type        = list(string)
  default     = []  # Empty = allow all instances that meet other criteria
}

variable "aws_allowed_ami_ids" {
  description = "List of AMI IDs allowed for EC2 authentication (empty = all AMIs)"
  type        = list(string)
  default     = []  # Empty = allow all AMIs
}

variable "aws_allowed_subnet_ids" {
  description = "List of subnet IDs allowed for EC2 authentication (empty = all subnets)"
  type        = list(string)
  default     = []  # Empty = allow all subnets
}

variable "aws_allowed_vpc_ids" {
  description = "List of VPC IDs allowed for EC2 authentication (empty = all VPCs)"
  type        = list(string)
  default     = []  # Empty = allow all VPCs in account
}

variable "aws_role_tag_key" {
  description = "EC2 tag key used for role-based authentication (for ASG scenarios)"
  type        = string
  default     = "VaultRole"
}

# EC2 Instance variables
variable "ec2_ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
  default     = "ami-0d699116d22d2cb59"  # RHEL9 - 2025-05-28 (ap-southeast-2)
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "aws_key_pair_name" {
  description = "AWS EC2 key pair name for SSH access"
  type        = string
  default     = "djoo-demo-ec2-keypair"
}

variable "ec2_iam_instance_profile" {
  description = "IAM instance profile for EC2 instance"
  type        = string
  default     = "tfstacks-profile"
}

# Network variables from TFC workspace outputs
variable "vpc_id" {
  description = "VPC ID from tf-aws-network-dev workspace"
  type        = string
}

variable "vpc_cidr_block" {
  description = "VPC CIDR block from tf-aws-network-dev workspace"
  type        = string
}

variable "vpc_public_subnets" {
  description = "Public subnets from tf-aws-network-dev workspace"
  type        = list(string)
}

variable "vpc_private_subnets" {
  description = "Private subnets from tf-aws-network-dev workspace"
  type        = list(string)
}

variable "security_group_ssh_http_https_allowed" {
  description = "Security group ID from tf-aws-network-dev workspace"
  type        = string
}

# Common tags
variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Terraform   = "true"
    Environment = "Demo"
    Owner       = "djoo"
    Project     = "vault-pki-demo"
  }
}
