import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconContainer } from '@/components/ui/icon-container';
import { useCounselorStats } from '@/hooks/useCounselorStats';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel';
import { Loader2 } from 'lucide-react';
import {
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  FileText,
  AlertTriangle,
  Bell,
  type LucideIcon,
} from 'lucide-react';

interface CounselorDashboardCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconEmphasis: 'subtle' | 'medium' | 'high';
  status: 'active' | 'attention' | 'completed' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
  actionText: string;
  actionLink: string;
  stats: {
    primary: string;
    secondary?: string;
    trend?: 'up' | 'down' | 'stable';
  };
  metadata: {
    count?: number;
    nextAction?: string;
    completion?: number;
    urgent?: boolean;
    lastUpdated?: string;
  };
  priorityScore?: number;
  urgencyLevel?: 'critical' | 'high' | 'medium' | 'low';
}

// Calculate priority score for intelligent sorting (0-100)
const calculateCardPriority = (cardId: string, stats: {
  unreadMessages: number;
  todaySessions: number;
  urgentCount: number;
  pendingQuestions: number;
}): number => {
  switch (cardId) {
    case 'premium-inbox':
      // Highest priority if there are unread messages
      return stats.unreadMessages > 0 ? 100 + stats.unreadMessages : 30;
    case 'paid-sessions':
      // High priority if there are sessions today
      return stats.todaySessions > 0 ? 80 + stats.todaySessions : 25;
    case 'premium-students':
      // Medium-high priority if there are urgent students
      return stats.urgentCount > 0 ? 60 + stats.urgentCount : 20;
    case 'community-qa':
      // Medium priority if there are many pending questions
      return stats.pendingQuestions > 10 ? 40 + stats.pendingQuestions : 15;
    case 'counseling-analytics':
      // Lowest priority (always informational)
      return 10;
    default:
      return 0;
  }
};

// Determine urgency level based on priority score
const getUrgencyLevel = (priorityScore: number): 'critical' | 'high' | 'medium' | 'low' => {
  if (priorityScore >= 90) return 'critical';
  if (priorityScore >= 60) return 'high';
  if (priorityScore >= 40) return 'medium';
  return 'low';
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'ring-2 ring-amber-200 dark:ring-amber-800 shadow-amber-100';
    case 'medium':
      return 'ring-1 ring-amber-100 dark:ring-amber-900';
    default:
      return 'ring-1 ring-slate-200 dark:ring-slate-700';
  }
};

const getUrgencyStyles = (urgencyLevel: 'critical' | 'high' | 'medium' | 'low') => {
  switch (urgencyLevel) {
    case 'critical':
      return 'ring-2 ring-red-500 animate-pulse shadow-red-200';
    case 'high':
      return 'ring-2 ring-orange-400 shadow-orange-100';
    case 'medium':
      return 'ring-1 ring-yellow-300';
    default:
      return '';
  }
};

interface CounselorDashboardCardsProps {
  showAll?: boolean;
  maxCards?: number;
  className?: string;
  filter?: 'high' | 'medium' | 'low' | 'all';
  size?: 'compact' | 'medium' | 'large';
  cardOffset?: number;
  useCarousel?: boolean; // New prop to enable carousel mode
}

export const CounselorDashboardCards: React.FC<CounselorDashboardCardsProps> = ({
  showAll = false,
  maxCards = 6,
  className,
  filter = 'all',
  size = 'medium',
  cardOffset = 0,
  useCarousel = false
}) => {
  const navigate = useNavigate();
  const { stats, isLoading, error } = useCounselorStats();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        <span className="ml-3 text-yellow-700">Loading dashboard...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to load dashboard: {error.message}</p>
      </div>
    );
  }

  // No data
  if (!stats) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">No data available</p>
      </div>
    );
  }

  // Transform static cards with dynamic API data
  const getDynamicCounselorCards = (): CounselorDashboardCard[] => {
    const cards: CounselorDashboardCard[] = [
      {
        id: 'premium-students',
        title: 'Premium Students',
        description: 'Active paying clients',
        icon: Users,
        iconEmphasis: 'high',
        status: 'attention',
        priority: 'high',
        actionText: 'View Students',
        actionLink: '/counselor/students?filter=premium',
        stats: {
          primary: `${stats.premiumStudents} Premium`,
          secondary: `KES ${(stats.monthlyEarnings || 0).toLocaleString()}/month`,
          trend: 'up'
        },
        metadata: {
          count: stats.premiumStudents,
          nextAction: 'Check pending messages',
          urgent: true,
          lastUpdated: 'Live data'
        }
      },
      {
        id: 'premium-inbox',
        title: 'Premium Inbox',
        description: 'Messages from paid students',
        icon: MessageSquare,
        iconEmphasis: 'medium',
        status: 'active',
        priority: 'high',
        actionText: 'Open Inbox',
        actionLink: '/inbox?filter=premium',
        stats: {
          primary: `${stats.unreadMessages} Unread`,
          secondary: `${stats.activeChats} active chats`,
          trend: 'stable'
        },
        metadata: {
          count: stats.unreadMessages,
          nextAction: 'Reply to messages',
          urgent: stats.unreadMessages > 0,
          lastUpdated: 'Live data'
        }
      },
      {
        id: 'paid-sessions',
        title: 'Booked Sessions',
        description: 'Scheduled paid counseling sessions',
        icon: Calendar,
        iconEmphasis: 'medium',
        status: 'scheduled',
        priority: 'high',
        actionText: 'View Sessions',
        actionLink: '/counselor/sessions',
        stats: {
          primary: `${stats.todaySessions} Today`,
          secondary: `KES ${(stats.todayEarnings || 0).toLocaleString()} earnings`,
          trend: 'up'
        },
        metadata: {
          count: stats.todaySessions,
          nextAction: stats.todaySessions > 0 ? 'Prepare for next session' : 'No sessions today',
          lastUpdated: 'Live data'
        }
      },
      {
        id: 'community-qa',
        title: 'Community Q&A',
        description: 'Answer free tier questions (optional)',
        icon: FileText,
        iconEmphasis: 'subtle',
        status: 'active',
        priority: 'medium',
        actionText: 'Browse Questions',
        actionLink: '/counselor/questions',
        stats: {
          primary: `${stats.pendingQuestions || 0} Pending`,
          secondary: 'Build reputation',
          trend: 'stable'
        },
        metadata: {
          count: stats.pendingQuestions || 0,
          nextAction: 'Answer when available',
          urgent: false,
          lastUpdated: 'Live data'
        }
      },
      {
        id: 'counseling-analytics',
        title: 'Performance',
        description: 'Track effectiveness & retention',
        icon: BarChart3,
        iconEmphasis: 'subtle',
        status: 'completed',
        priority: 'medium',
        actionText: 'View Stats',
        actionLink: '/counselor/analytics',
        stats: {
          primary: `${stats.assignedStudents} Students`,
          secondary: `${stats.urgentCount} need attention`,
          trend: 'stable'
        },
        metadata: {
          completion: 92,
          nextAction: 'Review student progress',
          lastUpdated: 'Live data'
        }
      },
    ];

    // Calculate priority scores and urgency levels for each card
    return cards.map(card => {
      const priorityScore = calculateCardPriority(card.id, {
        unreadMessages: stats.unreadMessages,
        todaySessions: stats.todaySessions,
        urgentCount: stats.urgentCount,
        pendingQuestions: stats.pendingQuestions || 0,
      });
      const urgencyLevel = getUrgencyLevel(priorityScore);

      return {
        ...card,
        priorityScore,
        urgencyLevel,
      };
    }).sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0)); // Sort by priority (highest first)
  };

  const getDerivedMetrics = {
    totalWorkload: stats.urgentCount + stats.unreadMessages,
    urgentStudents: stats.urgentCount
  };

  const dynamicCards = getDynamicCounselorCards();
  const filteredCards = filter === 'all' 
    ? dynamicCards 
    : dynamicCards.filter(card => card.priority === filter);
    
  const displayCards = showAll ? filteredCards : filteredCards.slice(cardOffset, cardOffset + maxCards);
  
  // Compact card sizing - reduced heights for cleaner look
  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'min-h-[140px]'; // Essential metrics only
      case 'large':
        return 'min-h-[180px]'; // Key information with breathing room
      case 'medium':
      default:
        return 'min-h-[160px]'; // Balanced content display
    }
  };
  
  const getGridClasses = () => {
    switch (size) {
      case 'compact':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4';
      case 'large':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-5';
      case 'medium':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-card-foreground">
          Counselor Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your students, sessions, and track your counseling effectiveness
        </p>
      </div>

      {/* Dynamic Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className={`bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900 ${getDerivedMetrics.urgentStudents > 0 ? 'ring-2 ring-amber-300 dark:ring-amber-700' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.assignedStudents}</div>
            <div className="text-sm text-amber-600 dark:text-amber-400">Assigned Students</div>
            {getDerivedMetrics.urgentStudents > 0 && (
              <div className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                {getDerivedMetrics.urgentStudents} urgent
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900 ${stats.activeChats > 5 ? 'ring-2 ring-orange-300 dark:ring-orange-700' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.activeChats}</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Active Chats</div>
            {stats.unreadMessages > 0 && (
              <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                {stats.unreadMessages} unread
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.todaySessions}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Today's Sessions</div>
            <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              KES {stats.todayEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.premiumStudents}</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">Premium Students</div>
            <div className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
              KES {stats.monthlyEarnings.toLocaleString()}/mo
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workload Alert */}
      {!isLoading && getDerivedMetrics.totalWorkload > 15 && (
        <Card className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Bell className="h-4 w-4" />
              <span>High workload detected ({getDerivedMetrics.totalWorkload} urgent items). Consider prioritizing urgent students and questions.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Cards */}
      {useCarousel ? (
        /* Carousel Mode: Auto-rotating smart priority carousel */
        <div className="relative px-12 mt-4">
          <Carousel
            opts={{ loop: true }}
            autoplay={true}
            autoplayDelay={6000}
            className="w-full max-w-2xl mx-auto"
          >
            <CarouselContent>
              {displayCards.map((card) => (
                <CarouselItem key={card.id}>
                  {/* Single card in carousel */}
          <Card
            key={card.id}
            className={cn(
              "hover:shadow-lg transition-all duration-200",
              getCardSizeClasses(),
              getPriorityStyles(card.priority),
              card.urgencyLevel && getUrgencyStyles(card.urgencyLevel)
            )}
          >
            {/* Urgency Badge - Absolutely positioned at top */}
            {card.urgencyLevel && (card.urgencyLevel === 'critical' || card.urgencyLevel === 'high') && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                <Badge
                  className={cn(
                    "text-xs px-3 py-1 font-bold shadow-md",
                    card.urgencyLevel === 'critical'
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-orange-500 text-white"
                  )}
                >
                  {card.urgencyLevel === 'critical' ? '🔴🔴 URGENT' : '🔴 ATTENTION'}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-2">
              {/* Centered header with icon and title */}
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex items-center gap-2">
                  <IconContainer
                    icon={card.icon}
                    emphasis={card.iconEmphasis}
                    theme="counselor"
                    size="md"
                  />
                  {/* Show urgent badge next to icon */}
                  {card.metadata.urgent && (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                      <Bell className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {card.title}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {/* Centered primary metric emphasis */}
              <div className="text-center py-1">
                <div className="text-2xl font-bold text-card-foreground mb-0.5">
                  {card.stats.primary}
                </div>
                {card.stats.secondary && (
                  <p className="text-xs text-muted-foreground leading-tight">{card.stats.secondary}</p>
                )}
              </div>

              {/* Show only critical next action - reduced padding */}
              {card.metadata.nextAction && card.metadata.urgent && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2">
                  <div className="text-xs font-medium text-red-700 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" />
                    {card.metadata.nextAction}
                  </div>
                </div>
              )}

              {/* Show non-urgent next actions more subtly */}
              {card.metadata.nextAction && !card.metadata.urgent && (
                <div className="text-xs text-slate-500 text-center">
                  {card.metadata.nextAction}
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-1.5"
                onClick={() => navigate(card.actionLink)}
              >
                {card.actionText}
              </Button>
            </CardFooter>
          </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
            <CarouselDots urgencyLevels={displayCards.map(c => c.urgencyLevel || 'low')} />
          </Carousel>
        </div>
      ) : (
        /* Grid Mode: Traditional card grid */
        <div className={getGridClasses()}>
          {displayCards.map((card) => (
            <Card
              key={card.id}
              className={cn(
                "hover:shadow-lg transition-all duration-200 relative",
                getCardSizeClasses(),
                getPriorityStyles(card.priority),
                card.urgencyLevel && getUrgencyStyles(card.urgencyLevel)
              )}
            >
              {/* Grid mode cards - simplified without carousel duplication */}
              {card.urgencyLevel && (card.urgencyLevel === 'critical' || card.urgencyLevel === 'high') && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <Badge
                    className={cn(
                      "text-xs px-3 py-1 font-bold shadow-md",
                      card.urgencyLevel === 'critical'
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-orange-500 text-white"
                    )}
                  >
                    {card.urgencyLevel === 'critical' ? '🔴🔴 URGENT' : '🔴 ATTENTION'}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex items-center gap-2">
                    <IconContainer
                      icon={card.icon}
                      emphasis={card.iconEmphasis}
                      theme="counselor"
                      size="md"
                    />
                    {card.metadata.urgent && (
                      <Badge variant="destructive" className="text-xs px-2 py-0.5">
                        <Bell className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {card.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-center py-1">
                  <div className="text-2xl font-bold text-card-foreground mb-0.5">
                    {card.stats.primary}
                  </div>
                  {card.stats.secondary && (
                    <p className="text-xs text-muted-foreground leading-tight">{card.stats.secondary}</p>
                  )}
                </div>
                {card.metadata.nextAction && card.metadata.urgent && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-2">
                    <div className="text-xs font-medium text-red-700 flex items-center justify-center gap-1.5">
                      <AlertTriangle className="h-3 w-3" />
                      {card.metadata.nextAction}
                    </div>
                  </div>
                )}
                {card.metadata.nextAction && !card.metadata.urgent && (
                  <div className="text-xs text-muted-foreground text-center">
                    {card.metadata.nextAction}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-1.5"
                  onClick={() => navigate(card.actionLink)}
                >
                  {card.actionText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounselorDashboardCards;