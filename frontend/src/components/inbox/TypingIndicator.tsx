import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  participantName: string;
  participantAvatar?: string;
  participantInitials?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  participantName,
  participantAvatar,
  participantInitials,
}) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      {participantAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          {participantAvatar && <AvatarImage src={participantAvatar} alt={participantName} />}
          {participantInitials && (
            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
              {participantInitials}
            </AvatarFallback>
          )}
        </Avatar>
      )}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{participantName} is typing</span>
        <div className="flex gap-1">
          <span
            className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};
