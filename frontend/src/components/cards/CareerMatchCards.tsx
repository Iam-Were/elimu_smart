import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-visualizations';
import {
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  MapPin,
  Clock,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  Brain,
  Eye,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Interfaces for Sprint 21 data-focused career cards
interface CareerMatch {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  salaryRange: {
    min: number;
    max: number;
    currency: 'KES' | 'USD';
  };
  growthRate: string;
  educationLevel: string;
  industry: string;
  location: string;
  requiredSubjects: string[];
  requiredSkills: string[];
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  workEnvironment: 'office' | 'remote' | 'hybrid' | 'field';
  experienceRequired: string;
  averageRating: number;
  reviewCount: number;
  trendDirection: 'up' | 'down' | 'stable';
  imageUrl?: string;
  keyResponsibilities: string[];
  careerPath: {
    entry: string;
    mid: string;
    senior: string;
  };
  dataInsights: {
    demandTrend: number;
    salaryTrend: number;
    jobOpenings: number;
    competitionLevel: 'low' | 'medium' | 'high';
    automationRisk: 'low' | 'medium' | 'high';
  };
}

interface CareerMatchCardsProps {
  matches?: CareerMatch[];
  showAll?: boolean;
  maxCards?: number;
  className?: string;
}

// Mock data for Sprint 21 - replace with API data
const careerMatches: CareerMatch[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications using modern programming languages and frameworks.',
    matchPercentage: 94,
    salaryRange: { min: 80000, max: 150000, currency: 'KES' },
    growthRate: '+22% (5 years)',
    educationLevel: 'Bachelor\'s Degree',
    industry: 'Technology',
    location: 'Nairobi, Remote',
    requiredSubjects: ['Mathematics', 'Computer Science', 'Physics'],
    requiredSkills: ['Python', 'JavaScript', 'Problem Solving', 'Teamwork'],
    demandLevel: 'very-high',
    workEnvironment: 'hybrid',
    experienceRequired: '0-2 years',
    averageRating: 4.8,
    reviewCount: 1247,
    trendDirection: 'up',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop',
    keyResponsibilities: [
      'Write clean, maintainable code',
      'Collaborate with cross-functional teams',
      'Debug and troubleshoot applications',
      'Participate in code reviews'
    ],
    careerPath: {
      entry: 'Junior Developer',
      mid: 'Senior Engineer',
      senior: 'Tech Lead/Architect'
    },
    dataInsights: {
      demandTrend: 85,
      salaryTrend: 15,
      jobOpenings: 2340,
      competitionLevel: 'medium',
      automationRisk: 'low',
    },
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze complex data sets to extract insights and build predictive models for business decision making.',
    matchPercentage: 88,
    salaryRange: { min: 90000, max: 180000, currency: 'KES' },
    growthRate: '+35% (5 years)',
    educationLevel: 'Master\'s Degree',
    industry: 'Technology/Analytics',
    location: 'Nairobi, Mombasa',
    requiredSubjects: ['Mathematics', 'Statistics', 'Computer Science'],
    requiredSkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistical Analysis'],
    demandLevel: 'very-high',
    workEnvironment: 'hybrid',
    experienceRequired: '2-4 years',
    averageRating: 4.7,
    reviewCount: 892,
    trendDirection: 'up',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    keyResponsibilities: [
      'Build predictive models',
      'Analyze large datasets',
      'Create data visualizations',
      'Present findings to stakeholders'
    ],
    careerPath: {
      entry: 'Data Analyst',
      mid: 'Senior Data Scientist',
      senior: 'Chief Data Officer'
    },
    dataInsights: {
      demandTrend: 92,
      salaryTrend: 25,
      jobOpenings: 1840,
      competitionLevel: 'high',
      automationRisk: 'low',
    },
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Lead product development from conception to launch, working closely with engineering and design teams.',
    matchPercentage: 82,
    salaryRange: { min: 100000, max: 200000, currency: 'KES' },
    growthRate: '+19% (5 years)',
    educationLevel: 'Bachelor\'s Degree',
    industry: 'Technology/Business',
    location: 'Nairobi, Remote',
    requiredSubjects: ['Business Studies', 'Mathematics', 'Computer Science'],
    requiredSkills: ['Strategic Thinking', 'Communication', 'Analytics', 'Leadership'],
    demandLevel: 'high',
    workEnvironment: 'hybrid',
    experienceRequired: '3-5 years',
    averageRating: 4.6,
    reviewCount: 1053,
    trendDirection: 'up',
    imageUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=200&fit=crop',
    keyResponsibilities: [
      'Define product roadmap',
      'Gather user requirements',
      'Coordinate with development teams',
      'Analyze market trends'
    ],
    careerPath: {
      entry: 'Associate PM',
      mid: 'Senior PM',
      senior: 'VP of Product'
    },
    dataInsights: {
      demandTrend: 78,
      salaryTrend: 18,
      jobOpenings: 920,
      competitionLevel: 'high',
      automationRisk: 'low',
    },
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    description: 'Design user-centered digital experiences and interfaces that are both beautiful and functional.',
    matchPercentage: 76,
    salaryRange: { min: 60000, max: 120000, currency: 'KES' },
    growthRate: '+8% (5 years)',
    educationLevel: 'Bachelor\'s Degree',
    industry: 'Design/Technology',
    location: 'Nairobi, Remote',
    requiredSubjects: ['Art & Design', 'Computer Science', 'Psychology'],
    requiredSkills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    demandLevel: 'medium',
    workEnvironment: 'hybrid',
    experienceRequired: '1-3 years',
    averageRating: 4.5,
    reviewCount: 687,
    trendDirection: 'stable',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=300&h=200&fit=crop',
    keyResponsibilities: [
      'Create user interface designs',
      'Conduct user research',
      'Build interactive prototypes',
      'Collaborate with developers'
    ],
    careerPath: {
      entry: 'Junior Designer',
      mid: 'Senior UX Designer',
      senior: 'Design Director'
    },
    dataInsights: {
      demandTrend: 65,
      salaryTrend: 8,
      jobOpenings: 1240,
      competitionLevel: 'medium',
      automationRisk: 'low',
    },
  },
];

