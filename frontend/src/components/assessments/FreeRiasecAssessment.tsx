import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Save,
  Brain,
  Wrench,
  Microscope,
  Palette,
  Users,
  TrendingUp,
  Calculator,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Trophy,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { getRiasecQuestions } from '@/lib/assessmentApi';

// IIP RIASEC Markers - Free for non-commercial use
// Citation: Armstrong, P. I., Allison, W., & Rounds, J. (2008). 
// Development and initial validation of brief public domain RIASEC marker scales. 
// Journal of Vocational Behavior, 73, 287-299.

interface RiasecType {
  code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  kenyaCareers: string[];
  characteristics: string[];
  workEnvironments: string[];
  kuccpsPathways: string[];
}

const riasecTypes: Record<string, RiasecType> = {
  R: {
    code: 'R',
    name: 'Realistic (Doers)',
    description: 'Prefer hands-on, practical work with tools, machines, or in outdoor settings',
    icon: <Wrench className="h-6 w-6" />,
    color: 'bg-green-500',
    characteristics: [
      'Practical and down-to-earth',
      'Good with hands and tools',
      'Prefer concrete rather than abstract problems',
      'Like to work outdoors or with machines'
    ],
    workEnvironments: [
      'Workshops and laboratories',
      'Outdoor settings',
      'Construction sites',
      'Technical environments'
    ],
    kenyaCareers: [
      'Mechanical Engineer',
      'Agricultural Extension Officer',
      'Building & Construction Technician',
      'Automotive Mechanic',
      'Surveyor',
      'Electrician',
      'Plumber',
      'Pilot',
      'Veterinarian'
    ],
    kuccpsPathways: [
      'Engineering Courses',
      'Agriculture & Veterinary Sciences',
      'Built Environment',
      'Technical & Vocational Training'
    ]
  },
  I: {
    code: 'I',
    name: 'Investigative (Thinkers)',
    description: 'Enjoy research, analysis, and solving complex problems through thinking',
    icon: <Microscope className="h-6 w-6" />,
    color: 'bg-blue-500',
    characteristics: [
      'Analytical and logical',
      'Enjoy research and investigation',
      'Like solving complex problems',
      'Prefer working with ideas and theories'
    ],
    workEnvironments: [
      'Laboratories and research centers',
      'Universities and libraries',
      'Medical facilities',
      'Technology companies'
    ],
    kenyaCareers: [
      'Medical Doctor',
      'Research Scientist',
      'Data Analyst',
      'Software Developer',
      'Pharmacist',
      'Laboratory Technologist',
      'Actuary',
      'Economist',
      'Psychologist'
    ],
    kuccpsPathways: [
      'Medicine & Health Sciences',
      'Pure & Applied Sciences',
      'Information Technology',
      'Social Sciences'
    ]
  },
  A: {
    code: 'A',
    name: 'Artistic (Creators)',
    description: 'Express creativity through art, music, writing, or innovative design',
    icon: <Palette className="h-6 w-6" />,
    color: 'bg-purple-500',
    characteristics: [
      'Creative and imaginative',
      'Express themselves through art',
      'Value beauty and aesthetics',
      'Independent and original thinkers'
    ],
    workEnvironments: [
      'Studios and galleries',
      'Media houses',
      'Design agencies',
      'Cultural institutions'
    ],
    kenyaCareers: [
      'Graphic Designer',
      'Journalist',
      'Architect',
      'Fashion Designer',
      'Musician',
      'Film Producer',
      'Interior Designer',
      'Advertising Creative',
      'Art Teacher'
    ],
    kuccpsPathways: [
      'Creative Arts & Design',
      'Communication & Media',
      'Architecture & Planning',
      'Education (Arts)'
    ]
  },
  S: {
    code: 'S',
    name: 'Social (Helpers)',
    description: 'Focused on helping, teaching, and working with people to solve problems',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-orange-500',
    characteristics: [
      'Caring and helpful',
      'Good communication skills',
      'Enjoy working with people',
      'Want to make a difference in others\' lives'
    ],
    workEnvironments: [
      'Schools and hospitals',
      'Community centers',
      'Government offices',
      'Non-profit organizations'
    ],
    kenyaCareers: [
      'Teacher',
      'Nurse',
      'Social Worker',
      'Counseling Psychologist',
      'Human Resource Manager',
      'Community Development Officer',
      'Public Health Officer',
      'Lawyer',
      'Customer Service Manager'
    ],
    kuccpsPathways: [
      'Education',
      'Health Sciences',
      'Social Sciences',
      'Law',
      'Public Administration'
    ]
  },
  E: {
    code: 'E',
    name: 'Enterprising (Persuaders)',
    description: 'Leadership-oriented, enjoy persuading others and managing business ventures',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-red-500',
    characteristics: [
      'Ambitious and energetic',
      'Good leadership skills',
      'Enjoy taking risks',
      'Like to persuade and influence others'
    ],
    workEnvironments: [
      'Corporate offices',
      'Sales environments',
      'Government institutions',
      'Entrepreneurial settings'
    ],
    kenyaCareers: [
      'Business Manager',
      'Sales Representative',
      'Entrepreneur',
      'Politician',
      'Marketing Manager',
      'Bank Manager',
      'Real Estate Agent',
      'Project Manager',
      'Investment Banker'
    ],
    kuccpsPathways: [
      'Business & Management',
      'Commerce',
      'Economics',
      'Public Administration',
      'Communication'
    ]
  },
  C: {
    code: 'C',
    name: 'Conventional (Organizers)',
    description: 'Prefer structured, orderly work with clear procedures and attention to detail',
    icon: <Calculator className="h-6 w-6" />,
    color: 'bg-indigo-500',
    characteristics: [
      'Organized and detail-oriented',
      'Like clear procedures and structure',
      'Good with numbers and data',
      'Reliable and efficient'
    ],
    workEnvironments: [
      'Offices and banks',
      'Government departments',
      'Accounting firms',
      'Administrative settings'
    ],
    kenyaCareers: [
      'Accountant',
      'Banker',
      'Secretary',
      'Auditor',
      'Administrative Assistant',
      'Insurance Underwriter',
      'Tax Consultant',
      'Records Manager',
      'Financial Analyst'
    ],
    kuccpsPathways: [
      'Accounting & Finance',
      'Business Administration',
      'Economics',
      'Public Administration',
      'Information Management'
    ]
  }
};

// IIP RIASEC Markers Questions (Free for non-commercial use)
interface RiasecQuestion {
  id: number;
  category: 'activities' | 'occupations';
  statement: string;
  riasecType: keyof typeof riasecTypes;
  kenyaContext?: string;
}

const iipRiasecQuestions: RiasecQuestion[] = [
  // REALISTIC Activities
  { id: 1, category: 'activities', statement: 'Test the quality of parts before shipment', riasecType: 'R', kenyaContext: 'Quality control in Kenya manufacturing' },
  { id: 2, category: 'activities', statement: 'Lay brick or tile for building construction', riasecType: 'R', kenyaContext: 'Construction boom in Nairobi and major towns' },
  { id: 3, category: 'activities', statement: 'Work in geothermal or renewable energy installations', riasecType: 'R', kenyaContext: 'Olkaria geothermal project and solar farms' },
  { id: 4, category: 'activities', statement: 'Assemble or repair mobile phones and electronics', riasecType: 'R', kenyaContext: 'Growing tech repair sector in Kenya' },
  { id: 5, category: 'activities', statement: 'Drive a matatu, truck, or delivery vehicle', riasecType: 'R', kenyaContext: 'Transport and logistics sector' },
  { id: 6, category: 'activities', statement: 'Repair household appliances and electronics', riasecType: 'R', kenyaContext: 'Jua Kali technicians in high demand' },
  { id: 7, category: 'activities', statement: 'Manage fish farming or aquaculture operations', riasecType: 'R', kenyaContext: 'Growing aquaculture in Lake Victoria region' },
  { id: 8, category: 'activities', statement: 'Build furniture or kitchen cabinets', riasecType: 'R', kenyaContext: 'Carpentry is a well-established trade' },

  // REALISTIC Occupations
  { id: 9, category: 'occupations', statement: 'Mechanical Engineer', riasecType: 'R', kenyaContext: 'High demand in manufacturing and construction' },
  { id: 10, category: 'occupations', statement: 'Matatu Owner/Operator or Transport Manager', riasecType: 'R', kenyaContext: 'Profitable business in Kenya transport sector' },
  { id: 11, category: 'occupations', statement: 'Aircraft Mechanic', riasecType: 'R', kenyaContext: 'JKIA and Wilson Airport opportunities' },
  { id: 12, category: 'occupations', statement: 'Carpenter or Furniture Maker', riasecType: 'R', kenyaContext: 'Thriving furniture industry' },
  { id: 13, category: 'occupations', statement: 'Auto Mechanic', riasecType: 'R', kenyaContext: 'Essential trade with steady income' },
  { id: 14, category: 'occupations', statement: 'Commercial Airline Pilot', riasecType: 'R', kenyaContext: 'Kenya Airways and regional airlines' },
  { id: 15, category: 'occupations', statement: 'Electrician', riasecType: 'R', kenyaContext: 'High demand with KPLC projects' },
  { id: 16, category: 'occupations', statement: 'Commercial Farmer or Agribusiness Manager', riasecType: 'R', kenyaContext: 'Modern agriculture is highly profitable' },

  // INVESTIGATIVE Activities
  { id: 17, category: 'activities', statement: 'Study ways to reduce water pollution in rivers and lakes', riasecType: 'I', kenyaContext: 'Important for Lake Victoria and Nairobi River' },
  { id: 18, category: 'activities', statement: 'Develop new medicines or medical treatments', riasecType: 'I', kenyaContext: 'KEMRI research opportunities' },
  { id: 19, category: 'activities', statement: 'Plan and conduct research studies', riasecType: 'I', kenyaContext: 'Universities and research institutions' },
  { id: 20, category: 'activities', statement: 'Study Kenyan history and archaeological sites', riasecType: 'I', kenyaContext: 'National Museums of Kenya' },
  { id: 21, category: 'activities', statement: 'Study animal behavior in national parks', riasecType: 'I', kenyaContext: 'Wildlife conservation research' },
  { id: 22, category: 'activities', statement: 'Do research on plants, crops, or wildlife', riasecType: 'I', kenyaContext: 'Agricultural and conservation research' },
  { id: 23, category: 'activities', statement: 'Do laboratory tests to identify diseases', riasecType: 'I', kenyaContext: 'KNH, KEMRI, and hospital labs' },
  { id: 24, category: 'activities', statement: 'Study weather patterns and climate change', riasecType: 'I', kenyaContext: 'Kenya Meteorological Department' },

  // INVESTIGATIVE Occupations
  { id: 25, category: 'occupations', statement: 'Psychologist or Mental Health Counselor', riasecType: 'I', kenyaContext: 'Growing mental health awareness' },
  { id: 26, category: 'occupations', statement: 'Research Scientist at KEMRI or Universities', riasecType: 'I', kenyaContext: 'Medical and agricultural research' },
  { id: 27, category: 'occupations', statement: 'Medical Doctor', riasecType: 'I', kenyaContext: 'High demand, competitive KUCCPS cutoff ~10.5 pts' },
  { id: 28, category: 'occupations', statement: 'Data Analyst or Data Scientist', riasecType: 'I', kenyaContext: 'Booming tech sector in Nairobi' },
  { id: 29, category: 'occupations', statement: 'Chemist or Pharmaceutical Researcher', riasecType: 'I', kenyaContext: 'Pharmaceutical industry growing' },
  { id: 30, category: 'occupations', statement: 'Mathematician or Statistician', riasecType: 'I', kenyaContext: 'KNBS and research institutions' },
  { id: 31, category: 'occupations', statement: 'Biologist or Environmental Scientist', riasecType: 'I', kenyaContext: 'Conservation and environmental projects' },
  { id: 32, category: 'occupations', statement: 'IT Systems Analyst or Software Developer', riasecType: 'I', kenyaContext: 'Silicon Savannah tech hub' },

  // ARTISTIC Activities
  { id: 33, category: 'activities', statement: 'Conduct a musical choir', riasecType: 'A' },
  { id: 34, category: 'activities', statement: 'Direct a play', riasecType: 'A' },
  { id: 35, category: 'activities', statement: 'Design artwork for magazines', riasecType: 'A' },
  { id: 36, category: 'activities', statement: 'Write a song', riasecType: 'A' },
  { id: 37, category: 'activities', statement: 'Write books or plays', riasecType: 'A' },
  { id: 38, category: 'activities', statement: 'Play a musical instrument', riasecType: 'A' },
  { id: 39, category: 'activities', statement: 'Perform stunts for a movie or television show', riasecType: 'A' },
  { id: 40, category: 'activities', statement: 'Create special effects for movies', riasecType: 'A' },

  // ARTISTIC Occupations
  { id: 41, category: 'occupations', statement: 'Poet or Creative Writer', riasecType: 'A', kenyaContext: 'Kenyan literature and poetry scene' },
  { id: 42, category: 'occupations', statement: 'Actor or Film Producer', riasecType: 'A', kenyaContext: 'Riverwood and theatre industry' },
  { id: 43, category: 'occupations', statement: 'Musician or Music Producer', riasecType: 'A', kenyaContext: 'Vibrant Kenyan music industry' },
  { id: 44, category: 'occupations', statement: 'Film Editor or Video Content Creator', riasecType: 'A', kenyaContext: 'YouTube and Riverwood opportunities' },
  { id: 45, category: 'occupations', statement: 'Artist or Visual Designer', riasecType: 'A', kenyaContext: 'Growing arts scene in Nairobi' },
  { id: 46, category: 'occupations', statement: 'Singer or Performer', riasecType: 'A', kenyaContext: 'Gospel and secular music markets' },
  { id: 47, category: 'occupations', statement: 'Graphic Designer or UI/UX Designer', riasecType: 'A', kenyaContext: 'Tech startups need designers' },
  { id: 48, category: 'occupations', statement: 'Journalist or Media Personality', riasecType: 'A', kenyaContext: 'Nation, Standard, Citizen TV opportunities' },

  // SOCIAL Activities
  { id: 49, category: 'activities', statement: 'Give career guidance to people', riasecType: 'S' },
  { id: 50, category: 'activities', statement: 'Do volunteer work at a non-profit organization', riasecType: 'S' },
  { id: 51, category: 'activities', statement: 'Help people who have problems with drugs or alcohol', riasecType: 'S' },
  { id: 52, category: 'activities', statement: 'Teach children how to read', riasecType: 'S' },
  { id: 53, category: 'activities', statement: 'Work with mentally disabled children', riasecType: 'S' },
  { id: 54, category: 'activities', statement: 'Teach an individual an exercise routine', riasecType: 'S' },
  { id: 55, category: 'activities', statement: 'Help people with family-related problems', riasecType: 'S' },
  { id: 56, category: 'activities', statement: 'Supervise the activities of children at a camp', riasecType: 'S' },

  // SOCIAL Occupations
  { id: 57, category: 'occupations', statement: 'Social Worker', riasecType: 'S' },
  { id: 58, category: 'occupations', statement: 'Marriage Counselor', riasecType: 'S' },
  { id: 59, category: 'occupations', statement: 'Teacher', riasecType: 'S' },
  { id: 60, category: 'occupations', statement: 'Clinical Psychologist', riasecType: 'S' },
  { id: 61, category: 'occupations', statement: 'Counselor', riasecType: 'S' },
  { id: 62, category: 'occupations', statement: 'Social Science Teacher', riasecType: 'S' },
  { id: 63, category: 'occupations', statement: 'Speech Therapist', riasecType: 'S' },
  { id: 64, category: 'occupations', statement: 'Nurse', riasecType: 'S' },

  // ENTERPRISING Activities
  { id: 65, category: 'activities', statement: 'Buy and sell land', riasecType: 'E' },
  { id: 66, category: 'activities', statement: 'Manage a retail store', riasecType: 'E' },
  { id: 67, category: 'activities', statement: 'Operate a beauty salon or barber shop', riasecType: 'E' },
  { id: 68, category: 'activities', statement: 'Manage a department within a large company', riasecType: 'E' },
  { id: 69, category: 'activities', statement: 'Start your own business', riasecType: 'E' },
  { id: 70, category: 'activities', statement: 'Negotiate business contracts', riasecType: 'E' },
  { id: 71, category: 'activities', statement: 'Represent a client in a lawsuit', riasecType: 'E' },
  { id: 72, category: 'activities', statement: 'Market a new line of clothing', riasecType: 'E' },

  // ENTERPRISING Occupations
  { id: 73, category: 'occupations', statement: 'Business Executive', riasecType: 'E' },
  { id: 74, category: 'occupations', statement: 'Television Producer', riasecType: 'E' },
  { id: 75, category: 'occupations', statement: 'Sports Promoter', riasecType: 'E' },
  { id: 76, category: 'occupations', statement: 'Business Owner', riasecType: 'E' },
  { id: 77, category: 'occupations', statement: 'Sales Manager', riasecType: 'E' },
  { id: 78, category: 'occupations', statement: 'Marketing Director', riasecType: 'E' },
  { id: 79, category: 'occupations', statement: 'Lawyer', riasecType: 'E' },
  { id: 80, category: 'occupations', statement: 'Political Campaign Manager', riasecType: 'E' },

  // CONVENTIONAL Activities
  { id: 81, category: 'activities', statement: 'Create Excel spreadsheets for financial analysis', riasecType: 'C', kenyaContext: 'Essential skill for business and accounting' },
  { id: 82, category: 'activities', statement: 'Review and proofread official documents', riasecType: 'C', kenyaContext: 'Quality assurance in offices' },
  { id: 83, category: 'activities', statement: 'Use accounting software like QuickBooks or Sage', riasecType: 'C', kenyaContext: 'Standard in Kenyan businesses' },
  { id: 84, category: 'activities', statement: 'Maintain employee records and HR databases', riasecType: 'C', kenyaContext: 'HR departments in companies' },
  { id: 85, category: 'activities', statement: 'Analyze data and create statistical reports', riasecType: 'C', kenyaContext: 'Data analysis for decision-making' },
  { id: 86, category: 'activities', statement: 'Manage financial records and reconciliations', riasecType: 'C', kenyaContext: 'Banking and accounting work' },
  { id: 87, category: 'activities', statement: 'Process customer M-Pesa or bank transactions', riasecType: 'C', kenyaContext: 'Mobile money and banking services' },
  { id: 88, category: 'activities', statement: 'Track inventory and supply chain records', riasecType: 'C', kenyaContext: 'Logistics and retail management' },

  // CONVENTIONAL Occupations
  { id: 89, category: 'occupations', statement: 'Accountant (CPA-K)', riasecType: 'C', kenyaContext: 'High demand, salary KSh 50K-200K' },
  { id: 90, category: 'occupations', statement: 'Payroll or HR Administrator', riasecType: 'C', kenyaContext: 'Essential in all companies' },
  { id: 91, category: 'occupations', statement: 'Executive Assistant or Office Manager', riasecType: 'C', kenyaContext: 'Professional administrative roles' },
  { id: 92, category: 'occupations', statement: 'Budget Analyst or Financial Planner', riasecType: 'C', kenyaContext: 'Government and corporate sectors' },
  { id: 93, category: 'occupations', statement: 'Accounts Clerk or Bookkeeper', riasecType: 'C', kenyaContext: 'Entry-level accounting positions' },
  { id: 94, category: 'occupations', statement: 'Bank Manager or Loan Officer', riasecType: 'C', kenyaContext: 'Banking sector opportunities' },
  { id: 95, category: 'occupations', statement: 'Credit Manager or Risk Analyst', riasecType: 'C', kenyaContext: 'Financial services sector' },
  { id: 96, category: 'occupations', statement: 'Retail or Supermarket Manager', riasecType: 'C', kenyaContext: 'Naivas, Carrefour, Quickmart chains' }
];

