import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Pin, Archive, VolumeX, Trash, MoreVertical, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationListItemProps {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantInitials: string;
  participantTitle?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isPinned?: boolean;
  isPremium?: boolean;
  isSelected?: boolean;
  onClick: (id: string) => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  onMute?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  id,
  participantName,
  participantAvatar,
  participantInitials,
  participantTitle,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  isPinned = false,
  isPremium = false,
  isSelected = false,
  onClick,
  onPin,
  onArchive,
  onMute,
  onDelete,
}) => {
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={cn(
        'p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100',
        isSelected && 'bg-orange-50 border-l-4 border-l-orange-500'
      )}
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      aria-label={`Conversation with ${participantName}: ${lastMessage}`}
      aria-current={isSelected ? 'page' : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      {/* Top row: Avatar + Name + Time + Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12 ring-2 ring-white">
              {participantAvatar && <AvatarImage src={participantAvatar} alt={participantName} />}
              <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                {participantInitials}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                'font-semibold text-sm truncate',
                unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
              )}>
                {participantName}
              </h3>
              {isPremium && (
                <Badge className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0">Premium</Badge>
              )}
              {isPinned && (
                <Pin className="h-3 w-3 text-orange-500 fill-orange-500" />
              )}
            </div>
            {participantTitle && (
              <p className="text-xs text-gray-500 truncate">{participantTitle}</p>
            )}
          </div>
        </div>

        {/* Right side: Time + Unread + Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <span className={cn(
            'text-xs',
            unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
          )}>
            {timestamp}
          </span>
          {unreadCount > 0 && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 min-w-[1.25rem] justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onPin && (
                <DropdownMenuItem onClick={(e) => handleActionClick(e as unknown as React.MouseEvent, () => onPin(id))}>
                  <Pin className="h-4 w-4 mr-2" />
                  {isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={(e) => handleActionClick(e as unknown as React.MouseEvent, () => onArchive(id))}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              )}
              {onMute && (
                <DropdownMenuItem onClick={(e) => handleActionClick(e as unknown as React.MouseEvent, () => onMute(id))}>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Mute
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => handleActionClick(e as unknown as React.MouseEvent, () => onDelete(id))}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Message preview */}
      <div className="ml-15 text-sm text-gray-600 line-clamp-2">
        {lastMessage}
      </div>

      {/* Presence status text */}
      {isOnline && (
        <div className="ml-15 mt-1 flex items-center gap-2 text-xs text-gray-500">
          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
          <span>Online</span>
        </div>
      )}
    </div>
  );
};
