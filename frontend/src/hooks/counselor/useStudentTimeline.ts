import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

export interface TimelineEvent {
  type: 'registration' | 'assignment' | 'assessment' | 'session' | 'milestone' | 'note';
  id: string;
  title: string;
  timestamp: Date;
  icon: string;
  
  // Assessment-specific
  hollandCode?: string;
  primaryType?: string;
  
  // Session-specific
  counselorName?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledTime?: Date;
  duration?: number;
  
  // Milestone-specific
  category?: string;
  achieved?: boolean;
  
  // Note-specific
  content?: string;
}

interface UseStudentTimelineResult {
  timeline: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasMore: boolean;
  total: number;
}

export const useStudentTimeline = (studentId: string | null, limit: number = 50): UseStudentTimelineResult => {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchTimeline = async () => {
    if (!studentId) {
      setTimeline([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getStudentTimeline', { studentId, limit });
      
      setTimeline(result.timeline || []);
      setTotal(result.total || 0);
      setHasMore(result.hasMore || false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load student timeline';
      setError(errorMessage);
      console.error('Error fetching student timeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when studentId changes
  useEffect(() => {
    fetchTimeline();
  }, [studentId, limit]);

  return {
    timeline,
    isLoading,
    error,
    refresh: fetchTimeline,
    hasMore,
    total
  };
};
