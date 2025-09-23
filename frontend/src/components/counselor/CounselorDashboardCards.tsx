import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCounselorDashboard } from '@/hooks/useCounselorDashboard';
import {
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  AlertTriangle,
  UserCheck,
  Video,
  FileText,
  Target,
  Bell
} from 'lucide-react';

interface CounselorDashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
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

const counselorDashboardCards: CounselorDashboardCard[] = [
  {
    id: 'assigned-students',
    title: 'Student Roster',
    description: 'Monitor student progress and wellbeing',
    icon: <Users className="h-6 w-6" />,
    status: 'attention',
    priority: 'high',
    actionText: 'View Roster',
    actionLink: '/counselor/students',
    stats: {
      primary: '34 Students',
      secondary: '7 urgent',
      trend: 'up'
    },
    metadata: {
      count: 34,
      nextAction: 'Review urgent cases',
      urgent: true,
      lastUpdated: '2 hours ago'
    }
  },
  {
    id: 'active-chat-sessions',
    title: 'Active Chats',
    description: 'Respond to student messages',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'active',
    priority: 'high',
    actionText: 'Open Chats',
    actionLink: '/counselor/chat',
    stats: {
      primary: '8 Active',
      secondary: '3.2 min avg',
      trend: 'stable'
    },
    metadata: {
      count: 8,
      nextAction: 'Reply to waiting messages',
      urgent: true,
      lastUpdated: '5 minutes ago'
    }
  },
  {
    id: 'upcoming-appointments',
    title: 'Today\'s Sessions',
    description: 'View scheduled appointments',
    icon: <Calendar className="h-6 w-6" />,
    status: 'scheduled',
    priority: 'medium',
    actionText: 'View Schedule',
    actionLink: '/counselor/appointments',
    stats: {
      primary: '6 Sessions',
      secondary: 'Next: 2:30 PM',
      trend: 'up'
    },
    metadata: {
      count: 6,
      nextAction: 'Prepare session notes',
      lastUpdated: '30 minutes ago'
    }
  },
  {
    id: 'counseling-analytics',
    title: 'Performance',
    description: 'Track counseling effectiveness',
    icon: <BarChart3 className="h-6 w-6" />,
    status: 'completed',
    priority: 'medium',
    actionText: 'View Stats',
    actionLink: '/counselor/analytics',
    stats: {
      primary: '89% Success',
      secondary: '4.7/5 rating',
      trend: 'up'
    },
    metadata: {
      completion: 89,
      nextAction: 'Review monthly data',
      lastUpdated: '1 day ago'
    }
  },
  {
    id: 'pending-question-queue',
    title: 'Q&A Queue',
    description: 'Answer student questions',
    icon: <FileText className="h-6 w-6" />,
    status: 'attention',
    priority: 'high',
    actionText: 'Answer Now',
    actionLink: '/counselor/questions',
    stats: {
      primary: '15 Pending',
      secondary: '3 urgent',
      trend: 'up'
    },
    metadata: {
      count: 15,
      nextAction: 'Answer urgent questions',
      urgent: true,
      lastUpdated: '15 minutes ago'
    }
  },
  {
    id: 'group-sessions',
    title: 'Group Sessions',
    description: 'Manage workshops and group activities',
    icon: <UserCheck className="h-6 w-6" />,
    status: 'scheduled',
    priority: 'medium',
    actionText: 'Manage Groups',
    actionLink: '/counselor/group-sessions',
    stats: {
      primary: '4 Groups',
      secondary: 'Next: Tomorrow 10 AM',
      trend: 'stable'
    },
    metadata: {
      count: 4,
      nextAction: 'Plan activities',
      lastUpdated: '4 hours ago'
    }
  },
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    description: 'Monitor student milestones',
    icon: <Target className="h-6 w-6" />,
    status: 'active',
    priority: 'medium',
    actionText: 'View Progress',
    actionLink: '/counselor/progress',
    stats: {
      primary: '24 Milestones',
      secondary: '18 completed',
      trend: 'up'
    },
    metadata: {
      completion: 75,
      nextAction: 'Update records',
      lastUpdated: '6 hours ago'
    }
  },
  {
    id: 'resource-library',
    title: 'Resources',
    description: 'Access professional materials',
    icon: <Video className="h-6 w-6" />,
    status: 'active',
    priority: 'low',
    actionText: 'Browse Library',
    actionLink: '/counselor/resources',
    stats: {
      primary: '200+ Resources',
      secondary: '5 new',
      trend: 'up'
    },
    metadata: {
      count: 200,
      nextAction: 'Check new materials',
      lastUpdated: '1 day ago'
    }
  }
];


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
  const { 
    assignedStudents, 
    activeChatSessions, 
    analytics, 
    loading, 
    error,
    logCounselorActivity,
    getDerivedMetrics
  } = useCounselorDashboard();

  // Transform static cards with dynamic data
  const getDynamicCounselorCards = (): CounselorDashboardCard[] => {
    const baseCards = [...counselorDashboardCards];
    const metrics = getDerivedMetrics;

    baseCards.forEach(card => {
      switch (card.id) {
        case 'assigned-students':
          card.stats = {
            primary: `${assignedStudents.length} Students`,
            secondary: `${metrics.urgentStudents} need immediate attention`,
            trend: metrics.urgentStudents > 5 ? 'up' : metrics.urgentStudents < 2 ? 'down' : 'stable'
          };
          card.metadata = {
            count: assignedStudents.length,
            nextAction: metrics.urgentStudents > 0 ? 'Review at-risk students' : 'Check student progress',
            urgent: metrics.urgentStudents > 0,
            lastUpdated: 'Live data'
          };
          card.status = metrics.urgentStudents > 3 ? 'attention' : 'active';
          card.priority = metrics.urgentStudents > 5 ? 'high' : 'medium';
          break;

        case 'active-chat-sessions': {
          const avgResponseTime = activeChatSessions.reduce((sum, session) => sum + session.responseTime, 0) / 
                                  (activeChatSessions.length || 1);
          card.stats = {
            primary: `${metrics.activeChats} Active`,
            secondary: `Avg response: ${Math.round(avgResponseTime / 60)} mins`,
            trend: avgResponseTime < 300000 ? 'up' : avgResponseTime > 600000 ? 'down' : 'stable' // 5-10 mins
          };
          card.metadata = {
            count: metrics.activeChats,
            nextAction: metrics.waitingChats > 0 ? 'Respond to waiting messages' : 'Monitor active chats',
            urgent: metrics.waitingChats > 0,
            lastUpdated: 'Live data'
          };
          card.status = metrics.activeChats > 0 ? 'active' : 'completed';
          card.priority = metrics.waitingChats > 0 ? 'high' : 'medium';
          break;
        }

        case 'upcoming-appointments': {
          const nextAppointment = metrics.nextAppointment;
          card.stats = {
            primary: `${metrics.todaysAppointments} Sessions`,
            secondary: nextAppointment 
              ? `Next: ${nextAppointment.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with ${nextAppointment.studentName}`
              : 'No upcoming sessions today',
            trend: metrics.todaysAppointments > 5 ? 'up' : 'stable'
          };
          card.metadata = {
            count: metrics.todaysAppointments,
            nextAction: nextAppointment ? 'Prepare for next session' : 'Schedule more sessions',
            lastUpdated: 'Live data'
          };
          card.status = nextAppointment ? 'scheduled' : 'completed';
          break;
        }

        case 'counseling-analytics':
          if (analytics) {
            card.stats = {
              primary: `${Math.round(analytics.successRate)}% Success`,
              secondary: `Student satisfaction: ${analytics.studentSatisfactionScore.toFixed(1)}/5`,
              trend: analytics.trend.sessionEffectiveness
            };
            card.metadata = {
              completion: analytics.successRate,
              nextAction: analytics.successRate < 80 ? 'Review session strategies' : 'Maintain excellence',
              lastUpdated: 'Live data'
            };
            card.status = analytics.successRate > 85 ? 'completed' : 'attention';
            card.priority = analytics.successRate < 70 ? 'high' : 'medium';
          }
          break;

        case 'pending-question-queue':
          card.stats = {
            primary: `${metrics.unansweredQuestions} Pending`,
            secondary: `${metrics.highPriorityQuestions} high priority`,
            trend: metrics.unansweredQuestions > 10 ? 'up' : metrics.unansweredQuestions < 5 ? 'down' : 'stable'
          };
          card.metadata = {
            count: metrics.unansweredQuestions,
            nextAction: metrics.highPriorityQuestions > 0 ? 'Answer urgent questions' : 'Continue responding',
            urgent: metrics.highPriorityQuestions > 0,
            lastUpdated: 'Live data'
          };
          card.status = metrics.unansweredQuestions > 8 ? 'attention' : 'active';
          card.priority = metrics.highPriorityQuestions > 2 ? 'high' : 'medium';
          break;

        default:
          break;
      }

      // Update priority based on overall workload
      if (metrics.totalWorkload > 15) {
        if (card.priority === 'medium') card.priority = 'high';
      } else if (metrics.totalWorkload < 5) {
        if (card.priority === 'high' && card.id !== 'active-chat-sessions') card.priority = 'medium';
      }
    });

    // Sort by urgency and priority for better counselor workflow
    return baseCards.sort((a, b) => {
      const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
      const statusWeight = { 'attention': 4, 'active': 3, 'scheduled': 2, 'completed': 1 };
      
      const aScore = priorityWeight[a.priority] + statusWeight[a.status] + (a.metadata.urgent ? 2 : 0);
      const bScore = priorityWeight[b.priority] + statusWeight[b.status] + (b.metadata.urgent ? 2 : 0);
      
      return bScore - aScore;
    });
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
  

  // Handle card clicks with activity logging
  const handleCardClick = (card: CounselorDashboardCard) => {
    logCounselorActivity('counselor_card_click', {
      cardId: card.id,
      cardTitle: card.title,
      priority: card.priority,
      status: card.status,
      currentStats: card.stats,
      urgentFlags: card.metadata.urgent || false,
      workloadLevel: getDerivedMetrics.totalWorkload
    });
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
        {loading ? (
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
                <div className="text-2xl font-bold text-amber-700">{assignedStudents.length}</div>
                <div className="text-sm text-amber-600">Assigned Students</div>
                {getDerivedMetrics.urgentStudents > 0 && (
                  <div className="text-xs text-amber-500 mt-1">
                    {getDerivedMetrics.urgentStudents} urgent
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className={`bg-gradient-to-r from-orange-25 to-orange-50 border-orange-100 ${getDerivedMetrics.activeChats > 5 ? 'ring-2 ring-orange-300' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">{getDerivedMetrics.activeChats}</div>
                <div className="text-sm text-orange-600">Active Chats</div>
                {getDerivedMetrics.waitingChats > 0 && (
                  <div className="text-xs text-orange-500 mt-1">
                    {getDerivedMetrics.waitingChats} waiting
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-25 to-blue-50 border-blue-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{getDerivedMetrics.todaysAppointments}</div>
                <div className="text-sm text-blue-600">Today's Sessions</div>
                {getDerivedMetrics.nextAppointment && (
                  <div className="text-xs text-blue-500 mt-1">
                    Next: {getDerivedMetrics.nextAppointment.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-emerald-25 to-emerald-50 border-emerald-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700">
                  {analytics ? analytics.studentSatisfactionScore.toFixed(1) : '--'}
                </div>
                <div className="text-sm text-emerald-600">Avg Satisfaction</div>
                {analytics && (
                  <div className="text-xs text-emerald-500 mt-1">
                    {analytics.successRate}% success rate
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span>Unable to load some counselor data: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workload Alert */}
      {!loading && getDerivedMetrics.totalWorkload > 15 && (
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
                  <div className="h-8 w-8 bg-amber-600 rounded-md flex items-center justify-center">
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-800 leading-tight">
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
                  onClick={() => handleCardClick(card)}
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