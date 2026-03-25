#!/bin/bash
set -e

APP_NAME="socialmedialab"
DOMAIN="minisocial.vhuinfosec.io.vn"

echo "🔁 Pulling latest code..."
git pull origin main || true

echo "📦 Building Docker containers..."
sudo docker compose build --no-cache

echo "🚀 Starting containers..."
sudo docker compose up -d

# --- Nginx config ---
if [ ! -f /etc/nginx/sites-available/$APP_NAME ]; then
  echo "🌐 Setting up Nginx..."
  sudo bash -c "cat > /etc/nginx/sites-available/$APP_NAME <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
EOF"
  sudo ln -s /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl restart nginx
fi

# --- SSL cert ---
if [ ! -d /etc/letsencrypt/live/$DOMAIN ]; then
  echo "🔐 Getting SSL certificate..."
  sudo apt install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
fi

echo "✅ Deploy completed! Visit: https://$DOMAIN"
