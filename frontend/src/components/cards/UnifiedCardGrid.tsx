/**
 * UnifiedCardGrid Component
 *
 * Single, reusable card grid for Dashboard, Assessment, and Guidance pages.
 * Replaces 1,485 lines of duplicate code across 3 card components.
 *
 * Key Features:
 * - Type-safe rendering with discriminated unions
 * - shadcn UI components with CORRECTED patterns (custom progress, correct badge variants)
 * - Mobile-first responsive Bento grid layout
 * - Gradient icon containers (2025 best practices)
 * - Micro-interactions (hover scale, smooth transitions)
 *
 * shadcn Compliance:
 *  Custom progress div (NO Progress component - doesn't support custom colors)
 *  Correct Badge variants (success/warning/info - NO premium/free)
 *  Button default export, Card/Badge named exports
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardNavigation } from '@/hooks/useCardNavigation';
import type { AssessmentCard, GuidanceCard, DashboardCard, CardData } from '@/types/CardInterfaces';

interface UnifiedCardGridProps {
  cards: CardData[];
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

  // Bento grid classes based on variant
  // Mobile-first: 1 column on mobile (< 640px), 2 cols on tablet (640px+), 3 cols on desktop (1024px+)
  // Mobile cards optimized for Galaxy S20 Ultra (ultra-compact)
  const gridClasses = cn(
    'grid gap-1.5 sm:gap-4 md:gap-6',
    variant === 'dashboard' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(110px,auto)] sm:auto-rows-[minmax(200px,auto)]',
    variant === 'assessment' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(120px,auto)] sm:auto-rows-[minmax(220px,auto)]',
    variant === 'guidance' && 'grid-cols-1 sm:grid-cols-2 auto-rows-[minmax(100px,auto)] sm:auto-rows-[minmax(180px,auto)]',
    className
  );

  // Slice cards based on maxCards prop
  const displayedCards = maxCards ? cards.slice(0, maxCards) : cards;

  return (
    <div className={gridClasses}>
      {displayedCards.map((card) => (
        <Card
          key={card.id}
          className={cn(
            'group relative overflow-hidden transition-all duration-200',
            'border shadow-sm hover:shadow-md', // Subtle LinkedIn shadow
            'rowSpan' in card && card.rowSpan === 2 && 'row-span-2'
          )}
        >
          {/* Assessment Card: Large Image Hero */}
          {'assessmentType' in card && (
            <>
              {/* Large Hero Image - No border, full width */}
              <div className="w-full h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                <img
                  src={`/design/${card.id}.jpg`}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Card Content - Improved Hierarchy */}
              <CardHeader className="space-y-3 px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
                {/* Badge - Top right corner */}
                <div className="absolute top-2 right-2 z-10">
                  {'badge' in card && card.badge && (
                    <Badge variant={card.badge.variant || 'default'} className="text-xs font-medium px-2 py-0.5">
                      {card.badge.text}
                    </Badge>
                  )}
                </div>

                {/* Title - Prominent */}
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {card.title}
                </CardTitle>

                {/* Duration & Questions - Metadata */}
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="font-medium">{(card as AssessmentCard).duration}</span>
                  {(card as AssessmentCard).questions > 0 && (
                    <>
                      <span>•</span>
                      <span>{(card as AssessmentCard).questions} questions</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <CardDescription className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </>
          )}

          {/* Guidance Card: Original Design with Peer Room Logo */}
          {'serviceType' in card && !('assessmentType' in card) && (
            <CardHeader className="space-y-3 px-4 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              {/* Badge & Lock Row - Top right corner only */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {'badge' in card && card.badge && (
                  <Badge variant={card.badge.variant || 'default'} className="text-xs font-medium px-2 py-0.5">
                    {card.badge.text}
                  </Badge>
                )}
                {'isPremium' in card && card.isPremium && (
                  <Lock className="w-4 h-4 text-amber-600" />
                )}
              </div>

              {/* Icon Container */}
              <div className="flex items-start">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    `bg-gradient-to-br ${card.iconGradient}`,
                    '[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-white'
                  )}
                >
                  {card.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 leading-tight line-clamp-2">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {card.description}
                </CardDescription>
              </div>
            </CardHeader>
          )}

          {/* Dashboard Card: Original Design */}
          {'metric' in card && !('assessmentType' in card) && !('serviceType' in card) && (
            <CardHeader className="space-y-3 px-4 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {'badge' in card && card.badge && (
                  <Badge variant={card.badge.variant || 'default'} className="text-xs font-medium px-2 py-0.5">
                    {card.badge.text}
                  </Badge>
                )}
              </div>

              <div className="flex items-start">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    `bg-gradient-to-br ${card.iconGradient}`,
                    '[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-white'
                  )}
                >
                  {card.icon}
                </div>
              </div>

              <div className="space-y-1.5">
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 leading-tight line-clamp-2">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {card.description}
                </CardDescription>
              </div>
            </CardHeader>
          )}

          <CardContent className="space-y-3 px-4 py-2 sm:px-6 sm:py-3">

            {/* Assessment-Specific Content */}
            {'assessmentType' in card && (
              <>
                {/* Progress Bar - Only if started */}
                {(card as AssessmentCard).completionStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Your Progress</span>
                      <span className="font-bold text-orange-600">
                        {(card as AssessmentCard).completionStatus?.progress || 0}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{
                          width: `${(card as AssessmentCard).completionStatus?.progress || 0}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Guidance-Specific Content */}
            {'serviceType' in card && (
              <>
                {/* Peer Room Image */}
                {card.id === 'community-qa' && (
                  <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mb-3">
                    <img
                      src="/design/peer_room.jpg"
                      alt="Peer Room"
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Features List - Subtle */}
                {(card as GuidanceCard).features && (
                  <ul className="space-y-2">
                    {(card as GuidanceCard).features.slice(0, 2).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <span className="text-green-600 font-medium">✓</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Response Time */}
                {'serviceType' in card && (card as GuidanceCard).responseTime && (
                  <p className="text-sm text-slate-500">
                    Response time: {(card as GuidanceCard).responseTime}
                  </p>
                )}
              </>
            )}

            {/* Dashboard-Specific Content */}
            {'metric' in card && (card as DashboardCard).metric && (
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-600 mb-1">
                  {(card as DashboardCard).metric?.label}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {(card as DashboardCard).metric?.value}
                </p>
              </div>
            )}
          </CardContent>

          {/* Card Footer with CTA Button - Orange student theme */}
          <CardFooter className="px-4 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-3">
            <Button
              onClick={() => handleCardClick(card.id, card.actionUrl, card.title)}
              className={cn(
                'w-full text-sm font-medium min-h-[40px] rounded-md',
                'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
                'transition-colors duration-200'
              )}
              variant="default"
            >
              <span className="truncate">{card.actionText}</span>
              <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
