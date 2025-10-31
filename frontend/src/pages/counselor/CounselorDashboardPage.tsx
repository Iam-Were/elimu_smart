import React from 'react';
import CounselorDashboardCards from '../../components/counselor/CounselorDashboardCards';
import CounselorProfileSidebar from '../../components/counselor/CounselorProfileSidebar';
import { CounselorActivityFeed } from '../../components/counselor/CounselorActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { useCounselorPerformance } from '../../hooks/useCounselorPerformance';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
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
          <CounselorDashboardCards showAll={true} className="mt-6" />
          
          {/* Performance Summary */}
          {isLoading && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
                <p className="text-sm text-yellow-700">Loading performance metrics...</p>
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
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  This Month's Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                      {performance.completionRate}%
                    </div>
                    <div className="text-sm text-green-700">Session Completion</div>
                    <div className="text-xs text-green-600">Last 30 days</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      {performance.avgResponseTime}h
                    </div>
                    <div className="text-sm text-blue-700">Avg Response Time</div>
                    <div className="text-xs text-blue-600">
                      {performance.avgResponseTime < 24 ? 'Excellent' : 'Good'}
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-600">
                      {performance.avgSatisfaction.toFixed(1)}
                    </div>
                    <div className="text-sm text-purple-700">Student Satisfaction</div>
                    <div className="text-xs text-purple-600">Out of 5.0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer Insights */}
          {!isLoading && !error && performance && (
            <Card className="bg-gradient-to-r from-yellow-100 via-white to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Recent Achievements
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        Maintained {performance.completionRate}% session completion rate
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                        Achieved {performance.avgSatisfaction.toFixed(1)}/5 average satisfaction score
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        Average response time: {performance.avgResponseTime} hours
                      </li>
                    </ul>
                  </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Upcoming Focus Areas
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      Follow up with 7 at-risk students requiring immediate attention
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      Complete pending responses for 15 student questions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      Prepare materials for tomorrow's group workshop
                    </li>
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