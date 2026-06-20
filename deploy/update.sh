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

echo "==> Rebuilding..."
cd "$REPO_DIR/app"
npm ci
npm run build

echo "==> Reloading nginx..."
systemctl reload nginx
echo "==> Done. Latest version is live."
