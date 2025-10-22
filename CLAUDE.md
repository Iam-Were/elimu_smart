# Claude Code Development Guide - Elimu Smart

> **🚨 CRITICAL: READ FIRST 🚨**
> **Project Tracking System**: To prevent context loss and incorrect recommendations, **ALWAYS** read `.claude/project-status.json` at the start of EVERY session.
> ```bash
> cat .claude/project-status.json  # See what's completed, what's next
> ```
> See `.claude/TRACKING_SYSTEM.md` for full workflow guide.

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

### 1. Code Quality (100% Compliance REQUIRED)
```bash
# MANDATORY before ANY commit:
npm run build    # Must pass with ZERO errors
npm run lint     # Must pass with ZERO errors and warnings

# Browser testing REQUIRED:
- Open DevTools console
- Check for runtime errors
- Test navigation flows
- Verify all interactive elements work
```

### 2. Component Development Rules

**ALWAYS:**
- Check CLAUDE.md FIRST before making any changes
- Use shadcn UI for all new components
- Use lowercase imports: `@/components/ui/button`
- Define proper TypeScript interfaces (NEVER use `any`)
- Include accessibility (WCAG 2.1 AA compliance)
- Test on mobile AND desktop
- Prefer editing existing files over creating new ones

**NEVER:**
- Create new files unless absolutely necessary
- Use Mantine components for new development
- Use `any` types (use `unknown` with type guards instead)
- Mix uppercase/lowercase in shadcn imports
- Create documentation files unless explicitly requested
- Use blocking API calls in user interactions
- Use `Button asChild` + `Link` + `onClick` combination

### 3. Navigation Pattern (REQUIRED)
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

### 4. Form Response Pattern (REQUIRED)
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

### 5. UX Design Philosophy
**Single-Page > Multi-Step (ALWAYS try single-page first)**

✅ **PREFER**: Immediate results without loading screens
- Click subject → instant career display (like SubjectCareerMapper)
- Static data for immediate value + backend for advanced features
- Everything visible on one page with progressive enhancement

❌ **AVOID**: Multi-step flows unless absolutely necessary
- Only use when: complex data collection, legal compliance, or mobile space constraints

**Key Principle**: Provide immediate value BEFORE asking for user input.

### 6. Card Content & Icon System Standards (2025 Best Practices)

**Minimal Card Content (REQUIRED)**
- **Maximum 6 Elements Per Card**: Icon, Title, Badge, Description, Benefit/Metric, CTA
- **Text Length**: Under 100 characters for descriptions
- **No Verbose Sections**: Remove "Common Questions", "What You'll Do", bullet point lists
- **Benefits**: Single plain text line (no boxes/containers)
- **Cognitive Load**: 4-6 scannable elements only

**Gradient Icon Containers (REQUIRED)**
```typescript
// ✅ CORRECT: Professional gradient icon system
<div className={cn(
  "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
  `bg-gradient-to-br ${card.iconGradient}`
)}>
  {React.cloneElement(card.icon as React.ReactElement, { className: "w-6 h-6 text-white" })}
</div>

// ❌ NEVER: Flat backgrounds (outdated pattern)
<div className="p-2 rounded-lg bg-orange-100 text-orange-600">
  {card.icon}
</div>
```

**Card Type Color Mapping**
- **Assessment/Discovery**: Purple gradient (`from-purple-500 to-purple-600`)
- **Subject/Academic**: Blue gradient (`from-blue-500 to-blue-600`)
- **Skills/Development**: Green gradient (`from-green-500 to-green-600`)
- **University/Placement**: Indigo gradient (`from-indigo-500 to-indigo-600`)
- **Career/Exploration**: Amber gradient (`from-amber-500 to-amber-600`)
- **Results/Dashboard**: Orange gradient (`from-orange-500 to-orange-600`)

**60-30-10 Color Rule**
- **60% Base**: White/neutral backgrounds
- **30% Theme**: Primary user journey color (orange for students)
- **10% Accent**: Card type specific gradients

**Bento Grid Layout Standards**
- **Tall Cards** (`row-span-2`): High complexity content (detailed results, multi-step processes)
- **Standard Cards** (`row-span-1`): Medium complexity (balanced info + action)
- **Compact Cards** (`row-span-1`): Low complexity (metrics, quick actions)
- **Grid Definition**: `auto-rows-[minmax(280px,auto)]` for flexible heights

**Icon Best Practices**
- **Professional Platforms**: Use icons (NOT emojis)
- **Size Hierarchy**: Larger icons (w-12 h-12) for primary actions, smaller (w-6 h-6) for secondary
- **Hover Effects**: Scale transform on hover (`group-hover:scale-110`)
- **Shadow Depth**: `shadow-lg` for gradient containers

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

### Bento Grid Layout Pattern
Variable card heights communicate information importance (see Card Content section above for complete implementation).

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

**Last Verified**: 2025-10-08
**Total Backend Functions**: 108 (92 in main.js + 16 in separate modules)
**Integration Rate**: 57.4% (62/108 integrated)
**Mobile Readiness**: 82% ✅

**Quick Reference Files** (Token Optimization):
- `.claude/integration-status.json` - Complete function mapping (2K tokens vs 12K for this section)
- `.claude/mobile-readiness.md` - Mobile dev checklist (800 tokens)
- `.claude/quick-reference.json` - Function → file locations

**Slash Commands**:
- `/integration-status` - Show integration summary
- `/mobile-readiness` - Mobile readiness checklist
- `/check-backend <function>` - Find function location
- `/token-tips` - Token optimization guide

### Actively Integrated (62 functions - 57.4%)

**Assessment System (10 functions)**
- `getRiasecQuestions`, `getSkillsQuestions`, `saveAssessmentResult`, `getUserAssessments`
- `calculateRiasecScores`, `startRiasecAssessment`, `saveRiasecResponse`, `completeRiasecAssessment`
- `getRiasecResults`, `getRiasecHistory`
- Used by: `lib/assessmentApi.ts`, `FreeRiasecAssessment.tsx`, `SkillsAssessment.tsx`

**User Preferences (3 functions)**
- `getUserPreferences`, `saveUserPreferences`, `updateUserPreference`
- Used by: `lib/userPreferences.ts`, `useTheme.ts`

**Counselor Dashboard (10 functions)**
- `logCounselorActivity`, `getCounselorAssignedStudents`, `getCounselorActiveChatSessions`
- `getCounselorTodaysAppointments`, `getCounselorPendingQuestions`, `getCounselingAnalytics`
- `getCounselorRecentActivities`, `bookCounselorSession`, `getAssignedStudents`, `getPendingSessionRequests`
- Used by: `hooks/useCounselorDashboard.ts`, `SessionManager.tsx`, `StudentRoster.tsx`

**Admin Dashboard (9 functions)**
- `logAdminActivity`, `getAdminSystemMetrics`, `getAdminSecurityMetrics`, `getAdminBusinessMetrics`
- `getAdminContentMetrics`, `getAdminSupportMetrics`, `getAdminAuditLogs`, `getAdminRecentActivities`, `getAdminBillingAnalytics`
- Used by: `hooks/useAdminDashboard.ts`, `SystemAnalytics.tsx`

**Q&A System (4 functions)**
- `submitQuestion`, `answerQuestion`, `getMyQuestions`, `getStudentQuestions`
- Used by: `QuestionQueue.tsx`, `QuickQuestions.tsx`

**Messaging/Chat (8 functions)**
- `createChatRoom`, `sendMessage`, `getChatRooms`, `getChatMessages`
- `markMessagesAsRead`, `getInboxConversations`, `searchConversations`, `archiveConversation`
- Used by: `CounselorChat.tsx`, `InboxPage.tsx`

**Student Features (8 functions)**
- `logUserActivity`, `calculateCareerReadinessScore`, `getCareerExplorationData`
- `getScholarshipMatches`, `getUniversityPlacementData`, `exploreCareers`, `getCareerDetails`, `getCareerJobData`
- Used by: `useDynamicDashboard.ts`, `ScholarshipSearch.tsx`, `CareerExploration.tsx`

**Subscriptions/Billing (7 functions)**
- `getSubscriptionPlans`, `getUserSubscription`, `initiateSubscriptionPayment`, `checkSubscriptionPaymentStatus`
- `cancelSubscription`, `getBillingHistory`, `getInvoiceDetails`
- Used by: `hooks/useSubscription.ts`, `SubscriptionPage.tsx`

**Email Services (6 functions)**
- `sendWelcomeEmail`, `sendAssessmentCompletionEmail`, `sendKuccpsDeadlineReminder`
- `sendSessionBookingConfirmation`, `sendScholarshipAlert`, `getEmailStatistics`
- Used by: `hooks/useEmailService.ts`

**Professional Networking (1 function)**
- `getLinkedInProfessionalInsights`
- Used by: `ProfessionalNetworkingHub.tsx`

### Backend Ready, Frontend Incomplete (46 functions - 42.6%)

**High Priority (Implement Next)**

*Notifications (2 functions)*
- `createNotification`, `getNotifications`
- **Impact**: Real-time alerts (assessment complete, counselor response, deadline reminders)
- **Effort**: 1.5 hours

*File Upload (2 functions)*
- `uploadFile`, `uploadProfileImage`
- **Impact**: Profile pictures, document uploads
- **Effort**: 1.5 hours

*Assessment Progress (3 functions)*
- `updateAssessmentProgress`, `getAssessmentProgress`, `completeAssessment`
- **Impact**: Resume incomplete assessments, show progress on cards
- **Effort**: 1 hour

*Advanced University Matching (3 functions)*
- `calculateKUCCPSPoints`, `matchUniversityCourses`, `calculateCutoffPoints`
- **Impact**: Backend-calculated cluster points, cutoff comparison
- **Effort**: 1 hour

**Medium Priority (Phase 2)**

*Achievements/Gamification (5 functions)*
- `getUserAchievements`, `addAchievementBadge`, `getUserCertifications`
- `syncExternalCertification`, `connectLearningPlatform`

*University Tools (8 functions)*
- `analyzeSubjectCareerFit`, `findUniversityCourses`, `getCourseRecommendations`
- `getKuccpsTimeline`, `updateCareerReadiness`, `startSkillsAssessment`, `calculateSkillProfile`, `resumeRiasecAssessment`

*Billing Admin (4 functions)*
- `generateInvoice`, `getInvoiceHTML`, `resendInvoice` (billing functions duplicated in main.js)

**Low Priority (Admin/Infrastructure)**

*Caching Tools (4 functions)*
- `getCacheStats`, `clearExpiredCache`, `clearAllCache`, `cleanupExpiredCache`

*Schema Initialization (2 functions)*
- `initializeStudentCounselorSchema`, `initializeRiasecSchema`

*Testing/Legacy (2 functions)*
- `hello`, `seedDemoUsers`

## Development Workflow

**Troubleshooting Quick Reference:**
- Build errors: Check shadcn import case (lowercase), missing routes, unused imports
- Runtime errors: MantineProvider context, Parse SDK dynamic imports, navigation pattern
- Performance: Remove unused imports, tree-shaking, useCallback/useMemo, separate utilities

### Before Starting Work
1. ✅ Read CLAUDE.md for current standards and patterns
2. ✅ Check existing components before creating new ones
3. ✅ Understand user journey context (Student/Counselor/Admin)
4. ✅ Plan for Kenya educational context integration

### During Development
1. ✅ Use shadcn UI components exclusively
2. ✅ Write proper TypeScript interfaces (no `any` types)
3. ✅ Follow navigation and form patterns documented above
4. ✅ Test in browser DevTools continuously
5. ✅ Ensure accessibility (ARIA labels, keyboard navigation)

