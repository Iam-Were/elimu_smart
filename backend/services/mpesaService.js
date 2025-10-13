// M-Pesa STK Push Payment Service for Elimu Smart
// Handles subscription payments via Safaricom M-Pesa
// PCI-Compliant: Logs sensitive data to separate payment vault database

const axios = require('axios');
const { encrypt, sanitizeForAudit } = require('./encryption');
const { queryPaymentDB, paymentTransaction } = require('../config/databases');

// M-Pesa configuration from environment variables
const MPESA_CONFIG = {
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
  consumerKey: process.env.MPESA_ENVIRONMENT === 'production'
    ? process.env.MPESA_CONSUMER_KEY
    : process.env.MPESA_SANDBOX_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_ENVIRONMENT === 'production'
    ? process.env.MPESA_CONSUMER_SECRET
    : process.env.MPESA_SANDBOX_CONSUMER_SECRET,
  shortcode: process.env.MPESA_ENVIRONMENT === 'production'
    ? process.env.MPESA_SHORTCODE
    : process.env.MPESA_SANDBOX_SHORTCODE,
  passkey: process.env.MPESA_ENVIRONMENT === 'production'
    ? process.env.MPESA_PASSKEY
    : process.env.MPESA_SANDBOX_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  timeoutUrl: process.env.MPESA_TIMEOUT_URL,
  apiUrl: process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
};

/**
 * Generate M-Pesa OAuth access token
 */
async function getAccessToken() {
  try {
    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');

    const response = await axios.get(
      `${MPESA_CONFIG.apiUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('❌ M-Pesa OAuth failed:', error.message);
    throw new Error(`Failed to get M-Pesa access token: ${error.message}`);
  }
}

/**
 * Generate timestamp for M-Pesa request
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generate password for STK Push
 */
function generatePassword(timestamp) {
  const data = `${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`;
  return Buffer.from(data).toString('base64');
}

/**
 * Initiate STK Push for subscription payment
 * PCI-Compliant: Logs transaction to payment vault with encryption
 * @param {Object} paymentData
 * @param {string} paymentData.phoneNumber - Customer phone number (254XXXXXXXXX)
 * @param {number} paymentData.amount - Amount in KES
 * @param {string} paymentData.accountReference - Subscription plan reference
 * @param {string} paymentData.transactionDesc - Payment description
 * @param {string} paymentData.userId - User ID (UUID)
 * @param {string} paymentData.subscriptionId - Subscription ID (UUID)
 * @param {string} paymentData.ipAddress - Client IP address
 * @param {string} paymentData.userAgent - Client user agent
 */
async function initiateSTKPush({ phoneNumber, amount, accountReference, transactionDesc, userId, subscriptionId, ipAddress, userAgent }) {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    // Format phone number (remove + and spaces)
    const formattedPhone = phoneNumber.replace(/[\s+]/g, '');

    // Ensure phone number starts with 254
    const phone = formattedPhone.startsWith('254')
      ? formattedPhone
      : `254${formattedPhone.replace(/^0/, '')}`;

    const payload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.floor(amount), // M-Pesa doesn't accept decimals
      PartyA: phone,
      PartyB: MPESA_CONFIG.shortcode,
      PhoneNumber: phone,
      CallBackURL: MPESA_CONFIG.callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc
    };

    const response = await axios.post(
      `${MPESA_CONFIG.apiUrl}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ STK Push initiated:', response.data);

    // Log transaction to payment vault database (PCI-compliant)
    try {
      await queryPaymentDB(`
        INSERT INTO "PaymentTransaction" (
          "objectId", "userId", "subscriptionId", "checkoutRequestId",
          "merchantRequestId", "amount", "phoneNumber", "currency",
          "status", "ipAddress", "userAgent", "createdAt", "updatedAt"
        ) VALUES (
          uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
        )
      `, [
        userId,
        subscriptionId,
        response.data.CheckoutRequestID,
        response.data.MerchantRequestID,
        amount,
        encrypt(phone), // ENCRYPTED phone number
        'KES',
        'initiated',
        ipAddress,
        userAgent
      ]);

      // Audit log (sanitized data)
      await queryPaymentDB(`
        INSERT INTO "PaymentAuditLog" (
          "objectId", "userId", "action", "entityType", "entityId",
          "ipAddress", "userAgent", "requestBody", "responseCode", "timestamp"
        ) VALUES (
          uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, NOW()
        )
      `, [
        userId,
        'payment_initiated',
        'PaymentTransaction',
        response.data.CheckoutRequestID,
        ipAddress,
        userAgent,
        JSON.stringify(sanitizeForAudit(payload)), // Sanitize sensitive fields
        response.data.ResponseCode
      ]);

      console.log('✅ Payment transaction logged to vault database');
    } catch (dbError) {
      console.error('⚠️  Failed to log transaction to vault:', dbError.message);
      // Don't fail the payment if logging fails
    }

    return {
      success: true,
      checkoutRequestId: response.data.CheckoutRequestID,
      merchantRequestId: response.data.MerchantRequestID,
      responseCode: response.data.ResponseCode,
      responseDescription: response.data.ResponseDescription,
      customerMessage: response.data.CustomerMessage
    };
  } catch (error) {
    console.error('❌ STK Push failed:', error.response?.data || error.message);

    // Log failure to audit log
    try {
      await queryPaymentDB(`
        INSERT INTO "PaymentAuditLog" (
          "objectId", "userId", "action", "ipAddress", "userAgent",
          "requestBody", "responseCode", "timestamp"
        ) VALUES (
          uuid_generate_v4(), $1, $2, $3, $4, $5, $6, NOW()
        )
      `, [
        userId,
        'payment_init_failed',
        ipAddress,
        userAgent,
        JSON.stringify(sanitizeForAudit({ phoneNumber, amount, accountReference })),
        error.response?.status || '500'
      ]);
    } catch {
      // Silent failure on audit log
    }

    throw new Error(`Failed to initiate M-Pesa payment: ${error.response?.data?.errorMessage || error.message}`);
  }
}

/**
 * Query STK Push transaction status
 * @param {string} checkoutRequestId - Checkout request ID from STK Push
 */
async function querySTKPushStatus(checkoutRequestId) {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    const payload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const response = await axios.post(
      `${MPESA_CONFIG.apiUrl}/mpesa/stkpushquery/v1/query`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: response.data.ResultCode === '0',
      resultCode: response.data.ResultCode,
      resultDesc: response.data.ResultDesc,
      merchantRequestId: response.data.MerchantRequestID,
      checkoutRequestId: response.data.CheckoutRequestID
    };
  } catch (error) {
    console.error('❌ STK Push query failed:', error.response?.data || error.message);
    throw new Error(`Failed to query M-Pesa transaction: ${error.message}`);
  }
}

/**
 * Process M-Pesa callback from payment
 * PCI-Compliant: Updates payment vault with transaction result
 * @param {Object} callbackData - Callback data from M-Pesa
 * @returns {Promise<Object>} Processed callback result
 */
async function processCallback(callbackData) {
  try {
    const { Body } = callbackData;
    const { stkCallback } = Body;

    const result = {
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc
    };

    // Payment successful
    if (stkCallback.ResultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata.Item;

      result.success = true;
      result.amount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
      result.mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      result.transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
      result.phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;

      // Update payment vault database
      try {
        await queryPaymentDB(`
          UPDATE "PaymentTransaction"
          SET
            "status" = $1,
            "resultCode" = $2,
            "resultDescription" = $3,
            "mpesaReceiptNumber" = $4,
            "transactionDate" = $5,
            "updatedAt" = NOW()
          WHERE "checkoutRequestId" = $6
        `, [
          'completed',
          result.resultCode,
          result.resultDesc,
          encrypt(result.mpesaReceiptNumber), // ENCRYPTED receipt number
          new Date(result.transactionDate),
          result.checkoutRequestId
        ]);

        // Audit log for successful payment
        await queryPaymentDB(`
          INSERT INTO "PaymentAuditLog" (
            "objectId", "action", "entityType", "entityId",
            "requestBody", "responseCode", "timestamp"
          ) VALUES (
            uuid_generate_v4(), $1, $2, $3, $4, $5, NOW()
          )
        `, [
          'payment_completed',
          'PaymentTransaction',
          result.checkoutRequestId,
          JSON.stringify(sanitizeForAudit(result)),
          result.resultCode
        ]);

        console.log('✅ Payment transaction updated in vault:', result.checkoutRequestId);
      } catch (dbError) {
        console.error('⚠️  Failed to update payment vault:', dbError.message);
      }
    } else {
      result.success = false;

      // Update failed payment in vault
      try {
        await queryPaymentDB(`
          UPDATE "PaymentTransaction"
          SET
            "status" = $1,
            "resultCode" = $2,
            "resultDescription" = $3,
            "updatedAt" = NOW()
          WHERE "checkoutRequestId" = $4
        `, [
          'failed',
          result.resultCode,
          result.resultDesc,
          result.checkoutRequestId
        ]);

        // Audit log for failed payment
        await queryPaymentDB(`
          INSERT INTO "PaymentAuditLog" (
            "objectId", "action", "entityType", "entityId",
            "requestBody", "responseCode", "timestamp"
          ) VALUES (
            uuid_generate_v4(), $1, $2, $3, $4, $5, NOW()
          )
        `, [
          'payment_failed',
          'PaymentTransaction',
          result.checkoutRequestId,
          JSON.stringify({ resultDesc: result.resultDesc }),
          result.resultCode
        ]);

        console.log('⚠️  Payment transaction failed in vault:', result.checkoutRequestId);
      } catch (dbError) {
        console.error('⚠️  Failed to update payment vault:', dbError.message);
      }
    }

    return result;
  } catch (error) {
    console.error('❌ Callback processing failed:', error.message);
    throw new Error(`Failed to process M-Pesa callback: ${error.message}`);
  }
}

module.exports = {
  initiateSTKPush,
  querySTKPushStatus,
  processCallback,
  getAccessToken
};
