import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChartIcon,
  ArrowUpIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TargetIcon,
  DownloadIcon,
  GlobeIcon,
  ActivityLogIcon,
} from '@radix-ui/react-icons';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getParse } from '@/config/parse';
import { ADMIN_ROLE_PERMISSIONS } from '@/utils/adminPermissions';

// Mock data for system analytics
const userGrowthData = [
  { month: 'Aug', students: 1845, counselors: 38, admins: 6, total: 1889 },
  { month: 'Sep', students: 2156, counselors: 41, admins: 7, total: 2204 },
  { month: 'Oct', students: 2398, counselors: 43, admins: 8, total: 2449 },
  { month: 'Nov', students: 2456, counselors: 45, admins: 8, total: 2509 },
  { month: 'Dec', students: 2547, counselors: 47, admins: 8, total: 2602 },
];

const systemPerformanceData = [
  { time: '00:00', cpu: 15, memory: 45, disk: 67 },
  { time: '04:00', cpu: 12, memory: 48, disk: 67 },
  { time: '08:00', cpu: 35, memory: 62, disk: 68 },
  { time: '12:00', cpu: 28, memory: 58, disk: 68 },
  { time: '16:00', cpu: 42, memory: 71, disk: 69 },
  { time: '20:00', cpu: 23, memory: 55, disk: 69 },
];

const engagementData = [
  { name: 'Active Users', value: 1923, color: '#22c55e' },
  { name: 'Moderate Users', value: 456, color: '#eab308' },
  { name: 'Low Activity', value: 234, color: '#ef4444' },
];

const platformUsageData = [
  { feature: 'Career Assessment', usage: 89, users: 2156 },
  { feature: 'Subject Mapper', usage: 76, users: 1834 },
  { feature: 'Q&A System', usage: 67, users: 1612 },
  { feature: 'Session Booking', usage: 54, users: 1304 },
  { feature: 'Resource Library', usage: 43, users: 1036 },
];

const systemMetrics = {
  totalUsers: 2847,
  activeUsers: 1923,
  newUsersToday: 45,
  systemUptime: 99.8,
  averageResponseTime: 245,
  errorRate: 0.08,
  storageUsed: 67.4,
  bandwidthUsage: 89.2,
  activeConnections: 1234,
  questionsAnswered: 5678,
  sessionsCompleted: 892,
  assessmentsCompleted: 3456,
};

const recentSystemEvents = [
  {
    id: 1,
    type: 'info',
    message: 'System backup completed successfully',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    type: 'warning',
    message: 'High memory usage detected on server 2',
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    type: 'error',
    message: 'Failed login attempt from suspicious IP',
    timestamp: '1 hour ago',
  },
  {
    id: 4,
    type: 'info',
    message: 'New user registration: student@school.edu',
    timestamp: '2 hours ago',
  },
];

interface BillingAnalytics {
  metrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    mrr: number;
    activeSubscriptionsCount: number;
    totalInvoicesCount: number;
    mpesaSuccessRate: number;
    churnRate: number;
    arpu: number;
  };
  subscriptionsByPlan: Record<string, number>;
  recentInvoices: Array<{
    id: string;
    invoiceNumber: string;
    userName: string;
    planName: string;
    amount: number;
    status: string;
    issueDate: Date;
    mpesaReceiptNumber: string;
  }>;
  revenueTrend: Array<{
    month: string;
    revenue: number;
    invoices: number;
  }>;
}

