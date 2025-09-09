import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const AssessmentProgressPage: React.FC = () => {
  // Mock progress data
  const overallProgress = 68;
  const assessmentsCompleted = 3;
  const totalAssessments = 5;
  
  const progressData = [
    {
      name: 'Career Assessment',
      progress: 75,
      status: 'in-progress',
      description: 'Understanding your career preferences and strengths',
      link: '/assessment/career'
    },
    {
      name: 'Subject Mapper',
      progress: 100,
      status: 'completed',
      description: 'Mapping subjects to career paths',
      link: '/assessment/subjects/results'
    },
    {
      name: 'Skills Assessment',
      progress: 60,
      status: 'in-progress',
      description: 'Evaluating technical and soft skills',
      link: '/assessment/skills'
    },
    {
      name: 'Personality Assessment',
      progress: 0,
      status: 'available',
      description: 'Understanding your work style and preferences',
      link: '/assessment/personality'
    },
    {
      name: 'Values Assessment',
      progress: 0,
      status: 'locked',
      description: 'Identifying what matters most in your career',
      link: '/assessment/values'
    }
  ];

  const achievements = [
    { name: 'First Assessment', description: 'Completed your first career assessment', earned: true },
    { name: 'Explorer', description: 'Tried 3 different assessment types', earned: true },
    { name: 'Dedicated Learner', description: 'Completed assessments 5 days in a row', earned: false },
    { name: 'Career Champion', description: 'Achieved 90% completion on all assessments', earned: false },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'available': return <Target className="h-4 w-4 text-blue-600" />;
      case 'locked': return <Star className="h-4 w-4 text-gray-400" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700';
      case 'in-progress': return 'bg-orange-50 text-orange-700';
      case 'available': return 'bg-blue-50 text-blue-700';
      case 'locked': return 'bg-gray-50 text-gray-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Assessment Progress</h1>
        <p className="text-muted-foreground text-lg">
          Track your career discovery journey and celebrate your achievements
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <TrendingUp className="h-6 w-6 text-orange-600" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{overallProgress}%</div>
            <div className="text-muted-foreground">Complete</div>
          </div>
          
          <Progress value={overallProgress} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{assessmentsCompleted}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{totalAssessments - assessmentsCompleted}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalAssessments}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assessment Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Assessment Breakdown
          </h2>
          
          <div className="space-y-4">
            {progressData.map((assessment, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(assessment.status)}
                        <h3 className="font-semibold">{assessment.name}</h3>
                        <Badge variant="outline" className={getStatusColor(assessment.status)}>
                          {assessment.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {assessment.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{assessment.progress}%</span>
                    </div>
                    <Progress value={assessment.progress} className="h-2" />
                    
                    <div className="flex justify-end">
                      <Button 
                        variant={assessment.status === 'locked' ? 'secondary' : 'outline'} 
                        size="sm"
                        disabled={assessment.status === 'locked'}
                        asChild={assessment.status !== 'locked'}
                      >
                        {assessment.status === 'locked' ? (
                          <span>Locked</span>
                        ) : (
                          <a href={assessment.link}>
                            {assessment.status === 'completed' ? 'Review' : 'Continue'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements & Next Steps */}
        <div className="space-y-6">
          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
              <Award className="h-6 w-6" />
              Achievements
            </h2>
            
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <Card key={index} className={achievement.earned ? 'border-yellow-200 bg-yellow-50/50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        achievement.earned 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recommended Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Complete Skills Assessment</p>
                    <p className="text-sm text-muted-foreground">Evaluate your technical and soft skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Schedule Career Counseling</p>
                    <p className="text-sm text-muted-foreground">Get personalized guidance based on your results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-500">Unlock Advanced Assessments</p>
                    <p className="text-sm text-muted-foreground">Available after completing 3 assessments</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-4" asChild>
                <a href="/guidance/find">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Career Session
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentProgressPage;