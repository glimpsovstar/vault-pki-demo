#!/bin/bash

# Ansible EC2 Setup Script
# This script runs the Ansible playbook to configure EC2 instances

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TERRAFORM_DIR="$ROOT_DIR/terraform"

# Check if terraform output is available
if [ ! -f "$TERRAFORM_DIR/terraform.tfstate" ]; then
    echo "❌ Terraform state not found. Please run 'terraform apply' first."
    exit 1
fi

# Get EC2 public IP from Terraform
EC2_PUBLIC_IP=$(terraform -chdir="$TERRAFORM_DIR" output -raw ec2_public_ip 2>/dev/null || echo "")
VAULT_ADDR=$(terraform -chdir="$TERRAFORM_DIR" output -raw vault_addr 2>/dev/null || echo "")

if [ -z "$EC2_PUBLIC_IP" ]; then
    echo "❌ Could not get EC2 public IP from Terraform output"
    exit 1
fi

if [ -z "$VAULT_ADDR" ]; then
    echo "❌ Could not get Vault address from Terraform output"
    exit 1
fi

echo "🚀 Running Ansible playbook to configure EC2 instance..."
echo "📍 EC2 Instance: $EC2_PUBLIC_IP"
echo "🔐 Vault Server: $VAULT_ADDR"
echo ""

# Change to ansible directory
cd "$SCRIPT_DIR"

# Check if Ansible is installed
if ! command -v ansible-playbook &> /dev/null; then
    echo "❌ Ansible is not installed. Please install Ansible first:"
    echo "   brew install ansible  # macOS"
    echo "   pip install ansible   # pip"
    exit 1
fi

# Run the playbook
ansible-playbook \
    -i inventory/hosts.yml \
    playbooks/ec2-setup.yml \
    --extra-vars "ec2_public_ip=$EC2_PUBLIC_IP vault_addr=$VAULT_ADDR" \
    --ssh-common-args='-o StrictHostKeyChecking=no' \
    -v

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Ansible playbook completed successfully!"
    echo "🔗 You can now SSH to the instance:"
    echo "   ssh -i ~/.ssh/djoo-personal-aws-ec2-key.pem ec2-user@$EC2_PUBLIC_IP"
    echo ""
    echo "📋 Run './vault-auth.sh' on the instance to authenticate with Vault"
else
    echo "❌ Ansible playbook failed!"
    exit 1
fi
