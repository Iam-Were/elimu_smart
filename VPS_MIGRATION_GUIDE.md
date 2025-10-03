# Elimu Smart VPS Migration Guide

## VPS Details
- **Provider**: TrueHost Cloud (Strasbourg, France - SBG2)
- **Hostname**: elimu-smart
- **IP Address**: 145.239.42.121
- **Root Password**: El1musmart
- **Control Panel**: https://master.sbg2.truehost.cloud:4083
- **Control Panel Alt**: http://master.sbg2.truehost.cloud:4082

## Pre-Migration Checklist

### 1. Local Environment Audit ✅
- [x] Frontend: React 19 + Vite + TypeScript
- [x] Backend: Parse Server (Node.js) on port 1337
- [x] Database: PostgreSQL (postgres:password@localhost:5432/elimu_smart_dev)
- [x] API Server: Simple API on port 3001
- [x] Frontend Dev: Port 5173

### 2. VPS Initial Setup Tasks

#### A. Server Access & Security
```bash
# 1. Connect to VPS
ssh root@145.239.42.121
# Password: El1musmart

# 2. Update system
apt update && apt upgrade -y

# 3. Create non-root user for application
adduser elimu
usermod -aG sudo elimu

# 4. Setup SSH key authentication (recommended)
# On local machine:
ssh-keygen -t rsa -b 4096 -C "elimu-smart-deploy"
ssh-copy-id elimu@145.239.42.121

# 5. Configure firewall
ufw allow 22      # SSH
ufw allow 80      # HTTP
ufw allow 443     # HTTPS
ufw allow 1337    # Parse Server
ufw allow 5432    # PostgreSQL (optional - should use internal only)
ufw enable
```

#### B. Install Required Software
```bash
# 1. Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# 2. Install PostgreSQL 17
apt install -y postgresql postgresql-contrib

# 3. Install Nginx (reverse proxy)
apt install -y nginx

# 4. Install PM2 (process manager)
npm install -g pm2

# 5. Install Git
apt install -y git

# 6. Verify installations
node --version    # Should be v20.x
npm --version     # Should be 10.x
psql --version    # Should be 17.x
nginx -v          # Should be latest
pm2 --version     # Should be latest
```

### 3. Database Migration

#### A. Export Local Database
```bash
# On local Windows machine (PowerShell):
cd C:\Users\c\Documents\GitHub\elimu_smart\backend

# Create database dump
pg_dump -U postgres -h localhost -d elimu_smart_dev -F c -f elimu_smart_backup.dump

# Alternative: SQL format for easier inspection
pg_dump -U postgres -h localhost -d elimu_smart_dev -f elimu_smart_backup.sql
```

#### B. Setup PostgreSQL on VPS
```bash
# On VPS:
sudo -u postgres psql

# In PostgreSQL console:
CREATE DATABASE elimu_smart_production;
CREATE USER elimu_db_user WITH ENCRYPTED PASSWORD 'your-strong-password-here';
GRANT ALL PRIVILEGES ON DATABASE elimu_smart_production TO elimu_db_user;
\q
```

#### C. Import Database to VPS
```bash
# Transfer dump file to VPS (from local machine):
scp elimu_smart_backup.dump elimu@145.239.42.121:/home/elimu/

# On VPS, restore database:
sudo -u postgres pg_restore -d elimu_smart_production /home/elimu/elimu_smart_backup.dump

# Or if using SQL format:
sudo -u postgres psql -d elimu_smart_production -f /home/elimu/elimu_smart_backup.sql
```

### 4. Backend Deployment

#### A. Transfer Backend Code
```bash
# On local machine (PowerShell):
cd C:\Users\c\Documents\GitHub\elimu_smart

# Transfer backend directory to VPS:
scp -r backend elimu@145.239.42.121:/home/elimu/elimu_smart/
```

#### B. Configure Backend Environment
```bash
# On VPS:
cd /home/elimu/elimu_smart/backend

# Create production .env file
cat > .env << 'EOF'
# Parse Server Configuration
APP_ID=elimu-smart-production
MASTER_KEY=your-strong-master-key-here
SERVER_URL=https://elimu-smart.com/parse
PUBLIC_SERVER_URL=https://elimu-smart.com/parse

# Database Configuration
DATABASE_URI=postgres://elimu_db_user:your-strong-password-here@localhost:5432/elimu_smart_production

# Server Configuration
PORT=1337
NODE_ENV=production

# Security
SESSION_SECRET=your-session-secret-here

# CORS Configuration
ALLOWED_ORIGINS=https://elimu-smart.com,https://www.elimu-smart.com
EOF

# Install dependencies
npm install --production

# Test Parse Server
node server-working.js
# Press Ctrl+C after confirming it starts successfully
```

#### C. Setup PM2 Process Manager
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'elimu-parse-server',
    script: './server-working.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    },
    error_file: './logs/parse-error.log',
    out_file: './logs/parse-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M'
  }]
}
EOF

# Start Parse Server with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs

# Monitor Parse Server
pm2 monit
pm2 logs elimu-parse-server
```

### 5. Frontend Deployment

#### A. Build Frontend Locally
```bash
# On local machine (PowerShell):
cd C:\Users\c\Documents\GitHub\elimu_smart\frontend

# Update API endpoints in code to production URLs
# Edit src/config/api.ts or equivalent to point to:
# - Parse Server: https://elimu-smart.com/parse
# - API Server: https://elimu-smart.com/api

# Build production bundle
npm run build

# This creates /dist folder with optimized static files
```

#### B. Transfer Frontend to VPS
```bash
# Transfer built frontend to VPS:
scp -r dist elimu@145.239.42.121:/home/elimu/elimu_smart/frontend/

# Or transfer entire frontend directory if needed:
scp -r frontend elimu@145.239.42.121:/home/elimu/elimu_smart/
```

### 6. Nginx Configuration

#### A. Setup Nginx as Reverse Proxy
```bash
# On VPS, create Nginx configuration:
sudo nano /etc/nginx/sites-available/elimu-smart

# Add this configuration:
```

```nginx
# Elimu Smart Production Configuration
server {
    listen 80;
    server_name elimu-smart.com www.elimu-smart.com 145.239.42.121;

    # Frontend static files
    root /home/elimu/elimu_smart/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routing (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Parse Server API
    location /parse {
        proxy_pass http://localhost:1337/parse;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Server (if needed)
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/elimu-smart /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### B. SSL Certificate Setup (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (only after domain is pointing to VPS)
sudo certbot --nginx -d elimu-smart.com -d www.elimu-smart.com

# Certbot will automatically update Nginx configuration for HTTPS
# Test auto-renewal
sudo certbot renew --dry-run
```

### 7. Domain Configuration

#### A. DNS Setup
1. Go to your domain registrar (e.g., Namecheap, GoDaddy)
2. Add A records pointing to VPS IP: **145.239.42.121**
   ```
   A Record: @ → 145.239.42.121 (TTL: 300)
   A Record: www → 145.239.42.121 (TTL: 300)
   ```
3. Wait for DNS propagation (can take up to 48 hours, usually much faster)

#### B. Verify DNS Propagation
```bash
# Check if DNS is propagated:
nslookup elimu-smart.com
ping elimu-smart.com
```

### 8. Post-Deployment Verification

#### A. Health Checks
```bash
# On VPS, verify all services:
pm2 status                           # Parse Server running
sudo systemctl status postgresql     # Database running
sudo systemctl status nginx          # Web server running

# Check Parse Server logs
pm2 logs elimu-parse-server

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### B. Application Testing
1. **Frontend**: Visit http://145.239.42.121 (or https://elimu-smart.com if DNS configured)
2. **Parse Server**: Test API endpoint at http://145.239.42.121/parse/health
3. **Database**: Verify data loaded correctly through application
4. **Authentication**: Test login with demo users
5. **Core Features**: Test assessment systems, dashboard, navigation

### 9. Monitoring & Maintenance

#### A. Setup Monitoring
```bash
# Install monitoring tools
npm install -g pm2-logrotate

# Configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Setup automated backups
cat > /home/elimu/backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/elimu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U elimu_db_user -d elimu_smart_production -F c -f $BACKUP_DIR/elimu_smart_$DATE.dump
# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.dump" -mtime +7 -delete
EOF

chmod +x /home/elimu/backup-database.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/elimu/backup-database.sh") | crontab -
```

#### B. Security Hardening
```bash
# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Setup fail2ban (brute force protection)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Regular updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 10. Rollback Plan

#### A. Quick Rollback Steps
```bash
# If deployment fails, restore previous state:
pm2 stop all
pm2 delete all

# Restore database from backup
sudo -u postgres pg_restore -d elimu_smart_production /home/elimu/backups/latest.dump

# Restart with previous version
pm2 start previous-ecosystem.config.js
```

## Migration Timeline Estimate

- **Day 1**: VPS setup, software installation, security configuration (2-4 hours)
- **Day 2**: Database migration, backend deployment, PM2 setup (3-5 hours)
- **Day 3**: Frontend build/deployment, Nginx configuration (2-3 hours)
- **Day 4**: Domain configuration, SSL setup, testing (2-4 hours)
- **Day 5**: Monitoring setup, final testing, documentation (2-3 hours)

**Total Estimated Time**: 11-19 hours spread over 5 days

## Critical Success Factors

1. **Database Backup**: Always have current backup before migration
2. **Environment Variables**: Update all API endpoints to production URLs
3. **DNS Propagation**: Allow sufficient time for DNS changes
4. **SSL Certificate**: Only run after DNS is pointing to VPS
5. **Testing**: Comprehensive testing before go-live
6. **Monitoring**: Setup monitoring from day 1
7. **Rollback Plan**: Test rollback procedure before go-live

## Support Contacts

- **VPS Provider**: TrueHost Cloud Support
- **Control Panel**: https://master.sbg2.truehost.cloud:4083
- **VPS IP**: 145.239.42.121
- **Root Access**: root@145.239.42.121

---

**Last Updated**: 2025-10-03
**Migration Status**: Pre-Migration Planning Phase
