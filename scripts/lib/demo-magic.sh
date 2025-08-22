#!/usr/bin/env bash
# Minimal demo-magic subset for Vault PKI demo
# Provides: p (print), pe (print+execute), pei (print+execute immediate)
# Credits: inspired by https://github.com/paxtonhare/demo-magic

set -Euo pipefail

# Prompt look
: "${DEMO_PROMPT:=$ }"
: "${TYPE_SPEED:=20}"   # characters per second (visual typing)
: "${PROMPT_TIMEOUT:=0}" # 0 = no confirm step

COLOR_RESET="$(printf '\033[0m')"
COLOR_DIM="$(printf '\033[2m')"

# Simulate typing
__dm_type() {
  local text="$1"
  if [[ "$TYPE_SPEED" -le 0 ]]; then
    printf "%s" "$text"
    return
  fi
  local i
  for ((i=0; i<${#text}; i++)); do
    printf "%s" "${text:$i:1}"
    sleep "$(awk "BEGIN {print 1/$TYPE_SPEED}")"
  done
}

# Print a line (no command execution)
p() {
  printf "%b\n" "$*"
}

# Print command with prompt, then execute (capturing stdout/stderr)
pe() {
  local cmd="$*"
  printf "%b" "${DEMO_PROMPT}"
  __dm_type "$cmd"
  printf "\n"
  if [[ "$PROMPT_TIMEOUT" -gt 0 ]]; then
    printf "%b" "${COLOR_DIM}[press Enter]${COLOR_RESET} "
    read -r -t "$PROMPT_TIMEOUT" _ || true
    printf "\n"
  fi
  bash -c "$cmd"
}

# Print + execute immediately (no typing delay)
pei() {
  local cmd="$*"
  local old="$TYPE_SPEED"
  TYPE_SPEED=0
  pe "$cmd"
  TYPE_SPEED="$old"
}