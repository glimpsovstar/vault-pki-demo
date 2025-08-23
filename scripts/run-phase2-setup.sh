#!/bin/bash
# Phase 2 PKI Automation Demo - Execution Script
# This script runs the Phase 2 Ansible playbook for complete PKI automation
# 
# Usage:
#   ./run-phase2-setup.sh           # Run full-featured version
#   ./run-phase2-setup.sh simple    # Run simplified version

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$( dirname "$SCRIPT_DIR" )"

# Choose playbook based on argument
PLAYBOOK="playbooks/phase2-pki-automation.yml"
VERSION="Full-Featured"

if [ "$1" == "simple" ]; then
    PLAYBOOK="playbooks/phase2-simple.yml"
    VERSION="Simplified"
fi

echo "=== Vault PKI Demo - Phase 2 Setup ($VERSION) ==="
echo "Project Root: $PROJECT_ROOT"
echo "Playbook: $PLAYBOOK"
echo

# Check if Terraform has been applied
if [ ! -f "$PROJECT_ROOT/terraform/terraform.tfstate" ]; then
    echo "❌ Terraform state not found. Please run 'terraform apply' first."
    exit 1
fi

# Get EC2 public IP from Terraform output
cd "$PROJECT_ROOT/terraform"
EC2_PUBLIC_IP=$(terraform output -raw ec2_public_ip 2>/dev/null || echo "")

if [ -z "$EC2_PUBLIC_IP" ]; then
    echo "❌ Could not get EC2 public IP from Terraform output."
    echo "Please ensure Terraform has been applied successfully."
    exit 1
fi

echo "✅ EC2 Public IP: $EC2_PUBLIC_IP"

# Change to ansible directory
cd "$PROJECT_ROOT/ansible"

# Check if Ansible inventory is properly configured
if [ ! -f "inventory/hosts.yml" ]; then
    echo "❌ Ansible inventory not found at inventory/hosts.yml"
    exit 1
fi

echo "✅ Ansible inventory found"

# Run Phase 2 Ansible playbook
echo "🚀 Running Phase 2 PKI Automation playbook ($VERSION)..."
echo

ansible-playbook \
    -i inventory/hosts.yml \
    --limit ec2_instances \
    "$PLAYBOOK" \
    --extra-vars "ec2_public_ip=$EC2_PUBLIC_IP" \
    --ssh-common-args='-o StrictHostKeyChecking=no' \
    -v

echo
echo "🎉 Phase 2 PKI Automation setup complete!"
echo
echo "=== Demo URLs ==="
echo "Demo Application: https://vault-pki-demo.david-joo.sbx.hashidemos.io"
echo "PKI Role Domain:  https://role-pki-demo.david-joo.sbx.hashidemos.io"
echo
echo "=== Manual Certificate Renewal ==="
echo "SSH to the server and run: sudo /usr/local/bin/renew-ssl-cert.sh"
echo
echo "=== Check Services ==="
echo "Vault Agent Status: sudo systemctl status vault-agent"
echo "Apache Status:      sudo systemctl status httpd"
echo "Cert Watcher:       sudo systemctl status ssl-cert-watcher.path"
