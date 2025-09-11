import { useState, useEffect } from 'react';
import Parse from 'parse';

interface StudentAssignment {
  studentId: string;
  studentName: string;
  gradeLevel: string;
  status: 'active' | 'at-risk' | 'thriving' | 'needs-attention';
  lastContact: Date;
  careerReadiness: number;
  assessmentsCompleted: number;
  urgentFlags: string[];
}

interface ChatSession {
  sessionId: string;
  studentName: string;
  status: 'active' | 'waiting' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  lastMessage: Date;
  responseTime: number;
  unreadCount: number;
}

interface Appointment {
  appointmentId: string;
  studentName: string;
  scheduledTime: Date;
  type: 'individual' | 'group' | 'parent-conference';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  duration: number;
}

interface PendingQuestion {
  questionId: string;
  studentName: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  category: 'career' | 'academic' | 'personal' | 'university';
  hasResponded: boolean;
}

interface CounselingAnalytics {
  totalStudents: number;
  activeStudents: number;
  atRiskStudents: number;
  successRate: number;
  averageSessionDuration: number;
  studentSatisfactionScore: number;
  monthlySessionsCount: number;
  questionResponseTime: number;
  trend: {
    studentProgress: 'up' | 'down' | 'stable';
    sessionEffectiveness: 'up' | 'down' | 'stable';
    responseTime: 'up' | 'down' | 'stable';
  };
}

interface CounselorActivity {
  activityType: string;
  studentId?: string;
  sessionId?: string;
  data: any;
  timestamp: Date;
  duration?: number;
}

interface CounselorDashboardData {
  assignedStudents: StudentAssignment[];
  activeChatSessions: ChatSession[];
  upcomingAppointments: Appointment[];
  pendingQuestions: PendingQuestion[];
  analytics: CounselingAnalytics | null;
  recentActivities: CounselorActivity[];
  loading: boolean;
  error: string | null;
}

