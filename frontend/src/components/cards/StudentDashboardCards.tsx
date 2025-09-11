import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
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
    title: 'Scholarships & Aid',
    description: 'Government & private funding opportunities',
    icon: Award,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Checking new matches',
    actionText: 'View Opportunities',
    actionLink: '/placement',
    isDynamic: true
  },
  {
    id: 'university-placement',
    title: 'University Placement',
    description: 'Your KUCCPS placement status & opportunities',
    icon: GraduationCap,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Checking eligibility',
    actionText: 'Open Placement Hub',
    actionLink: '/placement',
    isDynamic: true
  },
  {
    id: 'career-readiness-score',
    title: 'Career Readiness',
    description: 'Your preparation progress',
    icon: Target,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Calculating progress',
    actionText: 'Boost Score',
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
    title: 'Career Exploration',
    description: 'Careers discovered & researched',
    icon: Briefcase,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Tracking progress',
    actionText: 'Explore More',
    actionLink: '/student/career-exploration',
    isDynamic: true
  },
  {
    id: 'support-engagement',
    title: 'Messages & Support',
    description: 'Counselor interactions',
    icon: MessageSquare,
    changeType: 'positive',
    value: '12',
    change: '3 unread today',
    actionText: 'Check Messages',
    actionLink: '/guidance/chat-counselor'
  },
  {
    id: 'motivation-streak',
    title: 'Daily Streak',
    description: 'Career planning consistency',
    icon: Flame,
    changeType: 'positive',
    value: '7',
    change: '+2 days this week',
    actionText: 'Continue Streak',
    actionLink: '/student/daily-checkin'
  },
  {
    id: 'professional-network-growth',
    title: 'Professional Network',
    description: 'LinkedIn connections & mentors',
    icon: Network,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Building connections',
    actionText: 'Expand Network',
    actionLink: '/guidance/professional-networking',
    isDynamic: true
  }
];

// Reference design pattern - professional change indicators
const getChangeConfig = (changeType: 'positive' | 'negative' | 'neutral') => {
  switch (changeType) {
    case 'positive':
      return {
        icon: <TrendingUp className="h-3 w-3 text-green-600" />,
        textColor: 'text-green-600'
      };
    case 'negative':
      return {
        icon: <TrendingDown className="h-3 w-3 text-red-600" />,
        textColor: 'text-red-600'
      };
    default:
      return {
        icon: null,
        textColor: 'text-muted-foreground'
      };
  }
};

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

        case 'professional-network-growth':
          // Calculate networking progress from user activities
          const networkingActivities = userActivities.filter((a: any) => 
            a.activityType === 'linkedin_profile_click' || 
            a.activityType === 'professional_networking_view' ||
            a.activityType === 'mentor_connection_click'
          );
          
          const connectionCount = Math.min(networkingActivities.length * 3 + 12, 85); // Simulate growing network
          const weeklyGrowth = Math.floor(networkingActivities.length / 3);
          
          return {
            ...card,
            value: `${connectionCount} connections`,
            change: weeklyGrowth > 0 ? `+${weeklyGrowth} this week` : 'Ready to start networking',
            changeType: (connectionCount > 50 ? 'positive' : connectionCount > 20 ? 'neutral' : 'positive') as 'positive' | 'negative' | 'neutral'
          };

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
  
  // Professional rectangular card sizing - non-square proportions
  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'p-3 min-h-[160px] w-full'; // Professional rectangular cards
      case 'large':
        return 'p-4 min-h-[240px] w-full'; // Large feature cards  
      case 'medium':
      default:
        return 'p-3 min-h-[200px] w-full'; // Medium content cards
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

      {/* Overall Progress Summary - Moved to Top */}
      <Card className="bg-gradient-to-br from-orange-25 via-white to-orange-25/50 border-orange-100 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-600 text-white">
              <Trophy className="h-5 w-5" />
            </div>
            Overall Progress Summary
          </CardTitle>
          <CardDescription>
            Your complete career readiness overview
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-emerald-600">
                {studentDashboardCards.filter(card => card.changeType === 'positive').length}
              </div>
              <div className="text-sm text-muted-foreground">Positive Trends</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                {studentDashboardCards.filter(card => card.changeType === 'neutral').length}
              </div>
              <div className="text-sm text-muted-foreground">Stable Areas</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-red-600">
                {studentDashboardCards.filter(card => card.changeType === 'negative').length}
              </div>
              <div className="text-sm text-muted-foreground">Need Attention</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-slate-700">
                {studentDashboardCards.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Areas</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-orange-25 border border-orange-100">
            <h4 className="font-semibold text-orange-700 mb-2">Daily Tip:</h4>
            <p className="text-sm text-orange-600">
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
          const changeConfig = getChangeConfig(card.changeType);
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
                "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                getCardSizeClasses(),
                allowRearrange && "cursor-grab active:cursor-grabbing",
                !allowRearrange && "cursor-pointer",
                isDragging && "opacity-50 scale-95",
                isDropZone && "ring-1 ring-blue-200 bg-blue-50/30",
                "hover-lift"
              )}
            >
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 gradient-primary opacity-10 rounded-full -mr-10 -mt-10"></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{card.title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  {React.createElement(card.icon, { className: "h-4 w-4 text-primary" })}
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-2xl mb-1 flex items-center gap-2">
                  {card.isDynamic && dashboardLoading && card.value === 'Loading...' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
                <div className="flex items-center gap-1">
                  {changeConfig.icon}
                  <p className={`text-xs ${changeConfig.textColor}`}>
                    {card.change}
                  </p>
                </div>
                {dashboardError && card.isDynamic && (
                  <p className="text-xs text-red-500 mt-1">Failed to load latest data</p>
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