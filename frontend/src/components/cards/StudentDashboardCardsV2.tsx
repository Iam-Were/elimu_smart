/**
 * StudentDashboardCards V2 - Mobile-Optimized Unified Card System
 *
 * BEFORE: 523 lines with custom card rendering logic
 * AFTER: ~100 lines using UnifiedCardGrid + useDynamicCards
 *
 * Mobile Features:
 * - WCAG AAA touch targets (48px minimum)
 * - Responsive text sizing (mobile-first)
 * - Active states for touch devices
 * - Dynamic backend-driven cards
 *
 * Dynamic Cards:
 * - Career Readiness Score (from backend calculation)
 * - University Placement (KUCCPS data)
 * - Scholarship Matches (personalized)
 * - Assessment Progress (completion tracking)
 * - Upcoming Deadlines (KUCCPS timeline)
 */

import React from 'react';
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { Loader2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';

interface StudentDashboardCardsV2Props {
  className?: string;
  maxCards?: number;
}

export const StudentDashboardCardsV2: React.FC<StudentDashboardCardsV2Props> = ({
  className,
  maxCards = 6
}) => {
  // Use unified hook to fetch dashboard cards
  const { cards, loading, error, refreshCards } = useDynamicCards({
    variant: 'dashboard',
    maxCards
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-sm sm:text-base text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 text-sm sm:text-base mb-4">Failed to load dashboard</p>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">{error}</p>
        <Button
          onClick={refreshCards}
          className="min-h-[48px] bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          No dashboard data available
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Complete your profile and assessments to see personalized insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Your Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Track your progress and next steps
        </p>
      </div>

      {/* Unified Card Grid (Dynamic Backend Data) */}
      <UnifiedCardGrid
        cards={cards}
        variant="dashboard"
        maxCards={maxCards}
        className={className}
        activityPrefix="dashboard_"
      />
    </div>
  );
};

export default StudentDashboardCardsV2;