interface RiasecScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

interface RiasecResults {
  scores: RiasecScores;
  hollandCode: string;
  primaryType: keyof typeof riasecTypes;
  careerMatches: Array<{
    career: string;
    compatibility: number;
    kuccpsPathway: string;
    reasonsForMatch: string[];
  }>;
  developmentAreas: string[];
  nextSteps: string[];
}

// Interleave questions across R/I/A/S/E/C dimensions to prevent pattern gaming
const interleaveQuestions = (questions: RiasecQuestion[]): RiasecQuestion[] => {
  // Group questions by RIASEC type
  const grouped: Record<string, RiasecQuestion[]> = {
    R: [],
    I: [],
    A: [],
    S: [],
    E: [],
    C: []
  };

  questions.forEach(q => grouped[q.riasecType].push(q));

  // Interleave questions (R, I, A, S, E, C, R, I, A, ...)
  const interleaved: RiasecQuestion[] = [];
  const types: (keyof typeof riasecTypes)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  const maxPerType = Math.max(...Object.values(grouped).map(arr => arr.length));

  for (let i = 0; i < maxPerType; i++) {
    for (const type of types) {
      if (grouped[type][i]) {
        interleaved.push(grouped[type][i]);
      }
    }
  }

  return interleaved;
};

export const FreeRiasecAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { logActivity } = useDynamicDashboard();
  const [questions, setQuestions] = useState<RiasecQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [results, setResults] = useState<RiasecResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneNumber, setMilestoneNumber] = useState(0);

  // Load questions from API on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const apiQuestions = await getRiasecQuestions();
        const interleavedQuestions = interleaveQuestions(apiQuestions as RiasecQuestion[]);
        setQuestions(interleavedQuestions);
        setError(null);
      } catch (err) {
        console.error('Failed to load RIASEC questions:', err);
        setError('Failed to load assessment questions. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  // Milestone checkpoints: every 16 questions (at 16, 32, 48, 64, 80)
  const getMilestone = (questionNum: number) => {
    if (questionNum === 16) return 1;
    if (questionNum === 32) return 2;
    if (questionNum === 48) return 3;
    if (questionNum === 64) return 4;
    if (questionNum === 80) return 5;
    return 0;
  };

  const startAssessment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    console.log('Starting assessment...');
    console.log('Auth token available:', !!localStorage.getItem('elimu-auth-token'));

    try {
      // Try to start assessment on backend
      const response = await fetch('http://localhost:1337/parse/functions/startRiasecAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({})
      });

      console.log('Start assessment response status:', response.status);
      const data = await response.json();
      console.log('Start assessment response data:', data);

      if (data.result) {
        setAssessmentId(data.result.id);
        console.log('Assessment started with backend:', data.result.id);
      } else {
        console.log('No result in response, falling back to local');
        setAssessmentId(`local-${Date.now()}`);
      }
    } catch (error) {
      console.warn('Backend assessment start failed, continuing with local assessment:', error);
      // Generate local assessment ID
      setAssessmentId(`local-${Date.now()}`);
    }

    // Always log activity (works locally and with backend)
    try {
      logActivity('free_riasec_assessment_started', {
        assessmentId: assessmentId || 'local-assessment',
        totalQuestions,
        version: 'IIP_RIASEC_Markers',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log assessment start:', error);
    }

    setIsLoading(false);
  }, [logActivity, totalQuestions, assessmentId]);

  useEffect(() => {
    startAssessment();
  }, [startAssessment]);

  const handleResponse = async (questionId: number, response: number) => {
    const newResponses = { ...responses, [questionId]: response };
    setResponses(newResponses);

    // Always log activity locally first (non-blocking)
    try {
      logActivity('riasec_question_answered', {
        assessmentId: assessmentId || 'local-assessment',
        questionId,
        response,
        questionNumber: currentQuestion + 1,
        category: questions[currentQuestion]?.category || 'activities',
        riasecType: questions[currentQuestion]?.riasecType || 'R'
      });
    } catch (error) {
      console.warn('Failed to log activity locally:', error);
    }

    // Try to save to backend but don't block UI
    if (assessmentId) {
      try {
        await fetch('http://localhost:1337/parse/functions/saveRiasecResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': 'elimu-smart-local-dev',
            'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
          },
          body: JSON.stringify({
            assessmentId,
            questionId,
            response,
            questionNumber: currentQuestion + 1,
            category: questions[currentQuestion]?.category || 'activities',
            riasecType: questions[currentQuestion]?.riasecType || 'R'
          })
        });
      } catch (error) {
        console.warn('Failed to save response to backend (continuing locally):', error);
      }
    }

    // Always advance to next question (non-blocking)
    if (currentQuestion < totalQuestions - 1) {
      const nextQuestionNum = currentQuestion + 2; // +2 because currentQuestion is 0-indexed but we display 1-indexed
      const milestone = getMilestone(nextQuestionNum);

      if (milestone > 0) {
        // Show milestone celebration
        setMilestoneNumber(milestone);
        setShowMilestone(true);
        setTimeout(() => {
          setShowMilestone(false);
          setCurrentQuestion(prev => prev + 1);
        }, 2500); // Show celebration for 2.5 seconds
      } else {
        setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
      }
    } else {
      // Assessment complete - try backend first, fallback to local
      if (assessmentId) {
        try {
          await completeAssessment();
        } catch (error) {
          console.warn('Backend completion failed, using local calculation:', error);
          calculateResults(newResponses);
        }
      } else {
        calculateResults(newResponses);
      }
    }
  };

  const completeAssessment = async () => {
    if (!assessmentId) return;

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:1337/parse/functions/calculateRiasecScores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
          responses,
          assessmentId
        })
      });
      
      const data = await response.json();
      
      if (data.result) {
        const backendResults = data.result;
        
        // Transform backend results to match frontend interface
        const results: RiasecResults = {
          scores: backendResults.scores,
          hollandCode: backendResults.hollandCode,
          primaryType: backendResults.primaryType,
          careerMatches: backendResults.careerMatches,
          developmentAreas: backendResults.developmentAreas,
          nextSteps: backendResults.nextSteps
        };

        setResults(results);
        setShowResults(true);

        // Log assessment completion
        logActivity('free_riasec_assessment_completed', {
          assessmentId,
          hollandCode: results.hollandCode,
          primaryType: results.primaryType,
          scores: results.scores,
          careerMatchesCount: results.careerMatches.length,
          source: 'Parse_Server_Backend',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to complete assessment on backend:', error);
      // Fallback to local calculation
      calculateResults(responses);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateResults = (finalResponses: Record<number, number>) => {
    // Fallback local calculation when backend is unavailable
    const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    iipRiasecQuestions.forEach(question => {
      const response = finalResponses[question.id];
      if (response !== undefined) {
        const type = question.riasecType as keyof RiasecScores;
        scores[type] += response;
      }
    });

    // Normalize scores to 0-100 scale (IIP scores range 0-32 per type)
    const riasecKeys: (keyof RiasecScores)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
    riasecKeys.forEach(type => {
      const typeQuestions = iipRiasecQuestions.filter(q => q.riasecType === type);
      const maxScore = typeQuestions.length * 4; // 4 = max response value
      scores[type] = Math.round((scores[type] / maxScore) * 100);
    });

    // Determine Holland Code (top 3 types)
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
    
    const hollandCode = sortedTypes.join('');
    const primaryType = sortedTypes[0] as keyof typeof riasecTypes;

    // Generate career matches
    const careerMatches = generateCareerMatches(scores, primaryType);

    const results: RiasecResults = {
      scores,
      hollandCode,
      primaryType,
      careerMatches,
      developmentAreas: generateDevelopmentAreas(scores),
      nextSteps: generateNextSteps(primaryType)
    };

    setResults(results);
    setShowResults(true);

    // Log assessment completion
    logActivity('free_riasec_assessment_completed', {
      assessmentId: assessmentId || 'local_fallback',
      hollandCode,
      primaryType,
      scores,
      careerMatchesCount: careerMatches.length,
      source: 'Local_Fallback',
      timestamp: new Date().toISOString()
    });
  };

  const generateCareerMatches = (scores: RiasecScores, primaryType: keyof typeof riasecTypes): Array<{
    career: string;
    compatibility: number;
    kuccpsPathway: string;
    reasonsForMatch: string[];
  }> => {
    const matches: Array<{
      career: string;
      compatibility: number;
      kuccpsPathway: string;
      reasonsForMatch: string[];
    }> = [];
    const primaryCareers = riasecTypes[primaryType].kenyaCareers;
    
    // Add primary type careers with high compatibility
    primaryCareers.slice(0, 5).forEach(career => {
      matches.push({
        career,
        compatibility: 85 + Math.random() * 15,
        kuccpsPathway: riasecTypes[primaryType].kuccpsPathways[0],
        reasonsForMatch: [
          `Strong ${riasecTypes[primaryType].name} personality fit`,
          'High demand in Kenya job market',
          'Good KUCCPS pathway availability'
        ]
      });
    });

    // Add secondary type careers
    const secondaryType = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[1][0] as keyof typeof riasecTypes;
    
    riasecTypes[secondaryType].kenyaCareers.slice(0, 3).forEach(career => {
      matches.push({
        career,
        compatibility: 70 + Math.random() * 15,
        kuccpsPathway: riasecTypes[secondaryType].kuccpsPathways[0],
        reasonsForMatch: [
          `Good ${riasecTypes[secondaryType].name} secondary fit`,
          'Growing field in Kenya',
          'Multiple pathways available'
        ]
      });
    });

    return matches.sort((a, b) => b.compatibility - a.compatibility);
  };

  const generateDevelopmentAreas = (scores: RiasecScores) => {
    const lowestScores = Object.entries(scores)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 2);

    return lowestScores.map(([type]) => 
      `Develop ${riasecTypes[type as keyof typeof riasecTypes].name.toLowerCase()} skills to become more well-rounded`
    );
  };

  const generateNextSteps = (primaryType: keyof typeof riasecTypes) => {
    return [
      `Research ${riasecTypes[primaryType].kuccpsPathways[0]} programs at Kenyan universities`,
      `Connect with professionals in ${riasecTypes[primaryType].kenyaCareers[0]} field`,
      'Complete subject-to-career mapping for specific requirements',
      'Explore scholarship opportunities for your chosen pathway',
      'Begin building relevant skills and experience'
    ];
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const currentResponse = responses[getCurrentQuestion()?.id];

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
            <p className="text-lg text-gray-600">Loading RIASEC Career Assessment...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching 96 questions from database</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-12 text-center">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No questions loaded
  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No questions available. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Results Header */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-800 mb-2">
              Your RIASEC Career Profile Complete! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Holland Code: <Badge className="text-lg px-3 py-1 bg-green-600">{results.hollandCode}</Badge>
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-2">
              Based on the validated IIP RIASEC Markers (Armstrong, Allison, & Rounds, 2008)
            </p>
          </CardHeader>
        </Card>

        {/* Primary Type Card */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={cn("p-3 rounded-lg text-white", riasecTypes[results.primaryType].color)}>
                {riasecTypes[results.primaryType].icon}
              </div>
              Your Primary Type: {riasecTypes[results.primaryType].name}
            </CardTitle>
            <CardDescription className="text-lg">
              {riasecTypes[results.primaryType].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Your Characteristics:</h4>
                <ul className="space-y-1">
                  {riasecTypes[results.primaryType].characteristics.map((char, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ideal Work Environments:</h4>
                <ul className="space-y-1">
                  {riasecTypes[results.primaryType].workEnvironments.map((env, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{env}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIASEC Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Your Complete RIASEC Profile</CardTitle>
            <CardDescription>
              See how you scored across all six personality types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(results.scores).map(([type, score]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded text-white", riasecTypes[type as keyof typeof riasecTypes].color)}>
                        {riasecTypes[type as keyof typeof riasecTypes].icon}
                      </div>
                      <span className="font-medium">
                        {riasecTypes[type as keyof typeof riasecTypes].name}
                      </span>
                    </div>
                    <span className="font-bold text-lg">{score}%</span>
                  </div>
                  <Progress value={score} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Your Top Career Matches in Kenya</CardTitle>
            <CardDescription>
              Careers that align with your RIASEC profile and have strong opportunities in Kenya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {results.careerMatches.slice(0, 6).map((match, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{match.career}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      {Math.round(match.compatibility)}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    KUCCPS Pathway: {match.kuccpsPathway}
                  </p>
                  <ul className="text-sm space-y-1">
                    {match.reasonsForMatch.map((reason, ridx) => (
                      <li key={ridx} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Your Next Steps</CardTitle>
            <CardDescription>
              Recommended actions to pursue your ideal career path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {results.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setResponses({});
              setResults(null);
            }}
            variant="outline"
          >
            Retake Assessment
          </Button>
          <Button
            onClick={async () => {
              if (assessmentId) {
                try {
                  // Update assessment as completed with 100% progress
                  const response = await fetch('http://localhost:1337/parse/functions/updateAssessmentProgress', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Parse-Application-Id': 'elimu-smart-local-dev',
                      'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
                    },
                    body: JSON.stringify({
                      assessmentType: 'riasec-discovery',
                      progress: 100,
                      status: 'completed'
                    })
                  });
                  
                  if (response.ok) {
                    navigate('/assessment');
                  } else {
                    console.error('Failed to update assessment progress');
                    navigate('/assessment');
                  }
                } catch (error) {
                  console.error('Failed to update assessment progress:', error);
                  navigate('/assessment');
                }
              } else {
                navigate('/assessment');
              }
            }}
          >
            Save Results & Continue
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while starting assessment
  if (isLoading && !assessmentId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <h3 className="text-lg font-medium">Starting your RIASEC Career Assessment...</h3>
              <p className="text-muted-foreground">
                This will take just a moment while we prepare your personalized assessment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if assessment failed to start
  if (error && !assessmentId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="bg-red-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Unable to Start Assessment</h3>
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={startAssessment}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while completing assessment
  if (isLoading && currentQuestion === totalQuestions - 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <h3 className="text-xl font-semibold">Analyzing Your Results...</h3>
              <p className="text-muted-foreground">
                Our AI is processing your responses and matching you with careers in Kenya.
                <br />This may take a few moments.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  ✨ Getting your personalized Holland Code<br/>
                  🎯 Matching careers to your interests<br/>
                  🇰🇪 Finding KUCCPS pathways for you
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = getCurrentQuestion();
  if (!question) return null;

  // Show milestone celebration
  if (showMilestone) {
    const milestoneMessages = [
      { title: "Great Start!", message: "You're 1/6 through! Keep going!" },
      { title: "One Third Complete!", message: "You're building momentum!" },
      { title: "Halfway There!", message: "Amazing progress! You're doing great!" },
      { title: "Two Thirds Done!", message: "The finish line is in sight!" },
      { title: "Almost There!", message: "Just 16 more questions to go!" }
    ];
    const milestone = milestoneMessages[milestoneNumber - 1];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 border-green-300 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <Trophy className="h-24 w-24 text-yellow-600 relative z-10 animate-bounce" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3">
                  <Sparkles className="h-8 w-8 text-yellow-600" />
                  {milestone.title}
                  <Sparkles className="h-8 w-8 text-yellow-600" />
                </h2>
                <p className="text-2xl text-green-700 font-medium">{milestone.message}</p>
                <div className="flex flex-col items-center gap-2 mt-6">
                  <Progress value={progressPercentage} className="h-4 w-full max-w-md" />
                  <Badge className="text-lg px-4 py-2 bg-green-600">
                    {currentQuestion + 1} of {totalQuestions} complete
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <Card className="mb-8 bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">Career Interest Assessment</CardTitle>
            <Badge variant="secondary" className="px-3 py-1">
              Question {currentQuestion + 1} of {totalQuestions}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <CardDescription className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4" />
            Approximately {Math.round((totalQuestions - currentQuestion) * 0.3)} minutes remaining
          </CardDescription>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Based on IIP RIASEC Markers • Free for educational use</span>
            {assessmentId && (
              <Badge variant="outline" className="text-xs">
                ✅ Backend Connected
              </Badge>
            )}
            {!assessmentId && (
              <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">
                ⚠️ Local Mode
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <Badge className="mb-2 bg-blue-500">
                {question.category === 'activities' ? 'Activities' : 'Occupations'}
              </Badge>
              <CardTitle className="text-xl">
                How much would you {question.category === 'occupations' ? 'like being a' : 'like to'}:
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">{question.statement}</h3>
            {question.kenyaContext && (
              <p className="text-sm text-muted-foreground italic">
                🇰🇪 {question.kenyaContext}
              </p>
            )}
          </div>

          {/* Response Options */}
          <RadioGroup
            value={currentResponse?.toString()}
            onValueChange={(value) => handleResponse(question.id, parseInt(value))}
            className="space-y-3"
          >
            {[
              { value: 4, label: 'Love it! Extremely interested', color: 'bg-green-500', emoji: '😍' },
              { value: 3, label: 'Like it - Very interested', color: 'bg-blue-500', emoji: '👍' },
              { value: 2, label: 'Somewhat interested', color: 'bg-yellow-500', emoji: '😐' },
              { value: 1, label: 'Slightly interested', color: 'bg-orange-500', emoji: '🤔' },
              { value: 0, label: 'Not interested at all', color: 'bg-red-500', emoji: '👎' }
            ].map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md",
                  currentResponse === option.value
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                )}
                onClick={() => handleResponse(question.id, option.value)}
              >
                <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="mt-1" />
                <Label htmlFor={`option-${option.value}`} className="flex-1 flex items-center gap-3 cursor-pointer">
                  <span className="text-2xl">{option.emoji}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn("w-3 h-3 rounded-full", option.color)}></div>
                    <span className="font-medium text-base">{option.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={async () => {
              console.log('Save Progress clicked, assessmentId:', assessmentId);
              console.log('Auth token:', localStorage.getItem('elimu-auth-token'));
              
              if (assessmentId) {
                try {
                  // First save progress
                  const saveResponse = await fetch('http://localhost:1337/parse/functions/saveRiasecProgress', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Parse-Application-Id': 'elimu-smart-local-dev',
                      'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
                    },
                    body: JSON.stringify({
                      assessmentId,
                      currentQuestion,
                      responses
                    })
                  });
                  
                  console.log('Save response status:', saveResponse.status);
                  
                  if (saveResponse.ok) {
                    // Complete the assessment (mark as saved progress)
                    const completeResponse = await fetch('http://localhost:1337/parse/functions/updateAssessmentProgress', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'X-Parse-Application-Id': 'elimu-smart-local-dev',
                        'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
                      },
                      body: JSON.stringify({
                        assessmentType: 'riasec-discovery',
                        progress: Math.round((currentQuestion / totalQuestions) * 100),
                        status: 'in-progress'
                      })
                    });
                    
                    console.log('Complete response status:', completeResponse.status);
                    
                    if (completeResponse.ok) {
                      // Navigate back to assessment page
                      navigate('/assessment');
                    } else {
                      alert('Progress saved but unable to update status. Please continue or try again later.');
                    }
                  } else {
                    const errorText = await saveResponse.text();
                    console.error('Save failed:', errorText);
                    alert('Failed to save progress to backend. Please try again.');
                  }
                } catch (error) {
                  console.error('Failed to save progress:', error);
                  alert('Unable to save progress. Please continue or try again later.');
                }
              } else {
                console.log('No assessmentId, saving locally');
                // Local mode - save to localStorage
                localStorage.setItem('riasec_progress', JSON.stringify({
                  currentQuestion,
                  responses,
                  timestamp: Date.now()
                }));
                alert('Progress saved locally!');
                // Navigate back to assessment page
                navigate('/assessment');
              }
            }}
          >
            <Save className="h-4 w-4" />
            Save Progress
          </Button>
          
          {currentQuestion === totalQuestions - 1 && (
            <Button 
              disabled={!currentResponse}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              Complete Assessment
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeRiasecAssessment;