# Elimu Smart - Production Architecture

**Last Updated:** 2025-10-06

## System Architecture Diagram

```
                                    Internet
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │   DNS (elimu-smart.co.ke)    │
                        │   3.91.52.5             │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │      Apache2 Web Server      │
                        │   HTTP (80) → HTTPS (443)    │
                        │   SSL: Let's Encrypt         │
                        └──────────────┬───────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
                    ▼                                     ▼
         ┌─────────────────────┐            ┌─────────────────────┐
         │  Static Files       │            │  Reverse Proxy      │
         │  /var/www/          │            │  to Parse Server    │
         │  elimu-smart/       │            │                     │
         └─────────────────────┘            └─────────┬───────────┘
                                                      │
                                    ┌─────────────────┴─────────────────┐
                                    │                                   │
                                    ▼                                   ▼
                         ┌────────────────────┐          ┌────────────────────┐
                         │  Parse Server      │          │  Parse Server      │
                         │  PRODUCTION        │          │  STAGING           │
                         │  Port: 1337        │          │  Port: 1338        │
                         │  PM2: 2 clusters   │          │  PM2: 1 instance   │
                         └─────────┬──────────┘          └─────────┬──────────┘
                                   │                               │
                                   ▼                               ▼
                         ┌────────────────────┐          ┌────────────────────┐
                         │  PostgreSQL        │          │  PostgreSQL        │
                         │  elimu_smart_      │          │  elimu_smart_      │
                         │  production        │          │  staging           │
                         │  Port: 5432        │          │  Port: 5432        │
                         └────────────────────┘          └────────────────────┘
```

## Component Details

### Frontend Layer

**Technology:** React 19 + TypeScript + Vite + shadcn UI

**Production:**
- URL: https://elimu-smart.co.ke
- Path: /var/www/elimu-smart/
- Build: 500KB gzipped
- SSL: Yes (valid until 2026-01-04)

**Staging:**
- URL: https://staging.elimu-smart.co.ke
- Path: /var/www/elimu-smart-staging/
- Build: Same as production
- SSL: Yes (valid until 2026-01-04)

### Web Server Layer

**Apache2** (Primary Web Server)

**Responsibilities:**
1. Serve static frontend files (HTML, CSS, JS, assets)
2. SSL termination (HTTPS → HTTP internal)
3. Reverse proxy to Parse Server instances
4. Request routing based on path (/parse, /dashboard, etc.)

**Configuration Files:**
- `/etc/apache2/sites-available/elimu-smart.conf` (production HTTP)
- `/etc/apache2/sites-available/elimu-smart-ssl.conf` (production HTTPS)
- `/etc/apache2/sites-available/staging-elimu-smart.conf` (staging HTTP)
- `/etc/apache2/sites-available/staging-elimu-smart-ssl.conf` (staging HTTPS)

**Key Modules:**
- `mod_ssl` - HTTPS support
- `mod_proxy` - Reverse proxy
- `mod_proxy_http` - HTTP proxying
- `mod_rewrite` - URL rewriting
- `mod_headers` - Header manipulation

### Application Server Layer

**Parse Server** (Node.js Backend)

**Production Instance:**
- Port: 1337
- PM2 Mode: Cluster (2 instances)
- Script: `/home/ubuntu/elimu_smart/backend/server-working.js`
- Database: elimu_smart_production
- Environment: `.env`

**Staging Instance:**
- Port: 1338
- PM2 Mode: Fork (1 instance)
- Script: `/home/ubuntu/elimu_smart/backend/server-staging.js`
- Database: elimu_smart_staging
- Environment: `.env.staging`

**Cloud Functions:**
- Assessment APIs (getRiasecQuestions, getSkillsQuestions)
- User seeding (seedDemoUsers)
- Billing functions
- Dashboard APIs
- Total: 4,000+ lines of server-side logic

### Database Layer

**PostgreSQL 17.6**