const getDemandColor = (level: string) => {
  switch (level) {
    case 'very-high':
      return 'bg-green-100 text-green-700';
    case 'high':
      return 'bg-blue-100 text-blue-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  }
};

const getMatchColor = (percentage: number) => {
  if (percentage >= 90) return 'from-green-500 to-emerald-500';
  if (percentage >= 80) return 'from-blue-500 to-cyan-500';
  if (percentage >= 70) return 'from-orange-500 to-yellow-500';
  return 'from-gray-500 to-gray-600';
};

const getCompetitionBadgeColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-green-50 text-green-700 border-green-200';
  }
};

export const CareerMatchCards: React.FC<CareerMatchCardsProps> = ({
  matches = careerMatches,
  showAll = false,
  maxCards = 6,
  className,
}) => {
  const displayedMatches = showAll ? matches : matches.slice(0, maxCards);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Career Matches
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover careers perfectly matched to your skills, interests, and academic background
          </p>
        </div>
        {!showAll && matches.length > maxCards && (
          <Button asChild variant="secondary" className="gap-2">
            <Link to="/career-matches">
              View All Matches
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Career Match Summary - Moved to Top */}
      <Card className="bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 border-blue-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Target className="h-5 w-5" />
            </div>
            Career Match Summary
          </CardTitle>
          <CardDescription>
            Based on your assessment results and academic profile
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {matches.length}
              </div>
              <div className="text-sm text-muted-foreground">Career Matches</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(matches.reduce((acc, career) => acc + career.matchPercentage, 0) / matches.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Match Score</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">
                {matches.reduce((acc, career) => acc + career.dataInsights.jobOpenings, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Job Opportunities</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                {matches.filter(career => career.dataInsights.demandTrend > 70).length}
              </div>
              <div className="text-sm text-muted-foreground">High Demand</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Match Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedMatches.map((career) => (
          <Card
            key={career.id}
            className={cn(
              "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer",
              "bg-gradient-to-br from-white via-white to-gray-50/30"
            )}
          >
            {/* Career Image Header */}
            {career.imageUrl && (
              <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={career.imageUrl} 
                  alt={career.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Match Badge Overlay */}
                <div className="absolute top-4 right-4">
                  <ProgressRing
                    value={career.matchPercentage}
                    size="sm"
                    color="orange"
                    strokeWidth={3}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-1"
                  >
                    <div className="text-xs font-bold text-orange-600">
                      {career.matchPercentage}%
                    </div>
                  </ProgressRing>
                </div>

                {/* Career Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{career.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {career.industry}
                    </Badge>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <MapPin className="h-3 w-3" />
                      {career.location}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card Content */}
            <CardContent className="p-6 space-y-6">
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {career.description}
              </p>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Salary Range
                  </div>
                  <div className="font-semibold text-green-600">
                    {career.salaryRange.currency} {career.salaryRange.min.toLocaleString()} - {career.salaryRange.max.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {getTrendIcon(career.trendDirection)}
                    Growth Rate
                  </div>
                  <div className="font-semibold text-blue-600">
                    {career.growthRate}
                  </div>
                </div>
              </div>

              {/* Data Insights Section - Sprint 21 Feature */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-100/50">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Market Insights
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Job Demand</div>
                    <div className="flex items-center gap-2">
                      <Progress value={career.dataInsights.demandTrend} className="h-1.5 flex-1" />
                      <span className="font-medium text-blue-600">{career.dataInsights.demandTrend}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Open Positions</div>
                    <div className="font-semibold text-foreground">
                      {career.dataInsights.jobOpenings.toLocaleString()}+ jobs
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Competition</div>
                    <Badge variant="secondary" className={cn("text-xs", getCompetitionBadgeColor(career.dataInsights.competitionLevel))}>
                      {career.dataInsights.competitionLevel}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Automation Risk</div>
                    <Badge variant="secondary" className={cn(
                      "text-xs",
                      career.dataInsights.automationRisk === 'low' ? 'bg-green-50 text-green-700' :
                      career.dataInsights.automationRisk === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    )}>
                      {career.dataInsights.automationRisk} risk
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Required Skills & Subjects */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Required Subjects
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {career.requiredSubjects.slice(0, 3).map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                        {subject}
                      </Badge>
                    ))}
                    {career.requiredSubjects.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                        +{career.requiredSubjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {career.requiredSkills.slice(0, 4).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {career.requiredSkills.length > 4 && (
                      <Badge variant="secondary" className="text-xs text-muted-foreground">
                        +{career.requiredSkills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Education:</span>
                  <span className="font-medium">{career.educationLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{career.experienceRequired}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{career.averageRating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({career.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                
                <Badge className={getDemandColor(career.demandLevel)}>
                  {career.demandLevel.replace('-', ' ')} demand
                </Badge>
              </div>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
              <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to={`/careers/${career.id}`} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Link>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <Link to={`/careers/${career.id}/apply`} className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Save Career
                </Link>
              </Button>
            </CardFooter>

            {/* Match Percentage Indicator */}
            <div className="absolute top-4 left-4">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg",
                `bg-gradient-to-r ${getMatchColor(career.matchPercentage)}`
              )}>
                {career.matchPercentage}% Match
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CareerMatchCards;