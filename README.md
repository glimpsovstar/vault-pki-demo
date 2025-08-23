# HashiCorp Vault PKI Demo

A comprehensive demonstration of HashiCorp Vault's PKI (Public Key Infrastructure) capabilities, featuring both CLI and web-based interfaces with visual workflow comparisons.

## 🎯 Overview

This demo system showcases the complete certificate lifecycle management using HashiCorp Vault PKI, highlighting the transformation from traditional manual certificate processes to automated, policy-driven certificate management.

### Key Features

- **📊 Visual Workflow Comparison**: Side-by-side comparison of traditional vs. HashiCorp Vault certificate management
- **🔧 Two Certificate Workflows**: Both traditional CSR signing (`/sign`) and direct issuance (`/issue`)
- **🎮 Interactive Web Interface**: Browser-based demo with terminal emulation and step-by-step diagrams
- **💻 CLI Demo Script**: Command-line demonstration using demo-magic for presentations
- **🏗️ Infrastructure as Code**: Complete Terraform setup for repeatable deployments
- **📚 Educational Content**: 17 comprehensive steps covering the entire PKI lifecycle

## 🚀 Quick Start

### Prerequisites

- HashiCorp Vault (1.15.2+)
- Terraform (1.6.0+)
- Docker & Docker Compose
- OpenSSL
- jq

### 1. Infrastructure Setup

```bash
# Navigate to terraform directory
cd terraform

# Configure your vault credentials in terraform.auto.tfvars
cp terraform.auto.tfvars.example terraform.auto.tfvars
# Edit terraform.auto.tfvars with your Vault details

# Deploy infrastructure
terraform init
terraform apply
```

### 2. CLI Demo

```bash
# Run the interactive CLI demonstration
cd scripts
./demo-magic-vault-pki.sh
```

### 3. Web Interface

```bash
# Start the containerized web demo
cd container
docker-compose up -d

# Access the web interface
open http://localhost:3020
```

## 📖 Demo Content

### Phase 1: Foundation & Setup
- **1.1** PKI Mount Configuration
- **1.2** Root CA Creation Process (How-to)
- **1.3** Root CA Verification (Proof of existence)
- **1.4** PKI Role Configuration

### Phase 2: Certificate Workflows
- **1.5** **Workflow A**: Traditional CSR Signing (`/sign` endpoint)
  - Generate private key locally
  - Create Certificate Signing Request
  - Send CSR to Vault for signing
  - Receive signed certificate
- **1.6** **Workflow B**: Direct Certificate Issuance (`/issue` endpoint)
  - Vault generates both private key and certificate
  - Single-step certificate creation
- **1.7** Workflow Comparison & Analysis

### Phase 3: Certificate Management
- **1.8-1.10** Certificate inspection and chain verification
- **1.11-1.12** Certificate renewal processes
- **1.13-1.16** Revocation and CRL management
- **1.17** Cleanup and summary

## 🎨 Visual Components

### Traditional vs. Modern Workflow Comparison

The demo includes visual representations showing:

**Traditional Certificate Management:**
- Multi-team involvement (6+ personas)
- Manual handoffs and processes
- Days to weeks timeline
- Human error potential
- Complex coordination requirements

**HashiCorp Vault Approach:**
- API-driven automation
- Policy-based security controls
- Seconds to minutes timeline
- Built-in compliance and audit trails
- Zero human intervention needed

## 🏗️ Architecture

```
vault-pki-demo/
├── terraform/           # Infrastructure as Code
│   ├── pki.tf          # PKI secrets engine setup
│   ├── auth_approle.tf # AppRole authentication
│   └── outputs.tf      # Configuration outputs
├── scripts/            # CLI demonstration
│   └── demo-magic-vault-pki.sh
├── container/          # Web interface
│   ├── app.js         # Express server with 17 demo steps
│   ├── web/
│   │   ├── templates/ # EJS templates with Vault branding
│   │   └── static/    # CSS, JS, and workflow diagrams
│   └── docker-compose.yml
├── ansible/           # Configuration management
├── k8s/              # Kubernetes deployments
└── docs/             # Additional documentation
```

## 🔐 Security Considerations

### Workflow Selection Guide

**Use `/sign` endpoint when:**
- Private keys must remain under your control
- Regulatory compliance requires key custody
- Integration with existing key management systems
- Air-gapped or highly secure environments

**Use `/issue` endpoint when:**
- Automation and simplicity are priorities
- Vault can securely manage private keys
- Modern cloud-native applications
- Rapid certificate provisioning needs

## 🌟 Key Educational Outcomes

After completing this demo, participants will understand:

1. **PKI Foundation**: How Root CAs establish trust chains
2. **Workflow Flexibility**: When to use traditional vs. modern approaches
3. **Automation Benefits**: Time and risk reduction through policy-driven management
4. **Security Trade-offs**: Key custody vs. operational efficiency
5. **Practical Implementation**: Real-world Vault PKI deployment patterns

## 🚀 Advanced Usage

### Custom Configuration

Modify `terraform/terraform.auto.tfvars` to customize:
- Vault endpoints and namespaces
- Certificate validity periods
- Domain names and DNS settings
- PKI role permissions and constraints

### Web Interface Customization

The containerized web interface can be customized by modifying:
- `container/web/templates/index.ejs` - UI layout and branding
- `container/web/static/js/diagrams.js` - Workflow diagrams
- `container/app.js` - Demo steps and commands

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes with both CLI and web interfaces
4. Update documentation as needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions about HashiCorp Vault PKI or this demo system:
- Review the comprehensive step-by-step walkthrough
- Check Terraform outputs for configuration details
- Examine container logs for troubleshooting: `docker-compose logs -f`

## 🎯 Use Cases

Perfect for:
- **Sales Engineers**: Customer demonstrations and POCs
- **Solutions Architects**: Technical deep-dives and architecture sessions  
- **Security Teams**: Understanding certificate lifecycle automation
- **DevOps Engineers**: Implementing PKI in CI/CD pipelines
- **Training Sessions**: Hands-on Vault PKI education

---

*This demo showcases HashiCorp Vault's enterprise-grade PKI capabilities, transforming complex manual certificate processes into simple, automated, and secure workflows.*

