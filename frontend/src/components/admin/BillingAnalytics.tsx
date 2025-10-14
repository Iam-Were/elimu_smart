import React, { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BillingMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  mrr: number;
  activeSubscriptionsCount: number;
  totalInvoicesCount: number;
  mpesaSuccessRate: number;
  churnRate: number;
  arpu: number;
}

interface RecentInvoice {
  id: string;
  invoiceNumber: string;
  userName: string;
  planName: string;
  amount: number;
  status: string;
  issueDate: Date;
  mpesaReceiptNumber?: string;
}

interface RevenueTrend {
  month: string;
  revenue: number;
  invoices: number;
}

interface BillingAnalytics {
  success: boolean;
  metrics: BillingMetrics;
  subscriptionsByPlan: Record<string, number>;
  recentInvoices: RecentInvoice[];
  revenueTrend: RevenueTrend[];
}

export const BillingAnalytics: React.FC = () => {
  const [data, setData] = useState<BillingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingAnalytics();
  }, []);

  const fetchBillingAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('getAdminBillingAnalytics');
      setData(result);
    } catch (err) {
      console.error('Failed to fetch billing analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load billing analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading billing analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-900">
          <strong>Failed to load billing analytics:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const { metrics, subscriptionsByPlan, recentInvoices, revenueTrend } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Revenue & Billing Analytics</h2>
        <p className="text-muted-foreground">
          Financial performance and subscription metrics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700">All-Time</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.totalRevenue)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">This Month</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(metrics.monthlyRevenue)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>

        {/* MRR */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">MRR</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(metrics.mrr)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Monthly Recurring Revenue</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">Active</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {metrics.activeSubscriptionsCount}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Subscriptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Invoices</p>
            </div>
            <p className="text-xl font-bold">{metrics.totalInvoicesCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">M-Pesa Success Rate</p>
            </div>
            <p className="text-xl font-bold text-green-600">{metrics.mpesaSuccessRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Churn Rate</p>
            </div>
            <p className="text-xl font-bold text-red-600">{metrics.churnRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-muted-foreground">ARPU</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(metrics.arpu)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
          <CardDescription>Monthly revenue and invoice counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold">{item.month}</p>
                  <p className="text-sm text-muted-foreground">{item.invoices} invoices</p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions by Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions by Plan</CardTitle>
          <CardDescription>Active subscription distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(subscriptionsByPlan).map(([planId, count]) => (
              <div key={planId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-semibold capitalize">{planId}</p>
                </div>
                <Badge className="bg-purple-100 text-purple-700">{count} users</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Last 10 billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.userName}</TableCell>
                    <TableCell>{invoice.planName}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      {invoice.status === 'paid' ? (
                        <Badge className="bg-green-100 text-green-700">Paid</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
