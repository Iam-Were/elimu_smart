import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

export interface Activity {
  type: 'message' | 'session' | 'assessment' | 'milestone';
  id: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  
  // Message-specific
  content?: string;
  isRead?: boolean;
  
  // Session-specific
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledTime?: Date;
  duration?: number;
  
  // Assessment-specific
  hollandCode?: string;
  primaryType?: string;
  
  // Milestone-specific
  title?: string;
  category?: string;
}

interface UseActivityFeedResult {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasMore: boolean;
  total: number;
}

export const useActivityFeed = (limit: number = 20): UseActivityFeedResult => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getActivityFeed', { limit });
      
      setActivities(result.activities || []);
      setTotal(result.total || 0);
      setHasMore(result.hasMore || false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load activity feed';
      setError(errorMessage);
      console.error('Error fetching activity feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchActivities();
  }, [limit]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, [limit]);

  return {
    activities,
    isLoading,
    error,
    refresh: fetchActivities,
    hasMore,
    total
  };
};
