import React from 'react';
import { Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import { Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedConversationProps {
  id: string;
  name: string;
  lastMessage: string;
  unreadCnt?: number;
  active?: boolean;
  isOnline?: boolean;
  isPinned?: boolean;
  avatarSrc?: string;
  onClick?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const EnhancedConversation: React.FC<EnhancedConversationProps> = ({
  id,
  name,
  lastMessage,
  unreadCnt = 0,
  active = false,
  isOnline = false,
  isPinned = false,
  avatarSrc,
  onClick,
  onTogglePin,
}) => {
  return (
    <div
      className={cn(
        "relative group",
        isPinned && "bg-blue-50/50"
      )}
    >
      {/* Pin Indicator */}
      {isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Pin className="h-3 w-3 text-blue-500 fill-blue-500" />
        </div>
      )}

      {/* Pin Toggle Button (appears on hover) */}
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(id);
          }}
          className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 z-10"
          title={isPinned ? "Unpin conversation" : "Pin conversation"}
        >
          <Pin
            className={cn(
              "h-3.5 w-3.5",
              isPinned ? "text-blue-500 fill-blue-500" : "text-gray-400"
            )}
          />
        </button>
      )}

      {/* Chatscope Conversation Component */}
      <Conversation
        name={name}
        info={lastMessage}
        unreadCnt={unreadCnt}
        active={active}
        onClick={() => onClick && onClick(id)}
      >
        <Avatar
          src={avatarSrc}
          name={name}
          status={isOnline ? 'available' : 'unavailable'}
        />
      </Conversation>
    </div>
  );
};

export default EnhancedConversation;
