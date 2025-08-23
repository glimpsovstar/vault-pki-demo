# Vault SSH Engine with Ansible Integration

This documentation explains how to use HashiCorp Vault's SSH engine with Ansible for certificate-based SSH authentication.

## Overview

The Vault SSH engine allows you to use Vault as an SSH Certificate Authority (CA). Instead of managing SSH keys manually, Vault can sign your public keys with short-lived certificates, providing better security and auditability.

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Ansible   │───▶│    Vault    │───▶│  Target     │
│  Controller │    │SSH Engine   │    │   Server    │
└─────────────┘    └─────────────┘    └─────────────┘
      │                     │               │
      │                     │               │
   1. Request          2. Sign            3. SSH with
   Certificate         Public Key         Certificate
```

## Setup Process

### 1. Initial EC2 Provisioning (Traditional SSH)

For initial EC2 instance provisioning, we use traditional SSH keys:

```yaml
# ansible/inventory/hosts.yml - ec2_instances group
ec2_instances:
  hosts:
    vault-pki-demo:
      ansible_host: "{{ ec2_public_ip }}"
      ansible_user: ec2-user
      ansible_ssh_private_key_file: ~/.ssh/djoo-demo-ec2-keypair.pem
```

### 2. Vault SSH Certificate Authentication (Ongoing Management)

For ongoing management after initial setup, we use Vault SSH certificates:

```yaml
# ansible/inventory/hosts.yml - vault_ssh_managed group
vault_ssh_managed:
  hosts:
    vault-pki-demo-ssh:
      ansible_host: "{{ ec2_public_ip }}"
      ansible_user: ansible-automation
      ansible_ssh_private_key_file: ~/.ssh/vault-ssh-key
      ansible_ssh_certificate_file: ~/.ssh/vault-ssh-key-cert.pub
      vault_ssh_role: ansible-automation
```

## Usage Instructions

### Step 1: Generate SSH Certificate

Run the helper script to generate and sign your SSH key:

```bash
./scripts/vault-ssh-cert.sh
```

This script will:
- Generate an SSH key pair (`~/.ssh/vault-ssh-key`)
- Sign the public key with Vault
- Save the certificate (`~/.ssh/vault-ssh-key-cert.pub`)

### Step 2: Use with Ansible

#### For initial EC2 setup (traditional SSH):
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

### Step 3: Set up SSH Certificate Authentication

Use the dedicated playbook to set up SSH certificate authentication:

```bash
ansible-playbook -i ansible/inventory/hosts.yml \
  ansible/playbooks/vault-ssh-setup.yml \
  -e vault_token="your-vault-token"
```

## Configuration Files

### Inventory Structure

The inventory supports both authentication methods:

1. **ec2_instances**: Uses traditional SSH keys for initial provisioning
2. **vault_ssh_managed**: Uses Vault SSH certificates for ongoing management

### Key Variables

```yaml
# Vault configuration
vault_addr: "https://your-vault.hashicorp.cloud:8200"
vault_namespace: "admin"
vault_ssh_engine: "ssh-client-signer"
vault_ssh_role: "ansible-automation"

# SSH certificate paths
ansible_ssh_private_key_file: ~/.ssh/vault-ssh-key
ansible_ssh_certificate_file: ~/.ssh/vault-ssh-key-cert.pub
```

## Security Benefits

1. **Short-lived certificates**: Certificates expire after 1 hour by default
2. **Centralized management**: All SSH access controlled through Vault
3. **Audit trail**: All certificate requests are logged in Vault
4. **Role-based access**: Different roles can have different permissions
5. **No key distribution**: No need to distribute SSH keys to servers

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

## Example Commands

### Manual SSH with Certificate
```bash
ssh -i ~/.ssh/vault-ssh-key \
    -o CertificateFile=~/.ssh/vault-ssh-key-cert.pub \
    ansible-automation@3.26.191.68
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

The Terraform configuration uses provisioners to run Ansible:

```hcl
# Initial provisioning with traditional SSH key
provisioner "remote-exec" {
  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file("~/.ssh/djoo-demo-ec2-keypair.pem")
    host        = self.public_ip
  }
  # ... setup commands
}

# Run Ansible playbook
provisioner "local-exec" {
  command = "ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/ec2-setup.yml"
}
```

This setup provides a secure, scalable way to manage SSH access using Vault's certificate authority capabilities while maintaining compatibility with existing Ansible workflows.
