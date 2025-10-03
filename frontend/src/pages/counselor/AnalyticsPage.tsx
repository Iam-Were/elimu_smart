import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="container max-w-6xl mx-auto py-8 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your counseling performance</p>
          </div>
          <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
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
                  <p className="text-2xl font-bold text-yellow-600">247</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% this month</span>
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
                  <p className="text-2xl font-bold text-yellow-600">18</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">3 today</span>
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
                  <p className="text-2xl font-bold text-yellow-600">94%</p>
                  <div className="flex items-center mt-1">
                    <Award className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Above target</span>
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
                  <p className="text-2xl font-bold text-yellow-600">2.3h</p>
                  <div className="flex items-center mt-1">
                    <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">-15 min</span>
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
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Goal Achievement</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Session Attendance</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">September</p>
                    <p className="text-sm text-gray-600">45 sessions completed</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +15%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">October</p>
                    <p className="text-sm text-gray-600">52 sessions completed</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +16%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">November</p>
                    <p className="text-sm text-gray-600">38 sessions (in progress)</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Current
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Recent Performance Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Award className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Excellent Response Rate</p>
                  <p className="text-sm text-green-600">Maintained 94% success rate this month</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Student Engagement High</p>
                  <p className="text-sm text-blue-600">87% active participation across all sessions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <MessageSquare className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Quick Response Time</p>
                  <p className="text-sm text-yellow-600">Average 2.3 hours - 15 minutes faster than last month</p>
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