### Development Workflow (Local → GitHub → VPS)

**IMPORTANT**: Follow this exact workflow for all code changes:

#### 1. Local Development (Code + Lint Only)
```bash
cd frontend
npm run dev      # Test changes locally
npm run lint     # Check for errors (MUST pass with 0 errors before commit)
# Fix any lint errors, then commit
```

#### 2. Push to GitHub
```bash
git add .
git commit -m "descriptive message"
git push origin main
```

#### 3. Monitor GitHub Actions
```bash
gh run list --limit 1        # Check latest run status
gh run watch <run-id>        # Monitor build progress
```

**GitHub Actions Workflow** (Automatic):
- ✅ Auto-Fix Lint Errors (runs first, auto-commits fixes if needed)
- ✅ Lint & Build Check (TypeScript + ESLint validation)
- ✅ Node.js CI (production build test on Node 20.x)
- ⚠️ Deploy to Staging (manual - see VPS deployment below)

**Note**: If GitHub Actions fails due to billing limits, proceed with manual VPS deployment after verifying local lint passes.

#### 4. Deploy to VPS (Production)
```bash
ssh root@145.239.42.121

# Navigate to project directory
cd /root/elimu_smart

# Pull latest changes
git pull origin main

# Handle any merge conflicts
git stash                    # If conflicts
git pull origin main
git stash pop               # Resolve conflicts manually if needed

# Backend deployment
cd backend
npm install                 # If package.json changed
pm2 restart parse-server-prod

# Frontend deployment
cd ../frontend
npm install                 # If package.json changed
npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/

# Verify deployment
curl https://elimu-smart.co.ke/parse/health
curl https://elimu-smart.co.ke/
```

#### 5. Verify Production
- **Frontend**: https://elimu-smart.co.ke
- **Backend Health**: https://elimu-smart.co.ke/parse/health
- **Test Key Features**: Login, assessments, navigation
- **Check PM2 Status**: `pm2 status` and `pm2 logs parse-server-prod --lines 50`

### Quick Reference Commands

**Local**:
```bash
npm run lint              # Check code quality
git push origin main      # Push to GitHub
```

**GitHub**:
```bash
gh run list              # View recent runs
gh run watch             # Monitor active run
```

**VPS**:
```bash
ssh root@145.239.42.121
cd /root/elimu_smart && git pull origin main
pm2 restart parse-server-prod
cd frontend && npm run build -- --mode production && sudo cp -r dist/* /var/www/elimu-smart/
```

## Mobile Development Readiness

**Overall Score**: 82% ✅ **READY to start mobile development**

**Critical Finding**: SubjectCareerMapper has 466 lines of hardcoded career data that needs migration to Parse Class database for full mobile readiness.

### Component Readiness Table

| Component | Backend Logic | Data Storage | Offline Support | Mobile Ready |
|-----------|---------------|--------------|-----------------|--------------|
| RIASEC Assessment | ✅ Backend | ✅ Parse DB | ✅ Fallback | ✅ 100% |
| Skills Assessment | ✅ Backend | ✅ Parse DB | ⚠️ None | ✅ 90% |
| Career Exploration | ✅ Backend | ✅ Parse DB | ⚠️ None | ✅ 90% |
| University Finder | ✅ Backend | ✅ Parse DB | ⚠️ None | ✅ 90% |
| Subject Mapper | ⚠️ Partial | ❌ Hardcoded | ✅ All Local | ⚠️ 60% |
| Chat/Inbox | ✅ Backend | ✅ Parse DB | ❌ Not integrated | ❌ 40% |
| User Preferences | ✅ Backend | ✅ Parse DB | ✅ localStorage | ✅ 100% |
| Dashboard | ✅ Backend | ✅ Parse DB | ⚠️ None | ✅ 90% |

**Recommendation**: Start mobile development NOW. Core features (RIASEC, Skills, Career, University) are 90-100% ready. SubjectCareerMapper can ship with embedded data temporarily, migrate to Parse Classes in Sprint 2.

