{{- with secret "ssh/sign/ansible-automation" "public_key=@/etc/ssh/ssh_host_rsa_key.pub" -}}
{{ .Data.signed_key }}
{{- end }}
