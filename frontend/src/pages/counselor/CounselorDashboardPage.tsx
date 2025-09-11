import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CounselorDashboardCards from '../../components/counselor/CounselorDashboardCards';
import CounselorAnalyticsCards from '../../components/counselor/CounselorAnalyticsCards';
import CounselorSessionCards from '../../components/counselor/CounselorSessionCards';
import { StudentRoster } from '../../components/counselor/StudentRoster';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  LayoutDashboard,
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  Settings,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

const CounselorDashboardPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Update active tab based on URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['overview', 'analytics', 'sessions', 'students'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash without triggering page reload
    window.history.replaceState(null, '', `${location.pathname}#${value}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
        <div className="container max-w-6xl mx-auto py-8 space-y-8">
          
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <LayoutDashboard className="h-4 w-4" />
              Counselor Portal
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              Professional Counselor Dashboard
            </h1>
            <p className="text-xl text-yellow-700 max-w-3xl mx-auto">
              Comprehensive tools for managing student guidance, tracking progress, and measuring counseling effectiveness
            </p>
          </div>

          {/* Quick Action Bar */}
          <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <Bell className="h-3 w-3 mr-1" />
                    7 Urgent
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    8 Active Chats
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Calendar className="h-3 w-3 mr-1" />
                    6 Sessions Today
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <Users className="h-4 w-4 mr-2" />
                    View All Students
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
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
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <CounselorAnalyticsCards className="mt-6" />
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-6">
              <CounselorSessionCards className="mt-6" />
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <StudentRoster />
            </TabsContent>
          </Tabs>

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
  );
};

export default CounselorDashboardPage;