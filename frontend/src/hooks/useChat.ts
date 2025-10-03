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
      // Create demo room for testing
      const demoRoom: ChatRoom = {
        id: 'demo-room-1',
        title: 'Career Counselor',
        type: 'counseling',
        participants: [user.id, 'counselor-1'],
        lastMessage: 'Welcome! How can I help you with your career planning?',
        lastActivity: new Date(),
        messageCount: 1,
        isActive: true,
        createdBy: 'counselor-1'
      };

      setChatState(prev => ({
        ...prev,
        rooms: [demoRoom],
        error: 'Using demo data - backend connection failed',
        isLoading: false
      }));
    }
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
    setCurrentRoom,
    loadChatRooms,
    createChatRoom
  };
};