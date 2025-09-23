import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  Target,
  Award,
  GraduationCap,
  Trophy,
  Flame,
  Briefcase,
  MessageSquare,
  Move,
  RotateCcw,
  Loader2,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface StudentDashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  changeType: 'positive' | 'negative' | 'neutral';
  value: string | number;
  change: string;
  actionText?: string;
  actionLink?: string;
  isDynamic?: boolean;
}

// Student-centric dashboard cards in professional priority order
const studentDashboardCards: StudentDashboardCard[] = [
  // FUTURE DEVELOPMENT: KCSE Countdown
  // Requires KNEC integration for exam registration status
  // {
  //   id: 'kcse-countdown',
  //   title: 'KCSE Preparation',
  //   description: 'Days until exam',
  //   icon: Clock,
  //   changeType: 'negative',
  //   value: '147',
  //   change: 'Exam approaching',
  //   actionText: 'Review Prep Plan',
  //   actionLink: '/student/kcse-preparation'
  // },
  {
    id: 'scholarship-tracker',
    title: 'Scholarships',
    description: 'Available funding',
    icon: Award,
    changeType: 'positive',
    value: 'Loading...',
    change: 'New matches',
    actionText: 'View All',
    actionLink: '/placement',
    isDynamic: true
  },
  {
    id: 'university-placement',
    title: 'University Placement',
    description: 'KUCCPS status',
    icon: GraduationCap,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Checking eligibility',
    actionText: 'Check Status',
    actionLink: '/placement',
    isDynamic: true
  },
  {
    id: 'career-readiness-score',
    title: 'Career Readiness',
    description: 'Progress score',
    icon: Target,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Live tracking',
    actionText: 'View Score',
    actionLink: '/student/readiness-plan',
    isDynamic: true
  },
  // FUTURE DEVELOPMENT: Subject Performance
  // Requires live grade integration from school management systems
  // {
  //   id: 'subject-performance',
  //   title: 'Subject Performance',
  //   description: 'Track your academic progress',
  //   icon: BookOpen,
  //   changeType: 'positive',
  //   value: 'B+',
  //   change: '+0.2 improvement',
  //   actionText: 'View Progress',
  //   actionLink: '/assessment'
  // },
  {
    id: 'career-exploration',
    title: 'Career Discovery',
    description: 'Explore careers',
    icon: Briefcase,
    changeType: 'positive',
    value: 'Loading...',
    change: 'New careers',
    actionText: 'Discover',
    actionLink: '/student/career-exploration',
    isDynamic: true
  },
  {
    id: 'support-engagement',
    title: 'Messages',
    description: 'Counselor chat',
    icon: MessageSquare,
    changeType: 'positive',
    value: '12',
    change: '3 unread',
    actionText: 'Open Chat',
    actionLink: '/inbox'
  },
  {
    id: 'motivation-streak',
    title: 'Activity Streak',
    description: 'Daily progress',
    icon: Flame,
    changeType: 'positive',
    value: '7',
    change: '+2 days',
    actionText: 'Continue',
    actionLink: '/student/daily-checkin'
  },
  {
    id: 'professional-network-growth',
    title: 'Network Growth',
    description: 'Build connections',
    icon: Network,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Growing',
    actionText: 'Connect',
    actionLink: '/guidance/professional-networking',
    isDynamic: true
  }
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

  // State for draggable cards
  const [cards, setCards] = useState(studentDashboardCards);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Load saved arrangement from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('student-dashboard-card-order');
    if (savedOrder && allowRearrange) {
      try {
        const savedIds = JSON.parse(savedOrder);
        const reorderedCards = savedIds
          .map((id: string) => studentDashboardCards.find(card => card.id === id))
          .filter(Boolean);
        
        // Add any new cards that weren't in saved order
        const existingIds = reorderedCards.map((card: StudentDashboardCard) => card.id);
        const newCards = studentDashboardCards.filter(card => !existingIds.includes(card.id));
        
        setCards([...reorderedCards, ...newCards]);
      } catch (error) {
        console.warn('Failed to load saved card order:', error);
        setCards(studentDashboardCards);
      }
    }
  }, [allowRearrange]);

  // Save arrangement to localStorage
  const saveCardOrder = (newCards: typeof studentDashboardCards) => {
    if (allowRearrange) {
      localStorage.setItem('student-dashboard-card-order', JSON.stringify(newCards.map(card => card.id)));
    }
  };

  // Reset to default order
  const resetToDefault = () => {
    setCards(studentDashboardCards);
    localStorage.removeItem('student-dashboard-card-order');
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

        case 'university-placement':
          if (universityPlacement) {
            return {
              ...card,
              value: universityPlacement.eligiblePrograms.length > 0 ? 'Eligible' : 'Reviewing',
              change: `${universityPlacement.eligiblePrograms.length} programs available`,
              changeType: (universityPlacement.eligiblePrograms.length > 0 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        case 'scholarship-tracker':
          if (scholarshipMatches.length >= 0) {
            return {
              ...card,
              value: scholarshipMatches.length.toString(),
              change: scholarshipMatches.length > 0 ? `${scholarshipMatches.filter(s => s.matchScore > 0.7).length} high matches` : 'No matches yet',
              changeType: (scholarshipMatches.length > 0 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        case 'career-exploration':
          // This would be calculated from user activities
          return {
            ...card,
            value: '8', // Placeholder - would come from activity tracking
            change: '2 new this week',
            changeType: 'positive' as 'positive' | 'negative' | 'neutral'
          };

        case 'professional-network-growth': {
          // Calculate networking progress from user activities
          const networkingActivities = userActivities.filter((a: unknown) => {
            const activity = a as { activityType?: string };
            return activity.activityType === 'linkedin_profile_click' || 
                   activity.activityType === 'professional_networking_view' ||
                   activity.activityType === 'mentor_connection_click';
          });
          
          const connectionCount = Math.min(networkingActivities.length * 3 + 12, 85); // Simulate growing network
          const weeklyGrowth = Math.floor(networkingActivities.length / 3);
          
          return {
            ...card,
            value: `${connectionCount} connections`,
            change: weeklyGrowth > 0 ? `+${weeklyGrowth} this week` : 'Ready to start networking',
            changeType: (connectionCount > 50 ? 'positive' : connectionCount > 20 ? 'neutral' : 'positive') as 'positive' | 'negative' | 'neutral'
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
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-600 rounded-md">
                    {React.createElement(card.icon, { className: "h-4 w-4 text-white" })}
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-800 leading-tight">
                    {card.title}
                  </CardTitle>
                </div>
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