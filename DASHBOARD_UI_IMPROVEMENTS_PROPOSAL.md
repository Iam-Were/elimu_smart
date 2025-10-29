# Dashboard UI Improvements Proposal
**Date:** October 25, 2025  
**Active Implementation:** `Sprint18DashboardPage` → `StudentDashboardCardsV2` → `UnifiedCardGrid`  
**Status:** Ready for Implementation

---

## 🎯 Executive Summary

The current dashboard uses a **card-based Bento grid layout** with backend-driven dynamic data. While functional, it lacks:
- **Visual hierarchy** for critical metrics (Career Readiness Score)
- **Quick insights** without clicking into cards
- **Contextual guidance** for next actions
- **Performance optimizations** for mobile networks

### Proposed Changes Overview
1. **Hero KPI Section** - Prominent Career Readiness Score with visual progress ring
2. **Smart Priority System** - Automatic card sorting by urgency + due dates
3. **Inline Metrics** - Show key data points without navigation
4. **Enhanced Micro-interactions** - Better mobile touch feedback
5. **Progressive Loading** - Skeleton states + optimistic UI

---

## 📱 Current vs. Proposed Layout

### **DESKTOP VIEW (1280px+)**

#### **BEFORE:**
```
┌─────────────────────────────────────────────────────────┐
│  Grid of 6 Cards (3 columns)                           │
│  ┌──────┐ ┌──────┐ ┌──────┐                            │
│  │Card 1│ │Card 2│ │Card 3│                            │
│  │Metric│ │Badge │ │Icon  │                            │
│  └──────┘ └──────┘ └──────┘                            │
│  ┌──────┐ ┌──────┐ ┌──────┐                            │
│  │Card 4│ │Card 5│ │Card 6│                            │
│  └──────┘ └──────┘ └──────┘                            │
└─────────────────────────────────────────────────────────┘
```
**Issues:**
- No clear entry point or focal point
- All cards have equal visual weight
- Critical metrics (readiness score) buried in grid
- No guidance on what to do next

#### **AFTER:**
```
┌─────────────────────────────────────────────────────────┐
│  🎯 HERO KPI - Career Readiness                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │ ⭕ 67%        Assessment: 85% ✓                  │  │
│  │ Readiness     Research: 45% ⚠                    │  │
│  │              [View Full Breakdown →]              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ⚡ URGENT ACTIONS (2 High Priority)                   │
│  ┌──────────────────┐ ┌──────────────────┐             │
│  │🔴 KUCCPS - 7 days│ │🟡 Complete Skills│             │
│  └──────────────────┘ └──────────────────┘             │
│                                                          │
│  📊 YOUR PROGRESS (4 cards, 2x2 grid)                  │
│  ┌──────┐ ┌──────┐                                     │
│  │Univ. │ │Schol.│                                     │
│  │3 🎓  │ │5 💰  │                                     │
│  └──────┘ └──────┘                                     │
│  ┌──────┐ ┌──────┐                                     │
│  │Career│ │Next  │                                     │
│  │RIASEC│ │Session│                                    │
│  └──────┘ └──────┘                                     │
└─────────────────────────────────────────────────────────┘
```

### **MOBILE VIEW (375px)**

#### **BEFORE:**
```
┌──────────────────┐
│  Card 1          │
│  Metric: 67%     │
│  [Action]        │
├──────────────────┤
│  Card 2          │
│  Badge: Success  │
│  [Action]        │
├──────────────────┤
│  Card 3          │
│  ...             │
└──────────────────┘
```
**Issues:**
- Vertical scroll fatigue (6+ cards)
- No quick overview of status
- Small touch targets in dense layouts

#### **AFTER:**
```
┌──────────────────┐
│ 🎯 Career Ready  │
│  ⭕ 67%          │
│  "Good progress!"│
│  [2 metrics ▼]   │
├──────────────────┤
│ ⚡ URGENT (2)    │
│ 🔴 KUCCPS 7 days │
│ 🟡 Skills assess │
├──────────────────┤
│ 📊 YOUR PROGRESS │
│ ┌──────────────┐ │
│ │University 🎓 │ │
│ │3 programs ✓  │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │Scholarships💰│ │
│ │5 matches     │ │
│ └──────────────┘ │
│ [View All 4 →]   │
└──────────────────┘
```

