import React from 'react';
import { AlertCircle, Calendar, FileText, Award, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface UrgentActionsProps {
  maxItems?: number;
  className?: string;
}

interface UrgentAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
  actionUrl: string;
  actionText: string;
  category: string;
}

const UrgentActions: React.FC<UrgentActionsProps> = ({
  maxItems = 5,
  className = ''
}) => {
  const navigate = useNavigate();
  const {
    kuccpsTimeline,
    careerReadinessScore,
    scholarshipMatches,
    assessmentProgress,
    loading
  } = useDynamicDashboard();

  // Generate urgent actions based on user data
  const generateUrgentActions = (): UrgentAction[] => {
    const actions: UrgentAction[] = [];

    // KUCCPS deadline urgency
    if (kuccpsTimeline && kuccpsTimeline.daysRemaining <= 30) {
      actions.push({
        id: 'kuccps-deadline',
        title: `KUCCPS Deadline in ${kuccpsTimeline.daysRemaining} days`,
        description: kuccpsTimeline.nextDeadline || 'Complete your university application',
        icon: <Calendar className="w-5 h-5" />,
        priority: kuccpsTimeline.daysRemaining <= 7 ? 'high' : 'medium',
        deadline: new Date(Date.now() + kuccpsTimeline.daysRemaining * 24 * 60 * 60 * 1000),
        actionUrl: '/assessment/university-finder',
        actionText: 'Apply Now',
        category: 'University'
      });
    }

    // Incomplete assessments
    const totalAssessments = 5; // RIASEC, Skills, University, Career, Subjects
    const completedCount = assessmentProgress ? Object.keys(assessmentProgress).filter(key => {
      const progress = assessmentProgress[key] as { completed?: boolean };
      return progress?.completed === true;
    }).length : 0;

    if (completedCount < totalAssessments) {
      const remaining = totalAssessments - completedCount;
      actions.push({
        id: 'complete-assessments',
        title: `Complete ${remaining} Assessment${remaining > 1 ? 's' : ''}`,
        description: 'Unlock personalized career recommendations',
        icon: <FileText className="w-5 h-5" />,
        priority: 'medium',
        actionUrl: '/assessment',
        actionText: 'Start Now',
        category: 'Assessment'
      });
    }

    // Low career readiness score
    if (careerReadinessScore && careerReadinessScore.overall < 50) {
      actions.push({
        id: 'improve-readiness',
        title: 'Boost Your Career Readiness',
        description: `Current score: ${careerReadinessScore.overall}%. Take action to improve`,
        icon: <Award className="w-5 h-5" />,
        priority: 'high',
        actionUrl: '/dashboard',
        actionText: 'View Tips',
        category: 'Progress'
      });
    }

    // Scholarship deadlines
    if (scholarshipMatches && scholarshipMatches.length > 0) {
      const upcomingScholarships = scholarshipMatches.filter(scholarship => {
        const deadline = new Date(scholarship.deadline);
        const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntil > 0 && daysUntil <= 30;
      });

      if (upcomingScholarships.length > 0) {
        const nextScholarship = upcomingScholarships[0];
        const deadline = new Date(nextScholarship.deadline);
        const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        actions.push({
          id: 'scholarship-deadline',
          title: `${nextScholarship.name} - ${daysUntil} days left`,
          description: `${nextScholarship.amount} from ${nextScholarship.provider}`,
          icon: <Award className="w-5 h-5" />,
          priority: daysUntil <= 7 ? 'high' : 'medium',
          deadline: deadline,
          actionUrl: '/guidance/resources',
          actionText: 'Apply',
          category: 'Scholarship'
        });
      }
    }

    // Sort by priority (high > medium > low) and deadline
    return actions
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.deadline && b.deadline) {
          return a.deadline.getTime() - b.deadline.getTime();
        }
        return 0;
      })
      .slice(0, maxItems);
  };

  const urgentActions = generateUrgentActions();

  // Get priority badge
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Low</Badge>;
    }
  };

  // Format deadline
  const formatDeadline = (deadline: Date) => {
    const days = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    return deadline.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Urgent Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (urgentActions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Urgent Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100">All Caught Up!</p>
            <p className="text-sm text-muted-foreground mt-1">
              No urgent actions at the moment
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Urgent Actions
          <Badge variant="secondary" className="ml-auto">{urgentActions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {urgentActions.map((action) => (
          <div
            key={action.id}
            className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                {action.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {action.title}
                  </h4>
                  {getPriorityBadge(action.priority)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {action.description}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {action.deadline && (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{formatDeadline(action.deadline)}</span>
                      </>
                    )}
                    <Badge variant="outline" className="text-xs">{action.category}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    onClick={() => navigate(action.actionUrl)}
                  >
                    {action.actionText}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UrgentActions;