**Production Database:** `elimu_smart_production`
- Users: 8 demo accounts
- RIASEC Questions: 96
- Skills Questions: 36
- Custom user fields with indexes
- Backup: Daily at 2 AM (30-day retention)

**Staging Database:** `elimu_smart_staging`
- Users: 8 demo accounts (same as production)
- RIASEC Questions: 96
- Skills Questions: 36
- Custom user fields with indexes
- Backup: Daily at 2 AM (30-day retention)

**Connection:**
- Host: localhost
- Port: 5432
- User: postgres
- Password: kept in Bitwarden Secrets Manager (never in the repo)

## Request Flow

### Frontend Request (Static Files)

```
User Browser → HTTPS (443) → Apache2 → /var/www/elimu-smart/ → Response
```

### API Request (Parse Cloud Functions)

```
User Browser
    ↓
HTTPS Request to /parse/functions/getRiasecQuestions
    ↓
Apache2 (:443)
    ↓
Reverse Proxy
    ↓
Parse Server (:1337)
    ↓
Cloud Function Execution
    ↓
PostgreSQL Query
    ↓
JSON Response → Apache2 → User Browser
```

### Authentication Flow

```
1. User submits credentials via frontend
2. Frontend calls Parse SDK login()
3. Parse SDK → /parse/login endpoint
4. Apache2 proxies to Parse Server :1337
5. Parse Server queries PostgreSQL _User table
6. Bcrypt password verification
7. Session token generated
8. Response with user object + session token
9. Frontend stores session token
10. Subsequent requests include session token in headers
```

## Port Mapping

| Port | Service | Purpose |
|------|---------|---------|
| 80 | Apache2 | HTTP (redirects to HTTPS) |
| 443 | Apache2 | HTTPS (SSL termination) |
| 1337 | Parse Server | Production API |
| 1338 | Parse Server | Staging API |
| 4040 | Parse Dashboard | Production dashboard |
| 4041 | Parse Dashboard | Staging dashboard |
| 5432 | PostgreSQL | Database server |
| 6379 | Redis | Cache (optional, for sessions) |

## Process Management (PM2)

### Production Processes

```bash
pm2 list

┌─────┬───────────────────────────┬──────────┬─────────┬─────────┐
│ id  │ name                      │ mode     │ status  │ restart │
├─────┼───────────────────────────┼──────────┼─────────┼─────────┤
│ 0   │ parse-server-prod         │ cluster  │ online  │ 4       │
│ 4   │ parse-server-prod         │ cluster  │ online  │ 4       │
│ 2   │ parse-dashboard-prod      │ fork     │ online  │ 0       │
│ 6   │ parse-server-staging      │ fork     │ online  │ 3       │
│ 3   │ parse-dashboard-staging   │ fork     │ online  │ 0       │
└─────┴───────────────────────────┴──────────┴─────────┴─────────┘
```

**Cluster Mode Benefits:**
- Load balancing across 2 CPU cores
- Zero-downtime restarts
- Automatic process recovery
- Better resource utilization

## Security Architecture

### SSL/TLS

**Certificates:** Let's Encrypt (free, auto-renewing)

**Domains Covered:**
- elimu-smart.co.ke ✓
- www.elimu-smart.co.ke ✓
- staging.elimu-smart.co.ke ✓

**Renewal:** Automatic via certbot systemd timer

**Cipher Suites:** Modern TLS 1.2+ only

### Database Security

- Password authentication (no default passwords)
- Local connections only (no external access)
- Role-based access control
- Encrypted backups

### API Security

- Master key required for admin operations
- Session tokens for user authentication
- CORS configured for frontend domains only
- Rate limiting (future enhancement)

## Monitoring & Logging

### Application Logs

**Parse Server:**
```bash
pm2 logs parse-server-prod
pm2 logs parse-server-staging
```

**Apache:**
```bash
/var/log/apache2/elimu-smart-access.log
/var/log/apache2/elimu-smart-error.log
/var/log/apache2/staging-elimu-smart-access.log
/var/log/apache2/staging-elimu-smart-error.log
```

