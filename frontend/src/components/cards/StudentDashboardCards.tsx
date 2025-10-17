import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  Target,
  GraduationCap,
  Briefcase,
  Move,
  RotateCcw,
  Loader2,
  Trophy,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { useGamification } from '@/hooks/useGamification';

interface StudentDashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconGradient: string;
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
    iconGradient: 'from-orange-500 to-orange-600',
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
    iconGradient: 'from-indigo-500 to-indigo-600',
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
    iconGradient: 'from-purple-500 to-purple-600',
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
    iconGradient: 'from-yellow-500 to-amber-600',
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

      {/* Overall Progress Summary - Enhanced with Glass Morphism */}
      <Card className="glass-card-primary border-orange-200/30 mb-6 relative overflow-hidden">
        {/* Multi-layer floating decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-orange-300/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/15 to-orange-200/8 rounded-full -ml-12 -mb-12"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl glass-card bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
                Overall Progress Summary
              </div>
              <div className="text-sm text-orange-600/80 font-medium">
                Real-time career readiness tracking
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card-success p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-emerald-600 drop-shadow-sm">
                {studentDashboardCards.filter(card => card.changeType === 'positive').length}
              </div>
              <div className="text-sm font-medium text-emerald-700">Positive Trends</div>
            </div>
            
            <div className="glass-card p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-orange-600 drop-shadow-sm">
                {studentDashboardCards.filter(card => card.changeType === 'neutral').length}
              </div>
              <div className="text-sm font-medium text-orange-700">Stable Areas</div>
            </div>
            
            <div className="glass-card p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform border-red-200/30">
              <div className="text-3xl font-bold text-red-600 drop-shadow-sm">
                {studentDashboardCards.filter(card => card.changeType === 'negative').length}
              </div>
              <div className="text-sm font-medium text-red-700">Need Attention</div>
            </div>
            
            <div className="glass-card p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-slate-700 drop-shadow-sm">
                {studentDashboardCards.length}
              </div>
              <div className="text-sm font-medium text-slate-600">Total Areas</div>
            </div>
          </div>
          
          <div className="mt-6 glass-card-primary p-4 rounded-xl border-orange-200/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-orange-200/10 rounded-full -mr-8 -mt-8"></div>
            <h4 className="font-semibold text-orange-700 mb-2 relative z-10 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Daily Career Tip
            </h4>
            <p className="text-sm text-orange-600 relative z-10 leading-relaxed">
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
                "glass-dashboard-card transition-all duration-300",
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
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  `bg-gradient-to-br ${card.iconGradient}`
                )}>
                  {React.createElement(card.icon, { className: "h-5 w-5 text-white" })}
                </div>
                <CardTitle className="text-sm font-semibold text-slate-800 leading-tight text-center">
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