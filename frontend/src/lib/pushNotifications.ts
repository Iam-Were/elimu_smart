// Push Notifications Service for browser notifications

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

class PushNotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  // Check if notifications are supported
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Get current permission status
  getPermission(): NotificationPermission {
    return this.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('⚠️ Notifications not supported in this browser');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log(`🔔 Notification permission: ${this.permission}`);
      return this.permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  // Show a notification
  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported) {
      console.warn('⚠️ Notifications not supported');
      return;
    }

    if (this.permission !== 'granted') {
      console.warn('⚠️ Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/logo.png',
        badge: options.badge || '/badge.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: false,
      });

      // Auto-close after 5 seconds if not requireInteraction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Handle notification click
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
        
        notification.close();
      };

      console.log('🔔 Notification shown:', options.title);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Show message notification
  async notifyNewMessage(sender: string, message: string, chatRoomId: string): Promise<void> {
    await this.showNotification({
      title: `New message from ${sender}`,
      body: message.length > 100 ? message.substring(0, 100) + '...' : message,
      tag: `message-${chatRoomId}`,
      data: {
        type: 'message',
        chatRoomId,
        url: `/inbox?room=${chatRoomId}`
      },
      requireInteraction: false
    });
  }

  // Show file notification
  async notifyNewFile(sender: string, fileName: string, chatRoomId: string): Promise<void> {
    await this.showNotification({
      title: `${sender} sent a file`,
      body: `📎 ${fileName}`,
      tag: `file-${chatRoomId}`,
      data: {
        type: 'file',
        chatRoomId,
        url: `/inbox?room=${chatRoomId}`
      }
    });
  }

  // Show status update notification
  async notifyMessageRead(sender: string): Promise<void> {
    await this.showNotification({
      title: 'Message Read',
      body: `${sender} read your message`,
      tag: 'message-read',
      data: { type: 'read' },
      requireInteraction: false
    });
  }

  // Clear all notifications with specific tag
  clearNotifications(tag: string): void {
    // Note: This requires Service Worker API
    console.log(`🗑️ Clearing notifications with tag: ${tag}`);
  }
}

// Singleton instance
export const pushNotificationService = new PushNotificationService();

// Helper to check if user is focused on tab
export const isTabFocused = (): boolean => {
  return document.hasFocus();
};

// Helper to check if notification should be shown
export const shouldShowNotification = (senderId: string, currentUserId: string): boolean => {
  // Don't notify for own messages
  if (senderId === currentUserId) {
    return false;
  }

  // Don't notify if tab is focused (user is already viewing)
  if (isTabFocused()) {
    return false;
  }

  return true;
};
