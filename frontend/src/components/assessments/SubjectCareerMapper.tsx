import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  // ArrowLeft, // TODO: Re-enable when implementing Card 3
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  BookOpen,
  Target,
  DollarSign,
  Calculator,
  Globe,
  Leaf,
  Zap,
  FlaskConical,
  Scroll,
  Map,
  Monitor,
  Briefcase,
  Sprout,
  Palette,
  Music,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO: Re-enable when implementing Card 3 (grade analyzer)
// interface SubjectGrades {
//   [subject: string]: string;
// }

interface JobPosting {
  company: string;
  location: string;
  salary?: string;
}

interface LiveJobData {
  jobs?: number;
  avgSalary?: string;
  recentJobs?: JobPosting[];
  totalJobs?: number;
  salaryRange?: string;
  demandLevel?: string;
  topEmployers?: string[];
  error?: string;
}

const KENYAN_SUBJECTS = [
  { name: 'Mathematics', icon: Calculator, emoji: '📐', description: 'Logic, problem-solving, analytical thinking' },
  { name: 'English', icon: FileText, emoji: '📝', description: 'Communication, writing, critical analysis' },
  { name: 'Kiswahili', icon: Globe, emoji: '🌍', description: 'National language, cultural understanding' },
  { name: 'Physics', icon: Zap, emoji: '⚛️', description: 'Matter, energy, natural phenomena' },
  { name: 'Chemistry', icon: FlaskConical, emoji: '🧪', description: 'Chemical processes and materials' },
  { name: 'Biology', icon: Leaf, emoji: '🧬', description: 'Life sciences, living organisms' },
  { name: 'Geography', icon: Map, emoji: '🗺️', description: 'Earth sciences, environmental studies' },
  { name: 'History', icon: Scroll, emoji: '📚', description: 'Past events, analytical thinking' },
  { name: 'Business Studies', icon: Briefcase, emoji: '💼', description: 'Commerce, entrepreneurship, economics' },
  { name: 'Economics', icon: TrendingUp, emoji: '📈', description: 'Economic systems, market analysis' },
  { name: 'Agriculture', icon: Sprout, emoji: '🌾', description: 'Farming, food production, sustainability' },
  { name: 'Computer Studies', icon: Monitor, emoji: '💻', description: 'Technology, programming, digital literacy' },
  { name: 'Art & Design', icon: Palette, emoji: '🎨', description: 'Creativity, visual expression, design' },
  { name: 'Music', icon: Music, emoji: '🎵', description: 'Musical theory, performance, creativity' },
  { name: 'French', icon: Globe, emoji: '🇫🇷', description: 'Foreign language, cultural understanding' },
  { name: 'German', icon: Globe, emoji: '🇩🇪', description: 'Foreign language, cultural understanding' }
];

// TODO: Re-enable when implementing Card 3 grade analyzer
// const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

// Complete KCSE subjects with career data
const SUBJECT_CAREERS = {
  'Mathematics': [
    {
      title: 'Data Scientist',
      match: 95,
      description: 'Use mathematical models to analyze complex data for businesses',
      salary: 'KSh 90,000 - 250,000',
      demand: 'Very High',
      pathway: 'Statistics/Computer Science degree',
      skills: ['Statistics', 'Programming', 'Research']
    },
    {
      title: 'Software Engineer',
      match: 88,
      description: 'Design and develop software applications and systems',
      salary: 'KSh 80,000 - 200,000',
      demand: 'Very High',
      pathway: 'Computer Science degree',
      skills: ['Programming', 'Logic', 'Problem Solving']
    },
    {
      title: 'Actuary',
      match: 92,
      description: 'Assess financial risks using mathematics and statistics',
      salary: 'KSh 80,000 - 200,000',
      demand: 'High',
      pathway: 'Actuarial Science degree',
      skills: ['Risk Analysis', 'Statistics', 'Financial Modeling']
    }
  ],
  'English': [
    {
      title: 'Digital Marketing Manager',
      match: 90,
      description: 'Create and manage online marketing campaigns',
      salary: 'KSh 60,000 - 150,000',
      demand: 'Very High',
      pathway: 'Marketing/Communications degree',
      skills: ['Content Creation', 'Social Media', 'Analytics']
    },
    {
      title: 'Journalist',
      match: 88,
      description: 'Research and report news and stories for media outlets',
      salary: 'KSh 45,000 - 120,000',
      demand: 'Medium',
      pathway: 'Journalism/Communications degree',
      skills: ['Writing', 'Research', 'Interviewing']
    },
    {
      title: 'Content Creator',
      match: 85,
      description: 'Develop engaging content for various digital platforms',
      salary: 'KSh 40,000 - 100,000',
      demand: 'High',
      pathway: 'Communications/Media Studies degree',
      skills: ['Creativity', 'Writing', 'Video Production']
    }
  ],
  'Kiswahili': [
    {
      title: 'Translator/Interpreter',
      match: 95,
      description: 'Translate documents and interpret spoken language',
      salary: 'KSh 45,000 - 85,000',
      demand: 'Medium',
      pathway: 'Languages/Translation Studies degree',
      skills: ['Language Proficiency', 'Cultural Knowledge', 'Communication']
    },
    {
      title: 'Tourism Guide',
      match: 88,
      description: 'Guide tourists and showcase Kenyan culture and heritage',
      salary: 'KSh 35,000 - 70,000',
      demand: 'Medium',
      pathway: 'Tourism/Hospitality degree',
      skills: ['Cultural Knowledge', 'Communication', 'Customer Service']
    },
    {
      title: 'Teacher (Language)',
      match: 85,
      description: 'Teach Kiswahili language and literature in schools',
      salary: 'KSh 35,000 - 70,000',
      demand: 'High',
      pathway: 'Education degree (Language specialization)',
      skills: ['Teaching', 'Language Skills', 'Curriculum Development']
    }
  ],
  'Physics': [
    {
      title: 'Electrical Engineer',
      match: 93,
      description: 'Design and maintain electrical systems and infrastructure',
      salary: 'KSh 75,000 - 190,000',
      demand: 'High',
      pathway: 'Electrical Engineering degree',
      skills: ['Circuit Design', 'Problem Solving', 'Technical Skills']
    },
    {
      title: 'Renewable Energy Specialist',
      match: 90,
      description: 'Develop sustainable energy solutions for the future',
      salary: 'KSh 70,000 - 170,000',
      demand: 'Very High',
      pathway: 'Engineering/Environmental Science degree',
      skills: ['Solar/Wind Technology', 'Sustainability', 'Project Management']
    },
    {
      title: 'Telecommunications Engineer',
      match: 88,
      description: 'Design and maintain communication networks',
      salary: 'KSh 80,000 - 150,000',
      demand: 'High',
      pathway: 'Telecommunications Engineering degree',
      skills: ['Network Design', 'Signal Processing', 'Technical Problem Solving']
    }
  ],
  'Chemistry': [
    {
      title: 'Pharmacist',
      match: 95,
      description: 'Dispense medications and provide pharmaceutical care',
      salary: 'KSh 80,000 - 150,000',
      demand: 'High',
      pathway: 'Pharmacy degree (4 years)',
      skills: ['Drug Knowledge', 'Patient Care', 'Chemistry']
    },
    {
      title: 'Chemical Engineer',
      match: 92,
      description: 'Design processes for manufacturing chemicals and materials',
      salary: 'KSh 80,000 - 200,000',
      demand: 'High',
      pathway: 'Chemical Engineering degree',
      skills: ['Process Design', 'Safety Management', 'Quality Control']
    },
    {
      title: 'Laboratory Technician',
      match: 85,
      description: 'Conduct chemical analysis and laboratory tests',
      salary: 'KSh 40,000 - 80,000',
      demand: 'High',
      pathway: 'Laboratory Technology diploma/degree',
      skills: ['Laboratory Skills', 'Analysis', 'Attention to Detail']
    }
  ],
  'Biology': [
    {
      title: 'Medical Doctor',
      match: 98,
      description: 'Diagnose and treat illnesses and injuries to save lives',
      salary: 'KSh 150,000 - 400,000',
      demand: 'High',
      pathway: 'Medicine degree (6 years)',
      skills: ['Diagnosis', 'Patient Care', 'Medical Knowledge']
    },
    {
      title: 'Nurse',
      match: 95,
      description: 'Provide patient care and support in healthcare settings',
      salary: 'KSh 40,000 - 80,000',
      demand: 'Very High',
      pathway: 'Nursing degree (4 years)',
      skills: ['Patient Care', 'Medical Procedures', 'Compassion']
    },
    {
      title: 'Veterinarian',
      match: 90,
      description: 'Diagnose and treat diseases in animals',
      salary: 'KSh 80,000 - 150,000',
      demand: 'Medium',
      pathway: 'Veterinary Medicine degree (5 years)',
      skills: ['Animal Care', 'Diagnosis', 'Surgery']
    }
  ],
  'Geography': [
    {
      title: 'Urban Planner',
      match: 90,
      description: 'Plan and design urban development projects',
      salary: 'KSh 70,000 - 130,000',
      demand: 'Medium',
      pathway: 'Urban Planning degree',
      skills: ['Spatial Analysis', 'Project Management', 'Environmental Planning']
    },
    {
      title: 'GIS Specialist',
      match: 88,
      description: 'Analyze geographic data using mapping technology',
      salary: 'KSh 60,000 - 120,000',
      demand: 'Medium',
      pathway: 'Geography/GIS degree',
      skills: ['GIS Software', 'Data Analysis', 'Mapping']
    },
    {
      title: 'Environmental Consultant',
      match: 85,
      description: 'Assess environmental impact and provide solutions',
      salary: 'KSh 65,000 - 125,000',
      demand: 'Medium',
      pathway: 'Environmental Science degree',
      skills: ['Environmental Assessment', 'Research', 'Report Writing']
    }
  ],
  'History': [
    {
      title: 'Lawyer',
      match: 88,
      description: 'Represent clients and provide legal advice',
      salary: 'KSh 80,000 - 200,000',
      demand: 'Medium',
      pathway: 'Law degree (LLB)',
      skills: ['Legal Research', 'Critical Thinking', 'Communication']
    },
    {
      title: 'Museum Curator',
      match: 85,
      description: 'Manage museum collections and educational programs',
      salary: 'KSh 50,000 - 100,000',
      demand: 'Low',
      pathway: 'History/Museum Studies degree',
      skills: ['Research', 'Cultural Knowledge', 'Education']
    },
    {
      title: 'Archivist',
      match: 80,
      description: 'Preserve and organize historical documents and records',
      salary: 'KSh 40,000 - 80,000',
      demand: 'Low',
      pathway: 'History/Information Science degree',
      skills: ['Organization', 'Research', 'Preservation']
    }
  ],
  'Business Studies': [
    {
      title: 'Business Analyst',
      match: 92,
      description: 'Analyze business processes and recommend improvements',
      salary: 'KSh 70,000 - 150,000',
      demand: 'High',
      pathway: 'Business Administration degree',
      skills: ['Analysis', 'Problem Solving', 'Communication']
    },
    {
      title: 'Marketing Manager',
      match: 88,
      description: 'Develop and implement marketing strategies',
      salary: 'KSh 80,000 - 180,000',
      demand: 'High',
      pathway: 'Marketing/Business degree',
      skills: ['Marketing Strategy', 'Creativity', 'Project Management']
    },
    {
      title: 'Human Resources Manager',
      match: 85,
      description: 'Manage employee relations and organizational development',
      salary: 'KSh 70,000 - 140,000',
      demand: 'Medium',
      pathway: 'Human Resources/Business degree',
      skills: ['People Management', 'Communication', 'Conflict Resolution']
    }
  ],
  'Economics': [
    {
      title: 'Financial Analyst',
      match: 92,
      description: 'Analyze financial data and market trends',
      salary: 'KSh 80,000 - 160,000',
      demand: 'High',
      pathway: 'Economics/Finance degree',
      skills: ['Financial Analysis', 'Data Interpretation', 'Research']
    },
    {
      title: 'Bank Manager',
      match: 88,
      description: 'Manage banking operations and client relationships',
      salary: 'KSh 100,000 - 200,000',
      demand: 'Medium',
      pathway: 'Economics/Banking degree',
      skills: ['Financial Management', 'Leadership', 'Customer Service']
    },
    {
      title: 'Policy Analyst',
      match: 85,
      description: 'Research and analyze government and organizational policies',
      salary: 'KSh 70,000 - 130,000',
      demand: 'Medium',
      pathway: 'Economics/Public Policy degree',
      skills: ['Policy Research', 'Critical Thinking', 'Writing']
    }
  ],
  'Agriculture': [
    {
      title: 'Agricultural Extension Officer',
      match: 90,
      description: 'Provide farming advice and support to rural communities',
      salary: 'KSh 45,000 - 80,000',
      demand: 'High',
      pathway: 'Agricultural Science degree',
      skills: ['Farming Knowledge', 'Community Engagement', 'Training']
    },
    {
      title: 'Food Scientist',
      match: 88,
      description: 'Develop and improve food products and safety',
      salary: 'KSh 60,000 - 120,000',
      demand: 'Medium',
      pathway: 'Food Science/Technology degree',
      skills: ['Food Safety', 'Research', 'Quality Control']
    },
    {
      title: 'Agricultural Engineer',
      match: 85,
      description: 'Design farming equipment and irrigation systems',
      salary: 'KSh 70,000 - 130,000',
      demand: 'Medium',
      pathway: 'Agricultural Engineering degree',
      skills: ['Engineering Design', 'Problem Solving', 'Technology']
    }
  ],
  'Computer Studies': [
    {
      title: 'Software Developer',
      match: 98,
      description: 'Create software applications and systems',
      salary: 'KSh 80,000 - 160,000',
      demand: 'Very High',
      pathway: 'Computer Science degree',
      skills: ['Programming', 'Problem Solving', 'System Design']
    },
    {
      title: 'Cybersecurity Analyst',
      match: 95,
      description: 'Protect computer systems from security threats',
      salary: 'KSh 90,000 - 180,000',
      demand: 'Very High',
      pathway: 'Computer Science/Cybersecurity degree',
      skills: ['Security Analysis', 'Network Protection', 'Risk Assessment']
    },
    {
      title: 'Database Administrator',
      match: 90,
      description: 'Manage and maintain database systems',
      salary: 'KSh 70,000 - 140,000',
      demand: 'High',
      pathway: 'Computer Science/Information Systems degree',
      skills: ['Database Management', 'System Administration', 'Problem Solving']
    }
  ],
  'Art & Design': [
    {
      title: 'Graphic Designer',
      match: 95,
      description: 'Create visual designs for print and digital media',
      salary: 'KSh 40,000 - 100,000',
      demand: 'High',
      pathway: 'Graphic Design degree',
      skills: ['Design Software', 'Creativity', 'Visual Communication']
    },
    {
      title: 'Interior Designer',
      match: 88,
      description: 'Design and plan interior spaces for buildings',
      salary: 'KSh 50,000 - 120,000',
      demand: 'Medium',
      pathway: 'Interior Design degree',
      skills: ['Space Planning', 'Creativity', 'Project Management']
    },
    {
      title: 'Fashion Designer',
      match: 85,
      description: 'Design clothing and fashion accessories',
      salary: 'KSh 35,000 - 90,000',
      demand: 'Medium',
      pathway: 'Fashion Design degree',
      skills: ['Fashion Design', 'Creativity', 'Sewing']
    }
  ],
  'Music': [
    {
      title: 'Music Producer',
      match: 90,
      description: 'Produce and record music for artists and media',
      salary: 'KSh 50,000 - 150,000',
      demand: 'Medium',
      pathway: 'Music Production degree',
      skills: ['Music Production', 'Audio Engineering', 'Creativity']
    },
    {
      title: 'Music Teacher',
      match: 88,
      description: 'Teach music in schools and private institutions',
      salary: 'KSh 35,000 - 70,000',
      demand: 'Medium',
      pathway: 'Music Education degree',
      skills: ['Music Theory', 'Teaching', 'Performance']
    },
    {
      title: 'Sound Engineer',
      match: 85,
      description: 'Manage audio equipment and sound recording',
      salary: 'KSh 45,000 - 100,000',
      demand: 'Medium',
      pathway: 'Audio Engineering degree',
      skills: ['Audio Engineering', 'Technical Skills', 'Attention to Detail']
    }
  ],
  'French': [
    {
      title: 'French Translator',
      match: 95,
      description: 'Translate French documents and interpret conversations',
      salary: 'KSh 50,000 - 100,000',
      demand: 'Medium',
      pathway: 'French/Translation Studies degree',
      skills: ['French Fluency', 'Translation', 'Cultural Knowledge']
    },
    {
      title: 'International Relations Officer',
      match: 88,
      description: 'Manage diplomatic and international business relations',
      salary: 'KSh 80,000 - 160,000',
      demand: 'Low',
      pathway: 'International Relations degree',
      skills: ['Diplomacy', 'Communication', 'Cultural Sensitivity']
    },
    {
      title: 'Tourism Coordinator',
      match: 85,
      description: 'Coordinate tourism activities for French-speaking visitors',
      salary: 'KSh 45,000 - 90,000',
      demand: 'Medium',
      pathway: 'Tourism/Hospitality degree',
      skills: ['Customer Service', 'Cultural Knowledge', 'Organization']
    }
  ],
  'German': [
    {
      title: 'German Translator',
      match: 95,
      description: 'Translate German documents and provide interpretation services',
      salary: 'KSh 55,000 - 110,000',
      demand: 'Low',
      pathway: 'German/Translation Studies degree',
      skills: ['German Fluency', 'Translation', 'Cultural Knowledge']
    },
    {
      title: 'Export-Import Manager',
      match: 88,
      description: 'Manage trade relationships with German-speaking countries',
      salary: 'KSh 90,000 - 180,000',
      demand: 'Low',
      pathway: 'International Business degree',
      skills: ['Business Development', 'Negotiation', 'Cultural Understanding']
    },
    {
      title: 'Technical Translator',
      match: 85,
      description: 'Translate technical documents and manuals from German',
      salary: 'KSh 60,000 - 120,000',
      demand: 'Low',
      pathway: 'Technical Communication degree',
      skills: ['Technical Writing', 'German Language', 'Subject Matter Expertise']
    }
  ]
};

