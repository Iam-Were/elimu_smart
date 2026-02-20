// Parental Consent Cloud Functions
// Kenya Data Protection Act 2019 + GDPR compliance

const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');

// ── requestParentConsent ────────────────────────────────────────────────────
Parse.Cloud.define('requestParentConsent', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  }

  const user = request.user;
  const parentEmail = request.params.parentEmail || user.get('parentEmail');
  const parentName = request.params.parentName || user.get('parentName');

  if (!parentEmail) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Parent email is required');
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const ParentConsent = Parse.Object.extend('ParentConsent');
  const existing = await new Parse.Query(ParentConsent)
    .equalTo('student', user)
    .first({ useMasterKey: true });

  const consent = existing || new ParentConsent();
  consent.set('student', user);
  consent.set('parentEmail', parentEmail);
  consent.set('parentName', parentName || 'Parent/Guardian');
  consent.set('parentPhone', user.get('parentPhone') || '');
  consent.set('consentGiven', false);
  consent.set('consentToken', token);
  consent.set('tokenExpiresAt', expiresAt);
  consent.set('requestedAt', new Date());
  await consent.save(null, { useMasterKey: true });

  const studentName = `${user.get('firstName')} ${user.get('lastName')}`;
  const consentUrl = `https://elimu-smart.co.ke/consent/${token}`;

  try {
    await emailService.sendEmail({
      to: parentEmail,
      toName: parentName || 'Parent/Guardian',
      subject: `Action Required: Consent for ${studentName}'s Elimu Smart Account`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:24px;">Elimu Smart</h1>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Career Guidance for Kenyan Students</p>
          </div>
          <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <h2 style="color:#111827;">Dear ${parentName || 'Parent/Guardian'},</h2>
            <p style="color:#374151;">
              <strong>${studentName}</strong> has registered on Elimu Smart, a career guidance platform
              helping Kenyan secondary school students explore career paths, assess skills, and
              connect with professional counselors.
            </p>
            <p style="color:#374151;">
              Under the <strong>Kenya Data Protection Act 2019</strong>, we require your consent before
              processing any personal data for students. Your child's account and career data belong
              entirely to them &mdash; you are authorising their use of the platform.
            </p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:24px 0;">
              <h3 style="margin:0 0 12px;color:#111827;">What we collect:</h3>
              <ul style="color:#374151;margin:0;padding-left:20px;line-height:1.8;">
                <li>Name, school, and academic subjects</li>
                <li>Career interest assessment results</li>
                <li>University and career preferences</li>
                <li>Session notes from counselors (premium only)</li>
              </ul>
              <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">
                Data is encrypted, never sold, and can be deleted on request.
              </p>
            </div>
            <div style="text-align:center;margin:32px 0;">
              <a href="${consentUrl}"
                style="background:#16a34a;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                I Give My Consent
              </a>
            </div>
            <p style="color:#6b7280;font-size:13px;text-align:center;">
              Link expires in 7 days. If you did not expect this email, you can safely ignore it.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Consent email sent to ${parentEmail} for student ${user.id}`);
  } catch (emailError) {
    console.warn('Consent email failed:', emailError.message);
  }

  return { success: true, message: 'Consent request sent to parent email' };
});

// ── recordParentConsent ─────────────────────────────────────────────────────
// Public — no auth needed. Called when parent clicks consent link.
Parse.Cloud.define('recordParentConsent', async (request) => {
  const { token, decision } = request.params;

  if (!token) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Consent token is required');
  }

  const ParentConsent = Parse.Object.extend('ParentConsent');
  const consent = await new Parse.Query(ParentConsent)
    .equalTo('consentToken', token)
    .include('student')
    .first({ useMasterKey: true });

  if (!consent) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Invalid or expired consent link');
  }

  if (new Date() > consent.get('tokenExpiresAt')) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'This consent link has expired');
  }

  const accepted = decision !== 'decline';

  consent.set('consentGiven', accepted);
  consent.set('consentDate', new Date());
  consent.set('consentMethod', 'email');
  await consent.save(null, { useMasterKey: true });

  const student = consent.get('student');
  student.set('parentConsentGiven', accepted);
  student.set('parentConsentDate', new Date());
  await student.save(null, { useMasterKey: true });

  const studentName = `${student.get('firstName')} ${student.get('lastName')}`;

  return {
    success: true,
    accepted,
    studentName,
    message: accepted
      ? `Thank you. ${studentName} can now use Elimu Smart.`
      : `Consent declined. Access restricted.`
  };
});

// ── getConsentStatus ────────────────────────────────────────────────────────
Parse.Cloud.define('getConsentStatus', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Authentication required');
  }

  const user = request.user;

  if (user.get('parentConsentGiven') === true) {
    return {
      consentGiven: true,
      parentEmail: user.get('parentEmail'),
      parentName: user.get('parentName'),
      parentPhone: user.get('parentPhone'),
      consentDate: user.get('parentConsentDate')
    };
  }

  const ParentConsent = Parse.Object.extend('ParentConsent');
  const consent = await new Parse.Query(ParentConsent)
    .equalTo('student', user)
    .descending('createdAt')
    .first({ useMasterKey: true });

  return {
    consentGiven: consent ? consent.get('consentGiven') : false,
    parentEmail: consent ? consent.get('parentEmail') : (user.get('parentEmail') || null),
    parentName: consent ? consent.get('parentName') : (user.get('parentName') || null),
    parentPhone: consent ? consent.get('parentPhone') : (user.get('parentPhone') || null),
    requestedAt: consent ? consent.get('requestedAt') : null,
    tokenExpiresAt: consent ? consent.get('tokenExpiresAt') : null
  };
});
