import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { getParse } from '@/config/parse';
import { callCloudFunction } from '@/lib/parseConfig';
import {
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
  FileText,
  Award,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Career from backend database
interface Career {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  description: string;
  salaryRange: string;
  demand: string;
  kuccpsPathway: string;
  skills: string[];
  minClusterPoints?: number;
  employmentRate?: number;
  avgSalary?: number;
}

// Legacy interface for compatibility
interface LegacyCareer {
  title: string;
  match: number;
  description: string;
  salary: string;
  demand: string;
  pathway: string;
  skills: string[];
}

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

// Career data now fetched from backend via getCareersBySubject Cloud Function
// Previously: 466 lines of hardcoded data (SUBJECT_CAREERS object)
// Now: Dynamic backend API integration with Parse Career Class

export const SubjectCareerMapper: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoadingCareers, setIsLoadingCareers] = useState(false);
  const [careerError, setCareerError] = useState<string | null>(null);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [liveJobData, setLiveJobData] = useState<Record<string, LiveJobData>>({});
  const [liveJobsLoading, setLiveJobsLoading] = useState<string | null>(null);
  const [selectedCareerForDetails, setSelectedCareerForDetails] = useState<string | null>(null);
  const [careerDetails, setCareerDetails] = useState<{
    description?: string;
    dailyTasks?: string[];
    skills?: string[];
    personalityTraits?: string[];
    careerProgression?: string;
    educationPath?: string;
    educationLevel?: string;
    kenyaSpecific?: {
      majorEmployers?: string[];
      universities?: string[];
      [key: string]: unknown;
    };
    error?: string;
    [key: string]: unknown;
  } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showPlanPathModal, setShowPlanPathModal] = useState(false);

  // Fetch careers from backend when subject changes
  useEffect(() => {
    console.log('🔍 useEffect fired! Selected subject:', selectedSubject);

    const fetchCareers = async () => {
      console.log('📡 Fetching careers for subject:', selectedSubject);
      setIsLoadingCareers(true);
      setCareerError(null);

      try {
        const Parse = await getParse();
        console.log('✅ Parse SDK ready, calling getCareersBySubject');
        const result = await Parse.Cloud.run('getCareersBySubject', {
          subject: selectedSubject
        });

        console.log('✅ Received careers:', result?.length || 0);
        setCareers(result || []);
      } catch (error) {
        console.error('❌ Failed to fetch careers:', error);
        setCareerError('Failed to load careers. Please try again.');
        setCareers([]);
      } finally {
        setIsLoadingCareers(false);
      }
    };

    fetchCareers();
  }, [selectedSubject]);

  // Opt-in function to load live job data for a specific career (not auto-loading)
  const loadLiveJobsForCareer = async (careerTitle: string) => {
    setLiveJobsLoading(careerTitle);

    try {
      const result = await callCloudFunction(
        'getCareerJobData',
        {
          careerTitle,
          location: 'kenya'
        },
        localStorage.getItem('parse-session-token') || ''
      );

      if (result?.data) {
        setLiveJobData(prev => ({
          ...prev,
          [careerTitle]: result.data
        }));
      } else {
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

  // Load detailed career information
  const handleLearnMore = async (careerTitle: string) => {
    setSelectedCareerForDetails(careerTitle);
    setIsLoadingDetails(true);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getCareerDetails', {
        careerTitle
      });

      // Extract career data from response
      if (result && result.career) {
        setCareerDetails(result.career);
      } else {
        setCareerDetails(result);
      }
    } catch (error) {
      console.error(`Failed to load career details for ${careerTitle}:`, error);
      setCareerDetails({ error: 'Failed to load career details. Please try again.' });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Load career pathway with skills roadmap and certificates
  const handlePlanPath = async (careerTitle: string) => {
    setSelectedCareerForDetails(careerTitle);
    setShowPlanPathModal(true);
    setIsLoadingDetails(true);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getCareerDetails', {
        careerTitle
      });

      // Extract career data from response
      if (result && result.career) {
        setCareerDetails(result.career);
      } else {
        setCareerDetails(result);
      }
    } catch (error) {
      console.error(`Failed to load career pathway for ${careerTitle}:`, error);
      setCareerDetails({ error: 'Failed to load career pathway. Please try again.' });
    } finally {
      setIsLoadingDetails(false);
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
      const result = await callCloudFunction(
        'analyzeSubjectCareerFit',
        {
          subjects: selectedSubjects,
          grades
        },
        localStorage.getItem('parse-session-token') || ''
      );

      if (result) {
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

  // Convert backend Career format to legacy format for compatibility
  const currentCareers: LegacyCareer[] = careers.map(career => ({
    title: career.title,
    match: career.matchScore,
    description: career.description,
    salary: career.salaryRange,
    demand: career.demand,
    pathway: career.kuccpsPathway,
    skills: career.skills
  }));

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

              return (
                <div
                  key={subject.name}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-md",
                    "border rounded-lg p-4 text-center space-y-2 bg-white",
                    isSelected
                      ? "ring-2 ring-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => {
                    console.log('🖱️ Subject card clicked:', subject.name);
                    setSelectedSubject(subject.name);
                    console.log('✅ setState called for:', subject.name);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      console.log('🖱️ Subject card clicked:', subject.name);
                      setSelectedSubject(subject.name);
                      console.log('✅ setState called for:', subject.name);
                    }
                  }}
                >
                  <div className="text-2xl">{subject.emoji}</div>
                  <div className="text-sm font-medium">{subject.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Career Connections */}
      {currentSubject && (
        <div className="space-y-6">
          {/* Loading State */}
          {isLoadingCareers && (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-500" />
                <p className="text-lg font-medium text-gray-700">Loading careers for {currentSubject.name}...</p>
                <p className="text-sm text-gray-500 mt-2">This will take just a moment</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {careerError && !isLoadingCareers && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium text-gray-700 mb-2">{careerError}</p>
                <Button
                  onClick={() => {
                    setSelectedSubject(currentSubject.name);
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Career Data */}
          {!isLoadingCareers && !careerError && currentCareers.length > 0 && (
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Career Opportunities</h3>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {currentCareers.length} Career Paths
              </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 max-w-6xl mx-auto">
              {currentCareers.map((career, index) => {
                const careerLiveData = liveJobData[career.title];
                const isLoadingLiveJobs = liveJobsLoading === career.title;
                const hasLiveData = careerLiveData && !careerLiveData.error;
                const hasError = careerLiveData?.error;

                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <CardTitle className="text-base">{career.title}</CardTitle>
                            <Badge className="bg-orange-600 text-white text-xs">
                              {career.match}% Match
                            </Badge>
                            {hasLiveData && careerLiveData.totalJobs && (
                              <Badge className="bg-green-600 text-white text-xs">
                                {careerLiveData.totalJobs} jobs
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed">{career.description}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {/* Career Details with Live Data */}
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Salary Range</div>
                          <div className="text-xs font-medium">
                            {hasLiveData && careerLiveData.salaryRange ? careerLiveData.salaryRange : career.salary}
                            {hasLiveData && careerLiveData.salaryRange && (
                              <span className="text-xs text-green-600 ml-1">(Live)</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Job Demand</div>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={() => loadLiveJobsForCareer(career.title)}
                        >
                          <TrendingUp className="mr-1.5 h-3 w-3" />
                          Check Live Job Market
                        </Button>
                      )}

                      {/* Loading State */}
                      {isLoadingLiveJobs && (
                        <div className="p-2 bg-gray-50 rounded border border-gray-200">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            <span className="text-xs text-gray-600">Loading...</span>
                          </div>
                        </div>
                      )}

                      {/* Error State */}
                      {hasError && (
                        <div className="p-2 bg-red-50 rounded border border-red-200 flex items-center justify-between">
                          <p className="text-xs text-red-700 flex items-center gap-1.5">
                            <AlertCircle className="h-3 w-3" />
                            {careerLiveData.error}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs text-red-700 hover:bg-red-100"
                            onClick={() => loadLiveJobsForCareer(career.title)}
                          >
                            Retry
                          </Button>
                        </div>
                      )}

                      {/* Live Job Opportunities */}
                      {hasLiveData && careerLiveData.recentJobs && careerLiveData.recentJobs.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Recent Jobs</div>
                          <div className="space-y-1">
                            {careerLiveData.recentJobs.slice(0, 2).map((job: JobPosting, jobIndex: number) => (
                              <div key={jobIndex} className="text-[11px] p-1.5 bg-blue-50 rounded border-l-2 border-blue-400">
                                <div className="font-medium">{job.company}</div>
                                <div className="text-gray-600">{job.location}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Employers */}
                      {hasLiveData && careerLiveData.topEmployers && careerLiveData.topEmployers.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Top Employers</div>
                          <div className="flex flex-wrap gap-1">
                            {careerLiveData.topEmployers.slice(0, 3).map((employer: string, empIndex: number) => (
                              <Badge key={empIndex} variant="outline" className="text-[10px] bg-green-50 h-5">
                                {employer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education Pathway */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">Education Pathway</div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {career.pathway}
                        </div>
                      </div>

                      {/* Key Skills */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">Key Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] h-5">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="flex-1 bg-orange-600 hover:bg-orange-700 h-8 text-xs"
                          onClick={() => handleLearnMore(career.title)}
                        >
                          <BookOpen className="mr-1.5 h-3 w-3" />
                          Learn More
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => handlePlanPath(career.title)}
                        >
                          <Target className="mr-1.5 h-3 w-3" />
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

      {/* Learn More Modal */}
      <Dialog open={!!selectedCareerForDetails && !showPlanPathModal} onOpenChange={(open) => !open && setSelectedCareerForDetails(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-800">
              {selectedCareerForDetails}
            </DialogTitle>
            <DialogDescription>
              Comprehensive career information and insights
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="p-12 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-500" />
              <p className="text-lg font-medium text-gray-700">Loading career details...</p>
            </div>
          ) : careerDetails && 'error' in careerDetails ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-lg font-medium text-gray-700">{String(careerDetails.error)}</p>
              <Button onClick={() => selectedCareerForDetails && handleLearnMore(selectedCareerForDetails)} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : careerDetails ? (
            <div className="space-y-6">
              {/* Description */}
              {careerDetails.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About This Career</h3>
                  <p className="text-gray-700">{String(careerDetails.description)}</p>
                </div>
              )}

              {/* Daily Tasks */}
              {Array.isArray(careerDetails.dailyTasks) && careerDetails.dailyTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Day-to-Day Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {(careerDetails.dailyTasks as string[]).map((task, i) => (
                      <li key={i} className="text-gray-700">{task}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              {Array.isArray(careerDetails.skills) && careerDetails.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Essential Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(careerDetails.skills as string[]).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-sm">
                        {String(skill)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Personality Traits */}
              {Array.isArray(careerDetails.personalityTraits) && careerDetails.personalityTraits.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personality Fit</h3>
                  <div className="flex flex-wrap gap-2">
                    {(careerDetails.personalityTraits as string[]).map((trait, i) => (
                      <Badge key={i} className="bg-purple-100 text-purple-700 text-sm">
                        {String(trait)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Progression */}
              {careerDetails.careerProgression && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Career Progression Path</h3>
                  <p className="text-gray-700">{String(careerDetails.careerProgression)}</p>
                </div>
              )}

              {/* Kenya-Specific Info */}
              {careerDetails.kenyaSpecific && typeof careerDetails.kenyaSpecific === 'object' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Opportunities in Kenya</h3>
                  {Array.isArray((careerDetails.kenyaSpecific as Record<string, unknown>).majorEmployers) && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Major Employers</h4>
                      <div className="flex flex-wrap gap-2">
                        {((careerDetails.kenyaSpecific as Record<string, unknown>).majorEmployers as string[]).map((employer, i) => (
                          <Badge key={i} variant="outline" className="bg-green-50 text-sm">
                            {employer}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray((careerDetails.kenyaSpecific as Record<string, unknown>).universities) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Universities Offering Programs</h4>
                      <div className="flex flex-wrap gap-2">
                        {((careerDetails.kenyaSpecific as Record<string, unknown>).universities as string[]).map((uni, i) => (
                          <Badge key={i} variant="outline" className="bg-blue-50 text-sm">
                            {uni}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Plan Path Modal */}
      <Dialog open={showPlanPathModal} onOpenChange={(open) => {
        if (!open) {
          setShowPlanPathModal(false);
          setSelectedCareerForDetails(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-800">
              Learning Pathway: {selectedCareerForDetails}
            </DialogTitle>
            <DialogDescription>
              Skills roadmap, certificates, and courses to reach your career goal
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="p-12 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-500" />
              <p className="text-lg font-medium text-gray-700">Loading learning pathway...</p>
            </div>
          ) : careerDetails && 'error' in careerDetails ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-lg font-medium text-gray-700">{String(careerDetails.error)}</p>
              <Button onClick={() => selectedCareerForDetails && handlePlanPath(selectedCareerForDetails)} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : careerDetails ? (
            <div className="space-y-6">
              {/* Education Pathway */}
              {careerDetails.educationPath && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Education Foundation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{String(careerDetails.educationPath)}</p>
                    {careerDetails.educationLevel && (
                      <Badge className="mt-2 bg-blue-600 text-white">
                        Level Required: {String(careerDetails.educationLevel)}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Skills Roadmap */}
              {Array.isArray(careerDetails.skills) && careerDetails.skills.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Skills Roadmap
                    </CardTitle>
                    <CardDescription>Master these skills to excel in this career</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">🌱 Beginner Skills (0-6 months)</h4>
                        <div className="flex flex-wrap gap-2">
                          {careerDetails.skills.slice(0, Math.ceil((careerDetails.skills as string[]).length / 3)).map((skill, i) => (
                            <Badge key={i} variant="outline" className="bg-white">
                              {String(skill)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">🌿 Intermediate Skills (6-18 months)</h4>
                        <div className="flex flex-wrap gap-2">
                          {careerDetails.skills.slice(
                            Math.ceil((careerDetails.skills as string[]).length / 3),
                            Math.ceil((careerDetails.skills as string[]).length * 2 / 3)
                          ).map((skill, i) => (
                            <Badge key={i} variant="outline" className="bg-white">
                              {String(skill)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">🌳 Advanced Skills (18+ months)</h4>
                        <div className="flex flex-wrap gap-2">
                          {careerDetails.skills.slice(Math.ceil((careerDetails.skills as string[]).length * 2 / 3)).map((skill, i) => (
                            <Badge key={i} variant="outline" className="bg-white">
                              {String(skill)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certificates & Courses */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Recommended Certificates & Courses
                  </CardTitle>
                  <CardDescription>Boost your credentials and stand out</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Professional Certifications */}
                    <div>
                      <h4 className="font-medium text-purple-800 mb-2">🏆 Professional Certifications</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span className="text-sm text-gray-700">Industry-recognized certifications (CPA, AWS, Google, etc.) - Check professional bodies in Kenya</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span className="text-sm text-gray-700">Specialized training programs from {careerDetails.kenyaSpecific && typeof careerDetails.kenyaSpecific === 'object' && Array.isArray((careerDetails.kenyaSpecific as Record<string, unknown>).majorEmployers) ? ((careerDetails.kenyaSpecific as Record<string, unknown>).majorEmployers as string[])[0] : 'top employers'}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Online Courses */}
                    <div>
                      <h4 className="font-medium text-purple-800 mb-2">📚 Online Courses & Resources</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span className="text-sm text-gray-700">Coursera / edX - University-level courses (Free with certificate option)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span className="text-sm text-gray-700">Udemy - Practical skills courses (Often on sale for KSh 1,500-3,000)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                          <span className="text-sm text-gray-700">YouTube - Free tutorials and industry insights</span>
                        </li>
                      </ul>
                    </div>

                    {/* Timeline */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">⏱️ Estimated Timeline</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Beginner to Job-Ready:</strong> 18-24 months with consistent learning
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Investment:</strong> KSh 50,000 - 200,000 (mix of free and paid resources)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Universities in Kenya */}
              {careerDetails.kenyaSpecific && typeof careerDetails.kenyaSpecific === 'object' && Array.isArray((careerDetails.kenyaSpecific as Record<string, unknown>).universities) && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5 text-orange-600" />
                      University Programs in Kenya
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {((careerDetails.kenyaSpecific as Record<string, unknown>).universities as string[]).map((uni, i) => (
                        <Badge key={i} variant="outline" className="bg-white text-sm">
                          {uni}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectCareerMapper;