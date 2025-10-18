import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { IconContainer } from '@/components/ui/icon-container';
import {
  Target,
  GraduationCap,
  Briefcase,
  Move,
  RotateCcw,
  Loader2,
  Trophy,
  Award,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { useGamification } from '@/hooks/useGamification';

interface StudentDashboardCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconEmphasis: 'subtle' | 'medium' | 'high';
  changeType: 'positive' | 'negative' | 'neutral';
  value: string | number;
  change: string;
  actionText?: string;
  actionLink?: string;
  isDynamic?: boolean;
}

// Consolidated student dashboard cards - essential metrics only
const studentDashboardCards: StudentDashboardCard[] = [
  {
    id: 'career-readiness-score',
    title: 'Career Readiness',
    description: 'Overall progress',
    icon: Target,
    iconEmphasis: 'medium', // Important metric - medium emphasis
    changeType: 'positive',
    value: 'Loading...',
    change: 'Live tracking',
    actionText: 'View Progress',
    actionLink: '/dashboard',
    isDynamic: true
  },
  {
    id: 'university-placement',
    title: 'University & Scholarships',
    description: 'KUCCPS & funding',
    icon: GraduationCap,
    iconEmphasis: 'medium', // Important for Form 4 - medium
    changeType: 'positive',
    value: 'Loading...',
    change: 'Checking options',
    actionText: 'Explore Options',
    actionLink: '/assessment/university',
    isDynamic: true
  },
  {
    id: 'assessment-progress',
    title: 'Assessments',
    description: 'Career discovery',
    icon: Briefcase,
    iconEmphasis: 'subtle', // Informational metric - subtle
    changeType: 'positive',
    value: 'Loading...',
    change: 'New insights',
    actionText: 'Take Assessment',
    actionLink: '/assessment',
    isDynamic: true
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Milestones unlocked',
    icon: Award,
    iconEmphasis: 'subtle', // Secondary metric - subtle
    changeType: 'positive',
    value: 'Loading...',
    change: 'Keep it up!',
    actionText: 'View All',
    actionLink: '/profile',
    isDynamic: true
  }
  // Removed 'Get Support' card - redundant with Guidance section
];


interface StudentDashboardCardsProps {
  className?: string;
  maxCards?: number;
  size?: 'compact' | 'medium' | 'large';
  cardOffset?: number;
  allowRearrange?: boolean;
  filterByIds?: string[];
}

