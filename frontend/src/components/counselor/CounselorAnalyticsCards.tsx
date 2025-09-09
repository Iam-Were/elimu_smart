import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  MessageSquare, 
  Calendar,
  Target,
  Clock,
  CheckCircle,
  Star,
  BookOpen,
  Award,
  BarChart3
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  change: {
    percentage: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
  };
  details: string;
  category: 'performance' | 'engagement' | 'outcomes' | 'efficiency';
}

const counselorAnalytics: AnalyticsMetric[] = [
  {
    id: 'student-success-rate',
    title: 'Student Success Rate',
    description: 'Percentage of students achieving their career development goals',
    icon: <Target className="h-5 w-5" />,
    value: '89%',
    change: {
      percentage: 5.2,
      direction: 'up',
      period: 'vs last month'
    },
    details: '34 out of 38 students met their milestones',
    category: 'outcomes'
  },
  {
    id: 'avg-response-time',
    title: 'Average Response Time',
    description: 'Time taken to respond to student queries and concerns',
    icon: <Clock className="h-5 w-5" />,
    value: '2.3 hrs',
    change: {
      percentage: 12.5,
      direction: 'down',
      period: 'improvement this week'
    },
    details: 'Target: <3 hours | Best: 45 minutes',
    category: 'efficiency'
  },
  {
    id: 'session-completion',
    title: 'Session Completion Rate',
    description: 'Percentage of scheduled sessions successfully completed',
    icon: <CheckCircle className="h-5 w-5" />,
    value: '94%',
    change: {
      percentage: 2.1,
      direction: 'up',
      period: 'vs last quarter'
    },
    details: '47 of 50 sessions completed',
    category: 'performance'
  },
  {
    id: 'student-satisfaction',
    title: 'Student Satisfaction',
    description: 'Average rating from student feedback surveys',
    icon: <Star className="h-5 w-5" />,
    value: '4.7/5',
    change: {
      percentage: 4.4,
      direction: 'up',
      period: 'vs previous semester'
    },
    details: 'Based on 45 feedback responses',
    category: 'outcomes'
  },
  {
    id: 'active-students',
    title: 'Active Students',
    description: 'Number of students currently under guidance',
    icon: <Users className="h-5 w-5" />,
    value: '34',
    change: {
      percentage: 13.3,
      direction: 'up',
      period: 'new assignments this month'
    },
    details: 'Optimal range: 25-40 students',
    category: 'engagement'
  },
  {
    id: 'chat-engagement',
    title: 'Chat Engagement',
    description: 'Average messages per conversation thread',
    icon: <MessageSquare className="h-5 w-5" />,
    value: '12.4',
    change: {
      percentage: 8.7,
      direction: 'up',
      period: 'vs last month'
    },
    details: 'Higher engagement indicates better support',
    category: 'engagement'
  },
  {
    id: 'session-frequency',
    title: 'Sessions Per Week',
    description: 'Average number of counseling sessions conducted weekly',
    icon: <Calendar className="h-5 w-5" />,
    value: '18.5',
    change: {
      percentage: 6.2,
      direction: 'up',
      period: 'consistent growth'
    },
    details: 'Includes individual and group sessions',
    category: 'performance'
  },
  {
    id: 'resource-utilization',
    title: 'Resource Sharing',
    description: 'Resources shared with students per month',
    icon: <BookOpen className="h-5 w-5" />,
    value: '127',
    change: {
      percentage: 15.6,
      direction: 'up',
      period: 'increased sharing'
    },
    details: 'Career guides, articles, and tools',
    category: 'engagement'
  },
  {
    id: 'goal-achievement',
    title: 'Goal Achievement',
    description: 'Percentage of student goals successfully achieved',
    icon: <Award className="h-5 w-5" />,
    value: '76%',
    change: {
      percentage: 3.2,
      direction: 'up',
      period: 'steady improvement'
    },
    details: '92 of 121 set goals achieved',
    category: 'outcomes'
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'performance':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'engagement':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'outcomes':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'efficiency':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getTrendIcon = (direction: string) => {
  if (direction === 'up') {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (direction === 'down') {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <BarChart3 className="h-4 w-4 text-gray-600" />;
};

const getTrendColor = (direction: string) => {
  if (direction === 'up') return 'text-green-600';
  if (direction === 'down') return 'text-red-600';
  return 'text-gray-600';
};

interface CounselorAnalyticsCardsProps {
  className?: string;
  category?: 'performance' | 'engagement' | 'outcomes' | 'efficiency' | 'all';
  layout?: 'grid' | 'compact';
}

export const CounselorAnalyticsCards: React.FC<CounselorAnalyticsCardsProps> = ({ 
  className,
  category = 'all',
  layout = 'grid'
}) => {
  const filteredMetrics = category === 'all' 
    ? counselorAnalytics 
    : counselorAnalytics.filter(metric => metric.category === category);

  const gridClass = layout === 'compact' 
    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-yellow-900">
          Counseling Analytics Dashboard
        </h2>
        <p className="text-yellow-700">
          Track your impact and effectiveness across all student interactions
        </p>
      </div>

      {/* Category Filter Badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge className="bg-blue-100 text-blue-700">Performance</Badge>
        <Badge className="bg-green-100 text-green-700">Engagement</Badge>
        <Badge className="bg-purple-100 text-purple-700">Outcomes</Badge>
        <Badge className="bg-orange-100 text-orange-700">Efficiency</Badge>
      </div>

      {/* Summary Insights - Moved to Top */}
      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-800">Strengths</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• High student satisfaction (4.7/5)</li>
                <li>• Excellent session completion rate (94%)</li>
                <li>• Strong goal achievement (76%)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-800">Opportunities</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Continue reducing response time</li>
                <li>• Increase resource sharing frequency</li>
                <li>• Focus on at-risk student support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Cards */}
      <div className={gridClass}>
        {filteredMetrics.map((metric) => (
          <Card 
            key={metric.id} 
            className="hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-yellow-50/50 to-white border-yellow-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {metric.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-yellow-900">{metric.title}</CardTitle>
                    <Badge variant="outline" className={getCategoryColor(metric.category)}>
                      {metric.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm text-yellow-700">
                {metric.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Main Metric Value */}
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-yellow-800">
                  {metric.value}
                </div>
                
                {/* Trend Indicator */}
                <div className="flex items-center justify-center gap-2">
                  {getTrendIcon(metric.change.direction)}
                  <span className={`text-sm font-medium ${getTrendColor(metric.change.direction)}`}>
                    {metric.change.percentage}% {metric.change.period}
                  </span>
                </div>
              </div>

              {/* Progress Bar for percentage values */}
              {metric.value.includes('%') && (
                <div className="space-y-2">
                  <Progress 
                    value={parseInt(metric.value)} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Additional Details */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-sm text-yellow-700">
                  {metric.details}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CounselorAnalyticsCards;