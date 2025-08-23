# SSH Secrets Engine - Supporting Infrastructure

## Overview

This directory contains supporting SSH infrastructure that complements the main Vault PKI demonstration. The SSH secrets engine provides automated SSH key management for infrastructure access and Ansible automation scenarios.

**Note: This is supporting infrastructure - the main demo focuses on PKI certificate management.**

## Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Vault Server                            │
├─────────────────────┬───────────────────────────────────────────┤
│    PKI Engine       │         SSH Engine                       │
│  (Phase 1)          │        (Phase 2)                        │
│                     │                                         │
│ • Root CA           │ • SSH Certificate Authority             │
│ • Intermediate CA   │ • User Certificate Signing             │
│ • TLS Certificates  │ • Host Certificate Signing             │
│ • Role-based Access │ • One-Time Passwords                   │
│                     │ • Dynamic SSH Keys                      │
└─────────────────────┴───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vault Agent                                 │
│              (Automatic Lifecycle Management)                  │
├─────────────────────┬───────────────────────────────────────────┤
│   TLS Management    │        SSH Management                    │
│                     │                                         │
│ • Auto-renewal      │ • SSH cert auto-renewal                 │
│ • Key rotation      │ • Host certificate management           │
│ • Service restart   │ • SSH service configuration             │
└─────────────────────┴───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Target Systems                              │
├─────────────────────┬───────────────────────────────────────────┤
│   Web Applications  │         VM Infrastructure                │
│                     │                                         │
│ • HTTPS with Vault  │ • SSH access via Vault certs           │
│   TLS certificates  │ • Ansible automation                    │
│ • Automatic renewal │ • No long-lived SSH keys               │
│ • Zero config TLS   │ • Centralized access control           │
└─────────────────────┴───────────────────────────────────────────┘
```

## SSH Secrets Engine Features

### 1. Certificate Authority Mode
- **Purpose**: Sign SSH certificates using Vault's SSH CA
- **Use Cases**: 
  - Human administrator access
  - Automated systems (Ansible, CI/CD)
  - Service-to-service communication
- **Security**: Short-lived certificates, centralized revocation

### 2. One-Time Password Mode
- **Purpose**: Generate temporary passwords for SSH access
- **Use Cases**: 
  - Emergency access
  - Break-glass scenarios
  - Temporary contractor access
- **Security**: Single-use passwords, time-limited

### 3. Dynamic Keys Mode
- **Purpose**: Generate temporary SSH key pairs
- **Use Cases**: 
  - Highly secure environments
  - Ephemeral access patterns
- **Security**: Automatically injected and removed keys

## Component Overview

### Terraform Configuration
```
ssh-engine/
├── ssh.tf                  # SSH secrets engine configuration
├── auth_policies.tf        # Authentication and authorization
├── outputs.tf             # Configuration outputs
└── variables.tf           # Configurable parameters
```

### Key Resources
- `vault_mount.ssh` - Enables SSH secrets engine
- `vault_ssh_secret_backend_ca` - Configures SSH CA
- Multiple role types for different use cases
- Integration with existing AppRole authentication

### Supporting Demo Scripts
- `ssh-engine/demo-ssh-supporting.sh` - Supporting SSH infrastructure demo
- Complements the main PKI demo with SSH capabilities
- Shows integration patterns for Ansible automation

## SSH Roles Configuration

### 1. VM Admin Role
```hcl
resource "vault_ssh_secret_backend_role" "vm_admin" {
  name         = "vm-admin"
  key_type     = "ca"
  allowed_users = "ubuntu,centos,root"
  ttl         = "3600"    # 1 hour
  max_ttl     = "86400"   # 24 hours max
}
```

### 2. Ansible Automation Role
```hcl
resource "vault_ssh_secret_backend_role" "ansible_automation" {
  name         = "ansible-automation"
  key_type     = "ca"
  allowed_users = "ansible,ubuntu,centos"
  ttl         = "1800"    # 30 minutes
  max_ttl     = "3600"    # 1 hour max
}
```

### 3. OTP Emergency Role
```hcl
resource "vault_ssh_secret_backend_role" "otp_role" {
  name          = "otp-role"
  key_type      = "otp"
  default_user  = "ubuntu"
  ttl = "300"  # 5 minutes
}
```

## Integration Patterns

### 1. Ansible Automation Workflow
```yaml
# 1. Get SSH certificate from Vault
- name: Get SSH certificate
  uri:
    url: "{{ vault_addr }}/v1/ssh/sign/ansible-automation"
    method: POST
    headers:
      X-Vault-Token: "{{ vault_token }}"
    body:
      public_key: "{{ ssh_public_key }}"

