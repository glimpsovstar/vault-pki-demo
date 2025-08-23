# AWS Auth Method & Root Token Management Guide

## AWS Auth Method Configuration

The demo now includes AWS auth method configuration that allows EC2 instances to authenticate to Vault using their instance metadata - **no permanent credentials needed on instances!**

### Architecture

```
EC2 Instance → AWS Instance Metadata → Vault AWS Auth → Short-lived Token
```

### How It Works

1. **EC2 Instance Identity**: Each EC2 instance has access to instance metadata
2. **Vault Verification**: Vault verifies the instance identity with AWS
3. **Token Issuance**: Vault issues a short-lived token with appropriate policies
4. **Automatic Expiration**: Tokens expire automatically (30min - 4hrs depending on role)

### Available AWS Auth Roles

| Role | Purpose | Policies | Token TTL |
|------|---------|----------|-----------|
| `ec2-pki-role` | PKI certificate operations | `pki_operator` | 30 minutes |
| `ec2-ssh-role` | SSH certificate operations | `ansible_ssh` | 30 minutes |  
| `ec2-combined-role` | PKI + SSH operations | `app_combined` | 1 hour |

### Usage from EC2 Instance

```bash
# 1. Run the authentication script
./scripts/ec2-vault-auth.sh

# 2. Or manually authenticate
export VAULT_ADDR="https://your-vault-server:8200"
vault write -field=token auth/aws/login role=ec2-pki-role

# 3. Use the token for operations
vault write pki/issue/demo common_name=app.demo.local ttl=24h
```

## Root Token Expiration Impact

### ❓ **Your Question**: "My vault root token expires every 4 hours, will it have an impact on what we have built?"

### ✅ **Answer**: **NO IMPACT** - Here's why:

#### 1. **Terraform State Independence**
- Once `terraform apply` completes successfully, the Vault configuration is persisted
- Root token expiration doesn't affect existing Vault configuration
- Policies, auth methods, secrets engines remain configured

#### 2. **Demo Operations Don't Need Root Token**
- **CLI Demo**: Uses AppRole authentication (not root token)
- **Web Container**: Uses AppRole authentication (not root token)  
- **EC2 Instances**: Use AWS auth method (not root token)
- **SSH Operations**: Use role-based policies (not root token)

#### 3. **What DOES Require Root Token**
- **Initial Terraform Apply**: Needs root token to configure Vault
- **Configuration Changes**: Adding new policies, auth methods, etc.
- **Administrative Operations**: Vault maintenance tasks

### 🔧 **Root Token Renewal Strategies**

#### Option 1: Renew Root Token (Simplest)
```bash
# Check current token TTL
vault token lookup

# Renew root token (extends by default increment)
vault token renew

# Renew with specific TTL
vault token renew -increment=24h
```

#### Option 2: Generate New Root Token
```bash
# Generate new root token (requires unseal keys)
vault operator generate-root -init
vault operator generate-root -otp=<otp> <unseal_key_1>
vault operator generate-root -otp=<otp> <unseal_key_2>
vault operator generate-root -otp=<otp> <unseal_key_3>
```

#### Option 3: Use Administrative Auth Method
```bash
# Create admin user/policy for Terraform operations
vault policy write admin-terraform - <<EOF
path "*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF

# Use LDAP/OIDC/other auth method for admin access
vault auth -method=ldap username=admin
```

### 📋 **Best Practices for Production**

#### 1. **Avoid Root Token Dependency**
```hcl
# Use admin user with appropriate policies
provider "vault" {
  address = var.vault_addr
  auth_login {
    path = "auth/ldap/login/admin-user"
    parameters = {
      password = var.admin_password
    }
  }
}
```

#### 2. **Token Lifecycle Management**
```bash
# In your deployment scripts
check_token_ttl() {
  TTL=$(vault token lookup -format=json | jq -r '.data.ttl')
  if [ "$TTL" -lt 3600 ]; then  # Less than 1 hour
    vault token renew
  fi
}
```

#### 3. **Monitoring & Alerts**
- Monitor root token TTL
- Alert when < 2 hours remaining
- Automate renewal process

### 🚀 **Impact Summary**

| Component | Root Token Needed? | Impact of Expiration |
|-----------|-------------------|---------------------|
| **Existing Demo** | ❌ No | ✅ None - keeps working |
| **PKI Operations** | ❌ No | ✅ None - uses AppRole |
| **SSH Operations** | ❌ No | ✅ None - uses policies |
| **EC2 Auth** | ❌ No | ✅ None - uses AWS auth |
| **Web Interface** | ❌ No | ✅ None - uses AppRole |
| **New Terraform Apply** | ✅ Yes | ❌ Will fail - need valid token |

### 🔄 **Recommended Workflow**

1. **Before Terraform Changes**: Ensure root token has sufficient TTL
2. **After Successful Apply**: Root token can expire safely
3. **For Future Changes**: Renew root token, run terraform, let it expire again
4. **Production**: Implement proper admin auth method

The beauty of this architecture is that **operational workloads are completely independent of root token lifecycle** - they use their own authentication methods and policies! 🎉