**PostgreSQL:**
```bash
/var/log/postgresql/postgresql-17-main.log
```

### Health Checks

**Production:**
```bash
curl https://elimu-smart.co.ke/health
curl https://elimu-smart.co.ke/parse/health
```

**Staging:**
```bash
curl https://staging.elimu-smart.co.ke/health
curl https://staging.elimu-smart.co.ke/parse/health
```

### Performance Metrics

**Expected Response Times:**
- Static files: < 200ms
- Parse API health: < 100ms
- Cloud Functions: < 500ms
- Database queries: < 50ms

**Resource Usage:**
- Parse Server: ~120MB RAM per instance
- PostgreSQL: ~200MB RAM
- Apache: ~50MB RAM
- Total: < 1GB RAM used

## Backup Strategy

### Automated Backups

**Schedule:** Daily at 2:00 AM
**Script:** `/home/ubuntu/elimu_smart/backend/scripts/backup-database.sh`
**Storage:** `/home/ubuntu/elimu_smart_backups/`
**Retention:** 30 days
**Format:** Gzipped SQL dumps

**What's Backed Up:**
- Production database (elimu_smart_production)
- Staging database (elimu_smart_staging)

**Restore Command:**
```bash
gunzip < ~/elimu_smart_backups/prod_2025-10-06_02-00.sql.gz | \
  PGPASSWORD="$DB_PASSWORD" psql -U postgres -h localhost -d elimu_smart_production
```

## Deployment Workflow

### Frontend Deployment

```bash
# Local machine
cd frontend
npm run build -- --mode production
git add dist/
git commit -m "Build: Production frontend"
git push origin main

# VPS
ssh ubuntu@3.91.52.5
cd /home/ubuntu/elimu_smart
git pull origin main
sudo cp -r frontend/dist/* /var/www/elimu-smart/
```

### Backend Deployment

```bash
# Local machine
cd backend
# Make changes to cloud functions or server
git commit -am "Backend: Your changes"
git push origin main

# VPS
ssh ubuntu@3.91.52.5
cd /home/ubuntu/elimu_smart
git pull origin main
pm2 restart parse-server-prod
pm2 logs parse-server-prod --lines 50
```

### Database Migration

```bash
# VPS
ssh ubuntu@3.91.52.5
cd /home/ubuntu/elimu_smart
git pull origin main

# Run migration
PGPASSWORD="$DB_PASSWORD" psql -U postgres -h localhost \
  -d elimu_smart_production \
  -f backend/migrations/your-migration.sql
```

## Scaling Considerations

### Horizontal Scaling (Future)

**Current:** Single VPS (3.91.52.5)

**Future Options:**
1. Add more Parse Server instances via PM2 cluster mode
2. Load balancer in front of multiple VPS instances
3. Separate database server
4. Redis for distributed sessions
5. CDN for static assets

### Vertical Scaling (Current)

- PM2 cluster mode (2 instances)
- PostgreSQL connection pooling
- Redis caching (optional)
- Apache KeepAlive enabled

## Disaster Recovery

### RTO/RPO

**Recovery Time Objective (RTO):** < 1 hour
**Recovery Point Objective (RPO):** < 24 hours (daily backups)

### Recovery Steps

1. **Restore Database:**
   ```bash
   gunzip < backup.sql.gz | psql -U postgres -d elimu_smart_production
   ```

2. **Restart Services:**
   ```bash
   pm2 restart all
   systemctl restart apache2
   ```

3. **Verify:**
   ```bash
   curl https://elimu-smart.co.ke/parse/health
   ```

### Rollback Procedure

```bash
# On VPS
cd /home/ubuntu/elimu_smart
git log -5  # Find previous working commit
git checkout <commit-hash>
pm2 restart all
sudo cp -r frontend/dist/* /var/www/elimu-smart/
```

---

**For detailed operational procedures, see:** `PRODUCTION_DEPLOYMENT.md`
