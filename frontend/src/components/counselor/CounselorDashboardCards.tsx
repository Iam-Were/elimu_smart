import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCounselorDashboard } from '@/hooks/useCounselorDashboard';
import { 
  Users, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
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
    title: 'My Assigned Students',
    description: 'Manage and monitor progress of students under your guidance',
    icon: <Users className="h-6 w-6" />,
    status: 'attention',
    priority: 'high',
    actionText: 'View Students',
    actionLink: '/counselor/students',
    stats: {
      primary: '34 Students',
      secondary: '7 need immediate attention',
      trend: 'up'
    },
    metadata: {
      count: 34,
      nextAction: 'Review at-risk students',
      urgent: true,
      lastUpdated: '2 hours ago'
    }
  },
  {
    id: 'active-chat-sessions',
    title: 'Active Chat Sessions',
    description: 'Ongoing conversations with students requiring your guidance',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'active',
    priority: 'high',
    actionText: 'Join Chats',
    actionLink: '/counselor/chat',
    stats: {
      primary: '8 Active',
      secondary: 'Avg response: 3.2 mins',
      trend: 'stable'
    },
    metadata: {
      count: 8,
      nextAction: 'Respond to urgent messages',
      urgent: true,
      lastUpdated: '5 minutes ago'
    }
  },
  {
    id: 'upcoming-appointments',
    title: 'Today\'s Appointments',
    description: 'Scheduled counseling sessions and meetings for today',
    icon: <Calendar className="h-6 w-6" />,
    status: 'scheduled',
    priority: 'medium',
    actionText: 'View Schedule',
    actionLink: '/counselor/appointments',
    stats: {
      primary: '6 Sessions',
      secondary: 'Next: 2:30 PM with Sarah M.',
      trend: 'up'
    },
    metadata: {
      count: 6,
      nextAction: 'Prepare for next session',
      lastUpdated: '30 minutes ago'
    }
  },
  {
    id: 'counseling-analytics',
    title: 'Counseling Effectiveness',
    description: 'Track your impact and success metrics across all student interactions',
    icon: <BarChart3 className="h-6 w-6" />,
    status: 'completed',
    priority: 'medium',
    actionText: 'View Analytics',
    actionLink: '/counselor/analytics',
    stats: {
      primary: '89% Success',
      secondary: 'Student satisfaction: 4.7/5',
      trend: 'up'
    },
    metadata: {
      completion: 89,
      nextAction: 'Review monthly report',
      lastUpdated: '1 day ago'
    }
  },
  {
    id: 'pending-question-queue',
    title: 'Question Queue',
    description: 'Student questions awaiting your expert guidance and responses',
    icon: <FileText className="h-6 w-6" />,
    status: 'attention',
    priority: 'high',
    actionText: 'Answer Questions',
    actionLink: '/counselor/questions',
    stats: {
      primary: '15 Pending',
      secondary: '3 high priority',
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
    description: 'Manage group counseling sessions and workshops',
    icon: <UserCheck className="h-6 w-6" />,
    status: 'scheduled',
    priority: 'medium',
    actionText: 'Manage Groups',
    actionLink: '/counselor/group-sessions',
    stats: {
      primary: '4 Groups',
      secondary: 'Next workshop: Tomorrow 10 AM',
      trend: 'stable'
    },
    metadata: {
      count: 4,
      nextAction: 'Plan workshop activities',
      lastUpdated: '4 hours ago'
    }
  },
  {
    id: 'progress-tracking',
    title: 'Student Progress Tracking',
    description: 'Monitor academic and career development milestones',
    icon: <Target className="h-6 w-6" />,
    status: 'active',
    priority: 'medium',
    actionText: 'Track Progress',
    actionLink: '/counselor/progress',
    stats: {
      primary: '24 Milestones',
      secondary: '18 completed this month',
      trend: 'up'
    },
    metadata: {
      completion: 75,
      nextAction: 'Update progress records',
      lastUpdated: '6 hours ago'
    }
  },
  {
    id: 'resource-library',
    title: 'Counselor Resources',
    description: 'Access professional resources, guides, and best practices',
    icon: <Video className="h-6 w-6" />,
    status: 'active',
    priority: 'low',
    actionText: 'Browse Resources',
    actionLink: '/counselor/resources',
    stats: {
      primary: '200+ Resources',
      secondary: '5 new this week',
      trend: 'up'
    },
    metadata: {
      count: 200,
      nextAction: 'Review new materials',
      lastUpdated: '1 day ago'
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'attention':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'active':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'scheduled':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'attention':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'active':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'scheduled':
      return <Calendar className="h-4 w-4 text-orange-600" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

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

        case 'active-chat-sessions':
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

        case 'upcoming-appointments':
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
  
  // Responsive card sizing with proper content space
  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'p-4 min-h-[130px]'; // Sufficient space for metrics
      case 'large':
        return 'p-6 min-h-[220px]'; // Detailed information cards
      case 'medium':
      default:
        return 'p-5 min-h-[180px]'; // Standard information cards
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
  
  const getTitleSize = () => {
    switch (size) {
      case 'compact':
        return 'text-sm font-medium';
      case 'large':
        return 'text-lg font-semibold';
      case 'medium':
      default:
        return 'text-base font-medium';
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
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-amber-600 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className={`${getTitleSize()} text-slate-800`}>{card.title}</CardTitle>
                    {card.metadata.urgent && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        <Bell className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className={getStatusColor(card.status)}>
                  {getStatusIcon(card.status)}
                  <span className="ml-1 capitalize">{card.status}</span>
                </Badge>
              </div>
              {size !== 'compact' && (
                <CardDescription className="text-sm leading-relaxed text-slate-600">
                  {card.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-700">
                    {card.stats.primary}
                  </span>
                  {card.stats.trend && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-4 w-4 ${
                        card.stats.trend === 'up' ? 'text-green-600' : 
                        card.stats.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {card.stats.trend}
                      </span>
                    </div>
                  )}
                </div>
                {card.stats.secondary && (
                  <p className="text-sm text-slate-600">{card.stats.secondary}</p>
                )}
              </div>

              {card.metadata.completion !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-700">Completion</span>
                    <span className="text-slate-700 font-medium">{card.metadata.completion}%</span>
                  </div>
                  <Progress value={card.metadata.completion} className="h-2" />
                </div>
              )}

              {card.metadata.nextAction && (
                <div className="bg-amber-25 border border-amber-100 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-amber-700">Next Action</div>
                      <div className="text-xs text-amber-600">{card.metadata.nextAction}</div>
                    </div>
                  </div>
                </div>
              )}

              {card.metadata.lastUpdated && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated {card.metadata.lastUpdated}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white" 
                asChild
              >
                <a 
                  href={card.actionLink} 
                  className="flex items-center justify-center"
                  onClick={() => handleCardClick(card)}
                >
                  {card.actionText}
                  <ArrowRight className="ml-2 h-4 w-4" />
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