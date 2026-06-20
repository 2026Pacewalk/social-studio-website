#!/usr/bin/env bash
#
# Configure HTTPS on the origin using a CLOUDFLARE ORIGIN CERTIFICATE.
# Use this (not Let's Encrypt) when the domain is proxied through Cloudflare.
#
# Before running, create the two cert files (paste from the Cloudflare dashboard:
#   SSL/TLS -> Origin Server -> Create Certificate):
#     sudo mkdir -p /etc/ssl/cloudflare
#     sudo nano /etc/ssl/cloudflare/origin.pem   # paste the "Origin Certificate"
#     sudo nano /etc/ssl/cloudflare/origin.key   # paste the "Private Key"
#
# Then:  sudo bash deploy/enable-cloudflare-ssl.sh
#
set -euo pipefail

DOMAIN="socialstudios.in"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
WEB_ROOT="$REPO_DIR/app/dist"
CERT_DIR="/etc/ssl/cloudflare"
CERT="$CERT_DIR/origin.pem"
KEY="$CERT_DIR/origin.key"

if [[ ! -f "$CERT" || ! -f "$KEY" ]]; then
  echo "ERROR: cert files not found."
  echo "Create them first (paste from Cloudflare > SSL/TLS > Origin Server > Create Certificate):"
  echo "  sudo mkdir -p $CERT_DIR"
  echo "  sudo nano $CERT   # paste the Origin Certificate, then Ctrl+O, Enter, Ctrl+X"
  echo "  sudo nano $KEY    # paste the Private Key, then Ctrl+O, Enter, Ctrl+X"
  exit 1
fi
chmod 600 "$KEY"

echo "==> Ensuring port 443 is open (if ufw is active)..."
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow 'Nginx Full' || true
fi

echo "==> Writing nginx config (HTTP + HTTPS)..."
cat > /etc/nginx/sites-available/social-studio <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    root $WEB_ROOT;
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
    location ~* \.(?:css|js|woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|avif|ico)\$ {
        expires 30d; add_header Cache-Control "public";
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate     $CERT;
    ssl_certificate_key $KEY;

    root $WEB_ROOT;
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
    location ~* \.(?:css|js|woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|avif|ico)\$ {
        expires 30d; add_header Cache-Control "public";
    }
}
NGINX

ln -sf /etc/nginx/sites-available/social-studio /etc/nginx/sites-enabled/social-studio
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ""
echo "==> Origin HTTPS is configured."
echo "    Now in Cloudflare: SSL/TLS -> Overview -> set mode to 'Full (strict)'."
echo "    Then load https://$DOMAIN"
