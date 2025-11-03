/**
 * RIASEC Email Report Generator
 * Sends comprehensive personality assessment results via email
 * Inspired by 16Personalities UX patterns with Kenya-specific context
 */

const fetch = require('node-fetch');

/**
 * Generates beautiful HTML email template for RIASEC results
 * @param {Object} data - Assessment and personality data
 * @returns {string} - HTML email content
 */
function generateRiasecEmailHTML(data) {
  const {
    studentName,
    hollandCode,
    primaryType,
    scores,
    totalScore,
    personalityData,
    dashboardUrl
  } = data;

  // Type color mapping
  const typeColors = {
    R: { bg: '#ef4444', light: '#fee2e2', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
    I: { bg: '#3b82f6', light: '#dbeafe', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    A: { bg: '#a855f7', light: '#f3e8ff', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
    S: { bg: '#10b981', light: '#d1fae5', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    E: { bg: '#f59e0b', light: '#fef3c7', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    C: { bg: '#6b7280', light: '#f3f4f6', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }
  };

  const primaryColor = typeColors[primaryType.code];

  // Sort scores for display
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([type, score]) => ({
      type,
      score,
      percentage: ((score / totalScore) * 100).toFixed(1),
      name: { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }[type]
    }));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your RIASEC Career Assessment Results</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .hero {
      background: ${primaryColor.gradient};
      color: #ffffff;
      padding: 48px 40px;
      text-align: center;
    }
    .holland-code {
      font-size: 48px;
      font-weight: 800;
      letter-spacing: 8px;
      margin: 0 0 16px 0;
    }
    .personality-name {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 12px 0;
    }
    .tagline {
      font-size: 18px;
      font-weight: 400;
      opacity: 0.95;
      margin: 0;
      font-style: italic;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 20px 0;
      padding-bottom: 12px;
      border-bottom: 3px solid ${primaryColor.bg};
    }
    .score-bar-container {
      margin-bottom: 16px;
    }
    .score-bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .score-bar-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    .score-bar-value {
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
    }
    .score-bar-track {
      height: 12px;
      background-color: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    .score-bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .career-card {
      background-color: #f9fafb;
      border-left: 4px solid ${primaryColor.bg};
      padding: 20px;
      margin-bottom: 16px;
      border-radius: 8px;
    }
    .career-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .career-name {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }
    .compatibility-badge {
      background-color: ${primaryColor.bg};
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    .career-reason {
      font-size: 15px;
      color: #4b5563;
      margin: 0 0 12px 0;
      line-height: 1.6;
    }
    .career-opportunities {
      font-size: 14px;
      color: #6b7280;
      background-color: #ffffff;
      padding: 12px;
      border-radius: 6px;
      margin: 0;
    }
    .career-opportunities strong {
      color: #374151;
    }
    .trait-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .trait-item {
      padding: 12px 16px;
      background-color: ${primaryColor.light};
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 15px;
      color: #1f2937;
      line-height: 1.5;
    }
    .trait-item::before {
      content: "✓";
      color: ${primaryColor.bg};
      font-weight: 700;
      margin-right: 12px;
      font-size: 18px;
    }
    .development-tip {
      padding: 12px 16px;
      background-color: #fef3c7;
      border-left: 3px solid #f59e0b;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 15px;
      color: #78350f;
      line-height: 1.6;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .info-card {
      background-color: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .info-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin: 0 0 8px 0;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 15px;
      color: #1f2937;
      margin: 0;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background: ${primaryColor.gradient};
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      margin: 8px 8px 8px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .cta-button-secondary {
      background: #ffffff;
      color: ${primaryColor.bg};
      border: 2px solid ${primaryColor.bg};
      box-shadow: none;
    }
    .footer {
      background-color: #1f2937;
      color: #9ca3af;
      padding: 32px 40px;
      text-align: center;
      font-size: 14px;
    }
    .footer-logo {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
    }
    .footer-text {
      margin: 0 0 16px 0;
      line-height: 1.6;
    }
    .footer-links {
      margin: 16px 0 0 0;
    }
    .footer-link {
      color: #60a5fa;
      text-decoration: none;
      margin: 0 12px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px;
      }
      .hero {
        padding: 32px 24px;
      }
      .holland-code {
        font-size: 36px;
      }
      .personality-name {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Hero Section -->
    <div class="hero">
      <h1 class="holland-code">${hollandCode}</h1>
      <h2 class="personality-name">${personalityData.personalityTypeName || primaryType.name}</h2>
      <p class="tagline">${personalityData.tagline || 'Your unique career personality profile'}</p>
    </div>

    <!-- Main Content -->
    <div class="content">

      <!-- Greeting -->
      <div class="section">
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 0;">
          Hello <strong>${studentName}</strong>,<br><br>
          Congratulations on completing your RIASEC Career Personality Assessment! Your results reveal valuable insights about your career preferences, work style, and ideal professional pathways. This report combines scientifically-backed personality analysis with Kenya-specific career opportunities tailored just for you.
        </p>
      </div>

      <!-- Section 2: Personality Snapshot -->
      <div class="section">
        <h3 class="section-title">Your Personality Snapshot</h3>
        ${sortedScores.map(({ type, name, percentage }) => {
          const color = typeColors[type].bg;
          return `
            <div class="score-bar-container">
              <div class="score-bar-header">
                <span class="score-bar-label">${type} - ${name}</span>
                <span class="score-bar-value">${percentage}%</span>
              </div>
              <div class="score-bar-track">
                <div class="score-bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
              </div>
            </div>
          `;
        }).join('')}
        <p style="font-size: 15px; color: #4b5563; margin: 16px 0 0 0; line-height: 1.6;">
          <strong>Work Style:</strong> ${personalityData.workStyle || 'Your unique approach to work and collaboration.'}
        </p>
      </div>

      <!-- Section 3: Top Career Matches -->
      <div class="section">
        <h3 class="section-title">Top Career Matches</h3>
        ${personalityData.top3CareerMatches && personalityData.top3CareerMatches.length > 0 ?
          personalityData.top3CareerMatches.slice(0, 3).map((career) => `
            <div class="career-card">
              <div class="career-header">
                <h4 class="career-name">${career.career}</h4>
                <span class="compatibility-badge">${career.compatibility.toFixed(0)}% Match</span>
              </div>
              <p class="career-reason">${career.reason}</p>
              <p class="career-opportunities">
                <strong>Kenya Opportunities:</strong> ${career.kenyaOpportunities}
              </p>
            </div>
          `).join('')
          : '<p style="color: #6b7280;">No career matches available yet. Complete more assessments for personalized recommendations!</p>'
        }
        <a href="${dashboardUrl}/career-exploration" class="cta-button">Explore More Careers</a>
      </div>

      <!-- Section 4: Your Strengths -->
      <div class="section">
        <h3 class="section-title">Your Strengths</h3>
        <ul class="trait-list">
          ${personalityData.strengths && personalityData.strengths.length > 0 ?
            personalityData.strengths.slice(0, 6).map(strength => `
              <li class="trait-item">${strength}</li>
            `).join('')
            : '<li class="trait-item">Your unique strengths make you valuable in any team</li>'
          }
        </ul>
        ${personalityData.famousKenyans && personalityData.famousKenyans.length > 0 ? `
          <p style="font-size: 15px; color: #4b5563; margin: 20px 0 0 0; line-height: 1.6;">
            <strong>Kenyans Who Share Your Type:</strong> ${personalityData.famousKenyans.join(', ')}
          </p>
        ` : ''}
      </div>

      <!-- Section 5: Growth Areas -->
      <div class="section">
        <h3 class="section-title">Areas to Develop</h3>
        ${personalityData.challenges && personalityData.challenges.length > 0 ? `
          <p style="font-size: 15px; color: #4b5563; margin: 0 0 16px 0; line-height: 1.6;">
            Every personality type has growth opportunities. Here are areas to focus on:
          </p>
          <ul class="trait-list">
            ${personalityData.challenges.slice(0, 4).map(challenge => `
              <li class="trait-item" style="background-color: #fef3c7;">${challenge}</li>
            `).join('')}
          </ul>
        ` : ''}
        ${personalityData.developmentTips && personalityData.developmentTips.length > 0 ? `
          <p style="font-size: 14px; font-weight: 600; color: #374151; margin: 20px 0 12px 0;">
            Development Tips:
          </p>
          ${personalityData.developmentTips.slice(0, 3).map(tip => `
            <div class="development-tip">${tip}</div>
          `).join('')}
        ` : ''}
      </div>

      <!-- Section 6: Ideal Work Environment -->
      <div class="section">
        <h3 class="section-title">Your Ideal Work Environment</h3>
        <div class="info-grid">
          ${personalityData.idealEnvironment ? `
            <div class="info-card">
              <p class="info-label">Ideal Setting</p>
              <p class="info-value">${personalityData.idealEnvironment}</p>
            </div>
          ` : ''}
          ${personalityData.motivators && personalityData.motivators.length > 0 ? `
            <div class="info-card">
              <p class="info-label">What Motivates You</p>
              <p class="info-value">${personalityData.motivators.join(', ')}</p>
            </div>
          ` : ''}
          ${personalityData.teamRole ? `
            <div class="info-card">
              <p class="info-label">Team Role</p>
              <p class="info-value">${personalityData.teamRole}</p>
            </div>
          ` : ''}
          ${personalityData.decisionMaking ? `
            <div class="info-card">
              <p class="info-label">Decision-Making Style</p>
              <p class="info-value">${personalityData.decisionMaking}</p>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Section 7: Next Steps -->
      <div class="section">
        <h3 class="section-title">Your Next Steps</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
          Your RIASEC assessment is just the beginning! Here's how to make the most of your results:
        </p>
        <div style="text-align: center;">
          <a href="${dashboardUrl}" class="cta-button">View Full Dashboard</a>
          <a href="${dashboardUrl}/assessment" class="cta-button cta-button-secondary">Take Skills Assessment</a>
        </div>
        <div style="text-align: center; margin-top: 16px;">
          <a href="${dashboardUrl}/guidance/book-session" class="cta-button cta-button-secondary">Book Counselor Session</a>
          <a href="${dashboardUrl}/university-finder" class="cta-button cta-button-secondary">Explore Universities</a>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-logo">Elimu Smart</p>
      <p class="footer-text">
        AI-Ready Career Guidance for Kenyan Students<br>
        Helping you make informed decisions about your future
      </p>
      <p class="footer-text" style="font-size: 12px;">
        This assessment is based on the Holland Code (RIASEC) career theory, validated across 50+ years of research.
      </p>
      <div class="footer-links">
        <a href="${dashboardUrl}" class="footer-link">Dashboard</a>
        <a href="${dashboardUrl}/profile" class="footer-link">Profile</a>
        <a href="https://elimu-smart.co.ke" class="footer-link">About Us</a>
      </div>
      <p style="font-size: 12px; color: #6b7280; margin: 16px 0 0 0;">
        © ${new Date().getFullYear()} Elimu Smart. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Cloud Function: Send RIASEC Report Email
 * Triggers after assessment completion
 */
Parse.Cloud.define('sendRiasecReportEmail', async (request) => {
  const { userId, assessmentId } = request.params;

  if (!userId || !assessmentId) {
    throw new Parse.Error(
      Parse.Error.INVALID_QUERY,
      'userId and assessmentId are required'
    );
  }

  try {
    // 1. Fetch user data
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (!user) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User not found');
    }

    const studentName = user.get('firstName') || user.get('username') || 'Student';
    const studentEmail = user.get('email');
    const isPremium = user.get('isPremium') || false;

    if (!studentEmail) {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'User has no email address');
    }

    // PAYWALL: Only send detailed email reports to premium users
    if (!isPremium) {
      console.log(`⚠️ Skipping email report for free user: ${studentEmail}`);
      return {
        success: false,
        message: 'Email reports are available for Premium users only',
        premiumFeature: true
      };
    }

    // 2. Fetch assessment data
    const RiasecAssessment = Parse.Object.extend('RiasecAssessment');
    const assessmentQuery = new Parse.Query(RiasecAssessment);
    const assessment = await assessmentQuery.get(assessmentId, { useMasterKey: true });

    if (!assessment) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Assessment not found');
    }

    const hollandCode = assessment.get('hollandCode');
    const scores = assessment.get('scores');
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);

    // 3. Get primary type (first letter of Holland Code)
    const primaryTypeCode = hollandCode.charAt(0);

    // 4. Fetch personality type data
    const RiasecTypeInfo = Parse.Object.extend('RiasecTypeInfo');
    const typeQuery = new Parse.Query(RiasecTypeInfo);
    typeQuery.equalTo('code', primaryTypeCode);
    typeQuery.equalTo('isActive', true);

    const typeInfo = await typeQuery.first({ useMasterKey: true });

    if (!typeInfo) {
      throw new Parse.Error(
        Parse.Error.OBJECT_NOT_FOUND,
        `Personality type data not found for ${primaryTypeCode}`
      );
    }

    const personalityData = {
      personalityTypeName: typeInfo.get('personalityTypeName'),
      tagline: typeInfo.get('tagline'),
      description: typeInfo.get('description'),
      coreTraits: typeInfo.get('coreTraits') || [],
      strengths: typeInfo.get('strengths') || [],
      challenges: typeInfo.get('challenges') || [],
      workStyle: typeInfo.get('workStyle'),
      idealEnvironment: typeInfo.get('idealEnvironment'),
      motivators: typeInfo.get('motivators') || [],
      learningStyle: typeInfo.get('learningStyle'),
      decisionMaking: typeInfo.get('decisionMaking'),
      teamRole: typeInfo.get('teamRole'),
      top3CareerMatches: typeInfo.get('top3CareerMatches') || [],
      famousKenyans: typeInfo.get('famousKenyans') || [],
      developmentTips: typeInfo.get('developmentTips') || []
    };

    // 5. Generate HTML email
    const dashboardUrl = process.env.FRONTEND_URL || 'https://elimu-smart.co.ke/dashboard';

    const emailHTML = generateRiasecEmailHTML({
      studentName,
      hollandCode,
      primaryType: {
        code: primaryTypeCode,
        name: typeInfo.get('name')
      },
      scores,
      totalScore,
      personalityData,
      dashboardUrl
    });

    // 6. Send email via ZeptoMail
    const zeptoResponse = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.ZEPTO_API_TOKEN
      },
      body: JSON.stringify({
        from: {
          address: 'noreply@elimu-smart.co.ke',
          name: 'Elimu Smart Career Guidance'
        },
        to: [
          {
            email_address: {
              address: studentEmail,
              name: studentName
            }
          }
        ],
        subject: `Your RIASEC Results: ${hollandCode} - ${personalityData.personalityTypeName}`,
        htmlbody: emailHTML
      })
    });

    if (!zeptoResponse.ok) {
      const errorText = await zeptoResponse.text();
      console.error('ZeptoMail Error:', errorText);
      throw new Parse.Error(
        Parse.Error.INTERNAL_SERVER_ERROR,
        `Email service failed: ${errorText}`
      );
    }

    // 7. Log email activity
    const ActivityLog = Parse.Object.extend('ActivityLog');
    const log = new ActivityLog();
    log.set('user', user);
    log.set('activityType', 'email_sent');
    log.set('activityCategory', 'assessment');
    log.set('description', `RIASEC report email sent: ${hollandCode}`);
    log.set('metadata', {
      assessmentId,
      hollandCode,
      primaryType: primaryTypeCode,
      emailRecipient: studentEmail
    });

    await log.save(null, { useMasterKey: true });

    return {
      success: true,
      message: 'RIASEC report email sent successfully',
      emailSentTo: studentEmail
    };

  } catch (error) {
    console.error('Error sending RIASEC report email:', error);
    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      `Failed to send email: ${error.message}`
    );
  }
});

module.exports = {
  generateRiasecEmailHTML
};
