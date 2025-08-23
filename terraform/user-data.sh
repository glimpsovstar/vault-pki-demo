#!/bin/bash

# User data script for EC2 instance to install Vault CLI and dependencies
# This script runs on instance startup

set -e

# Update system
dnf update -y

# Install required packages
dnf install -y wget unzip curl jq openssl

# Install Vault CLI
VAULT_VERSION="1.15.2"
cd /tmp
wget "https://releases.hashicorp.com/vault/$${VAULT_VERSION}/vault_$${VAULT_VERSION}_linux_amd64.zip"
unzip "vault_$${VAULT_VERSION}_linux_amd64.zip"
mv vault /usr/local/bin/
chmod +x /usr/local/bin/vault

# Set Vault address environment variable
echo 'export VAULT_ADDR="${vault_addr}"' >> /etc/environment
echo 'export VAULT_ADDR="${vault_addr}"' >> /home/ec2-user/.bashrc

# Create vault user
useradd -m -s /bin/bash vault || true

# Copy vault auth script
cat > /home/ec2-user/vault-auth.sh << 'EOF'
#!/bin/bash

# EC2 Vault Authentication Script
# This script authenticates to Vault using AWS auth method

export VAULT_ADDR="${vault_addr}"

echo "🔐 Authenticating to Vault using AWS auth method..."

# Authenticate using EC2 instance metadata
TOKEN=$$(vault write -field=token auth/aws/login role=ec2-combined-role)

if [ $$? -eq 0 ] && [ ! -z "$$TOKEN" ]; then
    echo "✅ Authentication successful!"
    export VAULT_TOKEN="$$TOKEN"
    
    echo "🔍 Token info:"
    vault token lookup
    
    echo ""
    echo "📋 Available commands:"
    echo "  # PKI Operations"
    echo "  vault write pki/issue/demo common_name=app.demo.local ttl=24h"
    echo "  vault list pki/certs"
    echo ""
    echo "  # SSH Operations" 
    echo "  vault write ssh/sign/ansible_role public_key=@~/.ssh/id_rsa.pub"
    echo ""
    echo "  # Set environment for current session"
    echo "  export VAULT_TOKEN='$$TOKEN'"
else
    echo "❌ Authentication failed!"
    exit 1
fi
EOF

chmod +x /home/ec2-user/vault-auth.sh
chown ec2-user:ec2-user /home/ec2-user/vault-auth.sh

# Create systemd service to run auth script on boot
cat > /etc/systemd/system/vault-auth.service << 'EOF'
[Unit]
Description=Vault AWS Authentication
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=ec2-user
Environment=VAULT_ADDR=${vault_addr}
ExecStart=/home/ec2-user/vault-auth.sh
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl enable vault-auth.service

# Log completion
echo "✅ EC2 instance setup complete - Vault CLI installed and configured" > /var/log/user-data-complete.log
echo "📋 Run './vault-auth.sh' as ec2-user to authenticate to Vault" >> /var/log/user-data-complete.log
