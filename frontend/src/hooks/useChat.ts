import { useState, useEffect, useCallback } from 'react';
import Parse from 'parse';
import { useAuth } from './useAuth';
import ParseApi from '../lib/parseApi';
import { offlineQueue, isOnline, setupOfflineHandlers } from '../lib/offlineQueue';
import { pushNotificationService, shouldShowNotification } from '../lib/pushNotifications';
import { chatAnalytics } from '../lib/chatAnalytics';

export interface ChatRoom {
  id: string;
  title: string;
  type: 'counseling' | 'mentoring' | 'group';
  participants: string[];
  lastMessage?: string;
  lastActivity: Date;
  messageCount: number;
  isActive: boolean;
  createdBy: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  message: string;
  messageType: 'text' | 'file' | 'image';
  timestamp: Date;
  isRead: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  reactions?: Array<{ emoji: string; users: string[]; count: number; }>;
}

export interface ChatState {
  rooms: ChatRoom[];
  currentRoom?: ChatRoom;
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
  unreadCount: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export const useChat = () => {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    rooms: [],
    messages: [],
    isLoading: false,
    connectionStatus: 'disconnected',
    error: undefined,
    unreadCount: 0
  });

  // Get session token for authenticated requests
  const getSessionToken = useCallback(() => {
    return Parse.User.current()?.getSessionToken() || undefined;
  }, []);

  // Convert API response to ChatRoom
  const parseRoomToRoom = useCallback((data: Record<string, unknown>): ChatRoom => {
    const createdBy = data.createdBy as Record<string, unknown> | string | undefined;
    return {
      id: (data.objectId || data.id || '') as string,
      title: (data.title || '') as string,
      type: (data.type || 'counseling') as 'counseling' | 'mentoring' | 'group',
      participants: (data.participants || []) as string[],
      lastMessage: (data.lastMessage || '') as string,
      lastActivity: data.lastActivity ? new Date(data.lastActivity as string | number | Date) : new Date(),
      messageCount: (data.messageCount || 0) as number,
      isActive: data.isActive !== false,
      createdBy: typeof createdBy === 'object' && createdBy ? (createdBy.objectId as string || '') : (createdBy as string || '')
    };
  }, []);

  // Convert API response to ChatMessage
  const parseMessageToMessage = useCallback((data: Record<string, unknown>): ChatMessage => {
    const sender = (data.sender || {}) as Record<string, unknown>;
    const chatRoom = data.chatRoom as Record<string, unknown> | undefined;

    return {
      id: (data.objectId || data.id || '') as string,
      chatRoomId: (chatRoom?.objectId || data.chatRoomId || '') as string,
      sender: {
        id: (sender.objectId || sender.id || '') as string,
        firstName: (sender.firstName || '') as string,
        lastName: (sender.lastName || '') as string
      },
      message: (data.message || '') as string,
      messageType: (data.messageType || 'text') as 'text' | 'file' | 'image',
      timestamp: data.timestamp ? new Date(data.timestamp as string | number | Date) : new Date(),
      isRead: data.isRead !== false,
      fileUrl: data.fileUrl as string | undefined,
      fileName: data.fileName as string | undefined,
      fileSize: data.fileSize as number | undefined
    };
  }, []);

  // Load chat rooms
  const loadChatRooms = useCallback(async () => {
    if (!user) return;

    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const result = await ParseApi.callCloudFunction('getChatRooms', {}, getSessionToken());
      const rooms = Array.isArray(result) ? result : [];
      const chatRooms = rooms.map(parseRoomToRoom);

      setChatState(prev => ({
        ...prev,
        rooms: chatRooms,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      setChatState(prev => ({
        ...prev,
        rooms: [],
        error: 'Failed to load chat rooms. Please try again.',
        isLoading: false
      }));
    }
  }, [user, parseRoomToRoom]);

  // Load messages for a specific room
  const loadMessages = useCallback(async (chatRoomId: string) => {
    if (!user) return;

    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const result = await ParseApi.callCloudFunction('getChatMessages', { chatRoomId }, getSessionToken());
      const messages = Array.isArray(result) ? result : [];
      const chatMessages = messages.map(parseMessageToMessage);

      setChatState(prev => ({
        ...prev,
        messages: chatMessages,
        isLoading: false
      }));

      // Mark messages as read
      try {
        await ParseApi.callCloudFunction('markMessagesAsRead', { chatRoomId }, getSessionToken());
      } catch (error) {
        console.warn('Failed to mark messages as read:', error);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setChatState(prev => ({
        ...prev,
        messages: [],
        error: 'Failed to load messages. Please try again.',
        isLoading: false
      }));
    }
  }, [user, parseMessageToMessage]);

  // Send a message
  const sendMessage = useCallback(async (chatRoomId: string, message: string, messageType: 'text' | 'file' | 'image' = 'text') => {
    if (!user) return;

    // Check if online
    if (!isOnline()) {
      console.log('📴 Offline: Queueing message');
      const queueId = offlineQueue.enqueue({
        chatRoomId,
        message,
        messageType,
        timestamp: new Date()
      });
      
      // Add optimistic message to UI
      const optimisticMessage = {
        id: queueId,
        chatRoomId,
        sender: {
          id: user.id,
          firstName: user.firstName || 'You',
          lastName: user.lastName || ''
        },
        message,
        messageType,
        timestamp: new Date(),
        isRead: false,
        status: 'sending' as const
      };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, optimisticMessage]
      }));
      
      return;
    }

    try {
      const result = await ParseApi.callCloudFunction('sendMessage', {
        chatRoomId,
        message,
        messageType
      }, getSessionToken());

      // Track analytics
      chatAnalytics.trackMessageSent(messageType);
      chatAnalytics.trackConversationActivity(chatRoomId);

      // Reload messages to show the new message
      await loadMessages(chatRoomId);
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // If network error, queue the message
      if (error instanceof Error && error.message.includes('network')) {
        console.log('📴 Network error: Queueing message');
        offlineQueue.enqueue({
          chatRoomId,
          message,
          messageType,
          timestamp: new Date()
        });
      }
      
      setChatState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.'
      }));
      throw error;
    }
  }, [user, loadMessages]);

  // Create a new chat room
  const createChatRoom = useCallback(async (participantIds: string[], type: 'counseling' | 'mentoring' | 'group' = 'counseling', title?: string) => {
    if (!user) return;

    try {
      const result = await ParseApi.callCloudFunction('createChatRoom', {
        participantIds: [...participantIds, user.id],
        type,
        title
      }, getSessionToken());

      const newRoom = parseRoomToRoom(result as unknown as Record<string, unknown>);
      setChatState(prev => ({
        ...prev,
        rooms: [newRoom, ...prev.rooms]
      }));

      return newRoom;
    } catch (error) {
      console.error('Failed to create chat room:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to create chat room'
      }));
      throw error;
    }
  }, [user, parseRoomToRoom]);

  // Set current room and load its messages
  const setCurrentRoom = useCallback((room: ChatRoom | undefined) => {
    setChatState(prev => ({ ...prev, currentRoom: room }));
    if (room) {
      loadMessages(room.id);
    } else {
      setChatState(prev => ({ ...prev, messages: [] }));
    }
  }, [loadMessages]);

  // Load chat rooms on mount and when user changes
  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user, loadChatRooms]);

  // Get inbox conversations with unread counts
  const getInboxConversations = useCallback(async (limit = 20, skip = 0) => {
    if (!user) return [];

    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const result = await ParseApi.callCloudFunction('getInboxConversations', { limit, skip }, getSessionToken());
      const conversations = Array.isArray(result) ? result : [];

      // Transform to ChatRoom format with unread counts
      const chatRooms = conversations.map((conv: Record<string, unknown>) => ({
        ...parseRoomToRoom(conv),
        unreadCount: (conv.unreadCount || 0) as number
      }));

      setChatState(prev => ({
        ...prev,
        rooms: chatRooms,
        isLoading: false
      }));

      return chatRooms;
    } catch (error) {
      console.error('Failed to get inbox conversations:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to load conversations',
        isLoading: false
      }));
      return [];
    }
  }, [user, parseRoomToRoom]);

  // Search conversations by title
  const searchConversations = useCallback(async (searchTerm: string, limit = 10) => {
    if (!user || !searchTerm.trim()) return [];

    try {
      const result = await ParseApi.callCloudFunction('searchConversations', { searchTerm, limit }, getSessionToken());
      const rooms = Array.isArray(result) ? result : [];
      return rooms.map(parseRoomToRoom);
    } catch (error) {
      console.error('Failed to search conversations:', error);
      return [];
    }
  }, [user, parseRoomToRoom]);

  // Archive a conversation
  const archiveConversation = useCallback(async (chatRoomId: string): Promise<{ success: boolean }> => {
    if (!user) return { success: false };

    try {
      const result = await ParseApi.callCloudFunction('archiveConversation', { chatRoomId }, getSessionToken());

      // Remove archived room from state
      setChatState(prev => ({
        ...prev,
        rooms: prev.rooms.filter(room => room.id !== chatRoomId),
        currentRoom: prev.currentRoom?.id === chatRoomId ? undefined : prev.currentRoom,
        messages: prev.currentRoom?.id === chatRoomId ? [] : prev.messages
      }));

      // Type-safe return
      return { success: (result as unknown as Record<string, unknown>).success === true };
    } catch (error) {
      console.error('Failed to archive conversation:', error);
      return { success: false };
    }
  }, [user]);

  // Send multimedia message (text, image, or file)
  const sendMultimediaMessage = useCallback(async (params: {
    chatRoomId: string;
    message: string;
    messageType?: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) => {
    if (!user) return;

    try {
      const result = await ParseApi.callCloudFunction('sendMultimediaMessage', params, getSessionToken());

      // Reload messages to show the new message
      await loadMessages(params.chatRoomId);
      return result;
    } catch (error) {
      console.error('Failed to send multimedia message:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.'
      }));
      throw error;
    }
  }, [user, loadMessages]);

  // Update message status (delivered/read)
  const updateMessageStatus = useCallback(async (messageId: string, status: 'delivered' | 'read') => {
    if (!user) return;

    try {
      await ParseApi.callCloudFunction('updateMessageStatus', { messageId, status }, getSessionToken());
      
      // Update local state
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, status, isRead: status === 'read' } : msg
        )
      }));
    } catch (error) {
      console.error('Failed to update message status:', error);
    }
  }, [user]);

  // Mark all messages in room as delivered/read
  const updateRoomMessagesStatus = useCallback(async (chatRoomId: string, status: 'delivered' | 'read') => {
    if (!user) return;

    try {
      await ParseApi.callCloudFunction('updateRoomMessagesStatus', { chatRoomId, status }, getSessionToken());
      
      // Update local state
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.sender.id !== user.id ? { ...msg, status, isRead: status === 'read' } : msg
        )
      }));
    } catch (error) {
      console.error('Failed to update room messages status:', error);
    }
  }, [user]);

  // Real-time message updates with Parse Live Query
  useEffect(() => {
    if (!user || !chatState.currentRoom) return;

    const currentRoomId = chatState.currentRoom.id;
    let subscription: any; // LiveQuerySubscription type not exported from Parse
    let retryCount = 0;
    let retryTimeout: NodeJS.Timeout;
    let isUnmounting = false;

    // Create query for messages in current room
    const query = new Parse.Query('ChatMessage');
    query.equalTo('chatRoomId', currentRoomId);

    // Subscribe to live updates (async)
    const setupSubscription = async () => {
      if (isUnmounting) return;

      try {
        setChatState(prev => ({ ...prev, connectionStatus: 'connecting' }));
        subscription = await query.subscribe();

        // Reset retry count on successful connection
        retryCount = 0;

        // Connection established
        subscription.on('open', () => {
          setChatState(prev => ({ ...prev, connectionStatus: 'connected' }));
          console.log(`🟢 Live Query connected for room: ${currentRoomId}`);
        });

        // Connection closed - attempt reconnect with exponential backoff
        subscription.on('close', () => {
          setChatState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
          console.log(`🔴 Live Query disconnected for room: ${currentRoomId}`);
          
          if (!isUnmounting) {
            // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max)
            const delay = Math.min(1000 * Math.pow(2, retryCount), 16000);
            retryCount++;
            
            console.log(`⏳ Reconnecting in ${delay}ms (attempt ${retryCount})...`);
            retryTimeout = setTimeout(() => setupSubscription(), delay);
          }
        });

        // Handle new messages
        subscription.on('create', (parseMessage: Parse.Object) => {
          const newMessage = parseMessageToMessage(parseMessage.toJSON() as Record<string, unknown>);
          
          // Track analytics for received messages (not own messages)
          if (user && newMessage.sender.id !== user.id) {
            chatAnalytics.trackMessageReceived(newMessage.messageType);
            chatAnalytics.trackConversationActivity(newMessage.chatRoomId);
          }
          
          // Show notification if from another user and tab not focused
          if (user && shouldShowNotification(newMessage.sender.id, user.id)) {
            if (newMessage.messageType === 'text') {
              pushNotificationService.notifyNewMessage(
                `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
                newMessage.message,
                newMessage.chatRoomId
              );
            } else {
              pushNotificationService.notifyNewFile(
                `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
                newMessage.fileName || 'File',
                newMessage.chatRoomId
              );
            }
          }
          
          setChatState(prev => {
            // Avoid duplicates
            if (prev.messages.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return {
              ...prev,
              messages: [...prev.messages, newMessage]
            };
          });
        });

        // Handle message updates (reactions, edits, read status)
        subscription.on('update', (parseMessage: Parse.Object) => {
          const updatedMessage = parseMessageToMessage(parseMessage.toJSON() as Record<string, unknown>);
          
          setChatState(prev => ({
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          }));
        });

        // Handle message deletions
        subscription.on('delete', (parseMessage: Parse.Object) => {
          const deletedMessageId = parseMessage.id;
          
          setChatState(prev => ({
            ...prev,
            messages: prev.messages.filter(msg => msg.id !== deletedMessageId)
          }));
        });

        // Handle subscription errors
        subscription.on('error', (error: Error) => {
          console.error('Live Query subscription error:', error);
          // Optionally show error to user or fallback to polling
        });

        console.log(`🔴 Live Query subscription active for room: ${currentRoomId}`);
      } catch (error) {
        console.error('Failed to setup Live Query subscription:', error);
        
        // Retry on error with exponential backoff
        if (!isUnmounting) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 16000);
          retryCount++;
          console.log(`⏳ Retrying in ${delay}ms after error...`);
          retryTimeout = setTimeout(() => setupSubscription(), delay);
        }
      }
    };

    setupSubscription();

    // Cleanup subscription on unmount or room change
    return () => {
      isUnmounting = true;
      clearTimeout(retryTimeout);
      if (subscription) {
        subscription.unsubscribe();
        console.log(`🔴 Live Query subscription closed for room: ${currentRoomId}`);
      }
    };
  }, [user, chatState.currentRoom, parseMessageToMessage]);

  // Process offline queue when connection restored
  useEffect(() => {
    const cleanup = setupOfflineHandlers(
      () => {
        // Online - process queue
        console.log('🟢 Connection restored, processing offline queue');
        offlineQueue.processQueue(async (queuedMsg) => {
          await ParseApi.callCloudFunction('sendMessage', {
            chatRoomId: queuedMsg.chatRoomId,
            message: queuedMsg.message,
            messageType: queuedMsg.messageType
          }, getSessionToken());
          
          // Reload messages for the room if it's currently active
          if (chatState.currentRoom?.id === queuedMsg.chatRoomId) {
            await loadMessages(queuedMsg.chatRoomId);
          }
        });
      },
      () => {
        // Offline
        console.log('🔴 Connection lost - messages will be queued');
      }
    );

    return cleanup;
  }, [chatState.currentRoom, loadMessages]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    const permission = await pushNotificationService.requestPermission();
    return permission === 'granted';
  }, []);

  // Get analytics summary
  const getAnalyticsSummary = useCallback(() => {
    return chatAnalytics.getSummaryReport();
  }, []);

  return {
    rooms: chatState.rooms,
    currentRoom: chatState.currentRoom,
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    unreadCount: chatState.unreadCount,
    connectionStatus: chatState.connectionStatus,
    offlineQueueSize: offlineQueue.size(),
    notificationPermission: pushNotificationService.getPermission(),
    requestNotificationPermission,
    getAnalyticsSummary,
    sendMessage,
    sendMultimediaMessage,
    updateMessageStatus,
    updateRoomMessagesStatus,
    setCurrentRoom,
    loadChatRooms,
    getInboxConversations,
    searchConversations,
    archiveConversation,
    createChatRoom
  };
};
