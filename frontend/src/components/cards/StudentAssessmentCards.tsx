import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface StudentAssessmentCard {
  // Core display fields (6 elements for card)
  id: string;
  title: string;
  studentFocusedDescription: string; // <100 chars
  icon: React.ReactNode;
  iconGradient: string; // Gradient for icon container
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
    icon: <Brain className="h-6 w-6" />,
    iconGradient: 'from-purple-500 to-purple-600',
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
    icon: <Map className="h-6 w-6" />,
    iconGradient: 'from-blue-500 to-blue-600',
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
    icon: <Trophy className="h-6 w-6" />,
    iconGradient: 'from-green-500 to-green-600',
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
    icon: <GraduationCap className="h-6 w-6" />,
    iconGradient: 'from-indigo-500 to-indigo-600',
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
    icon: <Brain className="h-6 w-6" />,
    iconGradient: 'from-amber-500 to-amber-600',
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
    icon: <Award className="h-6 w-6" />,
    iconGradient: 'from-orange-500 to-orange-600',
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
      className: 'bg-orange-50 text-orange-700'
    },
    'in-progress': { 
      icon: <Clock className="h-4 w-4" />,
      badge: 'In Progress',
      className: 'bg-blue-50 text-blue-700'
    },
    'completed': { 
      icon: <CheckCircle className="h-4 w-4" />,
      badge: 'Completed',
      className: 'bg-green-50 text-green-700'
    },
    'needs-attention': { 
      icon: <Star className="h-4 w-4" />,
      badge: 'Needs Update',
      className: 'bg-red-50 text-red-700'
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
    error
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
    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]";
  };

  // Get row-span class based on card display size
  const getCardRowSpan = (card: StudentAssessmentCard) => {
    if (card.displaySize === 'tall') return 'md:row-span-2';
    if (card.displaySize === 'standard') return 'md:row-span-1';
    return ''; // compact cards auto-fit
  };

  return (
    <div className={cn("space-y-6", className)}>

      {/* Student Progress Summary - Enhanced with Glassmorphism */}
      <Card className="glass-assessment-card border-orange-200/30 relative overflow-hidden">
        {/* Multi-layer floating decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/15 to-orange-300/8 rounded-full -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/12 to-orange-200/6 rounded-full -ml-12 -mb-12"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl glass-card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6 drop-shadow-sm" />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
                Your Discovery Progress
              </div>
              <div className="text-sm text-orange-600/80 font-medium">
                AI-powered career journey tracking
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-8 glass-card-primary rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-sm text-orange-700 font-medium">Loading your progress...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="glass-card-success p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-emerald-600 drop-shadow-sm">
                    {dynamicCards.filter(card => card.progress === 100 || card.status === 'completed').length}
                  </div>
                  <div className="text-sm font-medium text-emerald-700">Assessments Completed</div>
                </div>
                
                <div className="glass-card-primary p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-orange-600 drop-shadow-sm">
                    {careerReadinessScore?.overall || Math.round(
                      dynamicCards.reduce((sum, card) => sum + (card.progress || 0), 0) / 
                      dynamicCards.length
                    )}%
                  </div>
                  <div className="text-sm font-medium text-orange-700">
                    {careerReadinessScore ? 'Career Readiness' : 'Overall Progress'}
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform border-red-200/30">
                  <div className="text-3xl font-bold text-red-600 drop-shadow-sm">
                    {dynamicCards.filter(card => card.urgency === 'high').length}
                  </div>
                  <div className="text-sm font-medium text-red-700">Priority Items</div>
                </div>
                
                <div className="glass-card p-4 rounded-xl text-center space-y-2 hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-purple-600 drop-shadow-sm">
                    {userActivities.length}
                  </div>
                  <div className="text-sm font-medium text-slate-600">Total Activities</div>
                </div>
              </div>
              
              {/* Dynamic Career Readiness Breakdown */}
              {careerReadinessScore && (
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-100">
                  <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Your Career Readiness Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {careerReadinessScore.breakdown.assessmentCompletion}%
                      </div>
                      <div className="text-xs text-muted-foreground">Assessments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {careerReadinessScore.breakdown.careerResearch}%
                      </div>
                      <div className="text-xs text-muted-foreground">Research</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {careerReadinessScore.breakdown.courseExploration}%
                      </div>
                      <div className="text-xs text-muted-foreground">Exploration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {careerReadinessScore.breakdown.actionsTaken}%
                      </div>
                      <div className="text-xs text-muted-foreground">Actions</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Course Recommendations */}
              {courseRecommendations && courseRecommendations.highMatches > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Course Recommendations Ready
                  </h4>
                  <p className="text-sm text-green-700">
                    {courseRecommendations.highMatches} high-match courses found! 
                    Check the University Course Finder for detailed recommendations.
                  </p>
                </div>
              )}

              {/* Default AI Enhancement Message */}
              {!careerReadinessScore && !courseRecommendations && (
                <div className="mt-6 p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Smart Career Matching
                  </h4>
                  <p className="text-sm text-orange-700">
                    Complete more assessments to unlock AI-powered career recommendations tailored to your interests, skills, and Kenya's job market.
                  </p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    Unable to load some dynamic data. Showing static progress for now.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Resume Where You Left Off - For In-Progress Assessments */}
      {dynamicCards.filter(card => card.status === 'in-progress' && card.progress > 0 && card.progress < 100).length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-blue-900">Resume Where You Left Off</CardTitle>
                <p className="text-sm text-blue-700">Continue your assessments to unlock personalized insights</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicCards
                .filter(card => card.status === 'in-progress' && card.progress > 0 && card.progress < 100)
                .map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="group p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shadow-md flex-shrink-0",
                        `bg-gradient-to-br ${card.iconGradient}`
                      )}>
                        {React.cloneElement(card.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 text-white" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 mb-1">{card.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                          <span className="text-xs text-slate-600">{card.timeCommitment} remaining</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">{card.progress}% complete</span>
                            <span className="text-blue-600 font-bold">Continue →</span>
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

      {/* Student Assessment Cards Grid - Bento Layout */}
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
                "bg-white/80 backdrop-blur-sm border border-orange-200/30 rounded-xl",
                card.urgency === 'high' && "ring-2 ring-orange-300/50 shadow-lg shadow-orange-500/10",
                getCardRowSpan(card)
              )}
            >
              {/* Priority Indicator */}
              {card.urgency === 'high' && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Priority
                </div>
              )}
              
              <CardHeader className="pb-4 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                    `bg-gradient-to-br ${card.iconGradient}`
                  )}>
                    {React.cloneElement(card.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div className="flex-1 w-full">
                    <CardTitle className="text-lg font-semibold text-slate-800 text-center">{card.title}</CardTitle>
                    <div className="flex items-center justify-center gap-2 mt-1">
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

              <CardContent className="space-y-3 text-center">
                <CardDescription className="text-sm text-slate-600 text-center">
                  {card.studentFocusedDescription}
                </CardDescription>

                {/* Student Benefit */}
                <p className="text-sm text-orange-700 font-medium text-center">{card.studentBenefit}</p>

                {/* Match Score for completed assessments */}
                {card.matchScore !== undefined && card.status === 'completed' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-green-600 fill-green-600" />
                        <span className="text-sm font-semibold text-green-800">Career Match Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">{card.matchScore}%</span>
                        {card.matchScore >= 90 && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    </div>
                    {card.matchScore >= 90 && (
                      <p className="text-xs text-green-700 mt-1">Excellent match! This aligns perfectly with your profile.</p>
                    )}
                  </div>
                )}

                {/* Progress Bar for in-progress assessments */}
                {card.progress !== undefined && card.status !== 'completed' && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">Progress</span>
                      <span className="text-orange-600 font-bold">{card.progress}%</span>
                    </div>
                    <Progress value={card.progress} className="h-2" />
                  </div>
                )}

                {/* Time & Requirements */}
                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{card.timeCommitment}</span>
                  </div>
                  <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">
                    {card.requirements?.grade || 'Any form'}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-3">
                <Button
                  data-testid="card-action"
                  onClick={() => handleCardClick(card)}
                  className={cn(
                    "w-full gap-2 font-medium",
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