import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  zIndex?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  zIndex = 1000,
}) => {
  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
};