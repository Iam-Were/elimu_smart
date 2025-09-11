// Test script for ZeptoMail integration
const { SendMailClient } = require('zeptomail');
require('dotenv').config();

console.log('🧪 Testing ZeptoMail Integration...\n');

// Initialize ZeptoMail client
const client = new SendMailClient({
  url: process.env.ZEPTOMAIL_API_URL || 'api.zeptomail.com/',
  token: process.env.ZEPTOMAIL_TOKEN || 'your_zeptomail_token_here'
});

// Test email content
const testEmailContent = {
  "from": {
    "address": process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@elimusmart.co.ke",
    "name": process.env.ZEPTOMAIL_FROM_NAME || "Elimu Smart Platform"
  },
  "to": [{
    "email_address": {
      "address": "test@example.com", // Replace with your test email
      "name": "Test User"
    }
  }],
  "subject": "🧪 ZeptoMail Integration Test - Elimu Smart",
  "htmlbody": `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ZeptoMail Test</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .content { background: white; padding: 20px; border: 1px solid #e5e7eb; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧪 ZeptoMail Integration Test</h1>
          <p>Elimu Smart Platform</p>
        </div>
        <div class="content">
          <p>Hello!</p>
          <p>This is a test email to verify that ZeptoMail is properly integrated with the Elimu Smart platform.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>✅ ZeptoMail SDK: Connected</li>
            <li>✅ Email Templates: Working</li>
            <li>✅ HTML Rendering: Functional</li>
            <li>✅ Environment Variables: Loaded</li>
          </ul>
          <p>If you receive this email, the integration is working correctly!</p>
          <p>Best regards,<br>The Elimu Smart Development Team</p>
        </div>
      </div>
    </body>
    </html>
  `,
  "track_clicks": true,
  "track_opens": true
};

async function testZeptoMailIntegration() {
  console.log('📧 Configuration Check:');
  console.log('  API URL:', process.env.ZEPTOMAIL_API_URL || 'api.zeptomail.com/');
  console.log('  Token:', process.env.ZEPTOMAIL_TOKEN ? '✅ Configured' : '❌ Missing');
  console.log('  From Email:', process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@elimusmart.co.ke');
  console.log('  From Name:', process.env.ZEPTOMAIL_FROM_NAME || 'Elimu Smart Platform');
  console.log('');

  if (!process.env.ZEPTOMAIL_TOKEN || process.env.ZEPTOMAIL_TOKEN === 'your_zeptomail_token_here') {
    console.log('❌ Test skipped: Please configure ZEPTOMAIL_TOKEN in .env file');
    console.log('');
    console.log('To complete the setup:');
    console.log('1. Sign up at https://www.zoho.com/zeptomail/');
    console.log('2. Create a mail agent and generate a send mail token');
    console.log('3. Update ZEPTOMAIL_TOKEN in backend/.env');
    console.log('4. Update ZEPTOMAIL_FROM_EMAIL with your verified domain');
    console.log('5. Run this test again');
    return;
  }

  try {
    console.log('📤 Sending test email...');
    
    const result = await client.sendMail(testEmailContent);
    
    console.log('✅ Email sent successfully!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    console.log('');
    console.log('🎉 ZeptoMail integration is working correctly!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Check your test email inbox');
    console.log('2. Verify email rendering and tracking');
    console.log('3. Test other email functions in the platform');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Verify your ZeptoMail token is correct');
    console.log('2. Check that your from email is verified in ZeptoMail');
    console.log('3. Ensure you have sufficient ZeptoMail credits');
    console.log('4. Check network connectivity');
    console.log('');
    console.log('Full error details:', error);
  }
}

// Run the test
testZeptoMailIntegration();