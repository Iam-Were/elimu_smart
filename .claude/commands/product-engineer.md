# Product Engineer — Full Session Context

When this command is invoked, execute the following steps in order.

## Step 1: Load Context Files

Read all three context files before doing anything else:
- `.claude/product-context/ux-issues.md` — master issue list (18 issues)
- `.claude/product-context/user-journeys.md` — journey reference
- `.claude/product-context/regression-watch.md` — recurring break points

## Step 2: Verify Issue Status via Grep

For each issue in `ux-issues.md` that has a `verify_grep`, run it against `frontend/src/`:
- Match found → ✅ Done
- No match → ❌ Pending
- Partial / ambiguous match → ⚠️ Partial

Update the status column in your output accordingly. Do NOT rely on the `Status:` field in the file — always re-verify via grep.

## Step 3: Output Current State Table

```
| ID      | Issue                                        | Journey            | Priority | Status     |
|---------|----------------------------------------------|--------------------|----------|------------|
| UX-001  | Placeholder cover photo visible              | Student › Profile  | P0       | ❌ Pending |
...
```

Sort by Priority (P0 → P3), then by status (Pending first).

## Step 4: Recommend Next 3 Fixes

Pick the 3 highest-priority pending issues. For each:
- **File**: exact path + line number if known
- **Change**: exact Tailwind class / code pattern to apply
- **Why now**: which user journey it unblocks and why it matters

Do NOT recommend issues that are already ✅ Done.

## Step 5: Regression Check

Run all greps from `regression-watch.md`:

**WATCH-01** — `grep -r "ProfileDropdown" frontend/src/`
- 0 results → ✅ Clean
- Any results → 🔴 REGRESSION — re-extraction happened, delete the file immediately

**WATCH-02** — `grep -rn "localStorage.*theme\|theme.*localStorage" frontend/src/`
- Verify single consistent key (`elimu-theme`)
- Also confirm `public/reset-theme.js` exists and uses the same key
- Multiple different keys → 🔴 REGRESSION

**WATCH-03** — `grep -rn "enableForPublic\|enableForAnonymousUser" backend/`
- Present → ✅ Clean
- Missing → 🟡 WARNING — CORS may be broken after deploy

Show a regression summary block:
```
REGRESSION WATCH
WATCH-01 ProfileDropdown:     ✅ Clean
WATCH-02 Dark mode key:       ✅ Clean
WATCH-03 CORS config:         ✅ Clean
```

## Step 6: Show Journey Impact Summary

For the top 3 recommended fixes, show the exact leg of the user journey that is broken:

```
UX-003 breaks: Student › Login → Dashboard (every page after login has content hidden under nav)
```

---

## User Journeys (Embedded Reference)

### Student (Primary — orange #f97316, mobile-first, KCSE/KUCCPS context)
```
/ (landing)
  └── /login
        └── /onboarding (new users only — 3 steps: academics, grades, career interests)
              └── /dashboard
                    ├── Hero: Career Readiness Score (ring) + KUCCPS deadline countdown
                    ├── Urgent Actions (deadline alerts, pending assessments)
                    ├── Quick Wins (next recommended step)
                    └── Mini KPIs (sessions booked, scholarships matched, activity streak)
                          ├── /assessment — 5 cards:
                          │     RIASEC (60q) · Skills (36q) · University Finder
                          │     Career Explorer · Subject-Career Mapper
                          ├── /guidance — 5 cards (freemium):
                          │     FREE: Community Q&A · Career Resources · Crisis Resources
                          │     PREMIUM 🔒: Message Counselor (/inbox) · Book Session
                          └── /profile — 5 tabs:
                                Overview · Assessments · Achievements · Goals · Settings
```
**Critical moments**: First login, RIASEC completion, first counselor session booked.

