# Phase 2 shadcn Pattern Corrections

**Date:** 2025-10-21
**Critical:** Read this BEFORE starting Phase 2
**Purpose:** Fix shadcn compatibility issues in HANDOFF_PHASE2_PHASE3.md

---

## ✅ Good News: Most Patterns Are Correct

After auditing the current codebase, the Phase 2 plan is **95% compatible** with shadcn patterns. Only 2 corrections needed.

### Verified shadcn Patterns (Already Correct):

1. **Button Import** ✅
   ```typescript
   import Button from '@/components/ui/button';  // ✅ CORRECT - default export
   ```

2. **Badge Import** ✅
   ```typescript
   import { Badge } from '@/components/ui/badge';  // ✅ CORRECT - named export
   ```

3. **Badge Variants** ✅
   Available in `badge-variants.ts`:
   - `default` - primary color
   - `secondary` - secondary color
   - `destructive` - red
   - `outline` - transparent with border
   - `success` - green
   - `warning` - yellow
   - `info` - blue

4. **Card Components** ✅
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
   ```

5. **Separator** ✅
   ```typescript
   import { Separator } from '@/components/ui/separator';
   // Supports orientation="vertical" and orientation="horizontal"
   ```

---

## 🔧 Required Corrections

### Correction 1: Progress Component Usage (CRITICAL)

**Problem in HANDOFF_PHASE2_PHASE3.md:**

Task 2.4 (line 421, 517) suggests using the shadcn Progress component:
```typescript
import { Progress } from '@/components/ui/progress';

{card.completionStatus && (
  <Progress value={card.completionStatus.progress || 0} className="h-2" />
)}
```

**Issue:** Progress component has hardcoded `bg-primary` color and doesn't accept custom color classes. We need orange progress bars to match the student theme.

**✅ CORRECTED Implementation for Task 2.4:**

```typescript
// DON'T import Progress at all
// Remove from imports: import { Progress } from '@/components/ui/progress';

// In UnifiedCardGrid.tsx - Replace Progress with custom div:
{card.completionStatus && (
  <div className="space-y-1 sm:space-y-2">
    <div className="flex items-center justify-between text-xs sm:text-sm">
      <span className="text-muted-foreground">Progress</span>
      <span className="font-medium">{card.completionStatus.progress || 0}%</span>
    </div>
    {/* Custom progress bar with orange gradient */}
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        className="h-full transition-all bg-gradient-to-r from-orange-500 to-orange-600"
        style={{ width: `${card.completionStatus.progress || 0}%` }}
      />
    </div>
  </div>
)}
```

**Why:** This matches the pattern we established in ProgressMetrics.tsx (Task 1.4). Custom div gives us:
- Orange gradient (student theme color)
- Full width control via inline style
- Dark mode support
- Smooth transitions

---

### Correction 2: Badge Variant Names

**Problem in HANDOFF_PHASE2_PHASE3.md:**

Task 2.1 CardInterfaces.ts suggests non-existent badge variants:
```typescript
// Guidance card interface (WRONG):
badge?: {
  text: string;
  variant: 'default' | 'premium' | 'free';  // ❌ 'premium' and 'free' DON'T exist
}
```

**✅ CORRECTED CardInterfaces.ts (Task 2.1):**

```typescript
// In BaseCard interface (or specific card interfaces):
badge?: {
  text: string;
  variant: 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' | 'outline';
};
```

**Badge Color Mapping for Cards:**

| Service Type | Badge Variant | Visual Color | Use Case |
|--------------|---------------|--------------|----------|
| Free services | `success` | Green | Free guidance services |
| Premium services | `warning` | Yellow/Gold | Premium guidance services |
| Standard services | `info` | Blue | Regular services |
| Urgent/Critical | `destructive` | Red | Urgent actions |
| Completed | `success` | Green | Completed assessments |
| In Progress | `secondary` | Gray | Partial progress |
| New | `default` | Orange | New/unstarted |

**Example Usage in Task 2.7 (StudentGuidanceCards):**

```typescript
const guidanceCards: GuidanceCard[] = [
  {
    id: 'community-qa',
    title: 'Community Q&A',
    // ... other props
    isPremium: false,
    badge: {
      text: 'Free',
      variant: 'success'  // ✅ Green badge for free services
    }
  },
  {
    id: 'premium-inbox',
    title: 'Message Counselor',
    // ... other props
    isPremium: true,
    badge: {
      text: 'Premium',
      variant: 'warning'  // ✅ Yellow/gold badge for premium
    }
  }
];
```

---

## 📋 Updated Task 2.4 Implementation

**Complete corrected UnifiedCardGrid.tsx:**

```typescript
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';  // ✅ No Progress import
import { ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardNavigation } from '@/hooks/useCardNavigation';
import type { AssessmentCard, GuidanceCard, DashboardCard } from '@/types/CardInterfaces';

interface UnifiedCardGridProps {
  cards: (AssessmentCard | GuidanceCard | DashboardCard)[];
  variant: 'dashboard' | 'assessment' | 'guidance';
  maxCards?: number;
  className?: string;
  activityPrefix?: string;
}

export const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards,
  variant,
  maxCards,
  className,
  activityPrefix = `${variant}_`
}) => {
  const { handleCardClick } = useCardNavigation({ activityPrefix });

  const gridClasses = cn(
    "grid gap-4 sm:gap-6",
    variant === 'dashboard' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(280px,auto)]",
    variant === 'assessment' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(300px,auto)]",
    variant === 'guidance' && "grid-cols-1 md:grid-cols-2 auto-rows-[minmax(250px,auto)]",
    className
  );

  return (
    <div className={gridClasses}>
      {cards.slice(0, maxCards).map((card) => (
        <Card
          key={card.id}
          className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
            'rowSpan' in card && card.rowSpan === 2 && "row-span-2"
          )}
        >
          <CardHeader className="space-y-3 sm:space-y-4">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              {/* Gradient Icon Container */}
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                `bg-gradient-to-br ${card.iconGradient}`,
                "[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 [&>svg]:text-white"
              )}>
                {card.icon}
              </div>

              {/* Badge */}
              {'badge' in card && card.badge && (
                <Badge
                  variant={card.badge.variant || 'default'}
                  className="text-[10px] sm:text-xs"
                >
                  {card.badge.text}
                </Badge>
              )}

              {/* Premium Lock */}
              {'isPremium' in card && card.isPremium && (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              )}
            </div>

            <div>
              <CardTitle className="text-base sm:text-lg font-bold line-clamp-2">
                {card.title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2">
                {card.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4">
            {/* Assessment-specific content */}
            {'assessmentType' in card && (
              <>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{card.duration}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{card.questions} questions</span>
                </div>

                {card.completionStatus && (
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{card.completionStatus.progress || 0}%</span>
                    </div>
                    {/* ✅ CORRECTED: Custom progress bar instead of Progress component */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full transition-all bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{ width: `${card.completionStatus.progress || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-muted-foreground">
                  {card.benefit}
                </p>
              </>
            )}

            {/* Guidance-specific content */}
            {'serviceType' in card && card.features && (
              <ul className="space-y-1 sm:space-y-2">
                {card.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Dashboard-specific content */}
            {'metric' in card && card.metric && (
              <div className="p-3 sm:p-4 rounded-lg bg-muted">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  {card.metric.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {card.metric.value}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => handleCardClick(card.id, card.actionUrl, card.title)}
              className="w-full text-xs sm:text-sm"
              variant="default"
            >
              {card.actionText}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
```

---

## 📋 Checklist for Next Session

Before starting Phase 2, verify:

- [ ] Read this corrections document completely
- [ ] **Task 2.1**: Use corrected Badge variant types (no 'premium' or 'free')
- [ ] **Task 2.4**: Use custom progress div (NO Progress component)
- [ ] **Task 2.4**: Import Button as default export: `import Button from '@/components/ui/button'`
- [ ] **Task 2.4**: Import Badge as named export: `import { Badge } from '@/components/ui/badge'`
- [ ] All other shadcn patterns in HANDOFF document are correct ✅

---

## 🎯 Summary

**Only 2 Corrections Needed:**

1. **Replace Progress component with custom div** (Assessment cards)
2. **Use correct Badge variant names** (success/warning/info instead of premium/free)

**Everything else in the Phase 2 handoff document is shadcn-compatible!** ✅

The patterns are based on:
- Existing card components (StudentAssessmentCards, StudentGuidanceCards, StudentDashboardCards)
- Phase 1 implementations (ProgressMetrics custom progress bars)
- Verified shadcn component APIs

---

**Ready to proceed with Phase 2 using these corrections!** 🚀
