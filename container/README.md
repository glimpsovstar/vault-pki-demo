# Vault PKI Demo - Container Version

Interactive web interface for demonstrating HashiCorp Vault PKI certificate lifecycle management.

## Features

🖥️ **Interactive Terminal** - Execute PKI demo steps with real-time terminal output
📊 **Visual Diagrams** - Step-by-step PKI process diagrams  
🔐 **Complete PKI Lifecycle** - Certificate issuance, renewal, revocation, and CRL management
🌐 **Web-based Interface** - Accessible via browser with responsive design
⚡ **Real-time Execution** - Live terminal interaction using WebSockets

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Access to a HashiCorp Vault instance
- Vault token with PKI permissions

### 1. Clone and Configure

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Vault details
nano .env
```

### 2. Build and Run

```bash
# Build and start the container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Access the Demo

Open your browser to: http://localhost:3000

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VAULT_ADDR` | Vault server URL | `https://vault.company.com:8200` |
| `VAULT_TOKEN` | Vault authentication token | `hvs.CAESII...` |
| `VAULT_NAMESPACE` | Vault namespace (if using) | `admin` |
| `PORT` | Application port | `3000` |

## Demo Steps Overview

### Phase 1: PKI Lifecycle (15 Steps)

1. **Token Verification** - Validate Vault authentication
2. **PKI Mount** - Show PKI secrets engine configuration  
3. **Root CA** - Display root certificate authority
4. **PKI Role** - Show certificate issuance role settings
5. **Certificate Issuance** - Issue new certificate via simplified flow
6. **Certificate Details** - Extract and analyze certificate metadata
7. **Certificate List** - Show all certificates in PKI store
8. **Chain Verification** - Validate certificate trust chain
9. **Certificate Renewal** - Issue new certificate (renewal simulation)
10. **New Certificate Details** - Show renewed certificate information
11. **Revocation Status (Before)** - Check certificate before revocation
12. **Certificate Revocation** - Revoke a certificate
13. **Revocation Status (After)** - Verify revocation took effect
14. **CSR Flow** - Traditional certificate signing request workflow
15. **CRL Display** - Show Certificate Revocation List
16. **Cleanup** - Remove temporary demo files

## Interface Tabs

### 🖥️ Interactive Terminal Tab
- **Demo Steps Panel** - Click buttons to execute each PKI operation
- **Terminal Output** - Real-time command execution and results
- **Terminal Controls** - Clear terminal, show environment variables
- **Live Interaction** - Type commands directly in terminal

### 📊 PKI Lifecycle Diagrams Tab  
- **Step Navigation** - Select any demo step to view its diagram
- **Visual Process Flow** - SVG diagrams showing PKI operations
- **Process Descriptions** - Detailed explanations for each step

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Browser   │◄──►│  Express.js App  │◄──►│  HashiCorp      │
│                 │    │                  │    │  Vault          │
│ • Terminal UI   │    │ • Socket.IO      │    │                 │
│ • Diagrams      │    │ • node-pty       │    │ • PKI Engine    │
│ • Real-time     │    │ • Terminal Proxy │    │ • Certificates  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: Bootstrap 5, xterm.js, vanilla JavaScript
- **Terminal**: node-pty for real terminal interaction
- **Container**: Docker with Alpine Linux base
- **Tools**: Vault CLI, OpenSSL, jq, curl

## Development

### Local Development

```bash
# Install dependencies
npm install

# Set environment variables
export VAULT_ADDR="your-vault-url"
export VAULT_TOKEN="your-token"
export VAULT_NAMESPACE="admin"

# Run in development mode
npm run dev
```

### Building the Image

```bash
# Build Docker image
docker build -t vault-pki-demo .

# Run container
docker run -p 3000:3000 \
  -e VAULT_ADDR="$VAULT_ADDR" \
  -e VAULT_TOKEN="$VAULT_TOKEN" \
  -e VAULT_NAMESPACE="$VAULT_NAMESPACE" \
  vault-pki-demo
```

## Security Notes

⚠️ **Important Security Considerations**

1. **Token Security** - Never commit Vault tokens to version control
2. **Environment Variables** - Use secure methods to pass sensitive data
3. **Network Security** - Consider running on internal networks only
4. **HTTPS** - Use reverse proxy with HTTPS in production
5. **Token Permissions** - Use minimal required Vault policies

## Troubleshooting

### Common Issues

**Connection Issues:**
```bash
# Check Vault connectivity
vault status

# Verify token permissions
vault token lookup
```

**Container Issues:**
```bash
# Check container logs
docker-compose logs vault-pki-demo

# Restart container
docker-compose restart vault-pki-demo
```

**Terminal Not Working:**
- Ensure WebSocket connections are allowed
- Check browser console for JavaScript errors
- Verify network connectivity to container

## Support

For issues and questions:
- Check the main project documentation
- Review container logs: `docker-compose logs`
- Verify Vault connectivity and permissions

## Related

- [Phase 1 CLI Demo Script](../scripts/demo-magic-vault-pki.sh)
- [Terraform Configuration](../terraform/)
- [Demo Documentation](../Demo-Phase1.md)
