// ZeptoMail Email Service for Elimu Smart
// Handles all transactional emails via Zoho ZeptoMail API

const axios = require('axios');

// Email configuration from environment variables
const ZEPTOMAIL_CONFIG = {
  apiUrl: process.env.ZEPTOMAIL_API_URL || 'https://api.zeptomail.com/v1.1/email',
  token: process.env.ZEPTOMAIL_TOKEN,
  fromEmail: process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@elimu-smart.co.ke',
  fromName: process.env.ZEPTOMAIL_FROM_NAME || 'Elimu Smart Platform'
};

/**
 * Send email via ZeptoMail API
 * @param {Object} emailData - Email configuration
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.toName - Recipient name
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.htmlBody - HTML email content
 * @param {string} [emailData.textBody] - Plain text fallback
 */
async function sendEmail({ to, toName, subject, htmlBody, textBody }) {
  try {
    const payload = {
      from: {
        address: ZEPTOMAIL_CONFIG.fromEmail,
        name: ZEPTOMAIL_CONFIG.fromName
      },
      to: [{
        email_address: {
          address: to,
          name: toName || 'User'
        }
      }],
      subject: subject,
      htmlbody: htmlBody
    };

    if (textBody) {
      payload.textbody = textBody;
    }

    const response = await axios.post(
      ZEPTOMAIL_CONFIG.apiUrl,
      payload,
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Zoho-enczapikey ${ZEPTOMAIL_CONFIG.token}`
        }
      }
    );

    console.log('✅ Email sent successfully to:', to);
    return { success: true, response: response.data };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Email Templates
 */

// Welcome Email for New Students
function getWelcomeEmailTemplate(userName, userEmail) {
  return {
    subject: 'Welcome to Elimu Smart - Your Career Journey Starts Here! 🎓',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff7ed;">
        <div style="background: linear-gradient(to right, #f97316, #fb923c); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Elimu Smart!</h1>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #f97316;">Jambo ${userName}! 👋</h2>

          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We're thrilled to have you join thousands of Kenyan students discovering their perfect career path!
          </p>

          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f97316; margin-top: 0;">🚀 Get Started in 3 Easy Steps:</h3>
            <ol style="color: #555; line-height: 2;">
              <li><strong>Take Your Career Assessment</strong> - Discover careers that match your personality</li>
              <li><strong>Explore University Options</strong> - Find KUCCPS programs that fit your grades</li>
              <li><strong>Connect with Counselors</strong> - Get expert guidance when you need it</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/assessment"
               style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Start Your Assessment
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Your login email:</strong> ${userEmail}
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Need help? Reply to this email or visit our support page.<br>
            Elimu Smart - Empowering Kenyan Students 🇰🇪
          </p>
        </div>
      </div>
    `,
    textBody: `Welcome to Elimu Smart, ${userName}! Start your career journey at http://localhost:5173/assessment`
  };
}

// Session Booking Confirmation
function getSessionBookingTemplate(studentName, counselorName, sessionDate, sessionTime, sessionType, meetingLink) {
  return {
    subject: `Session Confirmed: ${sessionType} with ${counselorName} 📅`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #eab308; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Session Confirmed ✅</h1>
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #eab308; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #ca8a04;">Hi ${studentName}!</h2>

          <p style="font-size: 16px; color: #333;">
            Your counseling session has been successfully booked. Here are the details:
          </p>

          <div style="background: #fef9c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>📅 Date:</strong></td>
                <td style="padding: 8px 0;">${sessionDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>🕐 Time:</strong></td>
                <td style="padding: 8px 0;">${sessionTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>👤 Counselor:</strong></td>
                <td style="padding: 8px 0;">${counselorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>📋 Type:</strong></td>
                <td style="padding: 8px 0;">${sessionType}</td>
              </tr>
            </table>
          </div>

          ${meetingLink ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingLink}"
                 style="background: #eab308; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Join Virtual Meeting
              </a>
            </div>
          ` : ''}

          <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #eab308; margin-top: 20px;">
            <p style="margin: 0; color: #92400e;">
              <strong>💡 Tip:</strong> Come prepared with questions about your career choices, KUCCPS applications, or any academic concerns.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Need to reschedule? Contact us at support@elimu-smart.co.ke
          </p>
        </div>
      </div>
    `,
    textBody: `Session confirmed with ${counselorName} on ${sessionDate} at ${sessionTime}. Type: ${sessionType}. ${meetingLink || ''}`
  };
}

// Assessment Completion Email
function getAssessmentCompleteTemplate(studentName, assessmentType, topCareerMatches) {
  const careerList = topCareerMatches.map((career, index) =>
    `<li style="margin: 10px 0;"><strong>${index + 1}. ${career.title}</strong> - ${career.matchPercentage}% match</li>`
  ).join('');

  return {
    subject: `Your ${assessmentType} Results Are Ready! 🎯`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #f97316, #fb923c); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Assessment Complete! 🎉</h1>
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #f97316; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #f97316;">Great job, ${studentName}!</h2>

          <p style="font-size: 16px; color: #333;">
            You've completed the <strong>${assessmentType}</strong>. Based on your responses, here are your top career matches:
          </p>

          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f97316; margin-top: 0;">🎯 Your Top Career Matches:</h3>
            <ol style="color: #555; padding-left: 20px;">
              ${careerList}
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/assessment/history"
               style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Full Results
            </a>
          </div>

          <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #f97316; margin-top: 20px;">
            <p style="margin: 0; color: #7f1d1d;">
              <strong>Next Steps:</strong> Explore university programs that match your top careers and book a session with a counselor to discuss your path forward.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Keep building your future! 🚀
          </p>
        </div>
      </div>
    `,
    textBody: `Your ${assessmentType} is complete! Top matches: ${topCareerMatches.map(c => c.title).join(', ')}. View full results at http://localhost:5173/assessment/history`
  };
}

// Counselor New Assignment Email
function getCounselorAssignmentTemplate(counselorName, studentName, studentGrade, studentEmail) {
  return {
    subject: `New Student Assigned: ${studentName} 👨‍🎓`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #eab308; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">New Student Assignment</h1>
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #eab308; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #ca8a04;">Hi ${counselorName},</h2>

          <p style="font-size: 16px; color: #333;">
            A new student has been assigned to you for guidance and support.
          </p>

          <div style="background: #fef9c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ca8a04; margin-top: 0;">Student Details:</h3>
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${studentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Grade:</strong></td>
                <td style="padding: 8px 0;">${studentGrade}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;">${studentEmail}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/counselor/students"
               style="background: #eab308; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Student Profile
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Please reach out to the student within 48 hours to introduce yourself and schedule an initial session.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Elimu Smart Counselor Portal
          </p>
        </div>
      </div>
    `,
    textBody: `New student assigned: ${studentName} (${studentGrade}). Email: ${studentEmail}. View profile at http://localhost:5173/counselor/students`
  };
}

// Password Reset Email
function getPasswordResetTemplate(userName, resetLink) {
  return {
    subject: 'Reset Your Elimu Smart Password 🔐',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #6366f1; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset Request</h1>
        </div>

        <div style="background: white; padding: 30px; border: 1px solid #6366f1; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #4f46e5;">Hi ${userName},</h2>

          <p style="font-size: 16px; color: #333;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}"
               style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin-top: 20px;">
            <p style="margin: 0; color: #7f1d1d;">
              <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link: ${resetLink}
          </p>
        </div>
      </div>
    `,
    textBody: `Reset your password: ${resetLink} (expires in 1 hour)`
  };
}

module.exports = {
  sendEmail,
  getWelcomeEmailTemplate,
  getSessionBookingTemplate,
  getAssessmentCompleteTemplate,
  getCounselorAssignmentTemplate,
  getPasswordResetTemplate
};
