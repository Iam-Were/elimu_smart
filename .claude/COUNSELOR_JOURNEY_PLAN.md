# Counselor User Journey Plan

**Date**: 2025-10-22
**Priority**: HIGH (User requested focus)
**Current Status**: Functional but needs enhancement

---

## 🎯 Executive Summary

### Current State Assessment

**✅ What's Working Well:**
1. **Inbox UI** - LinkedIn-style chat interface (350 lines) - Modern, polished, mobile-responsive
2. **Dashboard** - Tabbed layout with Overview/Analytics/Sessions/Students/Availability
3. **Profile** - Complete with credentials, performance metrics, professional presentation
4. **Yellow Theme** - Consistent (#eab308) across all counselor interfaces
5. **Backend Integration** - 10 Cloud Functions actively integrated (see below)

**⚠️ Gaps Identified:**
1. **No Unified Card System** - Counselor still uses legacy CounselorDashboardCards (not V2)
2. **Limited Mobile Optimization** - Missing WCAG AAA touch targets, filter chips, responsive stats
3. **Question Queue Not Visible** - Community Q&A management buried in tabs
4. **No Quick Actions** - Missing FAB for mobile, no urgent action shortcuts
5. **Session Booking Flow** - BookingModal exists but not integrated with calendar
6. **Student Profile View** - Can't preview student details from roster

---

## 📊 Current Backend Integration Status

### **Actively Integrated (10 functions)**

| Function | Purpose | Used In |
|----------|---------|---------|
| `logCounselorActivity` | Track all counselor actions | useCounselorDashboard.ts |
| `getCounselorAssignedStudents` | Fetch assigned student list | StudentRoster.tsx |
| `getCounselorActiveChatSessions` | Get active inbox conversations | useCounselorDashboard.ts |
| `getCounselorTodaysAppointments` | Today's session schedule | SessionManager.tsx |
| `getCounselorPendingQuestions` | Unanswered Q&A queue | QuestionQueue.tsx |
| `getCounselingAnalytics` | Performance metrics (satisfaction, response time) | CounselorAnalyticsCards.tsx |
| `getCounselorRecentActivities` | Activity feed | useCounselorDashboard.ts |
| `bookCounselorSession` | Create new session | SessionManager.tsx |
| `getAssignedStudents` | Student roster with filters | StudentRoster.tsx |
| `getPendingSessionRequests` | Session booking requests | SessionManager.tsx |

### **Backend Ready, Not Integrated (4 functions)**

| Function | Priority | Impact | Effort |
|----------|----------|--------|--------|
| `answerQuestion` | HIGH | Enable Q&A workflow | 1 hour |
| `getMyQuestions` | HIGH | Personal Q&A history | 30 min |
| `createChatRoom` | MEDIUM | Initiate new conversations | 1 hour |
| `markMessagesAsRead` | MEDIUM | Inbox read receipts | 30 min |

---

## 🗺️ Counselor User Journey Map

### **Journey 1: Daily Routine (Most Common - 80% of sessions)**

**Scenario**: Sarah logs in every morning at 8 AM to check urgent items

#### Current Flow (7 steps, 4 clicks):
1. Login → Dashboard Overview tab
2. See 3 cards: Premium Students, Premium Inbox, Booked Sessions
3. Click "Premium Inbox" card → Navigate to /inbox
4. Click conversation → Read messages
5. Back button → Dashboard
6. Click "Students" tab → View roster
7. Click student name → (No student detail view - gap!)

#### Proposed Flow (4 steps, 2 clicks):
1. Login → Dashboard with **Urgent Actions Hero Section** (top priority)
   - 7 At-Risk Students (red badge)
   - 8 Unread Premium Messages (orange badge)
   - 6 Sessions Today (green badge)
2. Click any urgent item → Filtered view (inbox/roster/sessions)
3. **Bottom Sheet Preview** → Quick student info without full navigation
4. Take action (message, book session, mark resolved)

**Time Saved**: 3 minutes per session × 5 sessions/day = **15 min/day**

---

### **Journey 2: Answering Community Questions (Weekly - 20% effort)**

**Scenario**: Sarah dedicates 1 hour/week to answering free Q&A questions for reputation building

#### Current Flow (Gap - Feature Missing):
1. Dashboard → ??? (No Q&A access from dashboard)
2. Manual navigation to /guidance/community-qa (student route)
3. View questions (student perspective)
4. No counselor-specific answer interface

#### Proposed Flow (3 steps):
1. Dashboard → "Pending Questions" card shows **15 unanswered**
2. Click card → QuestionQueue component (counselor view)
   - Filter: Unanswered, My Answers, All
   - Rich text editor for answers
   - Markdown preview
3. Answer + Submit → Auto-notify student via email

**Backend**: Already integrated (`getCounselorPendingQuestions`, need `answerQuestion`)

---

### **Journey 3: Session Management (Daily - High Revenue)**

**Scenario**: James manages 6 video/phone sessions today, needs quick context

#### Current Flow (Working but clunky):
1. Dashboard → Sessions tab
2. See SessionManager table (all sessions)
3. Filter by "Today"
4. Click session → BookingModal opens
5. (No student context - needs to remember from memory)

#### Proposed Flow (Enhanced):
1. Dashboard → **Today's Schedule Card** (bento grid, row-span-2)
   - 6 sessions with student names, times, topics
   - Color-coded: Upcoming (blue), In Progress (green), Completed (gray)
2. Click session → **Bottom Sheet** with:
   - Student profile summary (RIASEC results, career goals, KCSE grades)
   - Session notes from previous meetings
   - Pre-session questionnaire responses
3. Start Session button → Join video call (future: Jitsi integration)

**Backend**: Mostly ready (`getCounselorTodaysAppointments`, `bookCounselorSession`)

---

### **Journey 4: Student Progress Tracking (Weekly)**

**Scenario**: Linda reviews her 12 premium students' progress for monthly reports

#### Current Flow (Gap - No Progress View):
1. Dashboard → Students tab
2. See StudentRoster table (name, email, status)
3. (No assessment completion, no career readiness score, no activity log)

#### Proposed Flow (Enhanced):
1. Dashboard → **Premium Students Card** with metrics:
   - 12 Active Students
   - 9 Assessments Completed
   - 3 At-Risk (career readiness <40%)
2. Click card → **Enhanced Student Roster** with columns:
   - Name + Avatar
   - Career Readiness Score (color-coded progress bar)
   - Assessments (5/5 completed badge)
   - Last Activity (2 days ago)
   - Urgency (red/yellow/green flag)
3. Click student → **Student Profile Bottom Sheet**:
   - RIASEC: Investigative (32%), Artistic (28%)
   - KCSE Subjects: Math A-, Physics B+, Chem B
   - University Target: JKUAT Engineering
   - Last message: 3 days ago
   - Quick actions: Message, Book Session, View Full Profile

**Backend**: Need to integrate `getStudentProfile`, `getAssessmentProgress`

---

## 🎨 Design System Enhancements

### **Counselor Yellow Theme (#eab308) + Orange Accents**

Following student theme pattern but with counselor colors:

| Element | Color | Usage |
|---------|-------|-------|
| Primary Actions | `bg-yellow-600 hover:bg-yellow-700` | CTAs, active states |
| Cards | `border-yellow-200 bg-yellow-50/50` | Card backgrounds |
| Icon Gradients | `from-yellow-500 to-yellow-600` | Professional service cards |
| Urgent Items | `from-orange-500 to-red-500` | At-risk students, overdue tasks |
| Success | `from-green-500 to-green-600` | Completed sessions, high performers |
| Neutral | `from-gray-500 to-gray-600` | Informational cards |

### **Mobile-First Principles (WCAG AAA)**

1. **Touch Targets**: Min 48px height (all buttons, filter chips, tabs)
2. **Filter Chips**: Horizontal scroll with hide-scrollbar
3. **Responsive Stats**: 2-col mobile → 4-col desktop
4. **Bento Grid**: Auto-rows-[minmax(280px,auto)]
5. **Active States**: `active:scale-[0.98]` for touch feedback

---

## 🛠️ Phase 1: Counselor Card System V2 (Priority 1)

### **Task 1.1: Create CounselorDashboardCardsV2.tsx**

**Estimated Time**: 3-4 hours

**Component Structure**:
```typescript
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { UnifiedCardGrid } from '@/components/cards/UnifiedCardGrid';

export const CounselorDashboardCardsV2 = () => {
  const { cards, loading, error } = useDynamicCards({
    variant: 'counselor-dashboard',
    maxCards: 6
  });

  return (
    <UnifiedCardGrid
      cards={cards}
      variant="counselor-dashboard"
      theme="counselor"
    />
  );
};
```

**Cards to Display** (Backend-driven):

1. **Premium Students** (Dashboard card)
   - Icon: Users (gradient: yellow)
   - Metric: 12 Active Premium
   - Badge: KES 45,000/month revenue
   - Urgency: medium (3 at-risk)
   - Action: View Roster

2. **Premium Inbox** (Dashboard card)
   - Icon: MessageSquare (gradient: yellow)
   - Metric: 8 Unread Messages
   - Badge: 24hr response guarantee
   - Urgency: high (2 urgent)
   - Action: Open Inbox

3. **Booked Sessions** (Dashboard card, row-span-2)
   - Icon: Calendar (gradient: green)
   - Metric: 6 Today
   - List: Next 3 sessions with times
   - Badge: KES 9,000 earnings today
   - Action: View Schedule

4. **Pending Questions** (Guidance card)
   - Icon: HelpCircle (gradient: blue)
   - Metric: 15 Unanswered
   - Badge: Free (builds reputation)
   - Urgency: low
   - Action: Answer Questions

5. **Performance** (Dashboard card)
   - Icon: TrendingUp (gradient: purple)
   - Metric: 4.8/5 Rating
   - Sub-metrics: 92% retention, 2.3h avg response
   - Badge: Top 10% counselors
   - Action: View Analytics

6. **Availability** (Dashboard card)
   - Icon: Clock (gradient: orange)
   - Metric: 12 Slots Available This Week
   - Badge: 40 hours/week capacity
   - Action: Manage Calendar

### **Task 1.2: Extend useDynamicCards hook**

**File**: `frontend/src/hooks/useDynamicCards.ts`

Add `generateCounselorDashboardCards()` function:

```typescript
const generateCounselorDashboardCards = async (): Promise<DashboardCard[]> => {
  const Parse = await getParse();

  const [students, inbox, sessions, questions, analytics] = await Promise.allSettled([
    Parse.Cloud.run('getCounselorAssignedStudents'),
    Parse.Cloud.run('getCounselorActiveChatSessions'),
    Parse.Cloud.run('getCounselorTodaysAppointments'),
    Parse.Cloud.run('getCounselorPendingQuestions'),
    Parse.Cloud.run('getCounselingAnalytics')
  ]);

  // Transform backend data to DashboardCard[]
  // (Similar pattern to generateDashboardCards but with counselor metrics)
};
```

### **Task 1.3: Create CardInterfaces for Counselor**

**File**: `frontend/src/types/CardInterfaces.ts`

Add discriminated union type:

```typescript
export interface CounselorDashboardCard extends BaseCard {
  cardType: 'counselor-dashboard';
  metric: {
    label: string;
    value: string | number;
  };
  subMetrics?: Array<{ label: string; value: string }>;
  revenue?: string; // KES 45,000/month
  urgency?: 'low' | 'medium' | 'high';
  badge?: { text: string; variant: BadgeVariant };
}
```

---

## 🛠️ Phase 2: Enhanced Student Roster (Priority 2)

### **Task 2.1: Add Student Bottom Sheet**

**Estimated Time**: 2-3 hours

**Component**: `frontend/src/components/counselor/StudentProfileSheet.tsx`

```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface StudentProfileSheetProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileSheet = ({ studentId, isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (studentId && isOpen) {
      fetchStudentProfile(studentId);
    }
  }, [studentId, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Student Profile</SheetTitle>
        </SheetHeader>

        {/* Profile sections */}
        <div className="space-y-4 mt-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar />
                <div>
                  <h3>{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">Form 4, Starehe Boys</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Career Readiness Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Career Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">67%</div>
              <Progress value={67} className="mt-2" />
            </CardContent>
          </Card>

          {/* Assessment Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Assessments Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge>RIASEC: Investigative (32%)</Badge>
                <Badge>Skills: Data Analysis (85%)</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button onClick={() => navigateToInbox(studentId)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" onClick={() => openBookingModal(studentId)}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Session
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
```

### **Task 2.2: Enhanced StudentRoster with Progress**

**File**: `frontend/src/components/counselor/StudentRoster.tsx`

Add columns:
- Career Readiness Score (progress bar)
- Assessments Badge (3/5 completed)
- Last Activity (relative time)
- Urgency Flag (red/yellow/green dot)

---

## 🛠️ Phase 3: Q&A Workflow (Priority 3)

### **Task 3.1: Integrate answerQuestion Function**

**Estimated Time**: 1-2 hours

**Backend Function** (already exists): `answerQuestion(questionId, answerText)`

**Frontend Integration**:

1. Create `frontend/src/components/counselor/QuestionAnswerCard.tsx`
2. Rich text editor (Tiptap or similar)
3. Markdown preview
4. Submit → Call `answerQuestion` → Update UI
5. Auto-notify student via `sendQuestionAnswerNotification`

### **Task 3.2: Add Pending Questions Card to Dashboard**

Update `useDynamicCards` to include:

```typescript
{
  id: 'pending-questions',
  cardType: 'counselor-dashboard',
  title: 'Community Q&A',
  description: 'Answer student questions to build reputation',
  icon: HelpCircle,
  iconGradient: 'from-blue-500 to-blue-600',
  metric: { label: 'Unanswered Questions', value: pendingCount },
  actionText: 'Answer Now',
  actionUrl: '/counselor/questions',
  urgency: 'low',
  badge: { text: 'Free', variant: 'secondary' }
}
```

---

## 🛠️ Phase 4: Mobile Optimizations (Priority 4)

### **Task 4.1: Add Filter Chips to Dashboard**

Same pattern as StudentAssessmentCardsV2:

```typescript
const filters = [
  { id: 'urgent', label: 'Urgent', icon: AlertCircle, count: urgentCount },
  { id: 'today', label: 'Today', icon: Calendar, count: todayCount },
  { id: 'premium', label: 'Premium', icon: Star, count: premiumCount },
  { id: 'all', label: 'All', icon: Circle, count: totalCount }
];
```

### **Task 4.2: Responsive Stats Grid**

Convert hardcoded stats to backend-driven:

```typescript
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
  <StatCard label="Active Students" value={stats.activeStudents} color="yellow" />
  <StatCard label="Sessions This Week" value={stats.weekSessions} color="green" />
  <StatCard label="Avg Response Time" value={stats.avgResponse} color="blue" />
  <StatCard label="Satisfaction" value={stats.satisfaction} color="purple" />
</div>
```

### **Task 4.3: FAB for Mobile Quick Actions**

Add floating action button (mobile only):

- Message Student (opens student search)
- Book Session (opens calendar)
- Answer Question (opens Q&A queue)
- View Schedule (today's sessions)

---

## 📋 Implementation Checklist

### **Phase 1: Card System V2** (3-4 hours)
- [ ] Create `CounselorDashboardCardsV2.tsx`
- [ ] Extend `useDynamicCards` with `generateCounselorDashboardCards()`
- [ ] Add `CounselorDashboardCard` interface to `CardInterfaces.ts`
- [ ] Update `CounselorDashboardPage.tsx` to use V2 component
- [ ] Test with real backend data
- [ ] Verify mobile responsive (375px - 1440px)

### **Phase 2: Student Roster** (2-3 hours)
- [ ] Create `StudentProfileSheet.tsx` bottom sheet
- [ ] Add progress columns to `StudentRoster.tsx`
- [ ] Integrate `getStudentProfile` backend function
- [ ] Add quick actions (Message, Book Session)
- [ ] Test sheet open/close animations

### **Phase 3: Q&A Workflow** (1-2 hours)
- [ ] Create `QuestionAnswerCard.tsx`
- [ ] Integrate `answerQuestion` backend function
- [ ] Add rich text editor (Tiptap)
- [ ] Add Pending Questions card to dashboard
- [ ] Test notification flow

### **Phase 4: Mobile Optimizations** (2-3 hours)
- [ ] Add filter chips with horizontal scroll
- [ ] Convert stats to responsive grid
- [ ] Add FAB for mobile quick actions
- [ ] WCAG AAA touch target audit (min 48px)
- [ ] Test on real devices (iPhone SE, Android)

---

## 🎯 Success Metrics

### **Efficiency Gains**
- Daily routine: 7 steps → 4 steps (-43%)
- Time saved: 15 min/day × 5 days/week = **1.25 hours/week**
- Q&A visibility: Hidden feature → Prominent dashboard card

### **User Satisfaction**
- Counselor NPS score: Target 70+ (measure post-launch)
- Feature adoption: 80%+ counselors use bottom sheet within 2 weeks
- Mobile usage: 40%+ counselors access via mobile (up from 10%)

### **Code Quality**
- Code reduction: Migrate to V2 (expect -40% lines like student cards)
- Mobile compliance: 100% WCAG AAA touch targets
- Lint status: 0 errors, 0 warnings

---

## 🚀 Next Steps

1. **User Approval**: Review plan with client
2. **Start Phase 1**: Create CounselorDashboardCardsV2
3. **Backend Coordination**: Ensure all Cloud Functions tested
4. **Design Review**: Validate yellow theme consistency
5. **Mobile Testing**: Set up device lab (BrowserStack or real devices)

---

**Last Updated**: 2025-10-22
**Estimated Total Time**: 8-12 hours
**Priority**: HIGH (User-requested focus)
