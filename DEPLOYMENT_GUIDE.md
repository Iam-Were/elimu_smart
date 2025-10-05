# Elimu Smart Deployment Guide

## 🌍 Environment Overview

Elimu Smart uses a **3-tier environment strategy** for safe, reliable deployments:

| Environment | URL | Purpose | Database | Port |
|-------------|-----|---------|----------|------|
| **Development** | http://localhost:5173 | Local development | `elimu_smart_dev` (local) | 1337 |
| **Staging** | https://staging.elimu-smart.co.ke | Pre-production testing | `elimu_smart_staging` | 1338 |
| **Production** | https://elimu-smart.co.ke | Live user-facing app | `elimu_smart_production` | 1337 |

---

## 📋 Prerequisites

### VPS Requirements
- Ubuntu 20.04+ LTS
- 4GB RAM minimum
- 20GB storage
- Root SSH access

### Domain Configuration
Point these DNS A records to your VPS IP (145.239.42.121):
```
elimu-smart.co.ke           → 145.239.42.121
www.elimu-smart.co.ke       → 145.239.42.121
staging.elimu-smart.co.ke   → 145.239.42.121
```

### Installed Software
- Node.js 18+
- PostgreSQL 12+
- Redis 5+
- Apache 2.4+
- PM2 (process manager)
- Certbot (SSL certificates)

---

## 🚀 Quick Start Deployment

### 1. Initial VPS Setup (One-Time)

```bash
# SSH into VPS
ssh root@145.239.42.121

# Clone repository
cd /root
git clone https://github.com/Iam-Were/elimu_smart.git
cd elimu_smart

# Run automated setup script
bash backend/setup-vps.sh
```

This installs: PostgreSQL, Redis, Nginx, PM2, and all dependencies.

---

## 🗄️ Database Setup

### Create Staging Database

```bash
# SSH into VPS
ssh root@145.239.42.121

# Create staging database
sudo -u postgres psql -c "CREATE DATABASE elimu_smart_staging;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'El1musmart2024';"
```

### Verify Databases

```bash
sudo -u postgres psql -l | grep elimu_smart
```

Expected output:
```
elimu_smart_production  | postgres | UTF8 | ...
elimu_smart_staging     | postgres | UTF8 | ...
```

---

## 🔧 Backend Deployment

### Environment Files

**Production** (`.env`):
```bash
cd /root/elimu_smart/backend
cat > .env << 'EOF'
APP_ID=elimu-smart-production
MASTER_KEY=ElImuSmartMasterKey2024Secure
SERVER_URL=https://elimu-smart.co.ke/parse
DATABASE_URI=postgres://postgres:El1musmart2024@localhost:5432/elimu_smart_production
PORT=1337
NODE_ENV=production
REDIS_URL=redis://localhost:6379/0
EOF
```

**Staging** (`.env.staging`):
```bash
cat > .env.staging << 'EOF'
APP_ID=elimu-smart-staging
MASTER_KEY=ElImuSmartStagingMasterKey2024Secure
SERVER_URL=https://staging.elimu-smart.co.ke/parse
DATABASE_URI=postgres://postgres:El1musmart2024@localhost:5432/elimu_smart_staging
PORT=1338
NODE_ENV=staging
REDIS_URL=redis://localhost:6379/1
EOF
```

### Start Parse Server

```bash
cd /root/elimu_smart/backend

# Install dependencies
npm install

# Start all services (production + staging)
pm2 start ecosystem.config.js
pm2 save
```

### Verify Backend

```bash
# Check PM2 processes
pm2 status

# Test production endpoint
curl http://localhost:1337/health

# Test staging endpoint
curl http://localhost:1338/health
```

---

## 🎨 Frontend Deployment

### Build for Production

```bash
cd /root/elimu_smart/frontend

# Install dependencies
npm install

# Build for production
npm run build -- --mode production

# Deploy to web root
sudo cp -r dist/* /var/www/elimu-smart/
```

### Build for Staging

```bash
# Build for staging
npm run build -- --mode staging

# Deploy to staging web root
sudo cp -r dist/* /var/www/elimu-smart-staging/
```

---

## 🔐 SSL Certificate Setup

### Install Certbot (if not installed)

```bash
sudo apt install certbot python3-certbot-apache -y
```

### Generate SSL Certificates

```bash
# Production certificate
sudo certbot --apache -d elimu-smart.co.ke -d www.elimu-smart.co.ke

# Staging certificate
sudo certbot --apache -d staging.elimu-smart.co.ke
```

### Auto-Renewal

Certbot auto-renews. Verify with:
```bash
sudo certbot renew --dry-run
```

---

## 🔄 Deployment Workflow

### Deploy to Staging (Test Changes)

```bash
# 1. Push to GitHub from local machine
git push origin main

# 2. SSH into VPS
ssh root@145.239.42.121

# 3. Pull latest code
cd /root/elimu_smart
git pull origin main

# 4. Restart staging backend
pm2 restart parse-server-staging

# 5. Build and deploy staging frontend
cd frontend
npm run build -- --mode staging
sudo cp -r dist/* /var/www/elimu-smart-staging/

# 6. Test staging
curl https://staging.elimu-smart.co.ke/health
```

### Deploy to Production (After Staging Tests Pass)

```bash
# 1. Restart production backend
pm2 restart parse-server-prod

# 2. Build and deploy production frontend
cd /root/elimu_smart/frontend
npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/

# 3. Verify production
curl https://elimu-smart.co.ke/health
```

---

## 🛠️ Useful Commands

### PM2 Process Management

```bash
# View all processes
pm2 list

# View logs
pm2 logs parse-server-prod
pm2 logs parse-server-staging

# Restart specific service
pm2 restart parse-server-prod
pm2 restart parse-dashboard-prod

# Stop/Start services
pm2 stop parse-server-staging
pm2 start parse-server-staging

# Monitor resources
pm2 monit
```

