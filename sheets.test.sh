#!/usr/bin/env bash
set -euo pipefail

KEY="~/.ssh/alma2"
ZIP_LOCAL="/home/starfury/Downloads/saas-sheets-fixes-ubuntu-v2.zip"
SERVER="root@206.189.195.63"
REMOTE_ZIP="/root/saas-sheets-fixes-ubuntu-v2.zip"
DOMAIN="sheets.logicvault.net"
UVICORN_APP="app:app"
PORT="8088"

echo "==> Uploading zip via rsync..."
rsync -avz -e "ssh -i ${KEY}" "${ZIP_LOCAL}" "${SERVER}:${REMOTE_ZIP}"

echo "==> Creating/refreshing remote installer..."
ssh -i ${KEY} ${SERVER} 'cat > /root/install-sheets.sh <<'"'"'EOF'"'"'
#!/usr/bin/env bash
set -euo pipefail

ZIP_PATH=""
DOMAIN=""
UVICORN_APP="app:app"
PORT="8088"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --zip) ZIP_PATH="$2"; shift 2;;
    --domain) DOMAIN="$2"; shift 2;;
    --app) UVICORN_APP="$2"; shift 2;;
    --port) PORT="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ -z "${ZIP_PATH}" || -z "${DOMAIN}" ]]; then
  echo "Usage: $0 --zip /path/to.zip --domain example.com [--app app:app] [--port 8088]"
  exit 1
fi
[[ -f "$ZIP_PATH" ]] || { echo "Zip not found: $ZIP_PATH"; exit 1; }

APP_NAME="sheets-api"
APP_DIR="/opt/sheets"
RELEASE_DIR="${APP_DIR}/releases"
CURRENT_DIR="${APP_DIR}/current"
VENV_DIR="${APP_DIR}/venv"
ENV_FILE="${APP_DIR}/.env"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
SITE_NAME="sheets"
NGX_AVAIL="/etc/nginx/sites-available/${SITE_NAME}"
NGX_ENABL="/etc/nginx/sites-enabled/${SITE_NAME}"

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y unzip python3 python3-venv python3-pip nginx ca-certificates curl
apt-get install -y certbot python3-certbot-nginx || true
command -v ufw >/dev/null 2>&1 && { ufw allow 80/tcp || true; ufw allow 443/tcp || true; }

mkdir -p "${RELEASE_DIR}"
TS="$(date +%Y%m%d%H%M%S)"
REL_DIR="${RELEASE_DIR}/${TS}"
mkdir -p "${REL_DIR}"

echo "==> Unzipping ${ZIP_PATH} -> ${REL_DIR}"
unzip -q "${ZIP_PATH}" -d "${REL_DIR}"

# Flatten if there is a single top-level folder
if [[ $(find "${REL_DIR}" -mindepth 1 -maxdepth 1 -type d | wc -l) -eq 1 && ! -f "${REL_DIR}/requirements.txt" ]]; then
  INNER="$(find "${REL_DIR}" -mindepth 1 -maxdepth 1 -type d | head -n1)"
  shopt -s dotglob
  mv "${INNER}"/* "${REL_DIR}/" 2>/dev/null || true
  rmdir "${INNER}" || true
  shopt -u dotglob
fi

echo "==> Linking current -> ${REL_DIR}"
rm -f "${CURRENT_DIR}" || true
mkdir -p "${APP_DIR}"
ln -s "${REL_DIR}" "${CURRENT_DIR}"

echo "==> Python venv + dependencies"
python3 -m venv "${VENV_DIR}"
source "${VENV_DIR}/bin/activate"
pip install --upgrade pip wheel setuptools
[[ -f "${CURRENT_DIR}/requirements.txt" ]] && pip install -r "${CURRENT_DIR}/requirements.txt" || echo "WARN: no requirements.txt"

echo "==> Alembic migrations (if present)"
if [[ -f "${CURRENT_DIR}/alembic.ini" ]]; then
  (cd "${CURRENT_DIR}" && "${VENV_DIR}/bin/alembic" upgrade head) || echo "WARN: alembic failed"
fi

echo "==> systemd service ${APP_NAME}"
cat > "${SERVICE_FILE}" <<SYS
[Unit]
Description=SaaS Sheets API (Uvicorn)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${CURRENT_DIR}
EnvironmentFile=-${ENV_FILE}
ExecStart=${VENV_DIR}/bin/uvicorn ${UVICORN_APP} --host 127.0.0.1 --port ${PORT}
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SYS

systemctl daemon-reload
systemctl enable --now "${APP_NAME}"
sleep 1
systemctl --no-pager --full status "${APP_NAME}" || true

echo "==> NGINX vhost for ${DOMAIN}"
mkdir -p /var/www/${SITE_NAME}
echo -e "User-agent: *\nDisallow: /" > /var/www/${SITE_NAME}/robots.txt

cat > "${NGX_AVAIL}" <<NGX
server {
    server_name ${DOMAIN};

    root /var/www/${SITE_NAME};
    index index.html;

    location = /healthz {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location = /run { return 403; }

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300;
    }

    listen 80;
}
NGX

ln -sf "${NGX_AVAIL}" "${NGX_ENABL}"
nginx -t
systemctl reload nginx

echo "==> HTTPS via Certbot"
if command -v certbot >/dev/null 2>&1; then
  certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "admin@${DOMAIN}" --redirect || true
  nginx -t && systemctl reload nginx
fi

echo "==> Final checks"
curl -fsS "http://127.0.0.1:${PORT}/healthz" || echo "WARN: local /healthz failed"
curl -fsS "http://${DOMAIN}/healthz" || true
echo "Done."
EOF
chmod +x /root/install-sheets.sh'

echo "==> Running remote installer..."
ssh -i ${KEY} ${SERVER} "/root/install-sheets.sh --zip '${REMOTE_ZIP}' --domain '${DOMAIN}' --app '${UVICORN_APP}' --port '${PORT}'"

echo "==> Deployment complete. Try:  curl -s https://${DOMAIN}/healthz"
