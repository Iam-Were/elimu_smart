import { useState, useCallback } from 'react';
import { getParse } from '@/config/parse';

interface SearchFilters {
  searchTerm?: string;
  grade?: string;
  school?: string;
  hasAssessments?: boolean | null;
  hasSubscription?: boolean | null;
  careerInterest?: string;
  minProfileCompletion?: number;
  sortBy?: 'recent' | 'name' | 'grade' | 'profileCompletion';
}

interface StudentResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  school: string;
  profileCompletion: number;
  assessmentCount: number;
  hasSubscription: boolean;
  careerInterest: string;
  joinedAt: Date;
  lastActive: Date;
}

interface SearchResponse {
  students: StudentResult[];
  total: number;
  hasMore: boolean;
}

interface OutreachResponse {
  success: boolean;
  chatRoomId: string;
  messageId: string;
  studentName: string;
}

export const useStudentSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const searchStudents = useCallback(async (filters: SearchFilters, limit = 20, skip = 0) => {
    setLoading(true);
    setError(null);

    try {
      const Parse = await getParse();

      const response = await Parse.Cloud.run('searchStudents', {
        searchTerm: filters.searchTerm || '',
        grade: filters.grade || '',
        school: filters.school || '',
        hasAssessments: filters.hasAssessments,
        hasSubscription: filters.hasSubscription,
        careerInterest: filters.careerInterest || '',
        minProfileCompletion: filters.minProfileCompletion || 0,
        sortBy: filters.sortBy || 'recent',
        limit,
        skip
      }) as SearchResponse;

      setResults(response.students);
      setTotalCount(response.total);
      setHasMore(response.hasMore);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search students';
      setError(errorMessage);
      console.error('Student search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const initiateOutreach = useCallback(async (studentId: string, introMessage: string) => {
    setLoading(true);
    setError(null);

    try {
      const Parse = await getParse();

      const response = await Parse.Cloud.run('initiateStudentOutreach', {
        studentId,
        introMessage
      }) as OutreachResponse;

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate outreach';
      setError(errorMessage);
      console.error('Outreach error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setHasMore(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    totalCount,
    hasMore,
    searchStudents,
    initiateOutreach,
    clearResults
  };
};
