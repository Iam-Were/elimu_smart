import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Circle,
  Check,
  CheckCheck
} from 'lucide-react';
import { useChat, type ChatRoom } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

interface ChatInterfaceProps {
  initialRoom?: ChatRoom;
  type?: 'counseling' | 'mentoring' | 'group';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialRoom, 
  type = 'counseling' 
}) => {
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

  const [newMessage, setNewMessage] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Set initial room if provided
  useEffect(() => {
    if (initialRoom && !currentRoom) {
      setCurrentRoom(initialRoom);
    }
  }, [initialRoom, currentRoom, setCurrentRoom]);

  // Handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentRoom || !user) return;

    try {
      await sendMessage(currentRoom.id, newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get user initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`;
  };

  // Get room type color
  const getRoomTypeColor = (roomType: string) => {
    switch (roomType) {
      case 'counseling': return 'bg-orange-100 text-orange-800';
      case 'mentoring': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6">
          <div className="text-center text-red-600">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Chat Room List */}
      <div className="w-80 border-r bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4" />
            {type === 'counseling' ? 'Counseling Sessions' : 
             type === 'mentoring' ? 'Mentoring Sessions' : 'Group Chats'}
          </CardTitle>
        </CardHeader>
        
        <ScrollArea className="h-[500px]">
          <div className="space-y-2 px-4 pb-4">
            {rooms.filter(room => room.type === type).map(room => (
              <Card 
                key={room.id}
                className={`cursor-pointer transition-colors hover:bg-orange-50 ${
                  currentRoom?.id === room.id ? 'bg-orange-100 border-orange-200' : ''
                }`}
                onClick={() => setCurrentRoom(room)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm truncate">{room.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getRoomTypeColor(room.type)}`}
                    >
                      {room.type}
                    </Badge>
                  </div>
                  
                  {room.lastMessage && (
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {room.lastMessage}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatTime(room.lastActivity)}
                    </span>
                    {room.messageCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {room.messageCount}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {rooms.filter(room => room.type === type).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No {type} sessions yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{currentRoom.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    Online • {currentRoom.participants.length} participants
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender.id === user?.id;
                  const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id;
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwn && showAvatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(message.sender.firstName, message.sender.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {!isOwn && !showAvatar && <div className="w-8" />}
                      
                      <div className={`max-w-[70%] ${isOwn ? 'order-last' : ''}`}>
                        {!isOwn && showAvatar && (
                          <p className="text-xs text-gray-600 mb-1 px-3">
                            {message.sender.firstName} {message.sender.lastName}
                          </p>
                        )}
                        
                        <div 
                          className={`rounded-lg px-3 py-2 ${
                            isOwn 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            isOwn ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {isOwn && (
                              <div className="flex items-center">
                                {message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {messages.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start your conversation</p>
                  </div>
                )}
                
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">...</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button type="button" variant="secondary" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};