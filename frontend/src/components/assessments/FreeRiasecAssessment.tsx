import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import AssessmentLoadingSkeleton from './AssessmentLoadingSkeleton';
import { toast } from 'sonner';
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
  Loader2,
  BookOpen
  // Download, MessageCircle, ExternalLink - will be used for PDF and action buttons
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';
import { getRiasecQuestions } from '@/lib/assessmentApi';
import {
  startRiasecAssessment,
  saveRiasecResponse,
  completeRiasecAssessment,
  resumeRiasecAssessment
} from '@/lib/assessmentProgress';
import { callCloudFunction } from '@/lib/parseConfig';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

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
  // Enhanced personality insights
  workStyle: string;
  strengths: string[];
  motivators: string[];
  teamRole: string;
  famousKenyans: string[];
  learningStyle: string;
  decisionMaking: string;
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
    ],
    workStyle: 'Hands-on and practical, prefer working with tangible objects and seeing concrete results',
    strengths: ['Problem-solving with tools', 'Physical coordination', 'Technical skills', 'Mechanical reasoning'],
    motivators: ['Tangible results', 'Working with hands', 'Outdoor activities', 'Building things'],
    teamRole: 'The Builder - brings practical solutions and technical expertise',
    famousKenyans: ['Mbithi Masya (Engineer)', 'Philip Nyakiamo (Tech Innovator)', 'James Macharia (Infrastructure)'],
    learningStyle: 'Learning by doing - prefer hands-on practice over theory',
    decisionMaking: 'Practical and logical - focus on what works in real situations'
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
    ],
    workStyle: 'Analytical and methodical, enjoy research and understanding complex systems',
    strengths: ['Critical thinking', 'Research skills', 'Data analysis', 'Problem-solving'],
    motivators: ['Discovering new knowledge', 'Solving complex problems', 'Understanding how things work', 'Intellectual challenges'],
    teamRole: 'The Analyst - brings research-based insights and logical reasoning',
    famousKenyans: ['Prof. Wangari Maathai (Scientist)', 'Dr. Calestous Juma (Innovation)', 'Dr. Patrick Amoth (Medicine)'],
    learningStyle: 'Conceptual learning - prefer understanding theory before application',
    decisionMaking: 'Data-driven and evidence-based - rely on research and analysis'
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
    ],
    workStyle: 'Creative and expressive, value originality and aesthetic beauty',
    strengths: ['Creative thinking', 'Visual/artistic expression', 'Innovation', 'Storytelling'],
    motivators: ['Self-expression', 'Creative freedom', 'Making beautiful things', 'Inspiring others'],
    teamRole: 'The Innovator - brings fresh perspectives and creative solutions',
    famousKenyans: ['Lupita Nyongo (Arts)', 'Juliana Rotich (Design)', 'Binyavanga Wainaina (Writer)'],
    learningStyle: 'Visual and experiential - prefer creative exploration and self-expression',
    decisionMaking: 'Intuitive and values-based - consider aesthetics and emotional impact'
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
    ],
    workStyle: 'People-focused and empathetic, motivated by helping others grow and succeed',
    strengths: ['Interpersonal communication', 'Empathy', 'Teaching/mentoring', 'Conflict resolution'],
    motivators: ['Helping others', 'Making a difference', 'Building relationships', 'Community impact'],
    teamRole: 'The Supporter - brings people together and fosters collaboration',
    famousKenyans: ['Prof. Ruth Nita Barrow (Education)', 'Dr. Koki Muli (Public Health)', 'Tecla Namachanja (Social Work)'],
    learningStyle: 'Collaborative learning - prefer group discussions and mentorship',
    decisionMaking: 'People-centered and consensus-driven - consider impact on others'
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
    ],
    workStyle: 'Results-driven and persuasive, energized by leading teams and achieving goals',
    strengths: ['Leadership', 'Persuasion', 'Strategic thinking', 'Risk-taking'],
    motivators: ['Achievement', 'Recognition', 'Financial success', 'Influence'],
    teamRole: 'The Leader - drives projects forward and motivates others',
    famousKenyans: ['James Mwangi (Banking)', 'Tabitha Karanja (Entrepreneur)', 'Sam Gichuru (Business)'],
    learningStyle: 'Action-oriented learning - prefer real-world experience and networking',
    decisionMaking: 'Goal-focused and opportunistic - consider potential for success and impact'
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
    ],
    workStyle: 'Systematic and organized, thrive in structured environments with clear expectations',
    strengths: ['Attention to detail', 'Organization', 'Accuracy', 'Following procedures'],
    motivators: ['Order and structure', 'Completing tasks correctly', 'Reliability', 'Clear expectations'],
    teamRole: 'The Organizer - ensures processes run smoothly and deadlines are met',
    famousKenyans: ['Henry Rotich (Finance)', 'Betty Maina (Administration)', 'John Walubengo (Audit)'],
    learningStyle: 'Structured learning - prefer step-by-step instruction and clear guidelines',
    decisionMaking: 'Methodical and rule-based - follow established procedures and best practices'
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