export const StudentDashboardCards: React.FC<StudentDashboardCardsProps> = ({
  className,
  maxCards = 8,
  size = 'medium',
  cardOffset = 0,
  allowRearrange = false,
  filterByIds,
}) => {
  // Dynamic dashboard data
  const {
    careerReadinessScore,
    universityPlacement,
    scholarshipMatches,
    userActivities,
    loading: dashboardLoading,
    error: dashboardError,
    logActivity
  } = useDynamicDashboard();

  // Gamification data
  const {
    achievements,
    certifications
  } = useGamification();

  // State for draggable cards
  const [cards, setCards] = useState(studentDashboardCards);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Load saved arrangement from Parse backend
  useEffect(() => {
    const loadCardOrder = async () => {
      if (!allowRearrange) return;

      try {
        const { getDashboardCardOrder } = await import('@/lib/userPreferences');
        const savedIds = await getDashboardCardOrder();

        if (savedIds.length > 0) {
          const reorderedCards = savedIds
            .map((id: string) => studentDashboardCards.find(card => card.id === id))
            .filter((card): card is StudentDashboardCard => card !== undefined);

          // Add any new cards that weren't in saved order
          const existingIds = reorderedCards.map(card => card.id);
          const newCards = studentDashboardCards.filter(card => !existingIds.includes(card.id));

          setCards([...reorderedCards, ...newCards]);
        }
      } catch (error) {
        console.warn('Failed to load saved card order, using default:', error);
        setCards(studentDashboardCards);
      }
    };

    loadCardOrder();
  }, [allowRearrange]);

  // Save arrangement to Parse backend
  const saveCardOrder = async (newCards: typeof studentDashboardCards) => {
    if (allowRearrange) {
      try {
        const { setDashboardCardOrder } = await import('@/lib/userPreferences');
        const cardIds = newCards.map(card => card.id);
        await setDashboardCardOrder(cardIds);
      } catch (error) {
        console.warn('Failed to save card order, saved locally only:', error);
      }
    }
  };

  // Reset to default order
  const resetToDefault = async () => {
    setCards(studentDashboardCards);
    try {
      const { setDashboardCardOrder } = await import('@/lib/userPreferences');
      await setDashboardCardOrder([]);
    } catch (error) {
      console.warn('Failed to reset card order on backend, reset locally only:', error);
    }
  };

  // Update cards with dynamic data
  const getUpdatedCards = () => {
    return cards.map(card => {
      if (!card.isDynamic) return card;

      switch (card.id) {
        case 'career-readiness-score':
          if (careerReadinessScore) {
            return {
              ...card,
              value: `${careerReadinessScore.overall}%`,
              change: `Updated ${careerReadinessScore.lastUpdated.toLocaleDateString()}`,
              changeType: (careerReadinessScore.overall >= 80 ? 'positive' : careerReadinessScore.overall >= 60 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        case 'university-placement': {
          // Combine university and scholarship data
          const totalPrograms = universityPlacement?.eligiblePrograms.length || 0;
          const totalScholarships = scholarshipMatches.length || 0;
          const highMatches = scholarshipMatches.filter(s => s.matchScore > 0.7).length;

          return {
            ...card,
            value: totalPrograms > 0 ? `${totalPrograms} programs` : 'Checking...',
            change: totalScholarships > 0 ? `${highMatches} scholarship matches` : 'No scholarships yet',
            changeType: (totalPrograms > 0 || totalScholarships > 0 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
          };
        }

        case 'assessment-progress': {
          // Calculate overall assessment completion
          const completedAssessments = userActivities.filter((a: unknown) => {
            const activity = a as { activityType?: string };
            return activity.activityType?.includes('assessment') ||
                   activity.activityType?.includes('career_discovery');
          }).length;

          return {
            ...card,
            value: completedAssessments > 0 ? `${completedAssessments} completed` : 'Start now',
            change: completedAssessments > 3 ? 'Well done!' : 'More insights available',
            changeType: (completedAssessments > 2 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
          };
        }

        case 'achievements': {
          // Show earned achievements
          const earnedCount = achievements.filter(a => a.earned).length;
          const certCount = certifications.filter(c => c.status === 'completed').length;
          const totalRewards = earnedCount + certCount;

          return {
            ...card,
            value: totalRewards > 0 ? `${totalRewards} unlocked` : 'Get started',
            change: earnedCount > 0 ? `${earnedCount} achievements` : 'Complete assessments to earn',
            changeType: (totalRewards > 0 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
          };
        }

        default:
          return card;
      }

      return card;
    });
  };

  const updatedCards = getUpdatedCards();

  // Apply filtering and pagination
  let filteredCards = updatedCards;
  
  // Apply ID filtering if provided
  if (filterByIds && filterByIds.length > 0) {
    filteredCards = filterByIds
      .map(id => cards.find(card => card.id === id))
      .filter(Boolean) as typeof studentDashboardCards;
  }
  
  const displayCards = filteredCards.slice(cardOffset, cardOffset + maxCards);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedCardId = e.dataTransfer.getData('text/plain');
    
    if (!draggedCardId || draggedCardId === displayCards[dropIndex]?.id) {
      setDraggedCard(null);
      setDragOverIndex(null);
      return;
    }

    const draggedCardIndex = displayCards.findIndex(card => card.id === draggedCardId);
    if (draggedCardIndex === -1) return;

    const newCards = [...cards];
    const actualDragIndex = cardOffset + draggedCardIndex;
    const actualDropIndex = cardOffset + dropIndex;
    
    // Remove dragged card and insert at new position
    const [draggedCardData] = newCards.splice(actualDragIndex, 1);
    newCards.splice(actualDropIndex, 0, draggedCardData);
    
    setCards(newCards);
    saveCardOrder(newCards);
    setDraggedCard(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverIndex(null);
  };
  
  // LinkedIn-style compact card sizing - reduce information overload
  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'min-h-[120px] w-full'; // Essential metrics only
      case 'large':
        return 'min-h-[160px] w-full'; // Key information focus
      case 'medium':
      default:
        return 'min-h-[140px] w-full'; // Balanced content display
    }
  };
  
  const getContentClasses = () => {
    switch (size) {
      case 'compact':
        return 'space-y-2';
      case 'large':
        return 'space-y-3';
      case 'medium':
      default:
        return 'space-y-2.5';
    }
  };
  

  return (
    <div className={cn(getContentClasses(), className)}>
      {/* Header with rearrangement controls */}
      {size !== 'compact' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                Your Career Journey Dashboard
              </h2>
              <p className="text-muted-foreground">
                Track your progress, stay on top of deadlines, and keep moving toward your goals
              </p>
            </div>
            {allowRearrange && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Move className="h-4 w-4" />
                  Drag to rearrange
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetToDefault}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overall Progress Summary - Clean Design */}
      <Card className="bg-white/90 dark:bg-slate-900 border-orange-200/30 dark:border-orange-700/30 mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <IconContainer
              icon={Trophy}
              emphasis="high"
              theme="student"
              size="lg"
              glow={true}
            />
            <div>
              <div className="text-xl font-bold text-slate-800 dark:text-white">
                Overall Progress Summary
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-300 font-medium">
                Real-time career readiness tracking
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform shadow">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                {studentDashboardCards.filter(card => card.changeType === 'positive').length}
              </div>
              <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Positive Trends</div>
            </div>
            
            <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform shadow">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 drop-shadow-sm">
                {studentDashboardCards.filter(card => card.changeType === 'neutral').length}
              </div>
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">Stable Areas</div>
            </div>
            
            <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform shadow border-red-200/30">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 drop-shadow-sm">
                {studentDashboardCards.filter(card => card.changeType === 'negative').length}
              </div>
              <div className="text-sm font-medium text-red-700 dark:text-red-300">Need Attention</div>
            </div>
            
            <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform shadow">
              <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 drop-shadow-sm">
                {studentDashboardCards.length}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Areas</div>
            </div>
          </div>
          
          <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Daily Career Tip
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-400 leading-relaxed">
              Spend just 10 minutes each day on career planning. Small consistent actions create life-changing results. 
              Focus on urgent items first, then work on areas that need attention.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Mobile-First Grid */}
      <div className={cn(
        "grid gap-4",
        // Mobile-first responsive design
        size === 'large' ? "grid-cols-1 max-w-2xl mx-auto" : 
        size === 'compact' ? "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" : 
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      )}>
        {displayCards.map((card, index) => {
          const isDragging = draggedCard === card.id;
          const isDropZone = dragOverIndex === index;
          
          return (
            <Card
              key={card.id}
              draggable={allowRearrange}
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (card.actionLink) {
                  logActivity('card_click', { cardId: card.id, cardTitle: card.title });
                }
              }}
              className={cn(
                "bg-white/90 dark:bg-slate-900 transition-all duration-300 border border-orange-200/30 rounded-xl",
                getCardSizeClasses(),
                allowRearrange && "cursor-grab active:cursor-grabbing",
                !allowRearrange && "cursor-pointer",
                isDragging && "opacity-50 scale-95",
                isDropZone && "ring-2 ring-orange-300/50 bg-orange-50/30",
                "group hover:scale-[1.02]"
              )}
            >
              {/* Enhanced layered decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/15 to-orange-300/8 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-400/10 to-orange-200/5 rounded-full -ml-8 -mb-8 group-hover:rotate-12 transition-transform duration-700"></div>
              
              {/* Glass overlay effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-3 relative z-10 text-center">
                <IconContainer
                  icon={card.icon}
                  emphasis={card.iconEmphasis}
                  theme="student"
                  size="md"
                />
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight text-center">
                  {card.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 text-center py-4">
                {/* LinkedIn-style primary metric emphasis */}
                <div className="mb-2">
                  <div className="text-2xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                    {card.isDynamic && dashboardLoading && card.value === 'Loading...' ? (
                      <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                    ) : null}
                    <span>{card.value}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-tight">{card.change}</p>
                </div>

                {dashboardError && card.isDynamic && (
                  <p className="text-xs text-red-500 mt-2">
                    Failed to load data
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboardCards;