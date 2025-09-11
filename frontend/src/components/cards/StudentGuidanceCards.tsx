import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Award,
  Play,
  Shield,
  Compass,
  Linkedin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface StudentGuidanceCard {
  id: string;
  title: string;
  studentDescription: string; // How students actually think about this
  icon: React.ReactNode;
  status: 'available' | 'active' | 'completed' | 'urgent';
  priority: 'essential' | 'helpful' | 'optional';
  actionText: string;
  actionLink: string;
  studentValue: string; // What students really get from this
  realTalk: string; // Honest description of what to expect
  whenToUse: string; // When students should actually use this
  timeNeeded: string;
  studentWorries?: string[]; // What students are nervous about
  whatHappens: string[]; // Step-by-step what actually occurs
  successStories?: string; // Short inspiring example
  connections?: string[]; // How it links to other student needs
  cost?: 'free' | 'scholarship' | 'paid';
  availability: {
    timing: string;
    responseTime: string;
  };
}

// Student-focused guidance cards - addressing real student concerns and needs
const studentGuidanceCards: StudentGuidanceCard[] = [
  {
    id: 'talk-to-counselor',
    title: 'Talk to a Counselor',
    studentDescription: 'Get one-on-one help from a real counselor who understands student life - like having an older sibling who\'s been there',
    icon: <Users className="h-6 w-6" />,
    status: 'available',
    priority: 'essential',
    actionText: 'Chat or Book Session',
    actionLink: '/guidance/counselor-connect',
    studentValue: 'Someone who actually listens and helps you figure things out without judgment',
    realTalk: 'A safe space to talk about school stress, career confusion, family pressure - whatever\'s on your mind',
    whenToUse: 'When you\'re stressed, confused about your future, or need someone to talk to',
    timeNeeded: '30-45 minutes per session',
    studentWorries: [
      'What if they judge me?',
      'What if my parents find out what I said?',
      'What if they don\'t understand my problems?',
    ],
    whatHappens: [
      'Choose: instant chat (if counselor online) or book session',
      'Start with quick chat to see if you need a full session',
      'Meet online or in-person (your choice)',
      'Talk about whatever is bothering you',
      'Get practical advice and action steps',
      'Continue chatting or schedule follow-up if needed',
    ],
    successStories: 'Sarah was stressed about choosing between medicine and engineering. After 3 sessions, she felt confident in her choice and her grades improved.',
    connections: [
      'Links to Career Discovery results',
      'Can help interpret assessment outcomes',
      'Connects to parent conversation resources',
    ],
    cost: 'free',
    availability: {
      timing: 'Weekdays 2-8pm, weekends 10am-4pm',
      responseTime: 'Usually within 24 hours',
    },
  },
  // FUTURE DEVELOPMENT: Peer Study Groups
  // Requires student verification system and matching algorithm
  // {
  //   id: 'peer-study-groups',
  //   title: 'Join Study Groups',
  //   studentDescription: 'Study with verified students in your area',
  //   icon: <UserCheck className="h-6 w-6" />,
  //   status: 'available',
  //   priority: 'helpful',
  //   actionText: 'Find Study Buddies',
  //   actionLink: '/student/study-groups'
  // },
  {
    id: 'quick-question-help',
    title: 'Ask Quick Questions',
    studentDescription: 'Get fast answers to specific questions about careers, subjects, or life - no appointment needed!',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'available',
    priority: 'helpful',
    actionText: 'Ask a Question',
    actionLink: '/student/quick-questions',
    studentValue: 'Immediate answers to specific questions without the pressure of a full counseling session',
    realTalk: 'Text-based Q&A where you ask specific questions and get helpful responses within hours',
    whenToUse: 'When you have specific questions but don\'t need a full counseling session',
    timeNeeded: '2-5 minutes to ask, answers within 4-6 hours',
    studentWorries: [
      'What if my question is stupid?',
      'What if no one responds?',
      'What if other students see my question?',
    ],
    whatHappens: [
      'Type your question (anonymously if you want)',
      'Get expert answers from counselors/mentors',
      'See answers from others with similar questions',
      'Follow up with more questions if needed',
    ],
    successStories: 'Agnes asked "Can I do engineering with C+ in Math?" and got detailed guidance on improvement strategies and alternative paths.',
    connections: [
      'Can lead to counselor sessions if needed',
      'Links to relevant resources and tools',
      'Connects to subject-specific help',
    ],
    cost: 'free',
    availability: {
      timing: 'Ask anytime, answers come during business hours',
      responseTime: '4-6 hours on weekdays, 24 hours on weekends',
    },
  },
  {
    id: 'career-mentorship',
    title: 'Get a Career Mentor',
    studentDescription: 'Connect with professionals working in careers you\'re interested in - get the real inside story!',
    icon: <Compass className="h-6 w-6" />,
    status: 'available',
    priority: 'helpful',
    actionText: 'Find a Mentor',
    actionLink: '/student/mentorship-matching',
    studentValue: 'Real insights from someone actually working in your dream career - know what you\'re getting into',
    realTalk: 'Monthly 30-minute calls with professionals who share their actual work experience, challenges, and advice',
    whenToUse: 'When you want to really understand what a career is like before committing to it',
    timeNeeded: '30 minutes per month, 6-month commitment',
    studentWorries: [
      'What if they\'re too busy for me?',
      'What if I don\'t have good questions to ask?',
      'What if I waste their time?',
    ],
    whatHappens: [
      'Tell us your career interests',
      'Get matched with a working professional',
      'Have monthly video calls to learn and ask questions',
      'Get advice on subjects, skills, and pathways',
      'Build a professional network connection',
    ],
    successStories: 'Peter\'s mentor in software engineering helped him choose the right programming languages to learn and gave him an internship opportunity.',
    connections: [
      'Uses Career Discovery results for matching',
      'Links to Skills Development resources',
      'Can lead to internship opportunities',
    ],
    cost: 'free',
    availability: {
      timing: 'Mentor calls scheduled monthly at mutual convenience',
      responseTime: 'Matching within 1-2 weeks',
    },
  },
  {
    id: 'scholarship-finder',
    title: 'Find Scholarships & Funding',
    studentDescription: 'Discover scholarships you actually qualify for - don\'t let money stop your dreams!',
    icon: <Award className="h-6 w-6" />,
    status: 'available',
    priority: 'essential',
    actionText: 'Search Scholarships',
    actionLink: '/student/scholarship-search',
    studentValue: 'Real scholarship opportunities based on your specific situation, grades, and interests',
    realTalk: 'Personalized list of scholarships you can actually win, with application tips and deadlines',
    whenToUse: 'As soon as you\'re in Form 3 or 4 - many scholarships have early application deadlines',
    timeNeeded: '30 minutes initial search, ongoing applications',
    studentWorries: [
      'What if my grades aren\'t good enough?',
      'What if my family isn\'t poor enough?',
      'What if I don\'t qualify for anything?',
    ],
    whatHappens: [
      'Enter your academic info and family situation',
      'Get personalized list of scholarships you qualify for',
      'Receive application tips and essay guidance',
      'Get deadline reminders and application tracking',
      'Connect with scholarship alumni for tips',
    ],
    successStories: 'James found 8 scholarships he qualified for and won 3, covering his entire university fees plus living expenses.',
    connections: [
      'Links to University Course Finder',
      'Connects to essay writing support',
      'Uses academic performance data',
    ],
    cost: 'free',
    availability: {
      timing: 'Search anytime, applications have specific deadlines',
      responseTime: 'Immediate personalized results',
    },
  },
  {
    id: 'skills-building-resources',
    title: 'Build Job-Ready Skills',
    studentDescription: 'Learn the actual skills employers want - coding, communication, leadership - get ahead of other students!',
    icon: <TrendingUp className="h-6 w-6" />,
    status: 'available',
    priority: 'helpful',
    actionText: 'Start Skill Building',
    actionLink: '/student/skills-development',
    studentValue: 'Practical skills that make you employable and confident in your chosen career',
    realTalk: 'Free online courses, practice projects, and certification opportunities in skills that actually matter for jobs',
    whenToUse: 'Anytime you want to get ahead and build your resume while still in school',
    timeNeeded: '2-5 hours per week, depending on the skill',
    studentWorries: [
      'Will I be able to keep up?',
      'Are these skills really valuable?',
      'What if I don\'t finish the course?',
    ],
    whatHappens: [
      'Take a skills assessment to find gaps',
      'Get personalized learning path recommendations',
      'Access free courses and practice projects',
      'Track your progress and earn certificates',
      'Connect with other students learning the same skills',
    ],
    successStories: 'Linda learned basic coding in Form 4 and got a part-time job building websites while waiting for university admission.',
    connections: [
      'Links to Career Discovery skill requirements',
      'Connects to mentorship programs',
      'Feeds into university application portfolio',
    ],
    cost: 'free',
    availability: {
      timing: 'Self-paced learning available 24/7',
      responseTime: 'Immediate access to courses',
    },
  },
  {
    id: 'instant-counselor-chat',
    title: 'Chat with My Counselor',
    studentDescription: 'Get instant answers from your assigned counselor - like texting a helpful older sibling who knows about careers',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'available',
    priority: 'essential',
    actionText: 'Start Chatting',
    actionLink: '/guidance/chat-counselor',
    studentValue: 'Immediate help without scheduling appointments - get answers when you need them most',
    realTalk: 'Real-time messaging with your counselor when they\'re online - way faster than waiting for email replies or appointments',
    whenToUse: 'When you have quick questions, need clarification, or want immediate support',
    timeNeeded: 'Usually under 5 minutes for quick questions',
    studentWorries: [
      'What if I\'m bothering them?',
      'What if they think my question is stupid?',
      'What if they\'re not online when I need help?',
    ],
    whatHappens: [
      'Click to open instant chat with your counselor',
      'See if they\'re online or when they\'ll be back',
      'Send messages and get real-time responses',
      'Share files or screenshots if needed',
      'Get immediate help or schedule a call if needed',
    ],
    successStories: 'Moses was panicking about KUCCPS deadlines at 8pm. His counselor was online and helped him submit everything in 20 minutes.',
    connections: [
      'Links to session booking if needed',
      'Connects to crisis support for urgent issues',
      'Integrates with your counselor\'s student notes',
    ],
    cost: 'free',
    availability: {
      timing: 'Counselors typically online weekdays 9am-6pm',
      responseTime: 'Usually under 5 minutes when online, 2-4 hours when offline',
    },
  },
  {
    id: 'quick-message-mentor',
    title: 'Message My Mentor',
    studentDescription: 'Direct messaging with your career mentor - get professional insights and career advice anytime you need them',
    icon: <Compass className="h-6 w-6" />,
    status: 'available',
    priority: 'helpful',
    actionText: 'Message Mentor',
    actionLink: '/guidance/chat-mentor',
    studentValue: 'Professional guidance and career insights from someone actually working in your field of interest',
    realTalk: 'Casual messaging with working professionals who share real career experiences and advice',
    whenToUse: 'When you want to understand what a career is really like or need professional advice',
    timeNeeded: '5-10 minutes to send message, responses within 1-2 days',
    studentWorries: [
      'What if I don\'t have interesting questions?',
      'What if they\'re too busy for me?',
      'What if I sound unprofessional?',
    ],
    whatHappens: [
      'Send messages to your matched career mentor',
      'Ask about their work, career path, and industry',
      'Get honest insights about challenges and opportunities',
      'Build a professional relationship over time',
      'Potentially get internship or job opportunities',
    ],
    successStories: 'Grace messaged her software engineer mentor about coding bootcamps vs. university. The conversation led to a summer internship offer.',
    connections: [
      'Uses Career Discovery results for mentor matching',
      'Links to professional networking opportunities',
      'Connects to internship and job opportunities',
    ],
    cost: 'free',
    availability: {
      timing: 'Mentors respond when convenient, usually evenings/weekends',
      responseTime: '1-2 days for thoughtful responses',
    },
  },
  {
    id: 'professional-networking',
    title: 'Build Your Professional Network',
    studentDescription: 'Learn to leverage LinkedIn and professional connections for career growth - like having a professional older sibling network',
    icon: <Linkedin className="h-6 w-6" />,
    status: 'available',
    priority: 'helpful',
    actionText: 'Start Networking',
    actionLink: '/guidance/professional-networking',
    studentValue: 'Connect with industry professionals who can guide your career journey and open doors to opportunities',
    realTalk: 'Networking feels awkward at first, but it\'s how most people find great opportunities - 85% of jobs come through connections',
    whenToUse: 'Start building your network in Form 3-4, not when you need a job',
    timeNeeded: '30 minutes daily for networking activities',
    studentWorries: [
      'What if professionals don\'t want to talk to students?',
      'What if I don\'t have anything interesting to say?',
      'What if I seem desperate or annoying?'
    ],
    whatHappens: [
      'Learn to optimize your LinkedIn profile for students',
      'Get templates for reaching out to professionals',
      'Follow successful Kenya industry leaders',
      'Practice networking skills in low-pressure environments',
      'Build genuine relationships, not just collect contacts',
      'Share your learning journey to attract mentors'
    ],
    successStories: 'Kevin optimized his LinkedIn profile and connected with 50+ tech professionals. Three offered him informational interviews, and one led to a summer internship at a Nairobi startup.',
    connections: [
      'Uses Career Discovery results for networking targeting',
      'Links to mentorship matching system',
      'Connects to professional development resources'
    ],
    cost: 'free',
    availability: {
      timing: 'LinkedIn optimization available 24/7, professional responses vary',
      responseTime: 'Profile tips immediate, professional connections 2-7 days'
    }
  }
];

// Student-specific theme styling with consistent orange theme
const getStatusConfig = (status: string, priority: string) => {
  const baseConfig = {
    'available': { 
      icon: <Play className="h-4 w-4" />,
      badge: 'Ready',
      className: 'bg-orange-50 text-orange-700'
    },
    'active': { 
      icon: <Clock className="h-4 w-4" />,
      badge: 'Using',
      className: 'bg-blue-50 text-blue-700'
    },
    'completed': { 
      icon: <CheckCircle className="h-4 w-4" />,
      badge: 'Done',
      className: 'bg-green-50 text-green-700'
    },
    'urgent': { 
      icon: <Shield className="h-4 w-4" />,
      badge: 'Urgent',
      className: 'bg-red-50 text-red-700'
    },
  };

  const config = baseConfig[status as keyof typeof baseConfig] || baseConfig['available'];
  
  // Add priority styling
  if (priority === 'essential') {
    config.className += ' ring-2 ring-orange-300';
  }
  
  return config;
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'essential':
      return <Badge className="bg-orange-500 text-white text-xs">Essential</Badge>;
    case 'helpful':
      return <Badge className="bg-blue-500 text-white text-xs">Helpful</Badge>;
    default:
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">Optional</Badge>;
  }
};

const getCostBadge = (cost: string) => {
  switch (cost) {
    case 'free':
      return <Badge className="bg-green-500 text-white text-xs">Free</Badge>;
    case 'scholarship':
      return <Badge className="bg-blue-500 text-white text-xs">Scholarship Available</Badge>;
    case 'paid':
      return <Badge className="bg-gray-500 text-white text-xs">Paid</Badge>;
    default:
      return null;
  }
};

