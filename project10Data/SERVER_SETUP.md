# 🚀 Server Setup Guide - DataCleanup Pro

## ⚠️ Current Status

**Backend**: ❌ NOT RUNNING
**Frontend**: ❓ Unknown
**Database**: ✅ Supabase (configured)

**This is why you're getting 404 errors** - the backend service isn't running!

---

## Quick Start (Get It Running Now)

### 1. Start Backend Manually

```bash
ssh root@134.209.6.186

# Navigate to backend
cd /opt/datacleanup/backend

# Install dependencies (if not done)
pip install -r requirements.txt

# Run backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Keep this terminal open. The backend should now be running.

---

### 2. Start Frontend (In Another Terminal)

```bash
ssh root@134.209.6.186

# Navigate to frontend
cd /opt/datacleanup/frontend

# Install dependencies (if not done)
npm install

# Build frontend
npm run build

# Serve frontend (option 1 - for testing)
npm run preview -- --host 0.0.0.0 --port 3000

# OR serve with nginx (option 2 - production)
# (requires nginx configuration)
```

---

## Proper Setup (Production)

### Step 1: Install System Dependencies

```bash
ssh root@134.209.6.186

# Update system
apt update && apt upgrade -y

# Install Python 3.10+
apt install -y python3 python3-pip python3-venv

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install nginx
apt install -y nginx

# Install Redis
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Install PostgreSQL client (optional - for local DB)
# apt install -y postgresql-client
```

---

### Step 2: Setup Backend Service

```bash
# Create systemd service
cat > /etc/systemd/system/datacleanup-backend.service << 'EOF'
[Unit]
Description=DataCleanup Pro Backend (FastAPI)
After=network.target redis.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/datacleanup/backend
Environment="PATH=/opt/datacleanup/backend/venv/bin"
ExecStart=/opt/datacleanup/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create virtual environment
cd /opt/datacleanup/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Enable and start service
systemctl daemon-reload
systemctl enable datacleanup-backend
systemctl start datacleanup-backend

# Check status
systemctl status datacleanup-backend
```

---

### Step 3: Setup Frontend

```bash
cd /opt/datacleanup/frontend

# Install dependencies
npm install

# Create production build
npm run build

# The build output will be in /opt/datacleanup/frontend/dist
```

---

### Step 4: Configure Nginx

```bash
# Create nginx configuration
cat > /etc/nginx/sites-available/datacleanup << 'EOF'
server {
    listen 80;
    server_name yourdomain.com;  # Change this!

    # Frontend (React app)
    location / {
        root /opt/datacleanup/frontend/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API (FastAPI)
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/datacleanup /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx
systemctl enable nginx
```

---

### Step 5: Configure Environment Variables

```bash
cd /opt/datacleanup/backend

# Edit .env file
nano .env

# Make sure these are set:
# - SECRET_KEY (the one we generated)
# - DATABASE_URL (Supabase connection string)
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - SMTP_PASSWORD (new Brevo key after you revoke the old one)
# - REDIS_URL=redis://localhost:6379/0

# Restart backend after changes
systemctl restart datacleanup-backend
```

---

## Verification Steps

### 1. Check Backend

```bash
# Check if backend is running
systemctl status datacleanup-backend

# Check logs
journalctl -u datacleanup-backend -f

# Test API endpoint
curl http://localhost:8000/api/v1/
```

Expected response:
```json
{
  "message": "DataCleanup Pro™ API v1",
  "version": "1.0.0",
  ...
}
```

### 2. Check Frontend

```bash
# Check if nginx is running
systemctl status nginx

# Test frontend
curl http://localhost/
```

Should return HTML.

### 3. Test Full Flow

```bash
# From your local machine
curl http://134.209.6.186/api/v1/

# Or visit in browser:
# http://134.209.6.186
```

---

## Quick Troubleshooting

### Backend won't start

```bash
# Check logs
journalctl -u datacleanup-backend -n 50

# Common issues:
# 1. Missing dependencies
cd /opt/datacleanup/backend
source venv/bin/activate
pip install -r requirements.txt

# 2. Port already in use
ss -tlnp | grep :8000
# Kill the process if needed

# 3. Missing .env
cp .env.example .env
nano .env  # Fill in values
```

### Frontend won't build

```bash
cd /opt/datacleanup/frontend

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for errors in output
```

### 404 Errors

```bash
# Make sure backend is running
systemctl status datacleanup-backend

# Make sure nginx is configured correctly
nginx -t
cat /etc/nginx/sites-enabled/datacleanup

# Make sure frontend is built
ls -la /opt/datacleanup/frontend/dist
```

---

## SSL/HTTPS Setup (Production)

```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

---

## Monitoring

```bash
# View backend logs
journalctl -u datacleanup-backend -f

# View nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check system resources
htop

# Check Redis
redis-cli ping  # Should return PONG
```

---

## Current File Structure on Server

```
/opt/datacleanup/
├── backend/
│   ├── app/
│   ├── .env              ✅ Exists
│   ├── .env.example      ✅ Exists
│   ├── requirements.txt  ✅ Exists
│   └── venv/            ❓ May need to create
├── frontend/
│   ├── src/
│   ├── dist/            ❓ Needs npm run build
│   ├── package.json     ✅ Exists
│   └── node_modules/    ❓ May need npm install
└── docs/
```

---

## Next Steps (In Order)

1. ✅ Files deployed to server
2. ⚠️ Create Python virtual environment
3. ⚠️ Install Python dependencies
4. ⚠️ Install Node dependencies
5. ⚠️ Build frontend
6. ⚠️ Create systemd services
7. ⚠️ Configure nginx
8. ⚠️ Start services
9. ⚠️ Test everything

---

## Quick Test Script

Save this as `test-server.sh` on the server:

```bash
#!/bin/bash

echo "Testing DataCleanup Pro Server..."

echo -e "\n1. Backend Service:"
systemctl is-active datacleanup-backend || echo "  ❌ NOT RUNNING"

echo -e "\n2. Backend API:"
curl -s http://localhost:8000/api/v1/ | grep -q "DataCleanup" && echo "  ✅ API responding" || echo "  ❌ API not responding"

echo -e "\n3. Nginx:"
systemctl is-active nginx || echo "  ❌ NOT RUNNING"

echo -e "\n4. Redis:"
redis-cli ping | grep -q "PONG" && echo "  ✅ Redis responding" || echo "  ❌ Redis not responding"

echo -e "\n5. Frontend Files:"
[ -d /opt/datacleanup/frontend/dist ] && echo "  ✅ Build exists" || echo "  ❌ Need to run npm run build"

echo -e "\nDone!"
```

---

**Bottom Line**: The code is deployed, but **services aren't set up yet**. Follow the steps above to get it running! 🚀
