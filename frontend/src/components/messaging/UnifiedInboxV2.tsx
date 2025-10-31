import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Button from '@/components/ui/button';
import { Mail, Search, Loader2 } from 'lucide-react';
import { ConversationListItem } from '@/components/inbox/ConversationListItem';
import { ChatThreadPanel } from '@/components/inbox/ChatThreadPanel';
import { SegmentedTabs } from '@/components/inbox/SegmentedTabs';
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

const MIGRATION_KEY = 'elimu_smart_preferences_migrated';

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

interface UnifiedInboxV2Props {
  className?: string;
}

export const UnifiedInboxV2: React.FC<UnifiedInboxV2Props> = ({ className }) => {
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
    archiveConversation,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
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
          }
        }

        // Load preferences from backend
        const prefs = await getUserChatPreferences(currentRoom?.id);
        setPinnedConversationIds(prefs.pinnedConversations);
        setStarredMessagesByConversation(prefs.starredMessages);

        console.log('✅ Loaded preferences from backend:', {
          pinnedCount: prefs.pinnedConversations.length,
          starredCount: Object.keys(prefs.starredMessages).length,
        });
      } catch (error) {
        console.warn('Failed to load backend preferences:', error);
      }
    };

    loadPreferences();
  }, [user, currentRoom?.id]);

  // Handler: Toggle pinned conversation (optimistic UI + backend sync)
  const togglePinnedConversation = useCallback(
    async (conversationId: string) => {
      // Optimistic UI update
      const previousState = pinnedConversationIds;
      const isPinned = previousState.includes(conversationId);

      setPinnedConversationIds((prev) => {
        if (isPinned) {
          return prev.filter((id) => id !== conversationId);
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
    },
    [pinnedConversationIds]
  );

  // Handler: Toggle starred message (optimistic UI + backend sync)
  const toggleStarMessage = useCallback(
    async (messageId: string) => {
      if (!currentRoom) return;

      // Optimistic UI update
      const previousState = starredMessagesByConversation;
      const conversationStars = previousState[currentRoom.id] || [];
      const isStarred = conversationStars.includes(messageId);

      setStarredMessagesByConversation((prev) => {
        if (isStarred) {
          return {
            ...prev,
            [currentRoom.id]: conversationStars.filter((id) => id !== messageId),
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
    },
    [currentRoom, starredMessagesByConversation]
  );

  // Handler: Toggle reaction on message (optimistic UI + backend sync)
  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!user?.id) return;

      // Optimistic UI update
      const previousState = messageReactionsMap;
      const existingReactions = previousState[messageId] || [];
      const reactionIndex = existingReactions.findIndex((r) => r.emoji === emoji);

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
          const updatedUsers = reaction.users.filter((id) => id !== user.id);
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
            const idx = reactions.findIndex((r) => r.emoji === emoji);

            if (result.reactionCount === 0) {
              // Remove reaction entirely
              return {
                ...prev,
                [messageId]: reactions.filter((r) => r.emoji !== emoji),
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
                [messageId]: [...reactions.slice(0, idx), updated, ...reactions.slice(idx + 1)],
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
    },
    [user?.id, messageReactionsMap]
  );

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

  // Handler: Archive conversation
  const handleArchiveConversation = useCallback(
    async (conversationId: string) => {
      try {
        const result = await archiveConversation(conversationId);
        if (result.success) {
          toast.success('Conversation archived');
        } else {
          toast.error('Failed to archive conversation');
        }
      } catch (error) {
        console.error('Failed to archive conversation:', error);
        toast.error('Failed to archive conversation');
      }
    },
    [archiveConversation]
  );

  // Handler: Mute conversation
  const handleMuteConversation = useCallback(async (_conversationId: string) => {
    // TODO: Implement backend mute functionality
    toast.info('Mute feature coming soon');
  }, []);

  // Handler: Delete conversation
  const handleDeleteConversation = useCallback(async (_conversationId: string) => {
    // TODO: Implement backend delete functionality
    toast.error('Delete functionality coming soon');
  }, []);

  // Transform chat rooms to conversations
  const conversations = useMemo(() => {
    return rooms.map((room) => {
      const otherParticipants = room.participants.filter((p) => p !== user?.id);
      const participantId = otherParticipants[0] || 'unknown';

      return {
        id: room.id,
        name: room.title || `${room.type} Chat`,
        lastMessage: room.lastMessage || 'Start a conversation...',
        unreadCount: room.unreadCount || 0,
        isOnline: room.isActive,
        lastActivity: room.lastActivity,
        participantId,
      };
    });
  }, [rooms, user?.id]);

  // Filter conversations based on active tab
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case 'pinned':
        return conversations.filter((conv) => pinnedConversationIds.includes(conv.id));
      case 'archived':
        return []; // Archived conversations would come from a separate backend call
      case 'all':
      default:
        return conversations;
    }
  }, [conversations, activeTab, pinnedConversationIds]);

  // Filter and sort conversations (search + pinned first)
  const filteredConversations = useMemo(() => {
    let filtered = filteredByTab;

    if (searchTerm.trim()) {
      filtered = filteredByTab.filter((conv) =>
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
  }, [filteredByTab, searchTerm, pinnedConversationIds]);

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentRoom || !user) return;

    setIsSending(true);
    try {
      await sendMessage(currentRoom.id, message);
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
    const room = rooms.find((r) => r.id === conversationId);
    if (room) {
      setCurrentRoom(room);
    }
  };

  // Get theme-specific labels
  const getThemeLabels = (theme: ThemeRole) => {
    switch (theme) {
      case 'student':
        return {
          title: 'Student Messaging',
          placeholder: 'Search counselors and mentors...',
        };
      case 'counselor':
        return {
          title: 'Counselor Messaging',
          placeholder: 'Search students...',
        };
      case 'admin':
        return {
          title: 'Admin Messaging',
          placeholder: 'Search users...',
        };
      default:
        return {
          title: 'Messaging',
          placeholder: 'Search conversations...',
        };
    }
  };

  const labels = getThemeLabels(currentTheme);

  const tabs = [
    { id: 'all', label: 'All', count: conversations.length },
    { id: 'pinned', label: 'Pinned', count: pinnedConversationIds.length },
    { id: 'archived', label: 'Archived', count: 0 },
  ];

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={className} style={{ position: 'relative', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      <div className="flex h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* LEFT SIDEBAR - Conversation List */}
        <div
          className={`flex flex-col border-r border-gray-200 bg-white ${
            currentRoom ? 'hidden md:flex md:w-96' : 'flex w-full md:w-96'
          }`}
        >
          {/* Header with tabs and search */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex-1 truncate">{labels.title}</h2>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white flex-shrink-0 h-9 px-3">
                <Mail className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Compose</span>
              </Button>
            </div>

            {/* Segmented tabs */}
            <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-4" />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={labels.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Conversation list */}
          <ScrollArea className="flex-1">
            {isLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">
                  {currentTheme === 'student'
                    ? 'Connect with a counselor to start'
                    : 'Conversations will appear here'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  id={conv.id}
                  participantName={conv.name}
                  participantInitials={conv.name.substring(0, 2).toUpperCase()}
                  lastMessage={conv.lastMessage}
                  timestamp={formatRelativeTime(conv.lastActivity)}
                  unreadCount={conv.unreadCount}
                  isOnline={conv.isOnline}
                  isPinned={pinnedConversationIds.includes(conv.id)}
                  isSelected={currentRoom?.id === conv.id}
                  onClick={handleConversationClick}
                  onPin={togglePinnedConversation}
                  onArchive={handleArchiveConversation}
                  onMute={handleMuteConversation}
                  onDelete={handleDeleteConversation}
                />
              ))
            )}
          </ScrollArea>
        </div>

        {/* RIGHT PANEL - Chat Thread */}
        <div className={`flex-1 ${!currentRoom ? 'hidden md:flex' : 'flex'}`}>
          {!currentRoom ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-50">
              <div className="text-center text-gray-500">
                <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          ) : (
            <ChatThreadPanel
              conversationId={currentRoom.id}
              participantName={currentRoom.title || 'Chat'}
              participantInitials={(currentRoom.title || 'C').substring(0, 2).toUpperCase()}
              participantTitle={currentRoom.type}
              isOnline={currentRoom.isActive}
              isPinned={pinnedConversationIds.includes(currentRoom.id)}
              messages={messages}
              currentUserId={user?.id || ''}
              isTyping={false} // TODO: Implement typing detection
              isSending={isSending}
              onSendMessage={handleSendMessage}
              onBack={() => setCurrentRoom(undefined)}
              onPin={togglePinnedConversation}
              onMute={handleMuteConversation}
              onArchive={handleArchiveConversation}
              onDelete={handleDeleteConversation}
              onReply={handleReplyToMessage}
              onStarMessage={toggleStarMessage}
              onReactToMessage={toggleReaction}
              onDeleteMessage={handleDeleteMessage}
              starredMessageIds={starredMessagesByConversation[currentRoom.id] || []}
            />
          )}
        </div>
      </div>

      {/* Connection status indicator */}
      {connectionStatus !== 'connected' && (
        <div className="absolute bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{connectionStatus === 'connecting' ? 'Connecting...' : 'Reconnecting...'}</span>
        </div>
      )}
    </div>
  );
};

export default UnifiedInboxV2;
