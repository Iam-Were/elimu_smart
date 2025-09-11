import { useState } from 'react';
import Parse from 'parse';

interface EmailRequest {
  email: string;
  firstName: string;
}

interface WelcomeEmailRequest extends EmailRequest {
  userRole: string;
}

interface AssessmentEmailRequest extends EmailRequest {
  assessmentName: string;
  results?: {
    matchScore?: string;
    recommendedPath?: string;
    strengths?: string;
  };
}

interface KuccpsReminderRequest extends EmailRequest {
  deadlineName: string;
  daysRemaining: number;
}

interface SessionBookingRequest {
  studentEmail: string;
  counselorEmail: string;
  studentName: string;
  counselorName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
}

interface ScholarshipAlertRequest extends EmailRequest {
  scholarshipName: string;
  deadline: string;
  amount: string;
  requirements: string[];
}

interface EmailStatistics {
  totalSent: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  recentActivity: Array<{
    type: string;
    recipient: string;
    status: string;
    sentAt: Date;
  }>;
  last24Hours: number;
  thisWeek: number;
}

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendWelcomeEmail = async ({ email, firstName, userRole }: WelcomeEmailRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Parse.Cloud.run('sendWelcomeEmail', {
        email,
        firstName,
        userRole
      });
      
      return { success: true, messageId: result.messageId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send welcome email';
      setError(errorMessage);
      console.error('Welcome email error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendAssessmentCompletionEmail = async ({ 
    email, 
    firstName, 
    assessmentName, 
    results 
  }: AssessmentEmailRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Parse.Cloud.run('sendAssessmentCompletionEmail', {
        email,
        firstName,
        assessmentName,
        results
      });
      
      return { success: true, messageId: result.messageId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send assessment email';
      setError(errorMessage);
      console.error('Assessment email error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendKuccpsDeadlineReminder = async ({ 
    email, 
    firstName, 
    deadlineName, 
    daysRemaining 
  }: KuccpsReminderRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Parse.Cloud.run('sendKuccpsDeadlineReminder', {
        email,
        firstName,
        deadlineName,
        daysRemaining
      });
      
      return { success: true, messageId: result.messageId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send KUCCPS reminder';
      setError(errorMessage);
      console.error('KUCCPS reminder error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendSessionBookingConfirmation = async ({
    studentEmail,
    counselorEmail,
    studentName,
    counselorName,
    sessionDate,
    sessionTime,
    sessionType
  }: SessionBookingRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Parse.Cloud.run('sendSessionBookingConfirmation', {
        studentEmail,
        counselorEmail,
        studentName,
        counselorName,
        sessionDate,
        sessionTime,
        sessionType
      });
      
      return { 
        success: true, 
        studentMessageId: result.studentMessageId,
        counselorMessageId: result.counselorMessageId 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send booking confirmation';
      setError(errorMessage);
      console.error('Session booking email error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendScholarshipAlert = async ({
    email,
    firstName,
    scholarshipName,
    deadline,
    amount,
    requirements
  }: ScholarshipAlertRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Parse.Cloud.run('sendScholarshipAlert', {
        email,
        firstName,
        scholarshipName,
        deadline,
        amount,
        requirements
      });
      
      return { success: true, messageId: result.messageId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send scholarship alert';
      setError(errorMessage);
      console.error('Scholarship alert error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getEmailStatistics = async (): Promise<EmailStatistics | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Parse.Cloud.run('getEmailStatistics');
      
      // Convert date strings back to Date objects
      const statistics: EmailStatistics = {
        ...result,
        recentActivity: result.recentActivity.map((activity: any) => ({
          ...activity,
          sentAt: new Date(activity.sentAt)
        }))
      };
      
      return statistics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get email statistics';
      setError(errorMessage);
      console.error('Email statistics error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Utility function to trigger automatic emails based on user actions
  const triggerAutomaticEmails = {
    // Send welcome email on user registration
    onUserRegistration: async (user: any) => {
      if (user?.get('email') && user?.get('firstName')) {
        return sendWelcomeEmail({
          email: user.get('email'),
          firstName: user.get('firstName'),
          userRole: user.get('role') || 'student'
        });
      }
    },

    // Send assessment completion email
    onAssessmentComplete: async (user: any, assessmentName: string, results?: any) => {
      if (user?.get('email') && user?.get('firstName')) {
        return sendAssessmentCompletionEmail({
          email: user.get('email'),
          firstName: user.get('firstName'),
          assessmentName,
          results
        });
      }
    },

    // Send scholarship alerts when new matches are found
    onScholarshipMatch: async (user: any, scholarship: any) => {
      if (user?.get('email') && user?.get('firstName')) {
        return sendScholarshipAlert({
          email: user.get('email'),
          firstName: user.get('firstName'),
          scholarshipName: scholarship.name,
          deadline: scholarship.deadline,
          amount: scholarship.amount,
          requirements: scholarship.requirements || []
        });
      }
    },

    // Send KUCCPS deadline reminders
    onKuccpsDeadlineApproaching: async (user: any, deadlineName: string, daysRemaining: number) => {
      if (user?.get('email') && user?.get('firstName')) {
        return sendKuccpsDeadlineReminder({
          email: user.get('email'),
          firstName: user.get('firstName'),
          deadlineName,
          daysRemaining
        });
      }
    }
  };

  return {
    loading,
    error,
    sendWelcomeEmail,
    sendAssessmentCompletionEmail,
    sendKuccpsDeadlineReminder,
    sendSessionBookingConfirmation,
    sendScholarshipAlert,
    getEmailStatistics,
    triggerAutomaticEmails
  };
};

export default useEmailService;