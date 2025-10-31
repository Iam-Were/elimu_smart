import { useState } from 'react';
import Parse from 'parse';

interface SessionUpdateParams {
  sessionId: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'pending';
  notes?: string;
  outcomes?: any;
  cancellationReason?: string;
}

interface RescheduleParams {
  sessionId: string;
  newTime: Date;
  reason?: string;
}

interface SessionNotesParams {
  sessionId: string;
  notes?: string;
  nextSteps?: string;
  resources?: string[];
  outcomes?: any;
}

export const useSessionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update session status (confirm, cancel, complete)
   */
  const updateSessionStatus = async (params: SessionUpdateParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('updateSessionStatus', params);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update session status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reschedule a session to a new time
   */
  const rescheduleSession = async (params: RescheduleParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('rescheduleSession', params);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reschedule session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add or update session notes
   */
  const addSessionNotes = async (params: SessionNotesParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('addSessionNotes', params);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add session notes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get detailed session information
   */
  const getSessionDetails = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('getSessionDetails', { sessionId });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get session details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Confirm a session (shortcut for updateSessionStatus)
   */
  const confirmSession = async (sessionId: string, notes?: string) => {
    return updateSessionStatus({
      sessionId,
      status: 'confirmed',
      notes
    });
  };

  /**
   * Cancel a session (shortcut for updateSessionStatus)
   */
  const cancelSession = async (sessionId: string, cancellationReason: string) => {
    return updateSessionStatus({
      sessionId,
      status: 'cancelled',
      cancellationReason
    });
  };

  /**
   * Complete a session (shortcut for updateSessionStatus)
   */
  const completeSession = async (sessionId: string, notes?: string, outcomes?: any) => {
    return updateSessionStatus({
      sessionId,
      status: 'completed',
      notes,
      outcomes
    });
  };

  return {
    isLoading,
    error,
    updateSessionStatus,
    rescheduleSession,
    addSessionNotes,
    getSessionDetails,
    confirmSession,
    cancelSession,
    completeSession
  };
};
