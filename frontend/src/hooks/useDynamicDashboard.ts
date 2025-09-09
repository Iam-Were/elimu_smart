import { useState, useEffect } from 'react';
import Parse from 'parse';

interface UserActivity {
  activityType: string;
  data: any;
  pageUrl: string;
  duration?: number;
  timestamp: Date;
}

interface CareerReadinessScore {
  overall: number;
  breakdown: {
    assessmentCompletion: number;
    careerResearch: number;
    courseExploration: number;
    actionsTaken: number;
  };
  lastUpdated: Date;
}

interface UniversityPlacementData {
  eligiblePrograms: Array<{
    university: string;
    course: string;
    cutoffPoints: number;
    placementProbability: number;
  }>;
  recommendations: string[];
  nextSteps: string[];
}

interface ScholarshipMatch {
  name: string;
  provider: string;
  amount: string;
  deadline: Date;
  requirements: string[];
  matchScore: number;
  category: string;
}

interface CutoffAnalysis {
  currentPoints: number;
  averageRequired: number;
  totalEligibleCourses: number;
  improvementNeeded: number;
  courseAnalysis: Array<{
    courseName: string;
    university: string;
    requiredPoints: number;
    currentPoints: number;
    pointsGap: number;
    probability: number;
    canImprove: boolean;
    subjectsToImprove: string[];
  }>;
}

interface KuccpsTimeline {
  timeline: Array<{
    event: string;
    date: Date;
    status: string;
    description: string;
  }>;
  nextDeadline: string;
  daysRemaining: number;
  applicationStatus: string;
}

interface CourseRecommendations {
  recommendations: Array<{
    id: string;
    courseName: string;
    university: string;
    matchScore: number;
    reason: string;
    requirements: string[];
    cutoffPoints: number;
    duration: string;
    category: string;
  }>;
  totalMatches: number;
  highMatches: number;
  mediumMatches: number;
}

interface DashboardData {
  careerReadinessScore: CareerReadinessScore | null;
  universityPlacement: UniversityPlacementData | null;
  scholarshipMatches: ScholarshipMatch[];
  userActivities: UserActivity[];
  cutoffAnalysis: CutoffAnalysis | null;
  kuccpsTimeline: KuccpsTimeline | null;
  courseRecommendations: CourseRecommendations | null;
  loading: boolean;
  error: string | null;
}