export const SystemAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const [billingData, setBillingData] = useState<BillingAnalytics | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(false);

  // Check if user has revenue viewing permission
  const userAdminRole = user?.adminRoleType;
  const canViewRevenue = userAdminRole ? ADMIN_ROLE_PERMISSIONS[userAdminRole]?.viewRevenue : false;

  // Load billing analytics for Platform admins
  useEffect(() => {
    if (canViewRevenue && activeTab === 'billing') {
      loadBillingAnalytics();
    }
  }, [canViewRevenue, activeTab]);

  const loadBillingAnalytics = async () => {
    setLoadingBilling(true);
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('getAdminBillingAnalytics');
      setBillingData(result);
    } catch (error) {
      console.error('Failed to load billing analytics:', error);
    } finally {
      setLoadingBilling(false);
    }
  };

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report...`);
    // In a real app, this would trigger report generation
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <ActivityLogIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const getEventVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">System Analytics</h1>
            <p className="text-lg text-muted-foreground">
              Monitor system performance and user engagement
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${canViewRevenue ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview" className="gap-2">
              <BarChartIcon className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <PersonIcon className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <ClockIcon className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="engagement" className="gap-2">
              <TargetIcon className="w-4 h-4" />
              Engagement
            </TabsTrigger>
            {canViewRevenue && (
              <TabsTrigger value="billing" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Revenue & Billing
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">{formatNumber(systemMetrics.totalUsers)}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <ArrowUpIcon className="w-3 h-3" />
                          +{systemMetrics.newUsersToday} today
                        </div>
                      </div>
                      <PersonIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">System Uptime</p>
                        <p className="text-2xl font-bold">{systemMetrics.systemUptime}%</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Operational
                        </div>
                      </div>
                      <GlobeIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="text-2xl font-bold">{systemMetrics.averageResponseTime}ms</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          Excellent
                        </div>
                      </div>
                      <ClockIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Active Sessions</p>
                        <p className="text-2xl font-bold">{formatNumber(systemMetrics.activeConnections)}</p>
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          Live connections
                        </div>
                      </div>
                      <ActivityLogIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>System Performance (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={systemPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="CPU %"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Memory %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSystemEvents.map((event) => (
                      <Alert key={event.id} variant={getEventVariant(event.type) as "default" | "destructive"}>
                        <div className="flex items-center gap-3">
                          {getEventIcon(event.type)}
                          <div className="flex-1 flex justify-between items-center">
                            <span className="text-sm">{event.message}</span>
                            <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="students"
                          stroke="#2563eb"
                          strokeWidth={2}
                          name="Students"
                        />
                        <Line
                          type="monotone"
                          dataKey="counselors"
                          stroke="#16a34a"
                          strokeWidth={2}
                          name="Counselors"
                        />
                        <Line
                          type="monotone"
                          dataKey="admins"
                          stroke="#dc2626"
                          strokeWidth={2}
                          name="Admins"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Students</span>
                          <span className="text-sm font-medium">2,547 (89.5%)</span>
                        </div>
                        <Progress value={89.5} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Counselors</span>
                          <span className="text-sm font-medium">47 (1.7%)</span>
                        </div>
                        <Progress value={1.7} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Admins</span>
                          <span className="text-sm font-medium">8 (0.3%)</span>
                        </div>
                        <Progress value={0.3} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Storage Used</p>
                      <p className="text-2xl font-bold">{systemMetrics.storageUsed}%</p>
                      <Progress value={systemMetrics.storageUsed} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Bandwidth Usage</p>
                      <p className="text-2xl font-bold">{systemMetrics.bandwidthUsage}%</p>
                      <Progress value={systemMetrics.bandwidthUsage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold">{systemMetrics.errorRate}%</p>
                      <Progress value={systemMetrics.errorRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{formatNumber(systemMetrics.activeUsers)}</p>
                      <p className="text-xs text-green-600">+12% from last week</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={systemPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="CPU Usage %"
                      />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Memory Usage %"
                      />
                      <Line
                        type="monotone"
                        dataKey="disk"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Disk Usage %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: unknown) => {
                            const { name, percent } = entry as { name?: string; percent?: number };
                            return `${name || 'Unknown'}: ${((percent || 0) * 100).toFixed(0)}%`;
                          }}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Feature Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {platformUsageData.map((feature, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{feature.feature}</span>
                            <span className="text-sm font-medium">{feature.usage}%</span>
                          </div>
                          <Progress value={feature.usage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(feature.users)} users
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">Questions Answered</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatNumber(systemMetrics.questionsAnswered)}
                      </p>
                      <Badge variant="secondary">+15% this week</Badge>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">Sessions Completed</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatNumber(systemMetrics.sessionsCompleted)}
                      </p>
                      <Badge variant="secondary">+8% this week</Badge>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">Assessments Completed</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {formatNumber(systemMetrics.assessmentsCompleted)}
                      </p>
                      <Badge variant="secondary">+22% this week</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue & Billing Tab (Platform Admin only) */}
          {canViewRevenue && (
            <TabsContent value="billing" className="mt-6">
              {loadingBilling ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : billingData ? (
                <div className="space-y-6">
                  {/* Key Financial Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold">
                              KES {billingData.metrics.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600">All-time earnings</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                            <p className="text-2xl font-bold">
                              KES {billingData.metrics.monthlyRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-600">Current month</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">MRR</p>
                            <p className="text-2xl font-bold">
                              KES {Math.round(billingData.metrics.mrr).toLocaleString()}
                            </p>
                            <p className="text-xs text-purple-600">Monthly Recurring Revenue</p>
                          </div>
                          <CreditCard className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                            <p className="text-2xl font-bold">
                              {billingData.metrics.activeSubscriptionsCount}
                            </p>
                            <p className="text-xs text-orange-600">Paying customers</p>
                          </div>
                          <Users className="w-8 h-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">M-Pesa Success Rate</p>
                          <p className="text-2xl font-bold">{billingData.metrics.mpesaSuccessRate}%</p>
                          <Progress value={billingData.metrics.mpesaSuccessRate} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Churn Rate</p>
                          <p className="text-2xl font-bold">{billingData.metrics.churnRate}%</p>
                          <Progress value={billingData.metrics.churnRate} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">ARPU</p>
                          <p className="text-2xl font-bold">KES {billingData.metrics.arpu.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Average Revenue Per User</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Revenue Trend Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={billingData.revenueTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (KES)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Subscription Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Subscription Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(billingData.subscriptionsByPlan).map(([planId, count]) => (
                            <div key={planId} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm capitalize">{planId}</span>
                                <span className="text-sm font-medium">{count} subscribers</span>
                              </div>
                              <Progress
                                value={(count / billingData.metrics.activeSubscriptionsCount) * 100}
                                className="h-2"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Invoices */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Invoices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {billingData.recentInvoices.slice(0, 5).map((invoice) => (
                            <div key={invoice.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                                <p className="text-xs text-muted-foreground">{invoice.userName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">KES {invoice.amount.toLocaleString()}</p>
                                <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                                  {invoice.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No billing data available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle>System Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => generateReport('user-activity')}
                className="gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                User Activity Report
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport('performance-metrics')}
                className="gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Performance Report
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport('system-health')}
                className="gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                System Health Report
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport('security-audit')}
                className="gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Security Audit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
