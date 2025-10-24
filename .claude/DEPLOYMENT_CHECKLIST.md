# Deployment Checklist - Prevent Common Issues

## Pre-Deployment Checks (LOCAL)

### 1. Git Status Check
```bash
cd elimu_smart
git status
```

**✅ MUST CHECK**:
- [ ] No uncommitted changes that affect functionality
- [ ] All dashboard hooks (useDynamicCards.ts, useDynamicDashboard.ts) committed
- [ ] All UI components (Button.tsx, navigation, layouts) committed
- [ ] Test the site locally to confirm features work

**❌ NEVER DEPLOY** if:
- You see modified files that add/remove features
- Dashboard shows fewer cards than expected
- Navigation or UI components are incomplete

### 2. Build Test
```bash
cd frontend
npm run build  # MUST pass with 0 errors
npm run lint   # MUST pass with 0 errors (warnings OK for utility files)
```

**Common Build Issues**:
- **button.ts/.tsx conflicts**: Check that `button.ts` exports default from `Button.tsx`
- **Unused imports**: Remove unused CardDescription, cn, etc.
- **TypeScript errors**: Fix before deploying

### 3. File Naming Conventions
```bash
# Check for case-sensitive duplicates
find frontend/src -iname "button.*" -type f
```

**✅ CORRECT STRUCTURE**:
- `frontend/src/components/ui/Button.tsx` (uppercase B) - Main component
- `frontend/src/components/ui/button.ts` (lowercase b) - Alias file that exports default from Button.tsx

**❌ NEVER HAVE**:
- Both `button.tsx` and `Button.tsx` (case conflict on Linux/VPS)
- Missing `button.ts` alias (breaks imports that use lowercase)

### 4. Dashboard Card Count Verification
```bash
# Check how many cards are returned
grep -n "cards.push" frontend/src/hooks/useDynamicCards.ts | wc -l
```

**Expected**: 4+ cards (Career Readiness, University, Scholarships, Assessment Results)

**If count is low**:
- Check uncommitted changes: `git diff frontend/src/hooks/useDynamicCards.ts`
- Commit missing card logic before deploying

---

## Deployment Workflow

### Step 1: Commit All Changes
```bash
git add .
git status  # Verify all changes staged
git commit -m "descriptive message"
git push origin main
```

### Step 2: VPS Pull & Build
```bash
ssh root@145.239.42.121
cd /root/elimu_smart
git pull origin main

# Check for conflicts
git status  # Should show "Your branch is up to date"

# Build frontend
cd frontend
npm run build -- --mode production  # MUST succeed

# If build fails, check:
# 1. button.ts/Button.tsx exists and configured correctly
# 2. No TypeScript errors
# 3. All imports resolved
```

### Step 3: Deploy Frontend
```bash
cd /root/elimu_smart/frontend
sudo cp -r dist/* /var/www/elimu-smart/

# Verify deployment
curl -I https://elimu-smart.co.ke  # Should return HTTP/2 200
```

### Step 4: Post-Deployment Verification
```bash
# Check site loads
curl https://elimu-smart.co.ke | head -20

# Test key pages
curl https://elimu-smart.co.ke/dashboard
curl https://elimu-smart.co.ke/assessment
```

**Browser Testing** (REQUIRED):
- [ ] Dashboard shows 4+ cards with live data
- [ ] Navigation works (mobile + desktop)
- [ ] Footer shows correct links
- [ ] Inbox UI loads without errors
- [ ] Profile dropdown has all links (Billing, Help, Settings)

---

## Common Issues & Solutions

### Issue 1: Button.ts/.tsx Conflicts

**Symptom**: Build fails with "Circular definition" or "no default export"

**Root Cause**:
- VPS has both `button.tsx` (lowercase) and `Button.tsx` (uppercase)
- Linux filesystems are case-sensitive (Windows is not)

**Solution**:
```bash
ssh root@145.239.42.121
cd /root/elimu_smart/frontend/src/components/ui

# Remove duplicate lowercase file
rm button.tsx

# Ensure button.ts exports correctly
cat > button.ts << 'EOF'
// Alias for Button.tsx - maintains backward compatibility
export { default } from './Button.tsx';
export * from './Button.tsx';
EOF

# Rebuild
cd /root/elimu_smart/frontend && npm run build -- --mode production
```