export const useDynamicDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    careerReadinessScore: null,
    universityPlacement: null,
    scholarshipMatches: [],
    userActivities: [],
    cutoffAnalysis: null,
    kuccpsTimeline: null,
    courseRecommendations: null,
    loading: true,
    error: null
  });

  // Log user activity
  const logActivity = async (
    activityType: string,
    data: any = {},
    pageUrl: string = window.location.pathname,
    duration?: number
  ) => {
    try {
      await Parse.Cloud.run('logUserActivity', {
        activityType,
        data,
        pageUrl,
        duration
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
  };

  // Calculate career readiness score
  const calculateCareerReadiness = async (): Promise<CareerReadinessScore | null> => {
    try {
      const result = await Parse.Cloud.run('calculateCareerReadinessScore');
      return {
        overall: result.overall || 0,
        breakdown: {
          assessmentCompletion: result.breakdown?.assessmentCompletion || 0,
          careerResearch: result.breakdown?.careerResearch || 0,
          courseExploration: result.breakdown?.courseExploration || 0,
          actionsTaken: result.breakdown?.actionsTaken || 0
        },
        lastUpdated: new Date(result.lastUpdated || Date.now())
      };
    } catch (error) {
      console.error('Failed to calculate career readiness:', error);
      return null;
    }
  };

  // Get university placement data
  const getUniversityPlacement = async (): Promise<UniversityPlacementData | null> => {
    try {
      const result = await Parse.Cloud.run('getUniversityPlacementData');
      return {
        eligiblePrograms: result.eligiblePrograms || [],
        recommendations: result.recommendations || [],
        nextSteps: result.nextSteps || []
      };
    } catch (error) {
      console.error('Failed to get university placement data:', error);
      return null;
    }
  };

  // Find scholarship matches
  const findScholarshipMatches = async (): Promise<ScholarshipMatch[]> => {
    try {
      const result = await Parse.Cloud.run('findScholarshipMatches');
      return (result.matches || []).map((match: any) => ({
        name: match.name,
        provider: match.provider,
        amount: match.amount,
        deadline: new Date(match.deadline),
        requirements: match.requirements || [],
        matchScore: match.matchScore || 0,
        category: match.category || 'General'
      }));
    } catch (error) {
      console.error('Failed to find scholarship matches:', error);
      return [];
    }
  };

  // Calculate cutoff points analysis
  const getCutoffAnalysis = async (): Promise<CutoffAnalysis | null> => {
    try {
      const result = await Parse.Cloud.run('calculateCutoffPoints');
      return {
        currentPoints: result.currentPoints || 0,
        averageRequired: result.averageRequired || 0,
        totalEligibleCourses: result.totalEligibleCourses || 0,
        improvementNeeded: result.improvementNeeded || 0,
        courseAnalysis: result.courseAnalysis || []
      };
    } catch (error) {
      console.error('Failed to get cutoff analysis:', error);
      return null;
    }
  };

  // Get KUCCPS timeline and deadlines
  const getKuccpsTimeline = async (): Promise<KuccpsTimeline | null> => {
    try {
      const result = await Parse.Cloud.run('getKuccpsTimeline');
      return {
        timeline: (result.timeline || []).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })),
        nextDeadline: result.nextDeadline || '',
        daysRemaining: result.daysRemaining || 0,
        applicationStatus: result.applicationStatus || ''
      };
    } catch (error) {
      console.error('Failed to get KUCCPS timeline:', error);
      return null;
    }
  };

  // Get course recommendations
  const getCourseRecommendations = async (): Promise<CourseRecommendations | null> => {
    try {
      const result = await Parse.Cloud.run('getCourseRecommendations');
      return {
        recommendations: result.recommendations || [],
        totalMatches: result.totalMatches || 0,
        highMatches: result.highMatches || 0,
        mediumMatches: result.mediumMatches || 0
      };
    } catch (error) {
      console.error('Failed to get course recommendations:', error);
      return null;
    }
  };

  // Get user activities
  const getUserActivities = async (): Promise<UserActivity[]> => {
    try {
      const result = await Parse.Cloud.run('getUserActivities', { limit: 50 });
      return (result || []).map((activity: any) => ({
        activityType: activity.activityType,
        data: activity.data,
        pageUrl: activity.pageUrl,
        duration: activity.duration,
        timestamp: new Date(activity.createdAt)
      }));
    } catch (error) {
      console.error('Failed to get user activities:', error);
      return [];
    }
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [
        careerReadiness, 
        universityPlacement, 
        scholarships, 
        activities, 
        cutoffAnalysis, 
        timeline, 
        courseRecs
      ] = await Promise.all([
        calculateCareerReadiness(),
        getUniversityPlacement(), 
        findScholarshipMatches(),
        getUserActivities(),
        getCutoffAnalysis(),
        getKuccpsTimeline(),
        getCourseRecommendations()
      ]);

      setDashboardData({
        careerReadinessScore: careerReadiness,
        universityPlacement,
        scholarshipMatches: scholarships,
        userActivities: activities,
        cutoffAnalysis,
        kuccpsTimeline: timeline,
        courseRecommendations: courseRecs,
        loading: false,
        error: null
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data'
      }));
    }
  };

  // Refresh specific dashboard sections
  const refreshCareerReadiness = async () => {
    const careerReadiness = await calculateCareerReadiness();
    setDashboardData(prev => ({
      ...prev,
      careerReadinessScore: careerReadiness
    }));
  };

  const refreshScholarships = async () => {
    const scholarships = await findScholarshipMatches();
    setDashboardData(prev => ({
      ...prev,
      scholarshipMatches: scholarships
    }));
  };

  const refreshUniversityPlacement = async () => {
    const [universityPlacement, cutoffAnalysis, timeline, courseRecs] = await Promise.all([
      getUniversityPlacement(),
      getCutoffAnalysis(),
      getKuccpsTimeline(),
      getCourseRecommendations()
    ]);
    
    setDashboardData(prev => ({
      ...prev,
      universityPlacement,
      cutoffAnalysis,
      kuccpsTimeline: timeline,
      courseRecommendations: courseRecs
    }));
  };

  // Load data on mount
  useEffect(() => {
    const user = Parse.User.current();
    if (user) {
      loadDashboardData();
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const user = Parse.User.current();
      if (user) {
        loadDashboardData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    ...dashboardData,
    logActivity,
    refreshCareerReadiness,
    refreshScholarships,
    refreshUniversityPlacement,
    loadDashboardData
  };
};

export default useDynamicDashboard;