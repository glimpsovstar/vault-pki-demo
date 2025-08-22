# Vault PKI Demo - Phase 1: CLI Certificate Lifecycle

This phase demonstrates the complete PKI certificate lifecycle using Vault's CLI interface. It shows how certificates are issued, managed, renewed, and revoked using HashiCorp Vault's PKI secrets engine.

## Overview

Phase 1 covers the foundational PKI operations:
- Root CA verification (created via Terraform)
- Certificate issuance (both direct and CSR-based)
- Certificate inspection and validation
- Certificate renewal/re-issuance
- Certificate revocation
- Certificate Revocation List (CRL) management

## Prerequisites

Before running this demo, ensure you have:

1. **Required Tools:**
   - `vault` CLI (authenticated)
   - `jq` (JSON processor)
   - `terraform` (for infrastructure setup)
   - `openssl` (for certificate inspection)
   - `curl` (for HTTP requests)

2. **Infrastructure Setup:**
   ```bash
   cd terraform/
   terraform init
   terraform apply
   ```

3. **Vault Authentication:**
   The demo script automatically reads the Vault token from your Terraform configuration (`terraform.auto.tfvars`).

## Demo Steps

### 1.1 Show PKI Mount (configured via Terraform)
- Displays the PKI secrets engine mount
- Shows mount configuration and settings

### 1.2 Show Root CA Certificate (created via Terraform)
- Displays the root Certificate Authority certificate
- Shows CA configuration details

### 1.3 Show PKI Role Configuration
- Displays the PKI role settings
- Shows allowed domains, TTL limits, and key specifications

### 1.4 Issue a Certificate
- Issues a new certificate using Vault's simplified flow
- Demonstrates CN (Common Name) and TTL settings
- **Note:** Vault generates both CSR and certificate internally for this flow

### 1.5 Show Certificate Details and Expiration
- Extracts and displays certificate information using OpenSSL
- Shows certificate serial number, subject, and expiration date

### 1.6 List Existing Certificates
- Shows all certificates in the PKI store
- Displays certificate serial numbers

### 1.7 Verify Certificate Chain
- Validates the certificate's issuer
- Confirms the chain of trust to the Root CA

### 1.8 Certificate Renewal (Re-issuance)
- Issues a new certificate for the same Common Name
- Demonstrates certificate renewal process

### 1.9 Show New Certificate Details
- Displays details of the renewed certificate
- Shows the new serial number and configuration

### 1.10 Check Revocation Status BEFORE Revoke
- Shows certificate status before revocation
- Demonstrates clean certificate state

### 1.11 Revoke Certificate
- Revokes the first certificate
- Demonstrates certificate lifecycle management

### 1.12 Check Revocation Status AFTER Revoke
- Shows certificate status after revocation
- Displays revocation timestamp

### 1.13 Generate CSR and Sign with Vault (Optional)
- Demonstrates traditional CSR-based certificate flow
- Shows manual key generation and CSR creation
- Signs CSR with Vault PKI engine

### 1.14 Certificate Revocation List (CRL)
- Displays the Certificate Revocation List
- Shows revoked certificates

### 1.15 Cleanup
- Removes temporary files created during the demo

## Running the Demo

### Quick Start
```bash
# From the project root directory
cd /path/to/vault-pki-demo
./scripts/demo-magic-vault-pki.sh
```

### Customization Options

You can customize the demo behavior with environment variables:

```bash
# Speed up the demo (no typing animation)
TYPE_SPEED=0 ./scripts/demo-magic-vault-pki.sh

# Customize certificate details
CN_BASE="myapp" DOMAIN_DEMO="example.com" TTL_DEMO="10m" ./scripts/demo-magic-vault-pki.sh

# Add confirmation prompts
PROMPT_TIMEOUT=5 ./scripts/demo-magic-vault-pki.sh
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TYPE_SPEED` | `20` | Characters per second for typing animation (0 = instant) |
| `PROMPT_TIMEOUT` | `0` | Wait time for user confirmation (0 = no wait) |
| `CN_BASE` | `app` | Base name for certificate Common Name |
| `DOMAIN_DEMO` | From Terraform | Domain suffix for certificates |
| `TTL_DEMO` | `5m` | Certificate Time-To-Live |

## Expected Output

The demo will show:

1. **PKI Infrastructure:** Mount points, root CA, and role configurations
2. **Certificate Operations:** Issuance, inspection, and validation
3. **Certificate Lifecycle:** Renewal and revocation processes
4. **Security Features:** Certificate chains, CRL, and validation

## Key Learning Points

After running Phase 1, you will understand:

- ✅ How Vault PKI secrets engine is configured
- ✅ Root CA certificate structure and purpose
- ✅ Certificate issuance methods (direct vs CSR-based)
- ✅ Certificate inspection and validation techniques
- ✅ Certificate renewal and lifecycle management
- ✅ Certificate revocation and CRL management
- ✅ Chain of trust validation

## Troubleshooting

### Common Issues

1. **"Missing dependency" error:**
   ```bash
   # Install missing tools
   brew install vault jq openssl
   ```

2. **"Terraform not initialized" error:**
   ```bash
   cd terraform/
   terraform init && terraform apply
   ```

3. **"Permission denied" errors:**
   - Verify your Vault token has sufficient permissions
   - Check that the Vault token in `terraform.auto.tfvars` is valid

4. **"No such file or directory" errors:**
   - Ensure you're running the script from the project root directory
   - Verify all required files are present

### Debug Mode

For troubleshooting, you can run the script with additional logging:
```bash
set -x  # Enable command tracing
./scripts/demo-magic-vault-pki.sh
```

## Next Steps

After completing Phase 1, you can:

1. **Proceed to Phase 2:** Application integration and automation
2. **Explore Advanced Features:** Intermediate CAs, certificate templates
3. **Production Considerations:** High availability, monitoring, and automation

## File Structure

```
vault-pki-demo/
├── Demo-Phase1.md                    # This documentation
├── scripts/
│   ├── demo-magic-vault-pki.sh      # Main demo script
│   └── lib/
│       └── demo-magic.sh            # Demo utilities
├── terraform/                       # Infrastructure as Code
│   ├── pki.tf                      # PKI configuration
│   ├── auth_approle.tf             # Authentication setup
│   ├── terraform.auto.tfvars       # Configuration variables
│   └── ...                         # Other Terraform files
└── README.md                        # Project overview
```

## Security Notes

⚠️ **Important:** This demo is designed for educational and demonstration purposes. For production use:

- Use proper secret management for Vault tokens
- Implement proper RBAC and policies
- Consider intermediate CA architectures
- Implement proper monitoring and alerting
- Follow your organization's security policies

---

**Happy Learning!** 🎓 This Phase 1 demo provides a comprehensive foundation for understanding Vault PKI operations.
