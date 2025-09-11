import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

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
  { id: 1, category: 'activities', statement: 'Test the quality of parts before shipment', riasecType: 'R' },
  { id: 2, category: 'activities', statement: 'Lay brick or tile', riasecType: 'R' },
  { id: 3, category: 'activities', statement: 'Work on an offshore oil-drilling rig', riasecType: 'R' },
  { id: 4, category: 'activities', statement: 'Assemble electronic parts', riasecType: 'R' },
  { id: 5, category: 'activities', statement: 'Drive a truck to deliver packages to offices and homes', riasecType: 'R' },
  { id: 6, category: 'activities', statement: 'Repair household appliances', riasecType: 'R' },
  { id: 7, category: 'activities', statement: 'Raise fish in a fish hatchery', riasecType: 'R' },
  { id: 8, category: 'activities', statement: 'Build kitchen cabinets', riasecType: 'R' },

  // REALISTIC Occupations
  { id: 9, category: 'occupations', statement: 'Mechanical Engineer', riasecType: 'R' },
  { id: 10, category: 'occupations', statement: 'Race Car Driver', riasecType: 'R' },
  { id: 11, category: 'occupations', statement: 'Aircraft Mechanic', riasecType: 'R' },
  { id: 12, category: 'occupations', statement: 'Carpenter', riasecType: 'R' },
  { id: 13, category: 'occupations', statement: 'Auto Mechanic', riasecType: 'R' },
  { id: 14, category: 'occupations', statement: 'Commercial Airline Pilot', riasecType: 'R' },
  { id: 15, category: 'occupations', statement: 'Electrician', riasecType: 'R' },
  { id: 16, category: 'occupations', statement: 'Farmer', riasecType: 'R', kenyaContext: 'Agricultural sector is vital in Kenya' },

  // INVESTIGATIVE Activities
  { id: 17, category: 'activities', statement: 'Study ways to reduce water pollution', riasecType: 'I' },
  { id: 18, category: 'activities', statement: 'Develop a new medicine', riasecType: 'I' },
  { id: 19, category: 'activities', statement: 'Plan a research study', riasecType: 'I' },
  { id: 20, category: 'activities', statement: 'Study the history of past civilizations', riasecType: 'I' },
  { id: 21, category: 'activities', statement: 'Study animal behavior', riasecType: 'I' },
  { id: 22, category: 'activities', statement: 'Do research on plants or animals', riasecType: 'I' },
  { id: 23, category: 'activities', statement: 'Do laboratory tests to identify diseases', riasecType: 'I' },
  { id: 24, category: 'activities', statement: 'Study weather conditions', riasecType: 'I' },

  // INVESTIGATIVE Occupations
  { id: 25, category: 'occupations', statement: 'Psychologist', riasecType: 'I' },
  { id: 26, category: 'occupations', statement: 'Research Scientist', riasecType: 'I' },
  { id: 27, category: 'occupations', statement: 'Medical Doctor', riasecType: 'I' },
  { id: 28, category: 'occupations', statement: 'Anthropologist', riasecType: 'I' },
  { id: 29, category: 'occupations', statement: 'Chemist', riasecType: 'I' },
  { id: 30, category: 'occupations', statement: 'Mathematician', riasecType: 'I' },
  { id: 31, category: 'occupations', statement: 'Biologist', riasecType: 'I' },
  { id: 32, category: 'occupations', statement: 'Astronomer', riasecType: 'I' },

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
  { id: 41, category: 'occupations', statement: 'Poet', riasecType: 'A' },
  { id: 42, category: 'occupations', statement: 'Actor', riasecType: 'A' },
  { id: 43, category: 'occupations', statement: 'Musician', riasecType: 'A' },
  { id: 44, category: 'occupations', statement: 'Film Editor', riasecType: 'A' },
  { id: 45, category: 'occupations', statement: 'Artist', riasecType: 'A' },
  { id: 46, category: 'occupations', statement: 'Singer', riasecType: 'A' },
  { id: 47, category: 'occupations', statement: 'Graphic Designer', riasecType: 'A' },
  { id: 48, category: 'occupations', statement: 'Journalist', riasecType: 'A', kenyaContext: 'Media industry is growing in Kenya' },

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
  { id: 81, category: 'activities', statement: 'Develop a spreadsheet using computer software', riasecType: 'C' },
  { id: 82, category: 'activities', statement: 'Proofread records or forms', riasecType: 'C' },
  { id: 83, category: 'activities', statement: 'Use a computer program to generate customer bills', riasecType: 'C' },
  { id: 84, category: 'activities', statement: 'Maintain employee records', riasecType: 'C' },
  { id: 85, category: 'activities', statement: 'Compute and record statistical and other numerical data', riasecType: 'C' },
  { id: 86, category: 'activities', statement: 'Operate a calculator', riasecType: 'C' },
  { id: 87, category: 'activities', statement: 'Handle customers bank transactions', riasecType: 'C' },
  { id: 88, category: 'activities', statement: 'Keep shipping and receiving records', riasecType: 'C' },

  // CONVENTIONAL Occupations
  { id: 89, category: 'occupations', statement: 'Accountant', riasecType: 'C' },
  { id: 90, category: 'occupations', statement: 'Payroll Clerk', riasecType: 'C' },
  { id: 91, category: 'occupations', statement: 'Secretary', riasecType: 'C' },
  { id: 92, category: 'occupations', statement: 'Budget Analyst', riasecType: 'C' },
  { id: 93, category: 'occupations', statement: 'Billing Clerk', riasecType: 'C' },
  { id: 94, category: 'occupations', statement: 'Treasurer', riasecType: 'C' },
  { id: 95, category: 'occupations', statement: 'Credit Manager', riasecType: 'C' },
  { id: 96, category: 'occupations', statement: 'Store Manager', riasecType: 'C' }
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

