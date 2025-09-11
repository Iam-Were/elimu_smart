import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Trophy,
  TrendingUp,
  Brain,
  MessageCircle,
  Users,
  Lightbulb,
  Settings,
  Target,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface SkillQuestion {
  id: number;
  text: string;
  category: string;
}

interface SkillResult {
  score: number;
  normalizedScore: number;
  level: string;
  confidence: number;
  description: string;
}

interface AssessmentResult {
  skillProfile: Record<string, SkillResult>;
  topSkills: Array<{ skill: string } & SkillResult>;
  developmentAreas: Array<{ skill: string } & SkillResult>;
  overallReadiness: {
    score: number;
    level: string;
    recommendations: Array<{
      skill: string;
      type: string;
      message: string;
    }>;
  };
}

const SKILL_CATEGORIES: Record<string, SkillCategory> = {
  'Critical Thinking': {
    name: 'Critical Thinking',
    icon: <Brain className="h-6 w-6" />,
    color: 'bg-purple-500',
    description: 'Analyzing information, solving complex problems, and making logical decisions'
  },
  'Communication': {
    name: 'Communication',
    icon: <MessageCircle className="h-6 w-6" />,
    color: 'bg-blue-500',
    description: 'Expressing ideas clearly, active listening, and effective presentation'
  },
  'Leadership': {
    name: 'Leadership',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-green-500',
    description: 'Guiding others, taking initiative, and inspiring teamwork'
  },
  'Technical Skills': {
    name: 'Technical Skills',
    icon: <Settings className="h-6 w-6" />,
    color: 'bg-orange-500',
    description: 'Using technology, tools, and technical processes effectively'
  },
  'Creativity': {
    name: 'Creativity',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-yellow-500',
    description: 'Generating new ideas, thinking outside the box, and innovation'
  },
  'Teamwork': {
    name: 'Teamwork',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-indigo-500',
    description: 'Collaborating effectively, supporting others, and working in groups'
  }
};

// 36 Skills Assessment Questions based on the backend framework
const SKILLS_QUESTIONS: SkillQuestion[] = [
  // Critical Thinking (Questions 1, 5, 9, 13, 17, 21)
  { id: 1, text: "I can analyze complex problems and break them into smaller, manageable parts", category: "Critical Thinking" },
  { id: 5, text: "I evaluate information from multiple sources before making decisions", category: "Critical Thinking" },
  { id: 9, text: "I can identify logical flaws in arguments or reasoning", category: "Critical Thinking" },
  { id: 13, text: "I enjoy solving puzzles and complex mental challenges", category: "Critical Thinking" },
  { id: 17, text: "I can synthesize information from different areas to create new understanding", category: "Critical Thinking" },
  { id: 21, text: "I question assumptions and look for evidence before accepting ideas", category: "Critical Thinking" },

  // Communication (Questions 2, 6, 10, 14, 18, 22)
  { id: 2, text: "I can explain complex ideas in simple terms that others understand", category: "Communication" },
  { id: 6, text: "I listen actively and ask clarifying questions in conversations", category: "Communication" },
  { id: 10, text: "I feel confident giving presentations to groups", category: "Communication" },
  { id: 14, text: "I can write clearly and persuasively for different audiences", category: "Communication" },
  { id: 18, text: "I adapt my communication style based on who I'm speaking with", category: "Communication" },
  { id: 22, text: "I can handle difficult conversations with tact and diplomacy", category: "Communication" },

  // Leadership (Questions 3, 7, 11, 15, 19, 23)
  { id: 3, text: "I naturally take charge when working on group projects", category: "Leadership" },
  { id: 7, text: "Others often come to me for guidance or advice", category: "Leadership" },
  { id: 11, text: "I can motivate others to work towards common goals", category: "Leadership" },
  { id: 15, text: "I'm comfortable making decisions when others are uncertain", category: "Leadership" },
  { id: 19, text: "I take responsibility for outcomes, both positive and negative", category: "Leadership" },
  { id: 23, text: "I can delegate tasks effectively and trust others to complete them", category: "Leadership" },

  // Technical Skills (Questions 4, 8, 12, 16, 20, 24)
  { id: 4, text: "I learn new software and technology tools quickly", category: "Technical Skills" },
  { id: 8, text: "I enjoy working with computers, gadgets, and technical equipment", category: "Technical Skills" },
  { id: 12, text: "I can troubleshoot technical problems systematically", category: "Technical Skills" },
  { id: 16, text: "I understand how to use data and statistics to support arguments", category: "Technical Skills" },
  { id: 20, text: "I'm skilled at using digital tools to organize and present information", category: "Technical Skills" },
  { id: 24, text: "I can follow technical instructions and procedures accurately", category: "Technical Skills" },

  // Creativity (Questions 25-30)
  { id: 25, text: "I often come up with unique solutions to problems", category: "Creativity" },
  { id: 26, text: "I enjoy brainstorming and generating new ideas", category: "Creativity" },
  { id: 27, text: "I can see connections between seemingly unrelated concepts", category: "Creativity" },
  { id: 28, text: "I like to experiment with different approaches to tasks", category: "Creativity" },
  { id: 29, text: "I'm comfortable with ambiguity and uncertain situations", category: "Creativity" },
  { id: 30, text: "I can think of multiple ways to approach the same challenge", category: "Creativity" },

  // Teamwork (Questions 31-36)
  { id: 31, text: "I work well with people from diverse backgrounds and perspectives", category: "Teamwork" },
  { id: 32, text: "I'm willing to compromise to reach group consensus", category: "Teamwork" },
  { id: 33, text: "I contribute actively to group discussions and activities", category: "Teamwork" },
  { id: 34, text: "I support team members when they're struggling", category: "Teamwork" },
  { id: 35, text: "I can manage conflicts within a team constructively", category: "Teamwork" },
  { id: 36, text: "I celebrate others' successes and achievements", category: "Teamwork" }
];

export const SkillsAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = SKILLS_QUESTIONS.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    startAssessment();
  }, []);

  const startAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:1337/parse/functions/startSkillsAssessment', {
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
      } else {
        setError('Failed to start assessment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to start assessment:', error);
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (questionId: number, response: number) => {
    const newResponses = { ...responses, [questionId]: response };
    setResponses(newResponses);

    // Auto-advance to next question
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 500);
    } else {
      // Assessment complete - calculate results
      completeAssessment(newResponses);
    }
  };

  const completeAssessment = async (finalResponses: Record<number, number>) => {
    if (!assessmentId) return;

    try {
      setIsLoading(true);
      
      // First, save all responses to the assessment
      const assessmentData = await fetch(`http://localhost:1337/parse/classes/SkillsAssessment/${assessmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || '',
          'X-Parse-Master-Key': 'elimu-smart-master-key-dev-change-in-production'
        },
        body: JSON.stringify({
          responses: finalResponses
        })
      });

      // Then calculate the skill profile
      const response = await fetch('http://localhost:1337/parse/functions/calculateSkillProfile', {
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
        setResults(data.result);
        setShowResults(true);
      } else {
        setError('Failed to calculate results. Please try again.');
      }
    } catch (error) {
      console.error('Failed to complete assessment:', error);
      setError('Unable to process results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (isLoading && !assessmentId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <h3 className="text-lg font-semibold">Starting Your Skills Assessment...</h3>
              <p className="text-gray-600">This will help identify your unique strengths and talents.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !assessmentId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Assessment Error</h3>
              <p className="text-red-600">{error}</p>
              <Button onClick={startAssessment} className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && currentQuestion === totalQuestions - 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
              <h3 className="text-xl font-semibold">Analyzing Your Skills Profile...</h3>
              <p className="text-gray-600">
                We're calculating your strengths across 6 key skill areas.
                <br />This will take just a moment.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  ✨ Identifying your top skills<br/>
                  📊 Calculating skill levels<br/>
                  🎯 Generating development recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Results Header */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-800 mb-2">
                Your Skills Profile Complete! 🏆
              </CardTitle>
              <CardDescription className="text-lg">
                Overall Readiness: <Badge className="text-lg px-3 py-1 bg-green-600">{results.overallReadiness.level}</Badge>
              </CardDescription>
              <p className="text-sm text-gray-600 mt-2">
                Score: {results.overallReadiness.score}/100
              </p>
            </CardHeader>
          </Card>

          {/* Top Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="h-6 w-6 text-yellow-600" />
                Your Top Skills
              </CardTitle>
              <CardDescription>
                These are your strongest skill areas - leverage these in your career choices!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {results.topSkills.map((skill, index) => {
                  const category = SKILL_CATEGORIES[skill.skill];
                  return (
                    <div key={skill.skill} className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("p-2 rounded text-white", category.color)}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{skill.skill}</h3>
                          <Badge className="text-xs bg-green-100 text-green-800">
                            #{index + 1} Strength
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Score</span>
                          <span className="font-bold">{skill.normalizedScore}%</span>
                        </div>
                        <Progress value={skill.normalizedScore} className="h-2" />
                        <p className="text-xs text-gray-600">Level: {skill.level}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Complete Skills Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Skills Breakdown</CardTitle>
              <CardDescription>
                Your performance across all six skill categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.skillProfile).map(([skillName, skillData]) => {
                  const category = SKILL_CATEGORIES[skillName];
                  return (
                    <div key={skillName} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded text-white", category.color)}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{skillName}</h3>
                            <p className="text-xs text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{skillData.normalizedScore}%</div>
                          <Badge className={cn(
                            "text-xs",
                            skillData.normalizedScore >= 80 ? "bg-green-100 text-green-800" :
                            skillData.normalizedScore >= 60 ? "bg-blue-100 text-blue-800" :
                            "bg-orange-100 text-orange-800"
                          )}>
                            {skillData.level}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={skillData.normalizedScore} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Development Areas */}
          {results.developmentAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Growth Opportunities
                </CardTitle>
                <CardDescription>
                  Areas where focused development could unlock new opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.developmentAreas.map((skill) => {
                    const category = SKILL_CATEGORIES[skill.skill];
                    return (
                      <div key={skill.skill} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn("p-2 rounded text-white", category.color)}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{skill.skill}</h3>
                            <p className="text-sm text-blue-700">Development Potential</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {results.overallReadiness.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.overallReadiness.recommendations.map((rec, index) => (
                    <div key={index} className={cn(
                      "p-4 rounded-lg border-l-4",
                      rec.type === 'leverage' ? "bg-green-50 border-green-500" : "bg-blue-50 border-blue-500"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        {rec.type === 'leverage' ? (
                          <Trophy className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="font-medium text-sm">{rec.skill}</span>
                      </div>
                      <p className="text-sm">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setResponses({});
              setResults(null);
              setError(null);
              startAssessment();
            }}>
              Retake Assessment
            </Button>
            <Button>
              Save Results & Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = SKILLS_QUESTIONS[currentQuestion];
  const category = SKILL_CATEGORIES[currentQuestionData.category];
  const currentResponse = responses[currentQuestionData.id];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-purple-50 border-orange-200">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl">Skills & Strengths Assessment</CardTitle>
              <Badge variant="secondary" className="px-3 py-1">
                Question {currentQuestion + 1} of {totalQuestions}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <CardDescription className="flex items-center gap-2 mt-2">
              <Trophy className="h-4 w-4" />
              Approximately {Math.round((totalQuestions - currentQuestion) * 0.5)} minutes remaining
            </CardDescription>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Discovering your unique talents and abilities</span>
              <Badge variant="outline" className="text-xs">
                ✅ Backend Connected
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-3 rounded-lg text-white", category.color)}>
                {category.icon}
              </div>
              <div>
                <Badge className="mb-2" style={{ backgroundColor: category.color.replace('bg-', '').replace('-500', '') }}>
                  {category.name}
                </Badge>
                <CardTitle className="text-xl">
                  How well does this describe you?
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{currentQuestionData.text}</h3>
            </div>

            {/* Response Options */}
            <div className="grid gap-3">
              {[
                { value: 5, label: 'Completely describes me', color: 'bg-green-500' },
                { value: 4, label: 'Mostly describes me', color: 'bg-blue-500' },
                { value: 3, label: 'Somewhat describes me', color: 'bg-yellow-500' },
                { value: 2, label: 'Rarely describes me', color: 'bg-orange-500' },
                { value: 1, label: 'Does not describe me at all', color: 'bg-red-500' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponse(currentQuestionData.id, option.value)}
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
          
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          
          {currentQuestion === totalQuestions - 1 && currentResponse && (
            <Badge className="bg-green-600 px-4 py-2">
              Assessment will complete after this question
            </Badge>
          )}
          
          {currentQuestion < totalQuestions - 1 && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Auto-advance after selection
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessment;