import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Archive,
  Search,
  Send,
  Phone,
  Video,
  X,
  MessageCircle,
  Loader2,
  Circle,
  Lock,
  Pin,
  ChevronLeft,
  Smile,
  Paperclip,
  Info,
  Bell,
  Check,
  Trash2,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { ComposeDialog } from '@/components/inbox/ComposeDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ParseApi from '@/lib/parseApi';
import { getParse } from '@/config/parse';

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
  archivedAt?: Date;
}

interface Notification {
  id: string;
  type: 'message' | 'session' | 'assessment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<LinkedInConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [conversations, setConversations] = useState<LinkedInConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user } = useAuth();
  const { userSubscription } = useSubscription();
  const { rooms, messages, isLoading, sendMessage, setCurrentRoom } = useChat();

  // Check if user has premium access
  const isPremium = userSubscription?.status === 'active' &&
    userSubscription?.plan !== 'free';

  const isFreeStudent = user?.role === 'student' && !isPremium;

  // Format date safely, handling invalid dates and Parse Date objects
  const formatMessageDate = (timestamp: Date | string | number | undefined | any) => {
    if (!timestamp) return 'recently';
    try {
      let date: Date;

      // Handle Parse Date format: {__type: "Date", iso: "2025-11-11T..."}
      if (typeof timestamp === 'object' && timestamp.__type === 'Date' && timestamp.iso) {
        date = new Date(timestamp.iso);
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) return 'recently';

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'recently';
    }
  };

  // Load conversations from backend on mount
  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoadingConversations(true);
    try {
      const Parse = getParse();
      const sessionToken = Parse.User.current()?.getSessionToken() || undefined;
      
      // Try getInboxConversations first (preferred API with full data)
      let result;
      try {
        result = await ParseApi.callCloudFunction(
          'getInboxConversations', 
          { limit: 50, skip: 0 },
          sessionToken
        );
      } catch (inboxError) {
        console.warn('getInboxConversations failed, falling back to getChatRooms:', inboxError);
        
        // Fallback: Use getChatRooms API directly
        result = await ParseApi.callCloudFunction(
          'getChatRooms',
          {},
          sessionToken
        );
      }

      if (Array.isArray(result) && result.length > 0) {
        const formattedConversations: LinkedInConversation[] = result.map((conv: unknown) => {
          const convData = conv as Record<string, unknown>;
          
          // Handle both getInboxConversations and getChatRooms response formats
          const participantIds = (convData.participants as string[]) || [];
          const currentUserId = user.id;
          const otherParticipantId = participantIds.find(id => id !== currentUserId) || participantIds[0] || 'unknown';
          
          return {
            id: (convData.objectId || convData.id || '') as string,
            participant: {
              id: otherParticipantId,
              name: (convData.title || convData.participantName || 'Chat') as string,
              avatar: (convData.avatar || undefined) as string | undefined,
              role: (convData.participantRole || 'counselor') as 'counselor',
              isOnline: (convData.isActive === true || convData.isOnline === true)
            },
            lastMessage: {
              id: 'last',
              content: (convData.lastMessage || 'Start a conversation...') as string,
              sender: {
                id: (convData.lastSenderId || 'system') as string,
                name: (convData.lastSenderName || 'System') as string,
                role: 'system'
              },
              // Pass raw lastActivity to formatMessageDate which handles Parse Date format
              timestamp: convData.lastActivity || new Date(),
              isRead: (convData.isRead !== false)
            },
            unreadCount: (convData.unreadCount || 0) as number,
            isPinned: (convData.isPinned || false) as boolean,
            archivedAt: convData.archivedAt ? new Date(convData.archivedAt as string | number | Date) : undefined
          };
        });
        
        setConversations(formattedConversations);
      } else {
        // No conversations found
        setConversations([]);
      }
    } catch (error) {
      console.error('Failed to load conversations from both APIs:', error);
      // Last resort: Use rooms from useChat hook if available
      if (rooms && rooms.length > 0) {
        setConversations(rooms.map(room => ({
          id: room.id,
          participant: {
            id: room.participants[0] || 'unknown',
            name: room.title || 'Chat',
            role: 'counselor' as const,
            isOnline: room.isActive
          },
          lastMessage: {
            id: 'last',
            content: room.lastMessage || 'Start a conversation...',
            sender: { id: 'system', name: 'System', role: 'system' },
            timestamp: room.lastActivity,
            isRead: true
          },
          unreadCount: room.unreadCount || 0
        })));
      } else {
        setConversations([]);
      }
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, rooms]);

  // Generate sample notifications for testing
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'New message from Counselor',
        message: 'Responded to your university course question',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        actionUrl: '/inbox'
      },
      {
        id: '2',
        type: 'session',
        title: 'Session reminder',
        message: 'Your career counseling session starts in 1 hour',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        actionUrl: '/guidance/book-session'
      },
      {
        id: '3',
        type: 'assessment',
        title: 'Assessment complete',
        message: 'Your RIASEC results are ready to view',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true,
        actionUrl: '/assessment'
      },
      {
        id: '4',
        type: 'system',
        title: 'KUCCPS deadline approaching',
        message: 'Only 14 days left to submit your choices',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        actionUrl: '/dashboard'
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !conv.archivedAt // Hide archived conversations by default
  );

  // Sort: Pinned first, then by last activity
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(selectedConversation.id, newMessage.trim());
      setNewMessage('');
      // Reload messages after sending
      toast.success('Message sent');
    } catch (error) {
      console.error('Send failed:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleConversationClick = (conversation: LinkedInConversation) => {
    setSelectedConversation(conversation);
    
    // Convert LinkedInConversation to ChatRoom and load messages
    const chatRoom = {
      id: conversation.id,
      title: conversation.participant.name,
      type: conversation.participant.role === 'counselor' ? 'counseling' as const : 'mentoring' as const,
      participants: [user?.id || '', conversation.participant.id],
      lastMessage: conversation.lastMessage.content,
      lastActivity: conversation.lastMessage.timestamp,
      messageCount: 0,
      isActive: conversation.participant.isOnline,
      createdBy: conversation.lastMessage.sender.id
    };
    
    setCurrentRoom(chatRoom);
    
    // Mark as read locally (backend will handle persistence)
    setConversations(prev => prev.map(c => 
      c.id === conversation.id 
        ? { ...c, unreadCount: 0, lastMessage: { ...c.lastMessage, isRead: true } }
        : c
    ));
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
    setNewMessage('');
  };

  const handleArchiveConversation = async () => {
    if (!selectedConversation) return;
    
    try {
      const sessionToken = (user as unknown as { sessionToken?: string })?.sessionToken;
      await ParseApi.callCloudFunction(
        'archiveConversation',
        { chatRoomId: selectedConversation.id },
        sessionToken
      );
      
      // Remove from local state
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
      handleCloseConversation();
      toast.success('Conversation archived');
    } catch (error) {
      console.error('Archive failed:', error);
      toast.error('Failed to archive conversation');
    }
  };

  const handlePinConversation = (conv: LinkedInConversation) => {
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, isPinned: !c.isPinned } : c
    ));
    toast.success(conv.isPinned ? 'Unpinned' : 'Pinned');
  };

  // 4-STATE EMPTY STATE COMPONENT
  const EmptyStateDisplay = () => {
    // State 1: Brand new user (no conversations at all)
    if (sortedConversations.length === 0 && !searchTerm && !isLoadingConversations) {
      return (
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <MessageCircle className="h-10 w-10 text-orange-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Your Inbox is Empty
          </h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
            Connect with counselors to get personalized career guidance. They'll reach out after you complete an assessment.
          </p>
          <div className="space-y-3">
            {!isPremium && (
              <div className="text-xs text-gray-500">
                <Lock className="inline h-3 w-3 mr-1" />
                Premium feature available with subscription
              </div>
            )}
          </div>
        </div>
      );
    }

    // State 2: Search returned no results
    if (searchTerm && sortedConversations.length === 0) {
      return (
        <div className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-3">
            No conversations match "{searchTerm}"
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            Clear Search
          </Button>
        </div>
      );
    }

    return null;
  };

  // PROFESSIONAL LINKEDIN-STYLE LAYOUT
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Freemium Upgrade Banner */}
      {isFreeStudent && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Free Tier: Reply-Only</p>
                <p className="text-xs text-orange-100">Upgrade to initiate conversations with counselors</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              onClick={() => navigate('/subscription')}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-57px)] md:h-screen p-4 md:p-6">
        {/* LinkedIn-style Unified Card */}
        <div className="h-full flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* LEFT SIDEBAR: Conversations List */}
          <div className={cn(
            "w-full md:w-96 flex flex-col border-r border-gray-200 bg-white",
            selectedConversation && "hidden md:flex"
          )}>
            {/* Header with Notification Bell and Compose Button */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
                  {/* Notification Bell */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-lg hover:bg-orange-100 relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell className="h-5 w-5 text-gray-600" />
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {notifications.filter(n => !n.isRead).length}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  className={cn(
                    "rounded-lg px-3 py-2 shadow-sm font-semibold",
                    isFreeStudent
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
                      : "bg-[#f97316] hover:bg-[#ea580c] text-white"
                  )}
                  onClick={() => {
                    if (isFreeStudent) {
                      toast.error('Premium feature - Upgrade to initiate conversations');
                      navigate('/subscription');
                    } else {
                      setShowComposeDialog(true);
                    }
                  }}
                  disabled={isFreeStudent}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-100 border-none focus:bg-white focus:border-orange-500 focus:ring-orange-500 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-24 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                        toast.success('All notifications marked as read');
                      }}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-gray-100"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="max-h-80">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                            !notification.isRead && "bg-orange-50/50"
                          )}
                          onClick={() => {
                            if (notification.actionUrl) {
                              navigate(notification.actionUrl);
                              setShowNotifications(false);
                            }
                            // Mark as read
                            setNotifications(notifications.map(n =>
                              n.id === notification.id ? { ...n, isRead: true } : n
                            ));
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                              notification.type === 'message' && "bg-orange-100",
                              notification.type === 'session' && "bg-blue-100",
                              notification.type === 'assessment' && "bg-green-100",
                              notification.type === 'system' && "bg-purple-100"
                            )}>
                              {notification.type === 'message' && <MessageCircle className="h-5 w-5 text-orange-600" />}
                              {notification.type === 'session' && <Phone className="h-5 w-5 text-blue-600" />}
                              {notification.type === 'assessment' && <Check className="h-5 w-5 text-green-600" />}
                              {notification.type === 'system' && <Bell className="h-5 w-5 text-purple-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="font-semibold text-sm text-gray-900 truncate">{notification.title}</p>
                                {!notification.isRead && (
                                  <div className="flex-shrink-0 h-2 w-2 bg-orange-500 rounded-full" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-1">{notification.message}</p>
                              <p className="text-xs text-gray-500">{formatMessageDate(notification.timestamp)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setNotifications(notifications.filter(n => n.id !== notification.id));
                                toast.success('Notification removed');
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              {isLoadingConversations ? (
                <div className="p-6 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin text-[#f97316] mx-auto mb-2" />
                  <p className="text-sm">Loading conversations...</p>
                </div>
              ) : sortedConversations.length === 0 ? (
                <EmptyStateDisplay />
              ) : (
                <div className="divide-y divide-gray-100">
                  {sortedConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200 border-l-4 border-l-transparent",
                        selectedConversation?.id === conversation.id
                          ? "bg-orange-50 border-l-orange-500 hover:bg-orange-50"
                          : "hover:bg-gray-50 active:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                            <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm">
                              {conversation.participant.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.participant.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                              {conversation.participant.name}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 flex-shrink-0">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {conversation.participant.isOnline && (
                            <p className="text-xs text-green-600 font-medium mb-1">Online</p>
                          )}
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {conversation.lastMessage.sender.id === user?.id ? 'You: ' : ''}
                            {conversation.lastMessage.content}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatMessageDate(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.isPinned && (
                              <Pin className="h-3 w-3 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* RIGHT PANEL: Chat Thread */}
          <div className={cn(
            "flex-1 flex flex-col bg-white",
            selectedConversation ? "flex" : "hidden md:flex"
          )}>
            {!selectedConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600 text-sm max-w-xs">
                    Choose a conversation from the sidebar to view messages and continue chatting
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Mobile Back Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden h-9 w-9 p-0 hover:bg-gray-100 rounded-lg"
                        onClick={handleCloseConversation}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </Button>

                      {/* Avatar & Info */}
                      <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
                        <AvatarImage src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                          {selectedConversation.participant.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-900 text-sm truncate">
                          {selectedConversation.participant.name}
                        </h2>
                        <div className="flex items-center gap-1 text-xs">
                          {selectedConversation.participant.isOnline ? (
                            <>
                              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                              <span className="text-green-600 font-medium">Active now</span>
                            </>
                          ) : (
                            <span className="text-gray-500">Offline</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                        title="Call"
                        onClick={() => toast.info('Voice calling coming soon!')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                        title="Video call"
                        onClick={() => toast.info('Video calling coming soon!')}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                        title="Conversation info"
                        onClick={() => toast.info('Conversation details coming soon!')}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                        onClick={() => handlePinConversation(selectedConversation)}
                        title={selectedConversation.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                        onClick={handleArchiveConversation}
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden h-9 w-9 p-0 hover:bg-gray-100 rounded-lg"
                        onClick={handleCloseConversation}
                      >
                        <X className="h-5 w-5 text-gray-700" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden bg-white">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-gray-500">
                          <div className="text-center">
                            <MessageCircle className="h-12 w-12 mb-2 text-gray-300 mx-auto" />
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwnMessage = message.sender.id === user?.id;
                          return (
                            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <div className={cn(
                                "group max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm transition-shadow hover:shadow-md",
                                isOwnMessage
                                  ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none"
                                  : "bg-gray-100 text-gray-900 rounded-bl-none"
                              )}>
                                <div className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                                  {message.message}
                                </div>
                                <div className={cn(
                                  "flex items-center gap-2 mt-2 text-xs justify-end opacity-75",
                                  isOwnMessage ? "text-orange-100" : "text-gray-600"
                                )}>
                                  <span>
                                    {message.timestamp instanceof Date && !isNaN(message.timestamp.getTime())
                                      ? message.timestamp.toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })
                                      : 'just now'
                                    }
                                  </span>
                                  {isOwnMessage && message.status && (
                                    <span className="text-xs">
                                      {message.status === 'sent' ? '✓' : message.status === 'read' ? '✓✓' : '◯'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 focus-within:bg-white focus-within:shadow-md focus-within:border-2 focus-within:border-orange-500">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-orange-100 hover:text-orange-600 flex-shrink-0"
                        onClick={() => toast.info('Emoji picker coming soon!')}
                        title="Add emoji"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-orange-100 hover:text-orange-600 flex-shrink-0"
                        onClick={() => toast.info('File attachments coming soon!')}
                        title="Attach file"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Textarea
                        placeholder="Write a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={isSending || isLoading}
                        className="flex-1 min-h-[40px] max-h-[100px] resize-none border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder-gray-500"
                        rows={1}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending || isLoading}
                      size="sm"
                      className="h-10 w-10 p-0 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex-shrink-0 shadow-md"
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-medium">Enter</kbd> to send,
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-medium mx-1">Shift+Enter</kbd> for new line
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <ComposeDialog
        isOpen={showComposeDialog}
        onClose={() => setShowComposeDialog(false)}
        onSuccess={() => {
          setShowComposeDialog(false);
          loadConversations();
          toast.success('Conversation started! Check your inbox.');
        }}
        isPremium={isPremium}
      />
    </div>
  );
};

export default InboxPage;
