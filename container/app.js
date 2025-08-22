const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'web/templates'));

// Serve static files
app.use(express.static(path.join(__dirname, 'web/static')));
app.use(express.json());

// PKI Demo steps configuration
const demoSteps = [
  {
    id: 'setup',
    title: 'Initial Setup - Token Verification',
    description: 'Verify authentication and token permissions',
    command: 'vault token lookup',
    diagram: 'token-verification'
  },
  {
    id: 'step1_1',
    title: '1.1 Show PKI Mount',
    description: 'Display PKI secrets engine mount and configuration',
    command: 'vault secrets list | grep -E "\\bpki-demo\\b" || true; vault read sys/mounts/pki-demo',
    diagram: 'pki-mount'
  },
  {
    id: 'step1_2',
    title: '1.2 Show Root CA Certificate',
    description: 'Display root Certificate Authority certificate',
    command: 'vault read pki-demo/cert/ca',
    diagram: 'root-ca'
  },
  {
    id: 'step1_3',
    title: '1.3 Show PKI Role Configuration',
    description: 'Display PKI role settings for certificate issuance',
    command: 'vault read pki-demo/roles/role-pki-demo',
    diagram: 'pki-role'
  },
  {
    id: 'step1_4',
    title: '1.4 Generate CSR and Sign (Traditional Flow)',
    description: 'Demonstrate traditional CSR-based certificate flow',
    command: 'CN="csr.app.$(date +%s).david-joo.sbx.hashidemos.io"; \\\n' +
             'openssl genrsa -out /tmp/demo.key 2048; \\\n' +
             'openssl req -new -key /tmp/demo.key -out /tmp/demo.csr -subj "/CN=$CN"; \\\n' +
             'vault write -format=json pki-demo/sign/role-pki-demo csr=@/tmp/demo.csr | jq -r \'.data.certificate\' > /tmp/demo.crt; \\\n' +
             'openssl x509 -in /tmp/demo.crt -text -noout | head -10',
    diagram: 'csr-flow'
  },
  {
    id: 'step1_5',
    title: '1.5 Issue Certificate (Simplified Flow)',
    description: 'Issue a new certificate using Vault\'s simplified flow',
    command: 'CN="app.$(date +%s).david-joo.sbx.hashidemos.io"; vault write -format=json pki-demo/issue/role-pki-demo common_name="$CN" ttl="5m" | tee /tmp/pki-cert-1.json',
    diagram: 'certificate-issuance'
  },
  {
    id: 'step1_6',
    title: '1.6 Show Certificate Details',
    description: 'Extract and display certificate information',
    command: 'SERIAL1=$(jq -r \'.data.serial_number\' /tmp/pki-cert-1.json); echo "Certificate Serial: $SERIAL1"; jq -r \'.data.certificate\' /tmp/pki-cert-1.json | openssl x509 -text -noout | head -20',
    diagram: 'certificate-details'
  },
  {
    id: 'step1_6',
    title: '1.6 Show Certificate Details',
    description: 'Extract and display certificate information',
    command: 'SERIAL1=$(jq -r \'.data.serial_number\' /tmp/pki-cert-1.json); echo "Certificate Serial: $SERIAL1"; jq -r \'.data.certificate\' /tmp/pki-cert-1.json | openssl x509 -text -noout | head -20',
    diagram: 'certificate-details'
  },
  {
    id: 'step1_7',
    title: '1.7 List Existing Certificates',
    description: 'Show all certificates in the PKI store',
    command: 'vault list pki-demo/certs',
    diagram: 'certificate-list'
  },
  {
    id: 'step1_8',
    title: '1.8 Verify Certificate Chain',
    description: 'Validate certificate\'s issuer and chain of trust',
    command: 'jq -r \'.data.certificate\' /tmp/pki-cert-1.json | openssl x509 -issuer -noout; vault read pki-demo/cert/ca | grep -A5 \'certificate\' | openssl x509 -subject -noout',
    diagram: 'certificate-chain'
  },
  {
    id: 'step1_9',
    title: '1.9 Certificate Renewal',
    description: 'Issue a new certificate for the same CN (renewal)',
    command: 'CN="app.$(date +%s).david-joo.sbx.hashidemos.io"; vault write -format=json pki-demo/issue/role-pki-demo common_name="$CN" ttl="5m" | tee /tmp/pki-cert-2.json',
    diagram: 'certificate-renewal'
  },
  {
    id: 'step1_10',
    title: '1.10 Show New Certificate Details',
    description: 'Display details of the renewed certificate',
    command: 'SERIAL2=$(jq -r \'.data.serial_number\' /tmp/pki-cert-2.json); vault read pki-demo/cert/$SERIAL2',
    diagram: 'new-certificate'
  },
  {
    id: 'step1_11',
    title: '1.11 Check Revocation Status (Before)',
    description: 'Show certificate status before revocation',
    command: 'SERIAL1=$(jq -r \'.data.serial_number\' /tmp/pki-cert-1.json); vault read pki-demo/cert/$SERIAL1 | grep -E \'(revocation_time|state)\'',
    diagram: 'revocation-before'
  },
  {
    id: 'step1_12',
    title: '1.12 Revoke Certificate',
    description: 'Revoke the first certificate',
    command: 'SERIAL1=$(jq -r \'.data.serial_number\' /tmp/pki-cert-1.json); vault write pki-demo/revoke serial_number=$SERIAL1',
    diagram: 'certificate-revocation'
  },
  {
    id: 'step1_13',
    title: '1.13 Check Revocation Status (After)',
    description: 'Show certificate status after revocation',
    command: 'SERIAL1=$(jq -r \'.data.serial_number\' /tmp/pki-cert-1.json); vault read pki-demo/cert/$SERIAL1 | grep -E \'(revocation_time|state)\'',
    diagram: 'revocation-after'
  },
  {
    id: 'step1_14',
    title: '1.14 Certificate Revocation List',
    description: 'Display CRL with revoked certificates',
    command: 'curl -s -H "X-Vault-Token: $VAULT_TOKEN" -H "X-Vault-Namespace: $VAULT_NAMESPACE" https://djoo-test-vault-public-vault-a40e8748.a3bc1cae.z1.hashicorp.cloud:8200/v1/pki-demo/crl/pem | head -10',
    diagram: 'crl-list'
  },
  {
    id: 'step1_15',
    title: '1.15 Cleanup',
    description: 'Remove temporary files',
    command: 'rm -f /tmp/pki-cert-*.json /tmp/demo.key /tmp/demo.csr /tmp/demo.crt; echo "✅ Cleanup complete!"',
    diagram: 'cleanup'
  }
];

