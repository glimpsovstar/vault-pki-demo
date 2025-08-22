# 📚 Vault PKI Demo - Complete Reference Guide

*Created: August 22, 2025*  
*Project: vault-pki-demo*  
*Purpose: Comprehensive reference for HashiCorp Vault PKI demonstration system*

---

## 🎯 Project Overview

This repository contains a complete demonstration system for HashiCorp Vault PKI (Public Key Infrastructure) certificate lifecycle management. The project includes both CLI-based demos and a containerized web interface for interactive learning and presentations.

### 🏗️ Architecture Components

```
vault-pki-demo/
├── 🏗️ Infrastructure (Terraform)
├── 🖥️ CLI Demo Scripts (bash + demo-magic)
├── 🐳 Web Container Interface (Node.js + Docker)
└── 📚 Documentation & Guides
```

## 🔧 Infrastructure Configuration

### Terraform Components

| File | Purpose | Key Resources |
|------|---------|---------------|
| `terraform.auto.tfvars` | Configuration values | Vault connection details |
| `variables.tf` | Variable definitions | Typed, documented variables |
| `outputs.tf` | Export values | Demo script integration |
| `pki.tf` | PKI engine setup | Mount, CA, role configuration |
| `auth_approle.tf` | Authentication | AppRole method setup |
| `policy.tf` | Access control | PKI permissions policy |

### Key Configuration Values
- **Vault Address**: HCP Vault cluster endpoint
- **Namespace**: `admin` (HCP Vault)
- **PKI Mount**: `pki-demo`
- **Domain**: `*.david-joo.sbx.hashidemos.io`
- **Certificate TTL**: 24 hours max
- **Key Type**: RSA 2048-bit

## 🖥️ CLI Demo System

### Phase 1: Core PKI Lifecycle (15 Steps)

| Step | Operation | Description |
|------|-----------|-------------|
| **Setup** | Token verification | Validate Vault authentication |
| **1.1** | PKI mount display | Show secrets engine configuration |
| **1.2** | Root CA certificate | Display trust anchor |
| **1.3** | PKI role configuration | Show issuance parameters |
| **1.4** | Certificate issuance | Issue certificate (simplified flow) |
| **1.5** | Certificate details | Extract and analyze metadata |
| **1.6** | Certificate listing | Show all stored certificates |
| **1.7** | Chain verification | Validate trust relationships |
| **1.8** | Certificate renewal | Issue new certificate for same CN |
| **1.9** | New certificate details | Show renewed certificate info |
| **1.10** | Revocation status (before) | Check certificate before revocation |
| **1.11** | Certificate revocation | Revoke certificate |
| **1.12** | Revocation status (after) | Verify revocation took effect |
| **1.13** | CSR-based flow | Traditional certificate signing request |
| **1.14** | CRL display | Show Certificate Revocation List |
| **1.15** | Cleanup | Remove temporary demo files |

### Demo Script Features
- **Interactive prompts** with `demo-magic` library
- **Clear console sections** with visual separators
- **Error handling** and validation
- **Terraform output integration** for dynamic configuration
- **Comprehensive certificate lifecycle coverage**

### Usage Commands
```bash
# Run the complete demo
cd scripts/
./demo-magic-vault-pki.sh

# Individual sections available via script modification
```

## 🐳 Container Web Interface

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Node.js 18 + Express | Web server framework |
| **Real-time** | Socket.IO + node-pty | WebSocket terminal interaction |
| **Frontend** | Bootstrap 5 + xterm.js | Responsive UI + terminal emulator |
| **Container** | Alpine Linux + Vault CLI | Lightweight runtime environment |
| **Orchestration** | Docker Compose | Service management |

### Container Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Browser   │◄──►│  Express.js App  │◄──►│  HashiCorp      │
│                 │    │                  │    │  Vault          │
│ • Terminal UI   │    │ • Socket.IO      │    │                 │
│ • Diagrams      │    │ • node-pty       │    │ • PKI Engine    │
│ • Real-time     │    │ • Terminal Proxy │    │ • Certificates  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| **Web Interface** | **3020** | Main application access |
| **WebSocket** | 3020 | Real-time terminal communication |
| **Health Check** | 3020 | Container health monitoring |

### File Structure

```
container/
├── 🐳 Container Configuration
│   ├── Dockerfile              # Alpine + Node.js + Vault CLI
│   ├── docker-compose.yml      # Port 3020 orchestration
│   ├── .dockerignore           # Build optimization
│   └── .env.example           # Environment template (PORT=3020)
│
├── 🚀 Application Core
│   ├── app.js                 # Express server (PORT 3020)
│   └── package.json           # Dependencies and scripts
│
├── 🌐 Web Interface
│   ├── web/templates/
│   │   └── index.ejs          # Two-tab HTML interface
│   └── web/static/
│       ├── css/styles.css     # Custom styling
│       ├── js/terminal.js     # Terminal interaction
│       └── js/diagrams.js     # Visual diagrams (15 SVGs)
│
└── 📚 Documentation & Scripts
    ├── README.md              # Container-specific docs
    └── start-demo.sh          # One-click startup (port 3020)
```

## 🚀 Deployment Methods

### Method 1: One-Click Container Startup
```bash
cd container/
./start-demo.sh
# Access: http://localhost:3020
```

### Method 2: Manual Docker Compose
```bash
cd container/
cp .env.example .env
# Edit .env with Vault details
docker-compose up --build -d
# Access: http://localhost:3020
```

