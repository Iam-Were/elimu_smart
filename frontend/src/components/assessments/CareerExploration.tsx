import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  MapPin,
  Clock,
  BookOpen,
  Users,
  Building,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  Award,
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Career {
  id: string;
  title: string;
  category: string;
  averageSalary: number;
  salaryRange: { min: number; max: number };
  educationLevel: string;
  educationPath: string;
  keySubjects: string[];
  workEnvironment: string;
  jobOutlook: string;
  industryGrowth: string;
  employmentRate: number;
  description: string;
  dailyTasks: string[];
  skills: string[];
  personalityTraits: string[];
  careerProgression: string;
  challenges: string[];
  rewards: string[];
  relatedCareers: string[];
  kenyaSpecific: {
    majorEmployers: string[];
    universities?: string[];
    licensingBody?: string;
    [key: string]: any;
  };
  matchScore?: number;
  personalizedInsights?: Array<{
    type: string;
    title: string;
    message: string;
  }>;
}

interface ExplorationResult {
  success: boolean;
  careers: Career[];
  insights: Array<{
    type: string;
    title: string;
    message: string;
  }>;
  metadata: {
    totalResults: number;
    returnedResults: number;
    filters: any;
    sortBy: string;
  };
}

const CAREER_CATEGORIES = [
  'Healthcare & Medical',
  'Technology & IT',
  'Engineering',
  'Education',
  'Business & Finance',
  'Law & Legal Services',
  'Arts & Creative',
  'Science & Research'
];

const SALARY_RANGES = [
  { label: 'Below 200K', min: 0, max: 200000 },
  { label: '200K - 300K', min: 200000, max: 300000 },
  { label: '300K - 500K', min: 300000, max: 500000 },
  { label: 'Above 500K', min: 500000, max: 1000000 }
];

const EDUCATION_LEVELS = [
  'Certificate',
  'Diploma',
  'University Degree',
  'Postgraduate'
];

const JOB_OUTLOOKS = [
  'excellent',
  'good',
  'stable',
  'declining'
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'salary', label: 'Highest Salary' },
  { value: 'growth', label: 'Growth Potential' },
  { value: 'employment', label: 'Employment Rate' },
  { value: 'alphabetical', label: 'A-Z' }
];

