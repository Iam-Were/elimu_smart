/**
 * StudentAssessmentCards V2 - Refactored to use unified card system
 *
 * BEFORE: 656 lines with duplicate card rendering logic
 * AFTER: ~60 lines using UnifiedCardGrid + useDynamicCards
 *
 * Migration: Replace StudentAssessmentCards import with StudentAssessmentCardsV2 in Sprint18AssessmentPage.tsx
 */

import React from 'react';
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { Loader2 } from 'lucide-react';

interface StudentAssessmentCardsV2Props {
  className?: string;
  maxCards?: number;
  showAll?: boolean;
}

export const StudentAssessmentCardsV2: React.FC<StudentAssessmentCardsV2Props> = ({
  className,
  maxCards,
  showAll = false
}) => {
  // Use unified hook to fetch assessment cards
  const { cards, loading, error } = useDynamicCards({
    variant: 'assessment',
    maxCards: showAll ? undefined : maxCards
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-muted-foreground">Loading assessments...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load assessments</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No assessments available</p>
      </div>
    );
  }

  // Render cards using unified grid
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Career Assessments
        </h2>
        <p className="text-muted-foreground mt-1">
          Discover your path through scientifically-backed assessments
        </p>
      </div>

      <UnifiedCardGrid
        cards={cards}
        variant="assessment"
        maxCards={showAll ? undefined : maxCards}
        className={className}
        activityPrefix="assessment_"
      />
    </div>
  );
};

export default StudentAssessmentCardsV2;
