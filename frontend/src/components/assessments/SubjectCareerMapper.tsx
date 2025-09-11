import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  BookOpen,
  Target,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectGrades {
  [subject: string]: string;
}

interface CareerMatch {
  career: string;
  eligible: boolean;
  clusterPointsRequired: number;
  studentClusterPoints: number;
  gap: number;
  competitiveness: number;
  employmentRate: number;
  averageSalary: number;
  kuccpsCode: string;
}

interface AnalysisResult {
  clusterPoints: number;
  careers: CareerMatch[];
  alternativePathways: string[];
  recommendations: Array<{
    type: string;
    message: string;
  }>;
}

const KENYAN_SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'Geography', 'History', 'Business Studies', 'Economics', 'Agriculture',
  'Computer Studies', 'Art & Design', 'Music', 'French', 'German'
];

const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

export const SubjectCareerMapper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<SubjectGrades>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setAnalysisResult(data.result);
        setCurrentStep(3);
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

  const renderSubjectSelection = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-orange-600" />
          </div>
          Select Your KCSE Subjects
        </CardTitle>
        <CardDescription>
          Choose the subjects you're taking or have taken in KCSE. Select 3-8 subjects for best results.
        </CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Selected: {selectedSubjects.length}/8</span>
          <Progress value={(selectedSubjects.length / 8) * 100} className="flex-1 h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
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

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={() => setCurrentStep(2)}
            disabled={selectedSubjects.length < 3}
          >
            Next: Enter Grades
            <TrendingUp className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderGradeEntry = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Target className="h-6 w-6 text-orange-600" />
          </div>
          Enter Your Grades
        </CardTitle>
        <CardDescription>
          Provide your current or expected KCSE grades for each selected subject.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {selectedSubjects.map(subject => (
            <div key={subject} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">{subject}</span>
              <select
                value={grades[subject] || ''}
                onChange={(e) => handleGradeChange(subject, e.target.value)}
                className="px-3 py-2 border rounded-md bg-white min-w-[80px]"
              >
                <option value="">Select Grade</option>
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
          <Button 
            onClick={handleAnalyze}
            disabled={isLoading || selectedSubjects.some(s => !grades[s])}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Career Compatibility
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!analysisResult) return null;

    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-800">
              Your Subject-Career Analysis Results 🎯
            </CardTitle>
            <CardDescription className="text-lg">
              KCSE Cluster Points: <Badge className="text-lg px-3 py-1 bg-orange-600">{analysisResult.clusterPoints}/84</Badge>
            </CardDescription>
            <p className="text-sm text-gray-600 mt-2">
              Based on your subject combination and grades
            </p>
          </CardHeader>
        </Card>

        {/* Recommendations */}
        {analysisResult.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className={cn(
                    "p-4 rounded-lg border-l-4",
                    rec.type === 'eligible' ? "bg-green-50 border-green-500" : "bg-blue-50 border-blue-500"
                  )}>
                    <p className="text-sm font-medium">{rec.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Compatible Career Paths</CardTitle>
            <CardDescription>
              Careers ranked by your eligibility and competitiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.careers.map((career, index) => (
                <div key={index} className={cn(
                  "p-4 border rounded-lg",
                  career.eligible ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
                )}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {career.eligible ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        {career.career}
                      </h3>
                      <p className="text-sm text-gray-600">KUCCPS Code: {career.kuccpsCode}</p>
                    </div>
                    <Badge className={cn(
                      "px-3 py-1 text-sm",
                      career.eligible ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                    )}>
                      {career.competitiveness}% Competitive
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>Required: {career.clusterPointsRequired} points</span>
                      {career.gap > 0 && <span className="text-red-600">(Gap: {career.gap})</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span>Employment Rate: {Math.round(career.employmentRate * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>Avg Salary: KSh {career.averageSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alternative Pathways */}
        {analysisResult.alternativePathways.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Alternative Education Pathways</CardTitle>
              <CardDescription>
                Other routes to your target careers if direct university admission isn't available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.alternativePathways.map((pathway, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{pathway}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => {
            setCurrentStep(1);
            setSelectedSubjects([]);
            setGrades({});
            setAnalysisResult(null);
            setError(null);
          }}>
            Start New Analysis
          </Button>
          <Button>
            Save Results & Continue
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {currentStep === 1 && renderSubjectSelection()}
      {currentStep === 2 && renderGradeEntry()}
      {currentStep === 3 && renderResults()}
    </div>
  );
};

export default SubjectCareerMapper;