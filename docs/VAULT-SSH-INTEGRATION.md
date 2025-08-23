# Vault SSH Engine Integration with Ansible

This guide demonstrates how to integrate HashiCorp Vault's SSH engine with Ansible for certificate-based SSH authentication in infrastructure automation.

## Overview

The Vault SSH engine allows you to use Vault as an SSH Certificate Authority (CA). Instead of managing SSH keys manually, Vault can sign your public keys with short-lived certificates, providing better security and auditability.

## Architecture

```text
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Ansible   │───▶│    Vault    │───▶│  Target     │
│  Controller │    │SSH Engine   │    │   Server    │
└─────────────┘    └─────────────┘    └─────────────┘
      │                     │               │
      │                     │               │
   1. Request          2. Sign            3. SSH with
   Certificate         Public Key         Certificate
```

## Two-Phase Authentication Strategy

### Phase 1: Initial Provisioning (Traditional SSH)
Use traditional SSH keys for initial server setup and Ansible user creation.

### Phase 2: Ongoing Management (Vault SSH Certificates)
Use Vault-signed SSH certificates for all ongoing management tasks.

## Configuration Files

### Ansible Inventory Structure

```yaml
# ansible/inventory/hosts.yml

# Phase 1: Initial EC2 provisioning with traditional SSH keys
ec2_instances:
  hosts:
    vault-pki-demo:
      ansible_host: "{{ ec2_public_ip | default('localhost') }}"
      ansible_user: ec2-user
      ansible_ssh_private_key_file: ~/.ssh/your-ec2-keypair.pem
      vault_server_url: "{{ vault_addr }}"
  vars:
    ansible_ssh_common_args: '-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null'

# Phase 2: Ongoing management with Vault SSH certificates
vault_ssh_managed:
  hosts:
    vault-pki-demo-ssh:
      ansible_host: "{{ ec2_public_ip | default('localhost') }}"
      ansible_user: ansible-automation
      ansible_ssh_private_key_file: ~/.ssh/vault-ssh-key
      ansible_ssh_certificate_file: ~/.ssh/vault-ssh-key-cert.pub
      vault_ssh_role: ansible-automation
  vars:
    ansible_ssh_common_args: '-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o CertificateFile=~/.ssh/vault-ssh-key-cert.pub'
    vault_ssh_engine_path: ssh-client-signer
    vault_ssh_ttl: "1h"

all:
  vars:
    # Vault configuration
    vault_addr: "https://your-vault-cluster.hashicorp.cloud:8200"
    vault_namespace: "admin"
    
    # PKI configuration
    vault_pki_path: "pki"
    vault_pki_role: "example-dot-com"
    
    # Application configuration
    app_domain: example.com
```

### Vault SSH Certificate Setup Script

```bash
#!/bin/bash
# scripts/vault-ssh-cert.sh
# Vault SSH Certificate Helper Script

set -e

# Configuration - Update these values for your environment
VAULT_ADDR="${VAULT_ADDR:-https://your-vault-cluster.hashicorp.cloud:8200}"
VAULT_NAMESPACE="${VAULT_NAMESPACE:-admin}"
VAULT_TOKEN="${VAULT_TOKEN:-your-vault-token-here}"
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
PUBLIC_KEY=$(cat "${SSH_KEY_PATH}.pub")

# Sign the public key with Vault
echo "Signing public key with Vault..."
VAULT_RESPONSE=$(curl -s \
    -H "X-Vault-Token: $VAULT_TOKEN" \
    -H "X-Vault-Namespace: $VAULT_NAMESPACE" \
    -H "Content-Type: application/json" \
    -d "{\"public_key\":\"$PUBLIC_KEY\",\"ttl\":\"$TTL\",\"valid_principals\":\"ansible-automation,ec2-user\"}" \
    "$VAULT_ADDR/v1/$SSH_ENGINE_PATH/sign/$SSH_ROLE")

# Extract and save the signed certificate
SIGNED_CERT=$(echo "$VAULT_RESPONSE" | jq -r '.data.signed_key')
echo "$SIGNED_CERT" > "$SSH_CERT_PATH"
chmod 644 "$SSH_CERT_PATH"

echo "SSH certificate created successfully!"
echo "Certificate saved to: $SSH_CERT_PATH"

# Display certificate details
echo "Certificate details:"
ssh-keygen -L -f "$SSH_CERT_PATH"
```

### Ansible Playbook for Vault SSH Setup

```yaml
# ansible/playbooks/vault-ssh-setup.yml
---
- name: Setup Vault SSH Certificate Authentication
  hosts: localhost
  gather_facts: false
  vars:
    vault_ssh_key_path: "~/.ssh/vault-ssh-key"
    vault_ssh_cert_path: "~/.ssh/vault-ssh-key-cert.pub"
    vault_ssh_role: "ansible-automation"
    vault_ssh_engine: "ssh-client-signer"
    vault_ssh_ttl: "1h"
    
  tasks:
    - name: Ensure SSH directory exists
      ansible.builtin.file:
        path: "{{ ansible_env.HOME }}/.ssh"
        state: directory
        mode: '0700'
    
    - name: Check if Vault SSH private key exists
      ansible.builtin.stat:
        path: "{{ vault_ssh_key_path | expanduser }}"
      register: vault_ssh_key_stat
    
    - name: Generate SSH key pair for Vault authentication
      ansible.builtin.command:
        cmd: >-
          ssh-keygen -t rsa -b 4096
          -f {{ vault_ssh_key_path | expanduser }} -N ''
          -C 'vault-ssh-{{ ansible_date_time.epoch }}'
        creates: "{{ vault_ssh_key_path | expanduser }}"
      when: not vault_ssh_key_stat.stat.exists
      
    - name: Read public key content
      ansible.builtin.slurp:
        src: "{{ vault_ssh_key_path | expanduser }}.pub"
      register: public_key_content
      
    - name: Sign SSH public key with Vault
      ansible.builtin.uri:
        url: "{{ vault_addr }}/v1/{{ vault_ssh_engine }}/sign/{{ vault_ssh_role }}"
        method: POST
        headers:
          X-Vault-Token: "{{ vault_token }}"
          X-Vault-Namespace: "{{ vault_namespace | default('') }}"
        body_format: json
        body:
          public_key: "{{ public_key_content.content | b64decode | trim }}"
          ttl: "{{ vault_ssh_ttl }}"
          valid_principals: "{{ vault_ssh_principals | default('ansible-automation,ec2-user') }}"
        return_content: true
      register: vault_ssh_response
      
    - name: Save signed certificate
      ansible.builtin.copy:
        content: "{{ vault_ssh_response.json.data.signed_key }}"
        dest: "{{ vault_ssh_cert_path | expanduser }}"
        mode: '0644'
      when: vault_ssh_response.json.data.signed_key is defined
```

## Implementation Steps

### Step 1: Initial Setup

1. **Configure Vault SSH Engine**: Ensure your Vault cluster has the SSH engine enabled and configured
2. **Create SSH Role**: Set up the `ansible-automation` role in Vault
3. **Update Inventory**: Modify the inventory file with your specific server IPs and paths

### Step 2: Generate SSH Certificate

Run the helper script to generate and sign your SSH key:

```bash
# Make script executable
chmod +x scripts/vault-ssh-cert.sh

# Run the script
./scripts/vault-ssh-cert.sh
```

### Step 3: Use with Ansible

#### For initial server setup (traditional SSH):
```bash
ansible-playbook -i ansible/inventory/hosts.yml \
  --limit ec2_instances \
  ansible/playbooks/ec2-setup.yml
```

#### For ongoing management (SSH certificates):
```bash
ansible-playbook -i ansible/inventory/hosts.yml \
  --limit vault_ssh_managed \
  your-management-playbook.yml
```

### Step 4: Automate Certificate Management

Use the Ansible playbook to automate SSH certificate setup:

```bash
ansible-playbook -i ansible/inventory/hosts.yml \
  ansible/playbooks/vault-ssh-setup.yml \
  -e vault_token="your-vault-token"
```

## Security Benefits

1. **Short-lived certificates**: Certificates expire after 1 hour by default
2. **Centralized management**: All SSH access controlled through Vault
3. **Audit trail**: All certificate requests are logged in Vault
4. **Role-based access**: Different roles can have different permissions
5. **No key distribution**: No need to distribute SSH keys to servers
6. **Automatic rotation**: Certificates can be renewed automatically

## Troubleshooting

### Certificate Expired

```bash
# Check certificate validity
ssh-keygen -L -f ~/.ssh/vault-ssh-key-cert.pub

# Regenerate certificate
./scripts/vault-ssh-cert.sh
```

### Connection Issues

```bash
# Test SSH connection manually
ssh -i ~/.ssh/vault-ssh-key \
    -o CertificateFile=~/.ssh/vault-ssh-key-cert.pub \
    -o StrictHostKeyChecking=no \
    ansible-automation@your-server-ip
```

### Vault Authentication Issues

```bash
# Check Vault token
vault auth -method=userpass username=your-username

# Check SSH engine status
vault read ssh-client-signer/config/ca
```

## Usage Examples

### Manual SSH with Certificate
```bash
ssh -i ~/.ssh/vault-ssh-key \
    -o CertificateFile=~/.ssh/vault-ssh-key-cert.pub \
    ansible-automation@your-server-ip
```

### Ansible with Certificate
```bash
ansible vault_ssh_managed -i ansible/inventory/hosts.yml -m ping
```

### Certificate Information
```bash
# View certificate details
ssh-keygen -L -f ~/.ssh/vault-ssh-key-cert.pub

# Check expiration
ssh-keygen -L -f ~/.ssh/vault-ssh-key-cert.pub | grep Valid
```

## Integration with Terraform

The Terraform configuration can use provisioners to run Ansible:

```hcl
# terraform/ec2.tf
resource "aws_instance" "vault_pki_demo" {
  # ... instance configuration

  # Initial provisioning with traditional SSH key
  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/your-ec2-keypair.pem")
      host        = self.public_ip
    }
    
    inline = [
      "sudo dnf update -y",
      "sudo dnf install -y ansible-core"
    ]
  }

  # Run Ansible playbook for detailed configuration
  provisioner "local-exec" {
    command = "ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/ec2-setup.yml"
  }
}
```

## Best Practices

1. **Use separate roles**: Create different SSH roles for different access levels
2. **Short TTL**: Keep certificate TTL as short as practical (1 hour recommended)
3. **Audit regularly**: Review Vault audit logs for SSH certificate usage
4. **Automate renewal**: Implement automatic certificate renewal in your workflows
5. **Least privilege**: Grant minimal necessary permissions for each role
6. **Monitor expiration**: Set up alerts for certificate expiration

This setup provides a secure, scalable way to manage SSH access using Vault's certificate authority capabilities while maintaining compatibility with existing Ansible workflows.
