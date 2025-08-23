{{- with secret "pki/issue/webapp" "common_name=app.example.com" "ttl=24h" -}}
{{ .Data.certificate }}
{{- end }}
