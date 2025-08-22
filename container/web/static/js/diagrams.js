// Diagram functionality
document.addEventListener('DOMContentLoaded', function() {
    const diagramNavButtons = document.querySelectorAll('.diagram-nav');
    const diagramContainer = document.getElementById('diagram-container');
    
    // Load workflow comparison diagrams
    const traditionalContainer = document.getElementById('traditional-workflow-container');
    const vaultContainer = document.getElementById('vault-workflow-container');
    
    if (traditionalContainer && typeof traditionalWorkflowSVG !== 'undefined') {
        traditionalContainer.innerHTML = traditionalWorkflowSVG;
    }
    
    if (vaultContainer && typeof vaultWorkflowSVG !== 'undefined') {
        vaultContainer.innerHTML = vaultWorkflowSVG;
    }
    
    // PKI Lifecycle diagrams as SVG
    const diagrams = {
        'token-verification': {
            title: 'Token Verification',
            svg: `
                <svg width="600" height="300" viewBox="0 0 600 300" class="diagram-svg">
                    <!-- Security Admin persona -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="80" r="15" fill="#FFD814"/>
                    <text x="110" y="110" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="600">Security</text>
                    <text x="110" y="125" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="600">Admin</text>
                    
                    <!-- Arrow -->
                    <path d="M 170 90 L 230 90" stroke="#6B6B73" stroke-width="3" marker-end="url(#arrow)"/>
                    
                    <!-- Action box -->
                    <rect x="240" y="60" width="140" height="60" fill="#E6F3FF" stroke="#0066CC" stroke-width="2" rx="5"/>
                    <text x="310" y="80" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="11" font-weight="600">Validates token</text>
                    <text x="310" y="95" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="11" font-weight="600">permissions and</text>
                    <text x="310" y="110" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="11" font-weight="600">authentication</text>
                    
                    <!-- Arrow to result -->
                    <path d="M 380 90 L 440 90" stroke="#6B6B73" stroke-width="3" marker-end="url(#arrow)"/>
                    
                    <!-- Vault result -->
                    <circle cx="480" cy="90" r="40" fill="#0066CC"/>
                    <text x="480" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Vault</text>
                    <text x="480" y="95" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Access</text>
                    <text x="480" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Granted</text>
                    
                    <!-- Workflow description -->
                    <text x="300" y="180" text-anchor="middle" fill="#4a4a4a" font-family="Arial" font-size="14" font-weight="600">Authentication & Authorization Flow</text>
                    <text x="300" y="200" text-anchor="middle" fill="#6B6B73" font-family="Arial" font-size="11">Security admin validates token before PKI operations begin</text>
                    
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6B6B73"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Security admin validates authentication tokens before allowing PKI operations.'
        },
        
        'pki-mount': {
            title: 'PKI Infrastructure Setup',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Platform Engineering Team -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Platform</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Engineering</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 230 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="200" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">provisions</text>
                    
                    <!-- Vault Configuration -->
                    <rect x="240" y="50" width="160" height="80" fill="#FFD814" stroke="#e0a800" stroke-width="2" rx="10"/>
                    <text x="320" y="70" text-anchor="middle" fill="#212529" font-family="Arial" font-size="12" font-weight="bold">🏛️ Vault Cluster</text>
                    <text x="320" y="90" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">PKI Engine Enabled</text>
                    <text x="320" y="105" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">Mount: /pki-demo</text>
                    <text x="320" y="118" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">HA Configuration</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 400 90 L 460 90" stroke="#FFD814" stroke-width="3" marker-end="url(#arrowYellow)"/>
                    <text x="430" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">secures</text>
                    
                    <!-- Enterprise Applications -->
                    <rect x="470" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="530" cy="75" r="12" fill="#FFD814"/>
                    <text x="530" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Enterprise</text>
                    <text x="530" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Applications</text>
                    
                    <!-- Infrastructure Components -->
                    <rect x="150" y="180" width="120" height="60" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="5"/>
                    <text x="210" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">🔐 HSM Integration</text>
                    <text x="210" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Hardware Security</text>
                    <text x="210" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Key Protection</text>
                    
                    <rect x="300" y="180" width="120" height="60" fill="#17a2b8" stroke="#117a8b" stroke-width="2" rx="5"/>
                    <text x="360" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">📊 Audit Logging</text>
                    <text x="360" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Compliance</text>
                    <text x="360" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Monitoring</text>
                    
                    <rect x="450" y="180" width="120" height="60" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="510" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">⚡ Load Balancing</text>
                    <text x="510" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">High Availability</text>
                    <text x="510" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Failover</text>
                    
                    <!-- Arrows to infrastructure -->
                    <path d="M 280 130 L 210 170" stroke="#28a745" stroke-width="2" marker-end="url(#arrowGreen)"/>
                    <path d="M 320 130 L 360 170" stroke="#17a2b8" stroke-width="2" marker-end="url(#arrowBlue)"/>
                    <path d="M 360 130 L 510 170" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray)"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#FFD814" font-family="Arial" font-size="16" font-weight="bold">Enterprise PKI Infrastructure Deployment</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowYellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#FFD814"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#17a2b8"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Enterprise PKI infrastructure setup showing platform engineering team provisioning Vault cluster.'
        },
        
        'root-ca': {
            title: 'Root Certificate Authority Establishment',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Security Executive -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Security</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Executive</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 230 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="200" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">authorizes</text>
                    
                    <!-- Root CA Creation -->
                    <rect x="240" y="50" width="140" height="80" fill="#28a745" stroke="#1e7e34" stroke-width="3" rx="10"/>
                    <text x="310" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🏛️ Root CA</text>
                    <text x="310" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Corporate Trust Anchor</text>
                    <text x="310" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10">10 Year Validity</text>
                    <text x="310" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10">4096-bit RSA</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 380 90 L 440 90" stroke="#28a745" stroke-width="3" marker-end="url(#arrowGreen)"/>
                    <text x="410" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">establishes</text>
                    
                    <!-- Trust Hierarchy -->
                    <rect x="450" y="30" width="120" height="50" fill="#FFD814" stroke="#e0a800" stroke-width="2" rx="5"/>
                    <text x="510" y="50" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10" font-weight="600">Enterprise</text>
                    <text x="510" y="65" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10" font-weight="600">Trust Store</text>
                    
                    <rect x="450" y="100" width="120" height="50" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="510" y="120" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Intermediate</text>
                    <text x="510" y="135" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">CAs</text>
                    
                    <!-- Arrow down to intermediate -->
                    <path d="M 510 80 L 510 90" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray)"/>
                    
                    <!-- Governance Process -->
                    <rect x="150" y="180" width="160" height="60" fill="#17a2b8" stroke="#117a8b" stroke-width="2" rx="5"/>
                    <text x="230" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">🔐 Certificate Policy</text>
                    <text x="230" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Governance Framework</text>
                    <text x="230" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Compliance Standards</text>
                    
                    <!-- Backup & DR -->
                    <rect x="340" y="180" width="160" height="60" fill="#DC3545" stroke="#721C24" stroke-width="2" rx="5"/>
                    <text x="420" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">💾 Key Escrow</text>
                    <text x="420" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Disaster Recovery</text>
                    <text x="420" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">HSM Backup</text>
                    
                    <!-- Arrows from root CA to processes -->
                    <path d="M 270 130 L 230 170" stroke="#17a2b8" stroke-width="2" marker-end="url(#arrowBlue)"/>
                    <path d="M 350 130 L 420 170" stroke="#DC3545" stroke-width="2" marker-end="url(#arrowRed)"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="16" font-weight="bold">Corporate Root CA Establishment</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#17a2b8"/>
                        </marker>
                        <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#DC3545"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Corporate root CA establishment showing security executive authorization and trust hierarchy setup.'
        },
        
        'pki-role': {
            title: 'Certificate Role & Policy Configuration',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Security Architect -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Security</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Architect</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 220 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="195" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">defines</text>
                    
                    <!-- Certificate Policies -->
                    <rect x="230" y="40" width="180" height="100" fill="#007bff" stroke="#0056b3" stroke-width="2" rx="10"/>
                    <text x="320" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">📋 Certificate Policy</text>
                    
                    <!-- Policy Details -->
                    <rect x="240" y="75" width="70" height="20" fill="#17a2b8" rx="3"/>
                    <text x="275" y="88" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Max TTL: 24h</text>
                    
                    <rect x="320" y="75" width="80" height="20" fill="#ffc107" rx="3"/>
                    <text x="360" y="88" text-anchor="middle" fill="#212529" font-family="Arial" font-size="8">RSA 2048</text>
                    
                    <rect x="240" y="105" width="80" height="20" fill="#28a745" rx="3"/>
                    <text x="280" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="8">SAN Allowed</text>
                    
                    <rect x="330" y="105" width="70" height="20" fill="#dc3545" rx="3"/>
                    <text x="365" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="8">*.domain</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 410 90 L 460 90" stroke="#007bff" stroke-width="3" marker-end="url(#arrowBlue)"/>
                    <text x="435" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">enables</text>
                    
                    <!-- Different Teams -->
                    <rect x="470" y="30" width="100" height="50" fill="#4a4a4a" rx="8"/>
                    <circle cx="520" cy="50" r="8" fill="#FFD814"/>
                    <text x="520" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Web Team</text>
                    
                    <rect x="470" y="95" width="100" height="50" fill="#4a4a4a" rx="8"/>
                    <circle cx="520" cy="115" r="8" fill="#FFD814"/>
                    <text x="520" y="135" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">API Team</text>
                    
                    <!-- Compliance Framework -->
                    <rect x="200" y="180" width="160" height="60" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="280" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">⚖️ Compliance</text>
                    <text x="280" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">FIPS 140-2</text>
                    <text x="280" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">SOC 2 Type II</text>
                    
                    <!-- Automation Integration -->
                    <rect x="390" y="180" width="160" height="60" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="5"/>
                    <text x="470" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">🔄 Automation</text>
                    <text x="470" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">CI/CD Integration</text>
                    <text x="470" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Auto-renewal</text>
                    
                    <!-- Arrows to supporting systems -->
                    <path d="M 280 140 L 280 170" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray)"/>
                    <path d="M 470 140 L 470 170" stroke="#28a745" stroke-width="2" marker-end="url(#arrowGreen)"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="16" font-weight="bold">Certificate Role &amp; Policy Framework</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#007bff"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Certificate role and policy configuration showing security architect defining governance framework.'
        },
        
        'certificate-issuance': {
            title: 'Certificate Request Workflow',
            svg: `
                <svg width="800" height="400" viewBox="0 0 800 400" class="diagram-svg">
                    <!-- App Developer -->
                    <rect x="50" y="50" width="100" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="100" cy="75" r="12" fill="#FFD814"/>
                    <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">App</text>
                    <text x="100" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Developer</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 150 90 L 190 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow1)"/>
                    
                    <!-- Request new certificate action -->
                    <rect x="200" y="65" width="100" height="50" fill="#E6F3FF" stroke="#0066CC" stroke-width="1" rx="3"/>
                    <text x="250" y="85" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="10">Requests new</text>
                    <text x="250" y="98" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="10">certificate</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 300 90 L 340 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow1)"/>
                    
                    <!-- Portal -->
                    <rect x="350" y="50" width="100" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="400" cy="75" r="12" fill="#FFD814"/>
                    <text x="400" y="110" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Portal</text>
                    
                    <!-- Arrow 3 -->
                    <path d="M 450 90 L 490 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow1)"/>
                    
                    <!-- Request ticket entered action -->
                    <rect x="500" y="65" width="100" height="50" fill="#E6F3FF" stroke="#0066CC" stroke-width="1" rx="3"/>
                    <text x="550" y="85" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="10">Request</text>
                    <text x="550" y="98" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="10">ticket entered</text>
                    
                    <!-- Arrow 4 (down to DevOps) -->
                    <path d="M 550 115 L 550 170" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow1)"/>
                    
                    <!-- DevOps -->
                    <rect x="500" y="180" width="100" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="550" cy="205" r="12" fill="#FFD814"/>
                    <text x="550" y="240" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">DevOps</text>
                    
                    <!-- Arrow 5 -->
                    <path d="M 500 220 L 460 220" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow1)"/>
                    
                    <!-- Creates new certificate action -->
                    <rect x="350" y="195" width="100" height="50" fill="#FFD814" stroke="#4a4a4a" stroke-width="1" rx="3"/>
                    <text x="400" y="215" text-anchor="middle" fill="#4a4a4a" font-family="Arial" font-size="10" font-weight="600">Creates</text>
                    <text x="400" y="228" text-anchor="middle" fill="#4a4a4a" font-family="Arial" font-size="10" font-weight="600">new certificate</text>
                    
                    <!-- Arrow 6 (curved back to developer) -->
                    <path d="M 350 220 Q 200 280 100 160" stroke="#4a4a4a" stroke-width="3" fill="none" marker-end="url(#arrow1)"/>
                    
                    <!-- Certificate live in production -->
                    <rect x="250" y="320" width="200" height="40" fill="#E6F3FF" stroke="#0066CC" stroke-width="2" rx="5"/>
                    <circle cx="275" cy="340" r="8" fill="#0066CC"/>
                    <text x="350" y="345" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="12" font-weight="600">Certificate live in production</text>
                    
                    <defs>
                        <marker id="arrow1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'End-to-end certificate request workflow showing organizational roles and handoffs.'
        },
        
        'certificate-details': {
            title: 'Certificate Inspection & Validation',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Security Auditor -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Security</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Auditor</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 220 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="195" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">inspects</text>
                    
                    <!-- Certificate Analysis -->
                    <rect x="230" y="40" width="200" height="100" fill="#007bff" stroke="#0056b3" stroke-width="2" rx="10"/>
                    <text x="330" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🔍 Certificate Analysis</text>
                    
                    <!-- Certificate Details -->
                    <rect x="240" y="75" width="80" height="18" fill="#28a745" rx="2"/>
                    <text x="280" y="87" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Subject: CN=app</text>
                    
                    <rect x="340" y="75" width="80" height="18" fill="#17a2b8" rx="2"/>
                    <text x="380" y="87" text-anchor="middle" fill="white" font-family="Arial" font-size="8">RSA 2048</text>
                    
                    <rect x="240" y="100" width="80" height="18" fill="#ffc107" rx="2"/>
                    <text x="280" y="112" text-anchor="middle" fill="#212529" font-family="Arial" font-size="8">Valid 24h</text>
                    
                    <rect x="340" y="100" width="80" height="18" fill="#dc3545" rx="2"/>
                    <text x="380" y="112" text-anchor="middle" fill="white" font-family="Arial" font-size="8">SHA256</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 430 90 L 480 90" stroke="#007bff" stroke-width="3" marker-end="url(#arrowBlue)"/>
                    <text x="455" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">validates</text>
                    
                    <!-- Compliance Check -->
                    <rect x="490" y="50" width="120" height="80" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="10"/>
                    <text x="550" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">✅ Compliance</text>
                    <text x="550" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Policy Match</text>
                    <text x="550" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Chain Valid</text>
                    <text x="550" y="115" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Not Revoked</text>
                    
                    <!-- Validation Results -->
                    <rect x="150" y="180" width="160" height="60" fill="#20c997" stroke="#138f6f" stroke-width="2" rx="5"/>
                    <text x="230" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">📊 Validation Report</text>
                    <text x="230" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Cryptographic strength</text>
                    <text x="230" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Expiration tracking</text>
                    
                    <!-- Risk Assessment -->
                    <rect x="340" y="180" width="160" height="60" fill="#fd7e14" stroke="#dc6502" stroke-width="2" rx="5"/>
                    <text x="420" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">⚠️ Risk Assessment</text>
                    <text x="420" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Renewal timeline</text>
                    <text x="420" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Usage monitoring</text>
                    
                    <!-- Arrows to reports -->
                    <path d="M 300 140 L 230 170" stroke="#20c997" stroke-width="2" marker-end="url(#arrowTeal)"/>
                    <path d="M 360 140 L 420 170" stroke="#fd7e14" stroke-width="2" marker-end="url(#arrowOrange)"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="16" font-weight="bold">Certificate Inspection &amp; Validation Workflow</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#007bff"/>
                        </marker>
                        <marker id="arrowTeal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#20c997"/>
                        </marker>
                        <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#fd7e14"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Certificate inspection workflow showing security auditor validating certificate details and compliance.'
        },
        
        'certificate-list': {
            title: 'Certificate Portfolio Management',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Certificate Manager -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Certificate</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Manager</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 220 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="195" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">manages</text>
                    
                    <!-- Certificate Inventory -->
                    <rect x="230" y="30" width="180" height="120" fill="#007bff" stroke="#0056b3" stroke-width="2" rx="10"/>
                    <text x="320" y="50" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">📋 Certificate Portfolio</text>
                    
                    <!-- Active Certificates -->
                    <rect x="240" y="65" width="70" height="18" fill="#28a745" rx="2"/>
                    <text x="275" y="77" text-anchor="middle" fill="white" font-family="Arial" font-size="8">12 Active</text>
                    
                    <!-- Expiring Soon -->
                    <rect x="320" y="65" width="80" height="18" fill="#ffc107" rx="2"/>
                    <text x="360" y="77" text-anchor="middle" fill="#212529" font-family="Arial" font-size="8">3 Expiring</text>
                    
                    <!-- Revoked -->
                    <rect x="240" y="90" width="70" height="18" fill="#dc3545" rx="2"/>
                    <text x="275" y="102" text-anchor="middle" fill="white" font-family="Arial" font-size="8">2 Revoked</text>
                    
                    <!-- Pending Renewal -->
                    <rect x="320" y="90" width="80" height="18" fill="#6f42c1" rx="2"/>
                    <text x="360" y="102" text-anchor="middle" fill="white" font-family="Arial" font-size="8">5 Pending</text>
                    
                    <!-- Risk Assessment -->
                    <rect x="240" y="115" width="160" height="25" fill="#fd7e14" rx="3"/>
                    <text x="320" y="132" text-anchor="middle" fill="white" font-family="Arial" font-size="10">⚠️ High Risk: 2 expiring in 7 days</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 410 90 L 460 90" stroke="#007bff" stroke-width="3" marker-end="url(#arrowBlue)"/>
                    <text x="435" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">reports to</text>
                    
                    <!-- Multiple Stakeholders -->
                    <rect x="470" y="30" width="100" height="50" fill="#4a4a4a" rx="8"/>
                    <circle cx="520" cy="50" r="8" fill="#FFD814"/>
                    <text x="520" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">DevOps Teams</text>
                    
                    <rect x="470" y="95" width="100" height="50" fill="#4a4a4a" rx="8"/>
                    <circle cx="520" cy="115" r="8" fill="#FFD814"/>
                    <text x="520" y="135" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Security Team</text>
                    
                    <!-- Analytics Dashboard -->
                    <rect x="200" y="180" width="180" height="60" fill="#20c997" stroke="#138f6f" stroke-width="2" rx="5"/>
                    <text x="290" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">📊 Analytics Dashboard</text>
                    <text x="290" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Usage patterns</text>
                    <text x="290" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Renewal forecasts</text>
                    
                    <!-- Compliance Reports -->
                    <rect x="400" y="180" width="180" height="60" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="490" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">📋 Compliance Reports</text>
                    <text x="490" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Policy adherence</text>
                    <text x="490" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Audit trails</text>
                    
                    <!-- Arrows to reports -->
                    <path d="M 290 150 L 290 170" stroke="#20c997" stroke-width="2" marker-end="url(#arrowTeal)"/>
                    <path d="M 490 150 L 490 170" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray2)"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="16" font-weight="bold">Enterprise Certificate Portfolio Management</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowGray2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6C757D"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#007bff"/>
                        </marker>
                        <marker id="arrowTeal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#20c997"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Enterprise certificate portfolio management showing certificate manager overseeing organizational certificate inventory.'
        },
        
        'certificate-chain': {
            title: 'Trust Chain Validation Workflow',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Trust Officer -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Trust</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Officer</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 220 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="195" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">validates</text>
                    
                    <!-- Trust Hierarchy -->
                    <rect x="230" y="30" width="200" height="120" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="10"/>
                    <text x="330" y="50" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🏛️ Trust Hierarchy</text>
                    
                    <!-- Root CA Level -->
                    <rect x="250" y="65" width="70" height="20" fill="#006400" rx="3"/>
                    <text x="285" y="78" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Root CA</text>
                    
                    <!-- Intermediate CA Level -->
                    <rect x="340" y="65" width="70" height="20" fill="#32CD32" rx="3"/>
                    <text x="375" y="78" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Intermediate</text>
                    
                    <!-- End Entity Level -->
                    <rect x="290" y="95" width="80" height="20" fill="#90EE90" rx="3"/>
                    <text x="330" y="108" text-anchor="middle" fill="#000" font-family="Arial" font-size="9">End Entity</text>
                    
                    <!-- Trust Path -->
                    <path d="M 285 85 L 330 95" stroke="#FFD814" stroke-width="2" marker-end="url(#arrowYellow)"/>
                    <path d="M 375 85 L 330 95" stroke="#FFD814" stroke-width="2" marker-end="url(#arrowYellow)"/>
                    
                    <!-- Arrow 2 -->
                    <path d="M 430 90 L 480 90" stroke="#28a745" stroke-width="3" marker-end="url(#arrowGreen)"/>
                    <text x="455" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">enables</text>
                    
                    <!-- Business Applications -->
                    <rect x="490" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="550" cy="75" r="12" fill="#FFD814"/>
                    <text x="550" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Business</text>
                    <text x="550" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Applications</text>
                    
                    <!-- Validation Process -->
                    <rect x="150" y="180" width="180" height="60" fill="#17a2b8" stroke="#117a8b" stroke-width="2" rx="5"/>
                    <text x="240" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">🔍 Chain Validation</text>
                    <text x="240" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Signature verification</text>
                    <text x="240" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Path length constraints</text>
                    
                    <!-- Policy Enforcement -->
                    <rect x="360" y="180" width="180" height="60" fill="#DC3545" stroke="#721C24" stroke-width="2" rx="5"/>
                    <text x="450" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">⚖️ Policy Enforcement</text>
                    <text x="450" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Certificate usage</text>
                    <text x="450" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Revocation checking</text>
                    
                    <!-- Arrows to validation processes -->
                    <path d="M 290 150 L 240 170" stroke="#17a2b8" stroke-width="2" marker-end="url(#arrowBlue)"/>
                    <path d="M 370 150 L 450 170" stroke="#DC3545" stroke-width="2" marker-end="url(#arrowRed)"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="16" font-weight="bold">Enterprise Trust Chain Validation</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowYellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#FFD814"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#17a2b8"/>
                        </marker>
                        <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#DC3545"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Trust chain validation workflow showing trust officer validating certificate hierarchy for business applications.'
        },
        
        'certificate-renewal': {
            title: 'Certificate Renewal Workflow',
            svg: `
                <svg width="800" height="400" viewBox="0 0 800 400" class="diagram-svg">
                    <!-- Network Team -->
                    <rect x="50" y="50" width="100" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="100" cy="75" r="12" fill="#FFD814"/>
                    <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Network</text>
                    <text x="100" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Team</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 150 90 L 200 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow2)"/>
                    
                    <!-- Updates network components action -->
                    <rect x="210" y="65" width="120" height="50" fill="#FFD814" stroke="#4a4a4a" stroke-width="1" rx="3"/>
                    <text x="270" y="85" text-anchor="middle" fill="#4a4a4a" font-family="Arial" font-size="10" font-weight="600">Updates network</text>
                    <text x="270" y="98" text-anchor="middle" fill="#4a4a4a" font-family="Arial" font-size="10" font-weight="600">components</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 330 90 L 380 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow2)"/>
                    
                    <!-- Multiple Teams -->
                    <rect x="390" y="50" width="100" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="440" cy="75" r="12" fill="#FFD814"/>
                    <text x="440" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Multiple</text>
                    <text x="440" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Teams</text>
                    
                    <!-- Arrow 3 -->
                    <path d="M 490 90 L 540 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrow2)"/>
                    
                    <!-- Tests and validates certificate action -->
                    <rect x="550" y="65" width="120" height="50" fill="#E6F3FF" stroke="#0066CC" stroke-width="1" rx="3"/>
                    <text x="610" y="85" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="10">Tests and</text>
                    <text x="610" y="98" text-anchor="middle" fill="#0066CC" font-family="Arial" font-size="10">validates certificate</text>
                    
                    <!-- Renewal cycle indicators -->
                    <rect x="50" y="200" width="120" height="40" fill="#FFF3CD" stroke="#856404" stroke-width="1" rx="3"/>
                    <text x="110" y="220" text-anchor="middle" fill="#856404" font-family="Arial" font-size="11" font-weight="600">Certificate Expiry</text>
                    <text x="110" y="233" text-anchor="middle" fill="#856404" font-family="Arial" font-size="9">Approaching</text>
                    
                    <rect x="230" y="200" width="120" height="40" fill="#D4EDDA" stroke="#155724" stroke-width="1" rx="3"/>
                    <text x="290" y="220" text-anchor="middle" fill="#155724" font-family="Arial" font-size="11" font-weight="600">Auto-Renewal</text>
                    <text x="290" y="233" text-anchor="middle" fill="#155724" font-family="Arial" font-size="9">Triggered</text>
                    
                    <rect x="410" y="200" width="120" height="40" fill="#CCE5FF" stroke="#004085" stroke-width="1" rx="3"/>
                    <text x="470" y="220" text-anchor="middle" fill="#004085" font-family="Arial" font-size="11" font-weight="600">Zero-Downtime</text>
                    <text x="470" y="233" text-anchor="middle" fill="#004085" font-family="Arial" font-size="9">Deployment</text>
                    
                    <!-- Workflow arrows -->
                    <path d="M 170 220 L 220 220" stroke="#6B6B73" stroke-width="2" marker-end="url(#arrow2)"/>
                    <path d="M 350 220 L 400 220" stroke="#6B6B73" stroke-width="2" marker-end="url(#arrow2)"/>
                    
                    <!-- Title -->
                    <text x="400" y="30" text-anchor="middle" fill="#4a4a4a" font-family="Arial" font-size="16" font-weight="bold">Certificate Renewal & Distribution</text>
                    
                    <defs>
                        <marker id="arrow2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Certificate renewal workflow showing team collaboration and zero-downtime deployment.'
        },
        
        'certificate-revocation': {
            title: 'Certificate Revocation Workflow',
            svg: `
                <svg width="700" height="350" viewBox="0 0 700 350" class="diagram-svg">
                    <!-- Security Incident -->
                    <rect x="50" y="50" width="120" height="60" fill="#DC3545" stroke="#721C24" stroke-width="2" rx="5"/>
                    <text x="110" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">⚠️ Security</text>
                    <text x="110" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">Incident</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 80 L 220 80" stroke="#DC3545" stroke-width="3" marker-end="url(#arrowRed)"/>
                    
                    <!-- Security Admin -->
                    <rect x="230" y="50" width="100" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="280" cy="75" r="12" fill="#FFD814"/>
                    <text x="280" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Security</text>
                    <text x="280" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Admin</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 330 90 L 380 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    
                    <!-- Immediate Revocation -->
                    <rect x="390" y="65" width="120" height="50" fill="#DC3545" stroke="#721C24" stroke-width="2" rx="3"/>
                    <text x="450" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="bold">IMMEDIATE</text>
                    <text x="450" y="98" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="bold">REVOCATION</text>
                    
                    <!-- Arrow down to CRL -->
                    <path d="M 450 115 L 450 170" stroke="#DC3545" stroke-width="3" marker-end="url(#arrowRed)"/>
                    
                    <!-- CRL Update -->
                    <rect x="380" y="180" width="140" height="60" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="450" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">CRL Updated</text>
                    <text x="450" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Certificate added</text>
                    <text x="450" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">to revocation list</text>
                    
                    <!-- Arrows to affected teams -->
                    <path d="M 380 210 L 280 210" stroke="#DC3545" stroke-width="2" marker-end="url(#arrowRed)"/>
                    <path d="M 280 210 L 180 210" stroke="#DC3545" stroke-width="2" marker-end="url(#arrowRed)"/>
                    <path d="M 520 210 L 570 210" stroke="#DC3545" stroke-width="2" marker-end="url(#arrowRed)"/>
                    
                    <!-- DevOps Team -->
                    <rect x="50" y="250" width="100" height="70" fill="#4a4a4a" rx="10"/>
                    <circle cx="100" cy="270" r="10" fill="#FFD814"/>
                    <text x="100" y="295" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">DevOps</text>
                    <text x="100" y="307" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Team</text>
                    
                    <!-- Network Team -->
                    <rect x="180" y="250" width="100" height="70" fill="#4a4a4a" rx="10"/>
                    <circle cx="230" cy="270" r="10" fill="#FFD814"/>
                    <text x="230" y="295" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Network</text>
                    <text x="230" y="307" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Team</text>
                    
                    <!-- App Teams -->
                    <rect x="550" y="250" width="100" height="70" fill="#4a4a4a" rx="10"/>
                    <circle cx="600" cy="270" r="10" fill="#FFD814"/>
                    <text x="600" y="295" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">App</text>
                    <text x="600" y="307" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Teams</text>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#DC3545" font-family="Arial" font-size="16" font-weight="bold">Emergency Certificate Revocation</text>
                    
                    <defs>
                        <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#DC3545"/>
                        </marker>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Emergency certificate revocation workflow showing immediate response to security incidents.'
        },
        
        'csr-flow': {
            title: 'Certificate Signing Request Workflow',
            svg: `
                <svg width="800" height="350" viewBox="0 0 800 350" class="diagram-svg">
                    <!-- Application Developer -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">App</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Developer</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 230 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="200" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">generates</text>
                    
                    <!-- CSR Creation -->
                    <rect x="240" y="65" width="100" height="50" fill="#17a2b8" stroke="#117a8b" stroke-width="2" rx="5"/>
                    <text x="290" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">CSR</text>
                    <text x="290" y="98" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Certificate</text>
                    <text x="290" y="110" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Request</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 340 90 L 400 90" stroke="#17a2b8" stroke-width="3" marker-end="url(#arrowBlue)"/>
                    <text x="370" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">submits</text>
                    
                    <!-- Security Team -->
                    <rect x="410" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="470" cy="75" r="12" fill="#FFD814"/>
                    <text x="470" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Security</text>
                    <text x="470" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Team</text>
                    
                    <!-- Arrow 3 -->
                    <path d="M 470 130 L 470 180" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="485" y="155" fill="#666" font-family="Arial" font-size="9">reviews</text>
                    
                    <!-- Approval Process -->
                    <rect x="400" y="190" width="140" height="60" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="5"/>
                    <text x="470" y="210" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">APPROVED</text>
                    <text x="470" y="225" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Domain validation</text>
                    <text x="470" y="238" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Policy compliance</text>
                    
                    <!-- Arrow 4 -->
                    <path d="M 540 220 L 590 220" stroke="#28a745" stroke-width="3" marker-end="url(#arrowGreen)"/>
                    <text x="565" y="215" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">triggers</text>
                    
                    <!-- Certificate Issuance -->
                    <rect x="600" y="190" width="120" height="60" fill="#ffc107" stroke="#e0a800" stroke-width="2" rx="5"/>
                    <text x="660" y="210" text-anchor="middle" fill="#212529" font-family="Arial" font-size="11" font-weight="600">✓ Certificate</text>
                    <text x="660" y="225" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">Issued &amp;</text>
                    <text x="660" y="238" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">Deployed</text>
                    
                    <!-- Feedback Arrow -->
                    <path d="M 600 180 Q 350 150 170 130" stroke="#28a745" stroke-width="2" marker-end="url(#arrowGreen)" fill="none"/>
                    <text x="350" y="145" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">certificate delivered</text>
                    
                    <!-- Title -->
                    <text x="400" y="25" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="16" font-weight="bold">CSR-based Certificate Workflow</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#17a2b8"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'CSR-based workflow showing developer-initiated certificate requests with security team approval.'
        },
        
        'crl-list': {
            title: 'Certificate Revocation List Management',
            svg: `
                <svg width="700" height="350" viewBox="0 0 700 350" class="diagram-svg">
                    <!-- Security Operations Center -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Security</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Operations</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 230 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="200" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">maintains</text>
                    
                    <!-- CRL Management -->
                    <rect x="240" y="65" width="140" height="50" fill="#DC3545" stroke="#721C24" stroke-width="2" rx="5"/>
                    <text x="310" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">🗂️ CRL Database</text>
                    <text x="310" y="98" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Revoked Certificates</text>
                    
                    <!-- Distribution -->
                    <rect x="450" y="40" width="100" height="40" fill="#17a2b8" stroke="#117a8b" stroke-width="2" rx="3"/>
                    <text x="500" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Distribution</text>
                    <text x="500" y="72" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Points</text>
                    
                    <!-- Network Infrastructure -->
                    <rect x="450" y="100" width="100" height="40" fill="#4a4a4a" rx="8"/>
                    <circle cx="500" cy="115" r="8" fill="#FFD814"/>
                    <text x="500" y="135" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Network Team</text>
                    
                    <!-- Applications -->
                    <rect x="450" y="160" width="100" height="40" fill="#4a4a4a" rx="8"/>
                    <circle cx="500" cy="175" r="8" fill="#FFD814"/>
                    <text x="500" y="195" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="600">Applications</text>
                    
                    <!-- Arrows to consumers -->
                    <path d="M 380 75 L 440 60" stroke="#17a2b8" stroke-width="2" marker-end="url(#arrowBlue)"/>
                    <path d="M 380 85 L 440 120" stroke="#4a4a4a" stroke-width="2" marker-end="url(#arrowGray)"/>
                    <path d="M 380 95 L 440 180" stroke="#4a4a4a" stroke-width="2" marker-end="url(#arrowGray)"/>
                    
                    <!-- Real-time Updates -->
                    <rect x="220" y="180" width="180" height="60" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="5"/>
                    <text x="310" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">📡 Real-time Updates</text>
                    <text x="310" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">OCSP Responder</text>
                    <text x="310" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Push Notifications</text>
                    
                    <!-- Arrow from CRL to Real-time -->
                    <path d="M 310 115 L 310 170" stroke="#28a745" stroke-width="3" marker-end="url(#arrowGreen)"/>
                    
                    <!-- Status Board -->
                    <rect x="550" y="260" width="120" height="60" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="610" y="280" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">📊 Monitoring</text>
                    <text x="610" y="295" text-anchor="middle" fill="white" font-family="Arial" font-size="9">CRL Distribution</text>
                    <text x="610" y="308" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Health Status</text>
                    
                    <!-- Monitor arrows -->
                    <path d="M 500 200 Q 575 230 575 260" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray)" fill="none"/>
                    <path d="M 400 210 Q 500 235 550 290" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray)" fill="none"/>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#DC3545" font-family="Arial" font-size="16" font-weight="bold">CRL Management &amp; Distribution</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#17a2b8"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'CRL management workflow showing security operations team maintaining and distributing revocation lists.'
        },
        
        'cleanup': {
            title: 'PKI Lifecycle Management Cleanup',
            svg: `
                <svg width="700" height="300" viewBox="0 0 700 300" class="diagram-svg">
                    <!-- Operations Team -->
                    <rect x="50" y="50" width="120" height="80" fill="#4a4a4a" rx="10"/>
                    <circle cx="110" cy="75" r="12" fill="#FFD814"/>
                    <text x="110" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Operations</text>
                    <text x="110" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="600">Team</text>
                    
                    <!-- Arrow 1 -->
                    <path d="M 170 90 L 220 90" stroke="#4a4a4a" stroke-width="3" marker-end="url(#arrowGray)"/>
                    <text x="195" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">executes</text>
                    
                    <!-- Cleanup Process -->
                    <rect x="230" y="50" width="180" height="80" fill="#28a745" stroke="#1e7e34" stroke-width="2" rx="10"/>
                    <text x="320" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🧹 Cleanup Process</text>
                    <text x="320" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Secure artifact removal</text>
                    <text x="320" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Audit trail maintenance</text>
                    <text x="320" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Environment restoration</text>
                    
                    <!-- Arrow 2 -->
                    <path d="M 410 90 L 460 90" stroke="#28a745" stroke-width="3" marker-end="url(#arrowGreen)"/>
                    <text x="435" y="85" text-anchor="middle" fill="#666" font-family="Arial" font-size="9">ensures</text>
                    
                    <!-- System Integrity -->
                    <rect x="470" y="50" width="120" height="80" fill="#007bff" stroke="#0056b3" stroke-width="2" rx="10"/>
                    <text x="530" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">🔒 System</text>
                    <text x="530" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">Integrity</text>
                    <text x="530" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="10">PKI Foundation</text>
                    <text x="530" y="118" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Preserved</text>
                    
                    <!-- Cleanup Items -->
                    <rect x="150" y="180" width="160" height="60" fill="#ffc107" stroke="#e0a800" stroke-width="2" rx="5"/>
                    <text x="230" y="200" text-anchor="middle" fill="#212529" font-family="Arial" font-size="11" font-weight="600">✓ Demo Artifacts</text>
                    <text x="230" y="215" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">Temporary certificates</text>
                    <text x="230" y="228" text-anchor="middle" fill="#212529" font-family="Arial" font-size="10">Test keys removed</text>
                    
                    <!-- Compliance -->
                    <rect x="340" y="180" width="160" height="60" fill="#6C757D" stroke="#495057" stroke-width="2" rx="5"/>
                    <text x="420" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="600">📋 Compliance</text>
                    <text x="420" y="215" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Audit logs retained</text>
                    <text x="420" y="228" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Policy enforcement</text>
                    
                    <!-- Arrows to details -->
                    <path d="M 280 130 L 230 170" stroke="#ffc107" stroke-width="2" marker-end="url(#arrowYellow)"/>
                    <path d="M 360 130 L 420 170" stroke="#6C757D" stroke-width="2" marker-end="url(#arrowGray2)"/>
                    
                    <!-- Production Ready -->
                    <rect x="250" y="260" width="200" height="30" fill="#20c997" stroke="#138f6f" stroke-width="2" rx="15"/>
                    <text x="350" y="280" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🚀 Production Ready Environment</text>
                    
                    <!-- Title -->
                    <text x="350" y="25" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="16" font-weight="bold">Enterprise PKI Lifecycle Cleanup</text>
                    
                    <defs>
                        <marker id="arrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4a4a4a"/>
                        </marker>
                        <marker id="arrowGray2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6C757D"/>
                        </marker>
                        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#28a745"/>
                        </marker>
                        <marker id="arrowYellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ffc107"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Enterprise PKI lifecycle cleanup showing operations team maintaining system integrity while removing demo artifacts.'
        }
    };
    
    // Handle diagram navigation
    diagramNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const diagramId = this.getAttribute('data-diagram');
            
            // Update active state
            diagramNavButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Load diagram
            loadDiagram(diagramId);
        });
    });
    
    function loadDiagram(diagramId) {
        const diagram = diagrams[diagramId];
        
        if (diagram) {
            diagramContainer.innerHTML = `
                <div class="text-center">
                    <h4 class="mb-3 text-primary">${diagram.title}</h4>
                    ${diagram.svg}
                    <p class="mt-3 text-muted">${diagram.description}</p>
                </div>
            `;
        } else {
            diagramContainer.innerHTML = `
                <div class="text-center">
                    <h4 class="text-danger">Diagram Not Found</h4>
                    <p class="text-muted">The requested diagram "${diagramId}" is not available.</p>
                </div>
            `;
        }
    }
    
    // Load first diagram by default
    if (diagramNavButtons.length > 0) {
        diagramNavButtons[0].click();
    }
});
