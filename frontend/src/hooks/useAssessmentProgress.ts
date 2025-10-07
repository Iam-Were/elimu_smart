import { useState, useEffect, useCallback } from 'react';
import { getParse } from '@/config/parse';

export interface AssessmentProgress {
  id: string;
  assessmentType: 'riasec' | 'skills' | 'university' | 'career' | 'subjects';
  assessmentName: string;
  progress: number; // 0-100
  totalQuestions: number;
  answeredQuestions: number;
  startedAt: Date;
  lastUpdated: Date;
  completed: boolean;
  completedAt?: Date;
}

export const useAssessmentProgress = () => {
  const [progressData, setProgressData] = useState<AssessmentProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getAssessmentProgress');

      // Transform backend data to frontend interface
      const transformedProgress: AssessmentProgress[] = result.map((prog: {
        id: string;
        assessmentType: string;
        assessmentName: string;
        progress: number;
        totalQuestions: number;
        answeredQuestions: number;
        startedAt: { iso: string };
        lastUpdated: { iso: string };
        completed: boolean;
        completedAt?: { iso: string };
      }) => ({
        id: prog.id,
        assessmentType: prog.assessmentType as AssessmentProgress['assessmentType'],
        assessmentName: prog.assessmentName,
        progress: prog.progress,
        totalQuestions: prog.totalQuestions,
        answeredQuestions: prog.answeredQuestions,
        startedAt: new Date(prog.startedAt.iso),
        lastUpdated: new Date(prog.lastUpdated.iso),
        completed: prog.completed,
        completedAt: prog.completedAt ? new Date(prog.completedAt.iso) : undefined,
      }));

      setProgressData(transformedProgress);
    } catch (err) {
      console.error('Failed to fetch assessment progress:', err);
      setError('Failed to load progress data');
      // Graceful fallback - don't block UI
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (assessmentType: string, data: {
    answeredQuestions: number;
    totalQuestions: number;
    progress: number;
  }) => {
    try {
      const Parse = await getParse();

      // Optimistic update
      setProgressData(prev => {
        const existing = prev.find(p => p.assessmentType === assessmentType);
        if (existing) {
          return prev.map(p =>
            p.assessmentType === assessmentType
              ? {
                  ...p,
                  answeredQuestions: data.answeredQuestions,
                  progress: data.progress,
                  lastUpdated: new Date(),
                }
              : p
          );
        } else {
          // New progress entry
          return [
            ...prev,
            {
              id: `temp-${assessmentType}`,
              assessmentType: assessmentType as AssessmentProgress['assessmentType'],
              assessmentName: assessmentType.toUpperCase(),
              progress: data.progress,
              totalQuestions: data.totalQuestions,
              answeredQuestions: data.answeredQuestions,
              startedAt: new Date(),
              lastUpdated: new Date(),
              completed: false,
            },
          ];
        }
      });

      // Backend update
      await Parse.Cloud.run('updateAssessmentProgress', {
        assessmentType,
        ...data,
      });
    } catch (err) {
      console.error('Failed to update assessment progress:', err);
      // Silently fail - progress still updated locally
    }
  }, []);

  const completeAssessment = useCallback(async (assessmentType: string) => {
    try {
      const Parse = await getParse();

      // Optimistic update
      setProgressData(prev =>
        prev.map(p =>
          p.assessmentType === assessmentType
            ? {
                ...p,
                progress: 100,
                completed: true,
                completedAt: new Date(),
              }
            : p
        )
      );

      // Backend update
      await Parse.Cloud.run('completeAssessment', { assessmentType });
    } catch (err) {
      console.error('Failed to mark assessment as complete:', err);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progressData,
    loading,
    error,
    fetchProgress,
    updateProgress,
    completeAssessment,
  };
};
