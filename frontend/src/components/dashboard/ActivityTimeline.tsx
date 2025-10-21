import React from 'react';
import { Clock, CheckCircle, AlertCircle, BookOpen, MessageCircle, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface ActivityTimelineProps {
  maxItems?: number;
  className?: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  maxItems = 10,
  className = ''
}) => {
  const { userActivities, loading } = useDynamicDashboard();

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <BookOpen className="w-4 h-4" />;
      case 'session':
        return <Calendar className="w-4 h-4" />;
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group activities by date
  const groupActivitiesByDate = () => {
    const activities = userActivities.slice(0, maxItems);
    const grouped: { [key: string]: typeof activities } = {};

    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else if (date > new Date(today.getTime() - 7 * 86400000)) {
        groupKey = 'This Week';
      } else {
        groupKey = 'Earlier';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(activity);
    });

    return grouped;
  };

  const groupedActivities = groupActivitiesByDate();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userActivities || userActivities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start exploring assessments and guidance to see your activity here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96 px-6 pb-4">
          {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
            <div key={dateGroup} className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 sticky top-0 bg-white dark:bg-gray-800 py-2">
                {dateGroup}
              </h4>
              {activities.map((activity, index) => (
                <div key={activity.id || index}>
                  <div className="flex items-start gap-4 py-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                  {index < activities.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
