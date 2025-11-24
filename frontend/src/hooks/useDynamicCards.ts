/**
 * useDynamicCards Hook
 *
 * Generates dynamic card data for Dashboard, Assessment, and Guidance pages.
 * Replaces static card arrays with backend-driven data.
 *
 * Pattern: Fetch backend data � Transform to CardData interfaces � Return type-safe cards.
 *
 * @param variant - Card type: 'dashboard' | 'assessment' | 'guidance'
 */

import React, { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';
import type { CardData, DashboardCard, AssessmentCard, GuidanceCard } from '@/types/CardInterfaces';
import { Target, TrendingUp, Award, Calendar, BookOpen, Users, Clock, Activity, User, CalendarClock, Target as TargetIcon } from 'lucide-react';

interface UseDynamicCardsOptions {
  variant: 'dashboard' | 'assessment' | 'guidance';
  userId?: string;
  // maxCards removed - progressive disclosure handled by component, not hook
}

interface UseDynamicCardsReturn {
  cards: CardData[];
  loading: boolean;
  error: string | null;
  refreshCards: () => Promise<void>;
}

export const useDynamicCards = (options: UseDynamicCardsOptions): UseDynamicCardsReturn => {
  const { variant } = options;
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate Dashboard Cards (Dynamic)
   */
  const generateDashboardCards = async (): Promise<DashboardCard[]> => {
    try {
      const Parse = await getParse();
      const currentUser = Parse.User.current();

      if (!currentUser) {
        console.warn('[useDynamicCards] No user logged in for dashboard cards');
        return [];
      }

      // Fetch backend data for dashboard metrics
      const [careerReadiness, universityData, scholarships, assessmentResults, kuccpsTimeline, recentActivities, courseRecommendations, profileCompletion, nextSession, careerGoals] = await Promise.allSettled([
        Parse.Cloud.run('calculateCareerReadinessScore'),
        Parse.Cloud.run('getUniversityPlacementData'),
        Parse.Cloud.run('findScholarshipMatches'),
        Parse.Cloud.run('getUserAssessmentResults'),
        Parse.Cloud.run('getKuccpsTimeline'),
        Parse.Cloud.run('logUserActivity', { activityType: 'fetch_recent', limit: 5 }),
        Parse.Cloud.run('getCourseRecommendations'),
        Parse.Cloud.run('calculateProfileCompletion'),
        Parse.Cloud.run('getStudentNextSession'),
        Parse.Cloud.run('getUserCareerGoals')
      ]);

      const cards: DashboardCard[] = [];

      // Card 1: Career Readiness Score
      if (careerReadiness.status === 'fulfilled') {
        const score = careerReadiness.value.score || 0;
        cards.push({
          id: 'career-readiness',
          cardType: 'dashboard',
          rowSpan: 2, // ✅ FIX #2: Make most important card 2x taller for visual hierarchy
          title: 'Career Readiness Score',
          description: 'Your overall readiness for career exploration',
          icon: React.createElement(Target),
          iconGradient: 'from-orange-500 to-orange-600',
          actionText: 'View Details',
          actionUrl: '/dashboard?tab=progress',
          metric: {
            label: 'Overall Score',
            value: `${score}%`
          },
          urgency: score < 40 ? 'high' : score < 70 ? 'medium' : 'low',
          badge: {
            text: score < 40 ? 'Needs Attention' : score < 70 ? 'In Progress' : 'Excellent',
            variant: score < 40 ? 'destructive' : score < 70 ? 'secondary' : 'success'
          }
        });
      }

      // Card 2: University Placement
      if (universityData.status === 'fulfilled') {
        const eligibleCount = universityData.value.eligiblePrograms?.length || 0;
        cards.push({
          id: 'university-placement',
          cardType: 'dashboard',
          title: 'University Placement',
          description: 'Programs you qualify for based on your grades',
          icon: React.createElement(TrendingUp),
          iconGradient: 'from-indigo-500 to-indigo-600',
          actionText: 'Explore Programs',
          actionUrl: '/assessment/university',
          metric: {
            label: 'Eligible Programs',
            value: eligibleCount
          },
          badge: {
            text: eligibleCount > 0 ? 'Eligible' : 'Complete Assessment',
            variant: eligibleCount > 0 ? 'success' : 'warning'
          }
        });
      }

      // Card 3: Scholarship Opportunities
      if (scholarships.status === 'fulfilled') {
        const matches = Array.isArray(scholarships.value?.matches) ? scholarships.value.matches : [];
        const topMatch = matches[0];
        cards.push({
          id: 'scholarships',
          cardType: 'dashboard',
          title: 'Scholarship Matches',
          description: topMatch ? `Best match: ${topMatch.name}` : 'Find scholarships that fit your profile',
          icon: React.createElement(Award),
          iconGradient: 'from-amber-500 to-amber-600',
          actionText: 'View All',
          actionUrl: '/guidance/resources?filter=scholarships',
          metric: {
            label: 'Available Matches',
            value: matches.length
          },
          badge: {
            text: 'Coming Soon',
            variant: 'secondary'
          }
        });
      }


      // Card 4: Assessment Results (Holland Code)
      if (assessmentResults.status === 'fulfilled' && assessmentResults.value.hasResults) {
        const summary = assessmentResults.value.summary;
        const hollandCode = summary?.hollandCode;
        const primaryType = summary?.primaryType;
        const topCareer = summary?.topCareers?.[0]?.name;
        
        if (hollandCode) {
          cards.push({
            id: 'assessment-results',
            cardType: 'dashboard',
            title: 'Your Career Profile',
            description: hollandCode + ' - ' + (primaryType || 'Career Type'),
            icon: React.createElement(Target),
            iconGradient: 'from-purple-500 to-purple-600',
            actionText: 'View Full Results',
            actionUrl: '/profile/assessments',
            metric: {
              label: topCareer ? 'Top Career Match' : 'Assessments Completed',
              value: topCareer || summary?.assessmentsCompleted || 0
            },
            badge: {
              text: hollandCode,
              variant: 'success'
            }
          });
        }
      }

      // Card 5: KUCCPS Deadline Tracker (Live Timeline Data)
      if (kuccpsTimeline.status === 'fulfilled') {
        const timeline = Array.isArray(kuccpsTimeline.value) ? kuccpsTimeline.value : [];
        const upcomingEvents = timeline.filter((event: { status: string }) => event.status === 'upcoming');
        const nextEvent = upcomingEvents[0];
        
        if (nextEvent) {
          const eventDate = typeof nextEvent.date === 'string' ? new Date(nextEvent.date) : nextEvent.date;
          const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          cards.push({
            id: 'kuccps-deadline',
            cardType: 'dashboard',
            title: 'KUCCPS Deadline',
            description: nextEvent.event,
            icon: React.createElement(Clock),
            iconGradient: 'from-red-500 to-red-600',
            actionText: 'View Timeline',
            actionUrl: '/guidance/resources?filter=kuccps',
            metric: {
              label: 'Days Remaining',
              value: daysUntil > 0 ? `${daysUntil} days` : 'Today'
            },
            urgency: daysUntil < 7 ? 'high' : daysUntil < 30 ? 'medium' : 'low',
            badge: {
              text: daysUntil < 7 ? 'Urgent' : daysUntil < 30 ? 'Soon' : 'Upcoming',
              variant: daysUntil < 7 ? 'destructive' : daysUntil < 30 ? 'warning' : 'secondary'
            }
          });
        }
      }

      // Card 6: Activity Timeline (Recent User Activities)
      if (recentActivities.status === 'fulfilled') {
        const activities = Array.isArray(recentActivities.value) ? recentActivities.value : [];
        if (activities.length > 0) {
          const activityCount = activities.length;
          cards.push({
            id: 'activity-timeline',
            cardType: 'dashboard',
            title: 'Recent Activity',
            description: `${activityCount} actions in the last 7 days`,
            icon: React.createElement(Activity),
            iconGradient: 'from-blue-500 to-blue-600',
            actionText: 'View History',
            actionUrl: '/profile?tab=activity',
            metric: {
              label: 'This Week',
              value: activityCount
            },
            badge: {
              text: activityCount > 5 ? 'Active' : 'Getting Started',
              variant: activityCount > 5 ? 'success' : 'secondary'
            }
          });
        }
      }

      // Card 7: Recommended Courses (AI-Powered Matches)
      if (courseRecommendations.status === 'fulfilled') {
        const recommendations = Array.isArray(courseRecommendations.value) ? courseRecommendations.value : [];
        if (recommendations.length > 0) {
          const topCourse = recommendations[0];
          cards.push({
            id: 'course-recommendations',
            cardType: 'dashboard',
            title: 'Recommended Courses',
            description: topCourse.courseName + ' at ' + topCourse.university,
            icon: React.createElement(BookOpen),
            iconGradient: 'from-teal-500 to-teal-600',
            actionText: 'View All',
            actionUrl: '/assessment/university',
            metric: {
              label: 'Match Score',
              value: topCourse.matchScore ? `${topCourse.matchScore}%` : '85%'
            },
            badge: {
              text: `${recommendations.length} Matches`,
              variant: 'success'
            }
          });
        }
      }

      // Card 8: Profile Completion (Gamification)
      if (profileCompletion.status === 'fulfilled') {
        const completion = profileCompletion.value;
        if (completion.percentage < 100) {
          cards.push({
            id: 'profile-completion',
            cardType: 'dashboard',
            title: 'Profile Completion',
            description: completion.nextStep,
            icon: React.createElement(User),
            iconGradient: 'from-purple-500 to-purple-600',
            actionText: 'Complete Profile',
            actionUrl: '/profile',
            metric: {
              label: 'Progress',
              value: `${completion.percentage}%`
            },
            urgency: completion.percentage < 40 ? 'high' : completion.percentage < 70 ? 'medium' : 'low',
            badge: {
              text: completion.category,
              variant: completion.percentage >= 80 ? 'success' : completion.percentage >= 60 ? 'secondary' : 'warning'
            }
          });
        }
      }

      // Card 9: Next Counselor Session
      if (nextSession.status === 'fulfilled' && nextSession.value.hasSession) {
        const session = nextSession.value;
        cards.push({
          id: 'next-session',
          cardType: 'dashboard',
          title: 'Upcoming Session',
          description: `${session.session.topic} with ${session.counselor.name}`,
          icon: React.createElement(CalendarClock),
          iconGradient: 'from-indigo-500 to-indigo-600',
          actionText: 'View Details',
          actionUrl: '/guidance/sessions',
          metric: {
            label: session.daysUntil === 0 ? 'Today' : session.daysUntil === 1 ? 'Tomorrow' : 'In',
            value: session.daysUntil === 0 ? `${session.hoursUntil}h` : session.daysUntil === 1 ? `${session.hoursUntil}h` : `${session.daysUntil} days`
          },
          urgency: session.hoursUntil < 24 ? 'high' : session.daysUntil < 7 ? 'medium' : 'low',
          badge: {
            text: session.hoursUntil < 24 ? 'Soon' : 'Scheduled',
            variant: session.hoursUntil < 24 ? 'destructive' : 'success'
          }
        });
      }

      // Card 10: Career Goal Progress
      if (careerGoals.status === 'fulfilled' && careerGoals.value?.hasGoals) {
        const goals = Array.isArray(careerGoals.value.goals) ? careerGoals.value.goals : [];
        if (goals.length > 0) {
          const primaryGoal = goals[0];
          cards.push({
            id: 'career-goals',
            cardType: 'dashboard',
            title: 'Career Goal Progress',
            description: primaryGoal.goal,
            icon: React.createElement(TargetIcon),
            iconGradient: 'from-emerald-500 to-emerald-600',
            actionText: 'Track Progress',
            actionUrl: '/profile?tab=goals',
            metric: {
              label: 'Milestones',
              value: `${primaryGoal.completedMilestones}/${primaryGoal.totalMilestones}`
            },
            badge: {
              text: `${primaryGoal.progress}% Complete`,
              variant: primaryGoal.progress >= 75 ? 'success' : primaryGoal.progress >= 50 ? 'secondary' : 'warning'
            }
          });
        }
      }

      // ✅ FIX #1: Sort cards by urgency (high priority first)
      // Best Practice: Critical cards (deadlines, incomplete profiles) show at top
      cards.sort((a, b) => {
        const urgencyWeight = { high: 3, medium: 2, low: 1 };
        const aWeight = urgencyWeight[a.urgency || 'low'];
        const bWeight = urgencyWeight[b.urgency || 'low'];
        return bWeight - aWeight;
      });

      return cards;
    } catch (err) {
      console.error('[useDynamicCards] Dashboard card generation failed:', err);
      return [];
    }
  };

  /**
   * Generate Assessment Cards (Static with Progress)
   */
  const generateAssessmentCards = async (): Promise<AssessmentCard[]> => {
    try {
      const Parse = await getParse();
      const currentUser = Parse.User.current();

      // Fetch assessment progress from backend
      let progressData: Record<string, { completed: boolean; progress: number; completedDate?: string }> = {};

      if (currentUser) {
        try {
          const result = await Parse.Cloud.run('getAssessmentProgress');
          progressData = result || {};
        } catch (err) {
          console.warn('[useDynamicCards] Failed to fetch assessment progress:', err);
        }
      }

      // Define assessments with static data + dynamic progress
      const assessments: AssessmentCard[] = [
        {
          id: 'riasec',
          cardType: 'assessment',
          assessmentType: 'riasec',
          title: 'RIASEC Career Assessment',
          description: 'Discover careers that match your personality and interests',
          icon: React.createElement(Target),
          iconGradient: 'from-purple-500 to-purple-600',
          actionText: progressData.riasec?.completed ? 'View Results' : 'Start Assessment',
          actionUrl: '/assessment/career',
          duration: '15 minutes',
          questions: 96,
          benefit: 'Get personalized career matches based on Holland Codes',
          completionStatus: progressData.riasec
        },
        {
          id: 'skills',
          cardType: 'assessment',
          assessmentType: 'skills',
          title: 'Skills Assessment',
          description: 'Identify your strengths across 6 skill categories',
          icon: React.createElement(Award),
          iconGradient: 'from-green-500 to-green-600',
          actionText: progressData.skills?.completed ? 'View Results' : 'Start Assessment',
          actionUrl: '/assessment/skills',
          duration: '10 minutes',
          questions: 36,
          benefit: 'Understand your skill profile for career planning',
          completionStatus: progressData.skills
        },
        {
          id: 'university-finder',
          cardType: 'assessment',
          assessmentType: 'university',
          title: 'University Course Finder',
          description: 'Find courses that match your KCSE grades and interests',
          icon: React.createElement(BookOpen),
          iconGradient: 'from-indigo-500 to-indigo-600',
          actionText: 'Find Courses',
          actionUrl: '/assessment/university',
          duration: '5 minutes',
          questions: 4,
          benefit: 'Get KUCCPS placement recommendations',
          completionStatus: progressData.university
        },
        {
          id: 'career-explorer',
          cardType: 'assessment',
          assessmentType: 'career',
          title: 'Career Exploration',
          description: 'Explore 200+ careers with Kenya-specific insights',
          icon: React.createElement(TrendingUp),
          iconGradient: 'from-amber-500 to-amber-600',
          actionText: 'Explore Careers',
          actionUrl: '/assessment/explore',
          duration: 'Self-paced',
          questions: 0,
          benefit: 'Learn about salaries, requirements, and job outlook',
          completionStatus: progressData.career
        },
        {
          id: 'subject-mapper',
          cardType: 'assessment',
          assessmentType: 'subjects',
          title: 'Subject-Career Mapper',
          description: 'See which careers match your KCSE subjects',
          icon: React.createElement(Calendar),
          iconGradient: 'from-blue-500 to-blue-600',
          actionText: 'Map Careers',
          actionUrl: '/assessment/subjects',
          duration: '2 minutes',
          questions: 1,
          benefit: 'Discover careers aligned with your subject choices',
          completionStatus: progressData.subjects
        }
      ];

      return assessments;
    } catch (err) {
      console.error('[useDynamicCards] Assessment card generation failed:', err);
      return [];
    }
  };

  /**
   * Generate Guidance Cards (Freemium Model)
   * Note: Crisis resources removed per user request
   */
  const generateGuidanceCards = async (): Promise<GuidanceCard[]> => {
    const cards: GuidanceCard[] = [
      {
        id: 'community-qa',
        cardType: 'guidance',
        serviceType: 'community',
        title: 'Community Q&A',
        description: 'Ask questions and get answers from career counselors',
        icon: React.createElement(Users),
        iconGradient: 'from-blue-500 to-blue-600',
        actionText: 'Browse Questions',
        actionUrl: '/guidance/community-qa',
        isPremium: false,
        features: [
          'Searchable Q&A archive',
          'Public or anonymous questions',
          'Counselor-verified answers'
        ],
        responseTime: '24-48 hours',
        badge: {
          text: 'Free',
          variant: 'success'
        }
      },
      {
        id: 'premium-inbox',
        cardType: 'guidance',
        serviceType: 'premium',
        title: 'Message Counselor',
        description: 'Private 1-on-1 messaging with your assigned counselor',
        icon: React.createElement(Target),
        iconGradient: 'from-amber-500 to-amber-600',
        actionText: 'Open Inbox',
        actionUrl: '/inbox',
        isPremium: true,
        features: [
          'Real-time messaging',
          'Guaranteed 24-hour response',
          'Read receipts and online status'
        ],
        responseTime: '24 hours',
        badge: {
          text: 'Premium',
          variant: 'warning'
        }
      },
      {
        id: 'session-booking',
        cardType: 'guidance',
        serviceType: 'booking',
        title: 'Book Counseling Session',
        description: 'Schedule video, phone, or in-person sessions',
        icon: React.createElement(Calendar),
        iconGradient: 'from-purple-500 to-purple-600',
        actionText: 'View Availability',
        actionUrl: '/guidance/book-session',
        isPremium: true,
        features: [
          '30/60/90 minute sessions',
          'Video, phone, or in-person',
          'Post-session action plan'
        ],
        badge: {
          text: 'Premium',
          variant: 'warning'
        }
      },
      {
        id: 'resources',
        cardType: 'guidance',
        serviceType: 'resources',
        title: 'Career Resources',
        description: 'Guides, videos, and tools for career planning',
        icon: React.createElement(BookOpen),
        iconGradient: 'from-green-500 to-green-600',
        actionText: 'Browse Library',
        actionUrl: '/guidance/resources',
        isPremium: false,
        features: [
          'Career guides and PDFs',
          'University comparison tools',
          'Scholarship database'
        ],
        badge: {
          text: 'Coming Soon',
          variant: 'secondary'
        }
      }
    ];

    return cards;
  };

  /**
   * Fetch cards based on variant
   */
  const fetchCards = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let fetchedCards: CardData[] = [];

      switch (variant) {
        case 'dashboard':
          fetchedCards = await generateDashboardCards();
          break;
        case 'assessment':
          fetchedCards = await generateAssessmentCards();
          break;
        case 'guidance':
          fetchedCards = await generateGuidanceCards();
          break;
      }

      // ✅ FIX: Don't slice cards in hook - let component control display limit
      // The component needs full card count to show "Show X More Cards" button
      // Progressive disclosure happens in StudentDashboardCardsV2 via expanded state

      setCards(fetchedCards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cards';
      setError(errorMessage);
      console.error('[useDynamicCards] Card fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh cards (exposed for manual refresh)
   */
  const refreshCards = async (): Promise<void> => {
    await fetchCards();
  };

  // Load cards on mount and when variant changes
  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return {
    cards,
    loading,
    error,
    refreshCards
  };
};
