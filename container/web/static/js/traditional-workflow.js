// Traditional Certificate Management Workflow
const traditionalWorkflowSVG = `
<svg width="100%" height="400" viewBox="0 0 1200 400" class="workflow-diagram">
    <defs>
        <marker id="workflow-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill="#666"/>
        </marker>
        
        <!-- Gradient for personas -->
        <linearGradient id="personaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#4a4a4a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Title -->
    <text x="600" y="25" text-anchor="middle" fill="#333" font-family="Arial" font-size="18" font-weight="bold">
        Traditional Certificate Management Process
    </text>
    
    <!-- Personas Row -->
    <!-- App Developer -->
    <rect x="40" y="50" width="140" height="120" fill="url(#personaGrad)" rx="15"/>
    <circle cx="110" cy="90" r="20" fill="#e6e6e6"/>
    <text x="110" y="95" text-anchor="middle" fill="#333" font-size="12">👨‍💻</text>
    <text x="110" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">App</text>
    <text x="110" y="140" text-anchor="middle" fill="white" font-size="12" font-weight="600">Developer</text>
    
    <!-- Portal -->
    <rect x="220" y="50" width="140" height="120" fill="url(#personaGrad)" rx="15"/>
    <rect x="265" y="85" width="50" height="35" fill="#e6e6e6" rx="5"/>
    <circle cx="275" cy="95" r="2" fill="#ff6b6b"/>
    <circle cx="280" cy="95" r="2" fill="#ffd93d"/>
    <circle cx="285" cy="95" r="2" fill="#6bcf7f"/>
    <rect x="270" y="105" width="40" height="10" fill="#ddd" rx="2"/>
    <text x="290" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">Portal</text>
    
    <!-- DevOps -->
    <rect x="400" y="50" width="140" height="120" fill="url(#personaGrad)" rx="15"/>
    <circle cx="470" cy="90" r="20" fill="#ff8c00"/>
    <text x="470" y="95" text-anchor="middle" fill="white" font-size="12">⚙️</text>
    <text x="470" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">DevOps</text>
    
    <!-- DevOps 2 -->
    <rect x="580" y="50" width="140" height="120" fill="url(#personaGrad)" rx="15"/>
    <circle cx="650" cy="90" r="20" fill="#333"/>
    <text x="650" y="95" text-anchor="middle" fill="white" font-size="12">👨‍💻</text>
    <text x="650" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">DevOps</text>
    
    <!-- Network Team -->
    <rect x="760" y="50" width="140" height="120" fill="url(#personaGrad)" rx="15"/>
    <circle cx="830" cy="90" r="20" fill="#8B4513"/>
    <text x="830" y="95" text-anchor="middle" fill="white" font-size="12">🌐</text>
    <text x="830" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">Network</text>
    <text x="830" y="140" text-anchor="middle" fill="white" font-size="12" font-weight="600">Team</text>
    
    <!-- Multiple Teams -->
    <rect x="940" y="50" width="140" height="120" fill="url(#personaGrad)" rx="15"/>
    <circle cx="1010" cy="90" r="20" fill="#ff8c00"/>
    <text x="1010" y="95" text-anchor="middle" fill="white" font-size="12">👥</text>
    <text x="1010" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">Multiple</text>
    <text x="1010" y="140" text-anchor="middle" fill="white" font-size="12" font-weight="600">Teams</text>
    
    <!-- Process Flow Arrows -->
    <path d="M 180 110 L 210 110" stroke="#666" stroke-width="3" marker-end="url(#workflow-arrow)"/>
    <path d="M 360 110 L 390 110" stroke="#666" stroke-width="3" marker-end="url(#workflow-arrow)"/>
    <path d="M 540 110 L 570 110" stroke="#666" stroke-width="3" marker-end="url(#workflow-arrow)"/>
    <path d="M 720 110 L 750 110" stroke="#666" stroke-width="3" marker-end="url(#workflow-arrow)"/>
    <path d="M 900 110 L 930 110" stroke="#666" stroke-width="3" marker-end="url(#workflow-arrow)"/>
    
    <!-- Process Steps -->
    <!-- Step 1 -->
    <rect x="60" y="190" width="100" height="60" fill="#e3f2fd" stroke="#2196F3" stroke-width="2" rx="5"/>
    <text x="110" y="210" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">Requests</text>
    <text x="110" y="225" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">new</text>
    <text x="110" y="240" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">certificate</text>
    
    <!-- Step 2 -->
    <rect x="240" y="190" width="100" height="60" fill="#e3f2fd" stroke="#2196F3" stroke-width="2" rx="5"/>
    <text x="290" y="210" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">Request</text>
    <text x="290" y="225" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">ticket</text>
    <text x="290" y="240" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">entered</text>
    
    <!-- Step 3 -->
    <rect x="420" y="190" width="100" height="60" fill="#e3f2fd" stroke="#2196F3" stroke-width="2" rx="5"/>
    <text x="470" y="210" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">Creates</text>
    <text x="470" y="225" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">new</text>
    <text x="470" y="240" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">certificate</text>
    
    <!-- Step 4 -->
    <rect x="600" y="190" width="100" height="60" fill="#e3f2fd" stroke="#2196F3" stroke-width="2" rx="5"/>
    <text x="650" y="205" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">Manually</text>
    <text x="650" y="220" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">updates</text>
    <text x="650" y="235" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">stores</text>
    
    <!-- Step 5 -->
    <rect x="780" y="190" width="100" height="60" fill="#e3f2fd" stroke="#2196F3" stroke-width="2" rx="5"/>
    <text x="830" y="205" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">Updates</text>
    <text x="830" y="220" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">network</text>
    <text x="830" y="235" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">components</text>
    
    <!-- Step 6 -->
    <rect x="960" y="190" width="100" height="60" fill="#e3f2fd" stroke="#2196F3" stroke-width="2" rx="5"/>
    <text x="1010" y="205" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">Tests and</text>
    <text x="1010" y="220" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">validates</text>
    <text x="1010" y="235" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="600">certificate</text>
    
    <!-- Connecting lines from personas to steps -->
    <path d="M 110 170 L 110 190" stroke="#999" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 290 170 L 290 190" stroke="#999" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 470 170 L 470 190" stroke="#999" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 650 170 L 650 190" stroke="#999" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 830 170 L 830 190" stroke="#999" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 1010 170 L 1010 190" stroke="#999" stroke-width="2" stroke-dasharray="3,3"/>
    
    <!-- Long feedback loop -->
    <path d="M 110 270 Q 110 300 300 300 Q 1010 300 1010 270" stroke="#ff6b6b" stroke-width="3" fill="none" stroke-dasharray="5,5"/>
    <circle cx="200" cy="302" r="3" fill="#ff6b6b"/>
    <circle cx="400" cy="302" r="3" fill="#ff6b6b"/>
    <circle cx="600" cy="302" r="3" fill="#ff6b6b"/>
    <circle cx="800" cy="302" r="3" fill="#ff6b6b"/>
    
    <!-- Certificate icon at the end -->
    <rect x="570" y="330" width="60" height="45" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="5"/>
    <circle cx="590" cy="345" r="6" fill="#4caf50"/>
    <text x="610" y="350" fill="#2e7d32" font-size="10" font-weight="600">🔒</text>
    <text x="600" y="370" text-anchor="middle" fill="#2e7d32" font-size="11" font-weight="600">Certificate live in production</text>
    
    <!-- Problems callout -->
    <rect x="20" y="320" width="200" height="70" fill="#ffebee" stroke="#f44336" stroke-width="2" rx="5" stroke-dasharray="3,3"/>
    <text x="30" y="340" fill="#d32f2f" font-size="12" font-weight="bold">⚠️ Traditional Challenges:</text>
    <text x="30" y="355" fill="#d32f2f" font-size="10">• Manual processes & human errors</text>
    <text x="30" y="370" fill="#d32f2f" font-size="10">• Long lead times & delays</text>
    <text x="30" y="385" fill="#d32f2f" font-size="10">• Multiple handoffs & coordination</text>
</svg>
`;