# 2. Use SSH cert to access target systems
# 3. Get TLS certificates for applications
# 4. Deploy and configure services
```

### 2. Vault Agent Integration
The Vault Agent can manage both SSH and TLS certificates:
```hcl
# SSH certificate template
template {
  source      = "/etc/vault/templates/ssh-cert.tpl"
  destination = "/etc/ssh/ssh_host_rsa_key-cert.pub"
  command     = "systemctl reload ssh"
}

# TLS certificate template  
template {
  source      = "/etc/vault/templates/tls-cert.tpl"
  destination = "/etc/ssl/certs/application.crt"
  command     = "systemctl reload nginx"
}
```

## Security Considerations

### SSH Certificate Security
1. **Short TTL**: Certificates expire quickly (30min - 1hr)
2. **Principle of Least Privilege**: Role-specific permissions
3. **Audit Trail**: All certificate generation is logged
4. **No Long-lived Keys**: No permanent SSH keys on systems
5. **Centralized Revocation**: CA-based revocation

### Policy Design
```hcl
# Ansible-specific policy
path "ssh/sign/ansible-automation" {
  capabilities = ["create", "update"]
}

# Combined PKI + SSH policy
path "pki/issue/*" {
  capabilities = ["create", "update"]
}
path "ssh/sign/*" {
  capabilities = ["create", "update"]
}
```

## Getting Started

### 1. Deploy SSH Infrastructure
```bash
cd ssh-engine/
terraform init
terraform plan
terraform apply
```

### 2. Run SSH Demo
```bash
cd scripts/
./demo-magic-ssh.sh
```

### 3. Configure Host Systems
```bash
# Add SSH CA public key to trusted keys
vault read -field=public_key ssh/config/ca >> /etc/ssh/trusted_user_ca_keys

# Configure sshd
echo "TrustedUserCAKeys /etc/ssh/trusted_user_ca_keys" >> /etc/ssh/sshd_config
systemctl reload ssh
```

### 4. Use with Ansible
```bash
# Generate SSH certificate for Ansible
vault write -field=signed_key ssh/sign/ansible-automation \
  public_key=@~/.ssh/id_rsa.pub > ~/.ssh/id_rsa-cert.pub

# Run Ansible with certificate
ansible-playbook -i inventory/hosts.yml playbooks/vault-integration.yml
```

## Benefits

### For Organizations
- **Zero Long-lived SSH Keys**: All access via short-lived certificates
- **Centralized Access Control**: Single point of SSH access management
- **Integrated Secrets**: SSH + TLS certificates from one system
- **Audit Compliance**: Complete access audit trail

### For Operations Teams
- **Automated Certificate Lifecycle**: Vault Agent handles renewals
- **Consistent Access Patterns**: Same workflow for SSH and TLS
- **Emergency Access**: OTP mode for break-glass scenarios
- **Simplified Key Management**: No key distribution or rotation

### For Security Teams
- **Reduced Attack Surface**: No permanent credentials on systems
- **Fine-grained Access Control**: Role-based permissions
- **Certificate Transparency**: All access is logged and auditable
- **Rapid Revocation**: Centralized certificate authority

## Real-world Use Cases

### 1. Infrastructure Automation
- Ansible uses SSH certificates to configure VMs
- Applications get TLS certificates for secure communication
- Vault Agent manages entire certificate lifecycle

### 2. Developer Access
- Developers get short-lived SSH certificates for server access
- No need to distribute or manage SSH keys
- Access automatically expires

### 3. CI/CD Pipeline Integration
- Build systems get temporary SSH access
- Deployment scripts use Vault for both SSH and TLS
- Zero permanent credentials in pipeline

### 4. Compliance Environments
- All access via centrally-managed certificates
- Complete audit trail of access events
- Automated compliance reporting

## Next Steps
Phase 2 provides the foundation for comprehensive secrets management. Future enhancements could include:
- Kubernetes integration with service accounts
- Database dynamic credentials
- Cloud provider integration
- Advanced monitoring and alerting