---

## 🎨 Detailed Component Changes

### **1. Hero KPI Section (ENHANCED)**

**Component:** Enhance existing `StudentDashboard.tsx` hero section (Lines 167-300)

**What We're Keeping:**
✅ Profile picture with fallback to UI Avatars  
✅ Welcome message with user's first name  
✅ Last activity tracking  
✅ Career readiness score with progress ring  
✅ Status badge (On Track/Building Up/Getting Started)

**What We're Improving:**

#### **Layout Restructure:**

```tsx
// BEFORE: Everything in CardHeader + CardContent (cramped, confusing hierarchy)
<Card>
  <CardHeader>
    Profile + Welcome + Score + Badge (all in one row)
  </CardHeader>
  <CardContent>
    Progress Ring + Breakdown (hidden by default)
  </CardContent>
</Card>

// AFTER: Better visual hierarchy with distinct sections
<Card className="overflow-hidden border-l-4 border-orange-500">
  {/* TOP SECTION: Welcome + Profile */}
  <CardHeader className="bg-gradient-to-r from-orange-50 to-white pb-4">
    <div className="flex items-center gap-4">
      <Avatar size="lg" /> {/* 64px on mobile, 80px on desktop */}
      <div className="flex-1">
        <h1>Welcome back, {firstName}! 👋</h1>
        <p className="text-muted-foreground">{lastActivity}</p>
      </div>
    </div>
  </CardHeader>

  {/* MIDDLE SECTION: Career Readiness Hero */}
  <CardContent className="py-6">
    <div className="flex items-center gap-6">
      {/* Progress Ring - Always Visible */}
      <div className="flex-shrink-0">
        <ProgressRing value={67} size="xl" />
        <p className="text-center mt-2 text-sm">Career Ready</p>
      </div>

      {/* Metrics Grid - Always Show Top 4 */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        <MetricCard label="Assessments" value="85%" status="good" />
        <MetricCard label="Research" value="45%" status="warning" />
        <MetricCard label="Exploration" value="60%" status="neutral" />
        <MetricCard label="Actions" value="70%" status="good" />
      </div>
    </div>
  </CardContent>

  {/* BOTTOM SECTION: Quick Stats */}
  <CardFooter className="bg-slate-50 border-t">
    <div className="flex items-center justify-between w-full text-sm">
      <span>Profile: {profileCompletion}%</span>
      <span>Streak: 5 days 🔥</span>
      <Button variant="ghost" size="sm">View Details →</Button>
    </div>
  </CardFooter>
</Card>
```

#### **Specific Code Changes:**

**File:** `frontend/src/components/dashboard/StudentDashboard.tsx`

**Change 1: Remove gradient background, add accent border**
```tsx
// Line 168 - BEFORE:
<Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50/30">

// Line 168 - AFTER:
<Card className="overflow-hidden border-l-4 border-orange-500 shadow-sm">
```

**Change 2: Enhance header with background color**
```tsx
// Line 169 - BEFORE:
<CardHeader className="pb-4">

// Line 169 - AFTER:
<CardHeader className="bg-gradient-to-r from-orange-50/50 to-white pb-4 border-b">
```

**Change 3: Increase profile picture size**
```tsx
// Line 176-177 - BEFORE:
<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-orange-200 bg-orange-100 animate-pulse" />

// Line 176-177 - AFTER:
<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-300 bg-orange-100 animate-pulse" />
```

**Change 4: Improve welcome message typography**
```tsx
// Line 192-193 - BEFORE:
<h1 className="text-lg sm:text-xl font-bold text-slate-800 mb-0.5 truncate">
  Welcome back, {userData?.firstName || 'Student'}! 👋
</h1>

// Line 192-193 - AFTER:
<h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 truncate">
  Welcome back, {userData?.firstName || 'Student'}! 👋
</h1>
```

