#!/usr/bin/env bash
#
# Deploy the latest code. Run anytime you push new changes to GitHub:
#   sudo bash deploy/update.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

echo "==> Pulling latest code..."
git -C "$REPO_DIR" pull --ff-only

echo "==> Rebuilding frontend..."
cd "$REPO_DIR/app"
npm ci
npm run build

# Update + restart the API if it's set up
if [ -f "$REPO_DIR/server/package.json" ]; then
  echo "==> Updating API..."
  cd "$REPO_DIR/server"
  npm install --omit=dev
  if systemctl list-unit-files | grep -q social-studios-api; then
    systemctl restart social-studios-api
    echo "==> API restarted."
  else
    echo "==> API service not installed yet — run: sudo bash deploy/setup-api.sh"
  fi
fi

echo "==> Reloading nginx..."
systemctl reload nginx
echo "==> Done. Latest version is live."
