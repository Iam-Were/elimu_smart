import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  BookOpen,
  DollarSign,
  Clock,
  Star,
  Users,
  Award,
  Building,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentProfile {
  subjects: string[];
  grades: { [subject: string]: string };
}

interface AcademicPreferences {
  careerInterests: string[];
  studyDuration: string;
  preferredFields: string[];
}

interface FinancialConstraints {
  maxAnnualFees: number;
  scholarshipRequired: boolean;
  familyIncome: string;
}

interface UniversityMatch {
  universityId: string;
  universityName: string;
  universityType: string;
  location: string;
  kuccpsCode: string;
  program: {
    id: string;
    name: string;
    kuccpsCode: string;
    cutoffPoints: number;
    duration: string;
    subjects: string[];
    careerOutcomes: string[];
    averageSalary: number;
    employmentRate: number;
    annualFees: number;
    scholarships: string[];
    eligible: boolean;
    pointsGap: number;
    matchScore: number;
    hasRequiredSubjects: boolean;
    financiallyViable: boolean;
    affordabilityLevel: string;
    careerOutlook: {
      employmentRate: number;
      averageSalary: number;
      careerGrowth: string;
      industryDemand: string;
    };
    recommendationReason: string;
  };
}

interface FinderResult {
  success: boolean;
  clusterPoints: number;
  matchingPrograms: UniversityMatch[];
  recommendations: Array<{
    type: string;
    title: string;
    message: string;
    priority: string;
  }>;
  summary: {
    totalMatches: number;
    eligiblePrograms: number;
    averageMatchScore: number;
  };
}

const KENYAN_SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'Geography', 'History', 'Business Studies', 'Economics', 'Agriculture',
  'Computer Studies', 'Art & Design', 'Music', 'French', 'German'
];

const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

const CAREER_INTERESTS = [
  'Medicine & Healthcare', 'Engineering & Technology', 'Business & Finance', 
  'Education & Training', 'Agriculture & Environment', 'Arts & Creative',
  'Law & Legal Services', 'Science & Research', 'Social Work & Community',
  'Media & Communication', 'Tourism & Hospitality', 'Sports & Recreation'
];

const KENYAN_LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru', 'Nyeri',
  'Machakos', 'Thika', 'Kericho', 'Embu', 'Any Location'
];

