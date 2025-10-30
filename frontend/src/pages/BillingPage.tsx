import React, { useState } from 'react';
import { useBilling, type Invoice } from '@/hooks/useBilling';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  Mail,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const BillingPage: React.FC = () => {
  const { invoices, isLoading: invoicesLoading, downloadInvoicePDF, resendInvoiceEmail } = useBilling();
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();
  const [processingInvoiceId, setProcessingInvoiceId] = useState<string | null>(null);
  const [resendingInvoiceId, setResendingInvoiceId] = useState<string | null>(null);

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setProcessingInvoiceId(invoice.id);
    try {
      await downloadInvoicePDF(invoice.id, invoice.invoiceNumber);
      toast.success('Invoice Ready', {
        description: 'Opening invoice in new window for download'
      });
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Download Failed', {
        description: 'Could not generate invoice PDF'
      });
    } finally {
      setProcessingInvoiceId(null);
    }
  };

  const handleResendInvoice = async (invoice: Invoice) => {
    setResendingInvoiceId(invoice.id);
    try {
      const success = await resendInvoiceEmail(invoice.id);
      if (success) {
        toast.success('Invoice Sent', {
          description: 'Check your email for the invoice'
        });
      } else {
        throw new Error('Resend failed');
      }
    } catch (error) {
      console.error('Failed to resend invoice:', error);
      toast.error('Send Failed', {
        description: 'Could not resend invoice email'
      });
    } finally {
      setResendingInvoiceId(null);
    }
  };

  if (invoicesLoading || subscriptionLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Note: H1 is provided by Sprint18Layout (auto-title for current route) */}
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Billing & Invoices</h2>
        <p className="text-muted-foreground">
          Manage your subscription and view billing history
        </p>
      </div>

      {/* Current Subscription Card */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your active plan and payment details</CardDescription>
              </div>
            </div>
            {userSubscription?.status === 'active' && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {userSubscription?.status === 'active' ? (
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="font-semibold text-lg">{userSubscription.planName || 'Premium'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="font-medium">M-Pesa</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Billing Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">
                    {userSubscription.expiresAt ? formatDate(userSubscription.expiresAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-900">
                You don't have an active subscription.{' '}
                <a href="/subscription" className="font-semibold underline">
                  View Plans
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No invoices yet</p>
              <p className="text-muted-foreground mb-4">
                Your invoices will appear here after you subscribe
              </p>
              <Button onClick={() => window.location.href = '/subscription'}>
                View Subscription Plans
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{invoice.planName}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                            disabled={processingInvoiceId === invoice.id}
                          >
                            {processingInvoiceId === invoice.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvoice(invoice)}
                            disabled={resendingInvoiceId === invoice.id}
                          >
                            {resendingInvoiceId === invoice.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="bg-gradient-to-br from-orange-50 to-background border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Secure M-Pesa Payments</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All payments are processed securely through Safaricom M-Pesa. You'll receive an invoice via email after each successful payment.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  Instant confirmation
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  SMS receipt
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  Email invoice
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
