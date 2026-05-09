#!/usr/bin/env bash
# Run on MBP-2 to expose the local FastAPI backend through Cloudflare Tunnel.
# Tunnel:   synapster (UUID 81f47e94-c9d2-4f4b-8507-b6d741e69820)
# Public:   https://synapster-api.martinlombard.com  →  http://localhost:8000
#
# Keep this terminal open for the duration of the demo. The URL is stable
# across restarts (it's a permanent Cloudflare DNS record), so Vercel's
# NEXT_PUBLIC_API_URL never has to change.
set -euo pipefail

CLOUDFLARED="${CLOUDFLARED:-/usr/local/bin/cloudflared}"
CONFIG="${CONFIG:-$HOME/.cloudflared/synapster.yml}"

if [[ ! -f "$CONFIG" ]]; then
  echo "[tunnel] missing config: $CONFIG" >&2
  exit 1
fi

echo "[tunnel] config: $CONFIG"
echo "[tunnel] public URL: https://synapster-api.martinlombard.com"
echo "[tunnel] forwards to: http://localhost:8000  (start uvicorn before/after)"
echo

exec "$CLOUDFLARED" tunnel --config "$CONFIG" run synapster
