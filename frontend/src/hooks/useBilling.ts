import { useState, useEffect, useCallback } from 'react';
import { getParse } from '@/config/parse';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  issueDate: Date;
  paidAt?: Date;
  mpesaReceiptNumber?: string;
  billingPeriodStart?: Date;
  billingPeriodEnd?: Date;
}

export interface InvoiceDetails extends Invoice {
  userName: string;
  userEmail: string;
  planDuration: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
}

export const useBilling = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingHistory = useCallback(async (limit = 50) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('getBillingHistory', { limit });

      const transformedInvoices: Invoice[] = result.map((inv: {
        id: string;
        invoiceNumber: string;
        planName: string;
        amount: number;
        currency: string;
        status: string;
        issueDate: { iso: string } | string;
        paidAt?: { iso: string } | string;
        mpesaReceiptNumber?: string;
        billingPeriodStart?: { iso: string } | string;
        billingPeriodEnd?: { iso: string } | string;
      }) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        planName: inv.planName,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status as 'paid' | 'pending' | 'failed',
        issueDate: new Date(typeof inv.issueDate === 'string' ? inv.issueDate : inv.issueDate.iso),
        paidAt: inv.paidAt ? new Date(typeof inv.paidAt === 'string' ? inv.paidAt : inv.paidAt.iso) : undefined,
        mpesaReceiptNumber: inv.mpesaReceiptNumber,
        billingPeriodStart: inv.billingPeriodStart ? new Date(typeof inv.billingPeriodStart === 'string' ? inv.billingPeriodStart : inv.billingPeriodStart.iso) : undefined,
        billingPeriodEnd: inv.billingPeriodEnd ? new Date(typeof inv.billingPeriodEnd === 'string' ? inv.billingPeriodEnd : inv.billingPeriodEnd.iso) : undefined
      }));

      setInvoices(transformedInvoices);
    } catch (err) {
      console.error('Failed to fetch billing history:', err);
      setError('Failed to load billing history');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getInvoiceDetails = useCallback(async (invoiceId: string): Promise<InvoiceDetails | null> => {
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('getInvoiceDetails', { invoiceId });

      return {
        id: result.id,
        invoiceNumber: result.invoiceNumber,
        userName: result.userName,
        userEmail: result.userEmail,
        planName: result.planName,
        planDuration: result.planDuration,
        subtotal: result.subtotal,
        tax: result.tax,
        total: result.total,
        amount: result.total,
        currency: result.currency,
        status: result.status,
        paymentMethod: result.paymentMethod,
        mpesaReceiptNumber: result.mpesaReceiptNumber,
        issueDate: new Date(result.issueDate.iso || result.issueDate),
        paidAt: result.paidAt ? new Date(result.paidAt.iso || result.paidAt) : undefined,
        billingPeriodStart: result.billingPeriodStart ? new Date(result.billingPeriodStart.iso || result.billingPeriodStart) : undefined,
        billingPeriodEnd: result.billingPeriodEnd ? new Date(result.billingPeriodEnd.iso || result.billingPeriodEnd) : undefined,
        companyName: result.companyName,
        companyEmail: result.companyEmail,
        companyPhone: result.companyPhone,
        companyAddress: result.companyAddress
      };
    } catch (err) {
      console.error('Failed to fetch invoice details:', err);
      return null;
    }
  }, []);

  const getInvoiceHTML = useCallback(async (invoiceId: string): Promise<string | null> => {
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('getInvoiceHTML', { invoiceId });
      return result.html;
    } catch (err) {
      console.error('Failed to fetch invoice HTML:', err);
      return null;
    }
  }, []);

  const downloadInvoicePDF = useCallback(async (invoiceId: string, _invoiceNumber: string) => {
    try {
      const html = await getInvoiceHTML(invoiceId);
      if (!html) {
        throw new Error('Failed to generate invoice');
      }

      // Open in new window for printing to PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();

        // Auto-trigger print dialog after content loads
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    } catch (err) {
      console.error('Failed to download invoice:', err);
      throw err;
    }
  }, [getInvoiceHTML]);

  const resendInvoiceEmail = useCallback(async (invoiceId: string): Promise<boolean> => {
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('resendInvoice', { invoiceId });
      return result.success;
    } catch (err) {
      console.error('Failed to resend invoice:', err);
      return false;
    }
  }, []);

  const generateInvoice = useCallback(async (subscriptionId: string): Promise<{
    success: boolean;
    invoiceId: string;
    invoiceNumber: string;
  } | null> => {
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('generateInvoice', { subscriptionId });
      return result;
    } catch (err) {
      console.error('Failed to generate invoice:', err);
      return null;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchBillingHistory();
  }, [fetchBillingHistory]);

  return {
    invoices,
    isLoading,
    error,
    fetchBillingHistory,
    getInvoiceDetails,
    downloadInvoicePDF,
    resendInvoiceEmail,
    generateInvoice
  };
};
