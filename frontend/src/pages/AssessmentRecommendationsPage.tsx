import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  TrendingUp, 
  Briefcase, 
  GraduationCap,
  DollarSign,
  Users,
  BookOpen,
  ExternalLink,
  Heart,
  Star
} from 'lucide-react';

const AssessmentRecommendationsPage: React.FC = () => {
  // const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const topRecommendations = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      match: 95,
      description: 'Design and develop software applications and systems',
      category: 'Technology',
      averageSalary: 'KSh 2,500,000 - 4,500,000',
      growth: 'High',
      education: "Bachelor's in Computer Science or related field",
      skills: ['Programming', 'Problem Solving', 'Analytical Thinking'],
      companies: ['Safaricom', 'Equity Bank', 'KCB Group', 'Andela'],
      reasons: [
        'Strong analytical skills match perfectly',
        'High interest in technology and innovation',
        'Excellent problem-solving abilities'
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      match: 88,
      description: 'Analyze complex data to inform business decisions',
      category: 'Technology',
      averageSalary: 'KSh 3,000,000 - 5,000,000',
      growth: 'Very High',
      education: "Bachelor's in Mathematics, Statistics, or Computer Science",
      skills: ['Data Analysis', 'Statistics', 'Machine Learning'],
      companies: ['IBM Kenya', 'Microsoft', 'Safaricom', 'Strathmore University'],
      reasons: [
        'Mathematical aptitude is excellent',
        'Enjoys finding patterns in information',
        'Strong logical reasoning skills'
      ]
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      match: 82,
      description: 'Bridge business needs with technology solutions',
      category: 'Business',
      averageSalary: 'KSh 1,800,000 - 3,200,000',
      growth: 'High',
      education: "Bachelor's in Business, IT, or related field",
      skills: ['Business Analysis', 'Communication', 'Project Management'],
      companies: ['Deloitte', 'PwC', 'KPMG', 'Standard Chartered'],
      reasons: [
        'Strong communication and analytical skills',
        'Interest in both business and technology',
        'Natural problem-solving approach'
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      match: 78,
      description: 'Lead product development and strategy',
      category: 'Business',
      averageSalary: 'KSh 2,200,000 - 4,000,000',
      growth: 'High',
      education: "Bachelor's in Business, Engineering, or related field",
      skills: ['Strategic Thinking', 'Leadership', 'Market Analysis'],
      companies: ['Jumia', 'Flutterwave', 'Twiga Foods', 'Apollo Agriculture'],
      reasons: [
        'Leadership potential identified',
        'Strategic thinking abilities',
        'Good balance of technical and business skills'
      ]
    }
  ];

  const careerPaths = [
    {
      category: 'Technology',
      count: 12,
      averageMatch: 85,
      topCareers: ['Software Engineer', 'Data Scientist', 'Cybersecurity Analyst']
    },
    {
      category: 'Business',
      count: 8,
      averageMatch: 78,
      topCareers: ['Business Analyst', 'Product Manager', 'Consultant']
    },
    {
      category: 'Healthcare',
      count: 5,
      averageMatch: 65,
      topCareers: ['Healthcare Data Analyst', 'Health Informatics', 'Medical Research']
    },
    {
      category: 'Education',
      count: 4,
      averageMatch: 60,
      topCareers: ['Educational Technology', 'Academic Research', 'Training Specialist']
    }
  ];

  const nextSteps = [
    {
      title: 'Research Top Careers',
      description: 'Deep dive into your highest-matching career options',
      action: 'Start Research',
      priority: 'high'
    },
    {
      title: 'Connect with Professionals',
      description: 'Network with people working in your fields of interest',
      action: 'Find Mentors',
      priority: 'high'
    },
    {
      title: 'Develop Key Skills',
      description: 'Focus on building skills for your target careers',
      action: 'View Courses',
      priority: 'medium'
    },
    {
      title: 'Explore Education Paths',
      description: 'Research universities and programs that align with your goals',
      action: 'Browse Programs',
      priority: 'medium'
    }
  ];

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 bg-green-50';
    if (match >= 80) return 'text-blue-600 bg-blue-50';
    if (match >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'Very High': return 'text-green-600 bg-green-50';
      case 'High': return 'text-blue-600 bg-blue-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Lightbulb className="h-8 w-8 text-orange-600" />
          Career Recommendations
        </h1>
        <p className="text-muted-foreground text-lg">
          Personalized career suggestions based on your assessment results
        </p>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Top Matches</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
        </TabsList>

        {/* Top Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-6">
            {topRecommendations.map((career) => (
              <Card key={career.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{career.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">{career.category}</Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{career.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(career.match)}`}>
                        <Star className="h-4 w-4 mr-1" />
                        {career.match}% Match
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{career.averageSalary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className={getGrowthColor(career.growth)}>
                        {career.growth} Growth
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{career.education}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Why This Matches You:</h4>
                      <ul className="space-y-1">
                        {career.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Key Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Top Companies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.companies.map((company, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="default" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Connect with Professionals
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save for Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPaths.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.category}
                    <Badge variant="secondary">{category.count} careers</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Match</span>
                      <span className="font-medium">{category.averageMatch}%</span>
                    </div>
                    <Progress value={category.averageMatch} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Top Careers:</h4>
                    <ul className="space-y-1">
                      {category.topCareers.map((career, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Explore All {category.category} Careers
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Next Steps Tab */}
        <TabsContent value="next-steps" className="space-y-6">
          <div className="grid gap-4">
            {nextSteps.map((step, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-3 w-3 rounded-full ${
                          step.priority === 'high' ? 'bg-orange-600' : 'bg-blue-600'
                        }`}></div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <Badge variant={step.priority === 'high' ? 'default' : 'secondary'}>
                          {step.priority} priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    <Button variant="outline">
                      {step.action}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to Take Action?</h3>
              <p className="text-muted-foreground mb-4">
                Schedule a session with a career counselor to create your personalized career plan
              </p>
              <Button size="lg" asChild>
                <a href="/guidance/find">
                  <Users className="h-5 w-5 mr-2" />
                  Book Career Counseling Session
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentRecommendationsPage;