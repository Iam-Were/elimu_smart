// Payment & M-Pesa Integration Cloud Functions
// PCI-Compliant: Processes M-Pesa callbacks and manages subscriptions

const mpesaService = require('../services/mpesaService');
const { queryPaymentDB } = require('../config/databases');
const emailService = require('../services/emailService');

/**
 * M-Pesa STK Push Callback Handler
 * Called by Safaricom when payment is completed/failed
 * Public endpoint - no authentication required (M-Pesa callback)
 */
Parse.Cloud.define('mpesaCallback', async (request) => {
  console.log('📱 M-Pesa callback received:', JSON.stringify(request.params));

  try {
    // Process callback data (updates payment vault database)
    const callbackResult = await mpesaService.processCallback(request.params);

    if (callbackResult.success) {
      console.log('✅ Payment successful:', callbackResult.checkoutRequestId);

      // Get subscription from payment vault to find userId
      const paymentQuery = await queryPaymentDB(`
        SELECT "userId", "subscriptionId", "amount"
        FROM "PaymentTransaction"
        WHERE "checkoutRequestId" = $1
        LIMIT 1
      `, [callbackResult.checkoutRequestId]);

      if (paymentQuery.rows.length === 0) {
        console.error('❌ Payment transaction not found in vault');
        return { success: false, message: 'Transaction not found' };
      }

      const { userId, subscriptionId, amount } = paymentQuery.rows[0];

      // Update subscription in MAIN database (not payment vault)
      const Subscription = Parse.Object.extend('Subscription');
      const subQuery = new Parse.Query(Subscription);
      const subscription = await subQuery.get(subscriptionId, { useMasterKey: true });

      if (!subscription) {
        console.error('❌ Subscription not found in main database:', subscriptionId);
        return { success: false, message: 'Subscription not found' };
      }

      // Activate subscription
      const planDuration = subscription.get('planId');
      const startDate = new Date();
      const expiresAt = new Date();

      if (planDuration === 'monthly' || planDuration === 'basic' || planDuration === 'premium') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (planDuration === 'yearly' || planDuration === 'annual') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      subscription.set('status', 'active');
      subscription.set('startDate', startDate);
      subscription.set('expiresAt', expiresAt);
      subscription.set('mpesaReceiptNumber', callbackResult.mpesaReceiptNumber); // Store reference
      subscription.set('transactionDate', new Date(callbackResult.transactionDate));
      await subscription.save(null, { useMasterKey: true });

      console.log('✅ Subscription activated:', subscriptionId);

      // Auto-generate invoice
      try {
        const User = Parse.Object.extend('_User');
        const userQuery = new Parse.Query(User);
        const user = await userQuery.get(userId, { useMasterKey: true });

        await Parse.Cloud.run('generateInvoice', {
          subscriptionId: subscriptionId
        }, {
          sessionToken: user.getSessionToken()
        });

        console.log('✅ Invoice auto-generated');
      } catch (invoiceError) {
        console.error('⚠️  Invoice generation failed:', invoiceError.message);
        // Don't fail the callback if invoice fails
      }

      // Send confirmation email
      try {
        const User = Parse.Object.extend('_User');
        const userQuery = new Parse.Query(User);
        const user = await userQuery.get(userId, { useMasterKey: true });

        await emailService.sendEmail({
          to: user.get('email'),
          toName: `${user.get('firstName')} ${user.get('lastName')}`,
          subject: 'Payment Successful - Elimu Smart Subscription Activated',
          htmlContent: `
            <h2>Payment Successful!</h2>
            <p>Your ${subscription.get('planName')} subscription has been activated.</p>
            <p><strong>Amount Paid:</strong> KES ${amount.toLocaleString()}</p>
            <p><strong>M-Pesa Receipt:</strong> ${callbackResult.mpesaReceiptNumber}</p>
            <p><strong>Valid Until:</strong> ${expiresAt.toLocaleDateString()}</p>
            <p>You now have access to premium features including unlimited counselor sessions and priority support.</p>
            <p><a href="https://elimu-smart.co.ke/billing">View Your Invoice</a></p>
          `
        });

        console.log('✅ Confirmation email sent');
      } catch (emailError) {
        console.error('⚠️  Email sending failed:', emailError.message);
        // Don't fail the callback if email fails
      }

      return {
        ResultCode: 0,
        ResultDesc: 'Success',
        success: true
      };
    } else {
      console.log('⚠️  Payment failed:', callbackResult.resultDesc);

      // Get subscription to mark as failed
      const paymentQuery = await queryPaymentDB(`
        SELECT "subscriptionId"
        FROM "PaymentTransaction"
        WHERE "checkoutRequestId" = $1
        LIMIT 1
      `, [callbackResult.checkoutRequestId]);

      if (paymentQuery.rows.length > 0) {
        const { subscriptionId } = paymentQuery.rows[0];

        const Subscription = Parse.Object.extend('Subscription');
        const subQuery = new Parse.Query(Subscription);
        const subscription = await subQuery.get(subscriptionId, { useMasterKey: true });

        if (subscription) {
          subscription.set('status', 'failed');
          subscription.set('failureReason', callbackResult.resultDesc);
          await subscription.save(null, { useMasterKey: true });
        }
      }

      return {
        ResultCode: 1,
        ResultDesc: callbackResult.resultDesc,
        success: false
      };
    }
  } catch (error) {
    console.error('❌ Callback processing error:', error);
    return {
      ResultCode: 1,
      ResultDesc: 'Internal server error',
      success: false,
      error: error.message
    };
  }
});

/**
 * M-Pesa Timeout Handler
 * Called by Safaricom when STK Push times out (user doesn't respond)
 */
Parse.Cloud.define('mpesaTimeout', async (request) => {
  console.log('⏱️  M-Pesa timeout received:', JSON.stringify(request.params));

  try {
    const { CheckoutRequestID } = request.params;

    // Update payment vault
    await queryPaymentDB(`
      UPDATE "PaymentTransaction"
      SET
        "status" = $1,
        "resultDescription" = $2,
        "updatedAt" = NOW()
      WHERE "checkoutRequestId" = $3
    `, ['failed', 'Transaction timeout - user did not respond', CheckoutRequestID]);

    // Update subscription
    const paymentQuery = await queryPaymentDB(`
      SELECT "subscriptionId"
      FROM "PaymentTransaction"
      WHERE "checkoutRequestId" = $1
      LIMIT 1
    `, [CheckoutRequestID]);

    if (paymentQuery.rows.length > 0) {
      const { subscriptionId } = paymentQuery.rows[0];

      const Subscription = Parse.Object.extend('Subscription');
      const subQuery = new Parse.Query(Subscription);
      const subscription = await subQuery.get(subscriptionId, { useMasterKey: true });

      if (subscription) {
        subscription.set('status', 'failed');
        subscription.set('failureReason', 'Payment timeout');
        await subscription.save(null, { useMasterKey: true });
      }
    }

    return {
      ResultCode: 0,
      ResultDesc: 'Timeout recorded',
      success: true
    };
  } catch (error) {
    console.error('❌ Timeout handler error:', error);
    return {
      ResultCode: 1,
      ResultDesc: 'Internal server error',
      success: false
    };
  }
});

/**
 * Initiate subscription payment (Frontend calls this)
 * Creates subscription record and initiates M-Pesa STK Push
 */
Parse.Cloud.define('initiateSubscriptionPayment', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  }

  const { planId, phoneNumber } = request.params;

  if (!planId || !phoneNumber) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Plan ID and phone number required');
  }

  try {
    // Get plan details
    const plansResponse = await Parse.Cloud.run('getSubscriptionPlans');
    const plan = plansResponse.plans.find(p => p.id === planId);

    if (!plan || plan.price === 0) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid plan or free plan selected');
    }

    // Create subscription in payment vault database
    const subscriptionResult = await queryPaymentDB(`
      INSERT INTO "Subscription" (
        "objectId", "userId", "planId", "planName", "amount", "status", "createdAt", "updatedAt"
      ) VALUES (
        uuid_generate_v4(), $1, $2, $3, $4, $5, NOW(), NOW()
      )
      RETURNING "objectId"
    `, [
      request.user.id,
      plan.id,
      plan.name,
      plan.price,
      'pending'
    ]);

    const subscriptionId = subscriptionResult.rows[0].objectId;

    // Also create in main database for compatibility
    const Subscription = Parse.Object.extend('Subscription');
    const subscription = new Subscription();
    subscription.set('user', request.user);
    subscription.set('planId', plan.id);
    subscription.set('planName', plan.name);
    subscription.set('amount', plan.price);
    subscription.set('status', 'pending');
    await subscription.save(null, { useMasterKey: true });

    // Initiate M-Pesa STK Push
    const paymentResult = await mpesaService.initiateSTKPush({
      phoneNumber,
      amount: plan.price,
      accountReference: `SUB-${subscriptionId}`,
      transactionDesc: `Elimu Smart ${plan.name}`,
      userId: request.user.id,
      subscriptionId: subscription.id,
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers?.['user-agent'] || 'unknown'
    });

    // Update subscription with checkout request ID
    subscription.set('checkoutRequestId', paymentResult.checkoutRequestId);
    await subscription.save(null, { useMasterKey: true });

    // Also update payment vault
    await queryPaymentDB(`
      UPDATE "Subscription"
      SET "checkoutRequestId" = $1, "updatedAt" = NOW()
      WHERE "objectId" = $2
    `, [paymentResult.checkoutRequestId, subscriptionId]);

    return {
      success: true,
      subscriptionId: subscription.id,
      checkoutRequestId: paymentResult.checkoutRequestId,
      message: paymentResult.customerMessage || 'Please check your phone for M-Pesa prompt'
    };
  } catch (error) {
    console.error('❌ Payment initiation failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Payment initiation failed: ${error.message}`
    );
  }
});

/**
 * Check payment status (Frontend polls this)
 */
Parse.Cloud.define('checkSubscriptionPaymentStatus', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  }

  const { subscriptionId } = request.params;

  try {
    const Subscription = Parse.Object.extend('Subscription');
    const query = new Parse.Query(Subscription);
    const subscription = await query.get(subscriptionId, { useMasterKey: true });

    if (!subscription) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Subscription not found');
    }

    const status = subscription.get('status');

    if (status === 'active') {
      return {
        success: true,
        status: 'active',
        expiresAt: subscription.get('expiresAt'),
        message: 'Payment successful! Subscription activated.'
      };
    } else if (status === 'failed') {
      return {
        success: false,
        status: 'failed',
        message: subscription.get('failureReason') || 'Payment failed'
      };
    } else {
      return {
        success: false,
        status: 'pending',
        message: 'Payment is still pending. Please complete the M-Pesa prompt on your phone.'
      };
    }
  } catch (error) {
    console.error('❌ Status check failed:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to check payment status: ${error.message}`
    );
  }
});

module.exports = {
  // Exported for testing
};
