import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  DollarSign, 
  UserCheck,
  Calendar,
  AlertCircle,
  LogOut,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  onSignOut?: () => void;
}

const AdminDashboard = ({ onSignOut }: AdminDashboardProps) => {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    totalStudents: 15420,
    totalCounselors: 89,
    monthlyRevenue: 125000,
    assessmentsCompleted: 8934,
    placementSuccessRate: 89.2
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'registration', user: 'John Doe', action: 'New student registered', time: '2 minutes ago' },
    { id: 2, type: 'assessment', user: 'Jane Smith', action: 'Completed career assessment', time: '5 minutes ago' },
    { id: 3, type: 'counseling', user: 'Mike Johnson', action: 'Counseling session completed', time: '8 minutes ago' },
    { id: 4, type: 'payment', user: 'Sarah Wilson', action: 'Premium subscription activated', time: '12 minutes ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        assessmentsCompleted: prev.assessmentsCompleted + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time platform analytics and management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              Super Admin
            </Badge>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{realTimeData.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">↗ +12% from yesterday</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{realTimeData.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">↗ +8% this month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">KSh {realTimeData.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">↗ +15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{realTimeData.placementSuccessRate}%</p>
                  <p className="text-xs text-green-600 mt-1">↗ +2.1% this quarter</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Analytics Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>User Analytics</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Interactive analytics chart would be here</p>
                    <p className="text-sm text-gray-500">Real-time user engagement, registrations, and activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Platform Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-blue-600">{realTimeData.assessmentsCompleted.toLocaleString()}</h4>
                    <p className="text-sm text-gray-600">Assessments Completed</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-green-600">{realTimeData.totalCounselors}</h4>
                    <p className="text-sm text-gray-600">Active Counselors</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-orange-600">98.5%</h4>
                    <p className="text-sm text-gray-600">System Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Real-time Activity Feed */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Live Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'registration' ? 'bg-blue-500' :
                      activity.type === 'assessment' ? 'bg-green-500' :
                      activity.type === 'counseling' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-xs text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">High Server Load</p>
                    <p className="text-xs text-yellow-600">CPU usage at 85% - consider scaling</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <UserCheck className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">New Counselor Applications</p>
                    <p className="text-xs text-blue-600">5 pending approvals</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Backup Completed</p>
                    <p className="text-xs text-green-600">Daily backup successful at 3:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-primary hover:bg-primary/90" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Approve Counselors
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Export Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
