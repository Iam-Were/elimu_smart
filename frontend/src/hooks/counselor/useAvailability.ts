import { useState } from 'react';
import Parse from 'parse';

interface AvailabilitySchedule {
  [key: string]: string[]; // e.g., { monday: ['09:00-12:00', '14:00-17:00'] }
}

interface BlockedSlot {
  startTime: Date;
  endTime: Date;
  reason?: string;
}

interface AvailableSlot {
  startTime: Date;
  endTime: Date;
  duration: number;
}

export const useAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set weekly availability schedule
   */
  const setAvailability = async (schedule: AvailabilitySchedule) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('setAvailability', { schedule });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed" || 'Failed to set availability';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Block specific time slot
   */
  const blockTimeSlot = async (params: BlockedSlot) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('blockTimeSlot', params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed" || 'Failed to block time slot';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get available time slots for a specific date
   */
  const getAvailableSlots = async (
    date: Date,
    duration: number = 60,
    counselorId?: string
  ): Promise<AvailableSlot[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('getAvailableSlots', {
        date,
        duration,
        counselorId
      });
      return result.slots || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed" || 'Failed to get available slots';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const result = await Parse.Cloud.run('getAvailabilitySchedule');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed" || 'Failed to get availability schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    setAvailability,
    blockTimeSlot,
    getAvailableSlots,
    getAvailabilitySchedule
  };
};
