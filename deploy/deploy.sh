#!/usr/bin/env bash
# ─────────────────────────────────────────────
# Vitaro — deploy/update script for Hostinger VPS
# Run from the project directory:  bash deploy/deploy.sh
# ─────────────────────────────────────────────
set -euo pipefail

echo "==> Pulling latest code"
git pull origin master

echo "==> Installing dependencies"
npm ci

echo "==> Applying database schema (prisma db push)"
npx prisma db push

echo "==> Building Next.js"
npm run build

echo "==> Restarting PM2 process"
if pm2 describe vitaro > /dev/null 2>&1; then
  pm2 reload vitaro
else
  pm2 start ecosystem.config.js
fi

pm2 save
echo "==> Done. App is running."
