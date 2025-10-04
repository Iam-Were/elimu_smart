// Billing & Invoice Management Cloud Functions
const invoiceService = require('../services/invoiceService');
const emailService = require('../services/emailService');

/**
 * Generate and save invoice after successful payment
 */
Parse.Cloud.define('generateInvoice', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');

  const { subscriptionId } = request.params;

  try {
    const Subscription = Parse.Object.extend('Subscription');
    const query = new Parse.Query(Subscription);
    const subscription = await query.get(subscriptionId, { useMasterKey: true });

    if (!subscription) throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Subscription not found');

    const plansResponse = await Parse.Cloud.run('getSubscriptionPlans');
    const plan = plansResponse.plans.find(p => p.id === subscription.get('planId'));

    const invoiceData = await invoiceService.createInvoice({
      subscription,
      user: request.user,
      plan,
      paymentDetails: {
        mpesaReceiptNumber: subscription.get('mpesaReceiptNumber'),
        transactionDate: subscription.get('transactionDate')
      }
    });

    const Invoice = Parse.Object.extend('Invoice');
    const invoice = new Invoice();
    Object.keys(invoiceData).forEach(key => invoice.set(key, invoiceData[key]));
    invoice.set('user', request.user);
    invoice.set('subscription', subscription);
    await invoice.save(null, { useMasterKey: true });

    const emailTemplate = invoiceService.getInvoiceEmailTemplate(invoiceData, request.user);
    await emailService.sendEmail({
      to: request.user.get('email'),
      toName: request.user.get('firstName') + ' ' + request.user.get('lastName'),
      ...emailTemplate
    });

    return { success: true, invoiceId: invoice.id, invoiceNumber: invoiceData.invoiceNumber };
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to generate invoice: ' + error.message);
  }
});

/**
 * Get user billing history
 */
Parse.Cloud.define('getBillingHistory', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');

  try {
    const Invoice = Parse.Object.extend('Invoice');
    const query = new Parse.Query(Invoice);
    query.equalTo('user', request.user);
    query.descending('issueDate');
    query.limit(request.params.limit || 50);

    const invoices = await query.find({ useMasterKey: true });

    return invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.get('invoiceNumber'),
      planName: inv.get('planName'),
      amount: inv.get('total'),
      currency: inv.get('currency'),
      status: inv.get('status'),
      issueDate: inv.get('issueDate'),
      paidAt: inv.get('paidAt'),
      mpesaReceiptNumber: inv.get('mpesaReceiptNumber'),
      billingPeriodStart: inv.get('billingPeriodStart'),
      billingPeriodEnd: inv.get('billingPeriodEnd')
    }));
  } catch (error) {
    console.error('Error getting billing history:', error);
    return [];
  }
});

/**
 * Get invoice details
 */
Parse.Cloud.define('getInvoiceDetails', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');

  const { invoiceId } = request.params;

  try {
    const Invoice = Parse.Object.extend('Invoice');
    const query = new Parse.Query(Invoice);
    query.equalTo('user', request.user);
    const invoice = await query.get(invoiceId, { useMasterKey: true });

    if (!invoice) throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Invoice not found');

    return {
      id: invoice.id,
      invoiceNumber: invoice.get('invoiceNumber'),
      userName: invoice.get('userName'),
      userEmail: invoice.get('userEmail'),
      planName: invoice.get('planName'),
      planDuration: invoice.get('planDuration'),
      subtotal: invoice.get('subtotal'),
      tax: invoice.get('tax'),
      total: invoice.get('total'),
      currency: invoice.get('currency'),
      status: invoice.get('status'),
      paymentMethod: invoice.get('paymentMethod'),
      mpesaReceiptNumber: invoice.get('mpesaReceiptNumber'),
      issueDate: invoice.get('issueDate'),
      paidAt: invoice.get('paidAt'),
      billingPeriodStart: invoice.get('billingPeriodStart'),
      billingPeriodEnd: invoice.get('billingPeriodEnd'),
      companyName: invoice.get('companyName'),
      companyEmail: invoice.get('companyEmail'),
      companyPhone: invoice.get('companyPhone'),
      companyAddress: invoice.get('companyAddress')
    };
  } catch (error) {
    console.error('Error getting invoice details:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get invoice: ' + error.message);
  }
});

/**
 * Get invoice HTML
 */
Parse.Cloud.define('getInvoiceHTML', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');

  const { invoiceId } = request.params;

  try {
    const invoiceData = await Parse.Cloud.run('getInvoiceDetails', { invoiceId });
    const html = invoiceService.generateInvoiceHTML(invoiceData);
    return { success: true, html };
  } catch (error) {
    console.error('Error generating invoice HTML:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to generate invoice HTML: ' + error.message);
  }
});

/**
 * Resend invoice email
 */
