// Offline Message Queue for handling messages when network is unavailable

interface QueuedMessage {
  id: string;
  chatRoomId: string;
  message: string;
  messageType: 'text' | 'file' | 'image';
  timestamp: Date;
  retries: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

const QUEUE_STORAGE_KEY = 'elimu_smart_offline_queue';
const MAX_RETRIES = 3;

class OfflineMessageQueue {
  private queue: QueuedMessage[] = [];
  private isProcessing = false;

  constructor() {
    this.loadQueue();
  }

  // Load queue from localStorage
  private loadQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  // Save queue to localStorage
  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  // Add message to queue
  enqueue(message: Omit<QueuedMessage, 'id' | 'retries'>) {
    const queuedMessage: QueuedMessage = {
      ...message,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retries: 0
    };

    this.queue.push(queuedMessage);
    this.saveQueue();
    console.log(`📥 Message queued (offline): ${queuedMessage.id}`);
    
    return queuedMessage.id;
  }

  // Remove message from queue
  dequeue(id: string) {
    this.queue = this.queue.filter(msg => msg.id !== id);
    this.saveQueue();
    console.log(`✅ Message removed from queue: ${id}`);
  }

  // Get all queued messages
  getQueue(): QueuedMessage[] {
    return [...this.queue];
  }

  // Get queued messages for specific room
  getQueueForRoom(chatRoomId: string): QueuedMessage[] {
    return this.queue.filter(msg => msg.chatRoomId === chatRoomId);
  }

  // Process queue (send all pending messages)
  async processQueue(sendFunction: (msg: QueuedMessage) => Promise<void>) {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`🔄 Processing offline queue (${this.queue.length} messages)`);

    const messagesToProcess = [...this.queue];

    for (const message of messagesToProcess) {
      try {
        await sendFunction(message);
        this.dequeue(message.id);
        console.log(`✅ Offline message sent: ${message.id}`);
      } catch (error) {
        console.error(`❌ Failed to send offline message: ${message.id}`, error);
        
        // Increment retry count
        message.retries++;
        
        // Remove if max retries exceeded
        if (message.retries >= MAX_RETRIES) {
          console.error(`🚫 Max retries exceeded for message: ${message.id}`);
          this.dequeue(message.id);
        } else {
          this.saveQueue();
        }
      }
    }

    this.isProcessing = false;
  }

  // Clear entire queue
  clearQueue() {
    this.queue = [];
    this.saveQueue();
    console.log('🗑️ Offline queue cleared');
  }

  // Get queue size
  size(): number {
    return this.queue.length;
  }
}

// Singleton instance
export const offlineQueue = new OfflineMessageQueue();

// Online/Offline detection
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Setup online/offline event listeners
export const setupOfflineHandlers = (
  onOnline: () => void,
  onOffline: () => void
) => {
  window.addEventListener('online', () => {
    console.log('🟢 Network connection restored');
    onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('🔴 Network connection lost');
    onOffline();
  });

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};
