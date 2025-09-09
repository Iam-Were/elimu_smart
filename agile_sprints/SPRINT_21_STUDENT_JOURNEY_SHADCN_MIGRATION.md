# Sprint 21: Student Journey Shadcn UI Migration (Weeks 41-42)

## 🎯 Sprint Goal

Migrate core student journey components from Mantine UI to Shadcn UI with data-focused cards, maintaining current design theme and implementing comprehensive user acceptance testing.

## 📋 User Stories

### Epic: Student Dashboard Migration

**As a** student user  
**I want** data-focused dashboard cards that show my progress and recommendations  
**So that** I can quickly understand my academic journey and next steps

#### Story 21.1: Shadcn UI Foundation Setup (5 points)

```
As a developer
I want to integrate Shadcn UI alongside existing Mantine components
So that I can gradually migrate without breaking existing functionality

Acceptance Criteria:
- [ ] Install Shadcn UI dependencies (class-variance-authority, clsx, tailwind-merge)
- [ ] Configure components.json with current theme integration
- [ ] Update tsconfig.json with @/components path mapping
- [ ] Create theme bridge between current colors and Shadcn tokens
- [ ] Implement dual-component support (Mantine + Shadcn coexistence)

User Acceptance Test:
□ Developer can import both Mantine and Shadcn buttons simultaneously
□ Current orange theme (#ff6b35) applies correctly to Shadcn components
□ No TypeScript errors on component imports
□ Build process completes successfully with both libraries
```

#### Story 21.2: Assessment Progress Card Component (8 points)

```
As a student
I want to see my assessment completion progress in a visual card
So that I know what assessments to complete next

Acceptance Criteria:
- [ ] Create AssessmentProgressCard with Shadcn Card base
- [ ] Display progress ring with completion percentage
- [ ] Show next assessment CTA with current theme colors
- [ ] Include estimated time remaining
- [ ] Add status badges (Completed, In Progress, Not Started)
- [ ] Implement responsive design for mobile/desktop

Data Requirements:
- assessmentId: string
- title: string
- progress: number (0-100)
- totalQuestions: number
- completedQuestions: number
- estimatedTime: string
- status: 'completed' | 'in-progress' | 'pending'
- nextAction: string

User Acceptance Test:
□ Card displays correct progress percentage with visual ring
□ CTA button uses current orange theme (#ff6b35) 
□ Status badge shows appropriate color based on progress
□ Card is responsive on mobile (320px) and desktop (1024px+)
□ Click on CTA navigates to correct assessment page
□ Progress updates reflect immediately when data changes
```

#### Story 21.3: Career Matches Card Component (13 points)

```
As a student
I want to see my top career matches with confidence scores
So that I can explore careers that align with my interests and skills

Acceptance Criteria:
- [ ] Create CareerMatchCard with top 3 career recommendations
- [ ] Display match percentage bars with gradient colors
- [ ] Show required subjects for each career
- [ ] Include average salary range and growth rate
- [ ] Add "Explore More" action button
- [ ] Implement career preview modal/drawer

Data Requirements:
- careerId: string
- title: string
- matchPercentage: number (0-100)
- requiredSubjects: string[]
- averageSalary: { min: number, max: number }
- growthRate: string
- description: string
- industry: string
- educationLevel: string

User Acceptance Test:
□ Displays exactly 3 career matches in order of match percentage
□ Match bars show gradient from low (red) to high (green) confidence
□ Required subjects display as chips/badges
□ Salary range formats correctly (e.g., "KES 50,000 - 80,000")
□ "Explore More" button opens detailed career information
□ Card handles loading state gracefully
□ Empty state shows when no matches available
```

#### Story 21.4: Subject Performance Card Component (8 points)

```
As a student
I want to see my subject performance with trend indicators
So that I can identify areas for improvement

Acceptance Criteria:
- [ ] Create SubjectPerformanceCard showing current grades
- [ ] Display trend indicators (up/down/stable) with icons
- [ ] Show subject-to-career connections
- [ ] Include improvement recommendations
- [ ] Add quick action to view detailed subject analysis

Data Requirements:
- subject: string
- currentGrade: string
- previousGrade: string
- trend: 'up' | 'down' | 'stable'
- recommendations: string[]
- relatedCareers: string[]
- averageClass: number
- position: number

User Acceptance Test:
□ Current grade displays prominently with appropriate color
□ Trend arrow points correct direction with matching color
□ Related careers show as clickable chips
□ Recommendations appear as actionable items
□ Card links to detailed subject performance page
□ Handles missing grade data gracefully
```

#### Story 21.5: Student Navigation Flow Enhancement (5 points)

```
As a student
I want intuitive navigation between assessment, results, and recommendations
So that I can complete my journey without confusion

Acceptance Criteria:
- [ ] Add /student-dashboard route with new cards
- [ ] Update navigation to include direct card access
- [ ] Implement breadcrumb navigation for student journey
- [ ] Add progress indicators for multi-step processes
- [ ] Create mobile-friendly navigation drawer

User Acceptance Test:
□ Student can navigate from dashboard to any assessment in 2 clicks
□ Breadcrumbs show current location in student journey
□ Mobile navigation drawer opens smoothly
□ Back buttons work correctly throughout the journey
□ Navigation state persists across page refreshes
```

## 🏗️ Technical Requirements

### Component Architecture

```typescript
// Base card interface for all student cards
interface StudentDashboardCard {
  id: string;
  type: 'assessment' | 'career' | 'subject' | 'counseling';
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  lastUpdated: Date;
  actions: CardAction[];
}

// Card action interface
interface CardAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'outline';
  onClick: () => void;
  disabled?: boolean;
}
```

### Theme Integration

```typescript
// Shadcn theme config with current colors
const theme = {
  colors: {
    primary: '#ff6b35', // Current orange
    secondary: '#ff8a65', // Lighter orange
    muted: '#f3f2f0',
    border: 'rgba(255, 107, 53, 0.3)',
  }
}
```

### File Structure

```
src/
├── components/
│   ├── ui/ (Shadcn components)
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── progress.tsx
│   └── student/
│       ├── AssessmentProgressCard.tsx
│       ├── CareerMatchCard.tsx
│       ├── SubjectPerformanceCard.tsx
│       └── StudentDashboard.tsx
├── lib/
│   └── utils.ts (Shadcn utilities)
└── pages/
    └── StudentDashboard.tsx
```

## 🧪 User Acceptance Testing Framework

### Testing Protocol (Mandatory after each story)

1. **Functional Testing**
   - [ ] All acceptance criteria verified
   - [ ] Data displays correctly
   - [ ] User interactions work as expected
   - [ ] Error states handled gracefully

2. **Visual Testing**
   - [ ] Current theme colors applied correctly
   - [ ] Responsive design works on all screen sizes
   - [ ] Typography and spacing consistent
   - [ ] Loading states appear professional

3. **User Experience Testing**
   - [ ] Navigation feels intuitive
   - [ ] Information hierarchy is clear
   - [ ] Actions are discoverable
   - [ ] Feedback is provided for all interactions

### Testing Checklist Template

```
Story X.X Testing Checklist:

□ Functional Requirements
  □ Feature works as described
  □ Data loads and displays correctly
  □ All buttons/links functional
  □ Form validation works

□ Visual Requirements  
  □ Matches design specifications
  □ Current theme colors applied
  □ Responsive on mobile/tablet/desktop
  □ Loading states implemented

□ User Experience
  □ Flow feels natural
  □ Information is clear
  □ Actions are obvious
  □ Error messages helpful

□ Technical Requirements
  □ No console errors
  □ TypeScript compiles cleanly  
  □ Performance acceptable (<3s load)
  □ Accessibility standards met

Tester: ___________
Date: ___________
Status: PASS/FAIL
Notes: ___________
```

## 📊 Current Student Navigation Flow Assessment

### Existing Student Routes:
- `/dashboard` - Main student dashboard
- `/assessment` - Career assessment  
- `/subject-mapper` - Subject to career mapping
- `/career-hub` - Career exploration
- `/profile` - Student profile

### Expected Student Journey:
1. **Onboarding** → Assessment setup
2. **Assessment** → Complete career/subject evaluations  
3. **Results** → View matches and recommendations
4. **Planning** → Create action plan with counselor
5. **Monitoring** → Track progress and updates

### Navigation Gaps Identified:
- [ ] No dedicated student dashboard with overview cards
- [ ] Missing assessment progress tracking
- [ ] No consolidated results view
- [ ] Limited progress monitoring tools
- [ ] Unclear next steps after assessment completion

## ✅ Definition of Done

- [ ] All Shadcn components use current theme colors (#ff6b35 primary)
- [ ] Each component passes comprehensive user acceptance testing
- [ ] Components are fully responsive (320px - 1920px)
- [ ] TypeScript compiles without errors or warnings
- [ ] All data displays correctly with proper loading states
- [ ] Navigation flows are intuitive and complete
- [ ] Performance metrics meet standards (<3s initial load)
- [ ] Components coexist with existing Mantine components

## 🚀 Deliverables

1. **Shadcn UI foundation** integrated with current theme
2. **Assessment progress card** with visual progress tracking
3. **Career matches card** with top 3 recommendations
4. **Subject performance card** with trend analysis
5. **Enhanced navigation** for complete student journey
6. **UAT framework** implemented and documented

## 📊 Sprint Metrics

- **Story Points**: 39 points
- **Risk Level**: Medium (new UI library integration)
- **Dependencies**: Current theme system, existing data models
- **Testing Overhead**: +25% for mandatory UAT after each story

## 🔄 Sprint Review Criteria

### Demo Requirements

- Show side-by-side comparison of old vs new components
- Demonstrate data-driven card functionality
- Navigate through complete student journey
- Show responsive behavior on different devices
- Highlight theme consistency across components

### Stakeholder Questions

1. Do the new cards provide better insights than current components?
2. Is the student journey more intuitive with the new navigation?
3. Does the visual design feel consistent with our brand?
4. Are the performance improvements noticeable?

## 📝 Post-Sprint Migration Assessment

After completing this sprint, we will:

1. **Assess navigation completeness** against expected student journey
2. **Identify any missing cards** or components needed
3. **Plan next user journey** (Counselor or Admin) for Sprint 22
4. **Document lessons learned** from Mantine → Shadcn migration

---

## 🎯 Next Steps

Upon completion and UAT approval, ask user:
- "Are there any missing cards or components needed for the complete student journey?"
- "Should we proceed with the Counselor journey migration next, or focus on a different user type?"