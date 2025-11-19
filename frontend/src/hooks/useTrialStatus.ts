import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

interface TrialStatus {
  hasTrial: boolean;
  isActive: boolean;
  daysRemaining: number;
  trialEndDate: string | null;
  loading: boolean;
}

export function useTrialStatus() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    hasTrial: false,
    isActive: false,
    daysRemaining: 0,
    trialEndDate: null,
    loading: true
  });

  useEffect(() => {
    checkTrialStatus();
  }, []);

  const checkTrialStatus = async () => {
    try {
      const Parse = await getParse();
      const user = Parse.User.current();

      if (!user) {
        setTrialStatus({
          hasTrial: false,
          isActive: false,
          daysRemaining: 0,
          trialEndDate: null,
          loading: false
        });
        return;
      }

      const result = await Parse.Cloud.run('checkTrialStatus', {
        userId: user.id
      });

      setTrialStatus({
        hasTrial: result.hasTrial || false,
        isActive: result.isActive || false,
        daysRemaining: result.daysRemaining || 0,
        trialEndDate: result.trialEndDate || null,
        loading: false
      });

    } catch (error) {
      // Silently handle trial status errors (non-critical feature)
      // Backend may not have isTrial column in Subscription table
      console.warn('Trial status check unavailable:', error);
      setTrialStatus({
        hasTrial: false,
        isActive: false,
        daysRemaining: 0,
        trialEndDate: null,
        loading: false
      });
    }
  };

  return {
    ...trialStatus,
    refresh: checkTrialStatus
  };
}
