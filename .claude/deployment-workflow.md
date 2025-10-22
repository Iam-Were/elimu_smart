# 🚀 ELIMU SMART DEPLOYMENT WORKFLOW

## Development Environment: Windows (Local)
**Purpose**: Code writing + linting ONLY

### Local Workflow:
```bash
# Write code in VSCode (Windows)
# Lint before commit
cd frontend
npm run lint
npm run lint --fix  # Auto-fix issues

# NO building locally - save system resources
# NO running dev server - not needed for code writing
```

---

## CI/CD Pipeline: GitHub Actions (Linux)
**Purpose**: Build + test on every push

### Automated Checks:
1. **Auto-Fix Lint Errors** (runs first, auto-commits fixes)
2. **Lint & Build Check** (TypeScript + ESLint validation)
3. **Node.js CI** (production build test on Node 20.x)
4. **Deploy to Staging** (automatic if build passes)

**GitHub Actions Config**: `.github/workflows/` (already configured ✅)

---

## Production Deployment: VPS (Linux)
**Server**: root@145.239.42.121 (TrueHosts)

### Deployment Process:

#### **OPTION 1: GitHub Actions Auto-Deploy** (Recommended)
```bash
# Local: Write code + lint
npm run lint --fix
git add .
git commit -m "feat: implement dashboard redesign"
git push origin main

# GitHub Actions automatically:
# 1. Runs linters
# 2. Builds frontend (npm run build)
# 3. If successful → Auto-deploys to VPS
# 4. If failed → Email notification, fix locally and push again
```

#### **OPTION 2: Manual SSH Deploy** (If Actions fail)
```bash
# SSH into VPS
ssh root@145.239.42.121

# Pull latest code
cd /root/elimu_smart
git pull origin main

# If merge conflicts:
git stash
git pull origin main
git stash pop
# Resolve conflicts, then:
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main

# Build frontend on VPS
cd frontend
npm install
npm run build

# Deploy
sudo cp -r dist/* /var/www/elimu-smart/

# Restart backend if needed
cd ../backend
pm2 restart parse-server-prod

# Verify deployment
curl https://elimu-smart.co.ke/parse/health
```

---

## Task Implementation Strategy

### **Local Development (Windows)**:
```bash
# 1. Pull latest
git pull origin main

# 2. Create feature branch (optional)
git checkout -b feature/dashboard-redesign

# 3. Write code in VSCode
# - Edit components
# - Add new files
# - Use TypeScript LSP for instant feedback

# 4. Lint (catches errors before commit)
npm run lint
npm run lint --fix

# 5. Commit + push
git add .
git commit -m "feat(dashboard): add ActivityTimeline component

- Created ActivityTimeline with shadcn ScrollArea
- Shows last 10 user activities
- Real-time updates from Parse backend"

git push origin main
# (or: git push origin feature/dashboard-redesign)

# 6. Watch GitHub Actions
gh run list
gh run watch  # Monitor build in real-time

# 7. If build fails:
# - Check GitHub Actions logs
# - Fix errors locally
# - Push again (no need to SSH into VPS)

# 8. If build succeeds:
# - Automatic deployment to staging
# - Test on https://staging.elimu-smart.co.ke
# - If staging OK, promote to production (manual step or auto)
```

---

## Error Handling Workflow

### **Scenario 1: Build Fails on GitHub Actions**
```bash
# GitHub Actions log shows TypeScript error:
# "Module '@/components/ui/card' has no exported member 'Card'"

# LOCAL FIX:
# 1. Open file causing error
# 2. Fix TypeScript issue
# 3. Lint again
npm run lint

# 4. Push fix
git add .
git commit -m "fix: correct Card import in AdminDashboard"
git push origin main

# GitHub Actions will automatically rebuild
# NO need to SSH into VPS
```

### **Scenario 2: Build Succeeds but Runtime Error**
```bash
# Staging shows console error in browser

# LOCAL FIX:
# 1. Fix the runtime issue in code
# 2. Lint
npm run lint --fix

# 3. Push
git commit -am "fix: resolve runtime error in dashboard tabs"
git push origin main

# Auto-deploys to staging again
```

