#!/bin/bash
# Vault SSH Certificate Helper Script
# This script demonstrates how to obtain and use SSH certificates from Vault

set -e

# Configuration
VAULT_ADDR="${VAULT_ADDR:-https://djoo-test-vault-public-vault-a40e8748.a3bc1cae.z1.hashicorp.cloud:8200}"
VAULT_NAMESPACE="${VAULT_NAMESPACE:-admin}"
VAULT_TOKEN="${VAULT_TOKEN:-hvs.CAESIFLBGfvAdMglxFL8sufAOdcAQqWYzVOxA2De04Pdov-nGikKImh2cy4wOVJIUzJoOHRSMWw4bWtNZERIQ05GOGsuZEJ0dVAQ_oikEA}"
SSH_ENGINE_PATH="${SSH_ENGINE_PATH:-ssh-client-signer}"
SSH_ROLE="${SSH_ROLE:-ansible-automation}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/vault-ssh-key}"
SSH_CERT_PATH="${SSH_CERT_PATH:-$HOME/.ssh/vault-ssh-key-cert.pub}"
TTL="${TTL:-1h}"

echo "=== Vault SSH Certificate Setup ==="
echo "Vault Address: $VAULT_ADDR"
echo "SSH Engine Path: $SSH_ENGINE_PATH"
echo "SSH Role: $SSH_ROLE"
echo "Key Path: $SSH_KEY_PATH"
echo "Certificate Path: $SSH_CERT_PATH"
echo

# Ensure SSH directory exists
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Generate SSH key pair if it doesn't exist
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "Generating SSH key pair..."
    ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N '' -C "vault-ssh-$(date +%s)"
    chmod 600 "$SSH_KEY_PATH"
    echo "SSH key pair generated successfully."
else
    echo "SSH key pair already exists at $SSH_KEY_PATH"
fi

# Read the public key
if [ ! -f "${SSH_KEY_PATH}.pub" ]; then
    echo "Error: Public key file ${SSH_KEY_PATH}.pub not found!"
    exit 1
fi

PUBLIC_KEY=$(cat "${SSH_KEY_PATH}.pub")
echo "Public key: $PUBLIC_KEY"
echo

# Sign the public key with Vault
echo "Signing public key with Vault..."
VAULT_RESPONSE=$(curl -s \
    -H "X-Vault-Token: $VAULT_TOKEN" \
    -H "X-Vault-Namespace: $VAULT_NAMESPACE" \
    -H "Content-Type: application/json" \
    -d "{\"public_key\":\"$PUBLIC_KEY\",\"ttl\":\"$TTL\",\"valid_principals\":\"ansible-automation,ec2-user\"}" \
    "$VAULT_ADDR/v1/$SSH_ENGINE_PATH/sign/$SSH_ROLE")

# Check if the request was successful
if echo "$VAULT_RESPONSE" | jq -e '.errors' > /dev/null 2>&1; then
    echo "Error from Vault:"
    echo "$VAULT_RESPONSE" | jq -r '.errors[]'
    exit 1
fi

# Extract the signed certificate
SIGNED_CERT=$(echo "$VAULT_RESPONSE" | jq -r '.data.signed_key')
SERIAL_NUMBER=$(echo "$VAULT_RESPONSE" | jq -r '.data.serial_number // "unknown"')
VALID_PRINCIPALS=$(echo "$VAULT_RESPONSE" | jq -r '.data.valid_principals // "unknown"')

if [ "$SIGNED_CERT" = "null" ]; then
    echo "Error: Failed to get signed certificate from Vault"
    echo "Response: $VAULT_RESPONSE"
    exit 1
fi

# Save the signed certificate
echo "$SIGNED_CERT" > "$SSH_CERT_PATH"
chmod 644 "$SSH_CERT_PATH"

echo "SSH certificate created successfully!"
echo "Serial Number: $SERIAL_NUMBER"
echo "Valid Principals: $VALID_PRINCIPALS"
echo "Certificate saved to: $SSH_CERT_PATH"
echo

# Display certificate details
echo "Certificate details:"
ssh-keygen -L -f "$SSH_CERT_PATH"
echo

# Show usage examples
echo "=== Usage Examples ==="
echo "To connect to a server using the certificate:"
echo "ssh -i $SSH_KEY_PATH -o CertificateFile=$SSH_CERT_PATH user@hostname"
echo
echo "To use with Ansible, the inventory is already configured."
echo "Run: ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/your-playbook.yml"
echo
echo "To test the certificate expiration:"
echo "ssh-keygen -L -f $SSH_CERT_PATH | grep 'Valid:'"
