import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Button from '@/components/ui/button';
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  BookOpen,
  Target,
  Award,
  School,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface UniversityPlacementCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  changeType: 'positive' | 'negative' | 'neutral';
  value: string | number;
  change: string;
  actionText?: string;
  actionLink?: string;
  category: 'placement' | 'eligibility' | 'recommendations' | 'progress';
  priority?: 'high' | 'medium' | 'low';
  isDynamic?: boolean;
}

const universityPlacementCards: UniversityPlacementCard[] = [
  {
    id: 'placement-eligibility',
    title: 'KUCCPS Placement Eligibility',
    description: 'Your eligibility for government-sponsored university placement',
    icon: <GraduationCap className="h-4 w-4" />,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Checking eligibility',
    actionText: 'Check Requirements',
    actionLink: '/placement/eligibility',
    category: 'eligibility',
    priority: 'high',
    isDynamic: true
  },
  {
    id: 'cutoff-calculator',
    title: 'Cutoff Point Calculator',
    description: 'Calculate your placement cutoff points for university courses',
    icon: <Calculator className="h-4 w-4" />,
    changeType: 'neutral',
    value: 'Loading...',
    change: 'Calculating points',
    actionText: 'Recalculate',
    actionLink: '/placement/calculator',
    category: 'placement',
    priority: 'high',
    isDynamic: true
  },
  {
    id: 'course-matches',
    title: 'Course Recommendations',
    description: 'University courses that match your academic profile',
    icon: <BookOpen className="h-4 w-4" />,
    changeType: 'positive',
    value: 'Loading...',
    change: 'Finding matches',
    actionText: 'View Courses',
    actionLink: '/placement/courses',
    category: 'recommendations',
    priority: 'high',
    isDynamic: true
  },
  {
    id: 'institution-matches',
    title: 'University Matches',
    description: 'Universities where you can secure placement',
    icon: <School className="h-4 w-4" />,
    changeType: 'positive',
    value: '8',
    change: 'Institutions matched',
    actionText: 'View Universities',
    actionLink: '/placement/institutions',
    category: 'recommendations',
    priority: 'medium'
  },
  {
    id: 'application-status',
    title: 'Application Progress',
    description: 'Track your KUCCPS application and placement status',
    icon: <Clock className="h-4 w-4" />,
    changeType: 'neutral',
    value: 'In Progress',
    change: 'Application submitted',
    actionText: 'Track Status',
    actionLink: '/placement/status',
    category: 'progress',
    priority: 'medium'
  },
  {
    id: 'grade-improvement',
    title: 'Grade Requirements',
    description: 'Subjects needing improvement for better placement',
    icon: <Target className="h-4 w-4" />,
    changeType: 'negative',
    value: '3',
    change: 'Subjects to improve',
    actionText: 'View Plan',
    actionLink: '/placement/improvement',
    category: 'progress',
    priority: 'high'
  },
  {
    id: 'placement-timeline',
    title: 'Placement Timeline',
    description: 'Important KUCCPS dates and deadlines',
    icon: <AlertCircle className="h-4 w-4" />,
    changeType: 'neutral',
    value: 'Loading...',
    change: 'Checking timeline',
    actionText: 'View Timeline',
    actionLink: '/placement/timeline',
    category: 'progress',
    priority: 'medium',
    isDynamic: true
  },
  {
    id: 'scholarship-opportunities',
    title: 'Scholarship Matches',
    description: 'Scholarships available for your academic profile',
    icon: <Award className="h-4 w-4" />,
    changeType: 'positive',
    value: '5',
    change: 'Opportunities found',
    actionText: 'Apply Now',
    actionLink: '/placement/scholarships',
    category: 'recommendations',
    priority: 'medium'
  }
];

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
        icon: <CheckCircle className="h-3 w-3 text-blue-600" />,
        textColor: 'text-blue-600'
      };
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50/50';
    case 'medium':
      return 'border-l-orange-500 bg-orange-50/50';
    case 'low':
      return 'border-l-green-500 bg-green-50/50';
    default:
      return 'border-l-blue-500 bg-blue-50/50';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'placement':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'eligibility':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'recommendations':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'progress':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

interface UniversityPlacementCardsProps {
  className?: string;
  category?: 'placement' | 'eligibility' | 'recommendations' | 'progress' | 'all';
  size?: 'compact' | 'medium' | 'large';
  maxCards?: number;
  cardOffset?: number;
  showAll?: boolean;
}