### Database Management

```bash
# Access PostgreSQL
sudo -u postgres psql

# Connect to production database
\c elimu_smart_production

# Connect to staging database
\c elimu_smart_staging

# List tables
\dt

# Exit
\q
```

### Apache Management

```bash
# Test configuration
sudo apache2ctl configtest

# Reload (graceful restart)
sudo systemctl reload apache2

# Full restart
sudo systemctl restart apache2

# View logs
sudo tail -f /var/log/apache2/elimu-smart-access.log
sudo tail -f /var/log/apache2/staging-elimu-smart-error.log
```

### Redis Management

```bash
# Connect to Redis
redis-cli

# Select production database (0)
SELECT 0
KEYS *

# Select staging database (1)
SELECT 1
KEYS *

# Clear staging cache
FLUSHDB

# Exit
EXIT
```

---

## 🧪 Testing Checklist

### After Staging Deployment

- [ ] Health check: `curl https://staging.elimu-smart.co.ke/health`
- [ ] API test: `curl https://staging.elimu-smart.co.ke/parse/health`
- [ ] Frontend loads: Open https://staging.elimu-smart.co.ke in browser
- [ ] Login works with demo accounts
- [ ] All assessments load correctly
- [ ] Dashboard displays data
- [ ] No console errors in browser DevTools

### Before Production Deployment

- [ ] All staging tests passed
- [ ] Database migrations completed (if any)
- [ ] Environment variables verified
- [ ] External APIs tested (M-Pesa sandbox → production)
- [ ] SSL certificates valid
- [ ] PM2 processes healthy

### After Production Deployment

- [ ] Health check: `curl https://elimu-smart.co.ke/health`
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] Login works for all roles (student, counselor, admin)
- [ ] Monitor PM2 logs for 5 minutes: `pm2 logs --lines 50`
- [ ] Check error logs: `sudo tail -f /var/log/apache2/elimu-smart-error.log`

---

## 🚨 Troubleshooting

### Parse Server Won't Start

```bash
# Check logs
pm2 logs parse-server-prod --lines 50

# Common issues:
# 1. Database connection failed → Check .env DATABASE_URI and PostgreSQL password
# 2. Port already in use → Check if another process is using port 1337/1338
# 3. Redis connection failed → Verify Redis is running: systemctl status redis-server
```

### Frontend Not Loading

```bash
# 1. Check Apache is serving files
ls -la /var/www/elimu-smart/

# 2. Verify Apache config
sudo apache2ctl -S | grep elimu

# 3. Check Apache error logs
sudo tail -f /var/log/apache2/elimu-smart-error.log

# 4. Rebuild and redeploy
cd /root/elimu_smart/frontend
npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Apache SSL test
sudo apache2ctl -S | grep 443
```

### Database Connection Errors

```bash
# Test database connection
PGPASSWORD=El1musmart2024 psql -U postgres -d elimu_smart_production -h localhost -c "SELECT 1;"

# Reset PostgreSQL password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'El1musmart2024';"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📊 Monitoring & Maintenance

### Daily Automated Backups

Cron job runs at 2 AM daily:
```bash
# View backup schedule
crontab -l

# Manual backup
bash /root/elimu_smart/backend/scripts/backup-database.sh

# Backups location
ls -lh ~/elimu_smart_backups/
```

### Restore from Backup

```bash
# List backups
ls -lh ~/elimu_smart_backups/

# Restore production
gunzip ~/elimu_smart_backups/elimu_smart_YYYYMMDD_HHMMSS.sql.gz
PGPASSWORD=El1musmart2024 psql -U postgres elimu_smart_production < ~/elimu_smart_backups/elimu_smart_YYYYMMDD_HHMMSS.sql
```

### Performance Monitoring

```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# Disk usage
df -h

# Database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('elimu_smart_production'));"
```

---

## 🔗 Quick Links

| Service | URL | Credentials |
|---------|-----|-------------|
| **Production App** | https://elimu-smart.co.ke | student@elimu.com / student |
| **Staging App** | https://staging.elimu-smart.co.ke | student@elimu.com / student |
| **Production Dashboard** | https://elimu-smart.co.ke/dashboard | admin / [set in .env] |
| **Staging Dashboard** | https://staging.elimu-smart.co.ke/dashboard | admin / [set in .env.staging] |

---

## 📝 Environment Variables Reference

### Frontend (.env files)

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `VITE_PARSE_APP_ID` | elimu-smart-local-dev | elimu-smart-staging | elimu-smart-production |
| `VITE_PARSE_SERVER_URL` | http://localhost:1337/parse | https://staging.elimu-smart.co.ke/parse | https://elimu-smart.co.ke/parse |
| `VITE_ENV` | development | staging | production |

### Backend (.env files)

| Variable | Production | Staging |
|----------|-----------|---------|
| `PORT` | 1337 | 1338 |
| `DATABASE_URI` | ...elimu_smart_production | ...elimu_smart_staging |
| `REDIS_URL` | redis://localhost:6379/0 | redis://localhost:6379/1 |
| `NODE_ENV` | production | staging |

---

## 🎯 Next Steps

1. ✅ Point DNS to VPS (145.239.42.121)
2. ✅ Run initial deployment
3. ✅ Install SSL certificates
4. ⏳ Test staging environment thoroughly
5. ⏳ Deploy to production
6. ⏳ Monitor logs for 24 hours
7. ⏳ Set up external monitoring (UptimeRobot)

---

**Last Updated:** 2025-10-06
**Maintained by:** Antony Were
**Support:** Check backend/.env for all credentials
