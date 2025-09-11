import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  Plus,
  Edit3,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  type: 'assessment' | 'session' | 'application' | 'skill' | 'other';
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'university' | 'skills' | 'personal';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  targetDate: Date;
  createdAt: Date;
  milestones: Milestone[];
  isActive: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'milestone' | 'streak' | 'completion' | 'breakthrough';
}

// Mock data for demonstration
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Get into Engineering Program',
    description: 'Secure admission to a top engineering program at a Kenyan university',
    category: 'university',
    priority: 'high',
    progress: 65,
    targetDate: new Date('2024-06-30'),
    createdAt: new Date('2024-01-15'),
    isActive: true,
    milestones: [
      {
        id: 'm1',
        title: 'Complete Career Assessment',
        description: 'Take comprehensive career assessment to confirm engineering interest',
        completed: true,
        completedAt: new Date('2024-01-20'),
        type: 'assessment',
      },
      {
        id: 'm2',
        title: 'Research University Requirements',
        description: 'Research admission requirements for top 5 engineering programs',
        completed: true,
        completedAt: new Date('2024-02-05'),
        type: 'other',
      },
      {
        id: 'm3',
        title: 'Improve Math Grade',
        description: 'Achieve A- or better in Mathematics',
        completed: false,
        dueDate: new Date('2024-05-15'),
        type: 'skill',
      },
      {
        id: 'm4',
        title: 'Complete University Applications',
        description: 'Submit applications to 5 engineering programs',
        completed: false,
        dueDate: new Date('2024-04-30'),
        type: 'application',
      },
    ],
  },
  {
    id: '2',
    title: 'Build Leadership Skills',
    description: 'Develop leadership capabilities through school activities and projects',
    category: 'personal',
    priority: 'medium',
    progress: 40,
    targetDate: new Date('2024-12-31'),
    createdAt: new Date('2024-02-01'),
    isActive: true,
    milestones: [
      {
        id: 'm5',
        title: 'Join Student Council',
        description: 'Run for and win a position in student government',
        completed: true,
        completedAt: new Date('2024-02-15'),
        type: 'other',
      },
      {
        id: 'm6',
        title: 'Lead School Project',
        description: 'Lead a community service or school improvement project',
        completed: false,
        dueDate: new Date('2024-08-30'),
        type: 'other',
      },
      {
        id: 'm7',
        title: 'Complete Leadership Workshop',
        description: 'Attend leadership development workshop or program',
        completed: false,
        dueDate: new Date('2024-07-15'),
        type: 'skill',
      },
    ],
  },
];

const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'First Assessment Complete!',
    description: 'Completed your first career assessment',
    icon: '🎯',
    earnedAt: new Date('2024-01-20'),
    type: 'milestone',
  },
  {
    id: 'a2',
    title: 'Week Warrior',
    description: 'Maintained daily progress for 7 days straight',
    icon: '🔥',
    earnedAt: new Date('2024-02-01'),
    type: 'streak',
  },
  {
    id: 'a3',
    title: 'Goal Getter',
    description: 'Set your first major goal',
    icon: '🌟',
    earnedAt: new Date('2024-01-15'),
    type: 'breakthrough',
  },
];

interface GoalTrackingSystemProps {
  className?: string;
}

export const GoalTrackingSystem: React.FC<GoalTrackingSystemProps> = ({
  className,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(mockGoals[0]);
  const [showAchievements, setShowAchievements] = useState(false);

  const getGoalCategoryColor = (category: string) => {
    const colors = {
      career: 'bg-orange-100 text-orange-800',
      university: 'bg-blue-100 text-blue-800',
      skills: 'bg-green-100 text-green-800',
      personal: 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || colors.career;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getMilestoneIcon = (type: string) => {
    const icons = {
      assessment: <Target className="h-4 w-4" />,
      session: <Calendar className="h-4 w-4" />,
      application: <Edit3 className="h-4 w-4" />,
      skill: <TrendingUp className="h-4 w-4" />,
      other: <CheckCircle2 className="h-4 w-4" />,
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  const calculateDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (showAchievements) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Achievements View */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Achievements 🏆</h2>
          <Button variant="secondary" onClick={() => setShowAchievements(false)}>
            Back to Goals
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAchievements.map((achievement) => (
            <Card key={achievement.id} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {achievement.earnedAt.toLocaleDateString()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Your Goals & Progress
          </h1>
          <p className="text-muted-foreground">
            Track your journey towards your career and educational goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowAchievements(true)}>
            <Award className="h-4 w-4 mr-2" />
            Achievements ({mockAchievements.length})
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Overall Progress Summary */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {mockGoals.filter(g => g.isActive).length}
              </div>
              <div className="text-sm text-orange-800">Active Goals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {mockGoals.reduce((acc, goal) => acc + goal.milestones.filter(m => m.completed).length, 0)}
              </div>
              <div className="text-sm text-green-800">Milestones Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(mockGoals.reduce((acc, goal) => acc + goal.progress, 0) / mockGoals.length)}%
              </div>
              <div className="text-sm text-blue-800">Average Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {mockAchievements.length}
              </div>
              <div className="text-sm text-purple-800">Achievements Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Goals</h2>
          {mockGoals.map((goal) => (
            <Card
              key={goal.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedGoal?.id === goal.id ? "ring-2 ring-orange-500 bg-orange-50" : ""
              )}
              onClick={() => setSelectedGoal(goal)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium leading-tight">{goal.title}</h3>
                    <div className="flex gap-1 flex-shrink-0 ml-2">
                      <Badge className={getGoalCategoryColor(goal.category)} variant="secondary">
                        {goal.category}
                      </Badge>
                      <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress value={goal.progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.progress}% complete</span>
                    <span className="text-muted-foreground">
                      {calculateDaysRemaining(goal.targetDate)} days left
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Goal Detail View */}
        <div className="lg:col-span-2">
          {selectedGoal ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{selectedGoal.title}</CardTitle>
                    <CardDescription>{selectedGoal.description}</CardDescription>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Target: {selectedGoal.targetDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{selectedGoal.progress}% Complete</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{selectedGoal.progress}%</span>
                  </div>
                  <Progress value={selectedGoal.progress} className="h-3" />
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="font-medium mb-4">Milestones</h4>
                  <div className="space-y-3">
                    {selectedGoal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full mt-0.5",
                          milestone.completed 
                            ? "bg-green-100 text-green-600" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {milestone.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            getMilestoneIcon(milestone.type)
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className={cn(
                              "font-medium text-sm",
                              milestone.completed ? "line-through text-muted-foreground" : ""
                            )}>
                              {milestone.title}
                            </h5>
                            {milestone.completed && (
                              <Badge className="bg-green-100 text-green-800" variant="secondary">
                                ✓ Complete
                              </Badge>
                            )}
                            {!milestone.completed && milestone.dueDate && (
                              <Badge variant="secondary" className="text-xs">
                                Due {milestone.dueDate.toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                          {milestone.completed && milestone.completedAt && (
                            <p className="text-xs text-green-600">
                              Completed {milestone.completedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Action */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-orange-800 mb-1">Next Action</h4>
                        {(() => {
                          const nextMilestone = selectedGoal.milestones.find(m => !m.completed);
                          if (nextMilestone) {
                            return (
                              <p className="text-sm text-orange-700">
                                Focus on: {nextMilestone.title}
                              </p>
                            );
                          }
                          return (
                            <p className="text-sm text-orange-700">
                              Great job! All milestones completed. Time to celebrate! 🎉
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a goal to view details</h3>
                <p className="text-muted-foreground">
                  Choose a goal from the list to see progress, milestones, and next actions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalTrackingSystem;