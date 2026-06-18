#!/usr/bin/env bash
# ─────────────────────────────────────────────
# Vitaro — initial Hostinger VPS provisioning script (Ubuntu 22.04 / 24.04)
# Installs: Node.js 20, Git, Nginx, PostgreSQL, PM2, Certbot, UFW
# Creates the database, clones the repo, builds, and starts the app.
#
# Run as a sudo-capable user:
#   wget https://raw.githubusercontent.com/mouhcineelhaloui3-jpg/VITARO/master/deploy/server-setup.sh
#   chmod +x server-setup.sh
#   ./server-setup.sh
#
# Or paste the whole file into a new file on the server and run it.
# ─────────────────────────────────────────────
set -euo pipefail

# ===== EDIT THESE BEFORE RUNNING =====
APP_DIR="/var/www/vitaro"
REPO_URL="https://github.com/mouhcineelhaloui3-jpg/VITARO.git"
DOMAIN="your-domain.com"                 # without https://
DB_NAME="vitaro"
DB_USER="vitaro_user"
DB_PASSWORD="CHANGE_ME_STRONG_DB_PASSWORD"
ADMIN_PASSWORD="CHANGE_ME_STRONG_ADMIN_PASSWORD"
# =====================================

GREEN="\033[0;32m"; NC="\033[0m"
log() { echo -e "${GREEN}==> $1${NC}"; }

if [ "$DB_PASSWORD" = "CHANGE_ME_STRONG_DB_PASSWORD" ] || [ "$ADMIN_PASSWORD" = "CHANGE_ME_STRONG_ADMIN_PASSWORD" ]; then
  echo "ERROR: Edit DB_PASSWORD and ADMIN_PASSWORD at the top of this script first." >&2
  exit 1
fi

log "Updating system packages"
sudo apt update && sudo apt upgrade -y

log "Installing Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

log "Installing Git, Nginx, PostgreSQL, Certbot"
sudo apt install -y git nginx postgresql postgresql-contrib certbot python3-certbot-nginx

log "Installing PM2 globally"
sudo npm install -g pm2

log "Creating PostgreSQL database and user"
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"

log "Cloning repository to ${APP_DIR}"
sudo mkdir -p "$(dirname "$APP_DIR")"
if [ -d "$APP_DIR/.git" ]; then
  log "Repo already exists, pulling latest"
  sudo chown -R "$USER":"$USER" "$APP_DIR"
  git -C "$APP_DIR" pull origin master
else
  sudo git clone "$REPO_URL" "$APP_DIR"
  sudo chown -R "$USER":"$USER" "$APP_DIR"
fi

cd "$APP_DIR"

log "Writing .env file"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
cat > .env <<ENV
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="https://${DOMAIN}"
ADMIN_PASSWORD="${ADMIN_PASSWORD}"
NEXT_PUBLIC_SITE_URL="https://${DOMAIN}"
NEXT_PUBLIC_DEFAULT_LOCALE="ar"
NEXT_PUBLIC_DEFAULT_CURRENCY="MAD"
NEXT_PUBLIC_META_PIXEL_ID=""
NEXT_PUBLIC_TIKTOK_PIXEL_ID=""
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV
chmod 600 .env

log "Installing dependencies"
npm ci

log "Pushing database schema"
npx prisma db push

log "Building the app"
npm run build

log "Starting app with PM2"
if pm2 describe vitaro > /dev/null 2>&1; then
  pm2 reload vitaro
else
  pm2 start ecosystem.config.js
fi
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "$HOME" | tail -n 1 | bash || true

log "Configuring Nginx"
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/vitaro
sudo sed -i "s/your-domain.com/${DOMAIN}/g" /etc/nginx/sites-available/vitaro
sudo ln -sf /etc/nginx/sites-available/vitaro /etc/nginx/sites-enabled/vitaro
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

log "Configuring firewall"
sudo ufw allow OpenSSH || true
sudo ufw allow 'Nginx Full' || true
sudo ufw --force enable || true

log "Requesting SSL certificate"
sudo certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "admin@${DOMAIN}" --redirect || \
  echo "Certbot step skipped/failed — run manually: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"

log "All done! Visit: https://${DOMAIN}"
echo "Admin login: https://${DOMAIN}/admin/login"
echo "PM2 status:  pm2 status   |   Logs: pm2 logs vitaro"
