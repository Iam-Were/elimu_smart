import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  Loader2
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
}

export const LinkedInStyleChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
    setCurrentRoom
  } = useChat();

  // Transform chat rooms to LinkedIn-style conversations
  const linkedInConversations: LinkedInConversation[] = rooms.map(room => {
    // Extract participant info (excluding current user)
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
      unreadCount: Math.max(0, room.messageCount - (messages.filter(m => m.isRead).length || 0))
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

  const totalUnreadCount = linkedInConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const filteredConversations = linkedInConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'counselor': return 'bg-blue-100 text-blue-700';
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
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 transition-all duration-300 shadow-2xl border-gray-300 ${isMinimized ? 'h-14' : 'h-[450px]'}`}>
        {/* LinkedIn-style Header */}
        <CardHeader className="pb-2 border-b bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 font-semibold">
              <MessageCircle className="h-4 w-4 text-[#f97316]" />
              {currentRoom ? (currentRoom.title || 'Chat') : 'Messaging'}
              {totalUnreadCount > 0 && !currentRoom && (
                <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {totalUnreadCount}
                </Badge>
              )}
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            </CardTitle>
            <div className="flex items-center gap-1">
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
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-3 w-3 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3 text-gray-600" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[400px] bg-white rounded-b-lg">
            {!currentRoom ? (
              // LinkedIn Conversations List
              <>
                {/* Search Bar */}
                <div className="p-3 border-b bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 text-sm border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-md"
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
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
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
              </>
            ) : (
              // LinkedIn Active Conversation
              <>
                {/* Back to messages header */}
                <div className="p-2 border-b bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentRoom(undefined)}
                    className="gap-2 text-[#f97316] hover:bg-orange-50"
                  >
                    ← Back to messages
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
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
                        <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.sender.id === user?.id
                            ? 'bg-[#f97316] text-white rounded-br-sm'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
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

                {/* LinkedIn Message Input */}
                <div className="p-3 border-t bg-white rounded-b-lg">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-200 rounded">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-200 rounded">
                        <Smile className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Write a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={isSending || isLoading}
                      className="flex-1 border-none bg-transparent h-8 text-sm focus:ring-0 focus:border-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending || isLoading}
                      size="sm"
                      className="h-8 w-8 p-0 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 rounded"
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
  );
};

export default LinkedInStyleChat;