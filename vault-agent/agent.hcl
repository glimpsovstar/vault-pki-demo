# Vault Agent Configuration for PKI + SSH Integration
# Automatically manages both SSH and PKI certificates

pid_file = "/tmp/vault-agent.pid"

vault {
  address = "http://localhost:8200"
  # retry configuration
  retry {
    num_retries = 5
  }
}

# Authentication using AppRole
auth "approle" {
  mount_path = "auth/approle"
  config = {
    role_id_file_path = "/etc/vault/role_id"
    secret_id_file_path = "/etc/vault/secret_id"
    remove_secret_id_file_after_reading = false
  }
}

# SSH Certificate Template
template {
  source      = "/etc/vault/templates/ssh-cert.tpl"
  destination = "/etc/ssh/ssh_host_rsa_key-cert.pub"
  perms       = 0644
  command     = "systemctl reload ssh"
}

# TLS Certificate Template
template {
  source      = "/etc/vault/templates/tls-cert.tpl"
  destination = "/etc/ssl/certs/application.crt"
  perms       = 0644
  command     = "systemctl reload nginx"
}

# TLS Private Key Template
template {
  source      = "/etc/vault/templates/tls-key.tpl"
  destination = "/etc/ssl/private/application.key"
  perms       = 0600
  command     = "systemctl reload nginx"
}

# CA Certificate Template
template {
  source      = "/etc/vault/templates/ca-cert.tpl"
  destination = "/etc/ssl/certs/ca-bundle.crt"
  perms       = 0644
}