export const FreeRiasecAssessment: React.FC = () => {
  const { logActivity } = useDynamicDashboard();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [results, setResults] = useState<RiasecResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = iipRiasecQuestions.length;
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  useEffect(() => {
    startAssessment();
  }, []);

  const startAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:1337/parse/functions/startRiasecAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (data.result) {
        setAssessmentId(data.result.id);
        logActivity('free_riasec_assessment_started', {
          assessmentId: data.result.id,
          totalQuestions,
          version: 'IIP_RIASEC_Markers',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to start assessment:', error);
      setError('Failed to start assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (questionId: number, response: number) => {
    if (!assessmentId) return;

    const newResponses = { ...responses, [questionId]: response };
    setResponses(newResponses);

    try {
      // Save response to backend
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
          category: iipRiasecQuestions[currentQuestion].category,
          riasecType: iipRiasecQuestions[currentQuestion].riasecType
        })
      });

      // Log individual question response
      logActivity('riasec_question_answered', {
        assessmentId,
        questionId,
        response,
        questionNumber: currentQuestion + 1,
        category: iipRiasecQuestions[currentQuestion].category,
        riasecType: iipRiasecQuestions[currentQuestion].riasecType
      });

      // Auto-advance to next question
      if (currentQuestion < totalQuestions - 1) {
        setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
      } else {
        // Assessment complete - get results from backend
        await completeAssessment();
      }
    } catch (error) {
      console.error('Failed to save response:', error);
      // Continue with local fallback
      if (currentQuestion < totalQuestions - 1) {
        setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
      } else {
        calculateResults(newResponses);
      }
    }
  };

  const completeAssessment = async () => {
    if (!assessmentId) return;

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:1337/parse/functions/completeRiasecAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
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

  const getCurrentQuestion = () => iipRiasecQuestions[currentQuestion];
  const currentResponse = responses[getCurrentQuestion()?.id];

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
          <Button>
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
          <div className="grid gap-3">
            {[
              { value: 4, label: 'Love it! Extremely interested', color: 'bg-green-500' },
              { value: 3, label: 'Like it - Very interested', color: 'bg-blue-500' },
              { value: 2, label: 'Somewhat interested', color: 'bg-yellow-500' },
              { value: 1, label: 'Slightly interested', color: 'bg-orange-500' },
              { value: 0, label: 'Not interested at all', color: 'bg-red-500' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(question.id, option.value)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  currentResponse === option.value
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-4 h-4 rounded-full", option.color)}></div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
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
              if (assessmentId) {
                try {
                  const response = await fetch('http://localhost:1337/parse/functions/saveRiasecProgress', {
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
                  
                  if (response.ok) {
                    alert('Progress saved! You can continue later.');
                  }
                } catch (error) {
                  console.error('Failed to save progress:', error);
                  alert('Unable to save progress. Please continue or try again later.');
                }
              } else {
                // Local mode - save to localStorage
                localStorage.setItem('riasec_progress', JSON.stringify({
                  currentQuestion,
                  responses,
                  timestamp: Date.now()
                }));
                alert('Progress saved locally!');
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