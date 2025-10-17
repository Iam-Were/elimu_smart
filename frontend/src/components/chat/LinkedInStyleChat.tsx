import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Circle,
  Loader2,
  Pin,
  Star,
  Reply,
  Copy,
  Trash2,
  CheckCheck,
  Check,
  Clock,
  Plus,
  Archive
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PINNED_STORAGE_KEY = 'elimu_smart_floating_chat_pinned';
const STARRED_STORAGE_KEY = 'elimu_smart_floating_chat_starred';
const REACTIONS_STORAGE_KEY = 'elimu_smart_floating_chat_reactions';

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

// LinkedIn-style conversation interface
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
  hasStarredMessages?: boolean;
  isArchived?: boolean;
}

export const LinkedInStyleChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [pinnedConversationIds, setPinnedConversationIds] = useState<string[]>([]);
  const [starredMessagesByConversation, setStarredMessagesByConversation] = useState<Record<string, string[]>>({});
  const [messageReactionsMap, setMessageReactionsMap] = useState<Record<string, MessageReaction[]>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<(File & { url?: string; parseFileName?: string }) | null>(null);
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
      console.warn('Failed to load floating chat preferences:', storageError);
    }
  }, []);

  // Persist preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedConversationIds));
    } catch {
      console.warn('Failed to persist pinned conversations');
    }
  }, [pinnedConversationIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(starredMessagesByConversation));
    } catch {
      console.warn('Failed to persist starred messages');
    }
  }, [starredMessagesByConversation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(messageReactionsMap));
    } catch {
      console.warn('Failed to persist reactions');
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
    sendMultimediaMessage,
    setCurrentRoom
  } = useChat();

  // Transform chat rooms to LinkedIn-style conversations
  const linkedInConversations: LinkedInConversation[] = rooms.map(room => {
    const otherParticipants = room.participants.filter(p => p !== user?.id);
    const participantId = otherParticipants[0] || 'unknown';

    return {
      id: room.id,
      participant: {
        id: participantId,
        name: room.title || `${room.type} Chat`,
        role: room.type === 'counseling' ? 'counselor' : room.type === 'mentoring' ? 'mentor' : 'peer',
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
  });

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


  // Enhance conversations with pin/star/archive state
  const conversationsWithState = useMemo(() => {
    const pinnedSet = new Set(pinnedConversationIds);

    return linkedInConversations
      .map((conversation) => {
        const starredMessages = starredMessagesByConversation[conversation.id] ?? [];
        return {
          ...conversation,
          isPinned: pinnedSet.has(conversation.id),
          hasStarredMessages: starredMessages.length > 0,
          isArchived: false // TODO: Implement archive backend
        };
      })
      .sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        }
        return a.isPinned ? -1 : 1;
      });
  }, [linkedInConversations, pinnedConversationIds, starredMessagesByConversation]);

  const filteredConversations = useMemo(() => {
    let filtered = conversationsWithState;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(c =>
        c.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    switch (activeFilter) {
      case 'unread':
        return filtered.filter(c => c.unreadCount > 0);
      case 'starred':
        return filtered.filter(c => c.hasStarredMessages);
      case 'archived':
        return filtered.filter(c => c.isArchived);
      default:
        return filtered;
    }
  }, [conversationsWithState, searchTerm, activeFilter]);

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

  const totalUnreadCount = linkedInConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

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
    if ((!newMessage.trim() && !uploadedFile) || !currentRoom || !user) return;

    setIsSending(true);
    try {
      if (uploadedFile && uploadedFile.url) {
        const fileType = uploadedFile.type.startsWith('image/') ? 'image' : 'file';
        await sendMultimediaMessage({
          chatRoomId: currentRoom.id,
          message: newMessage.trim() || `Sent a ${fileType}`,
          messageType: fileType,
          fileUrl: uploadedFile.url,
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size
        });
        setUploadedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        await sendMessage(currentRoom.id, newMessage);
      }

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
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', { description: 'Maximum file size is 10MB' });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // In real implementation, upload to Parse Server
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        toast.success(`${file.name} ready to send`);
      }, 2000);
    } catch (error) {
      console.error('File upload failed:', error);
      setIsUploading(false);
      setUploadedFile(null);
      toast.error('Upload failed');
    }
  };

  const togglePinnedConversation = useCallback((conversationId: string) => {
    setPinnedConversationIds((prev) => {
      const isPinned = prev.includes(conversationId);
      const updated = isPinned
        ? prev.filter((id) => id !== conversationId)
        : [conversationId, ...prev];

      toast.success(isPinned ? 'Unpinned' : 'Pinned');
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

      toast.success(isStarred ? 'Unstarred' : 'Starred');
      return updatedRecord;
    });
  }, []);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    const userId = user?.id ?? 'self';

    setMessageReactionsMap((prev) => {
      const existing = prev[messageId] ?? [];
      const reactionIndex = existing.findIndex((reaction) => reaction.emoji === emoji);
      let updatedReactions: MessageReaction[] = existing;

      if (reactionIndex >= 0) {
        const reaction = existing[reactionIndex];
        const hasUser = reaction.users.includes(userId);

        if (hasUser) {
          const remainingUsers = reaction.users.filter((id) => id !== userId);

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
      }

      const updatedMap = { ...prev };
      if (updatedReactions.length === 0) {
        delete updatedMap[messageId];
      } else {
        updatedMap[messageId] = updatedReactions;
      }

      return updatedMap;
    });
  }, [user]);

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

  const activeConversationId = currentRoom?.id ?? '';
  const starredMessageSet = useMemo(() => {
    if (!activeConversationId) return new Set<string>();
    return new Set(starredMessagesByConversation[activeConversationId] ?? []);
  }, [activeConversationId, starredMessagesByConversation]);

  // LinkedIn Chat Button (always visible in bottom-right)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 rounded-full bg-[#f97316] hover:bg-[#ea580c] shadow-lg border-2 border-white"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {totalUnreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white">
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  // LinkedIn Chat Panel
  return (
    <>
      {/* Compose Modal */}
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
            </div>
            <div className="space-y-2">
              <label htmlFor="composeMessage" className="text-sm font-medium text-gray-700">
                Message:
              </label>
              <Textarea
                id="composeMessage"
                placeholder="Type your message here..."
                rows={5}
                className="w-full resize-none focus:ring-[#f97316] focus:border-[#f97316]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsComposeModalOpen(false)}
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

      <div className="fixed bottom-6 right-6 z-50">
        <Card className={`w-96 transition-all duration-300 shadow-2xl border-gray-300 ${isMinimized ? 'h-14' : 'h-[550px]'}`}>
          {/* LinkedIn-style Header */}
          <CardHeader className="pb-2 border-b bg-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <MessageCircle className="h-4 w-4 text-[#f97316]" />
                {currentRoom ? (currentRoom.title || 'Chat') : 'Messaging'}
                {connectionStatus === 'connected' && currentRoom && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-500">
                    🟢
                  </Badge>
                )}
                {totalUnreadCount > 0 && !currentRoom && (
                  <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                    {totalUnreadCount}
                  </Badge>
                )}
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </CardTitle>
              {/* ✅ FIXED: Close/minimize buttons ALWAYS visible */}
              <div className="flex items-center gap-1 z-10">
                {currentRoom && (
                  <>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                      <Phone className="h-3 w-3 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                      <Video className="h-3 w-3 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                      <MoreHorizontal className="h-3 w-3 text-gray-600" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  title="Minimize"
                >
                  <Minimize2 className="h-3 w-3 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  title="Close"
                >
                  <X className="h-3 w-3 text-gray-600" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[500px] bg-white rounded-b-lg">
              {!currentRoom ? (
                // LinkedIn Conversations List
                <>
                  {/* Header with Compose Button */}
                  <div className="p-3 border-b bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-medium">
                        {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setIsComposeModalOpen(true)}
                        className="bg-[#f97316] hover:bg-[#ea580c] text-white h-7 px-3 rounded-full"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        New
                      </Button>
                    </div>

                    {/* Filter Tabs */}
                    <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}>
                      <TabsList className="grid w-full grid-cols-4 bg-gray-100 h-8">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs">
                          Unread
                          {linkedInConversations.filter(c => c.unreadCount > 0).length > 0 && (
                            <Badge className="ml-1 h-3 px-1 text-[9px] bg-[#f97316]">
                              {linkedInConversations.filter(c => c.unreadCount > 0).length}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="starred" className="text-xs">
                          <Star className="h-3 w-3" />
                        </TabsTrigger>
                        <TabsTrigger value="archived" className="text-xs">
                          <Archive className="h-3 w-3" />
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-8 text-sm border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-md"
                      />
                    </div>
                  </div>

                  {/* Conversations List */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading && filteredConversations.length === 0 ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-[#f97316]" />
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm px-4">
                        <MessageCircle className="h-8 w-8 mb-2 text-gray-300" />
                        <span>No conversations yet</span>
                        <span className="text-xs text-gray-400 mt-1">Start connecting with counselors</span>
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={cn(
                            "group relative flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors",
                            conversation.isPinned && "bg-blue-50/50"
                          )}
                          onClick={() => handleConversationClick(conversation)}
                        >
                          {/* Pin indicator */}
                          {conversation.isPinned && (
                            <div className="absolute top-2 right-2">
                              <Pin className="h-3 w-3 text-blue-500 fill-blue-500" />
                            </div>
                          )}

                          {/* Pin toggle button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinnedConversation(conversation.id);
                            }}
                            className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={conversation.isPinned ? "Unpin" : "Pin"}
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
                  </div>
                </>
              ) : (
                // LinkedIn Active Conversation
                <>
                  {/* Back to messages header with search */}
                  <div className="p-2 border-b bg-gray-50 space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentRoom(undefined)}
                      className="gap-2 text-[#f97316] hover:bg-orange-50 h-7"
                    >
                      ← Back to messages
                    </Button>

                    {/* In-conversation search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Search in conversation..."
                        value={messageSearchTerm}
                        onChange={(e) => setMessageSearchTerm(e.target.value)}
                        className="pl-8 h-7 text-xs border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-md"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                    {isLoading && messages.length === 0 ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-[#f97316]" />
                      </div>
                    ) : filteredMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                        <div className="text-center">
                          <MessageCircle className="h-8 w-8 mb-2 text-gray-300 mx-auto" />
                          <span>{messageSearchTerm ? 'No messages found' : 'Start a conversation...'}</span>
                        </div>
                      </div>
                    ) : (
                      filteredMessages.map((message) => {
                        const isOwnMessage = message.sender.id === user?.id;
                        const messageReactions = messageReactionsMap[message.id] || [];
                        const isStarred = starredMessageSet.has(message.id);

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group relative`}
                          >
                            {/* Message Actions Dropdown */}
                            <div className={`absolute ${isOwnMessage ? 'right-0 mr-2' : 'left-0 ml-2'} -top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
                                  >
                                    <MoreHorizontal className="h-3 w-3 text-gray-600" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align={isOwnMessage ? 'end' : 'start'} className="w-48">
                                  <DropdownMenuItem onClick={() => setShowReactionsFor(message.id)}>
                                    <Smile className="mr-2 h-4 w-4" />
                                    Add Reaction
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.info('Reply coming soon!')}>
                                    <Reply className="mr-2 h-4 w-4" />
                                    Reply
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleStarMessage(currentRoom.id, message.id)}>
                                    <Star className={cn("mr-2 h-4 w-4", isStarred && "fill-yellow-500 text-yellow-500")} />
                                    {isStarred ? 'Unstar' : 'Star'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      navigator.clipboard.writeText(message.message);
                                      toast.success('Copied!');
                                    }}
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                  </DropdownMenuItem>
                                  {isOwnMessage && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => toast.info('Delete coming soon!')}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
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
                                <span className="invisible" />
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-2 bg-white shadow-xl border rounded-full"
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
                                      className="text-lg hover:scale-125 transition-transform p-1"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>

                            <div className="relative">
                              <div className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow-md ${
                                isOwnMessage
                                  ? 'bg-[#f97316] text-white rounded-br-sm'
                                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                              }`}>
                                {/* Star indicator */}
                                {isStarred && (
                                  <div className={`absolute -top-2 ${isOwnMessage ? '-left-2' : '-right-2'}`}>
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 drop-shadow-md" />
                                  </div>
                                )}

                                <div
                                  className="break-words whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{ __html: highlightMessageContent(message.message) }}
                                />

                                <div className={`flex items-center gap-1.5 mt-1 text-xs ${
                                  isOwnMessage ? 'text-orange-100 justify-end' : 'text-gray-500'
                                }`}>
                                  <span>{formatTime(message.timestamp)}</span>
                                  {isOwnMessage && (
                                    <span className="ml-1" title={message.status || 'sent'}>
                                      {message.status === 'read' || message.isRead ? (
                                        <CheckCheck className="h-3 w-3 text-blue-300" />
                                      ) : message.status === 'delivered' ? (
                                        <CheckCheck className="h-3 w-3 text-orange-100" />
                                      ) : message.status === 'sent' ? (
                                        <Check className="h-3 w-3 text-orange-100" />
                                      ) : (
                                        <Clock className="h-3 w-3 animate-pulse text-orange-100" />
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
                                      className="flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs hover:border-orange-400 hover:bg-orange-50 transition-all"
                                    >
                                      <span className="text-sm">{reaction.emoji}</span>
                                      <span className="text-gray-600">{reaction.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* LinkedIn Message Input */}
                  <div className="p-3 border-t bg-white rounded-b-lg space-y-2">
                    {/* File Upload Preview */}
                    {uploadedFile && (
                      <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-3 w-3 text-orange-600" />
                            <span className="text-xs text-gray-800">{uploadedFile.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedFile(null);
                              setUploadProgress(0);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="h-5 w-5 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {isUploading && (
                          <Progress value={uploadProgress} className="h-1" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-200 rounded"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-200 rounded">
                              <Smile className="h-4 w-4 text-gray-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2">
                            <div className="grid grid-cols-6 gap-1">
                              {['😀', '😃', '😄', '😁', '😅', '😂',
                                '😊', '😇', '🙂', '😉', '😍', '🥰',
                                '😘', '😋', '😎', '🤩', '😏', '😒',
                                '😢', '😭', '😤', '😡', '🤔', '🤯',
                                '👍', '👎', '👌', '✌️', '🤝', '👏',
                                '❤️', '💛', '💚', '💙', '💜', '🎉'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => setNewMessage(prev => prev + emoji)}
                                  className="text-lg hover:bg-gray-100 rounded p-1"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Input
                        placeholder="Write a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        disabled={isSending || isLoading}
                        className="flex-1 border-none bg-transparent h-7 text-sm focus:ring-0 focus:border-none"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && !uploadedFile) || isSending || isLoading}
                        size="sm"
                        className="h-7 w-7 p-0 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 rounded"
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkedInStyleChat;
