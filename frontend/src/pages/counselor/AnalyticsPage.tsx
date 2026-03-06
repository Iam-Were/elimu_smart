import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getParse } from '@/config/parse';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  MessageSquare,
  Calendar,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface PerformanceData {
  completionRate: number;
  avgResponseTime: number;
  avgSatisfaction: number;
  completedSessions: number;
  totalSessions: number;
}

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  atRiskStudents: number;
  successRate: number;
  avgSessionDuration: number;
  satisfactionScore: number;
  monthlyCount: number;
  responseTime: number;
  trends: Array<{ month: string; count: number }>;
}

export const AnalyticsPage: React.FC = () => {
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Parse = getParse();
        const [perf, anal] = await Promise.all([
          Parse.Cloud.run('getCounselorPerformance', { timeRange: '30days' }),
          Parse.Cloud.run('getCounselingAnalytics', {}),
        ]);
        setPerformance(perf as PerformanceData);
        setAnalytics(anal as AnalyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        <span className="ml-3 text-yellow-700">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const activeParticipation = analytics && analytics.totalStudents > 0
    ? Math.round((analytics.activeStudents / analytics.totalStudents) * 100)
    : 0;
  const goalAchievement = Math.round(analytics?.successRate ?? 0);
  const sessionAttendance = Math.round(performance?.completionRate ?? 0);
  const weeklyEstimate = Math.round((analytics?.monthlyCount ?? 0) / 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="container max-w-6xl mx-auto py-8 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your counseling performance</p>
          </div>
          <Button
            disabled
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white disabled:opacity-60"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics?.totalStudents ?? 0}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{analytics?.activeStudents ?? 0} active</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions This Week</p>
                  <p className="text-2xl font-bold text-yellow-600">{weeklyEstimate}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">{analytics?.monthlyCount ?? 0} this month</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-yellow-600">{goalAchievement}%</p>
                  <div className="flex items-center mt-1">
                    <Award className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      {goalAchievement >= 90 ? 'Above target' : goalAchievement >= 75 ? 'On track' : 'Below target'}
                    </span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-yellow-600">{(performance?.avgResponseTime ?? 0).toFixed(1)}h</p>
                  <div className="flex items-center mt-1">
                    <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">
                      {(performance?.avgResponseTime ?? 0) < 3 ? 'Fast response' : 'Moderate response'}
                    </span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-yellow-500" />
                Student Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Participation</span>
                    <span>{activeParticipation}%</span>
                  </div>
                  <Progress value={activeParticipation} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Goal Achievement</span>
                    <span>{goalAchievement}%</span>
                  </div>
                  <Progress value={goalAchievement} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Session Attendance</span>
                    <span>{sessionAttendance}%</span>
                  </div>
                  <Progress value={sessionAttendance} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics?.trends ?? []).length > 0 ? (
                  analytics!.trends.map((trend, i) => (
                    <div key={trend.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{trend.month}</p>
                        <p className="text-sm text-gray-600">{trend.count} sessions completed</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={i === analytics!.trends.length - 1
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'}
                      >
                        {i === analytics!.trends.length - 1 ? 'Current' : `${trend.count}`}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No trend data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Highlights */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Recent Performance Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goalAchievement >= 90 && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Award className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Excellent Success Rate</p>
                    <p className="text-sm text-green-600">Maintained {goalAchievement}% success rate</p>
                  </div>
                </div>
              )}
              {activeParticipation > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Student Engagement</p>
                    <p className="text-sm text-blue-600">{activeParticipation}% active participation across all sessions</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <MessageSquare className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    {(performance?.avgResponseTime ?? 0) < 3 ? 'Quick Response Time' : 'Response Time'}
                  </p>
                  <p className="text-sm text-yellow-600">
                    Average {(performance?.avgResponseTime ?? 0).toFixed(1)} hours response time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;