export const useCounselorDashboard = () => {
  const [dashboardData, setDashboardData] = useState<CounselorDashboardData>({
    assignedStudents: [],
    activeChatSessions: [],
    upcomingAppointments: [],
    pendingQuestions: [],
    analytics: null,
    recentActivities: [],
    loading: true,
    error: null
  });

  // Log counselor activity
  const logCounselorActivity = async (
    activityType: string,
    data: any = {},
    studentId?: string,
    sessionId?: string,
    duration?: number
  ) => {
    try {
      await Parse.Cloud.run('logCounselorActivity', {
        activityType,
        data,
        studentId,
        sessionId,
        duration
      });
    } catch (error) {
      console.warn('Failed to log counselor activity:', error);
    }
  };

  // Get assigned students with dynamic status
  const getAssignedStudents = async (): Promise<StudentAssignment[]> => {
    try {
      const result = await Parse.Cloud.run('getCounselorAssignedStudents');
      return (result.students || []).map((student: any) => ({
        studentId: student.id,
        studentName: student.name,
        gradeLevel: student.gradeLevel,
        status: student.status,
        lastContact: new Date(student.lastContact),
        careerReadiness: student.careerReadiness || 0,
        assessmentsCompleted: student.assessmentsCompleted || 0,
        urgentFlags: student.urgentFlags || []
      }));
    } catch (error) {
      console.error('Failed to get assigned students:', error);
      return [];
    }
  };

  // Get active chat sessions
  const getActiveChatSessions = async (): Promise<ChatSession[]> => {
    try {
      const result = await Parse.Cloud.run('getCounselorActiveChatSessions');
      return (result.sessions || []).map((session: any) => ({
        sessionId: session.id,
        studentName: session.studentName,
        status: session.status,
        priority: session.priority,
        lastMessage: new Date(session.lastMessage),
        responseTime: session.averageResponseTime || 0,
        unreadCount: session.unreadCount || 0
      }));
    } catch (error) {
      console.error('Failed to get chat sessions:', error);
      return [];
    }
  };

  // Get today's appointments
  const getTodaysAppointments = async (): Promise<Appointment[]> => {
    try {
      const result = await Parse.Cloud.run('getCounselorTodaysAppointments');
      return (result.appointments || []).map((appointment: any) => ({
        appointmentId: appointment.id,
        studentName: appointment.studentName,
        scheduledTime: new Date(appointment.scheduledTime),
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes,
        duration: appointment.duration || 45
      }));
    } catch (error) {
      console.error('Failed to get appointments:', error);
      return [];
    }
  };

  // Get pending questions
  const getPendingQuestions = async (): Promise<PendingQuestion[]> => {
    try {
      const result = await Parse.Cloud.run('getCounselorPendingQuestions');
      return (result.questions || []).map((question: any) => ({
        questionId: question.id,
        studentName: question.studentName,
        subject: question.subject,
        priority: question.priority,
        createdAt: new Date(question.createdAt),
        category: question.category,
        hasResponded: question.hasResponded || false
      }));
    } catch (error) {
      console.error('Failed to get pending questions:', error);
      return [];
    }
  };

  // Get counseling analytics
  const getCounselingAnalytics = async (): Promise<CounselingAnalytics | null> => {
    try {
      const result = await Parse.Cloud.run('getCounselingAnalytics');
      return {
        totalStudents: result.totalStudents || 0,
        activeStudents: result.activeStudents || 0,
        atRiskStudents: result.atRiskStudents || 0,
        successRate: result.successRate || 0,
        averageSessionDuration: result.averageSessionDuration || 0,
        studentSatisfactionScore: result.studentSatisfactionScore || 0,
        monthlySessionsCount: result.monthlySessionsCount || 0,
        questionResponseTime: result.questionResponseTime || 0,
        trend: {
          studentProgress: result.trend?.studentProgress || 'stable',
          sessionEffectiveness: result.trend?.sessionEffectiveness || 'stable',
          responseTime: result.trend?.responseTime || 'stable'
        }
      };
    } catch (error) {
      console.error('Failed to get counseling analytics:', error);
      return null;
    }
  };

  // Get recent counselor activities
  const getRecentActivities = async (): Promise<CounselorActivity[]> => {
    try {
      const result = await Parse.Cloud.run('getCounselorRecentActivities', { limit: 20 });
      return (result || []).map((activity: any) => ({
        activityType: activity.activityType,
        studentId: activity.studentId,
        sessionId: activity.sessionId,
        data: activity.data,
        timestamp: new Date(activity.createdAt),
        duration: activity.duration
      }));
    } catch (error) {
      console.error('Failed to get recent activities:', error);
      return [];
    }
  };

  // Load all counselor dashboard data
  const loadCounselorDashboard = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [
        students,
        chatSessions,
        appointments,
        questions,
        analytics,
        activities
      ] = await Promise.all([
        getAssignedStudents(),
        getActiveChatSessions(),
        getTodaysAppointments(),
        getPendingQuestions(),
        getCounselingAnalytics(),
        getRecentActivities()
      ]);

      setDashboardData({
        assignedStudents: students,
        activeChatSessions: chatSessions,
        upcomingAppointments: appointments,
        pendingQuestions: questions,
        analytics,
        recentActivities: activities,
        loading: false,
        error: null
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load counselor dashboard data'
      }));
    }
  };

  // Refresh specific sections
  const refreshStudents = async () => {
    const students = await getAssignedStudents();
    setDashboardData(prev => ({ ...prev, assignedStudents: students }));
  };

  const refreshChatSessions = async () => {
    const sessions = await getActiveChatSessions();
    setDashboardData(prev => ({ ...prev, activeChatSessions: sessions }));
  };

  const refreshAppointments = async () => {
    const appointments = await getTodaysAppointments();
    setDashboardData(prev => ({ ...prev, upcomingAppointments: appointments }));
  };

  const refreshQuestions = async () => {
    const questions = await getPendingQuestions();
    setDashboardData(prev => ({ ...prev, pendingQuestions: questions }));
  };

  const refreshAnalytics = async () => {
    const analytics = await getCounselingAnalytics();
    setDashboardData(prev => ({ ...prev, analytics }));
  };

  // Load data on mount
  useEffect(() => {
    const user = Parse.User.current();
    if (user && (user.get('role') === 'counselor' || user.get('role') === 'career_counselor')) {
      loadCounselorDashboard();
    }
  }, []);

  // Auto-refresh every 3 minutes (more frequent for counselors)
  useEffect(() => {
    const interval = setInterval(() => {
      const user = Parse.User.current();
      if (user && (user.get('role') === 'counselor' || user.get('role') === 'career_counselor')) {
        loadCounselorDashboard();
      }
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, []);

  // Calculate derived metrics
  const getDerivedMetrics = () => {
    const urgentStudents = dashboardData.assignedStudents.filter(s => 
      s.status === 'at-risk' || s.urgentFlags.length > 0
    ).length;

    const activeChats = dashboardData.activeChatSessions.filter(s => s.status === 'active').length;
    const waitingChats = dashboardData.activeChatSessions.filter(s => s.status === 'waiting').length;

    const todaysAppointments = dashboardData.upcomingAppointments.filter(a => {
      const today = new Date();
      const appointmentDate = new Date(a.scheduledTime);
      return appointmentDate.toDateString() === today.toDateString();
    }).length;

    const highPriorityQuestions = dashboardData.pendingQuestions.filter(q => q.priority === 'high').length;
    const unansweredQuestions = dashboardData.pendingQuestions.filter(q => !q.hasResponded).length;

    return {
      urgentStudents,
      activeChats,
      waitingChats,
      todaysAppointments,
      highPriorityQuestions,
      unansweredQuestions,
      totalWorkload: urgentStudents + activeChats + highPriorityQuestions,
      nextAppointment: dashboardData.upcomingAppointments
        .filter(a => new Date(a.scheduledTime) > new Date())
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0]
    };
  };

  return {
    ...dashboardData,
    logCounselorActivity,
    loadCounselorDashboard,
    refreshStudents,
    refreshChatSessions,
    refreshAppointments,
    refreshQuestions,
    refreshAnalytics,
    getDerivedMetrics: getDerivedMetrics()
  };
};

export default useCounselorDashboard;