interface StudentGuidanceCardsProps {
  className?: string;
  showAll?: boolean;
  maxCards?: number;
}

export const StudentGuidanceCards: React.FC<StudentGuidanceCardsProps> = ({
  className,
  showAll = false,
  maxCards = 6,
}) => {
  const { 
    logActivity, 
    userActivities, 
    careerReadinessScore,
    loading,
    error 
  } = useDynamicDashboard();

  // Transform static cards with dynamic data based on user activity and needs
  const getDynamicGuidanceCards = (): StudentGuidanceCard[] => {
    const baseCards = [...studentGuidanceCards];
    
    // Update status and priority based on user activity and career readiness
    baseCards.forEach(card => {
      switch (card.id) {
        case 'talk-to-counselor':
          // High priority if user has low career readiness or many assessment clicks
          const assessmentClicks = userActivities.filter(a => 
            a.activityType.includes('assessment') || a.activityType.includes('career')
          ).length;
          
          if (careerReadinessScore && careerReadinessScore.overall < 40) {
            card.priority = 'essential';
            card.status = 'urgent';
            card.studentValue = 'Critical guidance needed - your readiness score suggests you need professional support';
          } else if (assessmentClicks > 10) {
            card.priority = 'helpful';
            card.status = 'active';
            card.studentValue = 'Great time to discuss your assessment results with a counselor';
          }
          break;

        case 'quick-question-help':
          const questionActivities = userActivities.filter(a => 
            a.activityType === 'question_asked' || a.activityType === 'quick_help_click'
          );
          
          if (questionActivities.length > 0) {
            card.status = 'active';
            card.studentValue = `You've asked ${questionActivities.length} questions - keep the momentum going!`;
          }
          break;

        case 'career-mentorship':
          const careerExplorationActivities = userActivities.filter(a => 
            a.activityType === 'career_exploration_click' || 
            a.activityType === 'professional_interview_view'
          );
          
          if (careerExplorationActivities.length > 5) {
            card.priority = 'essential';
            card.status = 'available';
            card.studentValue = 'Perfect timing! You\'ve been exploring careers - now connect with real professionals';
          }
          break;


        case 'scholarship-hunter':
          if (careerReadinessScore && careerReadinessScore.breakdown.courseExploration > 60) {
            card.priority = 'helpful';
            card.status = 'available';
            card.studentValue = 'You\'re exploring courses - perfect time to secure funding for your education';
          }
          break;


        case 'job-ready-skills':
          if (careerReadinessScore && careerReadinessScore.breakdown.actionsTaken < 30) {
            card.priority = 'helpful';
            card.status = 'available';
            card.studentValue = 'Boost your action score by developing practical job skills';
          }
          break;

        case 'professional-networking':
          const networkingActivities = userActivities.filter(a => 
            a.activityType === 'linkedin_profile_click' || 
            a.activityType === 'professional_networking_view' ||
            a.activityType === 'mentor_connection_click'
          );
          
          const careerExplorationCount = userActivities.filter(a => 
            a.activityType === 'career_exploration_click'
          ).length;
          
          if (careerExplorationCount > 3 && networkingActivities.length === 0) {
            card.priority = 'essential';
            card.status = 'available';
            card.studentValue = 'Perfect timing! You\'ve explored careers - now connect with real professionals in those fields';
          } else if (networkingActivities.length > 0) {
            card.status = 'active';
            card.studentValue = `Great progress! You've engaged with networking ${networkingActivities.length} times - keep building those connections`;
          }
          
          // Higher priority during university application season
          const currentMonthForApps = new Date().getMonth();
          const isApplicationSeason = currentMonthForApps === 0 || currentMonthForApps === 1 || currentMonthForApps === 11; // Jan-Feb, Dec
          
          if (isApplicationSeason && careerReadinessScore && careerReadinessScore.overall > 50) {
            card.priority = 'essential';
            card.studentValue = 'Application season! Professional connections can provide valuable university and career insights';
          }
          break;

        default:
          break;
      }

      // General priority adjustment based on overall career readiness
      if (careerReadinessScore) {
        if (careerReadinessScore.overall < 30 && card.priority === 'optional') {
          card.priority = 'helpful'; // Upgrade priority for struggling students
        }
        if (careerReadinessScore.overall > 80 && card.priority === 'essential') {
          card.priority = 'helpful'; // Reduce pressure on high-performing students
        }
      }
    });

    // Sort by priority and status for better user experience
    return baseCards.sort((a, b) => {
      const priorityWeight = { 'essential': 3, 'helpful': 2, 'optional': 1 };
      const statusWeight = { 'urgent': 4, 'active': 3, 'available': 2, 'completed': 1 };
      
      const aScore = priorityWeight[a.priority] + statusWeight[a.status];
      const bScore = priorityWeight[b.priority] + statusWeight[b.status];
      
      return bScore - aScore;
    });
  };

  const dynamicCards = getDynamicGuidanceCards();
  const displayCards = showAll ? dynamicCards : dynamicCards.slice(0, maxCards);

  const handleCardClick = (card: StudentGuidanceCard) => {
    logActivity('guidance_card_click', {
      cardId: card.id,
      cardTitle: card.title,
      priority: card.priority,
      status: card.status,
      studentValue: card.studentValue,
      realTalk: card.realTalk,
      careerReadinessScore: careerReadinessScore?.overall || 0,
      totalActivities: userActivities.length
    });
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Student-focused Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Get Support & Guidance
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Real help from real people who understand what you\'re going through - you don\'t have to figure everything out alone
          </p>
        </div>
        {!showAll && studentGuidanceCards.length > maxCards && (
          <Button asChild variant="secondary" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <Link to="/student/guidance">
              See All Support Options
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Support Summary for Students - Moved to Top */}
      <Card className="bg-gradient-to-br from-orange-50/50 via-background to-orange-50/30 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <Heart className="h-5 w-5" />
            </div>
            Your Support Network
          </CardTitle>
          <CardDescription>
            You have access to comprehensive support - never struggle alone
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading your support options...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">
                    {dynamicCards.filter(card => card.cost === 'free').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Free Services</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-red-600">
                    {dynamicCards.filter(card => card.priority === 'essential').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Essential Support</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">
                    {dynamicCards.filter(card => card.status === 'urgent' || card.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active/Urgent</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {userActivities.filter(a => a.activityType.includes('guidance')).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Support Used</div>
                </div>
              </div>

              {/* Dynamic Personalized Message */}
              {careerReadinessScore && (
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-100">
                  <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {careerReadinessScore.overall < 40 
                      ? 'Priority Support Recommended' 
                      : careerReadinessScore.overall > 70 
                      ? 'Great Progress - Consider Advanced Support' 
                      : 'Support Available When Needed'
                    }
                  </h4>
                  <p className="text-sm text-orange-700">
                    {careerReadinessScore.overall < 40 
                      ? 'Your readiness score suggests you could benefit from counselor support. Don\'t hesitate to reach out - it shows strength, not weakness.'
                      : careerReadinessScore.overall > 70 
                      ? 'You\'re doing well! Consider mentorship or parent conversation guides to take your progress to the next level.'
                      : 'You\'re making progress. Support services are here whenever you need guidance or have questions.'
                    }
                  </p>
                </div>
              )}

              {/* Seasonal/Contextual Messages */}
              {(() => {
                const currentMonth = new Date().getMonth();
                const isExamPeriod = currentMonth === 10 || currentMonth === 11; // Nov-Dec
                const isApplicationPeriod = currentMonth === 0 || currentMonth === 1; // Jan-Feb
                
                if (isExamPeriod) {
                  return (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Exam Period Support
                      </h4>
                      <p className="text-sm text-red-700">
                        Extra support available during exam season. Crisis support is prioritized and counselors have extended hours.
                      </p>
                    </div>
                  );
                } else if (isApplicationPeriod) {
                  return (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        University Application Support
                      </h4>
                      <p className="text-sm text-blue-700">
                        Application season is here! Counselors and mentors are available for application guidance and scholarship hunting.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    Unable to load personalized support data. All support services remain available.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Student Guidance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCards.map((card) => {
          const statusConfig = getStatusConfig(card.status, card.priority);
          
          return (
            <Card
              key={card.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 cursor-pointer",
                "bg-gradient-to-br from-white via-white to-orange-50/20 border-orange-100",
                card.priority === 'essential' && "ring-2 ring-orange-300 shadow-lg",
                card.status === 'urgent' && "ring-2 ring-red-300 shadow-lg shadow-red-500/10"
              )}
            >
              {/* Priority Indicator */}
              {card.priority === 'essential' && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-orange-500">
                  <Star className="absolute -top-6 -right-5 h-3 w-3 text-white" />
                </div>
              )}
              
              {/* Urgent Indicator */}
              {card.status === 'urgent' && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-red-500">
                  <Shield className="absolute -top-6 -right-5 h-3 w-3 text-white" />
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
                      <div className="flex items-center gap-2 flex-wrap">
                        {getPriorityBadge(card.priority)}
                        {card.cost && getCostBadge(card.cost)}
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
                  {card.studentDescription}
                </CardDescription>

                {/* Student Value */}
                <div className="p-3 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                  <h4 className="font-medium text-sm text-orange-800 mb-1">What You Get:</h4>
                  <p className="text-sm text-orange-700">{card.studentValue}</p>
                </div>

                {/* Real Talk */}
                <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-medium text-sm text-blue-800 mb-1">Real Talk:</h4>
                  <p className="text-sm text-blue-700">{card.realTalk}</p>
                </div>

                {/* Time & Availability */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{card.timeNeeded}</span>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {card.availability.responseTime}
                  </div>
                </div>

                {/* Success Story (if available) */}
                {card.successStories && (
                  <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-400">
                    <h4 className="font-medium text-sm text-green-800 mb-1">Success Story:</h4>
                    <p className="text-xs text-green-700 italic">{card.successStories}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4">
                <Button 
                  asChild
                  className={cn(
                    "w-full gap-2 transition-all duration-200",
                    card.priority === 'essential' 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white" 
                      : card.status === 'urgent'
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white"
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

export default StudentGuidanceCards;