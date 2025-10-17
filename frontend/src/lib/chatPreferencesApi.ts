/**
 * Chat Preferences API
 * Frontend wrapper for chat preference Cloud Functions
 * Handles pin/star/reactions syncing across devices
 */

import { getParse } from '@/config/parse';

const getSessionToken = (): string => {
  return localStorage.getItem('parse-session-token') || '';
};

// ============================================================================
// CONVERSATION PREFERENCES (Pin/Mute/Archive)
// ============================================================================

export interface TogglePinResult {
  success: boolean;
  isPinned: boolean;
}

/**
 * Toggle pin status for a conversation
 * @param conversationId - ChatRoom ID
 * @returns { success, isPinned }
 */
export async function togglePinConversation(conversationId: string): Promise<TogglePinResult> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to pin conversations');
  }

  try {
    const result = await Parse.Cloud.run('togglePinConversation', { conversationId }, { sessionToken });
    return result as TogglePinResult;
  } catch (error) {
    console.error('Failed to toggle pin conversation:', error);
    throw error;
  }
}

/**
 * Get all pinned conversations for current user
 * @returns Array of conversation IDs
 */
export async function getPinnedConversations(): Promise<string[]> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to get pinned conversations');
  }

  try {
    const result = await Parse.Cloud.run('getPinnedConversations', {}, { sessionToken });
    return result as string[];
  } catch (error) {
    console.error('Failed to get pinned conversations:', error);
    throw error;
  }
}

// ============================================================================
// MESSAGE PREFERENCES (Star)
// ============================================================================

export interface ToggleStarResult {
  success: boolean;
  isStarred: boolean;
}

/**
 * Toggle star status for a message
 * @param messageId - ChatMessage ID
 * @param conversationId - ChatRoom ID (for grouping)
 * @returns { success, isStarred }
 */
export async function toggleStarMessage(messageId: string, conversationId: string): Promise<ToggleStarResult> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to star messages');
  }

  try {
    const result = await Parse.Cloud.run('toggleStarMessage', { messageId, conversationId }, { sessionToken });
    return result as ToggleStarResult;
  } catch (error) {
    console.error('Failed to toggle star message:', error);
    throw error;
  }
}

export interface StarredMessagesResult {
  byConversation: Record<string, string[]>;
}

/**
 * Get all starred messages for current user
 * @param conversationId - Optional: filter by conversation
 * @returns { byConversation: Record<conversationId, messageId[]> }
 */
export async function getStarredMessages(conversationId?: string): Promise<StarredMessagesResult> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to get starred messages');
  }

  try {
    const result = await Parse.Cloud.run('getStarredMessages', { conversationId }, { sessionToken });
    return result as StarredMessagesResult;
  } catch (error) {
    console.error('Failed to get starred messages:', error);
    throw error;
  }
}

// ============================================================================
// MESSAGE REACTIONS (Emoji)
// ============================================================================

export interface ToggleReactionResult {
  success: boolean;
  added: boolean;
  reactionCount: number;
}

/**
 * Toggle reaction on a message
 * @param messageId - ChatMessage ID
 * @param emoji - Emoji to toggle (e.g., '👍', '❤️')
 * @returns { success, added, reactionCount }
 */
export async function toggleReaction(messageId: string, emoji: string): Promise<ToggleReactionResult> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to react to messages');
  }

  if (!emoji || emoji.length > 10) {
    throw new Error('Invalid emoji format');
  }

  try {
    const result = await Parse.Cloud.run('toggleReaction', { messageId, emoji }, { sessionToken });
    return result as ToggleReactionResult;
  } catch (error) {
    console.error('Failed to toggle reaction:', error);
    throw error;
  }
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

/**
 * Get all reactions for a message
 * @param messageId - ChatMessage ID
 * @returns Array of { emoji, users, count }
 */
export async function getMessageReactions(messageId: string): Promise<MessageReaction[]> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to view reactions');
  }

  try {
    const result = await Parse.Cloud.run('getMessageReactions', { messageId }, { sessionToken });
    return result as MessageReaction[];
  } catch (error) {
    console.error('Failed to get message reactions:', error);
    throw error;
  }
}

/**
 * Get reactions for multiple messages (bulk query for performance)
 * @param messageIds - Array of ChatMessage IDs (max 100)
 * @returns { messageId: [{ emoji, users, count }] }
 */
export async function getBulkMessageReactions(messageIds: string[]): Promise<Record<string, MessageReaction[]>> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to view reactions');
  }

  if (!messageIds || messageIds.length === 0) {
    return {};
  }

  // Limit to 100 messages per request (backend enforces this)
  const limitedIds = messageIds.slice(0, 100);

  try {
    const result = await Parse.Cloud.run('getBulkMessageReactions', { messageIds: limitedIds }, { sessionToken });
    return result as Record<string, MessageReaction[]>;
  } catch (error) {
    console.error('Failed to get bulk reactions:', error);
    throw error;
  }
}

// ============================================================================
// BULK OPERATIONS (Load all preferences at once)
// ============================================================================

export interface UserChatPreferences {
  pinnedConversations: string[];
  starredMessages: Record<string, string[]>;
}

/**
 * Get all chat preferences for current user (for initial load)
 * @param conversationId - Optional: filter starred messages by conversation
 * @returns { pinnedConversations, starredMessages }
 */
export async function getUserChatPreferences(conversationId?: string): Promise<UserChatPreferences> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('User must be authenticated to get chat preferences');
  }

  try {
    const result = await Parse.Cloud.run('getUserChatPreferences', { conversationId }, { sessionToken });
    return result as UserChatPreferences;
  } catch (error) {
    console.error('Failed to get user chat preferences:', error);
    throw error;
  }
}

// ============================================================================
// MIGRATION UTILITY (localStorage → Backend)
// ============================================================================

/**
 * Migrate localStorage preferences to backend (one-time migration)
 * Call this on first load after deploying backend sync
 */
export async function migrateLocalStorageToBackend(): Promise<{ success: boolean; migrated: number }> {
  const Parse = await getParse();
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    console.warn('Cannot migrate: user not authenticated');
    return { success: false, migrated: 0 };
  }

  let migrated = 0;

  try {
    // Migrate pinned conversations
    const pinnedData = localStorage.getItem('elimu_smart_pinned_conversations');
    if (pinnedData) {
      const pinnedIds: string[] = JSON.parse(pinnedData);
      for (const conversationId of pinnedIds) {
        try {
          await Parse.Cloud.run('togglePinConversation', { conversationId }, { sessionToken });
          migrated++;
        } catch (error) {
          console.warn(`Failed to migrate pin for ${conversationId}:`, error);
        }
      }
      console.log(`✅ Migrated ${pinnedIds.length} pinned conversations`);
    }

    // Migrate starred messages
    const starredData = localStorage.getItem('elimu_smart_starred_messages');
    if (starredData) {
      const starredByConv: Record<string, string[]> = JSON.parse(starredData);
      for (const [conversationId, messageIds] of Object.entries(starredByConv)) {
        for (const messageId of messageIds) {
          try {
            await Parse.Cloud.run('toggleStarMessage', { messageId, conversationId }, { sessionToken });
            migrated++;
          } catch (error) {
            console.warn(`Failed to migrate star for ${messageId}:`, error);
          }
        }
      }
      console.log(`✅ Migrated starred messages from ${Object.keys(starredByConv).length} conversations`);
    }

    // Migrate reactions
    const reactionsData = localStorage.getItem('elimu_smart_message_reactions');
    if (reactionsData) {
      const reactionsByMsg: Record<string, Array<{ emoji: string; userId: string }>> = JSON.parse(reactionsData);
      for (const [messageId, reactions] of Object.entries(reactionsByMsg)) {
        for (const reaction of reactions) {
          try {
            await Parse.Cloud.run('toggleReaction', { messageId, emoji: reaction.emoji }, { sessionToken });
            migrated++;
          } catch (error) {
            console.warn(`Failed to migrate reaction for ${messageId}:`, error);
          }
        }
      }
      console.log(`✅ Migrated reactions from ${Object.keys(reactionsByMsg).length} messages`);
    }

    console.log(`✅ Migration complete: ${migrated} items migrated to backend`);
    return { success: true, migrated };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, migrated };
  }
}
