import { useState, useEffect, useCallback } from 'react';
import { getParse } from '@/config/parse';

export interface Notification {
  id: string;
  type: 'assessment_complete' | 'counselor_response' | 'deadline_reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getNotifications', { limit });

      // Transform backend data to frontend interface
      const transformedNotifications: Notification[] = result.map((notif: {
        id: string;
        type: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: { iso: string };
        actionUrl?: string;
      }) => ({
        id: notif.id,
        type: notif.type as Notification['type'],
        title: notif.title,
        message: notif.message,
        read: notif.read,
        createdAt: new Date(notif.createdAt.iso),
        actionUrl: notif.actionUrl,
      }));

      setNotifications(transformedNotifications);
      setUnreadCount(transformedNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
      // Graceful fallback - don't block UI
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const Parse = await getParse();

      // Optimistic update
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Backend update
      await Parse.Cloud.run('markNotificationAsRead', { notificationId });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // Silently fail - notification still marked locally
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const Parse = await getParse();

      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      // Backend update
      await Parse.Cloud.run('markAllNotificationsAsRead');
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  const createNotification = useCallback(async (params: {
    recipientId: string;
    title: string;
    message: string;
    type?: 'assessment_complete' | 'counselor_response' | 'deadline_reminder' | 'system';
    actionUrl?: string;
  }): Promise<boolean> => {
    try {
      const Parse = await getParse();
      await Parse.Cloud.run('createNotification', params);
      return true;
    } catch (err) {
      console.error('Failed to create notification:', err);
      return false;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
};
