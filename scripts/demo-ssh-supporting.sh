#!/bin/bash
# SSH Secrets Engine - Supporting Infrastructure Demo
# This demonstrates SSH capabilities that support the main PKI demo
# Run this separately to understand the supporting SSH infrastructure

. demo-magic.sh

# SSH Demo Configuration
SSH_DEMO_USER="ubuntu"
SSH_TEST_IP="192.168.1.100"
SSH_KEY_PATH="/tmp/vault_ssh_demo"

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

# Title
echo -e "${BLUE}"
echo "██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗    ██████╗ ██╗  ██╗██╗    ██████╗ "
echo "██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝    ██╔══██╗██║ ██╔╝██║    ╚════██╗"
echo "██║   ██║███████║██║   ██║██║     ██║       ██████╔╝█████╔╝ ██║     █████╔╝"
echo "╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║       ██╔═══╝ ██╔═██╗ ██║    ██╔═══╝ "
echo " ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║       ██║     ██║  ██╗██║    ███████╗"
echo "  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝       ╚═╝     ╚═╝  ╚═╝╚═╝    ╚══════╝"
echo ""
echo "              SSH Supporting Infrastructure Demo"
echo -e "${NC}"

# Check Vault status
pe "vault status"

echo -e "\n${YELLOW}🔐 Phase 2: SSH Secrets Engine Integration${NC}"
echo "This demo shows SSH key management working alongside PKI certificates"
wait

# Step 1: Enable SSH Secrets Engine
echo -e "\n${GREEN}Step 1: Enable SSH Secrets Engine${NC}"
pe "vault secrets enable -path=ssh ssh"

# Step 2: Configure SSH CA
echo -e "\n${GREEN}Step 2: Generate SSH Certificate Authority${NC}"
pe "vault write ssh/config/ca generate_signing_key=true"

# Step 3: Get SSH CA Public Key
echo -e "\n${GREEN}Step 3: View SSH CA Public Key${NC}"
pe "vault read -field=public_key ssh/config/ca"

# Step 4: Create VM Admin Role
echo -e "\n${GREEN}Step 4: Create VM Admin SSH Role${NC}"
pe "vault write ssh/roles/vm-admin \\
  key_type=ca \\
  allow_user_certificates=true \\
  allowed_users=\"ubuntu,centos,root\" \\
  default_user=\"ubuntu\" \\
  ttl=1h \\
  max_ttl=24h"

# Step 5: Create Ansible Automation Role
echo -e "\n${GREEN}Step 5: Create Ansible Automation SSH Role${NC}"
pe "vault write ssh/roles/ansible-automation \\
  key_type=ca \\
  allow_user_certificates=true \\
  allowed_users=\"ansible,ubuntu\" \\
  default_user=\"ansible\" \\
  ttl=30m \\
  max_ttl=1h"

# Step 6: Create OTP Role for Emergency Access
echo -e "\n${GREEN}Step 6: Create One-Time Password Role${NC}"
pe "vault write ssh/roles/otp-role \\
  key_type=otp \\
  default_user=\"ubuntu\" \\
  cidr_list=\"192.168.0.0/16,10.0.0.0/8\""

# Step 7: Generate SSH Key Pair for Demo
echo -e "\n${GREEN}Step 7: Generate SSH Key Pair for Testing${NC}"
pe "ssh-keygen -t rsa -b 4096 -f ${SSH_KEY_PATH} -N \"\" -C \"vault-ssh-demo\""
pe "cat ${SSH_KEY_PATH}.pub"

# Step 8: Sign SSH Certificate with VM Admin Role
echo -e "\n${GREEN}Step 8: Sign SSH Certificate (VM Admin Role)${NC}"
pe "vault write -field=signed_key ssh/sign/vm-admin \\
  public_key=@${SSH_KEY_PATH}.pub > ${SSH_KEY_PATH}-cert.pub"

# Step 9: Inspect SSH Certificate
echo -e "\n${GREEN}Step 9: Inspect SSH Certificate Details${NC}"
pe "ssh-keygen -L -f ${SSH_KEY_PATH}-cert.pub"

# Step 10: Sign Certificate with Ansible Role (Shorter TTL)
echo -e "\n${GREEN}Step 10: Sign Certificate (Ansible Automation Role)${NC}"
pe "vault write -field=signed_key ssh/sign/ansible-automation \\
  public_key=@${SSH_KEY_PATH}.pub > ${SSH_KEY_PATH}-ansible-cert.pub"

# Step 11: Compare Certificate Validity Periods
echo -e "\n${GREEN}Step 11: Compare VM Admin vs Ansible Certificate TTLs${NC}"
echo -e "${YELLOW}VM Admin Certificate:${NC}"
pe "ssh-keygen -L -f ${SSH_KEY_PATH}-cert.pub | grep 'Valid:'"
echo -e "${YELLOW}Ansible Certificate:${NC}"
pe "ssh-keygen -L -f ${SSH_KEY_PATH}-ansible-cert.pub | grep 'Valid:'"

# Step 12: Generate One-Time Password
echo -e "\n${GREEN}Step 12: Generate One-Time Password for Emergency Access${NC}"
pe "vault write ssh/creds/otp-role ip=${SSH_TEST_IP}"

# Step 13: Create SSH Policy
echo -e "\n${GREEN}Step 13: Create SSH Access Policy${NC}"
pe "vault policy write ssh-admin - <<EOF
path \"ssh/*\" {
  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]
}
EOF"

# Step 14: Integration with PKI - Show Combined Workflow
echo -e "\n${GREEN}Step 14: Combined PKI + SSH Workflow Demo${NC}"
echo -e "${YELLOW}This demonstrates how SSH and PKI work together:${NC}"
echo "1. SSH certificates for server access"
echo "2. PKI certificates for TLS encryption"
wait

# Get a TLS certificate from PKI engine
pe "vault write -field=certificate pki/issue/webapp \\
  common_name=\"app.example.com\" \\
  ttl=24h > /tmp/tls-cert.pem"

echo -e "${YELLOW}Now we have both:${NC}"
pe "ls -la ${SSH_KEY_PATH}* /tmp/tls-cert.pem"

# Step 15: Show SSH CA Public Key for Host Verification
echo -e "\n${GREEN}Step 15: SSH CA Public Key for Host Verification${NC}"
echo -e "${YELLOW}Add this to known_hosts or sshd_config TrustedUserCAKeys:${NC}"
pe "vault read -field=public_key ssh/config/ca"

# Step 16: Cleanup Demo
echo -e "\n${GREEN}Step 16: Cleanup Demo Files${NC}"
pe "rm -f ${SSH_KEY_PATH}* /tmp/tls-cert.pem"

# Step 17: Summary of SSH + PKI Integration
echo -e "\n${GREEN}Step 17: SSH + PKI Integration Summary${NC}"
echo -e "${BLUE}Comprehensive Vault Secrets Management:${NC}"
echo "✅ PKI Engine: TLS certificates for applications"
echo "✅ SSH Engine: SSH certificates for server access"
echo "✅ Combined workflow: Secure end-to-end infrastructure"
echo ""
echo -e "${YELLOW}Real-world usage:${NC}"
echo "• Ansible uses SSH certs to access VMs"
echo "• Applications get TLS certs for HTTPS"
echo "• Vault Agent manages certificate lifecycle"
echo "• Zero long-lived credentials stored on systems"

echo -e "\n${GREEN}🎉 SSH Secrets Engine Demo Complete!${NC}"
echo -e "${BLUE}Phase 2 integration successful - SSH + PKI working together${NC}"
