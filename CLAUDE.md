# Claude Code Development Guide - Elimu Smart

> **🚨 CRITICAL: READ FIRST 🚨**
> Read this file top-to-bottom before starting any session. It is the single source of truth for project state.

## Claude Code Workflow Rules

**CRITICAL**: Skip plan mode and proceed directly with fixes to save time. Only use plan mode if explicitly requested by user.

## Project Overview

Elimu Smart is an AI-ready career guidance platform for Kenyan students built with React 19, TypeScript, Vite, and shadcn UI.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **UI**: shadcn UI (migrated from Mantine), TailwindCSS 4.x
- **Backend**: Parse Server + PostgreSQL (3,700+ lines of cloud functions)
- **Database**: PostgreSQL 17.6 (`postgres://postgres:password@localhost:5432/elimu_smart_dev`)
- **Routing**: React Router DOM v7
- **State**: React Context API with hooks

### Development Commands
```bash
cd frontend
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript compilation + production build (REQUIRED before commits)
npm run lint     # ESLint code quality checks (REQUIRED before commits)
npm run lint --fix  # Auto-fix linting issues

cd backend
node server-working.js  # Parse Server (http://localhost:1337)
```

### Production Demo Accounts (https://elimu-smart.co.ke)

**Quick Access:**
- Student: `student@elimu.com` / `student`
- Counselor: `counselor@elimu.com` / `counselor`
- Admin: `admin@elimu.com` / `admin`

**Professional Accounts:**
- Sarah Njeri (Counselor): `sarah.counselor@elimu.com` / `counselor2024`
- James Mutua (Career Coach): `james.coach@elimu.com` / `coach2024`
- Mike Kamau (Platform Admin): `mike.platform@elimu.com` / `platform2024`
- Linda Wambui (Operations Admin): `linda.operations@elimu.com` / `operations2024`
- Peter Otieno (Safety Manager): `peter.safety@elimu.com` / `safety2024`

## Testing Credentials & Development Rules

**CRITICAL RULE: Always use these credentials when testing or developing**

### Quick Test Accounts (Development Only)
```bash
# Student (Default for testing)
Email: student@elimu.com
Password: student

# Counselor
Email: counselor@elimu.com
Password: counselor

# Platform Admin
Email: mike.platform@elimu.com
Password: platform2024

# Operations Admin
Email: linda.operations@elimu.com
Password: operations2024

# Safety Manager
Email: peter.safety@elimu.com
Password: safety2024
```

### Testing Protocol Rules
1. **Default test account**: Use `student@elimu.com` / `student` unless testing specific role
2. **Role-specific testing**: Switch to appropriate admin/counselor account as needed
3. **Never commit real credentials**: These are demo accounts only
4. **Login shortcuts**: When Claude tests features, always login with student account first
5. **Production testing**: Use VPS test script: `ssh root@145.239.42.121 'cd /root/elimu_smart/backend && node scripts/test-login.js production'`
6. **MCP Browser Testing**: When using Chrome DevTools MCP, navigate to https://elimu-smart.co.ke/login and use student credentials

### Why This Rule Exists
- **Context Efficiency**: Eliminates need to ask "what credentials should I use?"
- **Consistency**: All testing uses same accounts, reproducible bugs
- **Security**: Demo credentials not visible on public login page
- **UX**: Professional login page without clutter

**Login Testing:**
```bash
# On VPS
cd /root/elimu_smart/backend
node scripts/test-login.js production
# Expected: ✅ All 3 logins successful (student/counselor/admin)
```

## Architecture & User Journeys