### **Scenario 3: Hotfix Needed on Production**
```bash
# Critical bug on production, need immediate fix

# LOCAL:
git checkout -b hotfix/critical-bug
# Make fix
npm run lint --fix
git commit -am "hotfix: fix payment processing error"
git push origin hotfix/critical-bug

# If GitHub Actions takes too long:
# SSH into VPS and deploy directly:
ssh root@145.239.42.121
cd /root/elimu_smart
git fetch origin
git checkout hotfix/critical-bug
git pull
cd frontend && npm run build
sudo cp -r dist/* /var/www/elimu-smart/
pm2 restart parse-server-prod
```

---

## Pre-Flight Fix: Card Component Exports

**Issue Found**: `card.ts` tries to export from `./Card` (capital C) but file is `card.tsx` (lowercase)

**Fix on VPS** (before starting Phase 1):
```bash
ssh root@145.239.42.121
cd /root/elimu_smart/frontend/src/components/ui

# Fix card.ts export
echo "// Re-export from card.tsx for case-insensitive imports
export * from './card';" > card.ts

# Test build
cd /root/elimu_smart/frontend
npm run build

# If successful, commit fix
cd /root/elimu_smart
git add frontend/src/components/ui/card.ts
git commit -m "fix: correct card.tsx import path (Linux case-sensitive)"
git push origin main
```

**After VPS Fix**: Windows local will pull this fix, and all future development will work correctly.

---

## Monitoring Deployment Status

### **GitHub Actions** (Primary):
```bash
# List recent workflow runs
gh run list

# Watch specific run
gh run watch

# View logs
gh run view --log
```

### **VPS Health Checks**:
```bash
# After deployment, verify:
curl https://elimu-smart.co.ke/parse/health
# Expected: {"status":"ok"}

# Check PM2 processes
ssh root@145.239.42.121 "pm2 status"

# View logs
ssh root@145.239.42.121 "pm2 logs parse-server-prod --lines 50"
```

### **Browser Testing**:
- **Staging**: https://staging.elimu-smart.co.ke
- **Production**: https://elimu-smart.co.ke

**Test checklist** (after each deployment):
1. Open browser DevTools Console
2. Login with test account
3. Navigate to changed pages
4. Verify no console errors
5. Test on mobile viewport (375px)
6. Test on desktop (1440px)

---

## Task Tracker Integration

### **Update tracker after each push**:
```bash
# Local (Windows):
# Edit .claude/ui-improvement-tracker.json
# Change task status: "pending" → "completed"
# Increment progressTracking counters

git add .claude/ui-improvement-tracker.json
git commit -m "chore: update task tracker (Task 1.1 completed)"
git push origin main
```

### **Delete tracker when project complete**:
```bash
# After Phase 3 completion:
rm .claude/ui-improvement-tracker.json
git commit -m "chore: remove completed task tracker"
git push origin main
```

---

## Summary: Windows → GitHub → VPS Flow

```
┌─────────────────┐
│ Windows (Local) │
│ - Write code    │
│ - Lint only     │
│ - Git push      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ - Auto lint fix │
│ - Build (Linux) │
│ - Run tests     │
└────────┬────────┘
         │
         ├─ Build Success ───┐
         │                   ▼
         │          ┌─────────────────┐
         │          │ Auto-Deploy     │
         │          │ Staging         │
         │          └─────────────────┘
         │
         └─ Build Failed ────┐
                             ▼
                    ┌─────────────────┐
                    │ Email Alert     │
                    │ Fix locally     │
                    │ Push again      │
                    └─────────────────┘
```

**Key Principle**:
- ✅ **Windows**: Code + lint
- ✅ **GitHub**: Build + test (Linux environment)
- ✅ **VPS**: Production runtime (Linux)

**NO local building on Windows** - Let GitHub Actions handle it in proper Linux environment.

---

## Ready to Start?

**Next Steps**:
1. Fix card.ts import on VPS (5 minutes)
2. Verify build passes on GitHub Actions
3. Start Phase 1, Task 1.1: Remove static cards from dashboard
4. Push → GitHub builds → Auto-deploy to staging
5. Test on staging.elimu-smart.co.ke
6. Repeat for each task

**Command to start implementation**:
```bash
git pull origin main  # Get latest code
# Start coding Task 1.1...
```
