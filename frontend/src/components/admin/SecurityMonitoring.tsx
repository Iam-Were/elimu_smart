import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ExclamationTriangleIcon,
  EyeOpenIcon,
  LockClosedIcon,
  PersonIcon,
  GlobeIcon,
  ReloadIcon,
  DownloadIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  status: 'active' | 'investigating' | 'resolved';
  affectedUsers?: number;
}

interface SecurityMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export const SecurityMonitoring: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertFilter, setAlertFilter] = useState('all');

  const [securityMetrics] = useState<SecurityMetric[]>([
    { name: 'Failed Login Attempts', value: 47, unit: 'attempts', trend: 'down', status: 'good' },
    { name: 'Blocked IPs', value: 12, unit: 'IPs', trend: 'up', status: 'warning' },
    { name: 'Suspicious Activities', value: 3, unit: 'events', trend: 'stable', status: 'good' },
    { name: 'Data Breaches', value: 0, unit: 'incidents', trend: 'stable', status: 'good' },
    { name: 'Malware Detections', value: 2, unit: 'files', trend: 'down', status: 'good' },
    { name: 'Firewall Blocks', value: 234, unit: 'requests', trend: 'up', status: 'good' },
  ]);

  const [securityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'high',
      title: 'Multiple Failed Login Attempts',
      description: 'Detected 15 failed login attempts from IP 192.168.1.100',
      timestamp: new Date('2024-01-20T14:30:00'),
      source: 'Authentication System',
      status: 'investigating',
      affectedUsers: 3,
    },
    {
      id: '2',
      type: 'medium',
      title: 'Unusual Data Access Pattern',
      description: 'User john.doe accessed 50+ student records within 5 minutes',
      timestamp: new Date('2024-01-20T13:15:00'),
      source: 'Data Access Monitor',
      status: 'active',
      affectedUsers: 1,
    },
    {
      id: '3',
      type: 'low',
      title: 'Outdated Password Policy',
      description: '5 users have not updated passwords in 90+ days',
      timestamp: new Date('2024-01-20T12:00:00'),
      source: 'Password Policy',
      status: 'active',
      affectedUsers: 5,
    },
    {
      id: '4',
      type: 'critical',
      title: 'SQL Injection Attempt',
      description: 'Detected SQL injection attempt on student data endpoint',
      timestamp: new Date('2024-01-20T11:45:00'),
      source: 'WAF',
      status: 'resolved',
      affectedUsers: 0,
    },
    {
      id: '5',
      type: 'medium',
      title: 'Elevated Privilege Usage',
      description: 'Admin user performed bulk operations outside normal hours',
      timestamp: new Date('2024-01-20T10:30:00'),
      source: 'Privilege Monitor',
      status: 'resolved',
      affectedUsers: 0,
    },
  ]);

  const filteredAlerts = securityAlerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'active') return alert.status === 'active';
    if (alertFilter === 'critical') return alert.type === 'critical';
    return alert.type === alertFilter;
  });

  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * 5, currentPage * 5);
  const totalPages = Math.ceil(filteredAlerts.length / 5);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'investigating': return 'default';
      case 'resolved': return 'outline';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getMetricBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'good': return 'outline';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    toast.success("Action Completed", {
      description: 'Security monitoring data has been updated',
    });
  };

  const exportReport = () => {
    toast.success("Action Completed", {
      description: 'Security report has been exported successfully',
    });
  };

  const resolveAlert = () => {
    toast.success("Action Completed", {
      description: 'Security alert has been marked as resolved',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Security Monitoring</h1>
          <p className="text-lg text-muted-foreground">
            Real-time security monitoring and threat detection
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={refreshing}>
            <ReloadIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                  <Badge variant={getMetricBadgeVariant(metric.status)}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.unit}</p>
                  </div>
                  <p className={`text-sm ${metric.trend === 'up' ? 'text-red-500' : metric.trend === 'down' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {getTrendIcon(metric.trend)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <ExclamationTriangleIcon className="h-8 w-8 text-green-500" />
              <p className="text-xs text-muted-foreground text-center">Security Score</p>
              <p className="text-2xl font-bold text-green-500">94%</p>
              <Badge variant="outline" className="bg-green-50">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <LockClosedIcon className="h-8 w-8 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Active Sessions</p>
              <p className="text-2xl font-bold text-purple-600">127</p>
              <Badge variant="outline" className="bg-blue-50">Normal</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <GlobeIcon className="h-8 w-8 text-purple-500" />
              <p className="text-xs text-muted-foreground text-center">Network Events</p>
              <p className="text-2xl font-bold text-purple-500">1,247</p>
              <Badge variant="secondary">Monitoring</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <PersonIcon className="h-8 w-8 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">User Anomalies</p>
              <p className="text-2xl font-bold text-purple-600">3</p>
              <Badge variant="outline" className="bg-blue-50">Low Risk</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Security Alerts</CardTitle>
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter alerts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge variant={getAlertColor(alert.type)}>
                      {alert.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      {alert.affectedUsers && alert.affectedUsers > 0 && (
                        <p className="text-xs text-orange-500">
                          Affects {alert.affectedUsers} user(s)
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{alert.source}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          toast.success("Action Completed", {
                            description: alert.description,
                          });
                        }}
                      >
                        <EyeOpenIcon className="h-4 w-4" />
                      </Button>
                      {alert.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => resolveAlert()}
                        >
                          <CheckCircledIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Firewall Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Incoming Traffic</p>
                <Badge variant="outline" className="bg-green-50">Protected</Badge>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">85% of traffic allowed, 15% blocked</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Outgoing Traffic</p>
                <Badge variant="outline" className="bg-green-50">Monitored</Badge>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">92% normal traffic patterns</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Two-Factor Authentication</p>
                <Badge variant="outline" className="bg-green-50">87% Adoption</Badge>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Password Strength</p>
                <Badge variant="secondary">Good</Badge>
              </div>
              <Progress value={73} className="h-2" />
              <p className="text-xs text-muted-foreground">73% of users have strong passwords</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Alert>
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          All systems are operating normally. Security monitoring is active and all protective measures are in place.
          Last security scan completed: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}.
        </AlertDescription>
      </Alert>
    </div>
  );
};
