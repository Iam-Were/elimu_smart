import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import {
  ChevronLeft,
  Phone,
  Video,
  Info,
  MoreVertical,
  Pin,
  VolumeX,
  Archive,
  Trash,
  Paperclip,
  Smile,
  Send,
  Loader2,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/useChat';

interface ChatThreadPanelProps {
  conversationId: string;
  participantName: string;
  participantAvatar?: string;
  participantInitials: string;
  participantTitle?: string;
  isOnline?: boolean;
  isPinned?: boolean;
  messages: ChatMessage[];
  currentUserId: string;
  isTyping?: boolean;
  isSending?: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onBack?: () => void;
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReply?: (messageId: string) => void;
  onStarMessage?: (messageId: string) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  starredMessageIds?: string[];
}

export const ChatThreadPanel: React.FC<ChatThreadPanelProps> = ({
  conversationId,
  participantName,
  participantAvatar,
  participantInitials,
  participantTitle,
  isOnline = false,
  isPinned = false,
  messages,
  currentUserId,
  isTyping = false,
  isSending = false,
  onSendMessage,
  onBack,
  onPin,
  onMute,
  onArchive,
  onDelete,
  onReply,
  onStarMessage,
  onReactToMessage,
  onDeleteMessage,
  starredMessageIds = [],
}) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    try {
      const validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        return ''; // Return empty string for invalid dates
      }
      return validDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  const formatDate = (date: Date) => {
    try {
      const today = new Date();
      const msgDate = new Date(date);

      if (isNaN(msgDate.getTime())) {
        return ''; // Return empty string for invalid dates
      }

      if (msgDate.toDateString() === today.toDateString()) {
        return 'Today';
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (msgDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }

      return msgDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return '';
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = new Date(message.timestamp).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER - LinkedIn Style */}
      <div className="flex-shrink-0 px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile back button */}
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="md:hidden p-2 h-auto"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to conversations</span>
            </Button>
          )}

          {/* Participant info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10">
                {participantAvatar && <AvatarImage src={participantAvatar} alt={participantName} />}
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  {participantInitials}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {participantName}
              </h3>
              {isOnline ? (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Circle className="h-1.5 w-1.5 fill-green-600" />
                  Online
                </p>
              ) : (
                <p className="text-xs text-gray-500">{participantTitle || 'Offline'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons - LinkedIn Style */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all hover:scale-110 active:scale-95"
            title="Voice call"
          >
            <Phone className="h-5 w-5" />
            <span className="sr-only">Start voice call</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all hover:scale-110 active:scale-95"
            title="Video call"
          >
            <Video className="h-5 w-5" />
            <span className="sr-only">Start video call</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all hover:scale-110 active:scale-95"
            title="Conversation info"
          >
            <Info className="h-5 w-5" />
            <span className="sr-only">View details</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPin && (
                <DropdownMenuItem onClick={() => onPin(conversationId)}>
                  <Pin className={cn('h-4 w-4 mr-2', isPinned && 'fill-orange-500 text-orange-500')} />
                  {isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
              )}
              {onMute && (
                <DropdownMenuItem onClick={() => onMute(conversationId)}>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Mute
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(conversationId)}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(conversationId)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          Object.keys(groupedMessages).map((dateKey) => {
            const dateMessages = groupedMessages[dateKey];
            const firstMessage = dateMessages[0];

            return (
              <div key={dateKey}>
                {/* Date divider */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-500 font-medium">
                    {formatDate(firstMessage.timestamp)}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Messages for this date */}
                {dateMessages.map((msg) => {
                  // Filter out 'failed' status to match ReadReceipt component
                  const messageStatus = msg.status === 'failed' ? 'sent' : msg.status;

                  return (
                    <MessageBubble
                      key={msg.id}
                      id={msg.id}
                      content={msg.message}
                      timestamp={formatTime(msg.timestamp)}
                      direction={msg.sender.id === currentUserId ? 'outgoing' : 'incoming'}
                      senderName={msg.sender.id !== currentUserId ? `${msg.sender.firstName} ${msg.sender.lastName}` : undefined}
                      senderAvatar={msg.sender.id !== currentUserId ? participantAvatar : undefined}
                      senderInitials={msg.sender.id !== currentUserId ? participantInitials : undefined}
                      status={messageStatus}
                      reactions={msg.reactions}
                      isStarred={starredMessageIds.includes(msg.id)}
                      currentUserId={currentUserId}
                      onReply={onReply}
                      onStar={onStarMessage}
                      onReact={onReactToMessage}
                      onDelete={msg.sender.id === currentUserId ? onDeleteMessage : undefined}
                    />
                  );
                })}
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <TypingIndicator
            participantName={participantName}
            participantAvatar={participantAvatar}
            participantInitials={participantInitials}
          />
        )}

        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* MESSAGE INPUT - LinkedIn Style */}
      <div className="flex-shrink-0 px-6 py-4 border-t-2 border-gray-200 bg-white">
        <div className="flex items-center gap-3 w-full">
          {/* Attachment button - LinkedIn Style */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all hover:scale-110 active:scale-95"
            disabled={isSending}
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          {/* Emoji button - LinkedIn Style */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all hover:scale-110 active:scale-95"
            disabled={isSending}
            title="Add emoji"
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Add emoji</span>
          </Button>

          {/* Message input - LinkedIn Style with enhanced focus */}
          <div className="flex-1 min-w-0 relative">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none min-h-[44px] max-h-[120px] w-full touch-manipulation bg-gray-50 border-gray-200 rounded-3xl px-5 py-3 transition-all duration-200 focus-within:bg-white focus-within:shadow-lg focus-within:ring-2 focus-within:ring-orange-500"
              rows={1}
              disabled={isSending}
            />
          </div>

          {/* Send button - LinkedIn Style with gradient */}
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-11 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Send</span>
              </>
            )}
          </Button>
        </div>

        {/* Character counter */}
        {newMessage.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {newMessage.length}/1000 characters
          </p>
        )}
      </div>
    </div>
  );
};
