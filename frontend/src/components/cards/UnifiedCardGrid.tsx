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
            'group relative overflow-hidden transition-all duration-300',
            'hover:shadow-xl hover:scale-[1.02]', // Desktop hover
            'active:scale-[0.98] active:shadow-lg', // Mobile touch feedback
            'rowSpan' in card && card.rowSpan === 2 && 'row-span-2'
          )}
        >
          {/* Ultra-compact mobile design for Samsung Galaxy S20 Ultra */}
          <CardHeader className="space-y-0.5 sm:space-y-4 md:space-y-6 px-1.5 pt-1.5 pb-0 sm:px-6 sm:pt-8 sm:pb-3 md:px-8 md:pt-10 md:pb-4">
            {/* Badge & Lock Row - Tiny on mobile */}
            <div className="absolute top-0.5 right-0.5 sm:top-3 sm:right-3 md:top-4 md:right-4 flex items-center gap-0.5 sm:gap-2">
              {/* Badge */}
              {'badge' in card && card.badge && (
                <Badge variant={card.badge.variant || 'default'} className="text-[7px] sm:text-[10px] md:text-xs font-medium px-0.5 py-0 sm:px-1.5 md:px-2">
                  {card.badge.text}
                </Badge>
              )}

              {/* Premium Lock Icon */}
              {'isPremium' in card && card.isPremium && (
                <Lock className="w-2 h-2 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-500" />
              )}
            </div>

            {/* Gradient Icon Container - Very compact (24px on mobile) */}
            <div className="flex justify-center">
              <div
                className={cn(
                  'w-6 h-6 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm sm:shadow-lg transition-transform group-hover:scale-110',
                  `bg-gradient-to-br ${card.iconGradient}`,
                  '[&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-7 sm:[&>svg]:h-7 md:[&>svg]:w-8 md:[&>svg]:h-8 [&>svg]:text-white'
                )}
              >
                {card.icon}
              </div>
            </div>

            {/* Card Title & Description - Very compact on mobile */}
            <div className="text-center space-y-0 sm:space-y-1 md:space-y-3">
              <CardTitle className="text-[9px] sm:text-sm md:text-lg lg:text-xl font-bold leading-tight line-clamp-1 sm:line-clamp-2">
                {card.title}
              </CardTitle>
              <CardDescription className="text-[7px] sm:text-xs md:text-sm lg:text-base leading-tight line-clamp-1 sm:line-clamp-2">
                {card.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-0 sm:space-y-2 md:space-y-4 px-1.5 py-0 sm:px-6 sm:py-2 md:px-8">
            {/* Assessment-Specific Content */}
            {'assessmentType' in card && (
              <>
                {/* Duration & Questions - Centered, very small on mobile */}
                <div className="flex items-center justify-center gap-1 sm:gap-3 text-[7px] sm:text-xs md:text-sm text-muted-foreground">
                  <span>{(card as AssessmentCard).duration}</span>
                  {(card as AssessmentCard).questions > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-1.5 sm:h-4" />
                      <span className="hidden sm:inline">{(card as AssessmentCard).questions} questions</span>
                      <span className="sm:hidden">{(card as AssessmentCard).questions}q</span>
                    </>
                  )}
                </div>

                {/* Progress Bar - Very compact on mobile */}
                {(card as AssessmentCard).completionStatus && (
                  <div className="space-y-0 sm:space-y-2">
                    <div className="flex items-center justify-between text-[7px] sm:text-xs md:text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {(card as AssessmentCard).completionStatus?.progress || 0}%
                      </span>
                    </div>
                    {/* Custom progress bar - very thin on mobile */}
                    <div className="relative h-1 sm:h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{
                          width: `${(card as AssessmentCard).completionStatus?.progress || 0}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Benefit Statement - Hidden on mobile for space */}
                <p className="hidden sm:block text-xs sm:text-sm text-center sm:text-left text-muted-foreground leading-relaxed">
                  {(card as AssessmentCard).benefit}
                </p>
              </>
            )}

            {/* Guidance-Specific Content */}
            {'serviceType' in card && (card as GuidanceCard).features && (
              <>
                {/* Features List - Very compact on mobile */}
                <ul className="space-y-0 sm:space-y-2 text-center sm:text-left">
                  {(card as GuidanceCard).features.slice(0, 2).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center sm:justify-start gap-0.5 sm:gap-2 text-[7px] sm:text-xs md:text-sm text-muted-foreground"
                    >
                      <span className="text-green-600 font-bold text-[8px] sm:text-sm">✓</span>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Response Time - Hidden on mobile */}
                {(card as GuidanceCard).responseTime && (
                  <p className="hidden sm:block text-xs text-center sm:text-left text-muted-foreground">
                    Response time: {(card as GuidanceCard).responseTime}
                  </p>
                )}
              </>
            )}

            {/* Dashboard-Specific Content */}
            {'metric' in card && (card as DashboardCard).metric && (
              <div className="p-1 sm:p-3 md:p-4 rounded-md sm:rounded-lg bg-muted">
                <p className="text-[7px] sm:text-xs md:text-sm text-muted-foreground mb-0 sm:mb-1">
                  {(card as DashboardCard).metric?.label}
                </p>
                <p className="text-xs sm:text-xl md:text-2xl font-bold">
                  {(card as DashboardCard).metric?.value}
                </p>
              </div>
            )}
          </CardContent>

          {/* Card Footer with CTA Button - Very compact on mobile */}
          <CardFooter className="px-1.5 pb-1 pt-0 sm:px-6 sm:pb-4 sm:pt-4 md:px-8 md:pb-6 md:pt-8 flex justify-center">
            <Button
              onClick={() => handleCardClick(card.id, card.actionUrl, card.title)}
              className={cn(
                'w-[85%] sm:w-full text-[8px] sm:text-xs md:text-sm lg:text-base font-semibold min-h-[28px] sm:min-h-[44px] md:min-h-[48px] rounded-md sm:rounded-lg', // Ultra-compact on mobile
                'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white',
                'transition-all duration-200 hover:shadow-lg active:scale-[0.98]'
              )}
              variant="default"
            >
              <span className="truncate">{card.actionText}</span>
              <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 ml-0.5 sm:ml-1.5 md:ml-2 transition-transform group-hover:translate-x-1 flex-shrink-0" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
