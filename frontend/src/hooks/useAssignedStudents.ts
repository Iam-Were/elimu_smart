import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  school: string;
  profileCompletion: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'inactive';
  assessments: number;
  careerMatches: number;
  lastContact: Date;
}

interface UseAssignedStudentsReturn {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  refetch: (filters?: { priority?: string; status?: string }) => Promise<void>;
}

export const useAssignedStudents = (
  initialPriority?: string,
  initialStatus?: string
): UseAssignedStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = async (filters?: { priority?: string; status?: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const Parse = getParse();
      const params: { limit: number; priority?: string; status?: string } = {
        limit: 50,
      };

      if (filters?.priority) {
        params.priority = filters.priority;
      }
      if (filters?.status) {
        params.status = filters.status;
      }

      const result = await Parse.Cloud.run('getAssignedStudents', params);

      // Convert date strings to Date objects
      const studentsWithDates = result.map((student: any) => ({
        ...student,
        lastContact: new Date(student.lastContact),
      }));

      setStudents(studentsWithDates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch students'));
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filters: { priority?: string; status?: string } = {};
    if (initialPriority) filters.priority = initialPriority;
    if (initialStatus) filters.status = initialStatus;
    fetchStudents(Object.keys(filters).length > 0 ? filters : undefined);
  }, [initialPriority, initialStatus]);

  return {
    students,
    isLoading,
    error,
    refetch: fetchStudents,
  };
};
