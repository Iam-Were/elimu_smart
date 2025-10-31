import React from 'react';
import { Activity, Clock, MessageSquare, Calendar, Target, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { useActivityFeed } from '../../hooks/counselor/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';

export const CounselorActivityFeed: React.FC = () => {
  const { activities, isLoading, error, refresh } = useActivityFeed(10);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'session':
        return <Calendar className="w-4 h-4" />;
      case 'assessment':
        return <Target className="w-4 h-4" />;
      case 'milestone':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'session':
        return 'bg-yellow-100 text-yellow-600';
      case 'assessment':
        return 'bg-purple-100 text-purple-600';
      case 'milestone':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'message':
        return (
          <div>
            <p className="font-medium text-sm text-gray-800">{activity.studentName}</p>
            <p className="text-xs text-gray-600 truncate">{activity.content}</p>
          </div>
        );
      case 'session':
        return (
          <div>
            <p className="font-medium text-sm text-gray-800">{activity.studentName}</p>
            <p className="text-xs text-gray-600">
              Session {activity.status === 'completed' ? 'completed' : 'scheduled'}
            </p>
          </div>
        );
      case 'assessment':
        return (
          <div>
            <p className="font-medium text-sm text-gray-800">{activity.studentName}</p>
            <p className="text-xs text-gray-600">Completed RIASEC: {activity.primaryType}</p>
          </div>
        );
      case 'milestone':
        return (
          <div>
            <p className="font-medium text-sm text-gray-800">{activity.studentName}</p>
            <p className="text-xs text-gray-600">{activity.title}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to load activities</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-yellow-600" />
          <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && activities.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                {getActivityText(activity)}
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
              {activity.type === 'message' && !activity.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" title="Unread" />
              )}
            </div>
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button className="text-xs text-yellow-600 hover:text-yellow-700 font-medium w-full text-center">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};