export const CareerExploration: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<any>(null);
  const [selectedEducation, setSelectedEducation] = useState('');
  const [selectedOutlook, setSelectedOutlook] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [explorationResult, setExplorationResult] = useState<ExplorationResult | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Initialize with default search
  useEffect(() => {
    handleSearch();
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters: any = {};
      
      if (selectedCategories.length > 0) {
        filters.categories = selectedCategories;
      }
      
      if (selectedSalaryRange) {
        filters.salaryRange = selectedSalaryRange;
      }
      
      if (selectedEducation) {
        filters.educationLevel = selectedEducation;
      }
      
      if (selectedOutlook) {
        filters.jobOutlook = selectedOutlook;
      }

      const response = await fetch('http://localhost:1337/parse/functions/exploreCareers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
          filters: Object.keys(filters).length > 0 ? filters : undefined,
          searchQuery: searchQuery.trim() || undefined,
          sortBy,
          limit: 20
        })
      });

      const data = await response.json();

      if (data.result && data.result.success) {
        setExplorationResult(data.result);
      } else {
        setError('Failed to explore careers. Please try again.');
      }
    } catch (error) {
      console.error('Career Exploration error:', error);
      setError('Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCareerDetails = async (careerId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:1337/parse/functions/getCareerDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': 'elimu-smart-local-dev',
          'X-Parse-Session-Token': localStorage.getItem('elimu-auth-token') || ''
        },
        body: JSON.stringify({
          careerId
        })
      });

      const data = await response.json();

      if (data.result && data.result.success) {
        setSelectedCareer(data.result.career);
        setShowDetails(true);
      } else {
        setError('Failed to load career details. Please try again.');
      }
    } catch (error) {
      console.error('Career Details error:', error);
      setError('Unable to load career details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getJobOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'stable': return 'bg-yellow-100 text-yellow-800';
      case 'declining': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'very_high': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSalaryRange(null);
    setSelectedEducation('');
    setSelectedOutlook('');
    setSearchQuery('');
    setSortBy('relevance');
  };

  if (showDetails && selectedCareer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowDetails(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Results
            </Button>
            <h1 className="text-2xl font-bold">{selectedCareer.title}</h1>
          </div>

          {/* Career Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Career Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{selectedCareer.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedCareer.workEnvironment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedCareer.educationLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <Badge className={getJobOutlookColor(selectedCareer.jobOutlook)}>
                        {selectedCareer.jobOutlook} outlook
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{Math.round(selectedCareer.employmentRate * 100)}% employment rate</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Career Progression:</strong> {selectedCareer.careerProgression}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Do Daily</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedCareer.dailyTasks.map((task, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Skills & Traits */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills & Personality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skills.map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Personality Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.personalityTraits.map((trait, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenges & Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-red-800">Challenges</h4>
                      <ul className="space-y-2">
                        {selectedCareer.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-700">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-green-800">Rewards</h4>
                      <ul className="space-y-2">
                        {selectedCareer.rewards.map((reward, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-700">{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Salary Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      KSh {selectedCareer.averageSalary.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Average Monthly</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Range:</span>
                      <span>KSh {selectedCareer.salaryRange.min.toLocaleString()} - {selectedCareer.salaryRange.max.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education Path */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Education Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-3">
                    <div>
                      <strong>Path:</strong> {selectedCareer.educationPath}
                    </div>
                    <div>
                      <strong>Key Subjects:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCareer.keySubjects.map((subject, index) => (
                          <Badge key={index} className="text-xs bg-orange-100 text-orange-800">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kenya-Specific Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    In Kenya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-3">
                    <div>
                      <strong>Major Employers:</strong>
                      <ul className="mt-1 space-y-1">
                        {selectedCareer.kenyaSpecific.majorEmployers.map((employer, index) => (
                          <li key={index} className="text-gray-700">• {employer}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedCareer.kenyaSpecific.universities && (
                      <div>
                        <strong>Top Universities:</strong>
                        <ul className="mt-1 space-y-1">
                          {selectedCareer.kenyaSpecific.universities.map((uni, index) => (
                            <li key={index} className="text-gray-700">• {uni}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedCareer.kenyaSpecific.licensingBody && (
                      <div>
                        <strong>Licensing Body:</strong>
                        <div className="text-gray-700">{selectedCareer.kenyaSpecific.licensingBody}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Take Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Heart className="h-4 w-4 mr-2" />
                      Save to My Careers
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Get Action Plan
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Connect with Professionals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Search className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold">Explore Career Paths</h1>
          </div>
          <p className="text-gray-600">Discover careers that match your interests, skills, and goals in Kenya</p>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search careers by title, skills, or keywords..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Button variant="outline" onClick={clearFilters} className="text-sm">
                  Clear All
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {CAREER_CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={cn(
                          "p-2 rounded-lg border text-sm transition-all",
                          selectedCategories.includes(category)
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-orange-300"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h3 className="font-medium mb-3">Salary Range (Monthly)</h3>
                  <div className="flex gap-2">
                    {SALARY_RANGES.map(range => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedSalaryRange(selectedSalaryRange === range ? null : range)}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm transition-all",
                          selectedSalaryRange === range
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-orange-300"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Education & Outlook */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Education Level</h3>
                    <select
                      value={selectedEducation}
                      onChange={(e) => setSelectedEducation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white"
                    >
                      <option value="">All Levels</option>
                      {EDUCATION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Job Outlook</h3>
                    <select
                      value={selectedOutlook}
                      onChange={(e) => setSelectedOutlook(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white"
                    >
                      <option value="">All Outlooks</option>
                      {JOB_OUTLOOKS.map(outlook => (
                        <option key={outlook} value={outlook}>
                          {outlook.charAt(0).toUpperCase() + outlook.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {explorationResult && (
          <>
            {/* Insights */}
            {explorationResult.insights.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Search Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {explorationResult.insights.map((insight, index) => (
                      <div key={index} className={cn(
                        "p-3 rounded-lg border-l-4",
                        insight.type === 'positive' ? "bg-green-50 border-green-500" :
                        insight.type === 'suggestion' ? "bg-blue-50 border-blue-500" :
                        "bg-yellow-50 border-yellow-500"
                      )}>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-gray-700">{insight.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Results */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {explorationResult.careers.map((career) => (
                <Card key={career.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{career.title}</CardTitle>
                        <CardDescription className="text-orange-600">{career.category}</CardDescription>
                      </div>
                      {career.matchScore && (
                        <Badge className="bg-orange-100 text-orange-800">
                          {career.matchScore}% match
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {career.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Salary</span>
                        <span className="font-medium">KSh {career.averageSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Employment</span>
                        <span className="font-medium">{Math.round(career.employmentRate * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Outlook</span>
                        <Badge className={getJobOutlookColor(career.jobOutlook)}>
                          {career.jobOutlook}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getGrowthColor(career.industryGrowth)}>
                        {career.industryGrowth.replace('_', ' ')} growth
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => handleCareerDetails(career.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {explorationResult.careers.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No careers found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or clearing filters</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CareerExploration;