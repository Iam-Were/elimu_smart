/**
 * StudentAssessmentCards V2 - Mobile-Optimized Unified Card System
 *
 * BEFORE: 656 lines with duplicate card rendering logic
 * AFTER: ~150 lines using UnifiedCardGrid + useDynamicCards + mobile optimizations
 *
 * Mobile Features:
 * - Filter chips with horizontal scroll (hide-scrollbar utility)
 * - WCAG AAA touch targets (48px minimum)
 * - Responsive stats grid (2 cols mobile → 4 cols desktop)
 * - Mobile-first active states (instead of hover-only)
 *
 * Migration: Replace StudentAssessmentCards import with StudentAssessmentCardsV2 in Sprint18AssessmentPage.tsx
 */

import React, { useState, useMemo } from 'react';
import AssessmentLoadingSkeleton from '../assessments/AssessmentLoadingSkeleton';
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AssessmentCard } from '@/types/CardInterfaces';

interface StudentAssessmentCardsV2Props {
  className?: string;
  maxCards?: number;
  showAll?: boolean;
}

type FilterType = 'all' | 'not-started' | 'in-progress' | 'completed' | 'priority';

export const StudentAssessmentCardsV2: React.FC<StudentAssessmentCardsV2Props> = ({
  className,
  maxCards,
  showAll = false
}) => {
  // Filter state
  const [filter, setFilter] = useState<FilterType>('all');

  // Use unified hook to fetch assessment cards (returns ALL cards)
  const { cards, loading, error } = useDynamicCards({
    variant: 'assessment'
  });

  // Type guard for AssessmentCard
  const isAssessmentCard = (card: unknown): card is AssessmentCard => {
    return (card as AssessmentCard).cardType === 'assessment';
  };

  // Filter cards based on selected filter
  const filteredCards = useMemo(() => {
    const assessmentCards = cards.filter(isAssessmentCard);

    switch (filter) {
      case 'not-started':
        return assessmentCards.filter(card => !card.completionStatus || card.completionStatus.progress === 0);
      case 'in-progress':
        return assessmentCards.filter(card =>
          card.completionStatus && card.completionStatus.progress > 0 && card.completionStatus.progress < 100
        );
      case 'completed':
        return assessmentCards.filter(card =>
          card.completionStatus && card.completionStatus.progress === 100
        );
      case 'priority':
        return assessmentCards.filter(card => !card.completionStatus || card.completionStatus.progress < 50);
      default:
        return assessmentCards; // 'all'
    }
  }, [cards, filter]);

  // Calculate stats
  const stats = useMemo(() => {
    const assessmentCards = cards.filter(isAssessmentCard);
    const completed = assessmentCards.filter(card =>
      card.completionStatus && card.completionStatus.progress === 100
    ).length;
    const inProgress = assessmentCards.filter(card =>
      card.completionStatus && card.completionStatus.progress > 0 && card.completionStatus.progress < 100
    ).length;
    const notStarted = assessmentCards.filter(card =>
      !card.completionStatus || card.completionStatus.progress === 0
    ).length;

    return {
      total: assessmentCards.length,
      completed,
      inProgress,
      notStarted
    };
  }, [cards]);

  // Loading state
  if (loading) {
    return <AssessmentLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-sm sm:text-base mb-4">Failed to load assessments</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm sm:text-base text-muted-foreground">No assessments available</p>
      </div>
    );
  }

  // Render cards using unified grid with mobile optimizations
  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Mobile-Optimized Filter Chips (Horizontal Scroll) */}
      <div className="overflow-x-auto hide-scrollbar -mx-2 px-2">
        <div className="flex gap-2 min-w-min pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={cn(
              'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
              filter === 'all' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
            )}
          >
            <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            All ({stats.total})
          </Button>

          <Button
            variant={filter === 'not-started' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('not-started')}
            className={cn(
              'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
              filter === 'not-started' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
            )}
          >
            <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Not Started ({stats.notStarted})
          </Button>

          <Button
            variant={filter === 'in-progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('in-progress')}
            className={cn(
              'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
              filter === 'in-progress' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
            )}
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            In Progress ({stats.inProgress})
          </Button>

          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className={cn(
              'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
              filter === 'completed' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
            )}
          >
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Completed ({stats.completed})
          </Button>

          <Button
            variant={filter === 'priority' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('priority')}
            className={cn(
              'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
              filter === 'priority' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
            )}
          >
            Priority
          </Button>
        </div>
      </div>

      {/* Stats Grid (Responsive: 2 cols mobile → 4 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/60 dark:to-orange-900/60 border border-orange-200 dark:border-orange-800">
          <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.total}</p>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/60 dark:to-green-900/60 border border-green-200 dark:border-green-800">
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mb-1">Completed</p>
          <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">{stats.completed}</p>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/60 border border-blue-200 dark:border-blue-800">
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-1">In Progress</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.inProgress}</p>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/60 border border-amber-200 dark:border-amber-800">
          <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mb-1">Not Started</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.notStarted}</p>
        </div>
      </div>

      {/* Unified Card Grid */}
      <UnifiedCardGrid
        cards={showAll ? filteredCards : filteredCards.slice(0, maxCards)}
        variant="assessment"
        className={className}
        activityPrefix="assessment_"
      />

      {/* Empty filter result */}
      {filteredCards.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground">
            No assessments match the current filter
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAssessmentCardsV2;
