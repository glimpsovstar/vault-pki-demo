# EC2 Instance for Vault PKI Demo
# Uses outputs from TFC djoo-hashicorp/tf-aws-network-dev workspace

resource "aws_instance" "vault_pki_demo" {
  ami           = var.ec2_ami_id
  instance_type = var.ec2_instance_type
  subnet_id     = var.vpc_public_subnets[0] # Use first public subnet
  key_name      = var.aws_key_pair_name

  # Use security group from network workspace
  vpc_security_group_ids = [var.security_group_ssh_http_https_allowed]

  # IAM instance profile for AWS auth
  iam_instance_profile = var.ec2_iam_instance_profile

  # Ensure instance gets a public IP automatically
  associate_public_ip_address = true

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

  # Wait for SSH to be available before running Ansible
  provisioner "remote-exec" {
    inline = [
      "echo 'SSH connection established - ready for Ansible'",
      "sudo dnf update -y",
      "echo 'Basic system update complete'"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/djoo-personal-aws-ec2-key.pem")
      host        = self.public_ip
      timeout     = "5m"
    }
  }

  # Run Ansible playbook to configure the instance
  provisioner "local-exec" {
    command = "sleep 30 && ansible-playbook -i ../ansible/inventory/hosts.yml ../ansible/playbooks/ec2-setup.yml --extra-vars 'ec2_public_ip=${self.public_ip} vault_addr=${var.vault_addr}' --ssh-common-args='-o StrictHostKeyChecking=no'"
  }
}

# Ensure instance is running
resource "aws_ec2_instance_state" "vault_pki_demo_state" {
  instance_id = aws_instance.vault_pki_demo.id
  state       = "running"

  depends_on = [aws_instance.vault_pki_demo]
}

# Route53 DNS Configuration for Demo Domain
data "aws_route53_zone" "demo_zone" {
  name = var.common_domain
}

# A record for the demo hostname
resource "aws_route53_record" "vault_pki_demo" {
  zone_id = data.aws_route53_zone.demo_zone.zone_id
  name    = "vault-pki-demo.${var.common_domain}"
  type    = "A"
  ttl     = 300
  records = [aws_instance.vault_pki_demo.public_ip]

  depends_on = [aws_instance.vault_pki_demo]
}

# Additional A record for PKI role domain
resource "aws_route53_record" "pki_role_domain" {
  zone_id = data.aws_route53_zone.demo_zone.zone_id
  name    = "${var.pki_role_name}.${var.common_domain}"
  type    = "A"
  ttl     = 300
  records = [aws_instance.vault_pki_demo.public_ip]

  depends_on = [aws_instance.vault_pki_demo]
}
