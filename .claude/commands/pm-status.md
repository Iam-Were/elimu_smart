Code-grounded product audit. Derives status from live grep — no hardcoded numbers.

When invoked, perform this audit in order:

## Step 1: Backend function count
```bash
grep -r "Cloud.define" backend/cloud/ | wc -l
```

## Step 2: Frontend Cloud.run calls
```bash
# List all unique function names called from frontend
grep -r "Cloud.run" frontend/src/ | grep -o "'[^']*'" | sort -u
```

## Step 3: Extract routes from App.tsx
Read `frontend/src/App.tsx` and list every `<Route path=...` with its component.

## Step 4: Per-route health check
For each route component file, grep for signals of incompleteness:
```bash
grep -rn "TODO\|\/\/ mock\|hardcoded\|placeholder\|coming soon\|<></>" frontend/src/pages/
```

## Step 5: Routes with no backend integration
Cross-reference the component files for each route against the list of `Cloud.run` calls. Flag routes where the component file has zero `Cloud.run` usage.

## Step 6: VPS health (if MCP available)
Use `mcp__elimu-vps__vps_health` and `mcp__elimu-vps__vps_pm2` to check production status.
If MCP not available, note: "Run manually: ssh elimu-aws 'pm2 status'" (AWS EC2 3.91.52.5; old TrueHosts 145.239.42.121 is DOWN)

## Output format
```
## PM Status — [date]

### Backend
- Cloud functions defined: N
- Frontend Cloud.run calls: M unique names
- Unmatched frontend calls (potential bugs): list any

### Routes
| Route | Component | Backend calls | Status |
|-------|-----------|---------------|--------|
| /dashboard | StudentDashboard | N calls | ✅ complete |
| /assessment | ... | 0 calls | ⚠️ static |
| /some-route | SomeComponent | TODO found | ❌ stub |

### Issues Found
- List any TODOs, mocks, or stubs discovered

### Production
- VPS health: ✅/❌
- PM2 status: running/down
```

Status legend:
- ✅ complete — has backend calls, no TODOs/mocks
- ⚠️ partial — works but has hardcoded data or missing integrations
- ❌ stub — TODO/placeholder/empty render found
