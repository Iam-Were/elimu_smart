# VPS Deployment Guide - Elimu Smart

## Prerequisites
- VPS SSH access: `ssh root@145.239.42.121`
- GitHub access configured on VPS
- PM2, Node.js, PostgreSQL, Nginx already installed

## Step 1: Pull Latest Code

```bash
cd /root/elimu_smart
git pull origin main
```

## Step 2: Install Dependencies

```bash
# Backend dependencies
cd /root/elimu_smart/backend
npm install

# Frontend dependencies  
cd /root/elimu_smart/frontend
npm install
```

## Step 3: Run Database Migrations

```bash
cd /root/elimu_smart/backend

# 1. User custom fields (SQL migration)
psql -U elimu -d elimu_smart_production -f migrations/add-user-custom-fields.sql

# 2. Assessment schema (Parse schema)
node migrations/schema-assessments.js

# 3. UserPreferences schema (NEW - Parse schema)
node migrations/create-user-preferences-schema.js

# 4. Seed assessment data
node migrations/seed-assessments.js
```

## Step 4: Build Frontend

```bash
cd /root/elimu_smart/frontend

# Build for production
npm run build -- --mode production

# Deploy to Nginx
sudo cp -r dist/* /var/www/elimu-smart/
```

## Step 5: Restart Backend Services

```bash
cd /root/elimu_smart/backend

# Restart production Parse Server (2 instances)
pm2 restart parse-server-prod

# View logs
pm2 logs parse-server-prod --lines 50
```

## Step 6: Verify Deployment

```bash
# Check Parse Server health
curl https://elimu-smart.co.ke/parse/health

# Check frontend
curl -I https://elimu-smart.co.ke

# Check PM2 processes
pm2 status

# Monitor logs
pm2 monit
```

## Step 7: Test New Features

1. **UserPreferences Migration**:
   - Login as student@elimu.com
   - Change theme (should save to Parse backend)
   - Logout/login (theme should persist)

2. **RIASEC Assessment**:
   - Complete RIASEC assessment
   - Verify scoring happens on backend (check logs)

3. **Performance**:
   - Check Network tab (should see lazy-loaded chunks)
   - Verify vendor chunks are cached

## Rollback (If Issues)

```bash
# Rollback to previous commit
cd /root/elimu_smart
git log --oneline -10  # Find previous stable commit
git reset --hard <commit-hash>

# Rebuild frontend
cd frontend && npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/

# Restart backend
cd ../backend && pm2 restart parse-server-prod
```

## Security Notes

⚠️ **Known Vulnerabilities** (non-critical):
- Parse SDK 6.1.1: Moderate prototype pollution (latest version)
- Backend dependencies: 15 issues (mostly in parse-dashboard)
- Action: Monitor, update when patches available

## Recent Changes Deployed

1. ✅ LocalStorage → Parse Objects migration (user preferences)
2. ✅ Staging login environment fix
3. ✅ RIASEC scoring Cloud Functions
4. ✅ Parse SDK dynamic imports (code-splitting)
5. ✅ Route-based lazy loading (50% bundle reduction)

## Post-Deployment Checklist

- [ ] All PM2 processes running
- [ ] Parse Server responding (health check)
- [ ] Frontend loading correctly
- [ ] Student login works
- [ ] Counselor login works  
- [ ] Admin login works
- [ ] Theme persistence works
- [ ] RIASEC assessment works
- [ ] No console errors in browser DevTools

---
**Last Updated**: 2025-10-06
**Deployed By**: Antony Were
