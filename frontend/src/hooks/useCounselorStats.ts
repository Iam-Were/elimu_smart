import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

interface CounselorStats {
  assignedStudents: number;
  premiumStudents: number;
  todaySessions: number;
  activeChats: number;
  unreadMessages: number;
  urgentCount: number;
  monthlyEarnings: number;
  todayEarnings: number;
  pendingQuestions: number;
}

interface UseCounselorStatsReturn {
  stats: CounselorStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCounselorStats = (): UseCounselorStatsReturn => {
  const [stats, setStats] = useState<CounselorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const Parse = getParse();
      const result = await Parse.Cloud.run('getCounselorDashboardStats');

      setStats(result);
    } catch (err) {
      console.error('Error fetching counselor stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};
