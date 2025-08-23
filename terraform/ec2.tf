# EC2 Instance for Vault PKI Demo
# Uses outputs from TFC djoo-hashicorp/tf-aws-network-dev workspace

resource "aws_instance" "vault_pki_demo" {
  ami           = var.ec2_ami_id
  instance_type = var.ec2_instance_type
  subnet_id     = var.vpc_public_subnets[0]  # Use first public subnet
  key_name      = var.aws_key_pair_name

  # Use security group from network workspace
  vpc_security_group_ids = [var.security_group_ssh_http_https_allowed]

  # IAM instance profile for AWS auth
  iam_instance_profile = var.ec2_iam_instance_profile

  # Ensure instance gets a public IP automatically
  associate_public_ip_address = true

  # User data to install Vault CLI and dependencies
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    vault_addr = var.vault_addr
  }))

  tags = merge(var.common_tags, {
    Name        = "djoo-vault-pki-demo1"
    Purpose     = "Vault PKI Demo Instance"
    Environment = "Demo"
    Owner       = "djoo"
    Terraform   = "true"
    Project     = "vault-pki-demo"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Ensure instance is running
resource "aws_ec2_instance_state" "vault_pki_demo_state" {
  instance_id = aws_instance.vault_pki_demo.id
  state       = "running"
}
