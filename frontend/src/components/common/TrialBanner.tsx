import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Button } from '@/components/ui/button';

export function TrialBanner() {
  const { isActive, daysRemaining, loading } = useTrialStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  if (loading || !isActive || isDismissed) {
    return null;
  }

  const getUrgencyColor = () => {
    if (daysRemaining <= 7) return 'from-red-500 to-red-600';
    if (daysRemaining <= 30) return 'from-orange-500 to-orange-600';
    return 'from-purple-500 to-purple-600';
  };

  const getUrgencyText = () => {
    if (daysRemaining <= 7) return 'Trial ending soon!';
    if (daysRemaining <= 30) return 'Premium Trial';
    return 'Premium Trial Active';
  };

  return (
    <div className={`relative bg-gradient-to-r ${getUrgencyColor()} text-white px-4 py-3 shadow-lg`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">
              {getUrgencyText()}
            </p>
            <p className="text-sm text-white/90">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining of free premium access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {daysRemaining <= 30 && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
              onClick={() => window.location.href = '/subscription'}
            >
              Upgrade Now
            </Button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
