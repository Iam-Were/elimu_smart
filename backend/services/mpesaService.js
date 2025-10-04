// M-Pesa STK Push Payment Service for Elimu Smart
// Handles subscription payments via Safaricom M-Pesa

const axios = require('axios');

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
 * @param {Object} paymentData
 * @param {string} paymentData.phoneNumber - Customer phone number (254XXXXXXXXX)
 * @param {number} paymentData.amount - Amount in KES
 * @param {string} paymentData.accountReference - Subscription plan reference
 * @param {string} paymentData.transactionDesc - Payment description
 */
async function initiateSTKPush({ phoneNumber, amount, accountReference, transactionDesc }) {
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
 * @param {Object} callbackData - Callback data from M-Pesa
 */
function processCallback(callbackData) {
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
    } else {
      result.success = false;
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
