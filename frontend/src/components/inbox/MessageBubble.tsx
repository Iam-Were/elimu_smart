import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ReadReceipt } from './ReadReceipt';
import { Reply, MoreVertical, Star, Trash, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageBubbleProps {
  id: string;
  content: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  senderName?: string;
  senderAvatar?: string;
  senderInitials?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  isStarred?: boolean;
  currentUserId?: string;
  onReply?: (messageId: string) => void;
  onStar?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  id,
  content,
  timestamp,
  direction,
  senderName,
  senderAvatar,
  senderInitials,
  status,
  reactions = [],
  isStarred = false,
  currentUserId,
  onReply,
  onStar,
  onReact,
  onDelete,
}) => {
  const isOutgoing = direction === 'outgoing';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(content);
  };

  const popularEmojis = ['❤️', '👍', '😂', '🎉', '🙏'];

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 group',
        isOutgoing && 'flex-row-reverse'
      )}
    >
      {/* Avatar (only for incoming messages) */}
      {!isOutgoing && senderAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        'flex-1 max-w-md',
        isOutgoing && 'flex flex-col items-end'
      )}>
        {/* Sender name (incoming only) */}
        {!isOutgoing && senderName && (
          <p className="text-xs text-gray-600 mb-1 ml-1">{senderName}</p>
        )}

        {/* Message bubble */}
        <div className="relative">
          <div
            className={cn(
              'px-4 py-3 rounded-lg max-w-full break-words shadow-sm',
              isOutgoing
                ? 'bg-orange-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{content}</p>

            {/* Star indicator */}
            {isStarred && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1" />
            )}
          </div>

          {/* Reactions */}
          {reactions.length > 0 && (
            <div className="flex gap-1 mt-1 ml-2">
              {reactions.map((reaction) => {
                const hasReacted = reaction.users.includes(currentUserId || '');
                return (
                  <Button
                    key={reaction.emoji}
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-6 px-2 text-xs rounded-full border-gray-200',
                      hasReacted && 'bg-orange-50 border-orange-300'
                    )}
                    onClick={() => onReact?.(id, reaction.emoji)}
                  >
                    <span>{reaction.emoji}</span>
                    <span className="ml-1 text-xs text-gray-600">{reaction.count}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Timestamp and read receipt (outgoing only) */}
        {isOutgoing && status && (
          <ReadReceipt status={status} timestamp={timestamp} className="mt-1 mr-1" />
        )}

        {/* Timestamp (incoming only) */}
        {!isOutgoing && (
          <p className="text-xs text-gray-500 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">{timestamp}</p>
        )}

        {/* Message actions (visible on hover) */}
        <div className={cn(
          'absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',
          isOutgoing ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'
        )}>
          {onReply && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onReply(id)}>
              <Reply className="h-4 w-4" />
              <span className="sr-only">Reply</span>
            </Button>
          )}

          {/* Quick reactions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <span className="text-sm">😊</span>
                <span className="sr-only">React</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="flex gap-1 p-2">
                {popularEmojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onReact?.(id, emoji)}
                  >
                    <span className="text-lg">{emoji}</span>
                  </Button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onStar && (
                <DropdownMenuItem onClick={() => onStar(id)}>
                  <Star className={cn('h-4 w-4 mr-2', isStarred && 'fill-yellow-400 text-yellow-400')} />
                  {isStarred ? 'Unstar' : 'Star'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleCopyMessage}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isOutgoing && onDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
