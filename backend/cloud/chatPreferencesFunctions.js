/**
 * Chat Preferences Cloud Functions
 * Handles pin/star/reactions for messages and conversations
 * Syncs user preferences across devices via Parse Server
 */

// Parse is globally available in cloud code context
// No need to require it

// ============================================================================
// CONVERSATION PREFERENCES (Pin/Mute/Archive)
// ============================================================================

/**
 * Toggle pin status for a conversation
 * @param {string} conversationId - ChatRoom ID
 * @returns {object} { success: boolean, isPinned: boolean }
 */
Parse.Cloud.define('togglePinConversation', async (request) => {
  const { conversationId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!conversationId) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'conversationId is required');
  }

  try {
    const ConversationPreference = Parse.Object.extend('ConversationPreference');
    const query = new Parse.Query(ConversationPreference);
    query.equalTo('userId', user.id);
    query.equalTo('conversationId', conversationId);
    query.equalTo('type', 'pin');

    const existing = await query.first({ useMasterKey: true });

    if (existing) {
      // Unpin: delete preference
      await existing.destroy({ useMasterKey: true });
      return { success: true, isPinned: false };
    } else {
      // Pin: create preference
      const preference = new ConversationPreference();
      preference.set('userId', user.id);
      preference.set('conversationId', conversationId);
      preference.set('type', 'pin');

      // Set ACL: only user can read/write
      const acl = new Parse.ACL(user);
      preference.setACL(acl);

      await preference.save(null, { useMasterKey: true });
      return { success: true, isPinned: true };
    }
  } catch (error) {
    console.error('Error toggling pin conversation:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to toggle pin');
  }
});

/**
 * Get all pinned conversations for current user
 * @returns {array} Array of conversation IDs
 */
Parse.Cloud.define('getPinnedConversations', async (request) => {
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const ConversationPreference = Parse.Object.extend('ConversationPreference');
    const query = new Parse.Query(ConversationPreference);
    query.equalTo('userId', user.id);
    query.equalTo('type', 'pin');
    query.limit(100); // Max 100 pinned conversations

    const preferences = await query.find({ useMasterKey: true });
    return preferences.map(pref => pref.get('conversationId'));
  } catch (error) {
    console.error('Error getting pinned conversations:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get pinned conversations');
  }
});

// ============================================================================
// MESSAGE PREFERENCES (Star)
// ============================================================================

/**
 * Toggle star status for a message
 * @param {string} messageId - ChatMessage ID
 * @param {string} conversationId - ChatRoom ID (for grouping)
 * @returns {object} { success: boolean, isStarred: boolean }
 */
Parse.Cloud.define('toggleStarMessage', async (request) => {
  const { messageId, conversationId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!messageId) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'messageId is required');
  }

  try {
    const MessagePreference = Parse.Object.extend('MessagePreference');
    const query = new Parse.Query(MessagePreference);
    query.equalTo('userId', user.id);
    query.equalTo('messageId', messageId);
    query.equalTo('type', 'star');

    const existing = await query.first({ useMasterKey: true });

    if (existing) {
      // Unstar: delete preference
      await existing.destroy({ useMasterKey: true });
      return { success: true, isStarred: false };
    } else {
      // Star: create preference
      const preference = new MessagePreference();
      preference.set('userId', user.id);
      preference.set('messageId', messageId);
      preference.set('conversationId', conversationId || ''); // For grouping by conversation
      preference.set('type', 'star');

      // Set ACL: only user can read/write
      const acl = new Parse.ACL(user);
      preference.setACL(acl);

      await preference.save(null, { useMasterKey: true });
      return { success: true, isStarred: true };
    }
  } catch (error) {
    console.error('Error toggling star message:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to toggle star');
  }
});

/**
 * Get all starred messages for current user
 * @param {string} conversationId - Optional: filter by conversation
 * @returns {object} { byConversation: Record<conversationId, messageId[]> }
 */
