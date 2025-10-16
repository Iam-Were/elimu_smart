// Analytics service for tracking messaging metrics

interface MessageAnalytics {
  messagesSent: number;
  messagesReceived: number;
  filesShared: number;
  averageResponseTime: number; // in seconds
  activeConversations: number;
  totalConversations: number;
  mostActiveDay: string;
  peakHour: number;
}

interface DailyStats {
  date: string;
  messagesSent: number;
  messagesReceived: number;
  filesShared: number;
}

class ChatAnalyticsService {
  private storageKey = 'elimu_smart_chat_analytics';
  private dailyStatsKey = 'elimu_smart_daily_stats';

  // Track message sent
  trackMessageSent(messageType: 'text' | 'file' | 'image' = 'text') {
    const analytics = this.getAnalytics();
    analytics.messagesSent++;
    
    if (messageType !== 'text') {
      analytics.filesShared++;
    }
    
    this.updateDailyStats('sent', messageType !== 'text');
    this.saveAnalytics(analytics);
    console.log('📊 Message sent tracked');
  }

  // Track message received
  trackMessageReceived(messageType: 'text' | 'file' | 'image' = 'text') {
    const analytics = this.getAnalytics();
    analytics.messagesReceived++;
    
    if (messageType !== 'text') {
      analytics.filesShared++;
    }
    
    this.updateDailyStats('received', messageType !== 'text');
    this.saveAnalytics(analytics);
    console.log('📊 Message received tracked');
  }

  // Track conversation activity
  trackConversationActivity(chatRoomId: string) {
    const activeConversations = this.getActiveConversations();
    const now = Date.now();
    
    activeConversations.set(chatRoomId, now);
    
    // Clean up old activity (> 24 hours)
    const yesterday = now - 24 * 60 * 60 * 1000;
    activeConversations.forEach((timestamp, roomId) => {
      if (timestamp < yesterday) {
        activeConversations.delete(roomId);
      }
    });
    
    localStorage.setItem('elimu_smart_active_conversations', 
      JSON.stringify(Array.from(activeConversations.entries())));
    
    const analytics = this.getAnalytics();
    analytics.activeConversations = activeConversations.size;
    this.saveAnalytics(analytics);
  }

  // Track response time
  trackResponseTime(seconds: number) {
    const analytics = this.getAnalytics();
    const totalResponses = analytics.messagesReceived || 1;
    
    // Calculate running average
    analytics.averageResponseTime = 
      ((analytics.averageResponseTime * (totalResponses - 1)) + seconds) / totalResponses;
    
    this.saveAnalytics(analytics);
  }

  // Get current analytics
  getAnalytics(): MessageAnalytics {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    
    return {
      messagesSent: 0,
      messagesReceived: 0,
      filesShared: 0,
      averageResponseTime: 0,
      activeConversations: 0,
      totalConversations: 0,
      mostActiveDay: 'Monday',
      peakHour: 14
    };
  }

  // Get daily stats for last 7 days
  getDailyStats(): DailyStats[] {
    try {
      const stored = localStorage.getItem(this.dailyStatsKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load daily stats:', error);
    }
    
    return [];
  }

  // Update daily stats
  private updateDailyStats(type: 'sent' | 'received', isFile: boolean) {
    const stats = this.getDailyStats();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    let todayStats = stats.find(s => s.date === today);
    
    if (!todayStats) {
      todayStats = {
        date: today,
        messagesSent: 0,
        messagesReceived: 0,
        filesShared: 0
      };
      stats.push(todayStats);
    }
    
    if (type === 'sent') {
      todayStats.messagesSent++;
    } else {
      todayStats.messagesReceived++;
    }
    
    if (isFile) {
      todayStats.filesShared++;
    }
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = stats.filter(s => new Date(s.date) >= thirtyDaysAgo);
    
    localStorage.setItem(this.dailyStatsKey, JSON.stringify(filtered));
  }

  // Save analytics
  private saveAnalytics(analytics: MessageAnalytics) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  // Get active conversations
  private getActiveConversations(): Map<string, number> {
    try {
      const stored = localStorage.getItem('elimu_smart_active_conversations');
      if (stored) {
        return new Map(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load active conversations:', error);
    }
    
    return new Map();
  }

  // Get summary report
  getSummaryReport() {
    const analytics = this.getAnalytics();
    const dailyStats = this.getDailyStats();
    
    const totalMessages = analytics.messagesSent + analytics.messagesReceived;
    const avgMessagesPerDay = dailyStats.length > 0 
      ? totalMessages / dailyStats.length 
      : 0;
    
    return {
      ...analytics,
      totalMessages,
      avgMessagesPerDay: Math.round(avgMessagesPerDay * 10) / 10,
      last7Days: dailyStats.slice(-7)
    };
  }

  // Reset analytics
  reset() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.dailyStatsKey);
    localStorage.removeItem('elimu_smart_active_conversations');
    console.log('🗑️ Analytics reset');
  }
}

// Singleton instance
export const chatAnalytics = new ChatAnalyticsService();