Parse.Cloud.define('resendInvoice', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');

  const { invoiceId } = request.params;

  try {
    const invoiceData = await Parse.Cloud.run('getInvoiceDetails', { invoiceId });
    const emailTemplate = invoiceService.getInvoiceEmailTemplate(invoiceData, request.user);

    await emailService.sendEmail({
      to: request.user.get('email'),
      toName: request.user.get('firstName') + ' ' + request.user.get('lastName'),
      ...emailTemplate
    });

    return { success: true, message: 'Invoice email sent successfully' };
  } catch (error) {
    console.error('Error resending invoice:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to resend invoice: ' + error.message);
  }
});

/**
 * Get admin billing analytics (Platform Admin only)
 */
Parse.Cloud.define('getAdminBillingAnalytics', async (request) => {
  // Authentication check
  if (!request.user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');

  // Admin role check
  const userRole = request.user.get('role');
  if (userRole !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  // Platform admin check (viewRevenue permission)
  const adminRole = request.user.get('adminRole');
  if (adminRole !== 'platform') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Platform admin access required for billing data');
  }

  try {
    const Subscription = Parse.Object.extend('Subscription');
    const Invoice = Parse.Object.extend('Invoice');

    // Get all subscriptions
    const subscriptionQuery = new Parse.Query(Subscription);
    const allSubscriptions = await subscriptionQuery.find({ useMasterKey: true });

    // Get all invoices
    const invoiceQuery = new Parse.Query(Invoice);
    invoiceQuery.descending('issueDate');
    const allInvoices = await invoiceQuery.find({ useMasterKey: true });

    // Calculate total revenue
    const totalRevenue = allInvoices.reduce((sum, inv) => sum + (inv.get('total') || 0), 0);

    // Calculate current month revenue
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthInvoices = allInvoices.filter(inv => {
      const issueDate = inv.get('issueDate');
      return issueDate && issueDate >= monthStart;
    });
    const monthlyRevenue = currentMonthInvoices.reduce((sum, inv) => sum + (inv.get('total') || 0), 0);

    // Count active subscriptions
    const activeSubscriptions = allSubscriptions.filter(sub => sub.get('status') === 'active');

    // Subscription distribution by plan
    const subscriptionsByPlan = activeSubscriptions.reduce((acc, sub) => {
      const planId = sub.get('planId') || 'unknown';
      acc[planId] = (acc[planId] || 0) + 1;
      return acc;
    }, {});

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const amount = sub.get('amount') || 0;
      const duration = sub.get('duration');
      // Convert annual to monthly
      const monthlyAmount = duration === 'yearly' ? amount / 12 : amount;
      return sum + monthlyAmount;
    }, 0);

    // Recent invoices (last 10)
    const recentInvoices = allInvoices.slice(0, 10).map(inv => ({
      id: inv.id,
      invoiceNumber: inv.get('invoiceNumber'),
      userName: inv.get('userName'),
      planName: inv.get('planName'),
      amount: inv.get('total'),
      status: inv.get('status'),
      issueDate: inv.get('issueDate'),
      mpesaReceiptNumber: inv.get('mpesaReceiptNumber')
    }));

    // M-Pesa transaction success rate
    const mpesaInvoices = allInvoices.filter(inv => inv.get('paymentMethod') === 'M-Pesa');
    const successfulMpesa = mpesaInvoices.filter(inv => inv.get('status') === 'paid');
    const mpesaSuccessRate = mpesaInvoices.length > 0
      ? (successfulMpesa.length / mpesaInvoices.length) * 100
      : 100;

    // Revenue trend (last 6 months)
    const revenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthInvoices = allInvoices.filter(inv => {
        const issueDate = inv.get('issueDate');
        return issueDate && issueDate >= monthDate && issueDate < nextMonthDate;
      });

      const monthRevenue = monthInvoices.reduce((sum, inv) => sum + (inv.get('total') || 0), 0);

      revenueTrend.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        invoices: monthInvoices.length
      });
    }

    // Calculate churn (subscriptions that expired this month)
    const expiredThisMonth = allSubscriptions.filter(sub => {
      const expiresAt = sub.get('expiresAt');
      const status = sub.get('status');
      return expiresAt && status === 'expired' && expiresAt >= monthStart && expiresAt < now;
    });
    const churnRate = activeSubscriptions.length > 0
      ? (expiredThisMonth.length / (activeSubscriptions.length + expiredThisMonth.length)) * 100
      : 0;

    // ARPU (Average Revenue Per User)
    const arpu = activeSubscriptions.length > 0 ? totalRevenue / activeSubscriptions.length : 0;

    return {
      success: true,
      metrics: {
        totalRevenue,
        monthlyRevenue,
        mrr,
        activeSubscriptionsCount: activeSubscriptions.length,
        totalInvoicesCount: allInvoices.length,
        mpesaSuccessRate: Math.round(mpesaSuccessRate * 10) / 10,
        churnRate: Math.round(churnRate * 10) / 10,
        arpu: Math.round(arpu)
      },
      subscriptionsByPlan,
      recentInvoices,
      revenueTrend
    };
  } catch (error) {
    console.error('Error getting admin billing analytics:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to get billing analytics: ' + error.message);
  }
});

module.exports = {
  // Functions are auto-registered by Parse.Cloud.define
};
