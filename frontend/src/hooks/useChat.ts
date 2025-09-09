import { useState, useEffect, useCallback } from 'react';
import Parse from '../lib/parse';
import { useAuth } from './useAuth';

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

  // Live query subscriptions
  const [messageSubscription, setMessageSubscription] = useState<any | null>(null);
  const [roomSubscription, setRoomSubscription] = useState<any | null>(null);

  // Parse objects to interface converters
  const parseRoomToRoom = useCallback((parseRoom: Parse.Object): ChatRoom => {
    return {
      id: parseRoom.id || '',
      title: parseRoom.get('title'),
      type: parseRoom.get('type'),
      participants: parseRoom.get('participants'),
      lastMessage: parseRoom.get('lastMessage'),
      lastActivity: parseRoom.get('lastActivity'),
      messageCount: parseRoom.get('messageCount') || 0,
      isActive: parseRoom.get('isActive'),
      createdBy: parseRoom.get('createdBy')?.id || ''
    };
  }, []);

  const parseMessageToMessage = useCallback((parseMessage: Parse.Object): ChatMessage => {
    const sender = parseMessage.get('sender');
    const chatRoom = parseMessage.get('chatRoom');
    return {
      id: parseMessage.id || '',
      chatRoomId: chatRoom?.id || '',
      sender: {
        id: sender?.id || '',
        firstName: sender?.get('firstName') || '',
        lastName: sender?.get('lastName') || ''
      },
      message: parseMessage.get('message') || '',
      messageType: parseMessage.get('messageType') || 'text',
      timestamp: parseMessage.get('timestamp') || new Date(),
      isRead: parseMessage.get('isRead') || false,
      fileUrl: parseMessage.get('fileUrl'),
      fileName: parseMessage.get('fileName'),
      fileSize: parseMessage.get('fileSize')
    };
  }, []);

  // Load chat rooms
  const loadChatRooms = useCallback(async () => {
    if (!user) return;

    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const rooms = await Parse.Cloud.run('getChatRooms');
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
        error: 'Failed to load chat rooms', 
        isLoading: false 
      }));
    }
  }, [user, parseRoomToRoom]);

  // Load messages for a specific room
  const loadMessages = useCallback(async (chatRoomId: string) => {
    if (!user) return;

    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const messages = await Parse.Cloud.run('getChatMessages', { chatRoomId });
      const chatMessages = messages.map(parseMessageToMessage);
      
      setChatState(prev => ({ 
        ...prev, 
        messages: chatMessages, 
        isLoading: false 
      }));

      // Mark messages as read
      await Parse.Cloud.run('markMessagesAsRead', { chatRoomId });
    } catch (error) {
      console.error('Failed to load messages:', error);
      setChatState(prev => ({ 
        ...prev, 
        error: 'Failed to load messages', 
        isLoading: false 
      }));
    }
  }, [user, parseMessageToMessage]);

  // Send a message
  const sendMessage = useCallback(async (chatRoomId: string, message: string, messageType: 'text' | 'file' | 'image' = 'text') => {
    if (!user) return;

    try {
      const result = await Parse.Cloud.run('sendMessage', { 
        chatRoomId, 
        message, 
        messageType 
      });
      
      // Message will be received via live query, so no need to manually add
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState(prev => ({ 
        ...prev, 
        error: 'Failed to send message' 
      }));
      throw error;
    }
  }, [user]);

  // Create a new chat room
  const createChatRoom = useCallback(async (participantIds: string[], type: 'counseling' | 'mentoring' | 'group' = 'counseling', title?: string) => {
    if (!user) return;

    try {
      const result = await Parse.Cloud.run('createChatRoom', { 
        participantIds: [...participantIds, user.id], 
        type, 
        title 
      });
      
      const newRoom = parseRoomToRoom(result);
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

  // Set current room
  const setCurrentRoom = useCallback((room: ChatRoom) => {
    setChatState(prev => ({ ...prev, currentRoom: room }));
    loadMessages(room.id);
  }, [loadMessages]);

  // Setup live queries for real-time updates
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages in current room
    if (chatState.currentRoom) {
      const ChatMessage = Parse.Object.extend('ChatMessage');
      const messageQuery = new Parse.Query(ChatMessage);
      messageQuery.equalTo('chatRoom', {
        __type: 'Pointer',
        className: 'ChatRoom',
        objectId: chatState.currentRoom.id
      });

      const client = new Parse.LiveQueryClient({
        applicationId: 'elimu_smart_app',
        serverURL: 'ws://localhost:1337/parse',
        javascriptKey: 'your-javascript-key-here',
        masterKey: undefined,
        sessionToken: undefined,
        installationId: undefined
      });

      client.open();
      const subscription = client.subscribe(messageQuery);

      subscription?.on('create', (message: Parse.Object) => {
        const newMessage = parseMessageToMessage(message);
        setChatState(prev => ({ 
          ...prev, 
          messages: [...prev.messages, newMessage] 
        }));
      });

      setMessageSubscription(subscription);

      return () => {
        subscription?.unsubscribe();
        client.close();
      };
    }
  }, [user, chatState.currentRoom, parseMessageToMessage]);

  // Setup live queries for chat room updates
  useEffect(() => {
    if (!user) return;

    const ChatRoom = Parse.Object.extend('ChatRoom');
    const roomQuery = new Parse.Query(ChatRoom);
    roomQuery.containsAll('participants', [user.id]);

    const client = new Parse.LiveQueryClient({
      applicationId: 'elimu_smart_app',
      serverURL: 'ws://localhost:1337/parse',
      javascriptKey: 'your-javascript-key-here',
      masterKey: undefined,
      sessionToken: undefined,
      installationId: undefined
    });

    client.open();
    const subscription = client.subscribe(roomQuery);

    subscription?.on('update', (room: Parse.Object) => {
      const updatedRoom = parseRoomToRoom(room);
      setChatState(prev => ({
        ...prev,
        rooms: prev.rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r)
      }));
    });

    subscription?.on('create', (room: Parse.Object) => {
      const newRoom = parseRoomToRoom(room);
      setChatState(prev => ({ 
        ...prev, 
        rooms: [newRoom, ...prev.rooms] 
      }));
    });

    setRoomSubscription(subscription);

    return () => {
      subscription?.unsubscribe();
      client.close();
    };
  }, [user, parseRoomToRoom]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user, loadChatRooms]);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      if (messageSubscription) {
        messageSubscription.unsubscribe();
      }
      if (roomSubscription) {
        roomSubscription.unsubscribe();
      }
    };
  }, [messageSubscription, roomSubscription]);

  return {
    ...chatState,
    loadChatRooms,
    loadMessages,
    sendMessage,
    createChatRoom,
    setCurrentRoom
  };
};