export const SubjectCareerMapper: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  // TODO: Uncomment when implementing Card 3 (grade analyzer)
  // const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  // const [grades, setGrades] = useState<SubjectGrades>({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [liveJobData, setLiveJobData] = useState<Record<string, LiveJobData>>({});
  const [liveJobsLoading, setLiveJobsLoading] = useState<string | null>(null);

  // Opt-in function to load live job data for a specific career (not auto-loading)
  const loadLiveJobsForCareer = async (careerTitle: string) => {
    setLiveJobsLoading(careerTitle);

    try {
      const response = await fetch('http://localhost:1337/parse/functions/getCareerJobData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
          careerTitle,
          location: 'kenya'
        })
      });

      const data = await response.json();

      if (data.result?.data) {
        setLiveJobData(prev => ({
          ...prev,
          [careerTitle]: data.result.data
        }));
      } else {
        // Handle error case
        setLiveJobData(prev => ({
          ...prev,
          [careerTitle]: { error: 'Unable to load live jobs. Please try again later.' }
        }));
      }
    } catch (error) {
      console.error(`Failed to load live data for ${careerTitle}:`, error);
      setLiveJobData(prev => ({
        ...prev,
        [careerTitle]: { error: 'Connection failed. Please check your network and try again.' }
      }));
    } finally {
      setLiveJobsLoading(null);
    }
  };

  // TODO: Re-implement these functions when building Card 3 (grade analyzer)
  /*
  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectName)) {
        // Remove subject and its grade
        const newSubjects = prev.filter(s => s !== subjectName);
        const newGrades = { ...grades };
        delete newGrades[subjectName];
        setGrades(newGrades);
        return newSubjects;
      } else if (prev.length < 8) {
        // Add subject (max 8 subjects)
        return [...prev, subjectName];
      }
      return prev;
    });
  };

  const handleGradeChange = (subject: string, grade: string) => {
    setGrades(prev => ({
      ...prev,
      [subject]: grade
    }));
  };
  */

  // TODO: Implement this function when Card 3 (grade analyzer) is ready
  /*
  const handleAnalyze = async () => {
    if (selectedSubjects.length < 3) {
      setError('Please select at least 3 subjects to analyze career compatibility.');
      return;
    }

    const missingGrades = selectedSubjects.filter(subject => !grades[subject]);
    if (missingGrades.length > 0) {
      setError(`Please provide grades for: ${missingGrades.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:1337/parse/functions/analyzeSubjectCareerFit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
          subjects: selectedSubjects,
          grades
        })
      });

      const data = await response.json();

      if (data.result) {
        // Analysis completed successfully
      } else {
        setError('Failed to analyze career compatibility. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  */

  // TODO: Re-implement this function for Card 3 (grade analyzer) when ready
  /*
  const renderGradeEntry = () => (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-orange-600" />
        </div>
        <CardTitle className="text-2xl text-orange-800 mb-2">
          Enter Your KCSE Grades
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Enter your mock exam grades or what you're aiming for in KCSE. We'll calculate your cluster points and show which university courses you qualify for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {selectedSubjects.map(subjectName => {
            const subject = KENYAN_SUBJECTS.find(s => s.name === subjectName);
            const IconComponent = subject?.icon || BookOpen;
            const currentGrade = grades[subjectName] || '';

            return (
              <Card key={subjectName} className="border-2 hover:border-orange-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{subjectName}</h3>
                      <p className="text-xs text-gray-500">{subject?.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Grade:</label>
                    <select
                      value={currentGrade}
                      onChange={(e) => handleGradeChange(subjectName, e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg bg-white transition-colors",
                        currentGrade
                          ? "border-orange-300 ring-1 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      )}
                    >
                      <option value="">Select Grade</option>
                      {GRADES.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Missing Information</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment Hub
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {selectedSubjects.some(s => !grades[s])
                ? "Please enter grades for all subjects to continue"
                : "All grades entered - ready to analyze!"
              }
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || selectedSubjects.some(s => !grades[s])}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Career Matches...
                </>
              ) : (
                <>
                  Discover Your Career Matches
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  */

  // Get currently selected subject data
  const currentSubject = KENYAN_SUBJECTS.find(s => s.name === selectedSubject);
  const currentCareers = SUBJECT_CAREERS[selectedSubject as keyof typeof SUBJECT_CAREERS] || [];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <MapPin className="w-3 h-3 mr-1" />
                Interactive Career Mapping
              </Badge>
              <h1 className="text-3xl font-bold">Subject-to-Career Mapper</h1>
              <p className="text-white/90 text-lg">
                Discover how your KCSE subjects connect to exciting career opportunities in Kenya and beyond.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Select Your Subject
          </CardTitle>
          <p className="text-gray-600">
            Choose a subject you're studying to see how it connects to various career paths
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {KENYAN_SUBJECTS.slice(0, 10).map((subject) => {
              const isSelected = selectedSubject === subject.name;
              const hasCareerData = SUBJECT_CAREERS[subject.name as keyof typeof SUBJECT_CAREERS];

              return (
                <Card
                  key={subject.name}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-md",
                    isSelected
                      ? "ring-2 ring-orange-500 bg-orange-50"
                      : "hover:bg-gray-50",
                    !hasCareerData && "opacity-60"
                  )}
                  onClick={() => setSelectedSubject(subject.name)}
                >
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="text-2xl">{subject.emoji}</div>
                    <div className="text-sm font-medium">{subject.name}</div>
                    {!hasCareerData && (
                      <div className="text-xs text-gray-500">Coming Soon</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Career Connections */}
      {currentSubject && currentCareers.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{currentSubject.emoji}</div>
                <div>
                  <CardTitle className="text-2xl">{currentSubject.name}</CardTitle>
                  <p className="text-gray-600">{currentSubject.description}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Career Opportunities</h3>
              <Badge variant="secondary">
                <TrendingUp className="w-3 h-3 mr-1" />
                {currentCareers.length} Career Paths
              </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {currentCareers.map((career, index) => {
                const careerLiveData = liveJobData[career.title];
                const isLoadingLiveJobs = liveJobsLoading === career.title;
                const hasLiveData = careerLiveData && !careerLiveData.error;
                const hasError = careerLiveData?.error;

                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{career.title}</CardTitle>
                            <Badge className="bg-orange-600 text-white text-xs">
                              {career.match}% Match
                            </Badge>
                            {hasLiveData && careerLiveData.totalJobs && (
                              <Badge className="bg-green-600 text-white text-xs">
                                {careerLiveData.totalJobs} jobs live
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{career.description}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Career Details with Live Data */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Salary Range</div>
                          <div className="text-sm font-medium">
                            {hasLiveData && careerLiveData.salaryRange ? careerLiveData.salaryRange : career.salary}
                            {hasLiveData && careerLiveData.salaryRange && (
                              <span className="text-xs text-green-600 ml-1">(Live)</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Job Demand</div>
                          <Badge className={cn('text-xs', getDemandColor(
                            hasLiveData && careerLiveData.demandLevel ? careerLiveData.demandLevel : career.demand
                          ))}>
                            {hasLiveData && careerLiveData.demandLevel ? careerLiveData.demandLevel : career.demand}
                            {hasLiveData && careerLiveData.demandLevel && (
                              <span className="ml-1">📈</span>
                            )}
                          </Badge>
                        </div>
                      </div>

                      {/* Live Jobs Button or Data */}
                      {!hasLiveData && !isLoadingLiveJobs && !hasError && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => loadLiveJobsForCareer(career.title)}
                          >
                            <TrendingUp className="mr-2 h-3 w-3" />
                            Check Live Job Market
                          </Button>
                          <p className="text-xs text-blue-700 mt-2 text-center">
                            See real job openings and current market demand
                          </p>
                        </div>
                      )}

                      {/* Loading State */}
                      {isLoadingLiveJobs && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-gray-600">Loading live job data...</span>
                          </div>
                        </div>
                      )}

                      {/* Error State */}
                      {hasError && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-700">{careerLiveData.error}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => loadLiveJobsForCareer(career.title)}
                          >
                            Try Again
                          </Button>
                        </div>
                      )}

                      {/* Live Job Opportunities */}
                      {hasLiveData && careerLiveData.recentJobs && careerLiveData.recentJobs.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500">Recent Job Openings</div>
                          <div className="space-y-1">
                            {careerLiveData.recentJobs.slice(0, 2).map((job: JobPosting, jobIndex: number) => (
                              <div key={jobIndex} className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                                <div className="font-medium">{job.company}</div>
                                <div className="text-gray-600">{job.location}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Employers */}
                      {hasLiveData && careerLiveData.topEmployers && careerLiveData.topEmployers.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500">Top Employers Hiring</div>
                          <div className="flex flex-wrap gap-1">
                            {careerLiveData.topEmployers.slice(0, 3).map((employer: string, empIndex: number) => (
                              <Badge key={empIndex} variant="outline" className="text-xs bg-green-50">
                                {employer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education Pathway */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">Education Pathway</div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {career.pathway}
                        </div>
                      </div>

                      {/* Key Skills */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">Key Skills Developed</div>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                          <BookOpen className="mr-2 h-3 w-3" />
                          Learn More
                        </Button>
                        <Button variant="outline">
                          <Target className="mr-2 h-3 w-3" />
                          Plan Path
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Advanced Analysis CTA */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <Badge className="bg-blue-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Advanced Analysis Available
                  </Badge>
                  <h3 className="text-2xl font-bold">Want More Detailed Career Analysis?</h3>
                  <p className="text-gray-600">
                    Get personalized KUCCPS placement analysis, cluster points calculation, and detailed university recommendations based on your actual grades.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAdvancedAnalysis(true)}
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Get Full Analysis
                  </Button>
                  <Button size="lg" variant="outline">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Explore More Subjects
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Analysis Modal/Section - TODO: Re-implement for Card 3 */}
      {showAdvancedAnalysis && (
        <Card className="border-2 border-orange-300">
          <CardHeader>
            <CardTitle className="text-xl text-orange-800">
              Advanced KCSE Career Analysis 📊
            </CardTitle>
            <CardDescription>
              Coming soon: Enter your grades for personalized university placement analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <p className="text-gray-600">This feature will be available soon in the Grade Analyzer card.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubjectCareerMapper;