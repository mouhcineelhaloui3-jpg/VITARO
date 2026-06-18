#!/usr/bin/env bash
# Verify required production environment variables before starting the app.
set -euo pipefail

APP_DIR="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
ENV_FILE="${APP_DIR}/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: Missing ${ENV_FILE}" >&2
  echo "Copy .env.production.example to .env and fill in real values." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

missing=0

require_var() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "ERROR: ${name} is not set in .env" >&2
    missing=1
  fi
}

require_var DATABASE_URL
require_var NEXTAUTH_SECRET
require_var NEXTAUTH_URL
require_var ADMIN_PASSWORD
require_var NEXT_PUBLIC_SITE_URL

if [[ "${NEXTAUTH_URL}" != https://* ]]; then
  echo "WARNING: NEXTAUTH_URL should use https:// in production (current: ${NEXTAUTH_URL})" >&2
fi

if [ "$missing" -ne 0 ]; then
  echo "" >&2
  echo "Generate a secret with: openssl rand -base64 32" >&2
  exit 1
fi

echo "OK: required environment variables are present."
