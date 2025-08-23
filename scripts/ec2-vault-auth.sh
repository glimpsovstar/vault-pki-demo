#!/bin/bash
# EC2 Instance Authentication Script for Vault
# Run this script from an EC2 instance to authenticate to Vault using AWS auth method

set -e

# Configuration - modify these for your environment
VAULT_ADDR="${VAULT_ADDR:-http://your-vault-server:8200}"
AWS_AUTH_ROLE="${AWS_AUTH_ROLE:-ec2-pki-role}"  # or ec2-ssh-role, ec2-combined-role

echo "🔐 Authenticating EC2 instance to Vault..."
echo "Vault Address: $VAULT_ADDR"
echo "AWS Auth Role: $AWS_AUTH_ROLE"

# Authenticate using AWS auth method
echo "📡 Requesting Vault token using EC2 instance metadata..."
VAULT_TOKEN=$(vault write -field=token auth/aws/login role=$AWS_AUTH_ROLE)

if [ -z "$VAULT_TOKEN" ]; then
    echo "❌ Failed to obtain Vault token"
    exit 1
fi

echo "✅ Successfully obtained Vault token!"

# Export token for subsequent vault commands
export VAULT_TOKEN

# Verify authentication
echo "🔍 Verifying token..."
vault token lookup

echo ""
echo "🎯 Available Actions:"
case $AWS_AUTH_ROLE in
    "ec2-pki-role")
        echo "✅ PKI Certificate Operations:"
        echo "   vault write pki/issue/demo common_name=my-app.demo.local ttl=24h"
        ;;
    "ec2-ssh-role") 
        echo "✅ SSH Certificate Operations:"
        echo "   vault write ssh/sign/vm-admin public_key=@~/.ssh/id_rsa.pub"
        ;;
    "ec2-combined-role")
        echo "✅ PKI Certificate Operations:"
        echo "   vault write pki/issue/demo common_name=my-app.demo.local ttl=24h"
        echo "✅ SSH Certificate Operations:"
        echo "   vault write ssh/sign/ansible-automation public_key=@~/.ssh/id_rsa.pub"
        ;;
esac

echo ""
echo "🔧 Token Details:"
echo "Token: $VAULT_TOKEN"
echo "Export command: export VAULT_TOKEN=$VAULT_TOKEN"
echo ""
echo "ℹ️  Token will expire automatically based on role configuration"
echo "ℹ️  No permanent credentials stored on this instance"
