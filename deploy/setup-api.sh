#!/usr/bin/env bash
#
# One-time setup for the Social Studios API (Node + SQLite) as a systemd service.
# Run AFTER setup-server.sh (which adds the nginx /api proxy):
#   sudo bash deploy/setup-api.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
SERVER_DIR="$REPO_DIR/server"
NODE_BIN="$(command -v node || echo /usr/bin/node)"

echo "==> Installing build tools (needed if native modules compile)..."
apt-get update -y
apt-get install -y python3 make g++ openssl

echo "==> Installing API dependencies..."
cd "$SERVER_DIR"
npm install --omit=dev

ADMIN_CREATED=0
if [ ! -f "$SERVER_DIR/.env" ]; then
  JWT="$(openssl rand -hex 32)"
  PW="$(openssl rand -base64 12)"
  cat > "$SERVER_DIR/.env" <<ENV
PORT=4000
NODE_ENV=production
JWT_SECRET=$JWT
ADMIN_NAME=Sukhjeet Singh Brar
ADMIN_EMAIL=Sukhjeetbrar@socialtheory.in
ADMIN_PASSWORD=$PW
LEAD_ALERT_TO=Sukhjeetbrar@socialtheory.in,Kajal@socialtheory.in
# Fill these to enable lead alert emails (Zoho: smtp.zoho.in / 465 / your email / app password)
SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
SMTP_FROM=Social Studios <Sukhjeetbrar@socialtheory.in>
CORS_ORIGIN=
ENV
  chmod 600 "$SERVER_DIR/.env"
  ADMIN_CREATED=1
  echo "==> Created $SERVER_DIR/.env"
fi

echo "==> Installing systemd service..."
cat > /etc/systemd/system/social-studios-api.service <<UNIT
[Unit]
Description=Social Studios API
After=network.target

[Service]
Type=simple
WorkingDirectory=$SERVER_DIR
ExecStart=$NODE_BIN src/index.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable social-studios-api >/dev/null 2>&1 || true
systemctl restart social-studios-api
sleep 2

echo "==> Service status:"
systemctl --no-pager --lines=0 status social-studios-api || true
echo "==> API health:"
curl -s http://127.0.0.1:4000/api/health && echo || echo " (API not responding yet — check: journalctl -u social-studios-api -n 50)"

if [ "$ADMIN_CREATED" = "1" ]; then
  echo ""
  echo "============================================================"
  echo "  ADMIN LOGIN — change the password after first sign-in"
  echo "    URL:      https://socialstudios.in/admin"
  echo "    Email:    Sukhjeetbrar@socialtheory.in"
  echo "    Password: $PW"
  echo "============================================================"
fi
echo ""
echo "Done. The API runs on 127.0.0.1:4000 and nginx serves it at /api."
