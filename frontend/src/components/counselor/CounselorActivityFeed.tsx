import React from 'react';
import { Activity as ActivityIcon, Clock, MessageSquare, Calendar, Target, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { useActivityFeed, type Activity } from '../../hooks/counselor/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import { IconContainer } from '../ui/icon-container';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export const CounselorActivityFeed: React.FC = () => {
  const { activities, isLoading, error, refresh } = useActivityFeed(10);

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, typeof MessageSquare> = {
      message: MessageSquare,
      session: Calendar,
      assessment: Target,
      milestone: Trophy,
    };
    return iconMap[type] || ActivityIcon;
  };

  const getActivityTheme = (type: string): 'neutral' | 'counselor' | 'student' => {
    switch (type) {
      case 'message':
        return 'neutral'; // Blue for info
      case 'session':
        return 'counselor'; // Yellow for counselor sessions
      case 'assessment':
        return 'student'; // Purple for assessments
      case 'milestone':
        return 'neutral'; // Will use green via custom class
      default:
        return 'neutral';
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'message':
        return (
          <div>
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{activity.studentName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{activity.content}</p>
          </div>
        );
      case 'session':
        return (
          <div>
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{activity.studentName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Session {activity.status === 'completed' ? 'completed' : 'scheduled'}
            </p>
          </div>
        );
      case 'assessment':
        return (
          <div>
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{activity.studentName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Completed RIASEC: {activity.primaryType}</p>
          </div>
        );
      case 'milestone':
        return (
          <div>
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{activity.studentName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">{activity.title}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 border border-slate-200/30 dark:border-slate-700/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Recent Activity</h3>
        </div>
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to load activities</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 border border-slate-200/30 dark:border-slate-700/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconContainer
            icon={ActivityIcon}
            emphasis="medium"
            theme="counselor"
            size="sm"
          />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Recent Activity</h3>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-colors"
          title="Refresh"
          aria-label="Refresh activity feed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && activities.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
          <ActivityIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <IconContainer
                icon={getActivityIcon(activity.type)}
                emphasis="subtle"
                theme={getActivityTheme(activity.type)}
                size="sm"
                className={activity.type === 'milestone' ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''}
              />
              <div className="flex-1 min-w-0">
                {getActivityText(activity)}
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
              {activity.type === 'message' && !activity.isRead && (
                <Badge
                  variant="destructive"
                  className="h-5 min-w-5 rounded-full px-1 text-[10px]"
                >
                  !
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <>
          <Separator className="my-3" />
          <button className="text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium w-full text-center transition-colors">
            View All Activity
          </button>
        </>
      )}
    </div>
  );
};
