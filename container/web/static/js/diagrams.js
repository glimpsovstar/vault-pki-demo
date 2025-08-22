// Diagram functionality
document.addEventListener('DOMContentLoaded', function() {
    const diagramNavButtons = document.querySelectorAll('.diagram-nav');
    const diagramContainer = document.getElementById('diagram-container');
    
    // PKI Lifecycle diagrams as SVG
    const diagrams = {
        'token-verification': {
            title: 'Token Verification',
            svg: `
                <svg width="400" height="200" viewBox="0 0 400 200" class="diagram-svg">
                    <rect x="50" y="50" width="100" height="60" fill="#007bff" rx="5"/>
                    <text x="100" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="12">Client</text>
                    
                    <rect x="250" y="50" width="100" height="60" fill="#28a745" rx="5"/>
                    <text x="300" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="12">Vault Server</text>
                    
                    <path d="M 150 70 L 240 70" stroke="#6c757d" stroke-width="2" marker-end="url(#arrowhead)"/>
                    <text x="195" y="65" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="10">Token Lookup</text>
                    
                    <path d="M 240 90 L 150 90" stroke="#6c757d" stroke-width="2" marker-end="url(#arrowhead)"/>
                    <text x="195" y="105" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="10">Token Details</text>
                    
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6c757d"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Verify the authentication token and its permissions with Vault.'
        },
        
        'pki-mount': {
            title: 'PKI Mount Configuration',
            svg: `
                <svg width="400" height="250" viewBox="0 0 400 250" class="diagram-svg">
                    <rect x="50" y="50" width="300" height="150" fill="none" stroke="#007bff" stroke-width="2" rx="10"/>
                    <text x="200" y="40" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="14" font-weight="bold">Vault Server</text>
                    
                    <rect x="80" y="80" width="100" height="40" fill="#ffc107" rx="5"/>
                    <text x="130" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="11">PKI Engine</text>
                    
                    <rect x="220" y="80" width="100" height="40" fill="#17a2b8" rx="5"/>
                    <text x="270" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Mount: pki-demo</text>
                    
                    <rect x="150" y="140" width="100" height="40" fill="#28a745" rx="5"/>
                    <text x="200" y="165" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Root CA</text>
                </svg>
            `,
            description: 'Display the PKI secrets engine mount point and configuration.'
        },
        
        'root-ca': {
            title: 'Root Certificate Authority',
            svg: `
                <svg width="400" height="200" viewBox="0 0 400 200" class="diagram-svg">
                    <circle cx="200" cy="100" r="80" fill="#28a745" opacity="0.1"/>
                    <circle cx="200" cy="100" r="60" fill="#28a745"/>
                    <text x="200" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">Root CA</text>
                    <text x="200" y="110" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Certificate</text>
                    
                    <text x="200" y="25" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="14" font-weight="bold">Trust Anchor</text>
                    
                    <g transform="translate(320, 100)">
                        <rect x="-20" y="-15" width="40" height="30" fill="#ffc107" rx="3"/>
                        <text x="0" y="5" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Key</text>
                    </g>
                </svg>
            `,
            description: 'Root Certificate Authority that serves as the trust anchor for all issued certificates.'
        },
        
        'pki-role': {
            title: 'PKI Role Configuration',
            svg: `
                <svg width="500" height="200" viewBox="0 0 500 200" class="diagram-svg">
                    <rect x="50" y="50" width="400" height="100" fill="none" stroke="#007bff" stroke-width="2" rx="10"/>
                    <text x="250" y="40" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="14" font-weight="bold">PKI Role: role-pki-demo</text>
                    
                    <rect x="70" y="70" width="80" height="30" fill="#17a2b8" rx="3"/>
                    <text x="110" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Max TTL: 24h</text>
                    
                    <rect x="170" y="70" width="80" height="30" fill="#ffc107" rx="3"/>
                    <text x="210" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Allow Subdomains</text>
                    
                    <rect x="270" y="70" width="80" height="30" fill="#28a745" rx="3"/>
                    <text x="310" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Key Type: RSA</text>
                    
                    <rect x="370" y="70" width="60" height="30" fill="#dc3545" rx="3"/>
                    <text x="400" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Key Size: 2048</text>
                    
                    <text x="250" y="130" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="11">Domain: *.david-joo.sbx.hashidemos.io</text>
                </svg>
            `,
            description: 'PKI role defines the parameters and constraints for certificate issuance.'
        },
        
        'certificate-issuance': {
            title: 'Certificate Issuance Flow',
            svg: `
                <svg width="500" height="300" viewBox="0 0 500 300" class="diagram-svg">
                    <rect x="50" y="50" width="80" height="50" fill="#007bff" rx="5"/>
                    <text x="90" y="80" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Client Request</text>
                    
                    <rect x="200" y="50" width="100" height="50" fill="#ffc107" rx="5"/>
                    <text x="250" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="10">PKI Engine</text>
                    <text x="250" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Validation</text>
                    
                    <rect x="370" y="50" width="80" height="50" fill="#28a745" rx="5"/>
                    <text x="410" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Certificate</text>
                    <text x="410" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Issued</text>
                    
                    <path d="M 130 75 L 190 75" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="160" y="70" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="9">CN + TTL</text>
                    
                    <path d="M 300 75 L 360 75" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="330" y="70" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="9">Cert + Key</text>
                    
                    <!-- Certificate Storage -->
                    <rect x="150" y="150" width="200" height="80" fill="none" stroke="#17a2b8" stroke-width="2" stroke-dasharray="5,5" rx="5"/>
                    <text x="250" y="170" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="12">Certificate Store</text>
                    
                    <circle cx="200" cy="200" r="15" fill="#28a745"/>
                    <text x="200" y="205" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Cert</text>
                    
                    <circle cx="250" cy="200" r="15" fill="#ffc107"/>
                    <text x="250" y="205" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Meta</text>
                    
                    <circle cx="300" cy="200" r="15" fill="#dc3545"/>
                    <text x="300" y="205" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Serial</text>
                    
                    <path d="M 250 100 L 250 140" stroke="#17a2b8" stroke-width="2" marker-end="url(#arrow)"/>
                    
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6c757d"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Complete certificate issuance flow from request to storage.'
        },
        
        'certificate-details': {
            title: 'Certificate Details & Metadata',
            svg: `
                <svg width="400" height="300" viewBox="0 0 400 300" class="diagram-svg">
                    <rect x="50" y="30" width="300" height="240" fill="none" stroke="#007bff" stroke-width="2" rx="10"/>
                    <text x="200" y="20" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="14" font-weight="bold">Certificate Details</text>
                    
                    <rect x="70" y="50" width="260" height="25" fill="#28a745" rx="3"/>
                    <text x="200" y="67" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Subject: CN=app.timestamp.domain.io</text>
                    
                    <rect x="70" y="85" width="260" height="25" fill="#17a2b8" rx="3"/>
                    <text x="200" y="102" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Issuer: CN=Vault PKI Demo Root CA</text>
                    
                    <rect x="70" y="120" width="120" height="25" fill="#ffc107" rx="3"/>
                    <text x="130" y="137" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Serial Number</text>
                    
                    <rect x="210" y="120" width="120" height="25" fill="#6f42c1" rx="3"/>
                    <text x="270" y="137" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Key Usage</text>
                    
                    <rect x="70" y="155" width="120" height="25" fill="#fd7e14" rx="3"/>
                    <text x="130" y="172" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Not Before</text>
                    
                    <rect x="210" y="155" width="120" height="25" fill="#e83e8c" rx="3"/>
                    <text x="270" y="172" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Not After</text>
                    
                    <rect x="70" y="190" width="260" height="25" fill="#20c997" rx="3"/>
                    <text x="200" y="207" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Public Key Algorithm: RSA 2048</text>
                    
                    <rect x="70" y="225" width="260" height="25" fill="#6c757d" rx="3"/>
                    <text x="200" y="242" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Signature Algorithm: SHA256-RSA</text>
                </svg>
            `,
            description: 'Detailed view of certificate metadata including subject, validity period, and cryptographic details.'
        },
        
        'certificate-list': {
            title: 'Certificate Inventory',
            svg: `
                <svg width="400" height="250" viewBox="0 0 400 250" class="diagram-svg">
                    <rect x="50" y="30" width="300" height="190" fill="none" stroke="#007bff" stroke-width="2" rx="10"/>
                    <text x="200" y="20" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="14" font-weight="bold">PKI Certificate Store</text>
                    
                    <!-- Table Header -->
                    <rect x="70" y="50" width="260" height="25" fill="#6c757d" rx="3"/>
                    <text x="90" y="67" fill="white" font-family="Arial" font-size="10">Serial</text>
                    <text x="160" y="67" fill="white" font-family="Arial" font-size="10">Status</text>
                    <text x="220" y="67" fill="white" font-family="Arial" font-size="10">Expires</text>
                    <text x="290" y="67" fill="white" font-family="Arial" font-size="10">CN</text>
                    
                    <!-- Certificate Entries -->
                    <rect x="70" y="85" width="260" height="20" fill="#28a745" opacity="0.8" rx="2"/>
                    <text x="90" y="98" fill="white" font-family="Arial" font-size="9">1a:2b:3c...</text>
                    <text x="160" y="98" fill="white" font-family="Arial" font-size="9">Valid</text>
                    <text x="220" y="98" fill="white" font-family="Arial" font-size="9">5m</text>
                    <text x="290" y="98" fill="white" font-family="Arial" font-size="9">app.1...</text>
                    
                    <rect x="70" y="110" width="260" height="20" fill="#dc3545" opacity="0.8" rx="2"/>
                    <text x="90" y="123" fill="white" font-family="Arial" font-size="9">4d:5e:6f...</text>
                    <text x="160" y="123" fill="white" font-family="Arial" font-size="9">Revoked</text>
                    <text x="220" y="123" fill="white" font-family="Arial" font-size="9">-</text>
                    <text x="290" y="123" fill="white" font-family="Arial" font-size="9">app.2...</text>
                    
                    <rect x="70" y="135" width="260" height="20" fill="#ffc107" opacity="0.8" rx="2"/>
                    <text x="90" y="148" fill="white" font-family="Arial" font-size="9">7g:8h:9i...</text>
                    <text x="160" y="148" fill="white" font-family="Arial" font-size="9">Valid</text>
                    <text x="220" y="148" fill="white" font-family="Arial" font-size="9">10m</text>
                    <text x="290" y="148" fill="white" font-family="Arial" font-size="9">csr.app...</text>
                    
                    <text x="200" y="175" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="10">Total: 3 certificates</text>
                    <text x="200" y="195" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="10">2 Valid • 1 Revoked</text>
                </svg>
            `,
            description: 'Inventory view showing all certificates stored in the PKI engine with their status.'
        },
        
        'certificate-chain': {
            title: 'Certificate Chain Verification',
            svg: `
                <svg width="400" height="250" viewBox="0 0 400 250" class="diagram-svg">
                    <!-- Root CA -->
                    <rect x="150" y="30" width="100" height="40" fill="#28a745" rx="5"/>
                    <text x="200" y="50" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Root CA</text>
                    <text x="200" y="65" text-anchor="middle" fill="white" font-family="Arial" font-size="9">(Self-Signed)</text>
                    
                    <!-- Arrow down -->
                    <path d="M 200 70 L 200 110" stroke="#6c757d" stroke-width="3" marker-end="url(#arrow)"/>
                    <text x="220" y="95" fill="#6c757d" font-family="Arial" font-size="9">Signs</text>
                    
                    <!-- End Entity Certificate -->
                    <rect x="150" y="120" width="100" height="40" fill="#007bff" rx="5"/>
                    <text x="200" y="140" text-anchor="middle" fill="white" font-family="Arial" font-size="11">End Entity</text>
                    <text x="200" y="155" text-anchor="middle" fill="white" font-family="Arial" font-size="9">Certificate</text>
                    
                    <!-- Verification Steps -->
                    <rect x="300" y="80" width="80" height="90" fill="none" stroke="#17a2b8" stroke-width="2" stroke-dasharray="3,3" rx="5"/>
                    <text x="340" y="95" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="9">Verification</text>
                    <text x="340" y="110" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="8">1. Check Issuer</text>
                    <text x="340" y="125" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="8">2. Verify Signature</text>
                    <text x="340" y="140" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="8">3. Check Validity</text>
                    <text x="340" y="155" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="8">4. Check Revocation</text>
                    
                    <!-- Trust indication -->
                    <circle cx="200" cy="200" r="25" fill="#28a745" opacity="0.2"/>
                    <text x="200" y="207" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="12" font-weight="bold">✓ Trusted</text>
                    
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6c757d"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Certificate chain validation showing the trust relationship between Root CA and issued certificates.'
        },
        
        'certificate-renewal': {
            title: 'Certificate Renewal Process',
            svg: `
                <svg width="500" height="200" viewBox="0 0 500 200" class="diagram-svg">
                    <!-- Old Certificate -->
                    <rect x="50" y="50" width="80" height="50" fill="#dc3545" rx="5"/>
                    <text x="90" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Old Cert</text>
                    <text x="90" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Expiring</text>
                    
                    <!-- Renewal Process -->
                    <rect x="200" y="50" width="100" height="50" fill="#ffc107" rx="5"/>
                    <text x="250" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Renewal</text>
                    <text x="250" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Request</text>
                    
                    <!-- New Certificate -->
                    <rect x="370" y="50" width="80" height="50" fill="#28a745" rx="5"/>
                    <text x="410" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10">New Cert</text>
                    <text x="410" y="85" text-anchor="middle" fill="white" font-family="Arial" font-size="8">Fresh TTL</text>
                    
                    <!-- Arrows -->
                    <path d="M 130 75 L 190 75" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="160" y="70" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="9">Same CN</text>
                    
                    <path d="M 300 75 L 360 75" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="330" y="70" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="9">New Serial</text>
                    
                    <!-- Timeline -->
                    <line x1="50" y1="150" x2="450" y2="150" stroke="#6c757d" stroke-width="2"/>
                    <text x="90" y="140" text-anchor="middle" fill="#dc3545" font-family="Arial" font-size="9">Expires Soon</text>
                    <text x="250" y="140" text-anchor="middle" fill="#ffc107" font-family="Arial" font-size="9">Renewal Time</text>
                    <text x="410" y="140" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="9">New Validity</text>
                    
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6c757d"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Certificate renewal process showing transition from expiring to fresh certificate with new TTL.'
        },
        
        'certificate-revocation': {
            title: 'Certificate Revocation Process',
            svg: `
                <svg width="400" height="250" viewBox="0 0 400 250" class="diagram-svg">
                    <!-- Valid Certificate -->
                    <rect x="50" y="50" width="80" height="50" fill="#28a745" rx="5"/>
                    <text x="90" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Valid</text>
                    <text x="90" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Certificate</text>
                    
                    <!-- Revocation Process -->
                    <rect x="200" y="50" width="100" height="50" fill="#dc3545" rx="5"/>
                    <text x="250" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="11">REVOKE</text>
                    <text x="250" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="11">Command</text>
                    
                    <!-- Arrow -->
                    <path d="M 130 75 L 190 75" stroke="#dc3545" stroke-width="3" marker-end="url(#redarrow)"/>
                    
                    <!-- CRL Update -->
                    <rect x="150" y="150" width="100" height="50" fill="#6c757d" rx="5"/>
                    <text x="200" y="170" text-anchor="middle" fill="white" font-family="Arial" font-size="10">CRL</text>
                    <text x="200" y="185" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Updated</text>
                    
                    <!-- Arrow down -->
                    <path d="M 250 100 L 200 140" stroke="#6c757d" stroke-width="2" marker-end="url(#greyarrow)"/>
                    
                    <!-- Revoked Status -->
                    <text x="90" y="130" text-anchor="middle" fill="#dc3545" font-family="Arial" font-size="12" font-weight="bold">❌ REVOKED</text>
                    
                    <defs>
                        <marker id="redarrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#dc3545"/>
                        </marker>
                        <marker id="greyarrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6c757d"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Certificate revocation process showing status change and CRL update.'
        },
        
        'csr-flow': {
            title: 'CSR-Based Certificate Flow',
            svg: `
                <svg width="500" height="300" viewBox="0 0 500 300" class="diagram-svg">
                    <!-- Client generates key pair -->
                    <rect x="50" y="50" width="80" height="40" fill="#007bff" rx="5"/>
                    <text x="90" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Generate Key</text>
                    
                    <!-- Create CSR -->
                    <rect x="50" y="120" width="80" height="40" fill="#17a2b8" rx="5"/>
                    <text x="90" y="145" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Create CSR</text>
                    
                    <!-- Submit to Vault -->
                    <rect x="200" y="120" width="100" height="40" fill="#ffc107" rx="5"/>
                    <text x="250" y="145" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Submit to Vault</text>
                    
                    <!-- Vault Signs -->
                    <rect x="370" y="120" width="80" height="40" fill="#28a745" rx="5"/>
                    <text x="410" y="145" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Signed Cert</text>
                    
                    <!-- Private Key (stays with client) -->
                    <rect x="50" y="220" width="80" height="40" fill="#6f42c1" rx="5"/>
                    <text x="90" y="245" text-anchor="middle" fill="white" font-family="Arial" font-size="10">Private Key</text>
                    
                    <!-- Arrows -->
                    <path d="M 90 90 L 90 110" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <path d="M 130 140 L 190 140" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <path d="M 300 140 L 360 140" stroke="#6c757d" stroke-width="2" marker-end="url(#arrow)"/>
                    <path d="M 90 160 L 90 210" stroke="#6f42c1" stroke-width="2" stroke-dasharray="5,5"/>
                    
                    <!-- Labels -->
                    <text x="90" y="105" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="8">RSA 2048</text>
                    <text x="160" y="135" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="8">CSR</text>
                    <text x="330" y="135" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="8">Certificate</text>
                    <text x="130" y="205" text-anchor="middle" fill="#6f42c1" font-family="Arial" font-size="8">Never Leaves Client</text>
                    
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6c757d"/>
                        </marker>
                    </defs>
                </svg>
            `,
            description: 'Traditional CSR-based certificate flow where client generates keys and submits signing request.'
        },
        
        'crl-list': {
            title: 'Certificate Revocation List (CRL)',
            svg: `
                <svg width="400" height="250" viewBox="0 0 400 250" class="diagram-svg">
                    <rect x="50" y="30" width="300" height="190" fill="none" stroke="#dc3545" stroke-width="2" rx="10"/>
                    <text x="200" y="20" text-anchor="middle" fill="#dc3545" font-family="Arial" font-size="14" font-weight="bold">Certificate Revocation List</text>
                    
                    <!-- CRL Header -->
                    <rect x="70" y="50" width="260" height="25" fill="#6c757d" rx="3"/>
                    <text x="200" y="67" text-anchor="middle" fill="white" font-family="Arial" font-size="11">CRL Version: 2 | Issuer: Vault PKI Demo Root CA</text>
                    
                    <!-- Revoked Certificates -->
                    <rect x="70" y="85" width="260" height="20" fill="#dc3545" opacity="0.8" rx="2"/>
                    <text x="90" y="98" fill="white" font-family="Arial" font-size="9">Serial: 1a:2b:3c:4d:5e:6f</text>
                    <text x="250" y="98" fill="white" font-family="Arial" font-size="9">Revoked: 2024-01-15</text>
                    
                    <rect x="70" y="110" width="260" height="20" fill="#dc3545" opacity="0.6" rx="2"/>
                    <text x="90" y="123" fill="white" font-family="Arial" font-size="9">Serial: 7g:8h:9i:0j:1k:2l</text>
                    <text x="250" y="123" fill="white" font-family="Arial" font-size="9">Revoked: 2024-01-14</text>
                    
                    <!-- CRL Footer -->
                    <rect x="70" y="140" width="260" height="25" fill="#6c757d" rx="3"/>
                    <text x="90" y="157" fill="white" font-family="Arial" font-size="9">Next Update: 24h</text>
                    <text x="250" y="157" fill="white" font-family="Arial" font-size="9">Signature: SHA256-RSA</text>
                    
                    <!-- Usage note -->
                    <text x="200" y="185" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="10">Used by clients to check certificate validity</text>
                    <text x="200" y="200" text-anchor="middle" fill="#17a2b8" font-family="Arial" font-size="10">Available via HTTP endpoint</text>
                </svg>
            `,
            description: 'Certificate Revocation List showing all revoked certificates with timestamps.'
        },
        
        'cleanup': {
            title: 'Demo Cleanup',
            svg: `
                <svg width="400" height="200" viewBox="0 0 400 200" class="diagram-svg">
                    <rect x="100" y="50" width="200" height="100" fill="none" stroke="#28a745" stroke-width="2" stroke-dasharray="5,5" rx="10"/>
                    <text x="200" y="40" text-anchor="middle" fill="#28a745" font-family="Arial" font-size="14" font-weight="bold">Cleanup Complete</text>
                    
                    <!-- Cleanup items -->
                    <text x="120" y="80" fill="#28a745" font-family="Arial" font-size="11">✓ Temporary files removed</text>
                    <text x="120" y="100" fill="#28a745" font-family="Arial" font-size="11">✓ Keys and CSRs cleaned</text>
                    <text x="120" y="120" fill="#28a745" font-family="Arial" font-size="11">✓ Demo artifacts cleared</text>
                    
                    <!-- Vault state remains -->
                    <text x="200" y="170" text-anchor="middle" fill="#007bff" font-family="Arial" font-size="10">Vault PKI engine remains configured</text>
                    <text x="200" y="185" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="10">Ready for next demonstration</text>
                </svg>
            `,
            description: 'Cleanup process removing temporary files while preserving Vault PKI configuration.'
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