export const UniversityPlacementCards: React.FC<UniversityPlacementCardsProps> = ({ 
  className,
  category = 'all',
  size = 'medium',
  maxCards,
  cardOffset = 0,
  showAll = false
}) => {
  // Get dynamic dashboard data
  const {
    universityPlacement,
    cutoffAnalysis,
    kuccpsTimeline,
    courseRecommendations,
    loading: dashboardLoading,
    error: dashboardError,
    logActivity
  } = useDynamicDashboard();

  // Update cards with dynamic data
  const getUpdatedCards = () => {
    return universityPlacementCards.map(card => {
      if (!card.isDynamic) return card;

      switch (card.id) {
        case 'placement-eligibility':
          if (universityPlacement) {
            return {
              ...card,
              value: universityPlacement.eligiblePrograms.length > 0 ? 'Eligible' : 'Under Review',
              change: universityPlacement.eligiblePrograms.length > 0 
                ? `${universityPlacement.eligiblePrograms.length} programs available`
                : 'Checking requirements',
              changeType: (universityPlacement.eligiblePrograms.length > 0 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        case 'cutoff-calculator':
          if (cutoffAnalysis) {
            return {
              ...card,
              value: cutoffAnalysis.currentPoints.toFixed(1),
              change: `${cutoffAnalysis.totalEligibleCourses} eligible courses`,
              changeType: (cutoffAnalysis.currentPoints >= cutoffAnalysis.averageRequired ? 'positive' : 'negative') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        case 'course-matches':
          if (courseRecommendations) {
            return {
              ...card,
              value: courseRecommendations.totalMatches.toString(),
              change: `${courseRecommendations.highMatches} high matches`,
              changeType: (courseRecommendations.highMatches > 0 ? 'positive' : 'neutral') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        case 'placement-timeline':
          if (kuccpsTimeline) {
            return {
              ...card,
              value: kuccpsTimeline.daysRemaining.toString(),
              change: `Until ${kuccpsTimeline.nextDeadline}`,
              changeType: (kuccpsTimeline.daysRemaining > 30 ? 'positive' : 
                         kuccpsTimeline.daysRemaining > 7 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral'
            };
          }
          break;

        default:
          return card;
      }

      return card;
    });
  };

  const updatedCards = getUpdatedCards();
  
  // Filter cards by category
  const filteredCards = category === 'all' 
    ? updatedCards 
    : updatedCards.filter(card => card.category === category);

  // Apply card limiting and offset
  const displayCards = showAll 
    ? filteredCards 
    : filteredCards.slice(cardOffset, maxCards ? cardOffset + maxCards : undefined);

  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'p-3 min-h-[160px] w-full';
      case 'large':
        return 'p-6 min-h-[200px] w-full';
      default:
        return 'p-5 min-h-[180px] w-full';
    }
  };

  const getGridClasses = () => {
    switch (size) {
      case 'compact':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
      case 'large':
        return 'grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto';
      default:
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-orange-900">
          University Placement Hub
        </h2>
        <p className="text-orange-700">
          Navigate Kenya's university placement system with AI-powered guidance
        </p>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge className="bg-blue-100 text-blue-700">Placement</Badge>
        <Badge className="bg-green-100 text-green-700">Eligibility</Badge>
        <Badge className="bg-purple-100 text-purple-700">Recommendations</Badge>
        <Badge className="bg-orange-100 text-orange-700">Progress</Badge>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="text-xl text-orange-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Your Placement Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-orange-700">Loading placement data...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-orange-800">
                    {cutoffAnalysis ? cutoffAnalysis.currentPoints.toFixed(1) : '42.5'}
                  </div>
                  <div className="text-sm text-orange-700">Cutoff Points</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {courseRecommendations ? courseRecommendations.totalMatches : '12'}
                  </div>
                  <div className="text-sm text-orange-700">Course Matches</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {universityPlacement ? universityPlacement.eligiblePrograms.length : '8'}
                  </div>
                  <div className="text-sm text-orange-700">Universities</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={cutoffAnalysis 
                    ? Math.min(95, (cutoffAnalysis.currentPoints / cutoffAnalysis.averageRequired) * 100) 
                    : 75
                  } 
                  className="h-2" 
                />
                <p className="text-xs text-orange-700 mt-1">
                  {cutoffAnalysis 
                    ? `${Math.min(95, Math.round((cutoffAnalysis.currentPoints / cutoffAnalysis.averageRequired) * 100))}% placement probability`
                    : '75% placement probability'
                  }
                </p>
              </div>
              {dashboardError && (
                <p className="text-xs text-red-600 mt-2">Unable to load latest data - showing cached results</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Placement Cards Grid */}
      <div className={cn("grid gap-4", getGridClasses())}>
        {displayCards.map((card) => {
          const changeConfig = getChangeConfig(card.changeType);
          
          return (
            <Card 
              key={card.id}
              className={cn(
                "relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4",
                getCardSizeClasses(),
                getPriorityColor(card.priority),
                "hover-lift cursor-pointer"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Badge variant="secondary" className={getCategoryColor(card.category)}>
                    {card.category}
                  </Badge>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="text-orange-600">
                    {card.icon}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-orange-800 flex items-center gap-2">
                      {card.isDynamic && dashboardLoading && card.value === 'Loading...' && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {card.value}
                    </div>
                    <div className="flex items-center gap-1">
                      {changeConfig.icon}
                      <span className={cn("text-xs", changeConfig.textColor)}>
                        {card.change}
                      </span>
                    </div>
                  </div>

                  {card.actionText && card.actionLink && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full text-orange-700 border-orange-200 hover:bg-orange-50"
                      onClick={() => {
                        logActivity('placement_card_click', {
                          cardId: card.id,
                          cardTitle: card.title,
                          category: card.category,
                          priority: card.priority,
                          actionText: card.actionText
                        });
                      }}
                    >
                      {card.actionText}
                    </Button>
                  )}
                  
                  {dashboardError && card.isDynamic && (
                    <p className="text-xs text-red-500 mt-1">Failed to load latest data</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UniversityPlacementCards;