// Routes
app.get('/', (req, res) => {
  res.render('index', { demoSteps });
});

app.get('/diagrams', (req, res) => {
  res.render('diagrams', { demoSteps });
});

app.get('/api/steps', (req, res) => {
  res.json(demoSteps);
});

// Socket.IO for terminal interaction
io.on('connection', (socket) => {
  console.log('Client connected');

  // Create a new terminal session
  const terminal = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 120,
    rows: 30,
    cwd: process.env.HOME || '/app',
    env: {
      ...process.env,
      VAULT_ADDR: process.env.VAULT_ADDR || '',
      VAULT_TOKEN: process.env.VAULT_TOKEN || '',
      VAULT_NAMESPACE: process.env.VAULT_NAMESPACE || ''
    }
  });

  // Send terminal data to client
  terminal.on('data', (data) => {
    socket.emit('terminal-output', data);
  });

  // Receive input from client
  socket.on('terminal-input', (data) => {
    terminal.write(data);
  });

  // Execute demo step
  socket.on('execute-step', (stepId) => {
    const step = demoSteps.find(s => s.id === stepId);
    if (step) {
      // Send clear screen command first
      terminal.write('\x0c');
      
      // Display header and description directly to client - back to original colors
      setTimeout(() => {
        const headerText = `\x1b[32m=== ${step.title} ===\x1b[0m\r\n`;
        const descText = `\x1b[36m${step.description}\x1b[0m\r\n\r\n`;
        const promptText = `$ ${step.command}\r\n`;
        
        // Send display text directly to terminal output
        socket.emit('terminal-output', headerText);
        socket.emit('terminal-output', descText);
        socket.emit('terminal-output', promptText);
        
        // Execute the actual command after a short delay
        setTimeout(() => {
          terminal.write(`${step.command}\r`);
        }, 100);
      }, 50);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    terminal.kill();
  });
});

const PORT = process.env.PORT || 3020;
server.listen(PORT, () => {
  console.log(`🚀 Vault PKI Demo running on http://localhost:${PORT}`);
  console.log(`📊 Diagrams: http://localhost:${PORT}/diagrams`);
});
