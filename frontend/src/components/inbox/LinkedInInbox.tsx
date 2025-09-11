import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Send,
  Search,
  MoreHorizontal,
  Paperclip,
  Image as ImageIcon,
  File,
  Archive,
  Circle,
  CheckCheck,
  Download,
  X,
  Plus
} from 'lucide-react';
import { useChat, type ChatMessage } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

interface LinkedInInboxProps {
  className?: string;
}

export const LinkedInInbox: React.FC<LinkedInInboxProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { 
    rooms, 
    currentRoom, 
    messages, 
    isLoading, 
    setCurrentRoom,
    sendMessage
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations based on search
  const filteredRooms = rooms.filter(room => 
    room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowFilePreview(true);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data URL prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  // Handle sending messages (text or multimedia)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom || !user) return;

    try {
      if (selectedFile) {
        // Upload file and send multimedia message
        const base64Data = await fileToBase64(selectedFile);
        
        // Upload file via cloud function
        await (window as any).Parse.Cloud.run('uploadFile', {
          fileName: selectedFile.name,
          fileData: base64Data,
          fileType: selectedFile.type,
          chatRoomId: currentRoom.id
        });

        setSelectedFile(null);
        setShowFilePreview(false);
      } else if (newMessage.trim()) {
        // Send text message
        await sendMessage(currentRoom.id, newMessage.trim());
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Format timestamp for LinkedIn style
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'now' : `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  // Get user initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`;
  };


  // Render message content
  const renderMessageContent = (message: ChatMessage) => {
    if (message.messageType === 'image') {
      return (
        <div className="max-w-xs">
          <img 
            src={message.fileUrl} 
            alt={message.fileName}
            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"
            onClick={() => window.open(message.fileUrl, '_blank')}
          />
          {message.message && (
            <p className="text-sm mt-1">{message.message}</p>
          )}
        </div>
      );
    } else if (message.messageType === 'file') {
      return (
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border max-w-xs">
          <File className="h-4 w-4 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{message.fileName}</p>
            <p className="text-xs text-gray-500">
              {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)}KB` : 'File'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.open(message.fileUrl, '_blank')}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      );
    }
    return <p className="text-sm">{message.message}</p>;
  };

  return (
    <div className={`flex h-[700px] border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messaging</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredRooms.map(room => {
              const isSelected = currentRoom?.id === room.id;
              const hasUnread = room.messageCount > 0; // Simplified for demo
              
              return (
                <div
                  key={room.id}
                  className={`p-3 rounded cursor-pointer transition-colors hover:bg-gray-100 ${
                    isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                  }`}
                  onClick={() => setCurrentRoom(room)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm bg-orange-100 text-orange-700">
                          {room.type === 'counseling' ? 'C' : room.type === 'mentoring' ? 'M' : 'G'}
                        </AvatarFallback>
                      </Avatar>
                      <Circle className="h-3 w-3 absolute -bottom-1 -right-1 fill-green-500 text-green-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium truncate ${
                          hasUnread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {room.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(room.lastActivity)}
                          </span>
                          {hasUnread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-xs truncate mt-1 ${
                        hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {room.lastMessage || 'Start a conversation...'}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700"
                        >
                          {room.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {currentRoom.type === 'counseling' ? 'C' : 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentRoom.title}</h3>
                    <p className="text-sm text-gray-500">
                      {currentRoom.participants.length} participants • Active now
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender.id === user?.id;
                  const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id;
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                    >
                      {showAvatar && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {getInitials(message.sender.firstName, message.sender.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {!showAvatar && <div className="w-8" />}
                      
                      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !isOwn && (
                          <p className="text-xs text-gray-500 mb-1">
                            {message.sender.firstName} {message.sender.lastName}
                          </p>
                        )}
                        
                        <div 
                          className={`rounded-lg px-3 py-2 ${
                            isOwn 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {renderMessageContent(message)}
                          
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {isOwn && (
                              <CheckCheck className="h-3 w-3 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* File Preview */}
            {showFilePreview && selectedFile && (
              <div className="p-4 border-t border-gray-200 bg-yellow-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedFile.type.startsWith('image/') ? (
                      <ImageIcon className="h-6 w-6 text-blue-500" />
                    ) : (
                      <File className="h-6 w-6 text-blue-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)}KB
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setShowFilePreview(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileSelect}
                  />
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={(!newMessage.trim() && !selectedFile) || isLoading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2 text-gray-700">Select a conversation</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Choose from your existing conversations or start a new one to begin messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};