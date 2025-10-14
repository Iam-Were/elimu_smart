/**
 * Notification API
 * Manages user notifications for real-time alerts
 */

import { getParse } from '@/config/parse';

export interface Notification {
  objectId: string;
  recipient: {
    objectId: string;
    username?: string;
  };
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'chat';
  actionUrl?: string;
  chatRoomId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get user notifications
 */
export async function getNotifications(
  limit: number = 50,
  skip: number = 0,
  unreadOnly: boolean = false
): Promise<Notification[]> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('getNotifications', {
      limit,
      skip,
      unreadOnly
    });

    return result.map((notif: {
      id: string;
      recipient: { objectId: string; username?: string };
      title: string;
      message: string;
      type: string;
      actionUrl?: string;
      chatRoomId?: string;
      isRead: boolean;
      createdAt: { iso: string } | string;
      updatedAt: { iso: string } | string;
    }) => ({
      objectId: notif.id,
      recipient: notif.recipient,
      title: notif.title,
      message: notif.message,
      type: notif.type as 'info' | 'success' | 'warning' | 'error' | 'chat',
      actionUrl: notif.actionUrl,
      chatRoomId: notif.chatRoomId,
      isRead: notif.isRead,
      createdAt: new Date(typeof notif.createdAt === 'string' ? notif.createdAt : notif.createdAt.iso),
      updatedAt: new Date(typeof notif.updatedAt === 'string' ? notif.updatedAt : notif.updatedAt.iso)
    }));
  } catch (error) {
    console.error('Failed to get notifications:', error);
    throw error;
  }
}

/**
 * Create a notification (admin/counselor only)
 */
export async function createNotification(params: {
  recipientId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'chat';
  actionUrl?: string;
  chatRoomId?: string;
}): Promise<Notification> {
  const Parse = getParse();

  try {
    const result = await Parse.Cloud.run('createNotification', params);

    return {
      objectId: result.id,
      recipient: result.recipient,
      title: result.title,
      message: result.message,
      type: result.type,
      actionUrl: result.actionUrl,
      chatRoomId: result.chatRoomId,
      isRead: result.isRead,
      createdAt: new Date(result.createdAt.iso || result.createdAt),
      updatedAt: new Date(result.updatedAt.iso || result.updatedAt)
    };
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}