Parse.Cloud.define('getStarredMessages', async (request) => {
  const { conversationId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    const MessagePreference = Parse.Object.extend('MessagePreference');
    const query = new Parse.Query(MessagePreference);
    query.equalTo('userId', user.id);
    query.equalTo('type', 'star');

    if (conversationId) {
      query.equalTo('conversationId', conversationId);
    }

    query.limit(1000); // Max 1000 starred messages

    const preferences = await query.find({ useMasterKey: true });

    // Group by conversation
    const byConversation = {};
    preferences.forEach(pref => {
      const convId = pref.get('conversationId') || 'unknown';
      const msgId = pref.get('messageId');

      if (!byConversation[convId]) {
        byConversation[convId] = [];
      }
      byConversation[convId].push(msgId);
    });

    return { byConversation };
  } catch (error) {
    console.error('Error getting starred messages:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get starred messages');
  }
});

// ============================================================================
// MESSAGE REACTIONS (Emoji)
// ============================================================================

/**
 * Toggle reaction on a message
 * @param {string} messageId - ChatMessage ID
 * @param {string} emoji - Emoji to toggle (e.g., '👍', '❤️')
 * @returns {object} { success: boolean, added: boolean, reactionCount: number }
 */
Parse.Cloud.define('toggleReaction', async (request) => {
  const { messageId, emoji } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!messageId || !emoji) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'messageId and emoji are required');
  }

  // Validate emoji (basic check)
  if (emoji.length > 10) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'Invalid emoji format');
  }

  try {
    const MessagePreference = Parse.Object.extend('MessagePreference');
    const query = new Parse.Query(MessagePreference);
    query.equalTo('userId', user.id);
    query.equalTo('messageId', messageId);
    query.equalTo('type', 'reaction');
    query.equalTo('emoji', emoji);

    const existing = await query.first({ useMasterKey: true });

    if (existing) {
      // Remove reaction
      await existing.destroy({ useMasterKey: true });

      // Count remaining reactions for this emoji
      const countQuery = new Parse.Query(MessagePreference);
      countQuery.equalTo('messageId', messageId);
      countQuery.equalTo('type', 'reaction');
      countQuery.equalTo('emoji', emoji);
      const count = await countQuery.count({ useMasterKey: true });

      return { success: true, added: false, reactionCount: count };
    } else {
      // Add reaction
      const preference = new MessagePreference();
      preference.set('userId', user.id);
      preference.set('messageId', messageId);
      preference.set('type', 'reaction');
      preference.set('emoji', emoji);

      // Set ACL: only user can write, but all participants can read
      const acl = new Parse.ACL(user);
      acl.setPublicReadAccess(true); // Allow others to see reactions
      preference.setACL(acl);

      await preference.save(null, { useMasterKey: true });

      // Count reactions for this emoji
      const countQuery = new Parse.Query(MessagePreference);
      countQuery.equalTo('messageId', messageId);
      countQuery.equalTo('type', 'reaction');
      countQuery.equalTo('emoji', emoji);
      const count = await countQuery.count({ useMasterKey: true });

      return { success: true, added: true, reactionCount: count };
    }
  } catch (error) {
    console.error('Error toggling reaction:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to toggle reaction');
  }
});

/**
 * Get all reactions for a message
 * @param {string} messageId - ChatMessage ID
 * @returns {array} Array of { emoji, users: [userId1, userId2], count }
 */
Parse.Cloud.define('getMessageReactions', async (request) => {
  const { messageId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!messageId) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'messageId is required');
  }

  try {
    const MessagePreference = Parse.Object.extend('MessagePreference');
    const query = new Parse.Query(MessagePreference);
    query.equalTo('messageId', messageId);
    query.equalTo('type', 'reaction');
    query.limit(1000); // Max 1000 reactions per message

    const preferences = await query.find({ useMasterKey: true });

    // Group by emoji
    const reactionsByEmoji = {};
    preferences.forEach(pref => {
      const emoji = pref.get('emoji');
      const userId = pref.get('userId');

      if (!reactionsByEmoji[emoji]) {
        reactionsByEmoji[emoji] = [];
      }
      reactionsByEmoji[emoji].push(userId);
    });

    // Transform to array format
    const reactions = Object.entries(reactionsByEmoji).map(([emoji, users]) => ({
      emoji,
      users,
      count: users.length
    }));

    return reactions;
  } catch (error) {
    console.error('Error getting message reactions:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get reactions');
  }
});

