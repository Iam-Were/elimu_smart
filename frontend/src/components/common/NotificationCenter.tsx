import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  Calendar,
  AlertCircle,
  Loader2,
  AtSign,
  HelpCircle,
} from 'lucide-react';

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  switch (type) {
    case 'assessment_complete':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'counselor_response':
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case 'deadline_reminder':
      return <Calendar className="h-4 w-4 text-orange-600" />;
    case 'system':
      return <AlertCircle className="h-4 w-4 text-purple-600" />;
    case 'question_tagged':
      return <AtSign className="h-4 w-4 text-yellow-600" />;
    case 'question_response_needed':
      return <HelpCircle className="h-4 w-4 text-orange-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to action URL if provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-6 px-2 text-xs hover:bg-white dark:hover:bg-slate-700 transition-all"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll be notified about assessments, messages, and deadlines
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer transition-all ${
                  !notification.read
                    ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-0.5">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold line-clamp-1">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.createdAt)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
            <DropdownMenuItem
              className="text-center justify-center text-sm font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              onClick={() => navigate('/notifications')}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