**Change 5: Always show breakdown metrics (remove collapsible)**
```tsx
// Lines 233-287 - BEFORE:
<div className="flex flex-col sm:flex-row items-stretch gap-4">
  <div className="flex-shrink-0 w-full sm:w-48 lg:w-56 bg-white rounded-lg p-3">
    {/* Progress Ring */}
  </div>
  <div className="flex-1 bg-white rounded-lg p-3">
    {/* Summary + Toggle Button */}
    <div className={`${showBreakdown ? 'max-h-[1000px]' : 'max-h-0 overflow-hidden'}`}>
      {/* 4 metrics grid - HIDDEN BY DEFAULT */}
    </div>
  </div>
</div>

// Lines 233-287 - AFTER:
<div className="flex flex-col sm:flex-row items-center gap-6">
  {/* Progress Ring - Larger, More Prominent */}
  <div className="flex-shrink-0">
    <div className="relative">
      <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 36 36">
        {/* ... existing SVG code ... */}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl sm:text-5xl font-bold text-orange-600">
          {careerReadinessScore.overall}%
        </div>
        <div className="text-sm text-muted-foreground mt-1">Ready</div>
      </div>
    </div>
  </div>

  {/* 4 Metrics - ALWAYS VISIBLE */}
  <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">Assessments</span>
        <span className="text-lg font-bold text-slate-900">
          {careerReadinessScore.breakdown.assessmentCompletion}%
        </span>
      </div>
      <Progress value={careerReadinessScore.breakdown.assessmentCompletion} className="h-2" />
    </div>
    
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">Research</span>
        <span className="text-lg font-bold text-slate-900">
          {careerReadinessScore.breakdown.careerResearch}%
        </span>
      </div>
      <Progress value={careerReadinessScore.breakdown.careerResearch} className="h-2" />
    </div>
    
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">Exploration</span>
        <span className="text-lg font-bold text-slate-900">
          {careerReadinessScore.breakdown.courseExploration}%
        </span>
      </div>
      <Progress value={careerReadinessScore.breakdown.courseExploration} className="h-2" />
    </div>
    
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">Actions</span>
        <span className="text-lg font-bold text-slate-900">
          {careerReadinessScore.breakdown.actionsTaken}%
        </span>
      </div>
      <Progress value={careerReadinessScore.breakdown.actionsTaken} className="h-2" />
    </div>
  </div>
</div>
```

**Change 6: Add footer with quick stats**
```tsx
// NEW: Add after CardContent closing tag (around line 288)
<CardFooter className="bg-slate-50/50 border-t border-slate-200 py-3">
  <div className="flex items-center justify-between w-full text-sm">
    <div className="flex items-center gap-1 text-muted-foreground">
      <User className="w-4 h-4" />
      <span>Profile: {userData?.profileCompletion || 0}% complete</span>
    </div>
    
    {userActivities && userActivities.length > 0 && (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Activity className="w-4 h-4" />
        <span>Active {userActivities.length} days 🔥</span>
      </div>
    )}
    
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => window.location.href = '/dashboard?tab=progress'}
      className="text-orange-600 hover:text-orange-700"
    >
      View Full Details →
    </Button>
  </div>
</CardFooter>
```

**Benefits:**
✅ **Reuses existing code** - Profile picture, welcome, progress ring already implemented  
✅ **Better hierarchy** - Welcome section separated from metrics  
✅ **Always visible metrics** - No hidden/collapsible UI  
✅ **Cleaner design** - Solid backgrounds instead of heavy gradients  
✅ **More context** - Footer shows profile completion and activity streak  
✅ **Mobile optimized** - Stacks vertically, larger touch targets

---

### **2. Urgent Actions Priority Section (NEW)**

**Component:** `DashboardUrgentActions.tsx`

