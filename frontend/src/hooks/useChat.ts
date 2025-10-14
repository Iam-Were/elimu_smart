import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import ParseApi from '../lib/parseApi';

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
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatState {
  rooms: ChatRoom[];
  currentRoom?: ChatRoom;
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
  unreadCount: number;
}

export const useChat = () => {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    rooms: [],
    messages: [],
    isLoading: false,
    error: undefined,
    unreadCount: 0
  });

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
      const result = await ParseApi.callCloudFunction('getChatRooms', {});
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
        error: "Failed to load chat rooms",
        isLoading: false
      }));
  }, [user, parseRoomToRoom]);

  // Load messages for a specific room
  const loadMessages = useCallback(async (chatRoomId: string) => {
    if (!user) return;

    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const result = await ParseApi.callCloudFunction('getChatMessages', { chatRoomId });
      const messages = Array.isArray(result) ? result : [];
      const chatMessages = messages.map(parseMessageToMessage);

      setChatState(prev => ({
        ...prev,
        messages: chatMessages,
        isLoading: false
      }));

      // Mark messages as read
      try {
        await ParseApi.callCloudFunction('markMessagesAsRead', { chatRoomId });
      } catch (error) {
        console.warn('Failed to mark messages as read:', error);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Create demo messages for testing
      const demoMessages: ChatMessage[] = [
        {
          id: 'demo-msg-1',
          chatRoomId,
          sender: {
            id: 'counselor-1',
            firstName: 'Sarah',
            lastName: 'Johnson'
          },
          message: 'Hello! I\'m here to help with your career planning. What would you like to discuss?',
          messageType: 'text',
          timestamp: new Date(Date.now() - 60000),
          isRead: true
        },
        {
          id: 'demo-msg-2',
          chatRoomId,
          sender: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
          },
          message: 'Hi! I\'m not sure what career path to choose after Form 4.',
          messageType: 'text',
          timestamp: new Date(Date.now() - 30000),
          isRead: true
        }
      ];

      setChatState(prev => ({
        ...prev,
        messages: demoMessages,
        error: 'Using demo messages - backend connection failed',
        isLoading: false
      }));
    }
  }, [user, parseMessageToMessage]);

  // Send a message
  const sendMessage = useCallback(async (chatRoomId: string, message: string, messageType: 'text' | 'file' | 'image' = 'text') => {
    if (!user) return;

    try {
      const result = await ParseApi.callCloudFunction('sendMessage', {
        chatRoomId,
        message,
        messageType
      });

      // Reload messages to show the new message
      await loadMessages(chatRoomId);
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);

      // Add message locally for demo purposes
      const demoMessage: ChatMessage = {
        id: `demo-msg-${Date.now()}`,
        chatRoomId,
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        },
        message,
        messageType,
        timestamp: new Date(),
        isRead: true
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, demoMessage],
        error: 'Message sent locally - backend connection failed'
      }));

      return demoMessage;
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
      });

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
      const result = await ParseApi.callCloudFunction('getInboxConversations', { limit, skip });
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
      const result = await ParseApi.callCloudFunction('searchConversations', { searchTerm, limit });
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
      const result = await ParseApi.callCloudFunction('archiveConversation', { chatRoomId });

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
      const result = await ParseApi.callCloudFunction('sendMultimediaMessage', params);

      // Reload messages to show the new message
      await loadMessages(params.chatRoomId);
      return result;
    } catch (error) {
      console.error('Failed to send multimedia message:', error);

      // Add message locally for demo purposes
      const demoMessage: ChatMessage = {
        id: `demo-msg-${Date.now()}`,
        chatRoomId: params.chatRoomId,
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        },
        message: params.message,
        messageType: params.messageType || 'text',
        timestamp: new Date(),
        isRead: true,
        fileUrl: params.fileUrl,
        fileName: params.fileName,
        fileSize: params.fileSize
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, demoMessage],
        error: 'Message sent locally - backend connection failed'
      }));

      return demoMessage;
    }
  }, [user, loadMessages]);

  // Auto-refresh messages in current room (simple polling)
  useEffect(() => {
    if (!user || !chatState.currentRoom) return;

    const pollInterval = setInterval(() => {
      loadMessages(chatState.currentRoom!.id);
    }, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [user, chatState.currentRoom, loadMessages]);

  return {
    rooms: chatState.rooms,
    currentRoom: chatState.currentRoom,
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    unreadCount: chatState.unreadCount,
    sendMessage,
    sendMultimediaMessage,
    setCurrentRoom,
    loadChatRooms,
    getInboxConversations,
    searchConversations,
    archiveConversation,
    createChatRoom
  };
};