/**
 * Get all reactions for multiple messages (bulk query for performance)
 * @param {array} messageIds - Array of ChatMessage IDs
 * @returns {object} { messageId: [{ emoji, users, count }] }
 */
Parse.Cloud.define('getBulkMessageReactions', async (request) => {
  const { messageIds } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  if (!messageIds || !Array.isArray(messageIds)) {
    throw new Parse.Error(Parse.Error.INVALID_ARGUMENT, 'messageIds array is required');
  }

  // Limit to 100 messages per request
  const limitedIds = messageIds.slice(0, 100);

  try {
    const MessagePreference = Parse.Object.extend('MessagePreference');
    const query = new Parse.Query(MessagePreference);
    query.containedIn('messageId', limitedIds);
    query.equalTo('type', 'reaction');
    query.limit(10000); // Max 10k reactions total

    const preferences = await query.find({ useMasterKey: true });

    // Group by messageId, then by emoji
    const reactionsByMessage = {};
    preferences.forEach(pref => {
      const messageId = pref.get('messageId');
      const emoji = pref.get('emoji');
      const userId = pref.get('userId');

      if (!reactionsByMessage[messageId]) {
        reactionsByMessage[messageId] = {};
      }

      if (!reactionsByMessage[messageId][emoji]) {
        reactionsByMessage[messageId][emoji] = [];
      }

      reactionsByMessage[messageId][emoji].push(userId);
    });

    // Transform to final format
    const result = {};
    Object.entries(reactionsByMessage).forEach(([messageId, emojiMap]) => {
      result[messageId] = Object.entries(emojiMap).map(([emoji, users]) => ({
        emoji,
        users,
        count: users.length
      }));
    });

    return result;
  } catch (error) {
    console.error('Error getting bulk reactions:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get bulk reactions');
  }
});

// ============================================================================
// BULK OPERATIONS (Load all preferences at once)
// ============================================================================

/**
 * Get all chat preferences for current user (for initial load)
 * @param {string} conversationId - Optional: filter by conversation
 * @returns {object} { pinnedConversations, starredMessages, reactions }
 */
Parse.Cloud.define('getUserChatPreferences', async (request) => {
  const { conversationId } = request.params;
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    // Get pinned conversations
    const ConversationPreference = Parse.Object.extend('ConversationPreference');
    const pinnedQuery = new Parse.Query(ConversationPreference);
    pinnedQuery.equalTo('userId', user.id);
    pinnedQuery.equalTo('type', 'pin');
    pinnedQuery.limit(100);

    const pinnedPrefs = await pinnedQuery.find({ useMasterKey: true });
    const pinnedConversations = pinnedPrefs.map(pref => pref.get('conversationId'));

    // Get starred messages
    const MessagePreference = Parse.Object.extend('MessagePreference');
    const starredQuery = new Parse.Query(MessagePreference);
    starredQuery.equalTo('userId', user.id);
    starredQuery.equalTo('type', 'star');

    if (conversationId) {
      starredQuery.equalTo('conversationId', conversationId);
    }

    starredQuery.limit(1000);

    const starredPrefs = await starredQuery.find({ useMasterKey: true });

    // Group starred messages by conversation
    const starredByConversation = {};
    starredPrefs.forEach(pref => {
      const convId = pref.get('conversationId') || 'unknown';
      const msgId = pref.get('messageId');

      if (!starredByConversation[convId]) {
        starredByConversation[convId] = [];
      }
      starredByConversation[convId].push(msgId);
    });

    return {
      pinnedConversations,
      starredMessages: starredByConversation
    };
  } catch (error) {
    console.error('Error getting user chat preferences:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get preferences');
  }
});

console.log('✅ Chat Preferences Cloud Functions loaded');
