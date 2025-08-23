# AWS Auth Method Configuration
# This allows EC2 instances to authenticate to Vault using their instance metadata

# Enable AWS auth method
resource "vault_auth_backend" "aws" {
  type = "aws"
  path = "aws"
  description = "AWS auth method for EC2 instance authentication"
}

# AWS auth role for EC2 instances - PKI access
resource "vault_aws_auth_backend_role" "ec2_pki_role" {
  backend                         = vault_auth_backend.aws.path
  role                           = "ec2-pki-role"
  auth_type                      = "ec2"
  token_policies                 = [vault_policy.pki_operator.name]
  token_ttl                      = 1800  # 30 minutes
  token_max_ttl                  = 7200  # 2 hours
  
  # Leave unconstrained initially - can be tightened in production
  resolve_aws_unique_ids         = true
  allow_instance_migration       = false
}

# AWS auth role for EC2 instances - SSH access  
resource "vault_aws_auth_backend_role" "ec2_ssh_role" {
  backend                         = vault_auth_backend.aws.path
  role                           = "ec2-ssh-role" 
  auth_type                      = "ec2"
  token_policies                 = [vault_policy.ansible_ssh.name]
  token_ttl                      = 1800  # 30 minutes
  token_max_ttl                  = 7200  # 2 hours
  
  # Leave unconstrained initially - can be tightened in production
  resolve_aws_unique_ids         = true
  allow_instance_migration       = false
}

# AWS auth role for EC2 instances - Combined PKI + SSH access
resource "vault_aws_auth_backend_role" "ec2_combined_role" {
  backend                         = vault_auth_backend.aws.path
  role                           = "ec2-combined-role"
  auth_type                      = "ec2"
  token_policies                 = [vault_policy.app_combined.name]
  token_ttl                      = 3600  # 1 hour for combined access
  token_max_ttl                  = 14400 # 4 hours max
  
  # Leave unconstrained initially - can be tightened in production
  resolve_aws_unique_ids         = true 
  allow_instance_migration       = false
}
