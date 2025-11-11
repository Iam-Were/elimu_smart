import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MainContainer,
  Sidebar,
  Search,
  ConversationList,
  Avatar,
  ChatContainer,
  ConversationHeader,
  MessageList,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@/styles/chatscope-theme.css';
import { EnhancedConversation } from './EnhancedConversation';
import { EnhancedMessage } from './EnhancedMessage';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useThemeContext } from '@/hooks/useThemeContext';
import { toast } from 'sonner';
import type { ThemeRole } from '@/types';
import {
  togglePinConversation as apiTogglePin,
  toggleStarMessage as apiToggleStar,
  toggleReaction as apiToggleReaction,
  getUserChatPreferences,
  migrateLocalStorageToBackend,
} from '@/lib/chatPreferencesApi';

const PINNED_STORAGE_KEY = 'elimu_smart_pinned_conversations';
const STARRED_STORAGE_KEY = 'elimu_smart_starred_messages';
const REACTIONS_STORAGE_KEY = 'elimu_smart_message_reactions';
const MIGRATION_KEY = 'elimu_smart_preferences_migrated';

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

interface UnifiedInboxProps {
  className?: string;
}

export const UnifiedInbox: React.FC<UnifiedInboxProps> = ({ className }) => {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();
  const {
    rooms,
    currentRoom,
    messages,
    isLoading,
    connectionStatus,
    sendMessage,
    setCurrentRoom,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pinnedConversationIds, setPinnedConversationIds] = useState<string[]>([]);
  const [starredMessagesByConversation, setStarredMessagesByConversation] = useState<Record<string, string[]>>({});
  const [messageReactionsMap, setMessageReactionsMap] = useState<Record<string, MessageReaction[]>>({});

  // Set theme data attribute for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Load persisted preferences from backend (with migration)
  useEffect(() => {
    if (typeof window === 'undefined' || !user) return;

    const loadPreferences = async () => {
      try {
        // Check if migration has run
        const hasMigrated = localStorage.getItem(MIGRATION_KEY);

        if (!hasMigrated) {
          console.log('🔄 Migrating localStorage preferences to backend...');
          const result = await migrateLocalStorageToBackend();

          if (result.success) {
            localStorage.setItem(MIGRATION_KEY, 'true');
            console.log(`✅ Migration complete: ${result.migrated} items migrated`);

            // Clear old localStorage data after successful migration
            localStorage.removeItem(PINNED_STORAGE_KEY);
            localStorage.removeItem(STARRED_STORAGE_KEY);
            localStorage.removeItem(REACTIONS_STORAGE_KEY);
          }
        }

        // Load preferences from backend
        const prefs = await getUserChatPreferences(currentRoom?.id);
        setPinnedConversationIds(prefs.pinnedConversations);
        setStarredMessagesByConversation(prefs.starredMessages);

        console.log('✅ Loaded preferences from backend:', {
          pinnedCount: prefs.pinnedConversations.length,
          starredCount: Object.keys(prefs.starredMessages).length
        });
      } catch (error) {
        console.warn('Failed to load backend preferences, using localStorage fallback:', error);

        // Fallback to localStorage if backend fails
        try {
          const storedPinned = localStorage.getItem(PINNED_STORAGE_KEY);
          if (storedPinned) {
            const parsed = JSON.parse(storedPinned) as string[];
            if (Array.isArray(parsed)) {
              setPinnedConversationIds(parsed);
            }
          }

          const storedStarred = localStorage.getItem(STARRED_STORAGE_KEY);
          if (storedStarred) {
            const parsed = JSON.parse(storedStarred) as Record<string, string[]>;
            if (parsed && typeof parsed === 'object') {
              setStarredMessagesByConversation(parsed);
            }
          }
        } catch {
          console.warn('localStorage fallback also failed');
        }
      }
    };

    loadPreferences();
  }, [user, currentRoom?.id]);

  // Removed localStorage persistence - now using backend sync

  // Handler: Toggle pinned conversation (optimistic UI + backend sync)
  const togglePinnedConversation = useCallback(async (conversationId: string) => {
    // Optimistic UI update
    const previousState = pinnedConversationIds;
    const isPinned = previousState.includes(conversationId);

    setPinnedConversationIds((prev) => {
      if (isPinned) {
        return prev.filter(id => id !== conversationId);
      } else {
        return [conversationId, ...prev];
      }
    });

    // Sync to backend
    try {
      const result = await apiTogglePin(conversationId);

      if (result.success) {
        toast.success(result.isPinned ? 'Conversation pinned' : 'Conversation unpinned');
      }
    } catch (error) {
      console.warn('Failed to sync pin to backend, reverting:', error);

      // Revert on error
      setPinnedConversationIds(previousState);
      toast.error('Failed to update pin status');
    }
  }, [pinnedConversationIds]);

  // Handler: Toggle starred message (optimistic UI + backend sync)
  const toggleStarMessage = useCallback(async (messageId: string) => {
    if (!currentRoom) return;

    // Optimistic UI update
    const previousState = starredMessagesByConversation;
    const conversationStars = previousState[currentRoom.id] || [];
    const isStarred = conversationStars.includes(messageId);

    setStarredMessagesByConversation((prev) => {
      if (isStarred) {
        return {
          ...prev,
          [currentRoom.id]: conversationStars.filter(id => id !== messageId),
        };
      } else {
        return {
          ...prev,
          [currentRoom.id]: [...conversationStars, messageId],
        };
      }
    });

    // Sync to backend
    try {
      const result = await apiToggleStar(messageId, currentRoom.id);

      if (result.success) {
        toast.success(result.isStarred ? 'Message starred' : 'Message unstarred');
      }
    } catch (error) {
      console.warn('Failed to sync star to backend, reverting:', error);

      // Revert on error
      setStarredMessagesByConversation(previousState);
      toast.error('Failed to update star status');
    }
  }, [currentRoom, starredMessagesByConversation]);

  // Handler: Toggle reaction on message (optimistic UI + backend sync)
  const toggleReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) return;

    // Optimistic UI update
    const previousState = messageReactionsMap;
    const existingReactions = previousState[messageId] || [];
    const reactionIndex = existingReactions.findIndex(r => r.emoji === emoji);

    let optimisticState: Record<string, MessageReaction[]>;

    if (reactionIndex === -1) {
      // Add new reaction
      optimisticState = {
        ...previousState,
        [messageId]: [...existingReactions, { emoji, users: [user.id], count: 1 }],
      };
    } else {
      // Toggle user in existing reaction
      const reaction = existingReactions[reactionIndex];
      const userIndex = reaction.users.indexOf(user.id);

      if (userIndex === -1) {
        // Add user to reaction
        const updatedReaction = {
          ...reaction,
          users: [...reaction.users, user.id],
          count: reaction.count + 1,
        };
        optimisticState = {
          ...previousState,
          [messageId]: [
            ...existingReactions.slice(0, reactionIndex),
            updatedReaction,
            ...existingReactions.slice(reactionIndex + 1),
          ],
        };
      } else {
        // Remove user from reaction
        const updatedUsers = reaction.users.filter(id => id !== user.id);
        if (updatedUsers.length === 0) {
          // Remove reaction if no users left
          optimisticState = {
            ...previousState,
            [messageId]: existingReactions.filter((_, idx) => idx !== reactionIndex),
          };
        } else {
          const updatedReaction = {
            ...reaction,
            users: updatedUsers,
            count: updatedUsers.length,
          };
          optimisticState = {
            ...previousState,
            [messageId]: [
              ...existingReactions.slice(0, reactionIndex),
              updatedReaction,
              ...existingReactions.slice(reactionIndex + 1),
            ],
          };
        }
      }
    }

    setMessageReactionsMap(optimisticState);

    // Sync to backend
    try {
      const result = await apiToggleReaction(messageId, emoji);

      // Update with backend count (handles concurrent reactions from other users)
      if (result.success) {
        setMessageReactionsMap((prev) => {
          const reactions = prev[messageId] || [];
          const idx = reactions.findIndex(r => r.emoji === emoji);

          if (result.reactionCount === 0) {
            // Remove reaction entirely
            return {
              ...prev,
              [messageId]: reactions.filter(r => r.emoji !== emoji),
            };
          } else if (idx === -1) {
            // Add new reaction with backend count
            return {
              ...prev,
              [messageId]: [...reactions, { emoji, users: [user.id], count: result.reactionCount }],
            };
          } else {
            // Update existing reaction count
            const updated = { ...reactions[idx], count: result.reactionCount };
            return {
              ...prev,
              [messageId]: [
                ...reactions.slice(0, idx),
                updated,
                ...reactions.slice(idx + 1),
              ],
            };
          }
        });
      }
    } catch (error) {
      console.warn('Failed to sync reaction to backend, reverting:', error);

      // Revert on error
      setMessageReactionsMap(previousState);
      toast.error('Failed to update reaction');
    }
  }, [user?.id, messageReactionsMap]);

  // Handler: Delete message (own messages only)
  const handleDeleteMessage = useCallback(async (_messageId: string) => {
    // TODO: Implement backend message deletion
    toast.error('Delete functionality coming soon');
  }, []);

  // Handler: Reply to message
  const handleReplyToMessage = useCallback((_messageId: string) => {
    // TODO: Implement reply functionality with message threading
    toast.info('Reply feature coming soon');
  }, []);

  // Transform chat rooms to Chatscope conversations
  const conversations = useMemo(() => {
    return rooms.map((room) => {
      const otherParticipants = room.participants.filter(p => p !== user?.id);
      const participantId = otherParticipants[0] || 'unknown';

      return {
        id: room.id,
        name: room.title || `${room.type} Chat`,
        lastMessage: room.lastMessage || 'Start a conversation...',
        unreadCnt: room.unreadCount || 0,
        isOnline: room.isActive,
        lastActivity: room.lastActivity,
        participantId,
      };
    });
  }, [rooms, user?.id]);

  // Filter and sort conversations (pinned first, then by last activity)
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    if (searchTerm.trim()) {
      filtered = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort: Pinned conversations first, then by last activity
    return filtered.sort((a, b) => {
      const aPinned = pinnedConversationIds.includes(a.id);
      const bPinned = pinnedConversationIds.includes(b.id);

      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      // Both pinned or both unpinned: sort by last activity
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });
  }, [conversations, searchTerm, pinnedConversationIds]);

  // Transform messages to Chatscope format
  const chatscopeMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sentTime: new Date(msg.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      sender: `${msg.sender.firstName} ${msg.sender.lastName}`,
      direction: msg.sender.id === user?.id ? ('outgoing' as const) : ('incoming' as const),
      position: 'single' as const,
    }));
  }, [messages, user?.id]);

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentRoom || !user) return;

    setIsSending(true);
    try {
      await sendMessage(currentRoom.id, message);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Handle conversation selection
  const handleConversationClick = (conversationId: string) => {
    const room = rooms.find(r => r.id === conversationId);
    if (room) {
      setCurrentRoom(room);
    }
  };

  // Get theme-specific labels
  const getThemeLabels = (theme: ThemeRole) => {
    switch (theme) {
      case 'student':
        return {
          title: 'Messages',
          placeholder: 'Search counselors and mentors...',
          inputPlaceholder: 'Type a message...',
        };
      case 'counselor':
        return {
          title: 'Messages',
          placeholder: 'Search students...',
          inputPlaceholder: 'Type your response...',
        };
      case 'admin':
        return {
          title: 'Admin Messaging',
          placeholder: 'Search users...',
          inputPlaceholder: 'Type a message...',
        };
      default:
        return {
          title: 'Messaging',
          placeholder: 'Search conversations...',
          inputPlaceholder: 'Type a message...',
        };
    }
  };

  const labels = getThemeLabels(currentTheme);

  return (
    <div className={className} style={{ position: 'relative', height: 'calc(100vh - 4rem)' }}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable>
          <Search
            placeholder={labels.placeholder}
            value={searchTerm}
            onChange={(v) => setSearchTerm(v)}
          />

          <ConversationList loading={isLoading && conversations.length === 0}>
            {filteredConversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <p>No conversations yet</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {currentTheme === 'student' ? 'Connect with a counselor to start' : 'Conversations will appear here'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <EnhancedConversation
                  key={conv.id}
                  id={conv.id}
                  name={conv.name}
                  lastMessage={conv.lastMessage}
                  unreadCnt={conv.unreadCnt}
                  active={currentRoom?.id === conv.id}
                  isOnline={conv.isOnline}
                  isPinned={pinnedConversationIds.includes(conv.id)}
                  onClick={handleConversationClick}
                  onTogglePin={togglePinnedConversation}
                />
              ))
            )}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          {!currentRoom ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: '1rem',
              color: '#6b7280'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
              </svg>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937' }}>
                Select a conversation
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          ) : (
            <>
              <ConversationHeader>
                <ConversationHeader.Back onClick={() => setCurrentRoom(undefined)} />
                <Avatar
                  name={currentRoom.title || 'Chat'}
                  status={currentRoom.isActive ? 'available' : 'unavailable'}
                />
                <ConversationHeader.Content
                  userName={currentRoom.title || 'Chat'}
                  info={currentRoom.isActive ? 'Active now' : 'Offline'}
                />
                <ConversationHeader.Actions>
                  {connectionStatus === 'connected' && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#10b981',
                      padding: '0.25rem 0.5rem',
                      background: '#d1fae5',
                      borderRadius: '9999px'
                    }}>
                      <span style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        background: '#10b981',
                        borderRadius: '50%'
                      }} />
                      Connected
                    </span>
                  )}
                </ConversationHeader.Actions>
              </ConversationHeader>

              <MessageList
                typingIndicator={isSending ? <TypingIndicator content="Sending..." /> : null}
                loading={isLoading && messages.length === 0}
              >
                {chatscopeMessages.map((msg) => {
                  const currentRoomId = currentRoom?.id || '';
                  const starredMessages = starredMessagesByConversation[currentRoomId] || [];
                  const isStarred = starredMessages.includes(msg.id);
                  const reactions = messageReactionsMap[msg.id] || [];

                  return (
                    <EnhancedMessage
                      key={msg.id}
                      id={msg.id}
                      message={msg.message}
                      sentTime={msg.sentTime}
                      sender={msg.sender}
                      direction={msg.direction}
                      position={msg.position}
                      isStarred={isStarred}
                      reactions={reactions}
                      currentUserId={user?.id}
                      onToggleStar={toggleStarMessage}
                      onToggleReaction={toggleReaction}
                      onReply={handleReplyToMessage}
                      onDelete={msg.direction === 'outgoing' ? handleDeleteMessage : undefined}
                    />
                  );
                })}
              </MessageList>

              <MessageInput
                placeholder={labels.inputPlaceholder}
                value={newMessage}
                onChange={(val) => setNewMessage(val)}
                onSend={handleSendMessage}
                disabled={isSending || isLoading}
                attachButton={false}
                sendButton={true}
              />
            </>
          )}
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default UnifiedInbox;
