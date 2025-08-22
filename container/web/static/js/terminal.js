// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Socket.IO connection
    const socket = io();
    
    // Initialize xterm.js terminal
    const terminal = new Terminal({
        cursorBlink: true,
        theme: {
            background: '#1e1e1e',
            foreground: '#ffffff',
            cursor: '#ffffff',
            selection: '#3366cc',
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#e5e5e5'
        },
        fontSize: 14,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        cols: 120,
        rows: 30,
        convertEol: true
    });
    
    const fitAddon = new FitAddon.FitAddon();
    terminal.loadAddon(fitAddon);
    
    // Mount terminal to DOM
    const terminalElement = document.getElementById('terminal');
    terminal.open(terminalElement);
    fitAddon.fit();
    
    // Connection status management
    const connectionStatus = document.getElementById('connection-status');
    
    // Socket event handlers
    socket.on('connect', function() {
        connectionStatus.textContent = 'Connected';
        connectionStatus.className = 'badge bg-success';
        console.log('Connected to server');
    });
    
    socket.on('disconnect', function() {
        connectionStatus.textContent = 'Disconnected';
        connectionStatus.className = 'badge bg-danger';
        console.log('Disconnected from server');
    });
    
    socket.on('terminal-output', function(data) {
        terminal.write(data);
    });
    
    // Send terminal input to server
    terminal.onData(function(data) {
        socket.emit('terminal-input', data);
    });
    
    // Demo step execution
    const executeButtons = document.querySelectorAll('.execute-step');
    executeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stepId = this.getAttribute('data-step');
            const stepTitle = this.textContent.trim();
            
            // Visual feedback
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
            
            // Execute the step
            socket.emit('execute-step', stepId);
            
            // Log the execution
            console.log(`Executing step: ${stepId} - ${stepTitle}`);
        });
    });
    
    // Terminal control buttons
    document.getElementById('clear-terminal').addEventListener('click', function() {
        terminal.clear();
        socket.emit('terminal-input', '\x0c'); // Form feed character to clear screen
    });
    
    document.getElementById('show-env').addEventListener('click', function() {
        socket.emit('terminal-input', 'echo "=== Vault Environment ==="; echo "VAULT_ADDR: $VAULT_ADDR"; echo "VAULT_NAMESPACE: $VAULT_NAMESPACE"; echo "VAULT_TOKEN: ${VAULT_TOKEN:0:10}..."; echo\r');
    });
    
    // Resize terminal when window resizes
    window.addEventListener('resize', function() {
        setTimeout(() => {
            fitAddon.fit();
        }, 100);
    });
    
    // Tab change handler to resize terminal
    document.getElementById('terminal-tab').addEventListener('shown.bs.tab', function() {
        setTimeout(() => {
            fitAddon.fit();
        }, 100);
    });
    
    // Welcome message
    setTimeout(() => {
        terminal.write('\r\n');
        terminal.write('\x1b[32m=== Welcome to HashiCorp Vault PKI Demo ===\x1b[0m\r\n');
        terminal.write('\x1b[36mClick the demo steps on the left to execute PKI operations\x1b[0m\r\n');
        terminal.write('\x1b[33mTip: You can also type commands directly in this terminal\x1b[0m\r\n');
        terminal.write('\r\n$ ');
    }, 500);
});