**Full Mobile Checklist**: See `.claude/mobile-readiness.md` (saves 11K tokens vs reading this section)

## Integration Roadmap

**High Priority for Mobile Launch**:
1. **SubjectCareerMapper Migration** (2-3 days):
   - Create Parse Class `Career` database
   - Migrate 466 lines from frontend to backend
   - Impact: -25KB bundle, mobile-ready, dynamic updates

2. **Chat/Messaging Integration** (2 days):
   - Integrate 7 available functions: getChatMessages, getChatRooms, getInboxConversations, archiveConversation, searchConversations, markMessagesAsRead, sendMultimediaMessage
   - Required for: Premium inbox feature

3. **Assessment Progress Tracking** (1-2 days):
   - Integrate 6 functions: startRiasecAssessment, saveRiasecResponse, completeRiasecAssessment, resumeRiasecAssessment, startSkillsAssessment, getAssessmentProgress
   - Required for: Resume incomplete assessments across devices

**Medium Priority**:
- Gamification (3 functions - 1 day)
- University tools enhancement (2 functions - 1 day)

**Low Priority** (Admin/Infrastructure):
- Billing admin features (5 functions)
- Cache management (4 functions)

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

## 🚀 VPS Deployment Guide (TrueHosts)

### **CRITICAL: Read This First on VPS!**

When you (Claude) are logged into the VPS, follow this workflow:

1. **ALWAYS Read CLAUDE.md First**
   ```bash
   cd ~/elimu_smart
   cat CLAUDE.md
   ```

2. **Check Current Context**
   ```bash
   git status
   git log -5
   pm2 status
   ```

3. **VPS Deployment Checklist**
   - [ ] Run `bash backend/setup-vps.sh` (one-time automated setup)
   - [ ] Configure `backend/.env.production` with real credentials (template exists)
   - [ ] Point DNS to VPS IP (elimu-smart.co.ke)
   - [ ] Run SSL setup: `sudo certbot --nginx -d elimu-smart.co.ke -d dashboard.elimu-smart.co.ke`
   - [ ] Build frontend: `cd frontend && npm run build`
   - [ ] Deploy frontend: `sudo mkdir -p /var/www/elimu-smart && sudo cp -r dist/* /var/www/elimu-smart/`
   - [ ] Start Parse Server: `cd backend && pm2 start ecosystem.config.js`
   - [ ] Test Parse API: `curl https://elimu-smart.co.ke/parse/health`

### **Production Environment Variables**

All credentials are in `backend/.env` (already configured):
- **M-Pesa Production**: Consumer Key/Secret, Shortcode 5482596, Passkey ready ✅
- **ZeptoMail**: API token configured for emails ✅
- **Parse Server**: App ID `elimu_smart_app_2024`, Master Key set ✅
- **PostgreSQL**: User `elimu`, Database `elimu_smart_prod` ✅
- **Redis**: `redis://localhost:6379` ✅

### **External APIs & Caching Status**

**Caching Implementation**: ✅ COMPLETE
- Redis cache adapter configured in `server-working.js`
- Cache utility module: `backend/utils/cache.js`
- TTL configuration for all data types
- Development: In-memory cache | Production: Redis

**Active APIs**:

1. **M-Pesa Daraja API** ✅ PRODUCTION READY
   - Shortcode: 5482596, Environment: Production
   - **CACHING: NO** (TTL: 0s) - Real-time payments only

2. **ZeptoMail API** ✅ CONFIGURED
   - From: noreply@elimu-smart.co.ke
   - **CACHING: NO** (TTL: 0s) - Emails send immediately

3. **CareerJet API** ✅ LIVE DATA
   - Real API integrated in: `backend/cloud/main.js:4140`
   - Public API (free, no key required)
   - **CACHING: YES** (TTL: 24 hours) - Job listings cached