```tsx
// PROPOSED: Smart filtering with visual priority
const urgentCards = cards
  .filter(card => card.urgency === 'high' || card.urgency === 'medium')
  .sort((a, b) => {
    // Sort: high > medium, then by deadline
    if (a.urgency === b.urgency) {
      return (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0);
    }
    return a.urgency === 'high' ? -1 : 1;
  })
  .slice(0, 3); // Max 3 urgent items

<div className="space-y-3">
  <h3 className="flex items-center gap-2 text-lg font-semibold">
    <AlertCircle className="w-5 h-5 text-orange-600" />
    Action Required
    <Badge variant="destructive">{urgentCards.length}</Badge>
  </h3>

  {urgentCards.map(card => (
    <Card 
      key={card.id} 
      className={cn(
        "border-l-4 transition-all hover:shadow-lg cursor-pointer",
        card.urgency === 'high' 
          ? "border-red-500 bg-red-50/30" 
          : "border-orange-500 bg-orange-50/30"
      )}
      onClick={() => navigate(card.actionUrl)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {card.urgency === 'high' ? 
            <Clock className="w-5 h-5 text-red-600" /> : 
            <AlertCircle className="w-5 h-5 text-orange-600" />
          }
          <div>
            <p className="font-semibold">{card.title}</p>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>
        </div>
        <Button size="sm" className="min-h-[44px]">
          {card.actionText}
        </Button>
      </CardContent>
    </Card>
  ))}
</div>
```

**Benefits:**
✅ Critical items surface automatically  
✅ Color-coded priority (red=urgent, orange=soon)  
✅ One-tap action for each item  
✅ Mobile: Full-width cards, 48px touch targets

---

### **3. Enhanced Card Grid**

**File:** `frontend/src/components/cards/UnifiedCardGrid.tsx`

#### **Change 1: Add Inline Metrics Display**

```tsx
// BEFORE: Metric only visible on hover or click
<CardFooter>
  <Button>View Details</Button>
</CardFooter>

// AFTER: Metric always visible
<CardContent className="flex-1">
  <CardDescription>{card.description}</CardDescription>
  
  {/* NEW: Inline metric display */}
  {card.metric && (
    <div className="mt-4 flex items-baseline gap-2">
      <span className="text-3xl font-bold text-orange-600">
        {card.metric.value}
      </span>
      <span className="text-sm text-muted-foreground">
        {card.metric.label}
      </span>
    </div>
  )}
  
  {/* Progress bar for percentage metrics */}
  {card.metric?.value?.includes?.('%') && (
    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
        style={{ width: card.metric.value }}
      />
    </div>
  )}
</CardContent>
```

#### **Change 2: Improved Mobile Touch Feedback**

```tsx
// BEFORE: Generic hover state
className="hover:shadow-xl hover:scale-[1.02]"

// AFTER: Platform-aware feedback
className={cn(
  "transition-all duration-200",
  // Desktop: Hover effects
  "hover:shadow-xl hover:scale-[1.02]",
  // Mobile: Active/pressed state
  "active:scale-[0.97] active:shadow-inner",
  // Touch-friendly minimum height
  "min-h-[120px]"
)}
```

#### **Change 3: Skeleton Loading States**

```tsx
// NEW: Add to UnifiedCardGrid while loading
{loading && (
  <div className={gridClasses}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="space-y-3">
          <Skeleton className="h-12 w-12 rounded-xl" /> {/* Icon */}
          <Skeleton className="h-6 w-3/4" />            {/* Title */}
          <Skeleton className="h-4 w-full" />           {/* Description */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-20" />            {/* Metric */}
        </CardContent>
      </Card>
    ))}
  </div>
)}
```

---

### **4. Smart Card Sorting**

**File:** `frontend/src/hooks/useDynamicCards.ts`

```typescript
// AFTER: Sort cards by priority before returning
const generateDashboardCards = async (): Promise<DashboardCard[]> => {
  // ... existing card generation logic ...

  // NEW: Smart sorting
  const sortedCards = cards.sort((a, b) => {
    // 1. Urgency priority
    const urgencyWeight = { high: 3, medium: 2, low: 1 };
    const aWeight = urgencyWeight[a.urgency || 'low'];
    const bWeight = urgencyWeight[b.urgency || 'low'];
    
    if (aWeight !== bWeight) {
      return bWeight - aWeight; // High urgency first
    }

    // 2. Deadline proximity
    if (a.deadline && b.deadline) {
      return a.deadline.getTime() - b.deadline.getTime();
    }

    // 3. Metric completeness (show incomplete items first)
    if (a.metric?.value?.includes?.('%') && b.metric?.value?.includes?.('%')) {
      const aPercent = parseInt(a.metric.value);
      const bPercent = parseInt(b.metric.value);
      return aPercent - bPercent; // Lower percentages first
    }

    return 0;
  });

  return sortedCards;
};
```

