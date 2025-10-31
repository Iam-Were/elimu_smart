import { useState } from 'react';
import { getParse } from '@/config/parse';

export interface SessionRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  preferredDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export const useSessionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get pending session requests
   */
  const getPendingSessionRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getPendingSessionRequests');
      return result.map((req: any) => ({
        ...req,
        preferredDate: new Date(req.preferredDate)
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch session requests');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update session status
   */
  const updateSessionStatus = async (sessionId: string, status: 'approved' | 'rejected', notes?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('updateSessionStatus', {
        sessionId,
        status,
        notes
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to update session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reschedule a session
   */
  const rescheduleSession = async (sessionId: string, newDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('rescheduleSession', {
        sessionId,
        newDate: newDate.toISOString()
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add session notes
   */
  const addSessionNotes = async (sessionId: string, notes: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('addSessionNotes', {
        sessionId,
        notes
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to add notes');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPendingSessionRequests,
    updateSessionStatus,
    rescheduleSession,
    addSessionNotes,
    isLoading,
    error
  };
};
