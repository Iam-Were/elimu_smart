import React, { useState, useCallback } from 'react';
import { Message } from '@chatscope/chat-ui-kit-react';
import { Star, Smile, Reply, Copy, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Button from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

interface EnhancedMessageProps {
  id: string;
  message: string;
  sentTime: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
  position?: 'single' | 'first' | 'normal' | 'last';
  isStarred?: boolean;
  reactions?: MessageReaction[];
  currentUserId?: string;
  onToggleStar?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  id,
  message,
  sentTime,
  sender,
  direction,
  position = 'single',
  isStarred = false,
  reactions = [],
  currentUserId,
  onToggleStar,
  onToggleReaction,
  onReply,
  onDelete,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isOwnMessage = direction === 'outgoing';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  }, [message]);

  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <div className="relative group">
      {/* Star Indicator */}
      {isStarred && (
        <div
          className={cn(
            "absolute -top-2 z-10",
            isOwnMessage ? "-left-2" : "-right-2"
          )}
        >
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 drop-shadow-md" />
        </div>
      )}

      {/* Message Actions Dropdown */}
      <div
        className={cn(
          "absolute -top-4 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20",
          isOwnMessage ? "right-0 mr-2" : "left-0 ml-2"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
            >
              <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isOwnMessage ? 'end' : 'start'} className="w-48">
            <DropdownMenuItem onClick={() => setShowReactionPicker(true)}>
              <Smile className="mr-2 h-4 w-4" />
              Add Reaction
            </DropdownMenuItem>
            {onReply && (
              <DropdownMenuItem onClick={() => onReply(id)}>
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
            )}
            {onToggleStar && (
              <DropdownMenuItem onClick={() => onToggleStar(id)}>
                <Star className={cn("mr-2 h-4 w-4", isStarred && "fill-yellow-500 text-yellow-500")} />
                {isStarred ? 'Unstar' : 'Star'} Message
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Text
            </DropdownMenuItem>
            {isOwnMessage && onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Message
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reaction Picker Popover */}
      <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
        <PopoverTrigger asChild>
          <span className="invisible" />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 bg-white shadow-xl border border-gray-200 rounded-full"
          align={isOwnMessage ? 'end' : 'start'}
          side="top"
        >
          <div className="flex items-center gap-1">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  if (onToggleReaction) {
                    onToggleReaction(id, emoji);
                  }
                  setShowReactionPicker(false);
                }}
                className="text-xl hover:scale-125 transition-transform p-1 hover:bg-gray-100 rounded-full"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Chatscope Message Component */}
      <Message
        model={{
          message,
          sentTime,
          sender,
          direction,
          position,
        }}
      >
        <Message.Footer sentTime={sentTime} />
      </Message>

      {/* Message Reactions */}
      {reactions.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap gap-1.5 mt-2",
            isOwnMessage ? "justify-end" : "justify-start"
          )}
        >
          {reactions.map((reaction) => {
            const userReacted = currentUserId && reaction.users.includes(currentUserId);
            return (
              <button
                key={reaction.emoji}
                onClick={() => onToggleReaction && onToggleReaction(id, reaction.emoji)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 border rounded-full text-xs transition-all duration-200 shadow-sm hover:shadow-md",
                  userReacted
                    ? "bg-orange-50 border-orange-400"
                    : "bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-50"
                )}
                title={`${reaction.users.join(', ')} reacted with ${reaction.emoji}`}
              >
                <span>{reaction.emoji}</span>
                <span className="text-gray-600">{reaction.count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnhancedMessage;
