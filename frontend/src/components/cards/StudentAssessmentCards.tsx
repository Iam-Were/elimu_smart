import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconContainer } from '@/components/ui/icon-container';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Award,
  Play,
  Trophy,
  Brain,
  GraduationCap,
  Map,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface StudentAssessmentCard {
  // Core display fields (6 elements for card)
  id: string;
  title: string;
  studentFocusedDescription: string; // <100 chars
  icon: LucideIcon;
  iconEmphasis: 'subtle' | 'medium' | 'high'; // Icon emphasis level (90% subtle, 8% medium, 2% high)
  status: 'not-started' | 'in-progress' | 'completed' | 'needs-attention';

  // Action/Progress fields
  actionText: string;
  actionLink: string;
  progress?: number; // From backend
  urgency: 'high' | 'medium' | 'low';

  // Enhanced display fields (from production pattern)
  studentBenefit: string; // Single line benefit
  timeCommitment: string; // e.g., "15 min"
  matchScore?: number; // For results display (e.g., 95%)
  estimatedTime?: string; // Alternative to timeCommitment

  // Bento grid sizing
  displaySize: 'tall' | 'standard' | 'compact';
  contentComplexity: 'high' | 'medium' | 'low';

  // Minimal requirements (only grade displayed)
  requirements?: {
    grade?: string; // Form 1-4, or A-level
  };
}

// Student-centric assessment cards - focused on specific evaluations
const studentAssessmentCards: StudentAssessmentCard[] = [
  {
    id: 'discover-my-career',
    title: 'Career Discovery',
    studentFocusedDescription: 'Discover careers that match your personality with the RIASEC assessment',
    icon: Brain,
    iconEmphasis: 'medium', // Active assessment - medium emphasis
    status: 'not-started',
    actionText: 'Start Discovery',
    actionLink: '/assessment/career',
    progress: 0,
    urgency: 'high',
    studentBenefit: 'Get your Holland Code (R-I-A-S-E-C) and Kenya career matches',
    timeCommitment: '25 minutes',
    displaySize: 'tall',
    contentComplexity: 'high',
    requirements: {
      grade: 'Form 2-4 recommended'
    }
  },
  {
    id: 'subject-to-career-mapper',
    title: 'Subject Mapper',
    studentFocusedDescription: 'Map your subjects to careers',
    icon: Map,
    iconEmphasis: 'medium', // Active mapping task
    status: 'in-progress',
    actionText: 'Complete Mapping',
    actionLink: '/assessment/subjects',
    progress: 60,
    urgency: 'high',
    studentBenefit: 'Career possibilities',
    timeCommitment: '8 minutes',
    displaySize: 'standard',
    contentComplexity: 'medium',
    requirements: {
      grade: 'Form 3-4 students'
    }
  },
  {
    id: 'skills-strength-finder',
    title: 'Skills & Strengths',
    studentFocusedDescription: 'Discover your talents and strengths',
    icon: Trophy,
    iconEmphasis: 'subtle', // Informational - subtle emphasis
    status: 'not-started',
    actionText: 'Find Strengths',
    actionLink: '/assessment/skills',
    progress: 0,
    urgency: 'medium',
    studentBenefit: 'Know your strengths',
    timeCommitment: '12 minutes',
    displaySize: 'standard',
    contentComplexity: 'medium',
    requirements: {
      grade: 'Any form - never too early'
    }
  },
  {
    id: 'university-course-finder',
    title: 'University Course Finder',
    studentFocusedDescription: 'Find university courses that match your goals',
    icon: GraduationCap,
    iconEmphasis: 'medium', // Important for Form 4
    status: 'not-started',
    actionText: 'Explore Courses',
    actionLink: '/assessment/university',
    progress: 0,
    urgency: 'high',
    studentBenefit: 'Choose the right course',
    timeCommitment: '20 minutes',
    displaySize: 'tall',
    contentComplexity: 'high',
    requirements: {
      grade: 'Form 4 (KCSE candidates)'
    }
  },
  {
    id: 'career-exploration-journey',
    title: 'Career Deep Dive',
    studentFocusedDescription: 'Learn what different careers are really like beyond just the job title',
    icon: Brain,
    iconEmphasis: 'subtle', // Browsing/exploration - subtle
    status: 'in-progress',
    actionText: 'Continue Exploring',
    actionLink: '/assessment/explore',
    progress: 25,
    urgency: 'medium',
    studentBenefit: 'Avoid career surprises - know what your future job involves',
    timeCommitment: '8 minutes per career',
    displaySize: 'compact',
    contentComplexity: 'low',
    requirements: {
      grade: 'Any form'
    }
  },
  {
    id: 'assessment-results',
    title: 'My Results',
    studentFocusedDescription: 'Your complete career profile and personalized recommendations',
    icon: Award,
    iconEmphasis: 'high', // Major milestone - high emphasis with gradient
    status: 'not-started',
    actionText: 'View My Results',
    actionLink: '/profile/results',
    progress: 0,
    urgency: 'medium',
    studentBenefit: 'Complete career profile with Holland Code, skills matrix, and university matches',
    timeCommitment: '10 minutes',
    matchScore: undefined, // Will show match score when assessments are completed
    displaySize: 'tall',
    contentComplexity: 'high',
    requirements: {
      grade: 'Any form'
    }
  }
];

