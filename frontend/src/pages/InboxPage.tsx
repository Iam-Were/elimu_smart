import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  Archive
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

  // Handle search with backend integration
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LinkedInConversation[]>([]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchConversations(searchTerm);

        // Transform search results to LinkedIn-style
        const transformedResults = results.map(room => {
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

        setSearchResults(transformedResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchConversations, user]);

  const filteredConversations = searchTerm.trim() ? searchResults : linkedInConversations;

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

  const handleArchive = async () => {
    if (!selectedConversation) return;

    try {
      const result = await archiveConversation(selectedConversation.id);
      if (result.success) {
        toast.success('Conversation archived');
        setSelectedConversation(null);
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
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-md"
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
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      message.sender.id === user?.id
                        ? 'bg-[#f97316] text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}>
                      <div>{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender.id === user?.id ? 'text-orange-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-3 bg-gray-50 rounded-full border border-gray-200 p-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full">
                  <Smile className="h-4 w-4 text-gray-500" />
                </Button>
                <Input
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isSending || isLoading}
                  className="flex-1 border-none bg-transparent focus:ring-0 focus:border-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending || isLoading}
                  size="sm"
                  className="h-8 w-8 p-0 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 rounded-full"
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
      </div>
    </div>
  );
};

export default InboxPage;