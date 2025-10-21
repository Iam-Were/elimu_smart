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
  const getActivityIcon = (activityType: string) => {
    const type = activityType.toLowerCase();
    if (type.includes('assessment') || type.includes('test')) {
      return <BookOpen className="w-4 h-4" />;
    }
    if (type.includes('session') || type.includes('booking')) {
      return <Calendar className="w-4 h-4" />;
    }
    if (type.includes('message') || type.includes('chat')) {
      return <MessageCircle className="w-4 h-4" />;
    }
    if (type.includes('achievement') || type.includes('badge')) {
      return <Award className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  // Format activity title from activityType
  const formatActivityTitle = (activityType: string) => {
    return activityType
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get activity description from data
  const getActivityDescription = (activity: typeof userActivities[0]) => {
    const { data, pageUrl } = activity;

    // Try to extract meaningful description from data
    if (data.description && typeof data.description === 'string') {
      return data.description;
    }
    if (data.title && typeof data.title === 'string') {
      return data.title;
    }
    if (data.action && typeof data.action === 'string') {
      return data.action;
    }

    // Fallback to page URL
    return `Visited ${pageUrl}`;
  };

  // Get badge for activity
  const getActivityBadge = (activity: typeof userActivities[0]) => {
    const { data, activityType } = activity;

    // Check for status in data
    const status = data.status as string | undefined;
    if (status) {
      switch (status.toLowerCase()) {
        case 'completed':
        case 'complete':
          return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
        case 'pending':
        case 'in_progress':
          return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">In Progress</Badge>;
        case 'cancelled':
        case 'failed':
          return <Badge variant="destructive">Cancelled</Badge>;
      }
    }

    // Default badge based on activity type
    const type = activityType.toLowerCase();
    if (type.includes('view') || type.includes('visited')) {
      return <Badge variant="outline">Viewed</Badge>;
    }
    if (type.includes('click') || type.includes('interaction')) {
      return <Badge variant="outline">Interaction</Badge>;
    }

    return <Badge variant="secondary">Activity</Badge>;
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
        <ScrollArea className="h-64 sm:h-80 md:h-96 px-4 pb-3 sm:px-6 sm:pb-4">
          {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
            <div key={dateGroup} className="mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 sticky top-0 bg-white dark:bg-gray-800 py-2">
                {dateGroup}
              </h4>
              {activities.map((activity, index) => (
                <div key={`${activity.timestamp.getTime()}-${index}`}>
                  <div className="flex items-start gap-3 sm:gap-4 py-2 sm:py-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
                      {getActivityIcon(activity.activityType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {formatActivityTitle(activity.activityType)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {getActivityBadge(activity)}
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
