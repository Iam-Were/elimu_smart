import React from 'react';
import { TrendingUp, Target, Award, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface ProgressMetricsProps {
  className?: string;
}

const ProgressMetrics: React.FC<ProgressMetricsProps> = ({ className = '' }) => {
  const { careerReadinessScore, loading } = useDynamicDashboard();

  // Get metrics data
  const metrics = [
    {
      id: 'career-readiness',
      title: 'Career Readiness',
      value: careerReadinessScore?.overall || 0,
      target: 100,
      icon: <Target className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      progressColor: 'bg-orange-600',
      description: 'Overall readiness score'
    },
    {
      id: 'assessments',
      title: 'Assessments',
      value: careerReadinessScore?.breakdown?.assessmentCompletion || 0,
      target: 100,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      progressColor: 'bg-green-600',
      description: 'Completed assessments'
    },
    {
      id: 'research',
      title: 'Career Research',
      value: careerReadinessScore?.breakdown?.careerResearch || 0,
      target: 100,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      progressColor: 'bg-blue-600',
      description: 'Research activities'
    },
    {
      id: 'exploration',
      title: 'Course Exploration',
      value: careerReadinessScore?.breakdown?.courseExploration || 0,
      target: 100,
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      progressColor: 'bg-purple-600',
      description: 'University courses explored'
    },
    {
      id: 'actions',
      title: 'Actions Taken',
      value: careerReadinessScore?.breakdown?.actionsTaken || 0,
      target: 100,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      progressColor: 'bg-amber-600',
      description: 'Steps completed'
    }
  ];

  // Get status badge based on progress
  const getStatusBadge = (value: number) => {
    if (value >= 80) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Excellent</Badge>;
    }
    if (value >= 60) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Good</Badge>;
    }
    if (value >= 40) {
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Fair</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Needs Work</Badge>;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Progress Metrics
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Progress Metrics
          </div>
          {careerReadinessScore && getStatusBadge(careerReadinessScore.overall)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 sm:p-2 rounded-lg ${metric.bgColor} ${metric.color} [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {metric.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  {metric.value}%
                </p>
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full transition-all ${metric.progressColor}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}

        {careerReadinessScore?.lastUpdated && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-muted-foreground text-center">
              Last updated: {new Date(careerReadinessScore.lastUpdated).toLocaleDateString('en-KE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressMetrics;
