import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageCircle,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Circle,
  Loader2,
  Send,
  Archive,
  X,
  Check,
  CheckCheck
} from 'lucide-react';
import { useChat, type ChatRoom } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
}

const InboxPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<LinkedInConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Backend integration
  const { user } = useAuth();
  const {
    rooms,
    currentRoom,
    messages,
    isLoading,
    error,
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

        // Transform search results to LinkedIn-style
        const transformedResults: LinkedInConversation[] = results.map((room) => {
          const otherParticipants = room.participants.filter((participant) => participant !== user?.id);
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
        });

        setSearchResults(transformedResults);
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchConversations, user]);

  // Filter conversations based on active filter
  const getFilteredConversations = () => {
    const baseConversations = searchTerm.trim() ? searchResults : linkedInConversations;
    
    switch (activeFilter) {
      case 'unread':
        return baseConversations.filter((conversation) => conversation.unreadCount > 0);
      case 'starred':
        // TODO: Implement starred logic when backend supports it
        return baseConversations;
      case 'archived':
        // TODO: Load archived conversations from backend
        return [];
      case 'all':
      default:
        return baseConversations;
    }
  };

  const filteredConversations = getFilteredConversations();

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

  return (
    <>
      {/* Compose Modal - Simple version */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsComposeModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Message</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsComposeModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                <Input placeholder="Search for a counselor or mentor..." className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <Textarea placeholder="Type your message here..." rows={4} className="w-full" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsComposeModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="h-screen flex bg-gray-50">
      {/* LinkedIn-style Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#f97316]" />
              Messaging
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
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-md"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'unread', 'starred', 'archived'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors capitalize",
                  activeFilter === filter
                    ? "bg-white text-[#f97316] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {filter}
                {filter === 'unread' && linkedInConversations.filter(c => c.unreadCount > 0).length > 0 && (
                  <span className="ml-1 bg-[#f97316] text-white rounded-full px-1.5 py-0.5 text-[10px]">
                    {linkedInConversations.filter(c => c.unreadCount > 0).length}
                  </span>
                )}
              </button>
            ))}
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
              <span className="text-xs text-gray-400 mt-1">Start connecting with counselors and mentors</span>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors",
                  selectedConversation?.id === conversation.id && "bg-[#f97316]/10 border-l-4 border-l-[#f97316]"
                )}
                onClick={() => handleConversationClick(conversation)}
              >
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
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participant.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {selectedConversation.participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedConversation.participant.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.participant.isOnline ? 'Active now' : 'Away'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Phone className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Video className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={handleArchive}
                    title="Archive conversation"
                  >
                    <Archive className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={handleCloseConversation}
                    title="Close conversation"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender.id === user?.id;
                  const showTimestamp = index === 0 || 
                    (messages[index - 1] && 
                     new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000); // 5 minutes
                  
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
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                          isOwnMessage
                            ? 'bg-[#f97316] text-white rounded-br-md'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                        }`}>
                          <div className="break-words whitespace-pre-wrap">{message.message}</div>
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
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-start gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full flex-shrink-0 mt-1">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full flex-shrink-0 mt-1">
                  <Smile className="h-4 w-4 text-gray-500" />
                </Button>
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
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending || isLoading}
                  size="sm"
                  className="h-8 w-8 p-0 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 rounded-full flex-shrink-0 mt-1"
                  title={isSending ? 'Sending...' : 'Send message (Enter)'}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
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