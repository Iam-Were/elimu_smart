// School License & Tagging Cloud Functions
// Students are tagged to a school via a unique school code (no email domain needed)

/**
 * Create a new school (admin only)
 */
Parse.Cloud.define('createSchool', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');
  const role = request.user.get('role');
  if (!['admin', 'super_admin'].includes(role)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  const { name, county, type, contactName, contactEmail, contactPhone, seatLimit } = request.params;
  if (!name || !county) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'name and county are required');

  // Generate a unique 6-char school code: first 4 letters of name (uppercase) + 2-digit counter
  const base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4).padEnd(4, 'X');
  const suffix = String(Math.floor(Math.random() * 90) + 10); // 10-99
  let code = base + suffix;

  // Ensure uniqueness
  const School = Parse.Object.extend('School');
  const existing = await new Parse.Query(School).equalTo('code', code).first({ useMasterKey: true });
  if (existing) {
    const suffix2 = String(Math.floor(Math.random() * 900) + 100);
    code = base + suffix2;
  }

  const school = new School();
  school.set('name', name);
  school.set('code', code);
  school.set('county', county);
  school.set('type', type || 'public');
  school.set('contactName', contactName || '');
  school.set('contactEmail', contactEmail || '');
  school.set('contactPhone', contactPhone || '');
  school.set('seatLimit', seatLimit || 0); // 0 = unlimited (individual subscriptions)
  school.set('isActive', true);

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(false);
  acl.setRoleReadAccess('admin', true);
  acl.setRoleReadAccess('school_admin', true);
  school.setACL(acl);

  await school.save(null, { useMasterKey: true });

  return { success: true, schoolId: school.id, code, name };
});

/**
 * Look up a school by code — used to preview before joining
 */
Parse.Cloud.define('getSchoolByCode', async (request) => {
  const { code } = request.params;
  if (!code) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'code is required');

  const School = Parse.Object.extend('School');
  const school = await new Parse.Query(School)
    .equalTo('code', code.toUpperCase())
    .equalTo('isActive', true)
    .first({ useMasterKey: true });

  if (!school) return { found: false };

  return {
    found: true,
    schoolId: school.id,
    name: school.get('name'),
    county: school.get('county'),
    type: school.get('type'),
  };
});

/**
 * Tag the current student to a school by code
 * Called during onboarding or profile update
 */
Parse.Cloud.define('joinSchoolByCode', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');

  const { code } = request.params;
  if (!code) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'code is required');

  const School = Parse.Object.extend('School');
  const school = await new Parse.Query(School)
    .equalTo('code', code.toUpperCase())
    .equalTo('isActive', true)
    .first({ useMasterKey: true });

  if (!school) throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Invalid or inactive school code');

  const user = request.user;
  user.set('schoolId', school.id);
  user.set('schoolCode', code.toUpperCase());
  user.set('schoolName', school.get('name'));
  await user.save(null, { useMasterKey: true });

  return {
    success: true,
    schoolId: school.id,
    schoolName: school.get('name'),
    county: school.get('county'),
  };
});

/**
 * Get all students tagged to a school
 * Used by school admin and platform admin
 */
Parse.Cloud.define('getSchoolStudents', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');
  const role = request.user.get('role');
  if (!['admin', 'super_admin', 'school_admin'].includes(role)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  const { schoolId, page = 0, limit = 50 } = request.params;
  if (!schoolId) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'schoolId required');

  const User = Parse.Object.extend('_User');
  const query = new Parse.Query(User);
  query.equalTo('schoolId', schoolId);
  query.equalTo('role', 'student');
  query.select(['objectId', 'firstName', 'lastName', 'email', 'isPremium', 'parentConsentGiven', 'createdAt']);
  query.limit(limit);
  query.skip(page * limit);
  query.descending('createdAt');

  const [students, total] = await Promise.all([
    query.find({ useMasterKey: true }),
    query.count({ useMasterKey: true }),
  ]);

  return {
    students: students.map(s => ({
      id: s.id,
      firstName: s.get('firstName'),
      lastName: s.get('lastName'),
      email: s.get('email'),
      isPremium: s.get('isPremium') || false,
      parentConsentGiven: s.get('parentConsentGiven') || false,
      joinedAt: s.get('createdAt'),
    })),
    total,
    page,
  };
});

/**
 * Get school license status (seat usage)
 */
Parse.Cloud.define('getSchoolLicenseStatus', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');
  const role = request.user.get('role');
  if (!['admin', 'super_admin', 'school_admin'].includes(role)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  const { schoolId } = request.params;
  if (!schoolId) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'schoolId required');

  const School = Parse.Object.extend('School');
  const school = await new Parse.Query(School).get(schoolId, { useMasterKey: true });
  if (!school) throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'School not found');

  const User = Parse.Object.extend('_User');
  const totalQuery = new Parse.Query(User);
  totalQuery.equalTo('schoolId', schoolId);
  const total = await totalQuery.count({ useMasterKey: true });

  const premiumQuery = new Parse.Query(User);
  premiumQuery.equalTo('schoolId', schoolId);
  premiumQuery.equalTo('isPremium', true);
  const premium = await premiumQuery.count({ useMasterKey: true });

  const seatLimit = school.get('seatLimit') || 0;

  return {
    schoolId,
    schoolName: school.get('name'),
    code: school.get('code'),
    seatLimit,
    totalStudents: total,
    premiumStudents: premium,
    seatsUsed: seatLimit > 0 ? premium : null,
    seatsRemaining: seatLimit > 0 ? Math.max(0, seatLimit - premium) : null,
  };
});
