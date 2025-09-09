import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Play,
  Video,
  UserCheck
} from 'lucide-react';

interface CounselorCard {
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
  };
}

const counselorCards: CounselorCard[] = [
  {
    id: 'students',
    title: 'Student Management',
    description: 'Monitor and support your assigned students\' career development journey',
    icon: <Users className="h-6 w-6" />,
    status: 'attention',
    priority: 'high',
    actionText: 'View Students',
    actionLink: '/counselor/students',
    stats: {
      primary: '52 Students',
      secondary: '5 need attention',
      trend: 'up'
    },
    metadata: {
      count: 52,
      nextAction: 'Review at-risk students',
      urgent: true
    }
  },
  {
    id: 'questions',
    title: 'Question Queue',
    description: 'Respond to student questions and provide guidance on career-related queries',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'active',
    priority: 'high',
    actionText: 'Answer Questions',
    actionLink: '/counselor/questions',
    stats: {
      primary: '12 Pending',
      secondary: 'Avg response: 2.4 hrs',
      trend: 'stable'
    },
    metadata: {
      count: 12,
      nextAction: 'Answer urgent questions',
      urgent: true
    }
  },
  {
    id: 'sessions',
    title: 'Counseling Sessions',
    description: 'Schedule and manage individual and group counseling sessions with students',
    icon: <Calendar className="h-6 w-6" />,
    status: 'scheduled',
    priority: 'medium',
    actionText: 'View Schedule',
    actionLink: '/counselor/sessions',
    stats: {
      primary: '8 Sessions',
      secondary: 'Next: Today 2:00 PM',
      trend: 'up'
    },
    metadata: {
      count: 8,
      nextAction: 'Prepare for next session'
    }
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    description: 'Track counseling effectiveness and student progress metrics',
    icon: <BarChart3 className="h-6 w-6" />,
    status: 'completed',
    priority: 'low',
    actionText: 'View Analytics',
    actionLink: '/counselor/analytics',
    stats: {
      primary: '87% Success',
      secondary: 'Student satisfaction: 4.8/5',
      trend: 'up'
    },
    metadata: {
      completion: 87,
      nextAction: 'Review monthly report'
    }
  },
  {
    id: 'group-sessions',
    title: 'Group Sessions',
    description: 'Organize and facilitate group counseling sessions for multiple students',
    icon: <UserCheck className="h-6 w-6" />,
    status: 'scheduled',
    priority: 'medium',
    actionText: 'Manage Groups',
    actionLink: '/counselor/group-sessions',
    stats: {
      primary: '3 Groups',
      secondary: 'Next: Tomorrow 10:00 AM',
      trend: 'stable'
    },
    metadata: {
      count: 3,
      nextAction: 'Plan group activities'
    }
  },
  {
    id: 'resources',
    title: 'Resource Library',
    description: 'Access and share career resources, guides, and educational materials',
    icon: <Video className="h-6 w-6" />,
    status: 'active',
    priority: 'low',
    actionText: 'Browse Resources',
    actionLink: '/counselor/resources',
    stats: {
      primary: '150+ Resources',
      secondary: '12 new this week',
      trend: 'up'
    },
    metadata: {
      count: 150,
      nextAction: 'Review new resources'
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
      return <Play className="h-4 w-4 text-blue-600" />;
    case 'scheduled':
      return <Clock className="h-4 w-4 text-orange-600" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'ring-2 ring-red-200 bg-gradient-to-br from-red-50/80 to-white';
    case 'medium':
      return 'ring-1 ring-yellow-200 bg-gradient-to-br from-yellow-50/50 to-white';
    default:
      return 'ring-1 ring-gray-200 bg-white';
  }
};

interface CounselorCardsProps {
  showAll?: boolean;
  maxCards?: number;
  className?: string;
}

export const CounselorCards: React.FC<CounselorCardsProps> = ({ 
  showAll = false, 
  maxCards = 4, 
  className 
}) => {
  const displayCards = showAll ? counselorCards : counselorCards.slice(0, maxCards);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Counselor Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage students, sessions, and track your counseling effectiveness
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">52</div>
            <div className="text-sm text-blue-600">Active Students</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">12</div>
            <div className="text-sm text-red-600">Pending Questions</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">8</div>
            <div className="text-sm text-orange-600">Today's Sessions</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">4.8</div>
            <div className="text-sm text-green-600">Satisfaction Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCards.map((card) => (
          <Card 
            key={card.id} 
            className={`hover:shadow-lg transition-all duration-200 ${getPriorityStyles(card.priority)}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    {card.metadata.urgent && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(card.status)}>
                  {getStatusIcon(card.status)}
                  <span className="ml-1">{card.status}</span>
                </Badge>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {card.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-yellow-700">
                    {card.stats.primary}
                  </span>
                  {card.stats.trend && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-4 w-4 ${
                        card.stats.trend === 'up' ? 'text-green-600' : 
                        card.stats.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`} />
                      <span className="text-xs text-muted-foreground">
                        {card.stats.trend}
                      </span>
                    </div>
                  )}
                </div>
                {card.stats.secondary && (
                  <p className="text-sm text-muted-foreground">{card.stats.secondary}</p>
                )}
              </div>

              {card.metadata.completion !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Completion</span>
                    <span>{card.metadata.completion}%</span>
                  </div>
                  <Progress value={card.metadata.completion} className="h-2" />
                </div>
              )}

              {card.metadata.nextAction && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-800">Next Action</div>
                      <div className="text-xs text-yellow-700">{card.metadata.nextAction}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800" 
                asChild
              >
                <a href={card.actionLink}>
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