// Student-specific styling with orange theme
const getStatusConfig = (status: string, urgency: string) => {
  const baseConfig = {
    'not-started': {
      icon: <Play className="h-4 w-4" />,
      badge: 'Ready to Start',
      className: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    },
    'in-progress': {
      icon: <Clock className="h-4 w-4" />,
      badge: 'In Progress',
      className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    },
    'completed': {
      icon: <CheckCircle className="h-4 w-4" />,
      badge: 'Completed',
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    },
    'needs-attention': {
      icon: <Star className="h-4 w-4" />,
      badge: 'Needs Update',
      className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    },
  };

  const config = baseConfig[status as keyof typeof baseConfig] || baseConfig['not-started'];

  // Add urgency styling
  if (urgency === 'high') {
    config.className += ' ring-2 ring-orange-300';
  }

  return config;
};

interface StudentAssessmentCardsProps {
  className?: string;
  showAll?: boolean;
  maxCards?: number;
}

export const StudentAssessmentCards: React.FC<StudentAssessmentCardsProps> = ({
  className,
  showAll = false,
  maxCards = 6,
}) => {
  const navigate = useNavigate();
  const {
    logActivity,
    careerReadinessScore,
    userActivities,
    courseRecommendations,
    assessmentProgress,
    loading,
  } = useDynamicDashboard();

  // Transform static cards with dynamic data
  const getDynamicCards = (): StudentAssessmentCard[] => {
    const baseCards = [...studentAssessmentCards];

    // First apply real backend progress data
    if (assessmentProgress && Object.keys(assessmentProgress).length > 0) {
      baseCards.forEach(card => {
        const progressData = assessmentProgress[card.id];
        if (progressData && typeof progressData === 'object' && progressData !== null) {
          const data = progressData as { progress?: number; status?: string };
          if (typeof data.progress === 'number') {
            card.progress = data.progress;
          }
          if (typeof data.status === 'string') {
            card.status = data.status as 'not-started' | 'in-progress' | 'completed' | 'needs-attention';
          }
        }
      });
    } else {
      // Fallback: Calculate dynamic progress for each card based on user activities
      baseCards.forEach(card => {
        switch (card.id) {
          case 'discover-my-career': {
            const careerActivities = userActivities.filter(a =>
              a.activityType === 'career_assessment_click' ||
              a.activityType === 'personality_test_completion'
            );
            card.progress = Math.min(careerActivities.length * 20, 100);
            card.status = careerActivities.length === 0 ? 'not-started' :
                         careerActivities.length < 5 ? 'in-progress' : 'completed';

            // Add match score for completed assessments
            if (card.status === 'completed') {
              const completionActivity = careerActivities.find(a => a.activityType === 'personality_test_completion');
              const activityData = completionActivity?.data as { matchScore?: number };
              card.matchScore = activityData?.matchScore || 92; // Default high score
            }
            break;
          }

          case 'subject-to-career-mapper': {
            const subjectActivities = userActivities.filter(a =>
              a.activityType === 'subject_mapping_click' ||
              a.activityType === 'grade_input_completion'
            );
            card.progress = Math.min(subjectActivities.length * 15, 100);
            card.status = subjectActivities.length === 0 ? 'not-started' :
                         subjectActivities.length < 7 ? 'in-progress' : 'completed';
            break;
          }

          case 'skills-strength-finder': {
            const skillsActivities = userActivities.filter(a =>
              a.activityType === 'skills_assessment_click' ||
              a.activityType === 'strength_discovery_completion'
            );
            card.progress = Math.min(skillsActivities.length * 25, 100);
            card.status = skillsActivities.length === 0 ? 'not-started' :
                         skillsActivities.length < 4 ? 'in-progress' : 'completed';
            break;
          }

          case 'university-course-finder': {
            const courseActivities = userActivities.filter(a =>
              a.activityType === 'course_finder_click' ||
              a.activityType === 'university_exploration'
            );
            card.progress = Math.min(courseActivities.length * 10, 100);
            card.status = courseActivities.length === 0 ? 'not-started' :
                         courseActivities.length < 10 ? 'in-progress' : 'completed';
            break;
          }

          case 'career-exploration-journey': {
            const explorationActivities = userActivities.filter(a =>
              a.activityType === 'career_exploration_click' ||
              a.activityType === 'professional_interview_view'
            );
            card.progress = Math.min(explorationActivities.length * 5, 100);
            card.status = explorationActivities.length === 0 ? 'not-started' :
                         explorationActivities.length < 20 ? 'in-progress' : 'completed';
            break;
          }

          default:
            break;
        }
      });
    }

    // Apply additional dynamic updates regardless of progress source
    baseCards.forEach(card => {
      // Update course finder with dynamic recommendations
      if (card.id === 'university-course-finder' && courseRecommendations && courseRecommendations.highMatches > 0) {
        card.studentBenefit = `${courseRecommendations.highMatches} high-match courses identified for your profile`;
        card.status = courseRecommendations.highMatches > 0 ? 'needs-attention' : card.status;
        card.urgency = 'high';
      }

      // Update urgency based on career readiness score
      if (careerReadinessScore) {
        if (careerReadinessScore.overall < 30) {
          card.urgency = 'high';
        } else if (careerReadinessScore.overall < 70) {
          card.urgency = 'medium';
        } else {
          card.urgency = 'low';
        }
      }
    });

    return baseCards;
  };

  const dynamicCards = getDynamicCards();
  const displayCards = showAll ? dynamicCards : dynamicCards.slice(0, maxCards);

  const handleCardClick = (card: StudentAssessmentCard) => {
    try {
      // Update progress - mark as started if not already
      const newProgress = card.progress === 0 ? 20 : Math.min((card.progress || 0) + 10, 100);

      // Log activity with progress update
      logActivity('assessment_card_click', {
        cardId: card.id,
        cardTitle: card.title,
        urgency: card.urgency,
        status: card.status,
        progress: newProgress,
        studentBenefit: card.studentBenefit,
        timeCommitment: card.timeCommitment
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }

    // Navigate to the route
    navigate(card.actionLink);
  };

  // Bento grid: Variable height cards based on information complexity
  const getBentoGridClasses = () => {
    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Hero Banner - Clean gradient design */}
      <Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg overflow-hidden relative">
        <CardContent className="flex flex-col md:flex-row items-center md:items-end p-6 md:p-8 gap-4 md:gap-8">
          {/* Avatar - hidden on mobile for cleaner look */}
          <div className="hidden md:flex flex-col items-center justify-end">
            <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
              <User className="h-20 w-20 text-orange-300" />
            </div>
          </div>

          {/* Greeting & Quick Actions */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center md:text-left">
              Welcome back, Student!
            </h1>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-2">
              <Badge className="bg-white/30 text-white font-semibold">
                Profile 85% Complete
              </Badge>
              <Badge className="bg-white/30 text-white font-semibold">
                Focus: Form 4
              </Badge>
            </div>
            <p className="text-white/80 text-sm text-center md:text-left">
              AI-powered career journey tracking
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resume Where You Left Off - For In-Progress Assessments */}
      {dynamicCards.filter(card => card.status === 'in-progress' && (card.progress ?? 0) > 0 && (card.progress ?? 0) < 100).length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/20 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconContainer
                icon={Clock}
                emphasis="medium"
                theme="neutral"
                size="lg"
              />
              <div>
                <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-300">Resume Where You Left Off</CardTitle>
                <p className="text-sm text-blue-700 dark:text-blue-400">Continue your assessments to unlock personalized insights</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicCards
                .filter(card => card.status === 'in-progress' && (card.progress ?? 0) > 0 && (card.progress ?? 0) < 100)
                .map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="group p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <IconContainer
                        icon={card.icon}
                        emphasis="medium"
                        theme="student"
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{card.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{card.timeCommitment} remaining</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{card.progress}% complete</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">Continue →</span>
                          </div>
                          <Progress value={card.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stat Cards - Centered, clean design */}
      {loading ? (
        <div className="flex items-center justify-center py-8 bg-white/90 dark:bg-slate-900 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-sm text-orange-700 dark:text-orange-300 font-medium">Loading your progress...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 shadow hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
              {dynamicCards.filter(card => card.progress === 100 || card.status === 'completed').length}
            </div>
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Assessments Completed
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 shadow hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 drop-shadow-sm">
              {careerReadinessScore?.overall || Math.round(
                dynamicCards.reduce((sum, card) => sum + (card.progress || 0), 0) /
                dynamicCards.length
              )}%
            </div>
            <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {careerReadinessScore ? 'Career Readiness' : 'Overall Progress'}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 shadow hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 drop-shadow-sm">
              {dynamicCards.filter(card => card.urgency === 'high').length}
            </div>
            <div className="text-sm font-medium text-red-700 dark:text-red-300">
              Priority Items
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 shadow hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 drop-shadow-sm">
              {userActivities.length}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Total Activities
            </div>
          </div>
        </div>
      )}

      {/* Student Assessment Cards Grid - Uniform Height Layout */}
      <div className={getBentoGridClasses()}>
        {displayCards.map((card) => {
          const statusConfig = getStatusConfig(card.status, card.urgency);

          return (
            <Card
              key={card.id}
              data-testid="assessment-card"
              data-card-id={card.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg",
                "bg-white/90 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-700/30 rounded-xl",
                "flex flex-col h-full min-h-[520px]",
                card.urgency === 'high' && "ring-2 ring-orange-300/50 shadow-lg shadow-orange-500/10"
              )}
            >
              {/* Priority Indicator */}
              {card.urgency === 'high' && (
                <div className="absolute top-2 right-2 z-20 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Priority
                </div>
              )}

              {/* Hero Image Section */}
              <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-${card.id === 'discover-my-career' ? '1506744038136-46273834b3fb' : card.id === 'subject-to-career-mapper' ? '1523050854a88' : card.id === 'skills-strength-finder' ? '1522071820081' : card.id === 'university-course-finder' ? '1498243691581' : '1465101046530-73398c7f28ca'}?auto=format&fit=crop&w=600&q=80`}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  fallbackSrc="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
                />
                {/* Progress badge overlay */}
                {card.progress !== undefined && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-600 text-white shadow-lg">
                      {card.progress}% Complete
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <IconContainer
                    icon={card.icon}
                    emphasis={card.iconEmphasis}
                    theme="student"
                    size="lg"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">{card.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={cn(statusConfig.className, "text-xs")}
                      >
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.badge}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                <CardDescription className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {card.studentFocusedDescription}
                </CardDescription>

                {/* Student Benefit */}
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium line-clamp-2">{card.studentBenefit}</p>

                {/* Match Score for completed assessments */}
                {card.matchScore !== undefined && card.status === 'completed' && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-emerald-600 fill-emerald-600 dark:text-emerald-400 dark:fill-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Career Match Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{card.matchScore}%</span>
                        {card.matchScore >= 90 && <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />}
                      </div>
                    </div>
                    {card.matchScore >= 90 && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Excellent match! This aligns perfectly with your profile.</p>
                    )}
                  </div>
                )}

                {/* Progress Bar for in-progress assessments */}
                {card.progress !== undefined && card.status !== 'completed' && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Progress</span>
                      <span className="text-orange-600 dark:text-orange-300 font-bold">{card.progress}%</span>
                    </div>
                    <Progress value={card.progress} className="h-2" />
                  </div>
                )}

                {/* Time & Requirements */}
                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-300">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{card.timeCommitment}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                    {card.requirements?.grade || 'Any form'}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-3 mt-auto">
                <Button
                  data-testid="card-action"
                  onClick={() => handleCardClick(card)}
                  className={cn(
                    "w-full gap-2 font-semibold",
                    card.urgency === 'high'
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  )}
                >
                  {card.actionText}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAssessmentCards;