const vaultWorkflowSVG = `
<svg width="100%" height="300" viewBox="0 0 1000 300" class="workflow-diagram">
    <defs>
        <marker id="vault-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill="#FFD814"/>
        </marker>
        
        <!-- HashiCorp Vault gradient -->
        <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD814;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFA000;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Title -->
    <text x="500" y="25" text-anchor="middle" fill="#333" font-family="Arial" font-size="18" font-weight="bold">
        HashiCorp Vault Automated Certificate Management
    </text>
    
    <!-- App Developer -->
    <rect x="80" y="60" width="120" height="80" fill="#4a4a4a" rx="10"/>
    <circle cx="140" cy="85" r="15" fill="#FFD814"/>
    <text x="140" y="90" text-anchor="middle" fill="#333" font-size="12">👨‍💻</text>
    <text x="140" y="115" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="600">App Developer</text>
    
    <!-- API Call -->
    <path d="M 200 100 L 280 100" stroke="#FFD814" stroke-width="4" marker-end="url(#vault-arrow)"/>
    <text x="240" y="95" text-anchor="middle" fill="#FFD814" font-family="Arial" font-size="11" font-weight="600">API Call</text>
    
    <!-- HashiCorp Vault -->
    <rect x="290" y="50" width="200" height="100" fill="url(#vaultGrad)" rx="15"/>
    <text x="390" y="80" text-anchor="middle" fill="#333" font-family="Arial" font-size="16" font-weight="bold">HashiCorp Vault</text>
    <text x="390" y="100" text-anchor="middle" fill="#333" font-family="Arial" font-size="12">PKI Secrets Engine</text>
    <text x="390" y="120" text-anchor="middle" fill="#333" font-family="Arial" font-size="11">• Automated Certificate Issuance</text>
    <text x="390" y="135" text-anchor="middle" fill="#333" font-family="Arial" font-size="11">• Policy-Based Management</text>
    
    <!-- Certificate Response -->
    <path d="M 490 100 L 570 100" stroke="#4CAF50" stroke-width="4" marker-end="url(#vault-arrow)"/>
    <text x="530" y="95" text-anchor="middle" fill="#4CAF50" font-family="Arial" font-size="11" font-weight="600">Certificate</text>
    
    <!-- Application -->
    <rect x="580" y="70" width="120" height="60" fill="#4CAF50" rx="10"/>
    <circle cx="640" cy="90" r="12" fill="white"/>
    <text x="640" y="95" text-anchor="middle" fill="#4CAF50" font-size="12">🔒</text>
    <text x="640" y="115" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="600">Secured App</text>
    
    <!-- Benefits callout -->
    <rect x="750" y="60" width="220" height="120" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="5"/>
    <text x="760" y="80" fill="#2e7d32" font-size="12" font-weight="bold">✅ HashiCorp Vault Benefits:</text>
    <text x="760" y="100" fill="#2e7d32" font-size="10">• Automated certificate lifecycle</text>
    <text x="760" y="115" fill="#2e7d32" font-size="10">• Instant certificate issuance</text>
    <text x="760" y="130" fill="#2e7d32" font-size="10">• Policy-driven security controls</text>
    <text x="760" y="145" fill="#2e7d32" font-size="10">• Built-in rotation & renewal</text>
    <text x="760" y="160" fill="#2e7d32" font-size="10">• Audit trails & compliance</text>
    <text x="760" y="175" fill="#2e7d32" font-size="10">• Zero human intervention needed</text>
    
    <!-- Time comparison -->
    <text x="500" y="220" text-anchor="middle" fill="#ff6b6b" font-family="Arial" font-size="14" font-weight="600">
        Traditional Process: Days to Weeks
    </text>
    <text x="500" y="240" text-anchor="middle" fill="#4CAF50" font-family="Arial" font-size="14" font-weight="600">
        HashiCorp Vault: Seconds to Minutes
    </text>
    
    <!-- Process flow indicator -->
    <rect x="100" y="190" width="600" height="4" fill="#FFD814" rx="2"/>
    <text x="400" y="210" text-anchor="middle" fill="#FFD814" font-family="Arial" font-size="12" font-weight="600">
        Streamlined, Automated Workflow
    </text>
</svg>
`;
