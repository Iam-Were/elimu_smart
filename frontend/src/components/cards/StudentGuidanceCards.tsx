import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    id: 'crisis-support',
    title: 'Emergency Support',
    studentDescription: 'Immediate help when you\'re really struggling - depression, family issues, academic pressure, or just need someone NOW',
    icon: <Shield className="h-6 w-6" />,
    status: 'available',
    priority: 'essential',
    actionText: 'Get Help Now',
    actionLink: '/student/crisis-support',
    studentValue: 'Immediate professional support when life gets overwhelming - you don\'t have to handle everything alone',
    realTalk: 'Confidential crisis counseling available 24/7 for serious situations - depression, anxiety, family problems, academic overwhelm',
    whenToUse: 'When you\'re having thoughts of self-harm, severe depression, panic attacks, or feeling completely overwhelmed',
    timeNeeded: 'Immediate response, sessions as long as needed',
    studentWorries: [
      'What if someone finds out?',
      'What if they call my parents?',
      'What if I\'m not "bad enough" for help?',
    ],
    whatHappens: [
      'Click for immediate chat or call support',
      'Talk to a trained crisis counselor',
      'Get immediate emotional support and safety planning',
      'Connect with ongoing support resources',
      'Complete confidentiality (except for safety concerns)',
    ],
    successStories: 'Anonymous student: "I was planning to hurt myself but the crisis counselor helped me see other options. I\'m still here and doing better."',
    connections: [
      'Links to ongoing mental health support',
      'Connects to family counseling resources',
      'Can arrange academic accommodations',
    ],
    cost: 'free',
    availability: {
      timing: '24/7 availability',
      responseTime: 'Immediate - under 2 minutes',
    },
  },
  {
    id: 'parent-conversation-help',
    title: 'Navigate Parent Conversations',
    studentDescription: 'Get help talking to your parents about your career choices - especially when they have different ideas!',
    icon: <Heart className="h-6 w-6" />,
    status: 'available',
    priority: 'essential',
    actionText: 'Get Conversation Tips',
    actionLink: '/student/parent-conversations',
    studentValue: 'Scripts, strategies, and support for those difficult career conversations with family',
    realTalk: 'Practical help for when your parents want you to be a doctor/lawyer but you want something else',
    whenToUse: 'When your parents disagree with your career choice or you need to convince them of your path',
    timeNeeded: '15-20 minutes to learn strategies, ongoing practice',
    studentWorries: [
      'What if they get angry?',
      'What if they stop supporting me financially?',
      'What if I disappoint them?',
    ],
    whatHappens: [
      'Learn effective communication strategies',
      'Get specific scripts for common situations',
      'Practice conversations with a counselor',
      'Learn to present your career choice convincingly',
      'Get backup plans if things don\'t go well',
    ],
    successStories: 'Mary\'s parents insisted on medicine, but using our conversation guide, she convinced them that computer science was also prestigious and profitable.',
    connections: [
      'Uses Career Discovery results as evidence',
      'Links to career salary and job market data',
      'Connects to family counseling if needed',
    ],
    cost: 'free',
    availability: {
      timing: 'Resources available 24/7, counselor support weekdays',
      responseTime: 'Immediate access to guides, counselor within 24 hours',
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
  const { logActivity } = useDynamicDashboard();
  const displayCards = showAll ? studentGuidanceCards : studentGuidanceCards.slice(0, maxCards);

  const handleCardClick = (card: any) => {
    logActivity('guidance_card_click', {
      cardId: card.id,
      cardTitle: card.title,
      priority: card.priority,
      status: card.status,
      studentBenefit: card.studentBenefit,
      realTalk: card.realTalk
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
          <Button asChild variant="outline" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                {studentGuidanceCards.filter(card => card.cost === 'free').length}
              </div>
              <div className="text-sm text-muted-foreground">Free Services</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-red-600">
                {studentGuidanceCards.filter(card => card.priority === 'essential').length}
              </div>
              <div className="text-sm text-muted-foreground">Essential Support</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-muted-foreground">Crisis Support</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-muted-foreground">Confidential</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Remember:</h4>
            <p className="text-sm text-orange-700">
              Every successful person had help along the way. Using these support services isn't weakness - it's wisdom. 
              You're not bothering anyone; helping students is literally what we're here for.
            </p>
          </div>
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