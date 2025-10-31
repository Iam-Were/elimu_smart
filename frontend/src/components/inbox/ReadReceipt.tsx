import React from 'react';
import { Check, CheckCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadReceiptProps {
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  timestamp?: string;
  className?: string;
}

export const ReadReceipt: React.FC<ReadReceiptProps> = ({ status = 'sent', timestamp, className }) => {
  const getIcon = () => {
    switch (status) {
      case 'sending':
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" aria-label="Sending" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" aria-label="Sent" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" aria-label="Delivered" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-600" aria-label="Read" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex items-center gap-2 text-xs text-gray-500', className)}>
      {timestamp && <span>{timestamp}</span>}
      {getIcon()}
    </div>
  );
};