---

### **5. Enhanced Mobile Layout**

**File:** `frontend/src/components/cards/StudentDashboardCardsV2.tsx`

```tsx
// AFTER: Add mobile-optimized layout
export const StudentDashboardCardsV2: React.FC<StudentDashboardCardsV2Props> = ({
  className,
  maxCards = 6
}) => {
  const { cards, loading, error, refreshCards } = useDynamicCards({
    variant: 'dashboard',
    maxCards
  });

  const [showAllCards, setShowAllCards] = useState(false);
  const isMobile = window.innerWidth < 768;

  // Mobile: Show 3 cards + "View All" button
  const displayedCards = isMobile && !showAllCards 
    ? cards.slice(0, 3) 
    : cards;

  return (
    <div className="space-y-6">
      {/* NEW: Hero KPI Section */}
      <DashboardHeroKPI />

      {/* NEW: Urgent Actions Section */}
      <DashboardUrgentActions cards={cards} />

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Progress</h2>
        {isMobile && !showAllCards && cards.length > 3 && (
          <Button 
            variant="ghost" 
            onClick={() => setShowAllCards(true)}
            className="text-orange-600"
          >
            View All {cards.length} →
          </Button>
        )}
      </div>

      {/* Enhanced Card Grid */}
      <UnifiedCardGrid
        cards={displayedCards}
        variant="dashboard"
        maxCards={maxCards}
        className={className}
        activityPrefix="dashboard_"
      />
    </div>
  );
};
```

---

## 📊 Visual Design Improvements

### **Color System Updates**

```css
/* BEFORE: Heavy gradient usage */
.hero { background: linear-gradient(to-br, from-white to-orange-50/30); }
.card { background: linear-gradient(to-r, from-orange-500 to-orange-400); }

/* AFTER: Solid backgrounds with accent borders */
.hero { 
  background: white; 
  border-left: 4px solid rgb(249, 115, 22); /* orange-500 */
}
.card { 
  background: white;
  border-left: 2px solid rgb(249, 115, 22);
}
.card:hover {
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.1);
}
```

### **Typography Enhancements**

```tsx
// BEFORE: Responsive text jumps
className="text-lg sm:text-xl"

// AFTER: Fluid typography
className="text-[clamp(1rem,2.5vw,1.25rem)]"

// Metrics: Larger, bolder
<span className="text-4xl font-bold tracking-tight">67%</span>

// Labels: Smaller, muted
<span className="text-sm text-muted-foreground uppercase tracking-wide">Ready</span>
```

### **Spacing & Layout**

```tsx
// Consistent spacing scale
<div className="space-y-6">        {/* Section gaps */}
  <div className="space-y-4">      {/* Component gaps */}
    <div className="space-y-2">    {/* Element gaps */}
    </div>
  </div>
</div>

// Card padding (mobile-first)
<CardContent className="p-4 sm:p-6"> {/* 16px mobile, 24px desktop */}
```

---

## 🚀 Performance Optimizations

### **1. Lazy Loading for Below-Fold Cards**

```tsx
import { lazy, Suspense } from 'react';

const BelowFoldCards = lazy(() => import('./BelowFoldCards'));

<Suspense fallback={<CardSkeleton count={3} />}>
  <BelowFoldCards cards={cards.slice(3)} />
</Suspense>
```

### **2. Optimistic UI Updates**

```typescript
// When user clicks card action, show loading state immediately
const handleCardClick = async (card: DashboardCard) => {
  // Optimistic update
  setCards(prev => prev.map(c => 
    c.id === card.id ? { ...c, loading: true } : c
  ));

  try {
    await navigateAndTrack(card.actionUrl);
  } catch (error) {
    // Rollback on error
    setCards(prev => prev.map(c => 
      c.id === card.id ? { ...c, loading: false } : c
    ));
  }
};
```

### **3. Image Optimization**

```tsx
// Preload critical images
<link rel="preload" as="image" href="/assets/career-badge.svg" />

// Lazy load non-critical images
<img 
  src={card.image} 
  loading="lazy" 
  decoding="async"
  className="object-cover"
/>
```

---

## 📱 Responsive Breakpoints

```typescript
// Mobile-first breakpoints
const breakpoints = {
  sm: '640px',   // Small phones
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large screens
};

// Grid layout per breakpoint
<div className={cn(
  "grid gap-4",
  "grid-cols-1",           // Mobile: Single column
  "sm:grid-cols-2",        // Tablet: 2 columns
  "lg:grid-cols-3",        // Desktop: 3 columns
  "xl:gap-6"               // Large: Bigger gaps
)} />
```

---

## 🎯 Implementation Priority

### **Phase 1: Critical (Week 1)**
- [ ] Hero KPI Section component
- [ ] Urgent Actions filtering & display
- [ ] Card sorting algorithm
- [ ] Inline metrics in cards

### **Phase 2: Enhancement (Week 2)**
- [ ] Skeleton loading states
- [ ] Mobile "View All" toggle
- [ ] Enhanced touch feedback
- [ ] Progress bars for percentage metrics

### **Phase 3: Polish (Week 3)**
- [ ] Lazy loading below-fold content
- [ ] Optimistic UI updates
- [ ] Image optimization
- [ ] Animation refinements

---

## 📈 Expected Outcomes

### **User Experience**
✅ **30% faster** to critical information (readiness score)  
✅ **2 fewer clicks** to access urgent actions  
✅ **Better mobile experience** with progressive disclosure  
✅ **Clearer visual hierarchy** guides user attention

### **Technical**
✅ **Reduced initial render** by lazy loading  
✅ **Better accessibility** with ARIA labels on hero section  
✅ **Maintainable code** with separated concerns (Hero, Urgent, Grid)

### **Business**
✅ **Higher engagement** with personalized urgent actions  
✅ **Better conversion** to premium (visible progress tracking)  
✅ **Reduced support** tickets (clearer guidance)

---

## 🔍 Testing Checklist

- [ ] Mobile (375px): Hero stacks vertically
- [ ] Tablet (768px): 2-column grid
- [ ] Desktop (1280px): 3-column grid with hero
- [ ] Touch targets: Minimum 44px (iOS), 48px (Android)
- [ ] Keyboard navigation: Tab through cards
- [ ] Screen reader: Hero metrics announced
- [ ] Loading state: Skeleton matches final layout
- [ ] Error state: Retry button functional
- [ ] Empty state: Friendly message + CTA

---

## 📝 Code Review Guidelines

**Before merging, verify:**
1. ✅ No layout shift during loading (CLS < 0.1)
2. ✅ Cards load in <800ms on 3G
3. ✅ Touch targets meet WCAG AAA (48px minimum)
4. ✅ Color contrast ratio ≥ 4.5:1 for all text
5. ✅ TypeScript types updated for new components
6. ✅ Unit tests for sorting algorithm
7. ✅ Integration test for hero KPI component

---

## 🎨 Design Mockups (WITH PROFILE PICTURE)

### Desktop (1280px)
```
┌─────────────────────────────────────────────────────────────────┐
│  NAV                                                             │
├─────────────────────────────────────────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━ HERO CARD ━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ 📸 Profile Section (Light Orange Background)                ┃ │
│  ┃ ┌────┐                                                       ┃ │
│  ┃ │ 👤 │  Welcome back, Sarah! 👋                            ┃ │
│  ┃ │ 80x│  Last active 2 hours ago: working on Career Discovery┃ │
│  ┃ │ 80px                                                      ┃ │
│  ┃ └────┘                                                       ┃ │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫ │
│  ┃ 🎯 Career Readiness Section                                 ┃ │
│  ┃                                                               ┃ │
│  ┃  ⭕ 67%       ┌─────────┬─────────┐                         ┃ │
│  ┃   Ready      │Assess 85│Research │                         ┃ │
│  ┃              │━━━━━━░  │45%      │                         ┃ │
│  ┃              ├─────────┼─────────┤                         ┃ │
│  ┃              │Explore  │Actions  │                         ┃ │
│  ┃              │60%      │70%      │                         ┃ │
│  ┃              └─────────┴─────────┘                         ┃ │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫ │
│  ┃ 📊 Quick Stats (Footer)                                     ┃ │
│  ┃ Profile: 75%  |  Streak: 5 days 🔥  |  [View Details →]    ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
├─────────────────────────────────────────────────────────────────┤
│  ⚡ ACTION REQUIRED (2)                                          │
│  ┌─────────────────────────┐ ┌─────────────────────────┐        │
│  │🔴 KUCCPS - 7 days       │ │🟡 Complete Skills Test  │        │
│  │Apply now for university │ │Unlock career matches    │        │
│  │[Apply Now]              │ │[Start Test]             │        │
│  └─────────────────────────┘ └─────────────────────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  📊 YOUR PROGRESS                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │University│ │Scholars. │ │Career    │                         │
│  │🎓 3 progs│ │💰 5 match│ │RIASEC ✓  │                         │
│  │━━━━░░ 60%│ │━━━━━░ 80%│ │Complete  │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │Session   │ │Goals     │ │Activity  │                         │
│  │📅 Nov 2  │ │🎯 3 set  │ │🔥 5 days │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌──────────────────────┐
│  NAV                 │
├──────────────────────┤
│ ┏━━━ HERO CARD ━━━┓ │
│ ┃ Profile Section  ┃ │
│ ┃ ┌───┐            ┃ │
│ ┃ │👤 │ Welcome    ┃ │
│ ┃ │64 │ Sarah! 👋  ┃ │
│ ┃ │px │            ┃ │
│ ┃ └───┘ Last active┃ │
│ ┃       2h ago     ┃ │
│ ┣━━━━━━━━━━━━━━━━━━┫ │
│ ┃                  ┃ │
│ ┃      ⭕ 67%     ┃ │
│ ┃    Career Ready  ┃ │
│ ┃                  ┃ │
│ ┃ ┌──────┬──────┐  ┃ │
│ ┃ │Assess│Research│ ┃ │
│ ┃ │85%✓ │45% ⚠  │ ┃ │
│ ┃ ├──────┼──────┤  ┃ │
│ ┃ │Explor│Actions│ ┃ │
│ ┃ │60%  │70%    │ ┃ │
│ ┃ └──────┴──────┘  ┃ │
│ ┣━━━━━━━━━━━━━━━━━━┫ │
│ ┃ Profile: 75%     ┃ │
│ ┃ Streak: 5 🔥     ┃ │
│ ┃ [View Details →] ┃ │
│ ┗━━━━━━━━━━━━━━━━━━┛ │
├──────────────────────┤
│ ⚡ URGENT (2)        │
│                      │
│ 🔴 KUCCPS - 7 days   │
│ Apply for university │
│ [Apply Now]          │
│                      │
│ 🟡 Skills Assessment │
│ Unlock career paths  │
│ [Start Test]         │
├──────────────────────┤
│ 📊 YOUR PROGRESS     │
│                      │
│ ┌──────────────────┐ │
│ │ University 🎓    │ │
│ │ 3 programs       │ │
│ │ ━━━━░░ 60%      │ │
│ │ [Explore]        │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ Scholarships 💰  │ │
│ │ 5 matches        │ │
│ │ ━━━━━░ 80%     │ │
│ │ [View All]       │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ Career Profile   │ │
│ │ RIASEC Complete✓ │ │
│ │ [View Results]   │ │
│ └──────────────────┘ │
│                      │
│ [View All 6 Cards →] │
└──────────────────────┘
```

---

## 🚀 Ready to Implement?

**Estimated Effort:** 3 weeks (1 developer)  
**Dependencies:** None (uses existing shadcn components)  
**Risk Level:** Low (additive changes, no breaking updates)

Next Steps:
1. Review this proposal
2. Approve Phase 1 components
3. Create feature branch: `feature/dashboard-ui-improvements`
4. Implement Hero KPI section first (highest impact)
5. Deploy to staging for user testing
