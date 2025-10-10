/**
 * Chat & Messaging API
 * Manages premium inbox feature: conversations, messages, read receipts
 */

import { getParse } from '@/config/parse';

export interface ChatRoom {
  objectId: string;
  title: string;
  participants: string[];
  lastActivity: Date;
  lastMessage?: string;
  messageCount: number;
  isActive: boolean;
  createdBy: {
    objectId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  objectId: string;
  chatRoom: {
    objectId: string;
    __type: 'Pointer';
    className: 'ChatRoom';
  };
  sender: {
    objectId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  message: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: Date;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationResult {
  objectId: string;
  title: string;
  participants: string[];
  lastActivity: string;
  lastMessage?: string;
  messageCount: number;
  isActive: boolean;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Internal types for Parse Server responses
interface ParseServerObject {
  id?: string;
  objectId?: string;
  get?: (key: string) => unknown;
  [key: string]: unknown;
}

/**
 * Get all chat rooms for the current user
 */
export async function getChatRooms(): Promise<ChatRoom[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getChatRooms');
    return result.map((room: ParseServerObject) => ({
      objectId: room.id || room.objectId,
      title: room.get ? room.get('title') : room.title,
      participants: room.get ? room.get('participants') : room.participants,
      lastActivity: room.get ? room.get('lastActivity') : new Date(room.lastActivity),
      lastMessage: room.get ? room.get('lastMessage') : room.lastMessage,
      messageCount: room.get ? room.get('messageCount') : room.messageCount,
      isActive: room.get ? room.get('isActive') : room.isActive,
      createdBy: room.get ? room.get('createdBy') : room.createdBy,
      createdAt: room.get ? room.get('createdAt') : new Date(room.createdAt),
      updatedAt: room.get ? room.get('updatedAt') : new Date(room.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to get chat rooms:', error);
    throw error;
  }
}

/**
 * Get messages for a specific chat room
 */
export async function getChatMessages(
  chatRoomId: string,
  limit: number = 50,
  skip: number = 0
): Promise<ChatMessage[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getChatMessages', {
      chatRoomId,
      limit,
      skip
    });

    return result.map((msg: ParseServerObject) => ({
      objectId: msg.id || msg.objectId,
      chatRoom: msg.get ? msg.get('chatRoom') : msg.chatRoom,
      sender: msg.get ? msg.get('sender') : msg.sender,
      message: msg.get ? msg.get('message') : msg.message,
      messageType: msg.get ? msg.get('messageType') : msg.messageType || 'text',
      fileUrl: msg.get ? msg.get('fileUrl') : msg.fileUrl,
      fileName: msg.get ? msg.get('fileName') : msg.fileName,
      fileSize: msg.get ? msg.get('fileSize') : msg.fileSize,
      timestamp: msg.get ? msg.get('timestamp') : new Date(msg.timestamp),
      isRead: msg.get ? msg.get('isRead') : msg.isRead,
      createdAt: msg.get ? msg.get('createdAt') : new Date(msg.createdAt),
      updatedAt: msg.get ? msg.get('updatedAt') : new Date(msg.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to get chat messages:', error);
    throw error;
  }
}

/**
 * Mark all messages in a chat room as read
 */
export async function markMessagesAsRead(chatRoomId: string): Promise<{ messagesMarked: number }> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('markMessagesAsRead', {
      chatRoomId
    });
    return result;
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
}

/**
 * Get inbox conversations with unread counts
 */
export async function getInboxConversations(
  limit: number = 20,
  skip: number = 0
): Promise<ConversationResult[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('getInboxConversations', {
      limit,
      skip
    });
    return result;
  } catch (error) {
    console.error('Failed to get inbox conversations:', error);
    throw error;
  }
}

/**
 * Search conversations by title
 */
export async function searchConversations(
  searchTerm: string,
  limit: number = 10
): Promise<ChatRoom[]> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('searchConversations', {
      searchTerm,
      limit
    });

    return result.map((room: ParseServerObject) => ({
      objectId: room.id || room.objectId,
      title: room.get ? room.get('title') : room.title,
      participants: room.get ? room.get('participants') : room.participants,
      lastActivity: room.get ? room.get('lastActivity') : new Date(room.lastActivity as string | Date),
      lastMessage: room.get ? room.get('lastMessage') : room.lastMessage,
      messageCount: room.get ? room.get('messageCount') : room.messageCount,
      isActive: room.get ? room.get('isActive') : room.isActive,
      createdBy: room.get ? room.get('createdBy') : room.createdBy,
      createdAt: room.get ? room.get('createdAt') : new Date(room.createdAt as string | Date),
      updatedAt: room.get ? room.get('updatedAt') : new Date(room.updatedAt as string | Date)
    } as ChatRoom));
  } catch (error) {
    console.error('Failed to search conversations:', error);
    throw error;
  }
}

/**
 * Archive a conversation
 */
export async function archiveConversation(chatRoomId: string): Promise<{ success: boolean }> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('archiveConversation', {
      chatRoomId
    });
    return result;
  } catch (error) {
    console.error('Failed to archive conversation:', error);
    throw error;
  }
}

/**
 * Send a multimedia message (text, image, or file)
 */
export async function sendMultimediaMessage(params: {
  chatRoomId: string;
  message: string;
  messageType?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}): Promise<ChatMessage> {
  const Parse = await getParse();

  try {
    const result = await Parse.Cloud.run('sendMultimediaMessage', params);

    return {
      objectId: result.id || result.objectId,
      chatRoom: result.get ? result.get('chatRoom') : result.chatRoom,
      sender: result.get ? result.get('sender') : result.sender,
      message: result.get ? result.get('message') : result.message,
      messageType: result.get ? result.get('messageType') : result.messageType || 'text',
      fileUrl: result.get ? result.get('fileUrl') : result.fileUrl,
      fileName: result.get ? result.get('fileName') : result.fileName,
      fileSize: result.get ? result.get('fileSize') : result.fileSize,
      timestamp: result.get ? result.get('timestamp') : new Date(result.timestamp),
      isRead: result.get ? result.get('isRead') : result.isRead,
      createdAt: result.get ? result.get('createdAt') : new Date(result.createdAt),
      updatedAt: result.get ? result.get('updatedAt') : new Date(result.updatedAt)
    };
  } catch (error) {
    console.error('Failed to send multimedia message:', error);
    throw error;
  }
}

/**
 * Send a simple text message (wrapper around sendMultimediaMessage)
 */
export async function sendMessage(
  chatRoomId: string,
  message: string
): Promise<ChatMessage> {
  return sendMultimediaMessage({
    chatRoomId,
    message,
    messageType: 'text'
  });
}
