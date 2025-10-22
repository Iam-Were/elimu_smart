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
import { Separator } from '@/components/ui/separator';
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
  const gridClasses = cn(
    'grid gap-4 sm:gap-6',
    variant === 'dashboard' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(280px,auto)]',
    variant === 'assessment' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(300px,auto)]',
    variant === 'guidance' && 'grid-cols-1 md:grid-cols-2 auto-rows-[minmax(250px,auto)]',
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
            'group relative overflow-hidden transition-all duration-300',
            'hover:shadow-xl hover:scale-[1.02]', // Desktop hover
            'active:scale-[0.98] active:shadow-lg', // Mobile touch feedback
            'rowSpan' in card && card.rowSpan === 2 && 'row-span-2'
          )}
        >
          <CardHeader className="space-y-3 sm:space-y-4">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              {/* Gradient Icon Container (2025 Best Practice) */}
              <div
                className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110',
                  `bg-gradient-to-br ${card.iconGradient}`,
                  '[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 [&>svg]:text-white'
                )}
              >
                {card.icon}
              </div>

              {/* Badge (uses CORRECTED shadcn variants) */}
              {'badge' in card && card.badge && (
                <Badge variant={card.badge.variant || 'default'} className="text-[10px] sm:text-xs">
                  {card.badge.text}
                </Badge>
              )}

              {/* Premium Lock Icon */}
              {'isPremium' in card && card.isPremium && (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              )}
            </div>

            {/* Card Title & Description */}
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
            {/* Assessment-Specific Content */}
            {'assessmentType' in card && (
              <>
                {/* Duration & Questions */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{(card as AssessmentCard).duration}</span>
                  {(card as AssessmentCard).questions > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span>{(card as AssessmentCard).questions} questions</span>
                    </>
                  )}
                </div>

                {/* Progress Bar (CORRECTED: Custom div instead of shadcn Progress) */}
                {(card as AssessmentCard).completionStatus && (
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {(card as AssessmentCard).completionStatus?.progress || 0}%
                      </span>
                    </div>
                    {/* Custom progress bar with orange gradient (student theme) */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full transition-all bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{
                          width: `${(card as AssessmentCard).completionStatus?.progress || 0}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Benefit Statement */}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {(card as AssessmentCard).benefit}
                </p>
              </>
            )}

            {/* Guidance-Specific Content */}
            {'serviceType' in card && (card as GuidanceCard).features && (
              <>
                {/* Features List (Max 3) */}
                <ul className="space-y-1 sm:space-y-2">
                  {(card as GuidanceCard).features.slice(0, 3).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                    >
                      <span className="text-orange-600 mt-0.5">"</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Response Time */}
                {(card as GuidanceCard).responseTime && (
                  <p className="text-xs text-muted-foreground">
                    Response time: {(card as GuidanceCard).responseTime}
                  </p>
                )}
              </>
            )}

            {/* Dashboard-Specific Content */}
            {'metric' in card && (card as DashboardCard).metric && (
              <div className="p-3 sm:p-4 rounded-lg bg-muted">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  {(card as DashboardCard).metric?.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {(card as DashboardCard).metric?.value}
                </p>
              </div>
            )}
          </CardContent>

          {/* Card Footer with CTA Button */}
          <CardFooter>
            <Button
              onClick={() => handleCardClick(card.id, card.actionUrl, card.title)}
              className={cn(
                'w-full text-xs sm:text-sm min-h-[48px]', // WCAG AAA touch target
                'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white'
              )}
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