### Method 3: Direct Docker Build
```bash
cd container/
docker build -t vault-pki-demo .
docker run -p 3020:3020 \
  -e VAULT_ADDR="$VAULT_ADDR" \
  -e VAULT_TOKEN="$VAULT_TOKEN" \
  -e VAULT_NAMESPACE="$VAULT_NAMESPACE" \
  vault-pki-demo
```

## 🎛️ Interface Features

### Tab 1: Interactive Terminal
- **Real-time terminal emulation** using xterm.js
- **15 clickable demo buttons** corresponding to CLI script steps
- **Live command execution** with WebSocket streaming
- **Terminal controls** (clear, environment display)
- **Direct command input** capability

### Tab 2: PKI Lifecycle Diagrams
- **15 custom SVG diagrams** showing PKI processes
- **Interactive navigation** between diagram steps
- **Process flow illustrations** with detailed descriptions
- **Visual learning aid** for PKI concepts

## 🔐 Security Configuration

### Environment Variables Required
```bash
VAULT_ADDR=https://your-vault-cluster.hashicorp.cloud:8200
VAULT_TOKEN=hvs.CAESII...
VAULT_NAMESPACE=admin
PORT=3020
```

### Vault Permissions Required
- **PKI Engine Access**: Read/write to `pki-demo/*`
- **Certificate Operations**: Issue, revoke, read certificates
- **CRL Access**: Read Certificate Revocation Lists
- **Token Operations**: Token lookup and validation

### Security Best Practices
- ✅ Environment variable isolation
- ✅ No hardcoded credentials
- ✅ Minimal required Vault policies
- ✅ Container resource limits
- ✅ Health check monitoring

## 📊 Monitoring & Troubleshooting

### Container Health
```bash
# Check container status
docker-compose ps

# View application logs
docker-compose logs -f vault-pki-demo

# Container resource usage
docker stats vault-pki-demo
```

### Application Endpoints
| Endpoint | Purpose | Response |
|----------|---------|----------|
| `http://localhost:3020/` | Main interface | HTML with two tabs |
| `http://localhost:3020/api/steps` | Demo steps JSON | API data |
| WebSocket connection | Terminal interaction | Real-time data |

### Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Connection Failed** | Container won't start | Check VAULT_ADDR and network |
| **Authentication Error** | 403 errors in logs | Verify VAULT_TOKEN permissions |
| **Terminal Not Working** | No WebSocket connection | Check port 3020 accessibility |
| **Commands Fail** | Vault CLI errors | Validate Vault configuration |

## 🔄 Development Workflow

### Local Development
```bash
cd container/
npm install
export VAULT_ADDR="your-vault-url"
export VAULT_TOKEN="your-token"
export VAULT_NAMESPACE="admin"
npm run dev  # Uses nodemon for auto-reload
```

### Building & Testing
```bash
# Build container
docker build -t vault-pki-demo .

# Test locally
docker run --rm -p 3020:3020 \
  -e VAULT_ADDR="$VAULT_ADDR" \
  -e VAULT_TOKEN="$VAULT_TOKEN" \
  -e VAULT_NAMESPACE="$VAULT_NAMESPACE" \
  vault-pki-demo
```

## 📈 Usage Scenarios

### 1. Educational Presentations
- **Audience**: Technical teams learning PKI concepts
- **Method**: Use diagram tab for process explanation, terminal tab for live demos
- **Duration**: 30-45 minutes for complete lifecycle

### 2. Customer Demonstrations
- **Audience**: Prospects evaluating Vault PKI capabilities
- **Method**: Interactive terminal with pre-configured scenarios
- **Duration**: 15-20 minutes focused on key operations

### 3. Training Workshops
- **Audience**: Engineers implementing PKI solutions
- **Method**: Hands-on terminal interaction with guided exercises
- **Duration**: 1-2 hours with Q&A

### 4. Development Testing
- **Audience**: Internal teams validating PKI configurations
- **Method**: Container deployment with custom Vault endpoints
- **Duration**: Ongoing testing and validation

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks
- **Vault CLI Updates**: Update Dockerfile with latest Vault version
- **Node.js Dependencies**: Run `npm audit` and update packages
- **Container Security**: Scan with `docker scan vault-pki-demo`
- **Documentation**: Update this guide with configuration changes

### Version History
- **v1.0** (August 2025): Initial container implementation with port 3020
- **Phase 1**: CLI demo script with 15 interactive steps
- **Infrastructure**: Terraform configuration for HCP Vault

## 📞 Support & References

### Internal Documentation
- **CLI Demo Guide**: `Demo-Phase1.md`
- **Container Overview**: `CONTAINER-OVERVIEW.md`
- **Terraform README**: `terraform/README.md`

### External References
- **Vault PKI Documentation**: https://developer.hashicorp.com/vault/docs/secrets/pki
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Node.js Security**: https://nodejs.org/en/docs/guides/security/

---

## 🎉 Quick Reference Summary

**Access URL**: http://localhost:3020  
**Container Port**: 3020  
**Demo Steps**: 15 interactive PKI operations  
**Technologies**: Node.js, Docker, Vault CLI, Bootstrap, xterm.js  
**Deployment**: `./start-demo.sh` or `docker-compose up`  
**Purpose**: Interactive PKI certificate lifecycle demonstration
