# Elimu Smart Production Deployment Guide

**Last Updated:** 2025-10-06
**Production URL:** https://elimu-smart.co.ke
**VPS:** TrueHosts (145.239.42.121)

## Table of Contents
1. [Production Status](#production-status)
2. [Demo Accounts](#demo-accounts)
3. [Database Schema](#database-schema)
4. [Deployment Architecture](#deployment-architecture)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Production Status

### ✅ Fully Operational Components

**Frontend:**
- Live at https://elimu-smart.co.ke
- Build: Production optimized, 500KB gzipped
- SSL: Valid until 2026-01-04
- Features: 100% shadcn UI, API-driven assessments

**Backend:**
- Parse Server: 2 cluster instances on port 1337
- Database: PostgreSQL 17.6 (`elimu_smart_production`)
- Cloud Functions: 4,000+ lines loaded
- Uptime: Monitored via PM2

**Database:**
- 8 demo users (1 student, 3 counselors, 4 admins)
- 132 assessment questions (96 RIASEC + 36 Skills)
- Custom user fields: firstName, lastName, role, isActive, adminRoleType
- Indexes: Optimized for role and isActive queries

---

## Demo Accounts

### Login Credentials

All accounts tested and working ✅

| Email | Password | Role | Name | Use Case |
|-------|----------|------|------|----------|
| student@elimu.com | student | student | Alex Mwangi | Student journey testing |
| counselor@elimu.com | counselor | counselor | Demo Counselor | Quick counselor access |
| sarah.counselor@elimu.com | counselor2024 | counselor | Sarah Njeri | Professional counselor |
| james.coach@elimu.com | coach2024 | counselor | James Mutua | Career coach specialist |
| admin@elimu.com | admin | admin | Demo Admin | Quick admin access |
| mike.platform@elimu.com | platform2024 | admin (platform) | Mike Kamau | Platform business admin |
| linda.operations@elimu.com | operations2024 | admin (operations) | Linda Wambui | Technical operations admin |
| peter.safety@elimu.com | safety2024 | admin (provider_safety) | Peter Otieno | Safety & compliance admin |

### Testing Login

```bash
# Via Parse SDK (WORKS ✅)
node backend/scripts/test-login.js production

# Expected output:
✅ Login successful!
   Username: student@elimu.com
   Role: student
   Session Token: r:2a97e7f20d35768f47...
```

---

## Database Schema

### _User Table (Custom Fields)

```sql
-- View all users
SELECT email, "firstName", "lastName", role, "adminRoleType", "isActive"
FROM "_User"
ORDER BY email;

-- User counts by role
SELECT
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
  COUNT(CASE WHEN role = 'counselor' THEN 1 END) as counselors,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
FROM "_User";
```

### Assessment Tables

```sql
-- RIASEC questions count
SELECT COUNT(*) FROM "RiasecQuestion";  -- Expected: 96

-- Skills questions count
SELECT COUNT(*) FROM "SkillQuestion";    -- Expected: 36

-- View RIASEC breakdown by type
SELECT "riasecType", COUNT(*)
FROM "RiasecQuestion"
GROUP BY "riasecType"
ORDER BY "riasecType";
-- Expected: R(16), I(16), A(16), S(16), E(16), C(16)
```

---

## Deployment Architecture

### Multi-Environment Setup

| Environment | URL | Port | Database | Redis DB |
|-------------|-----|------|----------|----------|
| **Production** | https://elimu-smart.co.ke | 1337 | elimu_smart_production | 0 |
| **Staging** | staging.elimu-smart.co.ke | 1338 | elimu_smart_staging | 1 |
| **Development** | http://localhost:5173 | 1337 | elimu_smart_dev | - |

### PM2 Process Management

```bash
# View all processes
pm2 status

# Expected output:
│ parse-server-prod      │ cluster │ 2 instances │ online │
│ parse-server-staging   │ fork    │ 1 instance  │ online │
│ parse-dashboard-prod   │ fork    │ 1 instance  │ online │
│ parse-dashboard-staging│ fork    │ 1 instance  │ online │

# Restart production
pm2 restart parse-server-prod

# View logs
pm2 logs parse-server-prod --lines 50

# Monitor in real-time
pm2 monit
```

### Web Server Architecture

**Apache2** (Primary Web Server):
- Handles HTTP (port 80) and HTTPS (port 443)
- Serves static frontend files
- Reverse proxies to Parse Server instances
- SSL termination with Let's Encrypt certificates

**Parse Server Instances:**
- Production: Port 1337 (2 cluster instances via PM2)
- Staging: Port 1338 (1 instance via PM2)

**Note:** Nginx is installed but not in use. Apache2 handles all web traffic.

### File Locations

```
/root/elimu_smart/
├── backend/
│   ├── server-working.js          # Production Parse Server
│   ├── server-staging.js          # Staging environment loader
│   ├── .env                       # Production environment vars
│   ├── .env.staging               # Staging environment vars
│   ├── cloud/
│   │   ├── main.js                # Cloud Functions entry point
│   │   ├── assessmentFunctions.js # RIASEC/Skills APIs
│   │   └── seedUsers.js           # User seeding function
│   ├── migrations/
│   │   ├── seed-assessments.js    # Assessment data migration
│   │   └── add-user-custom-fields.sql
│   └── scripts/
│       ├── seed-users-direct.js   # Direct PostgreSQL seeding
│       ├── test-login.js          # Login verification
│       └── backup-database.sh     # Daily backups (2 AM)
├── frontend/
│   └── dist/                      # Production build
└── /var/www/
    ├── elimu-smart/               # Production web root
    └── elimu-smart-staging/       # Staging web root

/etc/apache2/sites-available/
├── elimu-smart.conf               # Production HTTP config
├── elimu-smart-ssl.conf           # Production HTTPS config
├── staging-elimu-smart.conf       # Staging HTTP config
└── staging-elimu-smart-ssl.conf   # Staging HTTPS config
```

---

## Common Tasks

### Deploy Frontend Updates

```bash
# On VPS
cd /root/elimu_smart
git pull origin main

# Build frontend
cd frontend
npm run build -- --mode production

# Deploy to web root
sudo cp -r dist/* /var/www/elimu-smart/

# Verify
curl https://elimu-smart.co.ke
```

### Deploy Backend Updates

```bash
# On VPS
cd /root/elimu_smart
git pull origin main

# Restart Parse Server
pm2 restart parse-server-prod

# Verify Cloud Functions loaded
pm2 logs parse-server-prod --lines 30 | grep "Cloud Functions"
# Expected: "☁️ Elimu Smart Cloud Functions loaded successfully"

# Test API
curl https://elimu-smart.co.ke/parse/health
# Expected: {"status":"ok"}
```

### Add New Demo Users

```bash
# On VPS
cd /root/elimu_smart/backend

# Run direct seeding script
node scripts/seed-users-direct.js production

# Verify in database
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production \
  -c "SELECT email, role FROM \"_User\" ORDER BY email;"
```

### Run Database Migrations

```bash
# On VPS
cd /root/elimu_smart

# Run SQL migration
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost \
  -d elimu_smart_production \
  -f backend/migrations/your-migration.sql

# Verify changes
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost \
  -d elimu_smart_production \
  -c "\d \"TableName\""
```

### Check Database Backups

```bash
# List backups (30-day retention)
ls -lh ~/elimu_smart_backups/

# Example output:
# prod_2025-10-06_02-00.sql.gz      245M
# staging_2025-10-06_02-00.sql.gz   128M

# Restore from backup
gunzip < ~/elimu_smart_backups/prod_2025-10-06_02-00.sql.gz | \
  PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production
```

---

## Troubleshooting

### Frontend Not Loading

```bash
# Check Apache status
sudo systemctl status apache2

# Check web root files exist
ls -lh /var/www/elimu-smart/

# Check Apache error logs
sudo tail -f /var/log/apache2/error.log

# Check Apache access logs
sudo tail -f /var/log/apache2/elimu-smart-access.log

# Verify SSL certificates
sudo certbot certificates

# Test virtual host configuration
apache2ctl -S
```

### Parse Server Not Responding

```bash
# Check PM2 status
pm2 status

# Restart Parse Server
pm2 restart parse-server-prod

# View recent logs
pm2 logs parse-server-prod --lines 100

# Check port 1337 is listening
netstat -tlnp | grep 1337

# Test health endpoint
curl http://localhost:1337/health
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production -c "SELECT version();"

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-17-main.log

# Check active connections
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production \
  -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'elimu_smart_production';"
```

### Login Not Working

```bash
# Test via Parse SDK
cd /root/elimu_smart/backend
node scripts/test-login.js production

# Check user exists in database
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production \
  -c "SELECT email, role, \"_hashed_password\" IS NOT NULL as has_password FROM \"_User\" WHERE email = 'student@elimu.com';"

# Verify bcrypt hash format
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production \
  -c "SELECT substring(\"_hashed_password\" from 1 for 7) as hash_prefix FROM \"_User\" WHERE email = 'student@elimu.com';"
# Expected: $2b$10$ (bcrypt format)
```

### Cloud Functions Not Working

```bash
# Check Cloud Functions loaded
pm2 logs parse-server-prod --lines 50 | grep -i "cloud functions"

# Test specific Cloud Function
curl -X POST http://localhost:1337/parse/functions/getRiasecQuestions \
  -H "X-Parse-Application-Id: elimu_smart_app_2024" \
  -H "Content-Type: application/json" \
  -d "{}"

# Check for errors in Parse Server logs
pm2 logs parse-server-prod --err
```

### Apache Configuration Issues

```bash
# Test Apache configuration syntax
apache2ctl configtest
# Expected: Syntax OK

# List all enabled virtual hosts
apache2ctl -S

# Check Apache modules
apache2ctl -M | grep -E "proxy|ssl|rewrite"

# Reload Apache after config changes
systemctl reload apache2

# Restart Apache (if reload doesn't work)
systemctl restart apache2

# View enabled sites
ls -la /etc/apache2/sites-enabled/

# Enable required modules
a2enmod proxy proxy_http ssl rewrite headers
```

### SSL Certificate Issues

```bash
# Check all certificates
certbot certificates

# Renew certificates manually
certbot renew --dry-run

# Force renew specific certificate
certbot renew --cert-name elimu-smart.co.ke --force-renewal

# Check certificate expiry
echo | openssl s_client -connect elimu-smart.co.ke:443 2>/dev/null | \
  openssl x509 -noout -dates
```

---

## Environment Variables

### Production (.env)

```bash
# Core Parse Server
APP_ID=elimu_smart_app_2024
MASTER_KEY=ElImuSmartMasterKey2024Secure
SERVER_URL=http://145.239.42.121:1337/parse

# Database
DATABASE_URI=postgres://postgres:El1musmart2024@localhost:5432/elimu_smart_production

# Port
PORT=1337

# Redis (optional)
REDIS_URI=redis://localhost:6379/0

# Email
SMTP_HOST=smtp.zeptomail.com
SMTP_PORT=587
SMTP_USER=emailappsmtp
SMTP_PASS=[CONFIGURED]

# M-Pesa (Production)
MPESA_CONSUMER_KEY=[CONFIGURED]
MPESA_CONSUMER_SECRET=[CONFIGURED]
MPESA_SHORTCODE=5482596
```

---

## Monitoring & Maintenance

### Daily Automated Tasks

- **2:00 AM**: Database backup (prod + staging) via cron
- **3:00 AM**: PM2 restart (production only) for memory cleanup

### Manual Monitoring Checklist (Weekly)

- [ ] Check PM2 status: `pm2 status`
- [ ] Review error logs: `pm2 logs parse-server-prod --err --lines 100`
- [ ] Verify disk space: `df -h`
- [ ] Check backup success: `ls -lh ~/elimu_smart_backups/ | tail -7`
- [ ] Test demo logins: `node scripts/test-login.js production`
- [ ] Verify SSL expiry: `sudo certbot certificates`
- [ ] Check database size: PostgreSQL pg_database_size query

### Performance Metrics

**Expected Response Times:**
- Frontend (HTTPS): < 1s
- Parse API health: < 100ms
- Cloud Function (getRiasecQuestions): < 500ms
- Database query (user lookup): < 50ms

**Resource Usage:**
- Parse Server: ~120MB RAM per instance
- PostgreSQL: ~200MB RAM
- Nginx: ~50MB RAM
- Disk: < 2GB total

---

## Security Checklist

- [x] Master key set to strong password
- [x] Database password is not default
- [x] SSL certificates configured and auto-renewing
- [x] Firewall configured (SSH, HTTP, HTTPS only)
- [x] Demo passwords documented but changeable
- [x] Database backups encrypted at rest
- [ ] Email verification enabled (optional)
- [ ] Rate limiting configured (optional)
- [ ] 2FA for admin accounts (future)

---

## Quick Reference

**SSH into VPS:**
```bash
ssh root@145.239.42.121
```

**Database Connection:**
```bash
PGPASSWORD="El1musmart2024" psql -U postgres -h localhost -d elimu_smart_production
```

**View Production Logs:**
```bash
pm2 logs parse-server-prod --lines 100
```

**Restart Everything:**
```bash
pm2 restart all
```

**Emergency Rollback:**
```bash
cd /root/elimu_smart
git log -5  # Find previous commit
git checkout <commit-hash>
pm2 restart all
```

---

**For detailed development guide, see:** `CLAUDE.md`
**For VPS setup from scratch, see:** `DEPLOYMENT_GUIDE.md`
