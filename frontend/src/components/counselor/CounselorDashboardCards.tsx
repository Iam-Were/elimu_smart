import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconContainer } from '@/components/ui/icon-container';
import { useCounselorStats } from '@/hooks/useCounselorStats';
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
}

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'ring-2 ring-amber-200 bg-gradient-to-br from-amber-25 to-white shadow-amber-100';
    case 'medium':
      return 'ring-1 ring-amber-100 bg-gradient-to-br from-amber-25/50 to-white';
    default:
      return 'ring-1 ring-slate-200 bg-white';
  }
};

interface CounselorDashboardCardsProps {
  showAll?: boolean;
  maxCards?: number;
  className?: string;
  filter?: 'high' | 'medium' | 'low' | 'all';
  size?: 'compact' | 'medium' | 'large';
  cardOffset?: number;
}

export const CounselorDashboardCards: React.FC<CounselorDashboardCardsProps> = ({ 
  showAll = false, 
  maxCards = 6, 
  className,
  filter = 'all',
  size = 'medium',
  cardOffset = 0
}) => {
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
    return [
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
          primary: '15 Pending',
          secondary: 'Build reputation',
          trend: 'stable'
        },
        metadata: {
          count: 15,
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
        actionLink: '/counselor/dashboard',
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
  
  // LinkedIn-style card sizing - reduced heights for cleaner look
  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'min-h-[120px]'; // Essential metrics only
      case 'large':
        return 'min-h-[160px]'; // Key information with breathing room
      case 'medium':
      default:
        return 'min-h-[140px]'; // Balanced content display
    }
  };
  
  const getGridClasses = () => {
    switch (size) {
      case 'compact':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'large':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-5';
      case 'medium':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-5';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Counselor Dashboard
        </h1>
        <p className="text-slate-600 text-lg">
          Manage your students, sessions, and track your counseling effectiveness
        </p>
      </div>

      {/* Dynamic Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="bg-gradient-to-r from-gray-25 to-gray-50 border-gray-100">
              <CardContent className="p-4 text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className={`bg-gradient-to-r from-amber-25 to-amber-50 border-amber-100 ${getDerivedMetrics.urgentStudents > 0 ? 'ring-2 ring-amber-300' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-700">{stats.assignedStudents}</div>
                <div className="text-sm text-amber-600">Assigned Students</div>
                {getDerivedMetrics.urgentStudents > 0 && (
                  <div className="text-xs text-amber-500 mt-1">
                    {getDerivedMetrics.urgentStudents} urgent
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className={`bg-gradient-to-r from-orange-25 to-orange-50 border-orange-100 ${stats.activeChats > 5 ? 'ring-2 ring-orange-300' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">{stats.activeChats}</div>
                <div className="text-sm text-orange-600">Active Chats</div>
                {stats.unreadMessages > 0 && (
                  <div className="text-xs text-orange-500 mt-1">
                    {stats.unreadMessages} unread
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-25 to-blue-50 border-blue-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{stats.todaySessions}</div>
                <div className="text-sm text-blue-600">Today's Sessions</div>
                <div className="text-xs text-blue-500 mt-1">
                  KES {stats.todayEarnings.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-emerald-25 to-emerald-50 border-emerald-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700">{stats.premiumStudents}</div>
                <div className="text-sm text-emerald-600">Premium Students</div>
                <div className="text-xs text-emerald-500 mt-1">
                  KES {stats.monthlyEarnings.toLocaleString()}/mo
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Workload Alert */}
      {!isLoading && getDerivedMetrics.totalWorkload > 15 && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Bell className="h-4 w-4" />
              <span>High workload detected ({getDerivedMetrics.totalWorkload} urgent items). Consider prioritizing urgent students and questions.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Cards */}
      <div className={getGridClasses()}>
        {displayCards.map((card) => (
          <Card 
            key={card.id} 
            className={`hover:shadow-lg transition-all duration-200 ${getCardSizeClasses()} ${getPriorityStyles(card.priority)}`}
          >
            <CardHeader className="pb-3">
              {/* LinkedIn-style simplified header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconContainer
                    icon={card.icon}
                    emphasis={card.iconEmphasis}
                    theme="counselor"
                    size="md"
                  />
                  <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {card.title}
                  </CardTitle>
                </div>
                {/* Only show urgent badge - hide status badge to reduce clutter */}
                {card.metadata.urgent && (
                  <Badge variant="destructive" className="text-xs px-2 py-1">
                    <Bell className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* LinkedIn-style primary metric emphasis */}
              <div className="text-center py-2">
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {card.stats.primary}
                </div>
                {card.stats.secondary && (
                  <p className="text-sm text-slate-600 leading-tight">{card.stats.secondary}</p>
                )}
              </div>

              {/* Show only critical next action - hide completion bars for simplicity */}
              {card.metadata.nextAction && card.metadata.urgent && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
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

            <CardFooter className="pt-3">
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm py-2"
                asChild
              >
                <a
                  href={card.actionLink}
                  className="flex items-center justify-center"
                >
                  {card.actionText}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CounselorDashboardCards;