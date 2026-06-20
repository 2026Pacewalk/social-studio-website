#!/usr/bin/env bash
#
# Enable free HTTPS (Let's Encrypt) for socialstudios.in
# Run ONLY after the domain's DNS A records point to this server.
#   sudo bash deploy/enable-ssl.sh
#
set -euo pipefail

DOMAIN="socialstudios.in"
EMAIL="hellopacewalk@gmail.com"

echo "==> Installing certbot..."
apt-get update -y
apt-get install -y certbot python3-certbot-nginx

echo "==> Requesting certificate for $DOMAIN and www.$DOMAIN..."
# This agrees to the Let's Encrypt Terms of Service on your behalf (-agree-tos).
certbot --nginx \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --redirect --non-interactive --agree-tos -m "$EMAIL"

systemctl reload nginx
echo ""
echo "==> HTTPS enabled. Visit: https://$DOMAIN"
echo "    Auto-renewal is handled by the certbot systemd timer."
