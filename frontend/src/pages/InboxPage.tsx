import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Archive,
  Search,
  Send,
  Phone,
  Video,
  X,
  MoreVertical,
  MessageCircle,
  Loader2,
  Circle,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionPaywall } from '@/components/subscription/SubscriptionPaywall';
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
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<LinkedInConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const { user } = useAuth();
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();
  const { rooms, messages, isLoading, sendMessage } = useChat();

  // Check if user has premium access
  const isPremium = userSubscription?.status === 'active' &&
    userSubscription?.plan !== 'free';

  // Show paywall if not premium (after subscription data loads)
  useEffect(() => {
    if (!subscriptionLoading && !isPremium && user?.role === 'student') {
      setShowPaywall(true);
    }
  }, [subscriptionLoading, isPremium, user]);

  // Transform rooms to conversations
  const linkedInConversations: LinkedInConversation[] = rooms.map(room => ({
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
  }));

  const filteredConversations = linkedInConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(selectedConversation.id, newMessage.trim());
      setNewMessage('');
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
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
    setNewMessage('');
  };

  // Render paywall for free users (students only)
  if (showPaywall && user?.role === 'student') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <SubscriptionPaywall
          isOpen={true}
          onClose={() => navigate('/dashboard')}
          feature="messaging"
        />
      </div>
    );
  }

  // Premium users and counselors see full inbox
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* LinkedIn-style Single Unified Card */}
      <Card className="w-full max-w-7xl mx-auto h-[calc(100vh-2rem)] shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex h-full">
          {/* Left Sidebar - Conversations List */}
          <div className={cn(
            "w-full md:w-80 flex flex-col border-r border-gray-200 bg-white",
            selectedConversation && "hidden md:flex"
          )}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#f97316]" />
                  Messages
                </h1>
                <Button
                  size="sm"
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg px-4 shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  Compose
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-[#f97316] focus:ring-[#f97316] rounded-lg"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin text-[#f97316] mx-auto mb-2" />
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className={cn(
                      "p-4 border-b border-gray-100 cursor-pointer transition-all duration-200",
                      "hover:bg-gray-50 active:bg-gray-100",
                      selectedConversation?.id === conversation.id &&
                      "bg-orange-50 border-l-4 border-l-orange-500 hover:bg-orange-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage src={conversation.participant.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                            {conversation.participant.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.participant.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-orange-500 text-white text-xs">{conversation.unreadCount}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate leading-relaxed">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Right Panel - Chat Area */}
          <div className={cn(
            "flex-1 flex-col bg-white",
            selectedConversation ? "flex" : "hidden md:flex"
          )}>
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.participant.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                          {selectedConversation.participant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h2>
                        <div className="flex items-center gap-1 text-xs">
                          {selectedConversation.participant.isOnline ? (
                            <>
                              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                              <span className="text-green-600">Active now</span>
                            </>
                          ) : (
                            <span className="text-gray-500">Offline</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors">
                        <Phone className="h-5 w-5 text-gray-700" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors">
                        <Video className="h-5 w-5 text-gray-700" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors">
                        <Archive className="h-5 w-5 text-gray-700" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-700" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                        onClick={handleCloseConversation}
                      >
                        <X className="h-5 w-5 text-gray-700" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden bg-gray-50">
                  <ScrollArea className="h-full p-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mb-3 text-gray-300 mx-auto" />
                          <p className="text-sm">Start a conversation...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwnMessage = message.sender.id === user?.id;
                          return (
                            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={cn(
                                  "max-w-md px-4 py-3 rounded-2xl shadow-sm",
                                  isOwnMessage
                                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-sm"
                                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                                )}
                              >
                                <div className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                                  {message.message}
                                </div>
                                <div className={cn(
                                  "flex items-center gap-1.5 mt-2 text-xs",
                                  isOwnMessage ? "text-orange-100 justify-end" : "text-gray-500"
                                )}>
                                  <span>
                                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end gap-3 bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-200 p-3">
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
                      className="flex-1 min-h-[44px] max-h-[120px] resize-none border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending || isLoading}
                      size="sm"
                      className="h-10 w-10 p-0 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 rounded-full flex-shrink-0 shadow-md"
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-medium">Enter</kbd> to send,
                    <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-medium ml-1">Shift+Enter</kbd> for new line
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InboxPage;
