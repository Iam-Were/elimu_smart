import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentGrade: string;
  title: string;
  description: string;
  type: 'individual' | 'group' | 'virtual' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledAt: Date;
  duration: number;
  location: string;
  notes: string;
  outcomes: string[];
  nextSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseCounselorSessionsReturn {
  sessions: Session[];
  isLoading: boolean;
  error: Error | null;
  refetch: (status?: string) => Promise<void>;
}

export const useCounselorSessions = (initialStatus?: string): UseCounselorSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = async (status?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const Parse = getParse();
      const params: { status?: string; limit: number } = { limit: 50 };
      
      if (status) {
        params.status = status;
      }

      const result = await Parse.Cloud.run('getCounselorSessions', params);

      // Convert scheduledAt strings to Date objects
      const sessionsWithDates = result.map((session: {
        startTime: string;
        endTime: string;
        scheduledAt: string | Date;
        createdAt: string | Date;
        updatedAt: string | Date;
        [key: string]: unknown;
      }) => ({
        ...session,
        scheduledAt: new Date(session.scheduledAt),
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt)
      }));

      setSessions(sessionsWithDates);
    } catch (err) {
      console.error('Error fetching counselor sessions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sessions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(initialStatus);
  }, [initialStatus]);

  return {
    sessions,
    isLoading,
    error,
    refetch: fetchSessions
  };
};
