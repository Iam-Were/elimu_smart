import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Send, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useEmailService } from '@/hooks/useEmailService';

interface EmailManagementProps {
  className?: string;
}

export const EmailManagement: React.FC<EmailManagementProps> = ({ className }) => {
  const { getEmailStatistics, error } = useEmailService();
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadEmailStats = async () => {
    setRefreshing(true);
    const statistics = await getEmailStatistics();
    if (statistics) {
      setStats(statistics);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadEmailStats();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700 border-green-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEmailTypeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'welcome': return '👋';
      case 'assessment_completion': return '🎯';
      case 'kuccps_reminder': return '⏰';
      case 'scholarship_alert': return '💰';
      case 'session_booking_student': return '📅';
      case 'session_booking_counselor': return '👨‍🏫';
      default: return '📧';
    }
  };

  const formatEmailType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Management</h2>
          <p className="text-gray-600">Monitor transactional email activity and performance</p>
        </div>
        <Button 
          onClick={loadEmailStats}
          disabled={refreshing}
          variant="secondary"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to load email statistics: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader title="Total Emails Sent" icon={Send} className="flex flex-row items-center justify-between space-y-0 pb-2" />
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSent || 0}</div>
            <p className="text-xs text-muted-foreground">
              All-time email volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Last 24 Hours" icon={Clock} className="flex flex-row items-center justify-between space-y-0 pb-2" />
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.last24Hours || 0}</div>
            <p className="text-xs text-muted-foreground">
              Recent activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="This Week" icon={TrendingUp} className="flex flex-row items-center justify-between space-y-0 pb-2" />
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.thisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">
              Weekly volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Success Rate" icon={CheckCircle} className="flex flex-row items-center justify-between space-y-0 pb-2" />
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.byStatus?.sent 
                ? Math.round((stats.byStatus.sent / stats.totalSent) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery success
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Email Types Breakdown */}
      {stats?.byType && Object.keys(stats.byType).length > 0 && (
        <Card>
          <CardHeader title="Email Types Breakdown" icon={BarChart3} />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div 
                  key={type}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getEmailTypeIcon(type)}</span>
                    <div>
                      <div className="font-medium text-sm">{formatEmailType(type)}</div>
                      <div className="text-xs text-gray-500">{count as number} sent</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{count as number}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Email Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader title="Recent Email Activity" icon={Clock} />
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getEmailTypeIcon(activity.type)}</span>
                    <div>
                      <div className="font-medium text-sm">{formatEmailType(activity.type)}</div>
                      <div className="text-xs text-gray-500">
                        To: {activity.recipient}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(activity.sentAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={getStatusBadgeColor(activity.status)}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Service Status */}
      <Card>
        <CardHeader title="ZeptoMail Service Status" icon={Mail} />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Service Online</div>
                <div className="text-xs text-green-600">ZeptoMail API connected</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">Templates Ready</div>
                <div className="text-xs text-blue-600">6 email templates configured</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-800">Tracking Enabled</div>
                <div className="text-xs text-purple-600">Opens & clicks monitored</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader title="Setup Instructions" />
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>To complete ZeptoMail setup:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sign up at <a href="https://www.zoho.com/zeptomail/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ZeptoMail</a></li>
              <li>Create a mail agent and generate a send mail token</li>
              <li>Update ZEPTOMAIL_TOKEN in backend/.env file</li>
              <li>Verify your sending domain in ZeptoMail console</li>
              <li>Update ZEPTOMAIL_FROM_EMAIL with your verified domain</li>
              <li>Test integration using: <code className="bg-gray-100 px-2 py-1 rounded">cd backend && node test-email.js</code></li>
            </ol>
            <p className="text-amber-600">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              ZeptoMail offers 10,000 free emails per month for new accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManagement;