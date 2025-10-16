import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Star,
  Archive,
  Pin,
  Search,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  X,
  Reply,
  Copy,
  Trash2,
  CheckCheck,
  Check,
  MoreVertical,
  ArrowLeft,
  User,
  BellOff,
  Ban,
  MessageCircle,
  Loader2,
  Circle,
  Forward,
} from 'lucide-react';
import { useChat, type ChatRoom } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PINNED_STORAGE_KEY = 'elimu_smart_pinned_conversations';
const STARRED_STORAGE_KEY = 'elimu_smart_starred_messages';
const REACTIONS_STORAGE_KEY = 'elimu_smart_message_reactions';

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

// Helper function to transform chat room to LinkedIn-style conversation
const transformRoomToConversation = (room: ChatRoom, userId?: string): LinkedInConversation => {
  const otherParticipants = room.participants.filter((participant) => participant !== userId);
  const participantId = otherParticipants[0] || 'unknown';

  return {
    id: room.id,
    participant: {
      id: participantId,
      name: room.title || `${room.type} Chat`,
      role: (room.type === 'counseling' ? 'counselor' : room.type === 'mentoring' ? 'mentor' : 'peer') as 'counselor' | 'mentor' | 'peer',
      isOnline: room.isActive
    },
    lastMessage: {
      id: 'last',
      content: room.lastMessage || 'Start a conversation...',
      sender: { id: participantId, name: room.title || 'System', role: 'peer' },
      timestamp: room.lastActivity,
      isRead: true
    },
    unreadCount: room.unreadCount || 0
  };
};

interface LinkedInConversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role: 'counselor' | 'mentor' | 'peer';
    isOnline: boolean;
  };
  lastMessage: {
    id: string;
    content: string;
    sender: { id: string; name: string; role: string; };
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  hasStarredMessages?: boolean;
}

const InboxPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<LinkedInConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [pinnedConversationIds, setPinnedConversationIds] = useState<string[]>([]);
  const [starredMessagesByConversation, setStarredMessagesByConversation] = useState<Record<string, string[]>>({});
  const [messageReactionsMap, setMessageReactionsMap] = useState<Record<string, MessageReaction[]>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoMarkRead, setAutoMarkRead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted preferences from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedPinned = localStorage.getItem(PINNED_STORAGE_KEY);
      if (storedPinned) {
        const parsedPinned = JSON.parse(storedPinned) as string[];
        if (Array.isArray(parsedPinned)) {
          setPinnedConversationIds(parsedPinned);
        }
      }

      const storedStarred = localStorage.getItem(STARRED_STORAGE_KEY);
      if (storedStarred) {
        const parsedStarred = JSON.parse(storedStarred) as Record<string, string[]>;
        if (parsedStarred && typeof parsedStarred === 'object') {
          setStarredMessagesByConversation(parsedStarred);
        }
      }

      const storedReactions = localStorage.getItem(REACTIONS_STORAGE_KEY);
      if (storedReactions) {
        const parsedReactions = JSON.parse(storedReactions) as Record<string, MessageReaction[]>;
        if (parsedReactions && typeof parsedReactions === 'object') {
          setMessageReactionsMap(parsedReactions);
        }
      }
    } catch (storageError) {
      console.warn('Failed to load chat preferences from storage:', storageError);
    }
  }, []);

  // Persist pinned conversations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedConversationIds));
    } catch (storageError) {
      console.warn('Failed to persist pinned conversations:', storageError);
    }
  }, [pinnedConversationIds]);

  // Persist starred messages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(starredMessagesByConversation));
    } catch (storageError) {
      console.warn('Failed to persist starred messages:', storageError);
    }
  }, [starredMessagesByConversation]);

  // Persist reactions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(messageReactionsMap));
    } catch (storageError) {
      console.warn('Failed to persist message reactions:', storageError);
    }
  }, [messageReactionsMap]);

  // Backend integration
  const { user } = useAuth();
  const {
    rooms,
    currentRoom,
    messages,
    isLoading,
    error,
    connectionStatus,
    sendMessage,
    setCurrentRoom,
    getInboxConversations,
    searchConversations,
    archiveConversation
  } = useChat();

  // Load inbox conversations on mount (with unread counts)
  useEffect(() => {
    if (user) {
      getInboxConversations();
    }
  }, [user, getInboxConversations]);

  // Transform chat rooms to LinkedIn-style conversations
  const linkedInConversations: LinkedInConversation[] = rooms.map((room) =>
    transformRoomToConversation(room, user?.id)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentRoom, messages]);

  useEffect(() => {
    if (error) {
      toast.error('Chat Error', {
        description: error
      });
    }
  }, [error]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N - New message
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsComposeModalOpen(true);
        toast.info('Compose new message', { description: 'Cmd+N' });
      }
      
      // Cmd/Ctrl + K - Search (future implementation)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Search messages"]')?.focus();
        toast.info('Search messages', { description: 'Cmd+K' });
      }
      
      // Escape - Close conversation or modal
      if (e.key === 'Escape') {
        if (isComposeModalOpen) {
          setIsComposeModalOpen(false);
        } else if (selectedConversation) {
          handleCloseConversation();
          toast.info('Conversation closed', { description: 'Press Escape' });
        }
      }
      
      // Cmd/Ctrl + E - Focus emoji picker (when conversation open)
      if ((e.metaKey || e.ctrlKey) && e.key === 'e' && selectedConversation) {
        e.preventDefault();
        toast.info('Emoji picker', { description: 'Cmd+E (click smile icon)' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComposeModalOpen, selectedConversation]);

  // Handle search with backend integration
  const [searchResults, setSearchResults] = useState<LinkedInConversation[]>([]);

  useEffect(() => {
  const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await searchConversations(searchTerm);

        // Transform search results to LinkedIn-style using helper function
        const transformedResults: LinkedInConversation[] = results.map((room) => 
          transformRoomToConversation(room, user?.id)
        );

        setSearchResults(transformedResults);
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchConversations, user]);

  // Enhance conversations with pin/star state and sort by pinned status
  const conversationsWithState = useMemo(() => {
    const baseList = searchTerm.trim() ? searchResults : linkedInConversations;
    const pinnedSet = new Set(pinnedConversationIds);

    return baseList
      .map((conversation) => {
        const starredMessages = starredMessagesByConversation[conversation.id] ?? [];
        return {
          ...conversation,
          isPinned: pinnedSet.has(conversation.id) || conversation.isPinned,
          hasStarredMessages: starredMessages.length > 0
        };
      })
      .sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        }
        return a.isPinned ? -1 : 1;
      });
  }, [searchTerm, searchResults, linkedInConversations, pinnedConversationIds, starredMessagesByConversation]);

  const filteredConversations = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return conversationsWithState.filter(c => c.unreadCount > 0);
      case 'starred':
        return conversationsWithState.filter(c => c.hasStarredMessages);
      case 'archived':
        return conversationsWithState.filter(c => c.isArchived);
      case 'all':
      default:
        return conversationsWithState;
    }
  }, [conversationsWithState, activeFilter]);

  const filteredMessages = useMemo(() => {
    if (!messageSearchTerm.trim()) {
      return messages;
    }

    const term = messageSearchTerm.toLowerCase();
    return messages.filter((message) => message.message.toLowerCase().includes(term));
  }, [messages, messageSearchTerm]);

  const highlightMessageContent = useCallback((text: string) => {
    if (!messageSearchTerm.trim()) {
      return text;
    }

    const escapedTerm = messageSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedTerm})`, 'gi'));

    return parts.map((part, index) => (
      part.toLowerCase() === messageSearchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded-sm">
          {part}
        </mark>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    ));
  }, [messageSearchTerm]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'counselor': return 'bg-orange-100 text-orange-700';
      case 'mentor': return 'bg-green-100 text-green-700';
      case 'peer': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'counselor': return '👨‍🏫';
      case 'mentor': return '🎯';
      case 'peer': return '👥';
      default: return '💬';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentRoom || !user) return;

    setIsSending(true);
    try {
      await sendMessage(currentRoom.id, newMessage);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message', {
        description: 'Please try again'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleConversationClick = (conversation: LinkedInConversation) => {
    const room = rooms.find(r => r.id === conversation.id);
    if (room) {
      setCurrentRoom(room);
      setSelectedConversation(conversation);
    }
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
    setCurrentRoom(undefined);
    setNewMessage('');
  };

  const handleArchive = async () => {
    if (!selectedConversation) return;

    try {
      const result = await archiveConversation(selectedConversation.id);
      if (result && result.success) {
        toast.success('Conversation archived');
        handleCloseConversation();
      } else {
        toast.error('Failed to archive conversation');
      }
    } catch (error) {
      console.error('Archive error:', error);
      toast.error('Failed to archive conversation');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 10MB'
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Supported: Images, PDF, Word documents'
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success(`${file.name} uploaded successfully`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const togglePinnedConversation = useCallback((conversationId: string) => {
    setPinnedConversationIds((prev) => {
      const isPinned = prev.includes(conversationId);
      const updated = isPinned
        ? prev.filter((id) => id !== conversationId)
        : [conversationId, ...prev];

      toast.success(isPinned ? 'Conversation unpinned' : 'Conversation pinned');
      return updated;
    });
  }, []);

  const toggleStarMessage = useCallback((conversationId: string | undefined, messageId: string) => {
    if (!conversationId) return;

    setStarredMessagesByConversation((prev) => {
      const existing = prev[conversationId] ?? [];
      const isStarred = existing.includes(messageId);
      const updatedMessages = isStarred
        ? existing.filter((id) => id !== messageId)
        : [...existing, messageId];

      const updatedRecord: Record<string, string[]> = { ...prev };
      if (updatedMessages.length > 0) {
        updatedRecord[conversationId] = updatedMessages;
      } else {
        delete updatedRecord[conversationId];
      }

      toast.success(isStarred ? 'Message unstarred' : 'Message starred');
      return updatedRecord;
    });
  }, []);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    const userId = user?.id ?? 'self';
    let action: 'added' | 'removed' | null = null;

    setMessageReactionsMap((prev) => {
      const existing = prev[messageId] ?? [];
      const reactionIndex = existing.findIndex((reaction) => reaction.emoji === emoji);
      let updatedReactions: MessageReaction[] = existing;

      if (reactionIndex >= 0) {
        const reaction = existing[reactionIndex];
        const hasUser = reaction.users.includes(userId);

        if (hasUser) {
          const remainingUsers = reaction.users.filter((id) => id !== userId);
          action = 'removed';

          if (remainingUsers.length === 0) {
            updatedReactions = [
              ...existing.slice(0, reactionIndex),
              ...existing.slice(reactionIndex + 1)
            ];
          } else {
            updatedReactions = [...existing];
            updatedReactions[reactionIndex] = {
              ...reaction,
              users: remainingUsers,
              count: remainingUsers.length
            };
          }
        } else {
          updatedReactions = [...existing];
          updatedReactions[reactionIndex] = {
            ...reaction,
            users: [...reaction.users, userId],
            count: reaction.count + 1
          };
          action = 'added';
        }
      } else {
        updatedReactions = [
          ...existing,
          {
            emoji,
            users: [userId],
            count: 1
          }
        ];
        action = 'added';
      }

      const updatedMap = { ...prev };
      if (updatedReactions.length === 0) {
        delete updatedMap[messageId];
      } else {
        updatedMap[messageId] = updatedReactions;
      }

      return updatedMap;
    });

    if (action === 'added') {
      toast.success(`Reacted with ${emoji}`);
    } else if (action === 'removed') {
      toast.success('Reaction removed');
    }
  }, [user]);

  const activeConversationId = currentRoom?.id ?? selectedConversation?.id ?? '';
  const starredMessageSet = useMemo(() => {
    if (!activeConversationId) {
      return new Set<string>();
    }

    return new Set(starredMessagesByConversation[activeConversationId] ?? []);
  }, [activeConversationId, starredMessagesByConversation]);

  return (
    <>
      {/* Compose Modal - Shadcn Dialog */}
      <Dialog open={isComposeModalOpen} onOpenChange={setIsComposeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#f97316]" />
              New Message
            </DialogTitle>
            <DialogDescription>
              Send a message to a counselor or mentor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium text-gray-700">
                To:
              </label>
              <Input 
                id="recipient"
                placeholder="Search for a counselor or mentor..." 
                className="w-full focus:ring-[#f97316] focus:border-[#f97316]" 
              />
              <p className="text-xs text-gray-500">Start typing to search...</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message:
              </label>
              <Textarea 
                id="message"
                placeholder="Type your message here..." 
                rows={5} 
                className="w-full resize-none focus:ring-[#f97316] focus:border-[#f97316]" 
              />
              <p className="text-xs text-gray-500">Press Enter to add a new line</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsComposeModalOpen(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#f97316] hover:bg-[#ea580c] text-white"
              onClick={() => {
                toast.success('Message sent!');
                setIsComposeModalOpen(false);
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    <div className="h-screen flex bg-gray-50">
      {/* LinkedIn-style Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#f97316]" />
              Messaging
              {currentRoom && (
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'connecting' ? 'secondary' : 'destructive'}
                  className="text-[10px] px-1.5 py-0"
                >
                  {connectionStatus === 'connected' ? '🟢' : connectionStatus === 'connecting' ? '🟡' : '🔴'}
                </Badge>
              )}
            </h1>
            <Button
              size="sm"
              onClick={() => setIsComposeModalOpen(true)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full px-4"
            >
              ✉️ Compose
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages... (Cmd+K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-md"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-0.5 text-[10px] bg-gray-100 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="mb-3 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 bg-white border border-blue-300 rounded text-[10px]">Cmd+N</kbd> for new message, <kbd className="px-1 py-0.5 bg-white border border-blue-300 rounded text-[10px]">Esc</kbd> to close
            </p>
          </div>

          {/* Filter Tabs - Shadcn Tabs Component */}
          <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 h-9">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#f97316]">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#f97316] relative">
                Unread
                {linkedInConversations.filter(c => c.unreadCount > 0).length > 0 && (
                  <Badge variant="default" className="ml-1 h-4 px-1.5 text-[10px] bg-[#f97316]">
                    {linkedInConversations.filter(c => c.unreadCount > 0).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="starred" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#f97316]">
                Starred
              </TabsTrigger>
              <TabsTrigger value="archived" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#f97316]">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {isLoading && filteredConversations.length === 0 ? (
            <div className="flex flex-col gap-1 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm px-4">
              <MessageCircle className="h-8 w-8 mb-2 text-gray-300" />
              <span>No conversations yet</span>
              <span className="text-xs text-gray-400 mt-1">Start connecting with counselors and mentors</span>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group relative flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors",
                  selectedConversation?.id === conversation.id && "bg-[#f97316]/10 border-l-4 border-l-[#f97316]",
                  conversation.isPinned && "bg-blue-50/50"
                )}
                onClick={() => handleConversationClick(conversation)}
              >
                {/* Pin Indicator */}
                {conversation.isPinned && (
                  <div className="absolute top-2 right-2">
                    <Pin className="h-3 w-3 text-blue-500 fill-blue-500" />
                  </div>
                )}

                {/* Pin Toggle Button (on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinnedConversation(conversation.id);
                  }}
                  className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200"
                  title={conversation.isPinned ? "Unpin conversation" : "Pin conversation"}
                >
                  <Pin className={cn(
                    "h-3.5 w-3.5",
                    conversation.isPinned ? "text-blue-500 fill-blue-500" : "text-gray-400"
                  )} />
                </button>

                <div className="relative">
                  <Avatar className="h-12 w-12 border border-gray-200">
                    <AvatarImage src={conversation.participant.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                      {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participant.isOnline && (
                    <Circle className="absolute -bottom-1 -right-1 h-4 w-4 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate text-gray-900">
                        {conversation.participant.name}
                      </h4>
                      <Badge className={`text-xs px-2 py-0 rounded-full ${getRoleColor(conversation.participant.role)}`}>
                        {getRoleIcon(conversation.participant.role)}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 truncate flex-1">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-[#f97316] text-white text-xs h-5 w-5 rounded-full flex items-center justify-center ml-2">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* LinkedIn-style Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!selectedConversation ? (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        ) : (
          /* Active conversation */
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 md:hidden hover:bg-gray-100"
                          onClick={handleCloseConversation}
                        >
                          <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Back to conversations</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participant.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {selectedConversation.participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-gray-900 flex items-center gap-2">
                      {selectedConversation.participant.name}
                      <Badge 
                        variant={selectedConversation.participant.isOnline ? "success" : "secondary"}
                        className={cn(
                          "text-[10px] h-5",
                          selectedConversation.participant.isOnline && "bg-green-500 hover:bg-green-600"
                        )}
                      >
                        {selectedConversation.participant.isOnline ? '● Online' : '○ Away'}
                      </Badge>
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.participant.isOnline ? 'Active now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>

                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    {/* Phone Call Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => toast.info('Voice call feature coming soon!')}
                        >
                          <Phone className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start voice call</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Video Call Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => toast.info('Video call feature coming soon!')}
                        >
                          <Video className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start video call</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Archive Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={handleArchive}
                        >
                          <Archive className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Archive conversation</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Conversation Menu */}
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More options</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem onClick={() => toast.info('View profile feature coming soon!')}>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Mute feature coming soon!')}>
                          <BellOff className="mr-2 h-4 w-4" />
                          Mute Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleArchive}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {/* Settings Section with Switch */}
                        <div className="px-2 py-2 space-y-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Settings</p>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="notifications" className="text-sm font-normal cursor-pointer">
                              Notifications
                            </Label>
                            <Switch
                              id="notifications"
                              checked={notificationsEnabled}
                              onCheckedChange={(checked) => {
                                setNotificationsEnabled(checked);
                                toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="autoread" className="text-sm font-normal cursor-pointer">
                              Auto-mark as read
                            </Label>
                            <Switch
                              id="autoread"
                              checked={autoMarkRead}
                              onCheckedChange={(checked) => {
                                setAutoMarkRead(checked);
                                toast.success(checked ? 'Auto-mark enabled' : 'Auto-mark disabled');
                              }}
                            />
                          </div>
                        </div>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => toast.info('Block feature coming soon!')}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Block User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Close Button (Desktop) */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden md:flex h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={handleCloseConversation}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Close conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>

              {/* In-conversation Search */}
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in conversation..."
                  value={messageSearchTerm}
                  onChange={(e) => setMessageSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-50">
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-[#f97316]" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 mb-2 text-gray-300 mx-auto" />
                    <span>Start a conversation...</span>
                  </div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                  <div className="text-center">
                    <Search className="h-8 w-8 mb-2 text-gray-300 mx-auto" />
                    <span>No messages match your search</span>
                  </div>
                </div>
              ) : (
                filteredMessages.map((message, index) => {
                  const isOwnMessage = message.sender.id === user?.id;
                  const previousMessage = index > 0 ? filteredMessages[index - 1] : null;
                  const showTimestamp = index === 0 || 
                    (previousMessage && 
                     new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() > 300000); // 5 minutes
                  
                  const messageReactions = messageReactionsMap[message.id] || [];
                  const isStarred = starredMessageSet.has(message.id);
                  
                  return (
                    <div key={message.id}>
                      {showTimestamp && (
                        <div className="text-center text-xs text-gray-500 my-4">
                          {new Date(message.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      )}
                      <div 
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group relative`}
                      >
                        {/* Message Actions DropdownMenu */}
                        <div className={`absolute ${isOwnMessage ? 'right-0 mr-2' : 'left-0 ml-2'} -top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                          <DropdownMenu>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
                                    >
                                      <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Message options</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align={isOwnMessage ? 'end' : 'start'} className="w-48">
                              <DropdownMenuItem onClick={() => setShowReactionsFor(message.id)}>
                                <Smile className="mr-2 h-4 w-4" />
                                Add Reaction
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Reply feature coming soon!')}>
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Forward feature coming soon!')}>
                                <Forward className="mr-2 h-4 w-4" />
                                Forward
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleStarMessage(selectedConversation.id, message.id)}>
                                <Star className={cn("mr-2 h-4 w-4", isStarred && "fill-yellow-500 text-yellow-500")} />
                                {isStarred ? 'Unstar' : 'Star'} Message
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  navigator.clipboard.writeText(message.message);
                                  toast.success('Message copied to clipboard');
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Text
                              </DropdownMenuItem>
                              {isOwnMessage && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => toast.info('Delete feature coming soon!')}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Message
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Reaction Picker Popover */}
                        <Popover 
                          open={showReactionsFor === message.id} 
                          onOpenChange={(open) => !open && setShowReactionsFor(null)}
                        >
                          <PopoverTrigger asChild>
                            <span className={`absolute ${isOwnMessage ? 'right-0 mr-2' : 'left-0 ml-2'} -top-10 invisible`} />
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-auto p-2 bg-white shadow-xl border border-gray-200 rounded-full"
                            align={isOwnMessage ? 'end' : 'start'}
                            side="top"
                          >
                            <div className="flex items-center gap-1">
                              {['👍', '❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    toggleReaction(message.id, emoji);
                                    setShowReactionsFor(null);
                                  }}
                                  className="text-xl hover:scale-125 transition-transform p-1 hover:bg-gray-100 rounded-full"
                                  title={`React with ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>

                        <div className="relative">
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                            isOwnMessage
                              ? 'bg-[#f97316] text-white rounded-br-md'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                          }`}>
                            {/* Star Indicator */}
                            {isStarred && (
                              <div className={`absolute -top-2 ${isOwnMessage ? '-left-2' : '-right-2'}`}>
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              </div>
                            )}
                            
                            <div 
                              className="break-words whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: highlightMessageContent(message.message) }}
                            />
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                              isOwnMessage ? 'text-orange-200 justify-end' : 'text-gray-500'
                            }`}>
                              <span>
                                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                              {isOwnMessage && (
                                <span className="ml-1">
                                  {message.isRead ? (
                                    <CheckCheck className="h-3 w-3" aria-label="Read" />
                                  ) : (
                                    <Check className="h-3 w-3" aria-label="Delivered" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Message Reactions */}
                          {messageReactions.length > 0 && (
                            <div className={`flex flex-wrap gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              {messageReactions.map((reaction) => (
                                <button
                                  key={reaction.emoji}
                                  onClick={() => toggleReaction(message.id, reaction.emoji)}
                                  className="flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs hover:border-[#f97316] transition-colors"
                                  title={`${reaction.users.join(', ')} reacted with ${reaction.emoji}`}
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-gray-600">{reaction.count}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white space-y-3">
              {/* File Upload Preview */}
              {uploadedFile && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">{uploadedFile.name}</span>
                      <span className="text-xs text-gray-500">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeUploadedFile}
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {isUploading && (
                    <div className="space-y-1">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-gray-500">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full flex-shrink-0 mt-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file (Images, PDF, Documents)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Popover>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full flex-shrink-0 mt-1">
                            <Smile className="h-4 w-4 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add emoji</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="grid grid-cols-8 gap-2">
                      {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
                        '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
                        '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
                        '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
                        '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
                        '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
                        '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
                        '👍', '👎', '👌', '✌️', '🤞', '🤝', '👏', '🙌',
                        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
                        '💯', '💢', '💥', '💫', '💦', '💨', '🕊️', '🦋',
                        '🌟', '✨', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setNewMessage(prev => prev + emoji);
                          }}
                          className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Textarea
                  placeholder="Write a message... (Shift+Enter for new line)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending || isLoading}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
                  rows={1}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending || isLoading}
                        size="sm"
                        className="h-8 w-8 p-0 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 rounded-full flex-shrink-0 mt-1"
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSending ? 'Sending...' : 'Send message (Enter)'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> to send, 
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs ml-1">Shift+Enter</kbd> for new line
              </p>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default InboxPage;