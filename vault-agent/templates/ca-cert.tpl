{{- with secret "pki/ca/pem" -}}
{{ .Data }}
{{- end }}
