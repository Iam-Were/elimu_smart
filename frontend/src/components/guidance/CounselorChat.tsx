import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Send, Video, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CounselorChat: React.FC = () => {
  const [message, setMessage] = useState('');

  // Use chat hook for backend integration
  const { user } = useAuth();
  const {
    rooms,
    currentRoom,
    messages,
    isLoading,
    sendMessage: sendChatMessage,
    setCurrentRoom,
    loadChatRooms
  } = useChat();

  // Select first counseling room on mount
  useEffect(() => {
    if (user && rooms.length > 0 && !currentRoom) {
      const counselingRoom = rooms.find(r => r.type === 'counseling') || rooms[0];
      setCurrentRoom(counselingRoom);
    }
  }, [user, rooms, currentRoom, setCurrentRoom]);

  // Load rooms on mount
  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user, loadChatRooms]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentRoom) {
      toast.error('No active conversation', {
        description: 'Please start a conversation first'
      });
      return;
    }

    try {
      await sendChatMessage(currentRoom.id, message);
      setMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Message send failed:', error);
      toast.error('Failed to send message', {
        description: 'Please try again'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Note: H1 "Guidance Center" is provided by Sprint18Layout */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Chat with Counselor</h2>
          <p className="text-muted-foreground">Real-time support and guidance</p>
        </div>

        <Card className="border-orange-200 h-[600px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                  {currentRoom?.title ? currentRoom.title.substring(0, 2).toUpperCase() : 'CC'}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {currentRoom?.title || 'Career Counselor'}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${currentRoom?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>{currentRoom?.isActive ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[70%] space-y-1">
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        msg.sender.id === user?.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div className={`text-xs text-muted-foreground ${
                      msg.sender.id === user?.id ? 'text-right' : 'text-left'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Replies */}
          <div className="p-4 border-t border-orange-100">
            <div className="flex flex-wrap gap-2 mb-3">
              {['Thank you', 'Can we schedule a call?', 'I need help with my parents', 'What are my options?'].map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(reply)}
                  className="text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-orange-100">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CounselorChat;