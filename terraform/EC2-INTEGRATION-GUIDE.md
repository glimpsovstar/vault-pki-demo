# EC2 Instance Integration Guide

## Overview

This document describes the EC2 instance `djoo-vault-pki-demo1` that demonstrates Vault PKI and SSH operations using AWS authentication method.

## Architecture

```
EC2 Instance (djoo-vault-pki-demo1)
├── AWS Instance Metadata → Vault AWS Auth Method
├── Vault CLI (pre-installed)
├── Authentication Script (/home/ec2-user/vault-auth.sh)
└── PKI + SSH Operations
```

## Instance Configuration

### Basic Details
- **Name**: djoo-vault-pki-demo1  
- **Instance Type**: t2.micro
- **AMI**: ami-0d699116d22d2cb59 (RHEL9 - 2025-05-28)
- **Key Pair**: djoo-demo-ec2-keypair
- **IAM Profile**: tfstacks-profile

### Network Configuration (from TFC workspace)
- **VPC ID**: vpc-0fdd6b30b8f09311e
- **CIDR Block**: 10.1.0.0/16
- **Subnet**: First public subnet from tf-aws-network-dev workspace
- **Security Group**: sg-0a7b2393e5a4ef487 (SSH/HTTP/HTTPS allowed)
- **Elastic IP**: Assigned for consistent access

### Pre-installed Software
- **Vault CLI**: v1.15.2
- **Dependencies**: wget, unzip, curl, jq, openssl
- **User Data**: Automated setup script
- **Service**: vault-auth.service (systemd)

## Authentication Flow

### 1. AWS Instance Metadata Authentication
```bash
# Automatic authentication using instance metadata
./vault-auth.sh
```

### 2. Manual Authentication
```bash
export VAULT_ADDR="https://your-vault-server:8200"
TOKEN=$(vault write -field=token auth/aws/login role=ec2-combined-role)
export VAULT_TOKEN="$TOKEN"
```

### 3. Available Roles
| Role | Purpose | Policies | Use Case |
|------|---------|----------|----------|
| `ec2-pki-role` | PKI operations | `pki_operator` | Certificate management only |
| `ec2-ssh-role` | SSH operations | `ansible_ssh` | SSH certificate signing only |
| `ec2-combined-role` | Both PKI & SSH | `app_combined` | Full demo capabilities |

## Usage Examples

### PKI Operations
```bash
# Authenticate first
./vault-auth.sh

# Issue a certificate using /issue endpoint (Vault generates private key)
vault write pki/issue/demo common_name=app.demo.local ttl=24h

# Sign a CSR using /sign endpoint (you provide CSR)
openssl req -new -key private.key -out certificate.csr -subj "/CN=web.demo.local"
vault write pki/sign/demo csr=@certificate.csr ttl=12h

# List certificates
vault list pki/certs

# Revoke a certificate
vault write pki/revoke serial_number=<serial>
```

### SSH Operations  
```bash
# Authenticate first
./vault-auth.sh

# Sign SSH public key
vault write ssh/sign/ansible_role public_key=@~/.ssh/id_rsa.pub

# Generate OTP for SSH access (if configured)
vault write ssh/creds/otp_role ip=10.1.0.100

# Get SSH CA public key for host verification
vault read -field=public_key ssh/config/ca
```

## Connection & Access

### SSH Connection
```bash
# Replace with actual public IP from terraform outputs
ssh -i ~/.ssh/djoo-demo-ec2-keypair.pem ec2-user@<PUBLIC_IP>
```

### Initial Setup Check
```bash
# Check if user-data completed successfully
sudo cat /var/log/user-data-complete.log

# Check Vault CLI installation
vault version

# Check authentication script
ls -la /home/ec2-user/vault-auth.sh

# Check systemd service
sudo systemctl status vault-auth.service
```

## Terraform Integration

### Variables Used
```hcl
# From TFC djoo-hashicorp/tf-aws-network-dev workspace
vpc_id                              = "vpc-0fdd6b30b8f09311e"
vpc_cidr_block                      = "10.1.0.0/16" 
security_group_ssh_http_https_allowed = "sg-0a7b2393e5a4ef487"
vpc_public_subnets = [
  "subnet-0bd998df5ba13b0a3",
  "subnet-06b66f3aa85082bf1", 
  "subnet-00c6534d40c01cd5d"
]
vpc_private_subnets = [
  "subnet-0c63f747f7be8fb77",
  "subnet-085f46d75886f8f4f",
  "subnet-030485322fe506c57" 
]
```

### Outputs Generated
- `ec2_instance_id`: Instance identifier
- `ec2_public_ip`: Elastic IP address
- `ec2_private_ip`: Internal IP address  
- `ec2_public_dns`: Public DNS name
- `ec2_connection_info`: Connection details and usage instructions

## Security Considerations

### IAM Requirements
- EC2 instance needs IAM role with permissions for:
  - EC2 instance metadata access
  - (Optional) Additional AWS service permissions based on use case

### Network Security
- Security group allows SSH (22), HTTP (80), HTTPS (443)
- Instance deployed in public subnet for demo accessibility
- Elastic IP provides consistent access point

### Vault Authentication
- Uses instance metadata (no permanent credentials on instance)
- Token-based access with configurable TTL
- Role-based access control (RBAC)

## Troubleshooting

### Authentication Issues
```bash
# Check AWS instance metadata access
curl http://169.254.169.254/latest/meta-data/instance-id

# Verify Vault connectivity  
vault status

# Check authentication debug
vault write -format=json auth/aws/login role=ec2-combined-role | jq
```

### Instance Access Issues
```bash
# Check security group rules
aws ec2 describe-security-groups --group-ids sg-0a7b2393e5a4ef487

# Verify key pair
aws ec2 describe-key-pairs --key-names djoo-demo-ec2-keypair

# Check instance status
aws ec2 describe-instances --instance-ids <INSTANCE_ID>
```

### Service Issues
```bash
# Check user-data execution
sudo cat /var/log/cloud-init-output.log

# Check systemd service
sudo systemctl status vault-auth.service
sudo journalctl -u vault-auth.service
```

## Production Considerations

### Scaling
- Use Launch Templates for consistent configuration
- Auto Scaling Groups for multiple instances  
- Load balancers for distributed workloads

### Monitoring
- CloudWatch for instance metrics
- Vault audit logs for authentication events
- Application-specific logging

### Security Hardening
- Private subnets for production workloads
- Restricted security groups (principle of least privilege)
- Regular AMI updates and patching
- Secrets rotation policies

## Integration with Demo Scripts

The EC2 instance is designed to work seamlessly with the existing demo scripts:

1. **CLI Demo**: Can be run directly on the instance
2. **Web Interface**: Instance can act as demonstration target
3. **Certificate Operations**: Full PKI workflow supported
4. **SSH Operations**: Certificate-based SSH access

This provides a complete end-to-end demonstration environment combining infrastructure, authentication, and secrets management capabilities.