4. **LinkedIn Insights** ✅ LIVE DATA
   - Real verified LinkedIn profiles: John Walubengo, Juliana Rotich, Sam Gichuru, James Mwangi, Betty Maina
   - Implementation: `backend/cloud/linkedin-professional-insights.js`
   - **CACHING: YES** (TTL: 7 days) - Cached via `getCached()` wrapper

**Data Sources (No External API)**:
- KUCCPS Data: 7-day cache (weekly updates during admission season)
- Universities: 24-hour cache (manual yearly updates)
- Scholarships: 24-hour cache (manual/scraped data)
- Kenya Careers: 24-hour cache (static database)

**See**: `CACHING_IMPLEMENTATION.md` for complete details

## Multi-Environment Deployment Architecture

### **Environment Strategy**

Elimu Smart uses a **3-tier environment** for safe, reliable deployments:

| Environment | URL | Port | Database | Redis DB | Purpose |
|-------------|-----|------|----------|----------|---------|
| **Development** | http://localhost:5173 | 1337 | `elimu_smart_dev` | - | Local development |
| **Staging** | https://staging.elimu-smart.co.ke | 1338 | `elimu_smart_staging` | 1 | Pre-production testing |
| **Production** | https://elimu-smart.co.ke | 1337 | `elimu_smart_production` | 0 | Live user-facing app |

### **Critical Deployment Fixes (2025-10-06)**

**Problem 1: Hardcoded Port Issue**
```javascript
// ❌ WRONG: Line 113 in server-working.js had hardcoded port
const port = 1337;

// ✅ FIXED: Use environment variable with fallback
const port = process.env.PORT || 1337;
```
- **Impact**: Staging can now run on port 1338, production on 1337
- **File**: `backend/server-working.js:113`

**Problem 2: Double Dotenv Loading**
```javascript
// ❌ WRONG: server-working.js always loaded .env, overriding staging vars
require('dotenv').config();

// ✅ FIXED: Conditional loading with flag check
if (!process.env.DOTENV_LOADED) {
  require('dotenv').config();
}
```
- **Impact**: Staging environment variables no longer overridden by production .env
- **File**: `backend/server-working.js:10-12`

**Problem 3: Staging Environment Loader**
```javascript
// backend/server-staging.js (NEW FILE)
// Set flag to prevent server-working.js from loading .env
process.env.DOTENV_LOADED = 'true';

// Load staging environment
require('dotenv').config({ path: '.env.staging' });

// Then start the regular server
require('./server-working.js');
```
- **Why**: PM2's `env_file` feature is unreliable across versions
- **Pattern**: Dedicated loader scripts for each environment
- **Impact**: Clean environment isolation without PM2 workarounds

### **PM2 Configuration (Dual Environment)**

```javascript
// backend/ecosystem.config.js
module.exports = {
  apps: [
    // PRODUCTION Parse Server
    {
      name: 'parse-server-prod',
      script: 'server-working.js',
      instances: 2,  // Cluster mode
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production' },
      cron_restart: '0 3 * * *'  // Restart at 3 AM daily
    },

    // STAGING Parse Server
    {
      name: 'parse-server-staging',
      script: 'server-staging.js',  // Uses dedicated loader
      instances: 1,  // Single instance
      exec_mode: 'fork',
      env: { NODE_ENV: 'staging' }
    }
    // ... dashboards
  ]
};
```

**PM2 Commands**:
```bash
pm2 start ecosystem.config.js   # Start all services
pm2 restart parse-server-prod    # Restart production only
pm2 restart parse-server-staging # Restart staging only
pm2 logs parse-server-staging    # View staging logs
pm2 monit                        # Monitor all processes
```

### **Environment Files Structure**

**Backend**:
- `.env` → Production (port 1337, `elimu_smart_production`, Redis DB 0)
- `.env.staging` → Staging (port 1338, `elimu_smart_staging`, Redis DB 1)

**Frontend**:
- `.env.production` → `VITE_PARSE_SERVER_URL=https://elimu-smart.co.ke/parse`
- `.env.staging` → `VITE_PARSE_SERVER_URL=https://staging.elimu-smart.co.ke/parse`