export const UniversityCourseFinder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Academic Profile
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<{ [subject: string]: string }>({});

  // Step 2: Preferences
  const [careerInterests, setCareerInterests] = useState<string[]>([]);
  const [studyDuration, setStudyDuration] = useState('4 years');
  const [preferredFields, setPreferredFields] = useState<string[]>([]);

  // Step 3: Financial & Location
  const [maxAnnualFees, setMaxAnnualFees] = useState(50000);
  const [scholarshipRequired, setScholarshipRequired] = useState(false);
  const [familyIncome, setFamilyIncome] = useState('');
  const [locationPreferences, setLocationPreferences] = useState<string[]>([]);

  // Results
  const [finderResult, setFinderResult] = useState<FinderResult | null>(null);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        const newSubjects = prev.filter(s => s !== subject);
        const newGrades = { ...grades };
        delete newGrades[subject];
        setGrades(newGrades);
        return newSubjects;
      } else if (prev.length < 8) {
        return [...prev, subject];
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

  const handleCareerInterestToggle = (interest: string) => {
    setCareerInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleLocationToggle = (location: string) => {
    if (location === 'Any Location') {
      setLocationPreferences([]);
    } else {
      setLocationPreferences(prev =>
        prev.includes(location)
          ? prev.filter(l => l !== location)
          : [...prev, location]
      );
    }
  };

  const handleFindPrograms = async () => {
    setIsLoading(true);
    setError(null);

    // Validation
    if (selectedSubjects.length < 4) {
      setError('Please select at least 4 subjects (KCSE requirement).');
      setIsLoading(false);
      return;
    }

    const missingGrades = selectedSubjects.filter(subject => !grades[subject]);
    if (missingGrades.length > 0) {
      setError(`Please provide grades for: ${missingGrades.join(', ')}`);
      setIsLoading(false);
      return;
    }

    if (careerInterests.length === 0) {
      setError('Please select at least one career interest to get relevant matches.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:1337/parse/functions/findUniversityCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
          studentProfile: {
            subjects: selectedSubjects,
            grades
          },
          academicPreferences: {
            careerInterests,
            studyDuration,
            preferredFields
          },
          financialConstraints: {
            maxAnnualFees,
            scholarshipRequired,
            familyIncome
          },
          locationPreferences: locationPreferences.length > 0 ? locationPreferences : undefined
        })
      });

      const data = await response.json();

      if (data.result && data.result.success) {
        setFinderResult(data.result);
        setCurrentStep(4);
      } else {
        setError('Failed to find university courses. Please try again.');
      }
    } catch (error) {
      console.error('University Course Finder error:', error);
      setError('Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAffordabilityColor = (level: string) => {
    switch (level) {
      case 'very_affordable': return 'bg-green-100 text-green-800';
      case 'affordable': return 'bg-green-100 text-green-700';
      case 'manageable': return 'bg-yellow-100 text-yellow-800';
      case 'stretch': return 'bg-orange-100 text-orange-800';
      case 'expensive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 65) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const renderAcademicProfile = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-orange-600" />
          </div>
          Your Academic Profile
        </CardTitle>
        <CardDescription>
          Enter your KCSE subjects and current/expected grades to find compatible programs
        </CardDescription>
        <Progress value={(currentStep / 4) * 100} className="w-full h-2" />
      </CardHeader>
      <CardContent>
        {/* Subject Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Your KCSE Subjects</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {KENYAN_SUBJECTS.map(subject => (
              <button
                key={subject}
                onClick={() => handleSubjectToggle(subject)}
                className={cn(
                  "p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                  selectedSubjects.includes(subject)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gray-50",
                  selectedSubjects.length >= 8 && !selectedSubjects.includes(subject) && "opacity-50 cursor-not-allowed"
                )}
                disabled={selectedSubjects.length >= 8 && !selectedSubjects.includes(subject)}
              >
                {selectedSubjects.includes(subject) && (
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                )}
                {subject}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">Selected: {selectedSubjects.length}/8 subjects</p>
        </div>

        {/* Grade Entry */}
        {selectedSubjects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Enter Your Grades</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {selectedSubjects.map(subject => (
                <div key={subject} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{subject}</span>
                  <select
                    value={grades[subject] || ''}
                    onChange={(e) => handleGradeChange(subject, e.target.value)}
                    className="px-3 py-1 border rounded-md bg-white min-w-[80px]"
                  >
                    <option value="">Grade</option>
                    {GRADES.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={() => setCurrentStep(2)}
            disabled={selectedSubjects.length < 4 || selectedSubjects.some(s => !grades[s])}
          >
            Next: Preferences
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreferences = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Star className="h-6 w-6 text-orange-600" />
          </div>
          Academic Preferences
        </CardTitle>
        <CardDescription>
          Tell us about your career interests and study preferences
        </CardDescription>
        <Progress value={(currentStep / 4) * 100} className="w-full h-2" />
      </CardHeader>
      <CardContent>
        {/* Career Interests */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Career Interests</h3>
          <p className="text-sm text-gray-600 mb-4">Select areas you're interested in pursuing (choose 1-3)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CAREER_INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => handleCareerInterestToggle(interest)}
                className={cn(
                  "p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left",
                  careerInterests.includes(interest)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                )}
              >
                {careerInterests.includes(interest) && (
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                )}
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Study Duration Preference */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Preferred Study Duration</h3>
          <div className="flex gap-4">
            {['3 years', '4 years', '5+ years', 'Any duration'].map(duration => (
              <button
                key={duration}
                onClick={() => setStudyDuration(duration)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200",
                  studyDuration === duration
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                )}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <Button 
            onClick={() => setCurrentStep(3)}
            disabled={careerInterests.length === 0}
          >
            Next: Constraints
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderConstraints = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          Financial & Location Preferences
        </CardTitle>
        <CardDescription>
          Help us find programs that fit your budget and location preferences
        </CardDescription>
        <Progress value={(currentStep / 4) * 100} className="w-full h-2" />
      </CardHeader>
      <CardContent>
        {/* Financial Constraints */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Financial Considerations</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Maximum Annual Fees (KSh): {maxAnnualFees.toLocaleString()}
            </label>
            <input
              type="range"
              min="20000"
              max="300000"
              step="10000"
              value={maxAnnualFees}
              onChange={(e) => setMaxAnnualFees(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20K</span>
              <span>100K</span>
              <span>200K</span>
              <span>300K+</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={scholarshipRequired}
                onChange={(e) => setScholarshipRequired(e.target.checked)}
                className="mr-2"
              />
              I need scholarship/financial aid
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Family Income Range</label>
            <select
              value={familyIncome}
              onChange={(e) => setFamilyIncome(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="">Select range (optional)</option>
              <option value="below-50k">Below KSh 50,000/month</option>
              <option value="50k-100k">KSh 50,000 - 100,000/month</option>
              <option value="100k-200k">KSh 100,000 - 200,000/month</option>
              <option value="above-200k">Above KSh 200,000/month</option>
            </select>
          </div>
        </div>

        {/* Location Preferences */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Location Preferences</h3>
          <p className="text-sm text-gray-600 mb-4">Where would you like to study? (optional - leave blank for all locations)</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {KENYAN_LOCATIONS.map(location => (
              <button
                key={location}
                onClick={() => handleLocationToggle(location)}
                className={cn(
                  "p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                  (locationPreferences.includes(location) || (location === 'Any Location' && locationPreferences.length === 0))
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                )}
              >
                {(locationPreferences.includes(location) || (location === 'Any Location' && locationPreferences.length === 0)) && (
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                )}
                {location}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(2)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preferences
          </Button>
          <Button onClick={handleFindPrograms} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finding Programs...
              </>
            ) : (
              <>
                Find My Programs
                <Calculator className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!finderResult) return null;

    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-800">
              University Program Matches 🎓
            </CardTitle>
            <CardDescription className="text-lg">
              KCSE Cluster Points: <Badge className="text-lg px-3 py-1 bg-orange-600">{finderResult.clusterPoints}/84</Badge>
            </CardDescription>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{finderResult.summary.totalMatches}</div>
                <div className="text-gray-600">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{finderResult.summary.eligiblePrograms}</div>
                <div className="text-gray-600">Eligible Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(finderResult.summary.averageMatchScore)}%</div>
                <div className="text-gray-600">Avg Match Score</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Recommendations */}
        {finderResult.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {finderResult.recommendations.map((rec, index) => (
                  <div key={index} className={cn(
                    "p-4 rounded-lg border-l-4",
                    rec.priority === 'high' ? "bg-red-50 border-red-500" :
                    rec.priority === 'medium' ? "bg-yellow-50 border-yellow-500" : "bg-blue-50 border-blue-500"
                  )}>
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-700">{rec.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Program Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Your Program Matches</CardTitle>
            <CardDescription>
              Programs ranked by compatibility with your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {finderResult.matchingPrograms.map((match, index) => (
                <div key={index} className={cn(
                  "p-6 border rounded-lg",
                  match.program.eligible ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {match.program.eligible ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-orange-600" />
                        )}
                        <h3 className="text-xl font-semibold">{match.program.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {match.universityName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {match.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {match.program.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{match.program.recommendationReason}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn("px-3 py-1 text-sm mb-2", getMatchScoreColor(match.program.matchScore))}>
                        {match.program.matchScore}% Match
                      </Badge>
                      <div className="text-sm">
                        <div className="font-medium">KUCCPS: {match.program.kuccpsCode}</div>
                        <div className={cn("font-medium", match.program.eligible ? "text-green-600" : "text-orange-600")}>
                          Cutoff: {match.program.cutoffPoints} points
                          {match.program.pointsGap > 0 && (
                            <span className="text-red-600"> (Gap: {match.program.pointsGap})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Annual Fees</span>
                      </div>
                      <div className="text-lg font-semibold">KSh {match.program.annualFees.toLocaleString()}</div>
                      <Badge className={cn("text-xs mt-1", getAffordabilityColor(match.program.affordabilityLevel))}>
                        {match.program.affordabilityLevel.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Employment Rate</span>
                      </div>
                      <div className="text-lg font-semibold">{Math.round(match.program.employmentRate * 100)}%</div>
                      <div className="text-xs text-gray-600">{match.program.careerOutlook.careerGrowth} growth</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Avg Salary</span>
                      </div>
                      <div className="text-lg font-semibold">KSh {match.program.averageSalary.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{match.program.careerOutlook.industryDemand} demand</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Scholarships</span>
                      </div>
                      <div className="text-sm">
                        {match.program.scholarships.slice(0, 2).map((scholarship, idx) => (
                          <div key={idx} className="text-gray-700">{scholarship}</div>
                        ))}
                        {match.program.scholarships.length > 2 && (
                          <div className="text-gray-500">+{match.program.scholarships.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="mb-2">
                      <span className="font-medium text-sm">Career Outcomes: </span>
                      <span className="text-sm text-gray-700">
                        {match.program.careerOutcomes.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Required Subjects: </span>
                      <span className="text-sm text-gray-700">
                        {match.program.subjects.join(', ')}
                      </span>
                      {!match.program.hasRequiredSubjects && (
                        <span className="text-red-600 text-sm ml-2">⚠️ Missing required subjects</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => {
            setCurrentStep(1);
            setFinderResult(null);
            setError(null);
          }}>
            Start New Search
          </Button>
          <Button>
            Save Results & Get Guidance
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {currentStep === 1 && renderAcademicProfile()}
      {currentStep === 2 && renderPreferences()}
      {currentStep === 3 && renderConstraints()}
      {currentStep === 4 && renderResults()}
    </div>
  );
};

export default UniversityCourseFinder;