### User Roles & Themes
- **Students**: Orange theme (#f97316) - Primary user journey, Kenya-specific educational context
- **Counselors**: Yellow theme (#eab308) - Professional guidance tools, not subscription users
- **Admins**: Purple theme - 3 RBAC roles (Platform, Operations, Provider Safety)

### Route Structure
```typescript
// Student Routes (Sprint18Layout - shadcn) - 95% Complete
/dashboard → StudentDashboard (8 dynamic cards with real-time data)
/assessment → StudentAssessmentCards (6 assessments: RIASEC, Skills, University Finder, Career Explorer, Subject Mapper)
/guidance → StudentGuidanceCards (8 services: coaches, sessions, Q&A, resources, community, crisis, progress)
/profile → ProfilePage (account management)

// Counselor Routes (Sprint18Layout - shadcn) - 90% Complete
/counselor/dashboard → CounselorDashboardPage (unified tabbed: Overview, Students, Questions, Sessions, Analytics)

// Admin Routes (AppLayout - Mantine/shadcn hybrid) - 85% Complete
/admin/* → User management, analytics, content moderation, security, audit logs, system config

// Auth Routes
/, /login, /register, /forgot-password
```

### Component Library Status
- **Student Interface**: 100% shadcn ✅
- **Counselor Interface**: 100% shadcn ✅
- **Admin Interface**: Mantine/shadcn hybrid (functional, migration optional)
- **All New Development**: MUST use shadcn patterns

## Critical Development Standards

> **Full standards guide**: See `.claude/development-standards.md`

**Code Quality** (MANDATORY): `npm run build` + `npm run lint` — ZERO errors/warnings before any commit. Check browser DevTools console for runtime errors.

**Component Rules**: shadcn UI only, lowercase imports (`@/components/ui/button`), no `any` types, no Mantine for new dev, prefer editing files over creating new ones, no `Button asChild` + `Link` + `onClick` combination.

**UX Design**: Single-page > multi-step always. Provide immediate value before asking for input. Cards: max 6 elements, gradient icon containers. Full color mapping and icon patterns in `.claude/development-standards.md`.

### Navigation Pattern (REQUIRED)
```typescript
// ✅ CORRECT: Reliable button navigation
const navigate = useNavigate();

<Button onClick={() => {
  try {
    logActivity(data);
  } catch (error) {
    console.warn('Activity logging failed:', error);
  }
  navigate(path);
}}>
  {actionText}
</Button>

// ❌ NEVER: Causes event conflicts
<Button asChild>
  <Link to="..." onClick={handler}>
    {actionText}
  </Link>
</Button>
```

### Form Response Pattern (REQUIRED)
```typescript
// ✅ CORRECT: Non-blocking resilient pattern
const handleResponse = async (data: FormData) => {
  // 1. Update UI immediately (never block user)
  setUIState(newState);

  // 2. Log activity locally (non-blocking)
  try {
    logActivity(data);
  } catch {
    console.warn('Activity logging failed, continuing');
  }

  // 3. Try backend but don't block UI
  try {
    await apiCall(data);
  } catch (error) {
    console.warn('Backend failed, using local data:', error);
  }

  // 4. Always advance user flow
  continueUserFlow();
};

// ❌ NEVER: Blocking pattern that hangs UI
const handleResponse = async (data: FormData) => {
  await apiCall();  // If this fails or is slow, UI freezes
  updateUI();       // User stuck waiting
};
```

## Key Technical Patterns

### Type Safety (NEVER use `any`)
```typescript
// ✅ CORRECT: Comprehensive interfaces
interface AssessmentData {
  id: string;
  type: 'riasec' | 'skills' | 'university' | 'career' | 'subjects';
  responses: Record<string, number>;
  completedAt: Date;
}

// ✅ CORRECT: Use unknown with type guards
const data: unknown = await apiCall();
if (isValidAssessmentData(data)) {
  processAssessment(data); // Type-safe usage
}

// ❌ FORBIDDEN: Using any types
const data: any = await apiCall();  // WILL BE REJECTED
```

### Parse SDK Integration (Browser Compatibility)
```typescript
// ✅ REQUIRED: Dynamic import pattern (Vite/Browser compatible)
import { getParse } from '@/config/parse';

const fetchData = async () => {
  const Parse = await getParse();
  const result = await Parse.Cloud.run('functionName', { params });
  return result;
};

// ❌ NEVER: Direct imports fail in browser
import Parse from 'parse';  // WILL BREAK - Node.js only
```

### React Hooks Compliance
```typescript
// ✅ CORRECT: All dependencies listed
useEffect(() => {
  fetchData();
}, [dependency1, dependency2]);

const memoizedFn = useCallback(() => {
  doSomething();
}, [dependencies]);

// Fast Refresh: Separate utilities from components
// Use ESLint disable for utility-only files
```

### Error Handling Pattern
```typescript
// ✅ CORRECT: Graceful degradation
try {
  const data = await backendCall();
  processData(data);
} catch (error) {
  console.warn('Backend failed, using fallback:', error);
  processData(fallbackData);
}

// Anonymous catch when error details not needed
try {
  doSomething();
} catch {
  setError(true);
}
```

## Backend Implementation Patterns (Parse Server)

> **Full patterns with code examples**: See `.claude/backend-patterns.md`

**Key rules**:
- Never `require('parse/node')` in cloud modules — use global Parse (loaded AFTER initialization)
- Dev APP_ID: `elimu_smart_app_2024` | Production APP_ID: `elimu-smart-production` (DIFFERENT!)
- Schema creation: use Dummy Object pattern when Schema API returns "unauthorized"
- Chat: always verify user is participant BEFORE returning messages (2-layer: Cloud function + beforeFind hook)
- Check VPS credentials: `ssh root@145.239.42.121 'grep "^APP_ID=" /root/elimu_smart/backend/.env'`

## Kenya Educational Context Integration

### KCSE System (Kenya Certificate of Secondary Education)
- **Grade Levels**: Use Form 1-4 (NOT generic Grade 9-12)
- **Grading System**: A=12, A-=11, B+=10, B=9, B-=8, C+=7, C=6, C-=5, D+=4, D=3, D-=2, E=1
- **Subject Combinations**: Track which subjects required for specific careers
- **Cluster Points**: Calculate university eligibility from subject grades

### KUCCPS Integration (Kenya Universities and Colleges Central Placement Service)
- **University Codes**: UoN (University of Nairobi), JKUAT, Moi, Strathmore, etc.
- **Cutoff Points**: Dynamic calculation based on subject cluster points
- **Application Timeline**: KUCCPS deadline tracking with urgency indicators
- **Placement Probability**: Real-time updates based on grades and historical data

### Student-Centric Language (REQUIRED for all student-facing content)
**Address Real Student Concerns:**
- "What if I choose the wrong career?"
- "My parents want me to be a doctor/lawyer but I want something else"
- "I don't know what I enjoy doing"
- "What if I don't qualify for anything?"

**Communication Style:**
- Use authentic student voice (NOT corporate/professional speak)
- Acknowledge family expectations and economic realities
- Celebrate small wins and provide encouragement
- Be honest about process ("This takes 15 minutes" not "Quick assessment")

**Cultural Sensitivity:**
- Respect for parental guidance while supporting student autonomy
- Acknowledge financial constraints in career/university recommendations
- Include local success stories and role models
- Consider extended family influence in decision-making

## Implementation History (Key Milestones)

- **Sprint 18 (shadcn Migration)**: Complete UI migration → 100% shadcn for Student/Counselor, 30% faster builds
- **Sprint 22 (Assessment System)**: 5 complete assessments with backend APIs → RIASEC, Skills, University Finder, Career Explorer, Subject Mapper
- **Sprint 25 (Code Quality)**: Achieved 100% lint compliance → Zero `any` types, all TypeScript errors fixed, comprehensive type system
- **Sprint 26 (Navigation Fix)**: Critical pattern fixes → Button + navigate (no asChild conflicts), non-blocking API calls (UI first, backend secondary)
- **Sprint 29 (Dashboard UX)**: Hero KPI + Urgent Actions + Quick Wins → 3-second rule compliance, progressive disclosure, KUCCPS deadline integration
- **Dynamic Dashboard**: Real-time data integration → Career Readiness Score algorithm, live KUCCPS data, scholarship matching, activity analytics
- **Code Cleanup**: Consolidated experiences → Single student account, removed legacy flows, simplified demo environment

**Critical Learnings:**
- Never block UI with API calls in user interactions
- Type safety catches errors early, improves IDE performance
- Simplicity > Options in user experience design
- **Single-source navigation components**: NEVER create a standalone component (e.g. `ProfileDropdown.tsx`) alongside an inline duplicate in `Sprint18Navigation.tsx`. The inline one is what renders — standalone files become dead code that causes confusion and recurring fixes. The profile dropdown lives **only** in `Sprint18Navigation.tsx` (lines ~471–577). If you need to change it, edit there only. Delete any extracted duplicate immediately.

## Production Status

### Frontend: A+ (100% Production Ready) ✅
- Complete shadcn migration for student/counselor interfaces
- 100% lint compliance, zero TypeScript errors
- Professional UX with deep Kenya context integration
- WCAG 2.1 AA accessibility compliance
- Mobile-responsive design across all components
- All guidance pages implemented (Q&A, Resources, Crisis, Booking)

### Backend: Operational ✅
- Parse Server with 111 cloud functions (7,700+ lines)
- 5 complete assessment systems with scoring algorithms
- PostgreSQL database integration (password="password")
- Dynamic dashboard with real-time calculations
- User activity tracking and analytics
- External APIs: CareerJet, LinkedIn, M-Pesa, ZeptoMail

### Assessments Fully Implemented ✅
1. **RIASEC Career Assessment** - 60-question personality-based career matching
2. **Skills Assessment** - 36-question evaluation across 6 skill categories
3. **University Course Finder** - 4-step matching with Kenya universities + KUCCPS
4. **Career Exploration** - Searchable database with Kenya-specific career profiles
5. **Subject-Career Mapper** - KCSE subject combination to career/university matching

## Backend-Frontend Integration Status

**Actual count (grep-verified)**: 258 cloud functions in backend | 203 called from frontend

To find where a function is defined: `grep -r "Cloud.define('functionName'" backend/cloud/`
To find where it's called: `grep -r "'functionName'" frontend/src/`

## Development Workflow

**Troubleshooting**: Build errors → check shadcn import case (lowercase), missing routes, unused imports. Runtime errors → MantineProvider context, Parse SDK dynamic imports, navigation pattern.

### Workflow: Local → GitHub → VPS
1. **Local**: `npm run lint` (0 warnings required) → fix errors → commit
2. **Push**: `git add . && git commit -m "message" && git push origin main`
3. **Monitor**: `gh run list --limit 1` → `gh run watch <run-id>` — Actions auto-lint + build-check
4. **Deploy VPS**: Build locally, rsync dist — **NEVER run `npm run build` on VPS** (kills SSH, crashes server):
   ```bash
   cd frontend && npm run build -- --mode production
   rsync -avz --delete dist/ root@145.239.42.121:/var/www/elimu-smart/
   ssh root@145.239.42.121 'pm2 restart parse-server-prod'
   ```
5. **Verify**: `curl https://elimu-smart.co.ke/parse/health` + test key features in browser

**Full workflow details**: See `.claude/deployment-workflow.md`

## Mobile Development & Integration Roadmap

**Mobile Readiness**: `.claude/mobile-readiness.md` exists but was last updated 2025-10-08 — treat as a starting reference only, not ground truth.

**Integration Roadmap** (priority order):
1. SubjectCareerMapper migration to Parse Classes (2-3 days) — -25KB bundle
2. Chat/Messaging integration — 7 available functions (2 days)
3. Assessment Progress Tracking — 6 functions for cross-device resume (1-2 days)

## Student Guidance System (Freemium Architecture)

### **Communication Channels Strategy**

Elimu Smart uses a **3-channel freemium model** based on industry best practices from Kuder, PathwayU, and Scoir platforms:

#### **FREE TIER (Self-Service)**
1. **Community Q&A** (`/guidance/community-qa`) - Asynchronous knowledge base
   - Students submit questions (public/anonymous options)
   - Counselors answer when available (builds reputation)
   - Searchable archive (200+ answered questions)
   - Peer responses encouraged
   - Backend: `submitQuestion`, `answerQuestion` cloud functions

2. **Career Resources** (`/guidance/resources`) - Self-help library
   - Career guides, PDFs, videos
   - University comparison tools
   - KUCCPS timeline tracker
   - Scholarship database

3. **Crisis Resources** (`/guidance/crisis`) - Verified external hotlines
   - **NOT platform-provided support** (liability)
   - Links to Childline Kenya, NACADA, Befrienders Kenya
   - Free emergency resources

#### **PREMIUM TIER (Paid Services)**
4. **Premium Inbox** (`/inbox`) - Real-time 1-on-1 messaging
   - Private conversations with assigned counselor
   - Guaranteed 24-hour response time
   - Read receipts, online status
   - **Requires subscription** or pay-per-use
   - Backend: Existing `useChat` hook + Parse Cloud Functions

5. **Session Booking** (`/guidance/book-session`) - Scheduled counseling
   - 30/60/90 minute video/phone/in-person sessions
   - Pre-session questionnaire
   - Post-session notes + action items
   - **Pricing**: Included in Premium or pay-per-session (KES 1,500+)
   - Backend: `bookCounselorSession` cloud function

### **Card Implementation (Card-First Development)**

**StudentGuidanceCards** (5 cards):
- 3 Free cards: Community Q&A, Career Resources, Crisis Resources
- 2 Premium cards: Message Counselor 🔒, Book Session 🔒
- Premium cards show lock icon + "Premium" badge
- Clicking premium cards shows paywall if not subscribed

**CounselorDashboardCards** (5 cards):
- Premium Students (12 active, KES 45,000/month revenue)
- Premium Inbox (8 unread messages from paid students)
- Booked Sessions (6 today, KES 9,000 earnings)
- Community Q&A (15 pending, optional - builds reputation)
- Performance (4.8/5 rating, 92% retention)

### **Monetization Strategy**
- **Free Users**: Access assessments + community Q&A
- **Premium Users**: Direct counselor access + session booking
- **Counselor Incentive**: Q&A builds reputation → Drives premium conversions
- **Revenue Focus**: Counselor cards prioritize paid student metrics

### **Research-Based Design Principles**
- **Hybrid Approach**: Synchronous (inbox) + Asynchronous (Q&A) per 2025 best practices
- **Conversational > Broadcast**: Direct messaging preferred over mass emails (54% students ignore university emails)
- **Multi-Channel Access**: Students prefer online individual sessions with flexible scheduling
- **Industry Standard**: Follows Scoir (direct messaging + counselor chat), PathwayU (AI + staff guidance), Kuder (individual + group sessions)

---

## Quick Deployment Reference

**Full VPS setup, environments, PM2 config, SSL, monitoring, backups**: See `.claude/DEPLOYMENT_CHECKLIST.md` and `.claude/deployment-workflow.md`

**Quick Deploy to Production**:
```bash
cd /root/elimu_smart && git pull origin main
cd backend && npm install && pm2 restart parse-server-prod
cd ../frontend && npm install && npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/
curl https://elimu-smart.co.ke/parse/health
```

**Migrations** (if not already run):
```bash
cd /root/elimu_smart/backend
node migrations/create-user-preferences-schema.js
node migrations/schema-assessments.js
node migrations/seed-assessments.js
```

---

**Last Updated**: 2025-10-06
**Platform Status**: ✅ PRODUCTION LIVE (https://elimu-smart.co.ke)
**Code Quality**: 100% Lint Compliance, Zero TypeScript Errors
**Migration Status**: shadcn Complete (Student/Counselor), Admin Hybrid Functional
**Assessment Data**: ✅ MIGRATED (132 questions API-driven)
**Demo Users**: ✅ 8 accounts seeded and tested (student/counselor/admin)
**Monetization**: Freemium model (Free assessments + Paid counselor services)
**External APIs**: All live with caching (CareerJet, LinkedIn, M-Pesa, ZeptoMail)
**VPS Deployment**: ✅ Production (2 cluster instances) + Staging on TrueHosts VPS
**Database**: PostgreSQL 17.6 (RiasecQuestion, RiasecAssessment, Career, AssessmentProgress, _User)
**SSL Certificates**: Valid until 2026-01-04 (auto-renewing)
