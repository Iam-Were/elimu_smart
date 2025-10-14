import { useState } from 'react';
import { getParse } from '@/config/parse';

interface BookSessionParams {
  counselorId: string;
  sessionDate: string; // Format: YYYY-MM-DD
  sessionTime: string; // Format: HH:MM
  sessionType: 'video' | 'phone' | 'in-person';
  duration?: 30 | 60 | 90; // Frontend duration (not used by backend yet)
  notes?: string;
}

interface BookSessionResult {
  success: boolean;
  sessionId: string;
  scheduledTime: Date;
  message: string;
}

export const useSessionBooking = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookSession = async (params: BookSessionParams): Promise<BookSessionResult> => {
    setIsBooking(true);
    setError(null);

    try {
      const Parse = getParse();

      const result = await Parse.Cloud.run('bookCounselorSession', {
        counselorId: params.counselorId,
        sessionDate: params.sessionDate,
        sessionTime: params.sessionTime,
        sessionType: params.sessionType,
        notes: params.notes || ''
      });

      return {
        success: result.success,
        sessionId: result.sessionId,
        scheduledTime: new Date(result.scheduledTime.iso || result.scheduledTime),
        message: result.message
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book session';
      setError(errorMessage);

      // Check for specific error types
      if (errorMessage.includes('Premium subscription required')) {
        throw new Error('PREMIUM_REQUIRED');
      }

      throw new Error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  return {
    bookSession,
    isBooking,
    error
  };
};
