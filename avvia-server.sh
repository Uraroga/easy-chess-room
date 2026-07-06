#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
HOST="0.0.0.0"

if ! command -v npm >/dev/null 2>&1; then
  echo "Errore: npm non è disponibile. Installa Node.js e npm, poi riprova."
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Dipendenze non trovate. Eseguo npm install..."
  npm install
fi

get_local_ips() {
  if command -v hostname >/dev/null 2>&1; then
    hostname -I 2>/dev/null | tr ' ' '\n' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' || true
  fi

  if command -v ip >/dev/null 2>&1; then
    ip -4 addr show scope global 2>/dev/null | awk '/inet / {print $2}' | cut -d/ -f1 || true
  fi

  if command -v ifconfig >/dev/null 2>&1; then
    ifconfig 2>/dev/null | awk '/inet / && $2 != "127.0.0.1" {print $2}' || true
  fi
}

mapfile -t LOCAL_IPS < <(get_local_ips | grep -v '^127\.' | sort -u)

echo
echo "Avvio Easy Chess Room..."
echo "Apri nel browser: http://localhost:${PORT}"

if (( ${#LOCAL_IPS[@]} > 0 )); then
  echo "Dalla stessa rete locale puoi provare anche:"
  for ip in "${LOCAL_IPS[@]}"; do
    echo "  http://${ip}:${PORT}"
  done
else
  echo "Nessun indirizzo IP locale rilevato automaticamente."
fi

echo
echo "Per fermare il server premi CTRL+C."
echo

npm run dev -- --host "$HOST" --port "$PORT"
