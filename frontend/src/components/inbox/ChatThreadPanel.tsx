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
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const msgDate = new Date(date);

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
      {/* HEADER */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
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

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Phone className="h-4 w-4" />
            <span className="sr-only">Start voice call</span>
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Video className="h-4 w-4" />
            <span className="sr-only">Start video call</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4" />
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

      {/* MESSAGE INPUT */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-3">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            disabled={isSending}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          {/* Emoji button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            disabled={isSending}
          >
            <Smile className="h-4 w-4" />
            <span className="sr-only">Add emoji</span>
          </Button>

          {/* Message input */}
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift + Enter for new line)"
            className="resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={isSending}
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="bg-orange-600 text-white hover:bg-orange-700 flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Send</span>
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
