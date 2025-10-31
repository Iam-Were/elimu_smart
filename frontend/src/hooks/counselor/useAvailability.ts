import { useState } from 'react';
import { getParse } from '@/config/parse';

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

export const useAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set counselor availability schedule
   */
  const setAvailability = async (slots: AvailabilitySlot[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('setAvailability', { slots });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set availability';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get counselor's availability schedule
   */
  const getAvailabilitySchedule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getAvailabilitySchedule');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch availability';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setAvailability,
    getAvailabilitySchedule,
    isLoading,
    error
  };
};