**Build Commands**:
```bash
cd frontend

# Build for production
npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/

# Build for staging
npm run build -- --mode staging
sudo cp -r dist/* /var/www/elimu-smart-staging/
```

### **Deployment Workflow**

**To Staging (Test Changes)**:
```bash
git push origin main
ssh root@145.239.42.121
cd /root/elimu_smart
git pull origin main
pm2 restart parse-server-staging
cd frontend && npm run build -- --mode staging
sudo cp -r dist/* /var/www/elimu-smart-staging/
curl https://staging.elimu-smart.co.ke/health
```

**To Production (After Staging Tests Pass)**:
```bash
pm2 restart parse-server-prod
cd /root/elimu_smart/frontend
npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/
curl https://elimu-smart.co.ke/health
```

**See**: `DEPLOYMENT_GUIDE.md` for complete VPS setup, SSL certificates, troubleshooting

### **Recent Backend Migrations (2025-10-06)**

1. **✅ Assessment Data** - COMPLETED
   - RiasecQuestion, SkillQuestion classes with 132 questions
   - Migration: `backend/migrations/seed-assessments.js` (21KB, seeded)

2. **✅ LocalStorage → Parse Objects** - COMPLETED
   - UserPreferences class with Cloud Functions (theme, darkMode, onboarding, cardOrder)
   - Migration: `backend/migrations/create-user-preferences-schema.js`
   - Reduced from 56+ localStorage calls to ~17 (auth tokens only)

3. **✅ RIASEC Scoring Algorithms** - COMPLETED
   - Moved 275 lines from frontend to Cloud Functions
   - File: `backend/cloud/riasecScoringFunctions.js`
   - Functions: calculateRiasecScores, generateCareerMatches, generateDevelopmentAreas, generateNextSteps

4. **✅ Parse SDK Code-Splitting** - COMPLETED
   - Converted all static imports to dynamic `getParse()`
   - Files: useCounselorDashboard.ts, useEmailService.ts, useAdminDashboard.ts (27 functions)

5. **✅ Route-Based Lazy Loading** - COMPLETED
   - 35 routes converted to React.lazy()
   - Initial bundle reduced from 1,051 KB to 525 KB (50% reduction)

### **Monitoring URLs After Deployment**

**Production**:
- **Main Site**: https://elimu-smart.co.ke
- **Parse API**: https://elimu-smart.co.ke/parse
- **Health Check**: https://elimu-smart.co.ke/health
- **Parse Dashboard**: https://elimu-smart.co.ke/dashboard (admin/[set-password])

**Staging**:
- **Main Site**: https://staging.elimu-smart.co.ke
- **Parse API**: https://staging.elimu-smart.co.ke/parse
- **Health Check**: https://staging.elimu-smart.co.ke/health
- **Parse Dashboard**: https://staging.elimu-smart.co.ke/dashboard (admin/[set-password])

**Monitoring Tools**:
- **PM2 Monitoring**: `pm2 monit` (CLI) or https://app.pm2.io (after signup)
- **UptimeRobot**: Configure after deployment (free tier)

### **Daily Backup Schedule**

Automated cron job runs at 2 AM daily:
```bash
/home/user/elimu_smart/backend/scripts/backup-database.sh
```

Backups stored in: `~/elimu_smart_backups/` (30-day retention)

---

## Quick Deployment Reference

**For detailed VPS deployment steps, see: `VPS_DEPLOYMENT.md`**

**Quick Deploy to Production**:
```bash
cd /root/elimu_smart && git pull origin main
cd backend && npm install && pm2 restart parse-server-prod
cd ../frontend && npm install && npm run build -- --mode production
sudo cp -r dist/* /var/www/elimu-smart/
curl https://elimu-smart.co.ke/parse/health
```

**Migrations to Run** (if not already run):
```bash
cd /root/elimu_smart/backend
node migrations/create-user-preferences-schema.js  # NEW
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
