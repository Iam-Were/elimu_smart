import React from 'react';
import CounselorDashboardCards from '../../components/counselor/CounselorDashboardCards';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

const CounselorDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="container max-w-6xl mx-auto py-8 space-y-8">
        
        {/* Dashboard Content - Removed duplicate header and badges that were in top nav */}
        <div className="space-y-8">
          <CounselorDashboardCards showAll={true} className="mt-6" />
          
          {/* Performance Summary */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Week's Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <div className="text-sm text-green-700">Session Completion</div>
                  <div className="text-xs text-green-600">+2.1% vs last week</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">2.3h</div>
                  <div className="text-sm text-blue-700">Avg Response Time</div>
                  <div className="text-xs text-blue-600">-12.5% improvement</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">4.7</div>
                  <div className="text-sm text-purple-700">Student Satisfaction</div>
                  <div className="text-xs text-purple-600">+4.4% this semester</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Insights */}
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
                      Successfully guided 8 students through university applications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      Maintained 94% session completion rate this month
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                      Achieved 4.7/5 average satisfaction score
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
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboardPage;