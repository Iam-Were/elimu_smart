/**
 * StudentGuidanceCards V2 - Mobile-Optimized Unified Card System
 *
 * BEFORE: 304 lines with custom card rendering logic
 * AFTER: ~120 lines using UnifiedCardGrid + useDynamicCards + mobile optimizations
 *
 * Mobile Features:
 * - Filter chips (All, Free, Premium)
 * - WCAG AAA touch targets (48px minimum)
 * - Responsive stats grid (2 cols mobile → 3 cols desktop)
 * - Premium paywall integration
 * - Mobile-first active states
 *
 * Freemium Model:
 * - Free: Community Q&A, Career Resources, Crisis Resources
 * - Premium: Message Counselor, Book Session (requires subscription)
 */

import React, { useState, useMemo } from 'react';
import { UnifiedCardGrid } from './UnifiedCardGrid';
import { useDynamicCards } from '@/hooks/useDynamicCards';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2, Lock, Sparkles, Circle } from 'lucide-react';
import Button from '@/components/ui/button';
import { SubscriptionPaywall } from '@/components/subscription/SubscriptionPaywall';
import { cn } from '@/lib/utils';
import type { GuidanceCard } from '@/types/CardInterfaces';

interface StudentGuidanceCardsV2Props {
  className?: string;
  maxCards?: number;
  showAll?: boolean;
}

type FilterType = 'all' | 'free' | 'premium';

export const StudentGuidanceCardsV2: React.FC<StudentGuidanceCardsV2Props> = ({
  className,
  maxCards,
  showAll = false
}) => {
  // Filter state
  const [filter, setFilter] = useState<FilterType>('all');
  const [showPaywall, setShowPaywall] = useState(false);

  // Subscription status
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();
  const isPremium = userSubscription?.status === 'active';

  // Use unified hook to fetch guidance cards
  const { cards, loading, error } = useDynamicCards({
    variant: 'guidance',
    maxCards: showAll ? undefined : maxCards
  });

  // Type guard for GuidanceCard
  const isGuidanceCard = (card: unknown): card is GuidanceCard => {
    return (card as GuidanceCard).cardType === 'guidance';
  };

  // Filter cards based on selected filter
  const filteredCards = useMemo(() => {
    const guidanceCards = cards.filter(isGuidanceCard);

    switch (filter) {
      case 'free':
        return guidanceCards.filter(card => !card.isPremium);
      case 'premium':
        return guidanceCards.filter(card => card.isPremium);
      default:
        return guidanceCards; // 'all'
    }
  }, [cards, filter]);

  // Calculate stats
  const stats = useMemo(() => {
    const guidanceCards = cards.filter(isGuidanceCard);
    const freeCards = guidanceCards.filter(card => !card.isPremium).length;
    const premiumCards = guidanceCards.filter(card => card.isPremium).length;

    return {
      total: guidanceCards.length,
      free: freeCards,
      premium: premiumCards
    };
  }, [cards]);

  // Loading state
  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-sm sm:text-base text-muted-foreground">Loading guidance services...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-sm sm:text-base mb-4">Failed to load guidance services</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm sm:text-base text-muted-foreground">No guidance services available</p>
      </div>
    );
  }

  return (
    <>
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
              All Services ({stats.total})
            </Button>

            <Button
              variant={filter === 'free' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('free')}
              className={cn(
                'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
                filter === 'free' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
              )}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Free ({stats.free})
            </Button>

            <Button
              variant={filter === 'premium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('premium')}
              className={cn(
                'min-h-[48px] whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4',
                filter === 'premium' && 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
              )}
            >
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Premium ({stats.premium})
            </Button>
          </div>
        </div>

        {/* Stats Grid (Responsive: 2 cols mobile → 3 cols desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Services</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.total}</p>
          </div>

          <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Free Access</p>
            <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">{stats.free}</p>
          </div>

          <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800 col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Premium Features</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">
              {isPremium ? '✓ Active' : stats.premium}
            </p>
          </div>
        </div>

        {/* Premium Status Banner (if not subscribed) */}
        {!isPremium && (
          <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 sm:gap-3">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                  Unlock Premium Features
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  Get 1-on-1 counseling, session booking, and priority support
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowPaywall(true)}
                className="min-h-[44px] text-xs sm:text-sm whitespace-nowrap bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white"
              >
                Upgrade
              </Button>
            </div>
          </div>
        )}

        {/* Unified Card Grid */}
        <UnifiedCardGrid
          cards={filteredCards}
          variant="guidance"
          maxCards={showAll ? undefined : maxCards}
          className={className}
          activityPrefix="guidance_"
        />

        {/* Empty filter result */}
        {filteredCards.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-muted-foreground">
              No services match the current filter
            </p>
          </div>
        )}
      </div>

      {/* Premium Paywall Modal */}
      {showPaywall && (
        <SubscriptionPaywall
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature="premium"
        />
      )}
    </>
  );
};

export default StudentGuidanceCardsV2;
