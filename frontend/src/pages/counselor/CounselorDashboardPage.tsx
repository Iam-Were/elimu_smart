import React from 'react';
import CounselorDashboardCards from '../../components/counselor/CounselorDashboardCards';
import CounselorProfileSidebar from '../../components/counselor/CounselorProfileSidebar';
import { CounselorActivityFeed } from '../../components/counselor/CounselorActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { useCounselorPerformance } from '../../hooks/useCounselorPerformance';
import { useCounselorStats } from '../../hooks/useCounselorStats';
import { IconContainer } from '../../components/ui/icon-container';
import {
  TrendingUp,
  Clock,
  Target,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/button';

const CounselorDashboardPage: React.FC = () => {
  const { performance, isLoading, error, refetch } = useCounselorPerformance('30days');
  const { stats } = useCounselorStats();
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-7xl mx-auto py-8">
        {/* Grid Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          
          {/* Left Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block space-y-6">
            <CounselorProfileSidebar />
            <CounselorActivityFeed />
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
          <CounselorDashboardCards showAll={true} useCarousel={true} className="mt-6" />
          
          {/* Performance Summary */}
          {isLoading && (
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 border-yellow-200 dark:border-yellow-700/50">
              <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="text-sm text-white">Loading performance metrics...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Performance Metrics</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>{error.message}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && performance && (
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 border-yellow-200 dark:border-yellow-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <IconContainer
                    icon={TrendingUp}
                    emphasis="high"
                    theme="counselor"
                    size="md"
                  />
                  This Month's Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                  <div className="text-center space-y-0.5 sm:space-y-2">
                    <div className="text-xl sm:text-3xl font-bold text-white">
                      {performance.completionRate}%
                    </div>
                    <div className="text-[10px] sm:text-sm text-white/90">Session Completion</div>
                    <div className="text-[8px] sm:text-xs text-white/80">Last 30 days</div>
                  </div>
                  <div className="text-center space-y-0.5 sm:space-y-2">
                    <div className="text-xl sm:text-3xl font-bold text-white">
                      {performance.avgResponseTime}h
                    </div>
                    <div className="text-[10px] sm:text-sm text-white/90">Avg Response Time</div>
                    <div className="text-[8px] sm:text-xs text-white/80">
                      {performance.avgResponseTime < 24 ? 'Excellent' : 'Good'}
                    </div>
                  </div>
                  <div className="text-center space-y-0.5 sm:space-y-2">
                    <div className="text-xl sm:text-3xl font-bold text-white">
                      {performance.avgSatisfaction.toFixed(1)}
                    </div>
                    <div className="text-[10px] sm:text-sm text-white/90">Student Satisfaction</div>
                    <div className="text-[8px] sm:text-xs text-white/80">Out of 5.0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer Insights */}
          {!isLoading && !error && performance && (
            <Card className="bg-white dark:bg-slate-900 border-slate-200/30 dark:border-slate-700/30">
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                      <IconContainer
                        icon={Target}
                        emphasis="medium"
                        theme="counselor"
                        size="sm"
                      />
                      Recent Achievements
                    </h4>
                    <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                        Maintained {performance.completionRate}% session completion rate
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                        Achieved {performance.avgSatisfaction.toFixed(1)}/5 average satisfaction score
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                        Average response time: {performance.avgResponseTime} hours
                      </li>
                    </ul>
                  </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <IconContainer
                      icon={Clock}
                      emphasis="medium"
                      theme="counselor"
                      size="sm"
                    />
                    Upcoming Focus Areas
                  </h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                    {stats && stats.urgentCount > 0 && (
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-orange-500 dark:bg-orange-400 rounded-full"></div>
                        Follow up with {stats.urgentCount} at-risk students requiring immediate attention
                      </li>
                    )}
                    {stats && stats.unreadMessages > 0 && (
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-red-500 dark:bg-red-400 rounded-full"></div>
                        Respond to {stats.unreadMessages} unread messages from students
                      </li>
                    )}
                    {performance && performance.completionRate < 90 && (
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                        Improve session completion rate (currently {performance.completionRate}%)
                      </li>
                    )}
                    {(!stats || (stats.urgentCount === 0 && stats.unreadMessages === 0)) && performance && performance.completionRate >= 90 && (
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        Great work! No urgent tasks at the moment
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          )}
          </div>
          {/* End Main Content Area */}
        </div>
        {/* End Grid Layout */}
      </div>
    </div>
  );
};

export default CounselorDashboardPage;