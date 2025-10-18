import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  PersonIcon,
  ActivityLogIcon,
  GearIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  ClockIcon,
  BarChartIcon,
  GlobeIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for admin dashboard - will be replaced with real data
  const systemMetrics = {
    users: {
      total: 2847,
      active: 1923,
      students: 2456,
      counselors: 45,
      admins: 8,
      newThisMonth: 234,
    },
    performance: {
      uptime: 99.7,
      responseTime: 245, // ms
      errorRate: 0.12, // %
      apiCalls: 45678,
    },
    content: {
      totalCareers: 156,
      pendingModeration: 12,
      questionsAnswered: 1234,
      resourcesAvailable: 89,
    },
    system: {
      cpuUsage: 23,
      memoryUsage: 67,
      diskUsage: 45,
      activeConnections: 1234,
    },
  };

  const recentActivity = [
    {
      id: 1,
      action: 'New user registration',
      user: 'John Doe (Student)',
      time: '2 minutes ago',
      type: 'user',
      status: 'success',
    },
    {
      id: 2,
      action: 'System performance alert resolved',
      user: 'System',
      time: '15 minutes ago',
      type: 'system',
      status: 'success',
    },
    {
      id: 3,
      action: 'Content moderation required',
      user: 'Career Q&A System',
      time: '1 hour ago',
      type: 'content',
      status: 'warning',
    },
    {
      id: 4,
      action: 'Bulk user import completed',
      user: 'Admin: Jane Smith',
      time: '3 hours ago',
      type: 'admin',
      status: 'success',
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      level: 'warning',
      message: 'Database query performance slower than usual',
      timestamp: '10 minutes ago',
      resolved: false,
    },
    {
      id: 2,
      level: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '2 hours ago',
      resolved: true,
    },
    {
      id: 3,
      level: 'error',
      message: 'Failed login attempts from suspicious IP',
      timestamp: '4 hours ago',
      resolved: false,
    },
  ];

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    let greeting = 'Good morning';
    if (time >= 12 && time < 18) greeting = 'Good afternoon';
    else if (time >= 18) greeting = 'Good evening';

    return `${greeting}, ${user?.firstName}!`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      case 'info': return 'blue';
      default: return 'gray';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <PersonIcon width={14} height={14} />;
      case 'system': return <GearIcon width={14} height={14} />;
      case 'content': return <ActivityLogIcon width={14} height={14} />;
      case 'admin': return <GearIcon width={14} height={14} />;
      default: return <ClockIcon width={14} height={14} />;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <DashboardIcon className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {getWelcomeMessage()}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Platform administration and system oversight
                </p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-sm px-3 py-1 flex items-center gap-2">
              <GearIcon className="w-4 h-4" />
              System Administrator
            </Badge>
          </div>
        </div>

        {/* Key System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <CardContent className="space-y-2">
              <div className="text-purple-600 flex justify-center">
                <PersonIcon width={32} height={32} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-bold text-purple-600">
                {systemMetrics.users.total.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground">
                {systemMetrics.users.active.toLocaleString()} active
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="space-y-2">
              <div className="relative w-16 h-16 mx-auto">
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                  systemMetrics.performance.uptime > 99 ? 'border-green-500' : 'border-yellow-500'
                }`}>
                  <span className={`text-xs font-bold ${
                    systemMetrics.performance.uptime > 99 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {systemMetrics.performance.uptime}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                System Uptime
              </p>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="space-y-2">
              <div className="text-purple-600 flex justify-center">
                <ClockIcon width={32} height={32} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Response Time
              </p>
              <h3 className="text-2xl font-bold text-purple-600">
                {systemMetrics.performance.responseTime}ms
              </h3>
              <p className="text-xs text-muted-foreground">
                API response time
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="space-y-2">
              <div className={`flex justify-center ${
                systemMetrics.content.pendingModeration > 10 ? 'text-red-600' : 'text-purple-600'
              }`}>
                <ExclamationTriangleIcon width={32} height={32} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Moderation
              </p>
              <h3 className={`text-2xl font-bold ${
                systemMetrics.content.pendingModeration > 10 ? 'text-red-600' : 'text-purple-600'
              }`}>
                {systemMetrics.content.pendingModeration}
              </h3>
              <p className="text-xs text-muted-foreground">
                Items need review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-4">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-purple-600">{systemMetrics.system.cpuUsage}%</span>
              </div>
              <Progress 
                value={systemMetrics.system.cpuUsage} 
                className={`h-2 ${
                  systemMetrics.system.cpuUsage > 80 ? '[&>div]:bg-red-500' : 
                  systemMetrics.system.cpuUsage > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                }`}
              />
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-purple-600">{systemMetrics.system.memoryUsage}%</span>
              </div>
              <Progress 
                value={systemMetrics.system.memoryUsage}
                className={`h-2 ${
                  systemMetrics.system.memoryUsage > 80 ? '[&>div]:bg-red-500' : 
                  systemMetrics.system.memoryUsage > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                }`}
              />
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className="text-sm text-purple-600">{systemMetrics.system.diskUsage}%</span>
              </div>
              <Progress 
                value={systemMetrics.system.diskUsage}
                className={`h-2 ${
                  systemMetrics.system.diskUsage > 80 ? '[&>div]:bg-red-500' : 
                  systemMetrics.system.diskUsage > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                }`}
              />
            </CardContent>
          </Card>

          <Card className="p-4 text-center">
            <CardContent className="space-y-2">
              <GlobeIcon width={24} height={24} className="text-purple-600 mx-auto" />
              <p className="text-sm font-medium">Active Connections</p>
              <p className="text-lg font-bold text-purple-600">
                {systemMetrics.system.activeConnections.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                    <ActivityLogIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate('/admin/users')}
                  >
                    <PersonIcon width={18} height={18} />
                    Manage Users
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate('/admin/analytics')}
                  >
                    <BarChartIcon width={18} height={18} />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate('/admin/content-moderation')}
                  >
                    <ActivityLogIcon width={18} height={18} />
                    Content Moderation
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate('/admin/system-configuration')}
                  >
                    <GearIcon width={18} height={18} />
                    System Configuration
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate('/admin/audit-log')}
                  >
                    <ActivityLogIcon width={18} height={18} />
                    Audit Log
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => navigate('/admin/security-monitoring')}
                  >
                    <ExclamationTriangleIcon width={18} height={18} />
                    Security Monitoring
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <ActivityLogIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>Recent System Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className={`text-${getStatusColor(activity.status)}-600`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-${getStatusColor(activity.status)}-600`}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>System Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.filter(alert => !alert.resolved).map(alert => (
                    <Alert key={alert.id} className={`border-${getStatusColor(alert.level)}-200`}>
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {systemAlerts.filter(alert => !alert.resolved).length === 0 && (
                    <Alert className="border-green-200">
                      <CheckCircledIcon className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-sm">All systems operating normally</p>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Students</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-purple-600">
                        {systemMetrics.users.students.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((systemMetrics.users.students / systemMetrics.users.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Counselors</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-purple-600">
                        {systemMetrics.users.counselors}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((systemMetrics.users.counselors / systemMetrics.users.total) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Administrators</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-purple-600">
                        {systemMetrics.users.admins}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((systemMetrics.users.admins / systemMetrics.users.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Calls (24h)</span>
                    <span className="text-sm font-medium text-purple-600">
                      {systemMetrics.performance.apiCalls.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className={`text-sm font-medium ${
                      systemMetrics.performance.errorRate > 1 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {systemMetrics.performance.errorRate}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Users (Month)</span>
                    <span className="text-sm font-medium text-purple-600">
                      {systemMetrics.users.newThisMonth}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};