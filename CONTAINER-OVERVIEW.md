# 🚀 Vault PKI Demo Container - Complete Setup

## What We Built

A fully containerized, interactive web interface for demonstrating HashiCorp Vault PKI certificate lifecycle management. The container provides:

### ✨ Key Features

1. **🖥️ Interactive Terminal Tab**
   - Real-time terminal interaction using xterm.js and WebSockets
   - 15 clickable demo steps covering complete PKI lifecycle
   - Direct command execution with live output
   - Terminal controls (clear, show environment)

2. **📊 PKI Lifecycle Diagrams Tab**
   - Visual SVG diagrams for each demo step
   - Step-by-step process illustrations
   - Interactive navigation between diagrams
   - Detailed descriptions for each process

3. **🔐 Complete PKI Operations**
   - Certificate issuance (simplified and CSR-based flows)
   - Certificate renewal and revocation
   - Certificate chain verification
   - Certificate Revocation List (CRL) management
   - Cleanup and environment management

## 📁 File Structure

```
container/
├── 🐳 Docker Configuration
│   ├── Dockerfile              # Alpine Linux + Node.js + Vault CLI
│   ├── docker-compose.yml      # Service orchestration with health checks
│   ├── .dockerignore           # Build optimization
│   └── .env.example           # Environment template
│
├── 🚀 Application Core
│   ├── app.js                 # Express server with Socket.IO
│   └── package.json           # Node.js dependencies and scripts
│
├── 🌐 Web Interface
│   ├── web/templates/
│   │   └── index.ejs          # Main HTML template with Bootstrap UI
│   └── web/static/
│       ├── css/styles.css     # Custom styles and terminal theming
│       ├── js/terminal.js     # Terminal interaction and WebSocket handling
│       └── js/diagrams.js     # Diagram navigation and SVG rendering
│
└── 📚 Documentation & Scripts
    ├── README.md              # Complete documentation
    └── start-demo.sh          # One-click startup script
```

## 🛠️ Technology Stack

### Backend
- **Node.js 18** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **node-pty** - Terminal emulation for command execution

### Frontend  
- **Bootstrap 5** - Responsive UI framework
- **xterm.js** - Terminal emulator in browser
- **EJS** - Server-side templating
- **Vanilla JavaScript** - Interactive functionality

### Container
- **Alpine Linux** - Lightweight base image
- **Vault CLI 1.15.2** - HashiCorp Vault command-line tools
- **System Tools** - bash, curl, jq, openssl for PKI operations

## 🚀 Quick Start

### 1. Set Up Environment
```bash
cd container/
cp .env.example .env
# Edit .env with your Vault details
```

### 2. One-Click Start
```bash
./start-demo.sh
```

### 3. Access the Demo
- **Main Interface**: http://localhost:3000
- **Interactive Terminal**: Default tab with 15 demo steps
- **PKI Diagrams**: Visual process flows for each step

## 🎯 Demo Steps Coverage

The container implements all 15 steps from the Phase 1 CLI demo:

1. **Setup & Verification** - Token validation
2. **PKI Infrastructure** - Mount, Root CA, Role display
3. **Certificate Operations** - Issue, renew, list, verify
4. **Revocation Management** - Revoke certificates, check CRL
5. **Advanced Flows** - CSR-based certificate issuance
6. **Cleanup** - Remove temporary artifacts

## 🔧 Advanced Features

### Real-time Terminal
- Full terminal emulation with xterm.js
- WebSocket-based command execution
- Live output streaming
- Direct command input capability

### Visual Diagrams
- 15 custom SVG diagrams showing PKI processes
- Interactive navigation between steps
- Process flow illustrations
- Detailed step descriptions

### Container Orchestration
- Docker Compose with health checks
- Resource limits and restart policies
- Environment variable management
- Volume mounting for persistent data

## 🔐 Security Considerations

- Environment variable isolation
- No hardcoded credentials
- Minimal required Vault permissions
- Network security recommendations
- HTTPS proxy suggestions

## 🎉 Result

You now have a complete, production-ready containerized demo system that:

✅ **Provides interactive PKI education** with visual and hands-on learning
✅ **Runs anywhere Docker is available** with consistent behavior
✅ **Supports real-time collaboration** through web interface
✅ **Includes comprehensive documentation** for users and developers
✅ **Follows container best practices** for security and efficiency
✅ **Integrates with existing Vault infrastructure** seamlessly

The container bridges the gap between CLI demos and educational presentations, providing both visual understanding and hands-on experience with Vault PKI operations.
