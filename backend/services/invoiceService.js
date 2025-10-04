// Invoice Generation & Billing Management Service for Elimu Smart
// Handles invoice creation, PDF generation, and billing history

/**
 * Generate invoice number
 * Format: INV-YYYY-MM-XXXXXXX
 */
function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `INV-${year}-${month}-${random}`;
}

/**
 * Generate invoice receipt number
 * Format: RCP-YYYY-MM-XXXXXXX
 */
function generateReceiptNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `RCP-${year}-${month}-${random}`;
}

/**
 * Create invoice record
 */
async function createInvoice({ subscription, user, plan, paymentDetails }) {
  const invoiceNumber = generateInvoiceNumber();
  const now = new Date();

  const invoice = {
    invoiceNumber,
    subscriptionId: subscription.id,
    userId: user.id,
    userEmail: user.get('email'),
    userName: `${user.get('firstName')} ${user.get('lastName')}`,

    // Plan details
    planId: plan.id,
    planName: plan.name,
    planDuration: plan.duration,

    // Pricing
    subtotal: plan.price,
    tax: 0, // Kenya VAT if applicable
    total: plan.price,
    currency: 'KES',

    // Billing period
    billingPeriodStart: subscription.get('startDate'),
    billingPeriodEnd: subscription.get('expiresAt'),

    // Payment details
    paymentMethod: 'M-Pesa',
    paymentStatus: 'paid',
    paidAt: now,
    mpesaReceiptNumber: paymentDetails?.mpesaReceiptNumber,
    transactionDate: paymentDetails?.transactionDate,

    // Invoice metadata
    issueDate: now,
    dueDate: now, // Immediate for subscription payments
    status: 'paid',

    // Company details
    companyName: 'Elimu Smart Platform',
    companyEmail: 'billing@elimu-smart.co.ke',
    companyPhone: '+254 700 000 000',
    companyAddress: 'Nairobi, Kenya',
    companyWebsite: 'https://elimu-smart.co.ke'
  };

  return invoice;
}

/**
 * Generate invoice HTML for email/PDF
 */
function generateInvoiceHTML(invoice) {
  const formatCurrency = (amount) => `KES ${amount.toLocaleString()}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #f97316, #fb923c); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info, .customer-info { flex: 1; }
        .company-info h3, .customer-info h3 { color: #f97316; margin-top: 0; }
        .invoice-meta { background: #fff7ed; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
        .invoice-meta table { width: 100%; }
        .invoice-meta td { padding: 8px; }
        .invoice-meta td:first-child { font-weight: bold; color: #f97316; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #f97316; color: white; padding: 12px; text-align: left; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .totals { text-align: right; margin-bottom: 30px; }
        .totals table { margin-left: auto; min-width: 300px; }
        .totals td { padding: 8px; }
        .totals .total-row { font-size: 18px; font-weight: bold; color: #f97316; border-top: 2px solid #f97316; }
        .payment-info { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .payment-info h3 { color: #10b981; margin-top: 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .stamp { background: #10b981; color: white; padding: 10px 20px; border-radius: 8px; display: inline-block; transform: rotate(-5deg); font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <p>${invoice.companyName}</p>
      </div>

      <div class="invoice-details">
        <div class="company-info">
          <h3>From</h3>
          <p><strong>${invoice.companyName}</strong></p>
          <p>${invoice.companyAddress}</p>
          <p>Email: ${invoice.companyEmail}</p>
          <p>Phone: ${invoice.companyPhone}</p>
          <p>Web: ${invoice.companyWebsite}</p>
        </div>
        <div class="customer-info">
          <h3>Bill To</h3>
          <p><strong>${invoice.userName}</strong></p>
          <p>Email: ${invoice.userEmail}</p>
        </div>
      </div>

      <div class="invoice-meta">
        <table>
          <tr>
            <td>Invoice Number:</td>
            <td>${invoice.invoiceNumber}</td>
          </tr>
          <tr>
            <td>Issue Date:</td>
            <td>${formatDate(invoice.issueDate)}</td>
          </tr>
          <tr>
            <td>Payment Method:</td>
            <td>${invoice.paymentMethod}</td>
          </tr>
          ${invoice.mpesaReceiptNumber ? `
          <tr>
            <td>M-Pesa Receipt:</td>
            <td>${invoice.mpesaReceiptNumber}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Billing Period</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${invoice.planName}</strong><br>
              <small>${invoice.planDuration === 'monthly' ? 'Monthly' : 'Annual'} Subscription</small>
            </td>
            <td>${formatDate(invoice.billingPeriodStart)} - ${formatDate(invoice.billingPeriodEnd)}</td>
            <td>${formatCurrency(invoice.subtotal)}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>${formatCurrency(invoice.subtotal)}</td>
          </tr>
          ${invoice.tax > 0 ? `
          <tr>
            <td>Tax (VAT):</td>
            <td>${formatCurrency(invoice.tax)}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td>Total:</td>
            <td>${formatCurrency(invoice.total)}</td>
          </tr>
        </table>
      </div>

      <div class="payment-info">
        <h3>✅ Payment Received</h3>
        <p><strong>Status:</strong> Paid in Full</p>
        <p><strong>Payment Date:</strong> ${formatDate(invoice.paidAt)}</p>
        <p><strong>Transaction ID:</strong> ${invoice.mpesaReceiptNumber || invoice.invoiceNumber}</p>
      </div>

      <div style="text-align: center;">
        <div class="stamp">PAID</div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is an electronically generated invoice and does not require a signature.</p>
        <p>${invoice.companyName} • ${invoice.companyEmail} • ${invoice.companyWebsite}</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate invoice email template
 */
function getInvoiceEmailTemplate(invoice, user) {
  return {
    subject: `Your Invoice ${invoice.invoiceNumber} - Elimu Smart Subscription`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #f97316, #fb923c); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Invoice Received</h1>
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #f97316; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #f97316;">Hi ${user.get('firstName')}!</h2>

          <p style="font-size: 16px; color: #333;">
            Thank you for subscribing to <strong>${invoice.planName}</strong>! Your payment has been received and processed successfully.
          </p>

          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f97316; margin-top: 0;">Payment Summary</h3>
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Invoice Number:</strong></td>
                <td style="padding: 8px 0;">${invoice.invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount Paid:</strong></td>
                <td style="padding: 8px 0;">KES ${invoice.total.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
                <td style="padding: 8px 0;">${invoice.paymentMethod}</td>
              </tr>
              ${invoice.mpesaReceiptNumber ? `
              <tr>
                <td style="padding: 8px 0;"><strong>M-Pesa Receipt:</strong></td>
                <td style="padding: 8px 0;">${invoice.mpesaReceiptNumber}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0; color: #065f46;">
              <strong>✅ Subscription Active</strong><br>
              Your subscription is now active and will renew on ${new Date(invoice.billingPeriodEnd).toLocaleDateString()}.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/subscription"
               style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Billing History
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Questions about your invoice? Reply to this email or contact us at billing@elimu-smart.co.ke<br>
            ${invoice.companyName} - Empowering Kenyan Students 🇰🇪
          </p>
        </div>
      </div>
    `,
    textBody: `Invoice ${invoice.invoiceNumber} - Thank you for subscribing to ${invoice.planName}. Amount: KES ${invoice.total}. M-Pesa Receipt: ${invoice.mpesaReceiptNumber || 'N/A'}`
  };
}

module.exports = {
  generateInvoiceNumber,
  generateReceiptNumber,
  createInvoice,
  generateInvoiceHTML,
  getInvoiceEmailTemplate
};
