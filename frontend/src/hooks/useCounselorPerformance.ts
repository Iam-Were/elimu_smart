import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

export interface PerformanceMetrics {
  completionRate: number;
  avgResponseTime: number;
  avgSatisfaction: number;
  timeRange: '7days' | '30days' | '90days';
}

interface UseCounselorPerformanceReturn {
  performance: PerformanceMetrics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (timeRange?: '7days' | '30days' | '90days') => Promise<void>;
}

export const useCounselorPerformance = (
  initialTimeRange: '7days' | '30days' | '90days' = '30days'
): UseCounselorPerformanceReturn => {
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPerformance = async (timeRange: '7days' | '30days' | '90days' = initialTimeRange) => {
    try {
      setIsLoading(true);
      setError(null);

      const Parse = getParse();
      const result = await Parse.Cloud.run('getCounselorPerformance', { timeRange });

      setPerformance({
        ...result,
        timeRange,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch performance metrics'));
      console.error('Error fetching counselor performance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance(initialTimeRange);
  }, [initialTimeRange]);

  return {
    performance,
    isLoading,
    error,
    refetch: fetchPerformance,
  };
};
