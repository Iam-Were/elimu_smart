import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
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

// Student-centric assessment cards tailored to Kenyan secondary school journey
const studentAssessmentCards: StudentAssessmentCard[] = [
  {
    id: 'discover-my-career',
    title: 'Kenya Career Pathways',
    studentFocusedDescription: 'Match your interests with careers that have KUCCPS pathways and Kenya job opportunities',
    icon: <Target className="h-6 w-6" />,
    progress: 0,
    status: 'not-started',
    urgency: 'high',
    actionText: 'Discover Career Paths',
    actionLink: '/assessment/career',
    studentBenefit: 'Find careers with guaranteed KUCCPS pathways and real Kenya job prospects',
    timeCommitment: '20 minutes to discover, lifetime career clarity',
    studentConcerns: [
      'Are there job opportunities in Kenya for this career?',
      'Can I get government sponsorship for this course?',
      'What if my grades aren\'t good enough for my dream career?',
      'How do I convince my parents this career has a future?',
    ],
    nextSteps: [
      'Get career matches with placement requirements',
      'See Kenya salary & employment data',
      'View government sponsorship options',
      'Connect with career professionals',
    ],
    connections: [
      'Links to KUCCPS Subject Mapper',
      'Connects to University Placement Hub',
      'Feeds into Kenya Job Market Insights',
    ],
    requirements: {
      grade: 'Form 3 or 4 (ideal timing)',
      timing: 'Best taken before choosing A-level subjects or university course',
    },
    aiReadiness: {
      currentData: 'Personality, interests, KCSE performance, Kenya job market trends',
      futureAI: 'AI will predict career success in Kenya context and emerging opportunities with KUCCPS pathways',
    },
  },
  {
    id: 'subject-to-career-mapper',
    title: 'Subject-to-Career Mapper',
    studentFocusedDescription: 'See exactly which careers you can pursue with your current subjects and grades',
    icon: <Map className="h-6 w-6" />,
    progress: 60,
    status: 'in-progress',
    urgency: 'high',
    actionText: 'Complete Subject Mapping',
    actionLink: '/assessment/subjects',
    studentBenefit: 'Clear understanding of career options with your subject combination',
    timeCommitment: '10 minutes to complete, lifetime clarity',
    studentConcerns: [
      'Are my grades good enough?',
      'Did I choose the right subjects?',
      'What careers can I actually pursue?',
      'Will I meet career requirements?',
    ],
    nextSteps: [
      'See all careers possible with your subjects',
      'Check minimum grade requirements',
      'Find backup career options',
      'Get university guidance',
    ],
    connections: [
      'Links to Career Discovery results',
      'Connects to University Placement Hub',
      'Feeds into Study Planning',
    ],
    requirements: {
      grade: 'Any form, most useful Form 3-4',
      subjects: ['Current subject combination', 'Performance levels'],
      timing: 'Update after each exam period',
    },
    aiReadiness: {
      currentData: 'Subject performance, grade trends, career interests',
      futureAI: 'AI will predict career success probability and suggest improvement strategies',
    },
  },
  {
    id: 'skills-strength-finder',
    title: 'My Skills & Strengths',
    studentFocusedDescription: 'Discover your hidden talents and skills that make you unique - build confidence in your abilities!',
    icon: <Trophy className="h-6 w-6" />,
    progress: 0,
    status: 'not-started',
    urgency: 'medium',
    actionText: 'Find My Strengths',
    actionLink: '/student/skills-assessment',
    studentBenefit: 'Know your superpowers and how to use them in your career',
    timeCommitment: '15 minutes of honest self-reflection',
    studentConcerns: [
      'I dont think Im good at anything special',
      'How do I know what my talents are?',
      'Everyone else seems more talented',
    ],
    nextSteps: [
      'Get your top 5 skill areas',
      'Learn how to develop them further',
      'See which careers value your skills',
      'Share with teachers for guidance',
    ],
    connections: [
      'Enhances Career Discovery results',
      'Links to Skills Development Resources',
      'Connects to Mentorship Matching',
    ],
    requirements: {
      grade: 'Any form - never too early to know your strengths',
      timing: 'Great for building confidence during tough academic periods',
    },
    aiReadiness: {
      currentData: 'Self-assessed skills, performance patterns, interest alignment',
      futureAI: 'AI will identify skills from behavior patterns and suggest development paths',
    },
  },
  {
    id: 'university-course-finder',
    title: 'University Course Finder',
    studentFocusedDescription: 'Find the perfect university course that matches your career goals, subjects, and budget - make smart choices!',
    icon: <GraduationCap className="h-6 w-6" />,
    progress: 0,
    status: 'not-started',
    urgency: 'high',
    actionText: 'Explore University Options',
    actionLink: '/student/university-finder',
    studentBenefit: 'Choose university courses that actually lead to your dream career',
    timeCommitment: '25 minutes to explore thoroughly',
    studentConcerns: [
      'Which course should I choose?',
      'What if I choose the wrong degree?',
      'Can my family afford university?',
      'Which universities are best for my career?',
    ],
    nextSteps: [
      'Get your top course recommendations',
      'Compare fees and financial aid options',
      'See employment rates for each course',
      'Connect with current students in those courses',
    ],
    connections: [
      'Uses Career Discovery results',
      'Links to Scholarship Finder',
      'Connects to Financial Planning tools',
    ],
    requirements: {
      grade: 'Form 4 (ideal for KCSE candidates)',
      subjects: ['All subjects - based on career interests'],
      timing: 'Best used during KUCCPS application period',
    },
    aiReadiness: {
      currentData: 'Career preferences, academic performance, financial constraints',
      futureAI: 'AI will predict course success probability and job market trends',
    },
  },
  {
    id: 'career-exploration-journey',
    title: 'Career Exploration Journey',
    studentFocusedDescription: 'Take deep dives into different careers - see what the work is really like beyond just the title!',
    icon: <Brain className="h-6 w-6" />,
    progress: 25,
    status: 'in-progress',
    urgency: 'medium',
    actionText: 'Continue Exploring',
    actionLink: '/student/career-exploration',
    studentBenefit: 'Avoid career surprises - know exactly what your future job will involve',
    timeCommitment: '10 minutes per career you explore',
    studentConcerns: [
      'What do people in X career actually do daily?',
      'Will this career make me happy?',
      'What are the challenges I should expect?',
    ],
    nextSteps: [
      'Get detailed day-in-the-life insights',
      'Watch video interviews with professionals',
      'Understand salary expectations realistically',
      'Connect with professionals for mentorship',
    ],
    connections: [
      'Builds on Career Discovery results',
      'Links to Professional Networking',
      'Connects to Internship Opportunities',
    ],
    requirements: {
      grade: 'Any form, but most valuable after Career Discovery',
      timing: 'Ongoing - explore 2-3 careers per month',
    },
    aiReadiness: {
      currentData: 'Career interests, exploration patterns, engagement levels',
      futureAI: 'AI will curate personalized career content and predict satisfaction levels',
    },
  },
  // FUTURE DEVELOPMENT: Daily Career Check-in
  // Requires habit tracking system and progress analytics
  // {
  //   id: 'quick-daily-check',
  //   title: 'Daily Career Check-in',
  //   studentFocusedDescription: 'Daily progress tracking and reflection',
  //   icon: <Zap className="h-6 w-6" />,
  //   progress: 80,
  //   status: 'in-progress',
  //   urgency: 'low',
  //   actionText: 'Take Today\'s Check-in',
  //   actionLink: '/student/daily-checkin'
  // },
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

const getUrgencyBadge = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return <Badge className="bg-red-500 text-white text-xs">Urgent</Badge>;
    case 'medium':
      return <Badge className="bg-orange-500 text-white text-xs">Important</Badge>;
    default:
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">When Ready</Badge>;
  }
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
  const { 
    logActivity, 
    careerReadinessScore,
    userActivities,
    courseRecommendations,
    loading,
    error 
  } = useDynamicDashboard();

  // Transform static cards with dynamic data
  const getDynamicCards = (): StudentAssessmentCard[] => {
    const baseCards = [...studentAssessmentCards];
    
    // Calculate dynamic progress for each card based on user activities
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
          
          // Update with dynamic course recommendations
          if (courseRecommendations && courseRecommendations.highMatches > 0) {
            card.studentBenefit = `${courseRecommendations.highMatches} high-match courses identified for your profile`;
            card.status = courseRecommendations.highMatches > 0 ? 'needs-attention' : card.status;
            card.urgency = 'high';
          }
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
    logActivity('assessment_card_click', {
      cardId: card.id,
      cardTitle: card.title,
      urgency: card.urgency,
      status: card.status,
      progress: card.progress || 0,
      studentBenefit: card.studentBenefit,
      timeCommitment: card.timeCommitment
    });
  };
  
  // LinkedIn-style responsive grid classes
  const getGridClasses = () => {
    if (size === 'compact') return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
    if (size === 'large') return "grid grid-cols-1 lg:grid-cols-2 gap-8";
    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"; // medium
  };
  
  const getCardClasses = () => {
    if (size === 'compact') return "p-4 min-h-[140px]";
    if (size === 'large') return "p-6 min-h-[220px]";
    return "p-5 min-h-[180px]"; // medium
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Student-focused Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Your Career Discovery Journey
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Designed specifically for Kenyan students - find your perfect career path with assessments that understand your world
          </p>
        </div>
        {!showAll && studentAssessmentCards.length > maxCards && (
          <Button asChild variant="secondary" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <Link to="/student/assessments">
              See All Assessments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Student Progress Summary - Moved to Top */}
      <Card className="bg-gradient-to-br from-orange-50/50 via-background to-orange-50/30 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <Award className="h-5 w-5" />
            </div>
            Your Discovery Progress
          </CardTitle>
          <CardDescription>
            Track your journey to finding the perfect career fit
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading your progress...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">
                    {dynamicCards.filter(card => card.progress === 100 || card.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Assessments Completed</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {careerReadinessScore?.overall || Math.round(
                      dynamicCards.reduce((sum, card) => sum + (card.progress || 0), 0) / 
                      dynamicCards.length
                    )}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {careerReadinessScore ? 'Career Readiness' : 'Overall Progress'}
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-red-600">
                    {dynamicCards.filter(card => card.urgency === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Priority Items</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">
                    {userActivities.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Activities</div>
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
              className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 cursor-pointer",
                "bg-gradient-to-br from-white via-white to-orange-50/20 border-orange-100",
                getCardClasses(),
                card.urgency === 'high' && "ring-2 ring-orange-300 shadow-lg"
              )}
            >
              {/* Urgency Indicator */}
              {card.urgency === 'high' && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-red-500">
                  <Star className="absolute -top-6 -right-5 h-3 w-3 text-white" />
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                      {card.icon}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{card.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getUrgencyBadge(card.urgency)}
                        <Badge 
                          variant="secondary"
                          className={statusConfig.className}
                        >
                          {statusConfig.icon}
                          <span className="ml-1 text-xs">{statusConfig.badge}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {card.studentFocusedDescription}
                </CardDescription>

                {/* Student Benefit */}
                <div className="p-3 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                  <h4 className="font-medium text-sm text-orange-800 mb-1">What You'll Gain:</h4>
                  <p className="text-sm text-orange-700">{card.studentBenefit}</p>
                </div>

                {/* Progress Bar */}
                {card.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-orange-600 font-medium">{card.progress}%</span>
                    </div>
                    <Progress value={card.progress} className="h-2" />
                  </div>
                )}

                {/* Time Commitment */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{card.timeCommitment}</span>
                </div>

                {/* AI Future Enhancement */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm text-blue-800">AI-Enhanced Soon</span>
                  </div>
                  <p className="text-xs text-blue-700">{card.aiReadiness.futureAI}</p>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button 
                  asChild
                  className={cn(
                    "w-full gap-2 transition-all duration-200",
                    card.urgency === 'high' 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" 
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  )}
                >
                  <Link 
                    to={card.actionLink} 
                    className="flex items-center gap-2"
                    onClick={() => handleCardClick(card)}
                  >
                    {card.actionText}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
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