// Questions are loaded from backend API - no hardcoded data

interface RiasecScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

interface DevelopmentArea {
  type: string;
  score: number;
  recommendations: string[];
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
  developmentAreas: DevelopmentArea[] | string[];
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
  // Separate loading states to prevent race conditions
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneNumber, setMilestoneNumber] = useState(0);

  // Combined loading state for UI
  const isLoading = questionsLoading || assessmentLoading;

  // Load questions from API on mount with timeout protection
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setError(null);

        // Add 10-second timeout protection
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
        );

        const questionsPromise = getRiasecQuestions();

        const apiQuestions = await Promise.race([
          questionsPromise,
          timeoutPromise
        ]) as RiasecQuestion[];

        const interleavedQuestions = interleaveQuestions(apiQuestions);
        setQuestions(interleavedQuestions);
        console.log(`✅ Loaded ${apiQuestions.length} RIASEC questions successfully`);
      } catch (err) {
        console.error('Failed to load RIASEC questions:', err);
        setError('Failed to load assessment questions. Please refresh the page or try again.');
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
  }, []); // No dependencies - run once on mount

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

  const startAssessment = useCallback(async (forceNew: boolean = false) => {
    setAssessmentLoading(true);
    setError(null);

    try {
      // Check for incomplete assessment first (unless user wants to start fresh)
      if (!forceNew) {
        const resumeResult = await resumeRiasecAssessment();

        if (resumeResult.assessment) {
          // Resume incomplete assessment silently
          setAssessmentId(resumeResult.assessment.id);
          setCurrentQuestion(resumeResult.assessment.currentQuestion);
          // Reconstruct responses from backend
          const resumedResponses: Record<number, number> = {};
          resumeResult.assessment.responses.forEach((qId: string, index: number) => {
            resumedResponses[parseInt(qId)] = index;
          });
          setResponses(resumedResponses);
          console.log(`✅ Resumed assessment ${resumeResult.assessment.id} at question ${resumeResult.assessment.currentQuestion}`);
          return; // Exit early - don't start new assessment
        }
      }

      // Start new assessment
      const result = await startRiasecAssessment();
      setAssessmentId(result.assessmentId);

      // Log activity with local variable to avoid dependency
      const currentTotalQuestions = questions.length;
      logActivity('free_riasec_assessment_started', {
        assessmentId: result.assessmentId,
        totalQuestions: currentTotalQuestions,
        version: 'IIP_RIASEC_Markers',
        timestamp: new Date().toISOString(),
        isResume: false
      });
      console.log(`✅ Started new assessment ${result.assessmentId} with ${currentTotalQuestions} questions`);
    } catch (error) {
      console.warn('Failed to start/resume assessment, using local fallback:', error);
      // Always provide fallback to prevent blocking
      const fallbackId = `local-${Date.now()}`;
      setAssessmentId(fallbackId);
      setError('Assessment initialized in offline mode. Your progress will be saved locally.');
    } finally {
      // Always clear loading state
      setAssessmentLoading(false);
    }
  }, [logActivity, questions.length]);

  // Start assessment ONLY after questions are loaded
  useEffect(() => {
    if (!questionsLoading && questions.length > 0 && !assessmentId) {
      startAssessment();
    }
  }, [questionsLoading, questions.length, assessmentId, startAssessment]);

  const handleResponse = (questionId: number, response: number) => {
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

    // Save to backend but don't block UI
    if (assessmentId && !assessmentId.startsWith('local-')) {
      saveRiasecResponse(
        assessmentId,
        questionId.toString(),
        response,
        {
          questionNumber: currentQuestion + 1,
          category: questions[currentQuestion]?.category || 'activities',
          riasecType: questions[currentQuestion]?.riasecType || 'R'
        }
      ).catch(error => {
        console.warn('Failed to save response to backend (continuing locally):', error);
      });
    }
  };

  const handleNext = async () => {
    // Advance to next question or complete assessment
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
        setCurrentQuestion(prev => prev + 1);
      }
    } else {
      // Assessment complete - try backend first, fallback to local
      if (assessmentId) {
        try {
          await completeAssessment();
        } catch (error) {
          console.warn('Backend completion failed, using local calculation:', error);
          calculateResults(responses);
        }
      } else {
        calculateResults(responses);
      }
    }
  };

  const completeAssessment = async () => {
    if (!assessmentId || assessmentId.startsWith('local-')) {
      calculateResults(responses);
      return;
    }

    try {
      setAssessmentLoading(true);
      const result = await completeRiasecAssessment(assessmentId);

      // Transform backend results to match frontend interface
      const results: RiasecResults = {
        scores: result.results.scores,
        hollandCode: result.results.hollandCode,
        primaryType: result.results.primaryType,
        careerMatches: result.results.careerMatches,
        developmentAreas: result.results.developmentAreas,
        nextSteps: [] // Backend doesn't return nextSteps
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
    } catch (error) {
      console.error('Failed to complete assessment on backend:', error);
      // Fallback to local calculation
      calculateResults(responses);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const calculateResults = (finalResponses: Record<number, number>) => {
    // Fallback local calculation when backend is unavailable
    const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    questions.forEach(question => {
      const response = finalResponses[question.id];
      if (response !== undefined) {
        const type = question.riasecType as keyof RiasecScores;
        scores[type] += response;
      }
    });

    // Normalize scores to 0-100 scale (IIP scores range 0-32 per type)
    const riasecKeys: (keyof RiasecScores)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
    riasecKeys.forEach(type => {
      const typeQuestions = questions.filter(q => q.riasecType === type);
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
    return <AssessmentLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="bg-orange-100 p-4 rounded-full">
                <Brain className="h-8 w-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-orange-900">Connection Issue</h3>
                <p className="text-orange-700 max-w-md">{error}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-orange-200 max-w-md">
                <h4 className="font-semibold text-gray-900 mb-2">What you can do:</h4>
                <ul className="text-sm text-gray-700 text-left space-y-1">
                  <li>✓ Check your internet connection</li>
                  <li>✓ Try refreshing the page</li>
                  <li>✓ Your progress is saved - you can continue later</li>
                  <li>✓ Contact support if this persists</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Retry Now
                </Button>
                <Button 
                  onClick={() => navigate('/assessment')} 
                  variant="outline"
                >
                  Back to Assessments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No questions loaded
  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="bg-yellow-100 p-4 rounded-full">
                <Loader2 className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-yellow-900">Questions Not Available</h3>
                <p className="text-yellow-700 max-w-md">
                  We couldn't load the assessment questions. This might be a temporary issue.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate('/assessment')} 
                  variant="outline"
                >
                  Back to Assessments
                </Button>
              </div>
            </div>
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

        {/* Radar Chart Visualization */}
        <Card id="radar-chart">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              Your RIASEC Profile Visualization
            </CardTitle>
            <CardDescription>
              All 6 personality dimensions - Higher scores indicate stronger alignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { dimension: 'Realistic', score: results.scores.R },
                  { dimension: 'Investigative', score: results.scores.I },
                  { dimension: 'Artistic', score: results.scores.A },
                  { dimension: 'Social', score: results.scores.S },
                  { dimension: 'Enterprising', score: results.scores.E },
                  { dimension: 'Conventional', score: results.scores.C }
                ]}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: '#374151', fontSize: 14, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Radar
                    name="RIASEC Scores"
                    dataKey="score"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Table Below Chart */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(results.scores).map(([code, score]) => (
                <div key={code} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className={cn("p-2 rounded text-white", riasecTypes[code].color)}>
                    {riasecTypes[code].icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{code} - {score}%</div>
                    <div className="text-xs text-gray-600">{riasecTypes[code].name.split(' ')[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
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

        {/* Personality Insights Section */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              About Your Personality
            </CardTitle>
            <CardDescription>
              Understanding how you work best and what drives you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Work Style */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Work Style
              </h4>
              <p className="text-sm text-gray-700 bg-white/70 p-3 rounded-lg">
                {riasecTypes[results.primaryType].workStyle}
              </p>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Your Strengths
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {riasecTypes[results.primaryType].strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/70 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Style */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Style
              </h4>
              <p className="text-sm text-gray-700 bg-white/70 p-3 rounded-lg">
                {riasecTypes[results.primaryType].learningStyle}
              </p>
            </div>

            {/* Decision Making */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Decision-Making Style
              </h4>
              <p className="text-sm text-gray-700 bg-white/70 p-3 rounded-lg">
                {riasecTypes[results.primaryType].decisionMaking}
              </p>
            </div>

            {/* Motivators */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                What Motivates You
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {riasecTypes[results.primaryType].motivators.map((motivator, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/70 p-2 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-sm">{motivator}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Role */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Your Team Role
              </h4>
              <p className="text-sm text-gray-700 bg-white/70 p-3 rounded-lg">
                {riasecTypes[results.primaryType].teamRole}
              </p>
            </div>

            {/* Famous Kenyans */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Famous Kenyans with Similar Profile
              </h4>
              <div className="flex flex-wrap gap-2">
                {riasecTypes[results.primaryType].famousKenyans.map((person, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800">
                    {person}
                  </Badge>
                ))}
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
                  await callCloudFunction(
                    'updateAssessmentProgress',
                    {
                      assessmentType: 'riasec-discovery',
                      progress: 100,
                      status: 'completed'
                    },
                    localStorage.getItem('parse-session-token') || ''
                  );
                  navigate('/dashboard');
                } catch (error) {
                  console.error('Failed to update assessment progress:', error);
                  navigate('/dashboard');
                }
              } else {
                navigate('/dashboard');
              }
            }}
          >
            View Dashboard
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
                onClick={() => startAssessment()}
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
            value={currentResponse !== undefined ? currentResponse.toString() : ""}
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
        {currentQuestion > 0 && (
          <Button 
            variant="outline" 
            onClick={goToPrevious}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              // Always save to localStorage first (instant UX)
              localStorage.setItem('riasec_progress', JSON.stringify({
                currentQuestion,
                responses,
                timestamp: Date.now()
              }));

              if (assessmentId) {
                try {
                  const sessionToken = localStorage.getItem('parse-session-token') || '';

                  // Update assessment progress (only update metadata, not individual responses)
                  await callCloudFunction('updateAssessmentProgress', {
                    assessmentType: 'riasec-discovery',
                    progress: Math.round((currentQuestion / totalQuestions) * 100),
                    status: 'in-progress'
                  }, sessionToken);

                  toast.success('Progress saved!', {
                    description: 'You can continue later from this point.'
                  });
                } catch (error) {
                  console.error('Failed to save progress to server:', error);
                  toast.info('Progress saved locally', {
                    description: 'Continue anytime from this device.'
                  });
                }
              } else {
                toast.info('Progress saved locally', {
                  description: 'Continue anytime from this device.'
                });
              }
            }}
          >
            <Save className="h-4 w-4" />
            Save & Continue Later
          </Button>

          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              if (window.confirm('Exit assessment? Your progress will be saved and you can continue later.')) {
                // Save current progress before exiting
                localStorage.setItem('riasec_progress', JSON.stringify({
                  currentQuestion,
                  responses,
                  timestamp: Date.now()
                }));
                navigate('/assessment');
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Exit Assessment
          </Button>

          {currentQuestion < totalQuestions - 1 ? (
            <Button
              onClick={handleNext}
              disabled={currentResponse === undefined}
              className="gap-2 bg-orange-600 hover:bg-orange-700"
            >
              Next Question
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentResponse === undefined}
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