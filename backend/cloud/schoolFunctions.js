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
 * List all schools — admin dashboard
 */
Parse.Cloud.define('listSchools', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');
  const role = request.user.get('role');
  if (!['admin', 'super_admin'].includes(role)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  const { page = 0, limit = 100, search } = request.params;
  const School = Parse.Object.extend('School');
  const query = new Parse.Query(School);

  if (search) {
    const nameQ = new Parse.Query(School).contains('name', search);
    const codeQ = new Parse.Query(School).contains('code', search.toUpperCase());
    const combined = Parse.Query.or(nameQ, codeQ);
    combined.limit(limit);
    combined.skip(page * limit);
    combined.descending('createdAt');
    const [schools, total] = await Promise.all([combined.find({ useMasterKey: true }), combined.count({ useMasterKey: true })]);
    return {
      schools: schools.map(s => ({ id: s.id, name: s.get('name'), code: s.get('code'), county: s.get('county'), type: s.get('type'), contactName: s.get('contactName') || '', contactEmail: s.get('contactEmail') || '', contactPhone: s.get('contactPhone') || '', seatLimit: s.get('seatLimit') || 0, isActive: s.get('isActive'), createdAt: s.get('createdAt') })),
      total,
      page,
    };
  }

  query.limit(limit);
  query.skip(page * limit);
  query.descending('createdAt');
  const [schools, total] = await Promise.all([query.find({ useMasterKey: true }), query.count({ useMasterKey: true })]);

  return {
    schools: schools.map(s => ({
      id: s.id,
      name: s.get('name'),
      code: s.get('code'),
      county: s.get('county'),
      type: s.get('type'),
      contactName: s.get('contactName') || '',
      contactEmail: s.get('contactEmail') || '',
      contactPhone: s.get('contactPhone') || '',
      seatLimit: s.get('seatLimit') || 0,
      isActive: s.get('isActive'),
      createdAt: s.get('createdAt'),
    })),
    total,
    page,
  };
});

/**
 * Get analytics for a specific school (admin only)
 * Works for both coded (schoolId) and uncoded (schoolName) schools
 */
Parse.Cloud.define('getSchoolAnalytics', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');
  const role = request.user.get('role');
  if (!['admin', 'super_admin'].includes(role)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  const { schoolId, schoolName } = request.params;
  if (!schoolId && !schoolName) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'schoolId or schoolName required');

  const User = Parse.Object.extend('_User');

  // Build base student query
  const buildQuery = () => {
    const q = new Parse.Query(User);
    q.equalTo('role', 'student');
    if (schoolId) q.equalTo('schoolId', schoolId);
    else q.equalTo('schoolName', schoolName);
    return q;
  };

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Count active this week via UserActivity
  const UserActivity = Parse.Object.extend('UserActivity');
  const activityQuery = new Parse.Query(UserActivity);
  activityQuery.greaterThan('createdAt', sevenDaysAgo);
  if (schoolId) {
    // Join via user's schoolId — find student ids first
    const studentIds = await buildQuery().select(['objectId']).limit(1000).find({ useMasterKey: true });
    const userPointers = studentIds.map(s => s);
    activityQuery.containedIn('user', userPointers);
  }

  // Run all counts in parallel
  const [totalStudents, premiumCount, recentJoiners, allStudents] = await Promise.all([
    buildQuery().count({ useMasterKey: true }),
    (() => { const q = buildQuery(); q.equalTo('isPremium', true); return q.count({ useMasterKey: true }); })(),
    (() => { const q = buildQuery(); q.greaterThan('createdAt', thirtyDaysAgo); return q.count({ useMasterKey: true }); })(),
    buildQuery().select(['gradeLevel', 'isPremium', 'createdAt']).limit(1000).find({ useMasterKey: true }),
  ]);

  // Form distribution
  const formDistribution = { 'Form 1': 0, 'Form 2': 0, 'Form 3': 0, 'Form 4': 0, 'Unknown': 0 };
  for (const s of allStudents) {
    const grade = s.get('gradeLevel');
    if (grade && formDistribution[grade] !== undefined) formDistribution[grade]++;
    else formDistribution['Unknown']++;
  }

  // Assessments completed — count users who have at least 1 AssessmentProgress record
  let assessmentsCompleted = 0;
  try {
    const AssessmentProgress = Parse.Object.extend('AssessmentProgress');
    const aQuery = new Parse.Query(AssessmentProgress);
    aQuery.containedIn('user', allStudents);
    aQuery.equalTo('status', 'completed');
    aQuery.distinct('user', { useMasterKey: true });
    const distinctUsers = await aQuery.distinct('user', { useMasterKey: true });
    assessmentsCompleted = distinctUsers.length;
  } catch {
    assessmentsCompleted = 0;
  }

  // Active this week — students with any activity in last 7 days
  let activeThisWeek = 0;
  try {
    const UserActivity2 = Parse.Object.extend('UserActivity');
    const wQuery = new Parse.Query(UserActivity2);
    wQuery.containedIn('user', allStudents);
    wQuery.greaterThan('createdAt', sevenDaysAgo);
    const activeUsers = await wQuery.distinct('user', { useMasterKey: true });
    activeThisWeek = activeUsers.length;
  } catch {
    activeThisWeek = 0;
  }

  return {
    totalStudents,
    activeThisWeek,
    assessmentsCompleted,
    premiumCount,
    recentJoiners,
    formDistribution,
  };
});

/**
 * List all schools by schoolName field — includes uncoded schools
 * Returns ranked list with student counts for sales/admin visibility
 */
Parse.Cloud.define('listAllSchoolNames', async (request) => {
  if (!request.user) throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Not authenticated');
  const role = request.user.get('role');
  if (!['admin', 'super_admin'].includes(role)) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
  }

  const { limit = 200 } = request.params;

  const User = Parse.Object.extend('_User');
  const query = new Parse.Query(User);
  query.equalTo('role', 'student');
  query.exists('schoolName');
  query.notEqualTo('schoolName', '');
  query.select(['schoolName', 'schoolId', 'county', 'createdAt']);
  query.limit(Math.min(limit, 1000));

  const students = await query.find({ useMasterKey: true });

  // Group by schoolName
  const schoolMap = new Map();
  for (const s of students) {
    const name = s.get('schoolName');
    if (!name) continue;
    if (!schoolMap.has(name)) {
      schoolMap.set(name, {
        schoolName: name,
        schoolId: s.get('schoolId') || null, // null = uncoded
        county: s.get('county') || null,
        studentCount: 0,
      });
    }
    schoolMap.get(name).studentCount++;
  }

  const schools = Array.from(schoolMap.values()).sort((a, b) => b.studentCount - a.studentCount);

  return { schools, total: schools.length };
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
