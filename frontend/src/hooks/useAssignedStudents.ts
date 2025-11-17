import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  school: string;
  profileCompletion: number;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  status: 'active' | 'pending' | 'inactive' | 'unassigned';
  assessments: number;
  careerMatches: number;
  lastContact: Date | null;
  isAssignedToMe?: boolean;
  assignedCounselor?: {
    id: string;
    name: string;
  } | null;
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

      const result = await Parse.Cloud.run('getCounselorAssignedStudents', {
        ...params,
        showAll: true // Show all students by default
      });

      // Convert date strings to Date objects and map backend fields
      const studentsWithDates = result.students.map((student: {
        id: string;
        name: string;
        email: string;
        gradeLevel: string;
        status: string;
        lastContact: string | null;
        careerReadiness: number;
        assessmentsCompleted: number;
        isAssignedToMe: boolean;
        assignedCounselor: { id: string; name: string } | null;
      }) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        grade: student.gradeLevel,
        school: 'Unknown School', // TODO: Add schoolName to backend response
        profileCompletion: student.careerReadiness || 0,
        priority: 'medium' as const,
        status: student.status as 'active' | 'pending' | 'inactive' | 'unassigned',
        assessments: student.assessmentsCompleted || 0,
        careerMatches: 0, // TODO: Add to backend response
        lastContact: student.lastContact ? new Date(student.lastContact) : null,
        isAssignedToMe: student.isAssignedToMe,
        assignedCounselor: student.assignedCounselor,
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
