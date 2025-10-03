import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  id: string;
  title: string;
  studentFocusedDescription: string; // Student-specific language
  icon: React.ReactNode;
  progress?: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'needs-attention';
  urgency: 'high' | 'medium' | 'low'; // Student timeline urgency
  actionText: string;
  actionLink: string;
  studentBenefit: string; // What student gains
  timeCommitment: string; // Realistic time expectation
  studentConcerns?: string[]; // Common student worries addressed
  nextSteps: string[]; // Clear next actions after completion
  connections?: string[]; // How it connects to other student goals
  requirements?: {
    grade?: string; // Form 1-4, or A-level
    subjects?: string[]; // Required subjects
    timing?: string; // Best time to take
  };
  aiReadiness: {
    currentData: string; // What data is ready for AI
    futureAI: string; // How AI will enhance this
  };
}

// Student-centric assessment cards - focused on specific evaluations
const studentAssessmentCards: StudentAssessmentCard[] = [
  {
    id: 'subject-to-career-mapper',
    title: 'Subject Mapper',
    studentFocusedDescription: 'Map your subjects to careers',
    icon: <Map className="h-6 w-6" />,
    progress: 60,
    status: 'in-progress',
    urgency: 'high',
    actionText: 'Complete Mapping',
    actionLink: '/assessment/subjects',
    studentBenefit: 'Career possibilities',
    timeCommitment: '8 minutes',
    studentConcerns: [
      'Did I choose the right subjects?',
      'What careers can I actually pursue?',
      'Are my grades good enough?',
    ],
    nextSteps: [
      'Input your current grades',
      'See career possibilities',
      'Check minimum requirements',
    ],
    connections: [
      'Uses Career Discovery results',
      'Feeds into University Finder',
    ],
    requirements: {
      grade: 'Form 3-4 students',
      subjects: ['Current subject combination'],
      timing: 'Update after each exam',
    },
    aiReadiness: {
      currentData: 'Subject performance, grade trends',
      futureAI: 'AI will predict grade improvement strategies',
    },
  },
  {
    id: 'skills-strength-finder',
    title: 'Skills & Strengths',
    studentFocusedDescription: 'Discover your talents and strengths',
    icon: <Trophy className="h-6 w-6" />,
    progress: 0,
    status: 'not-started',
    urgency: 'medium',
    actionText: 'Find Strengths',
    actionLink: '/assessment/skills',
    studentBenefit: 'Know your strengths',
    timeCommitment: '12 minutes',
    studentConcerns: [
      'What am I actually good at?',
      'How do my skills compare to others?',
      'Which careers value my strengths?',
    ],
    nextSteps: [
      'Complete skills assessment',
      'Review strength areas',
      'Connect to career options',
    ],
    connections: [
      'Enhances Career Discovery',
      'Links to Skills Development',
    ],
    requirements: {
      grade: 'Any form - never too early',
      timing: 'Great for confidence building',
    },
    aiReadiness: {
      currentData: 'Self-assessed skills, performance patterns',
      futureAI: 'AI will identify hidden skills from behavior analysis',
    },
  },
  {
    id: 'university-course-finder',
    title: 'University Course Finder',
    studentFocusedDescription: 'Find university courses that match your goals',
    icon: <GraduationCap className="h-6 w-6" />,
    progress: 0,
    status: 'not-started',
    urgency: 'high',
    actionText: 'Explore Courses',
    actionLink: '/assessment/university',
    studentBenefit: 'Choose the right course',
    timeCommitment: '20 minutes',
    studentConcerns: [
      'Which course should I choose?',
      'Can I afford university?',
      'Which universities are best?',
    ],
    nextSteps: [
      'Get course recommendations',
      'Compare fees and requirements',
      'See employment rates',
    ],
    connections: [
      'Uses Career Discovery results',
      'Links to Scholarship Finder',
    ],
    requirements: {
      grade: 'Form 4 (KCSE candidates)',
      timing: 'Before KUCCPS application',
    },
    aiReadiness: {
      currentData: 'Career preferences, academic performance',
      futureAI: 'AI will predict course success probability',
    },
  },
  {
    id: 'career-exploration-journey',
    title: 'Career Deep Dive',
    studentFocusedDescription: 'Learn what different careers are really like beyond just the job title',
    icon: <Brain className="h-6 w-6" />,
    progress: 25,
    status: 'in-progress',
    urgency: 'medium',
    actionText: 'Continue Exploring',
    actionLink: '/assessment/explore',
    studentBenefit: 'Avoid career surprises - know what your future job involves',
    timeCommitment: '8 minutes per career',
    studentConcerns: [
      'What do people in this career actually do?',
      'Will this career make me happy?',
      'What challenges should I expect?',
    ],
    nextSteps: [
      'Watch professional interviews',
      'Understand daily responsibilities',
      'Connect with industry mentors',
    ],
    connections: [
      'Builds on Career Discovery',
      'Links to Professional Network',
    ],
    requirements: {
      grade: 'Any form',
      timing: 'Ongoing exploration',
    },
    aiReadiness: {
      currentData: 'Career interests, exploration patterns',
      futureAI: 'AI will curate personalized career content',
    },
  },
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
  size?: 'compact' | 'medium' | 'large';
}

export const StudentAssessmentCards: React.FC<StudentAssessmentCardsProps> = ({
  className,
  showAll = false,
  maxCards = 6,
  size = 'medium',
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
  
  // LinkedIn-style responsive grid classes
  const getGridClasses = () => {
    if (size === 'compact') return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
    if (size === 'large') return "grid grid-cols-1 lg:grid-cols-2 gap-8";
    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"; // medium
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

      {/* Student Assessment Cards Grid */}
      <div className={getGridClasses()}>
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
                card.urgency === 'high' && "ring-2 ring-orange-300/50 shadow-lg shadow-orange-500/10"
              )}
            >
              {/* Priority Indicator */}
              {card.urgency === 'high' && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Priority
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-800">{card.title}</CardTitle>
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

              <CardContent className="space-y-3">
                <CardDescription className="text-sm text-slate-600">
                  {card.studentFocusedDescription}
                </CardDescription>

                {/* Student Benefit */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <h4 className="font-semibold text-sm text-orange-800 mb-1">You'll Get:</h4>
                  <p className="text-sm text-orange-700">{card.studentBenefit}</p>
                </div>

                {/* Progress Bar */}
                {card.progress !== undefined && (
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