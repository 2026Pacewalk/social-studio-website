#!/usr/bin/env bash
#
# One-time server setup for socialstudios.in
# Installs Node + nginx, builds the site, and serves it over HTTP.
# Run from the repo root:  sudo bash deploy/setup-server.sh
#
set -euo pipefail

DOMAIN="socialstudios.in"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
WEB_ROOT="$REPO_DIR/app/dist"

echo "==> Repo location : $REPO_DIR"
echo "==> Web root      : $WEB_ROOT"

echo "==> Installing system packages (git, nginx, curl)..."
apt-get update -y
apt-get install -y curl git nginx

if ! command -v node >/dev/null 2>&1; then
  echo "==> Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "==> Node $(node -v) / npm $(npm -v)"

echo "==> Building the site..."
cd "$REPO_DIR/app"
npm ci
npm run build

echo "==> Writing nginx config..."
cat > /etc/nginx/sites-available/social-studio <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $WEB_ROOT;
    index index.html;

    # SPA fallback so React Router deep links work
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Long cache for hashed static assets
    location ~* \.(?:css|js|woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|avif|ico)\$ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
NGINX

ln -sf /etc/nginx/sites-available/social-studio /etc/nginx/sites-enabled/social-studio
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ""
echo "==> Done. Site is live over HTTP."
echo "    Test now:  curl -I http://$DOMAIN"
echo "    Once DNS points to this server, enable HTTPS:"
echo "      sudo bash deploy/enable-ssl.sh"