### Counselor (Professional — yellow #eab308, desktop-first, income focus)
```
/login → /counselor/dashboard (tabs):
  Overview (revenue KPIs, active students, pending actions)
  Students (/counselor/students + /counselor/discover-students)
  Questions (/counselor/questions — Q&A reputation building)
  Sessions (/counselor/sessions — bookings, earnings)
  Analytics (/counselor/analytics — performance, retention)
  Profile (/counselor/profile — credentials, availability, reviews)
```
**Critical moments**: First premium student assigned, Q&A answer published, session completed.

### Admin (Internal — purple, desktop, RBAC)
```
/login → /admin (RBAC-gated):
  /admin/users (Platform + Operations)  · /admin/content (Operations)
  /admin/analytics (Platform)           · /admin/moderation (Safety)
  /admin/audit (Safety)                 · /admin/security (Platform)
  /admin/schools (Operations)
```
Roles: Platform Admin (`mike.platform`) · Operations (`linda.operations`) · Safety (`peter.safety`)

---

## Design System (CRITICAL — apply to every fix)

### Colour Tokens
| Role | Tailwind | Hex |
|------|----------|-----|
| Student primary | `orange-500/600` | #f97316 |
| Counselor primary | `yellow-500` | #eab308 |
| Admin primary | `purple-600` | — |
| Success | `green-500` | — |
| Warning | `amber-500` | — |
| Destructive | `red-500` | — |
| Card accent bg | `from-orange-50 to-amber-50` | warm gradient |

### Typography Scale
- Display headings: **Plus Jakarta Sans** (Google Font — add if not present in `index.html`)
- Body: Inter / system-ui
- Hero numbers: `text-3xl font-bold` or `text-4xl font-black`
- Card titles: `text-lg font-semibold`
- Meta / labels: `text-sm text-muted-foreground`
- Mobile context always check: `text-sm sm:text-base`

### Component Rules (shadcn ONLY — no Mantine for new dev)
- All imports lowercase: `@/components/ui/button` not `Button`
- Cards: max 6 elements, gradient icon containers (`bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2`)
- Navigation: `useNavigate()` + `<Button onClick={() => navigate(path)}>` — NEVER `<Button asChild><Link>`
- Forms: non-blocking pattern — update UI first, then try backend, never block on API

### Card Micro-interactions (REQUIRED on all clickable cards)
```css
hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
```
Buttons: `active:scale-95`

### Mobile-first Rules
- Bottom nav height: 64px → always add `pb-20` to main content in Sprint18Layout
- Outer padding mobile: `px-3` (not `px-4` or `px-6`)
- Tab lists: `overflow-x-auto` + `whitespace-nowrap` on each trigger
- Filter pills: `overflow-x-auto flex flex-nowrap` + right-edge fade hint
- KPI grids: `grid-cols-3 gap-2` with `text-base font-bold` (not `text-lg`) at 390px

### Empty State Pattern
Icon (48px muted) + Headline (warm student voice) + CTA button. Never "No data available".
Example: "You haven't booked a session yet — your counselor is ready when you are."

### Timestamp Format
Always relative: `"2 days ago"` not `"2025-03-10"`. Use `formatRelativeTime()` util with `Intl.RelativeTimeFormat`.

### Freemium Visual Pattern
- Free cards: normal card style
- Premium cards: lock icon `🔒` + `"Premium"` badge (`bg-amber-100 text-amber-800`)
- Paywall trigger on click if not subscribed

---

## UI Library Rule (CRITICAL)
**shadcn ONLY. No Mantine for any new development.**
- shadcn `chart` ✅ installed at `frontend/src/components/ui/chart.tsx` — use `ChartContainer`, `ChartTooltip` wrappers. Don't import recharts directly in new files.
- shadcn `carousel` ✅ already installed
- All new components: shadcn patterns, lowercase imports (`@/components/ui/button`)
- To add a new shadcn component: `cd frontend && npx shadcn@latest add <name> --yes` then move from `frontend/@/components/ui/` to `frontend/src/components/ui/` (Windows path bug)

---

## Output Format

Keep total output under 60 lines. Use the table + numbered fix list + regression block.
No preamble. Start directly with the status table.