**Prevention**:
- Always use `Button.tsx` (uppercase) as the main component file
- Keep `button.ts` (lowercase) as alias for backward compatibility
- Never create `button.tsx` (lowercase) - it conflicts with `Button.tsx`

### Issue 2: Dashboard Shows Only 2 Cards

**Symptom**: Dashboard displays fewer cards than locally

**Root Cause**: Uncommitted changes in `useDynamicCards.ts` or `useDynamicDashboard.ts`

**Solution**:
```bash
# Check for uncommitted dashboard changes
git status frontend/src/hooks/

# If changes exist, commit them
git add frontend/src/hooks/useDynamicCards.ts frontend/src/hooks/useDynamicDashboard.ts
git commit -m "fix(dashboard): restore missing cards"
git push origin main

# Redeploy on VPS
ssh root@145.239.42.121
cd /root/elimu_smart && git pull origin main
cd frontend && npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/
```

**Prevention**:
- Run `git status` before every deployment
- Test dashboard locally before pushing
- Count cards in useDynamicCards.ts (should have 4+ `cards.push()` calls)

### Issue 3: TypeScript Unused Import Errors

**Symptom**: Build fails with "TS6133: 'X' is declared but its value is never read"

**Solution**:
```bash
# Remove unused imports on VPS
ssh root@145.239.42.121
cd /root/elimu_smart/frontend/src/pages

# Example: Fix AssessmentResultsPage
sed -i 's/, CardDescription//' AssessmentResultsPage.tsx
sed -i '/^import.*{ cn }.*$/d' AssessmentResultsPage.tsx
```

**Prevention**:
- Run linter before committing: `npm run lint --fix`
- Fix all errors locally before pushing

---

## File Structure Reference

### Critical Files That MUST Be Committed

**Dashboard Logic**:
- `frontend/src/hooks/useDynamicCards.ts` (card generation)
- `frontend/src/hooks/useDynamicDashboard.ts` (data fetching)

**UI Components**:
- `frontend/src/components/ui/Button.tsx` (main component)
- `frontend/src/components/ui/button.ts` (alias for imports)
- `frontend/src/components/layouts/ModernFooter.tsx`
- `frontend/src/components/layouts/PreFooterCTA.tsx`
- `frontend/src/components/common/ProfileDropdown.tsx`

**Pages**:
- `frontend/src/pages/InboxPage.tsx`
- `frontend/src/pages/Sprint18DashboardPage.tsx`

### Files That Can Be Ignored
- `.claude/settings.local.json` (local settings)
- `*.backup.tsx` (backup files)
- `*.old.tsx` (old versions)
- `backend/logs/*` (log files)

---

## Quick Reference Commands

**Pre-Deployment**:
```bash
git status  # Check for uncommitted changes
npm run build && npm run lint  # Verify build passes
git add . && git commit -m "message" && git push origin main
```

**VPS Deployment**:
```bash
ssh root@145.239.42.121 "cd /root/elimu_smart && git pull origin main && cd frontend && npm run build -- --mode production && sudo cp -r dist/* /var/www/elimu-smart/"
```

**Verify**:
```bash
curl -I https://elimu-smart.co.ke  # Check site loads
```

---

## Prevention Checklist Summary

✅ **Before Every Deployment**:
1. Run `git status` - commit ALL working changes
2. Test locally - verify dashboard cards, navigation, features
3. Run `npm run build` - must pass with 0 errors
4. Check Button.tsx exists (not button.tsx)
5. Verify useDynamicCards.ts has 4+ cards

✅ **After Every Deployment**:
1. Test dashboard shows correct card count
2. Test navigation (mobile + desktop)
3. Check footer links work
4. Verify profile dropdown completeness

❌ **NEVER**:
1. Deploy with uncommitted dashboard changes
2. Create both button.tsx and Button.tsx
3. Skip build test before deployment
4. Deploy without testing dashboard locally

---

**Last Updated**: 2025-10-24
**Version**: 1.0
