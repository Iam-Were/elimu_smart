import { useState } from 'react';
import Parse from 'parse';

type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
type MilestoneStatus = 'achieved' | 'in_progress' | 'not_started';

interface UpdatePriorityParams {
  studentId: string;
  priority: PriorityLevel;
  reason?: string;
}

interface AddNoteParams {
  studentId: string;
  note: string;
  isPrivate?: boolean;
  tags?: string[];
}

interface TrackProgressParams {
  studentId: string;
  milestone: string;
  status: MilestoneStatus;
  metadata?: Record<string, unknown>;
}

export const useStudentManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update student priority level
   */
  const updateStudentPriority = async (params: UpdatePriorityParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('updateStudentPriority', params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student priority';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a private note about a student
   */
  const addStudentNote = async (params: AddNoteParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('addStudentNote', params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add student note';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get student's assessment results
   */
  const getStudentAssessmentResults = async (studentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('getStudentAssessmentResults', { studentId });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get assessment results';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Track student progress milestone
   */
  const trackStudentProgress = async (params: TrackProgressParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('trackStudentProgress', params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track student progress';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all notes for a student
   */
  const getStudentNotes = async (studentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('getStudentNotes', { studentId });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get student notes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Flag student as urgent (shortcut for updateStudentPriority)
   */
  const flagAsUrgent = async (studentId: string, reason: string) => {
    return updateStudentPriority({
      studentId,
      priority: 'urgent',
      reason
    });
  };

  /**
   * Mark milestone as achieved (shortcut for trackStudentProgress)
   */
  const achieveMilestone = async (studentId: string, milestone: string, metadata?: Record<string, unknown>) => {
    return trackStudentProgress({
      studentId,
      milestone,
      status: 'achieved',
      metadata
    });
  };

  return {
    isLoading,
    error,
    updateStudentPriority,
    addStudentNote,
    getStudentAssessmentResults,
    trackStudentProgress,
    getStudentNotes,
    flagAsUrgent,
    achieveMilestone
  };
};
