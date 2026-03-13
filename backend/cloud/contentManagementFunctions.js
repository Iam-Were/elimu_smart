/**
 * Content Management Cloud Functions
 * CRUD operations for Universities, Courses, Careers, and Assessment Questions
 * RBAC: Operations and Platform admins only
 */

module.exports = function(Parse) {

// ============================================
// UNIVERSITY CRUD OPERATIONS
// ============================================

/**
 * Get all universities with pagination and filters
 */
Parse.Cloud.define('getUniversities', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { page = 1, limit = 50, search, type, ranking } = params || {};

  try {
    const University = Parse.Object.extend('University');
    const query = new Parse.Query(University);

    // Apply filters
    if (search) {
      query.matches('name', new RegExp(search, 'i'));
    }
    if (type) {
      query.equalTo('type', type);
    }
    if (ranking) {
      query.equalTo('ranking', parseInt(ranking));
    }

    // Pagination
    query.limit(limit);
    query.skip((page - 1) * limit);
    query.descending('createdAt');

    // Get total count
    const totalCount = await query.count({ useMasterKey: true });

    // Get results
    const results = await query.find({ useMasterKey: true });

    return {
      universities: results.map(u => ({
        id: u.id,
        universityId: u.get('universityId'),
        name: u.get('name'),
        type: u.get('type'),
        location: u.get('location'),
        website: u.get('website'),
        ranking: u.get('ranking'),
        accreditation: u.get('accreditation'),
        specializations: u.get('specializations') || [],
        founded: u.get('founded'),
        description: u.get('description'),
        isActive: u.get('isActive'),
        createdAt: u.get('createdAt'),
        updatedAt: u.get('updatedAt')
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch universities');
  }
});

/**
 * Create a new university
 */
Parse.Cloud.define('createUniversity', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const {
    universityId,
    name,
    type,
    location,
    website,
    ranking,
    accreditation,
    specializations,
    founded,
    description
  } = params;

  // Validation
  if (!name || !type) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Name and type are required');
  }

  try {
    const University = Parse.Object.extend('University');
    const university = new University();

    university.set('universityId', universityId || `univ_${Date.now()}`);
    university.set('name', name);
    university.set('type', type);
    university.set('location', location);
    university.set('website', website);
    university.set('ranking', ranking);
    university.set('accreditation', accreditation);
    university.set('specializations', specializations || []);
    university.set('founded', founded);
    university.set('description', description);
    university.set('isActive', true);

    await university.save(null, { useMasterKey: true });

    return {
      success: true,
      university: {
        id: university.id,
        universityId: university.get('universityId'),
        name: university.get('name'),
        type: university.get('type')
      }
    };
  } catch (error) {
    console.error('Error creating university:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to create university');
  }
});

/**
 * Update an existing university
 */
Parse.Cloud.define('updateUniversity', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id, ...updates } = params;

  if (!id) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'University ID is required');
  }

  try {
    const University = Parse.Object.extend('University');
    const query = new Parse.Query(University);
    const university = await query.get(id, { useMasterKey: true });

    // Update allowed fields
    const allowedFields = [
      'name', 'type', 'location', 'website', 'ranking',
      'accreditation', 'specializations', 'founded', 'description', 'isActive'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        university.set(field, updates[field]);
      }
    });

    await university.save(null, { useMasterKey: true });

    return {
      success: true,
      university: {
        id: university.id,
        name: university.get('name')
      }
    };
  } catch (error) {
    console.error('Error updating university:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to update university');
  }
});

/**
 * Delete a university
 */
Parse.Cloud.define('deleteUniversity', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id } = params;

  if (!id) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'University ID is required');
  }

  try {
    const University = Parse.Object.extend('University');
    const query = new Parse.Query(University);
    const university = await query.get(id, { useMasterKey: true });

    await university.destroy({ useMasterKey: true });

    return {
      success: true,
      message: 'University deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting university:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to delete university');
  }
});

// ============================================
// CAREER CRUD OPERATIONS
// ============================================

/**
 * Get all careers with pagination and filters
 */
Parse.Cloud.define('getCareers', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { page = 1, limit = 50, search, category, isActive } = params || {};

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);

    // Apply filters
    if (search) {
      query.matches('title', new RegExp(search, 'i'));
    }
    if (category) {
      query.equalTo('category', category);
    }
    if (isActive !== undefined) {
      query.equalTo('isActive', isActive);
    }

    // Pagination
    query.limit(limit);
    query.skip((page - 1) * limit);
    query.descending('createdAt');

    // Get total count
    const totalCount = await query.count({ useMasterKey: true });

    // Get results
    const results = await query.find({ useMasterKey: true });

    return {
      careers: results.map(c => ({
        id: c.id,
        careerId: c.get('careerId'),
        title: c.get('title'),
        category: c.get('category'),
        description: c.get('description'),
        salaryRangeMin: c.get('salaryRangeMin'),
        salaryRangeMax: c.get('salaryRangeMax'),
        educationLevel: c.get('educationLevel'),
        relatedSubjects: c.get('relatedSubjects') || [],
        keySkills: c.get('keySkills') || [],
        isActive: c.get('isActive'),
        createdAt: c.get('createdAt'),
        updatedAt: c.get('updatedAt')
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching careers:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch careers');
  }
});

/**
 * Create a new career
 */
Parse.Cloud.define('createCareer', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const {
    careerId,
    title,
    category,
    description,
    salaryRangeMin,
    salaryRangeMax,
    educationLevel,
    relatedSubjects,
    keySkills
  } = params;

  // Validation
  if (!title || !category) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Title and category are required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const career = new Career();

    career.set('careerId', careerId || `career_${Date.now()}`);
    career.set('title', title);
    career.set('category', category);
    career.set('description', description);
    career.set('salaryRangeMin', salaryRangeMin);
    career.set('salaryRangeMax', salaryRangeMax);
    career.set('educationLevel', educationLevel);
    career.set('relatedSubjects', relatedSubjects || []);
    career.set('keySkills', keySkills || []);
    career.set('isActive', true);

    await career.save(null, { useMasterKey: true });

    return {
      success: true,
      career: {
        id: career.id,
        careerId: career.get('careerId'),
        title: career.get('title')
      }
    };
  } catch (error) {
    console.error('Error creating career:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to create career');
  }
});

/**
 * Update an existing career
 */
Parse.Cloud.define('updateCareer', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id, ...updates } = params;

  if (!id) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Career ID is required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);
    const career = await query.get(id, { useMasterKey: true });

    // Update allowed fields
    const allowedFields = [
      'title', 'category', 'description', 'salaryRangeMin', 'salaryRangeMax',
      'educationLevel', 'relatedSubjects', 'keySkills', 'isActive'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        career.set(field, updates[field]);
      }
    });

    await career.save(null, { useMasterKey: true });

    return {
      success: true,
      career: {
        id: career.id,
        title: career.get('title')
      }
    };
  } catch (error) {
    console.error('Error updating career:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to update career');
  }
});

/**
 * Delete a career
 */
Parse.Cloud.define('deleteCareer', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id } = params;

  if (!id) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Career ID is required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);
    const career = await query.get(id, { useMasterKey: true });

    await career.destroy({ useMasterKey: true });

    return {
      success: true,
      message: 'Career deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting career:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to delete career');
  }
});

// ============================================
// COURSE CRUD OPERATIONS
// ============================================

/**
 * Get all courses with pagination and filters
 */
Parse.Cloud.define('getCourses', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { page = 1, limit = 50, search, universityId, category, level } = params || {};

  try {
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);

    // Apply filters
    if (search) {
      query.matches('title', new RegExp(search, 'i'));
    }
    if (universityId) {
      const University = Parse.Object.extend('University');
      const universityPointer = University.createWithoutData(universityId);
      query.equalTo('university', universityPointer);
    }
    if (category) {
      query.equalTo('category', category);
    }
    if (level) {
      query.equalTo('level', level);
    }

    // Include university data
    query.include('university');

    // Pagination
    query.limit(limit);
    query.skip((page - 1) * limit);
    query.descending('createdAt');

    // Get total count
    const totalCount = await query.count({ useMasterKey: true });

    // Get results
    const results = await query.find({ useMasterKey: true });

    return {
      courses: results.map(c => ({
        id: c.id,
        courseId: c.get('courseId'),
        title: c.get('title'),
        category: c.get('category'),
        level: c.get('level'),
        duration: c.get('duration'),
        requirements: c.get('requirements'),
        cutoffPoints: c.get('cutoffPoints'),
        careerPathways: c.get('careerPathways') || [],
        description: c.get('description'),
        isActive: c.get('isActive'),
        university: c.get('university') ? {
          id: c.get('university').id,
          name: c.get('university').get('name'),
          type: c.get('university').get('type')
        } : null,
        createdAt: c.get('createdAt'),
        updatedAt: c.get('updatedAt')
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch courses');
  }
});

/**
 * Create a new course
 */
Parse.Cloud.define('createCourse', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const {
    courseId,
    title,
    category,
    level,
    universityId,
    duration,
    requirements,
    cutoffPoints,
    careerPathways,
    description
  } = params;

  // Validation
  if (!title || !category || !universityId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Title, category, and university are required');
  }

  try {
    const Course = Parse.Object.extend('Course');
    const course = new Course();

    // Create university pointer
    const University = Parse.Object.extend('University');
    const universityPointer = University.createWithoutData(universityId);

    course.set('courseId', courseId || `course_${Date.now()}`);
    course.set('title', title);
    course.set('category', category);
    course.set('level', level);
    course.set('university', universityPointer);
    course.set('duration', duration);
    course.set('requirements', requirements);
    course.set('cutoffPoints', cutoffPoints);
    course.set('careerPathways', careerPathways || []);
    course.set('description', description);
    course.set('isActive', true);

    await course.save(null, { useMasterKey: true });

    return {
      success: true,
      course: {
        id: course.id,
        courseId: course.get('courseId'),
        title: course.get('title')
      }
    };
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to create course');
  }
});

/**
 * Update an existing course
 */
Parse.Cloud.define('updateCourse', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id, universityId, ...updates } = params;

  if (!id) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Course ID is required');
  }

  try {
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);
    const course = await query.get(id, { useMasterKey: true });

    // Update university pointer if provided
    if (universityId) {
      const University = Parse.Object.extend('University');
      const universityPointer = University.createWithoutData(universityId);
      course.set('university', universityPointer);
    }

    // Update allowed fields
    const allowedFields = [
      'title', 'category', 'level', 'duration', 'requirements',
      'cutoffPoints', 'careerPathways', 'description', 'isActive'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        course.set(field, updates[field]);
      }
    });

    await course.save(null, { useMasterKey: true });

    return {
      success: true,
      course: {
        id: course.id,
        title: course.get('title')
      }
    };
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to update course');
  }
});

/**
 * Delete a course
 */
Parse.Cloud.define('deleteCourse', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id } = params;

  if (!id) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Course ID is required');
  }

  try {
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);
    const course = await query.get(id, { useMasterKey: true });

    await course.destroy({ useMasterKey: true });

    return {
      success: true,
      message: 'Course deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to delete course');
  }
});

// ============================================
// ASSESSMENT QUESTIONS CRUD OPERATIONS
// ============================================

/**
 * Get all assessment questions (RIASEC + Skills) with pagination and filters
 */
Parse.Cloud.define('getAssessmentQuestions', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { page = 1, limit = 50, search, type, category, riasecType } = params || {};

  try {
    let results = [];
    let totalCount = 0;

    if (!type || type === 'riasec') {
      const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
      const riasecQuery = new Parse.Query(RiasecQuestion);

      // Apply filters
      if (search) {
        riasecQuery.matches('statement', new RegExp(search, 'i'));
      }
      if (category) {
        riasecQuery.equalTo('category', category);
      }
      if (riasecType) {
        riasecQuery.equalTo('riasecType', riasecType);
      }

      // Pagination
      riasecQuery.limit(limit);
      riasecQuery.skip((page - 1) * limit);
      riasecQuery.ascending('questionId');

      // Get results
      const riasecResults = await riasecQuery.find({ useMasterKey: true });
      const riasecCount = await riasecQuery.count({ useMasterKey: true });

      results = riasecResults.map(q => ({
        id: q.id,
        type: 'riasec',
        questionId: q.get('questionId'),
        category: q.get('category'),
        statement: q.get('statement'),
        riasecType: q.get('riasecType'),
        kenyaContext: q.get('kenyaContext'),
        isActive: q.get('isActive'),
        createdAt: q.get('createdAt'),
        updatedAt: q.get('updatedAt')
      }));

      totalCount += riasecCount;
    }

    if (!type || type === 'skills') {
      const SkillQuestion = Parse.Object.extend('SkillQuestion');
      const skillQuery = new Parse.Query(SkillQuestion);

      // Apply filters
      if (search) {
        skillQuery.matches('text', new RegExp(search, 'i'));
      }
      if (category) {
        skillQuery.equalTo('category', category);
      }

      // Pagination
      skillQuery.limit(limit);
      skillQuery.skip((page - 1) * limit);
      skillQuery.ascending('questionId');

      // Get results
      const skillResults = await skillQuery.find({ useMasterKey: true });
      const skillCount = await skillQuery.count({ useMasterKey: true });

      const skillMapped = skillResults.map(q => ({
        id: q.id,
        type: 'skills',
        questionId: q.get('questionId'),
        category: q.get('category'),
        text: q.get('text'),
        isActive: q.get('isActive'),
        createdAt: q.get('createdAt'),
        updatedAt: q.get('updatedAt')
      }));

      results = type === 'skills' ? skillMapped : [...results, ...skillMapped];
      totalCount += skillCount;
    }

    return {
      questions: results,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch assessment questions');
  }
});

/**
 * Create a new assessment question (RIASEC or Skills)
 */
Parse.Cloud.define('createAssessmentQuestion', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { type, questionId, category, statement, text, riasecType, kenyaContext } = params;

  // Validation
  if (!type || (type !== 'riasec' && type !== 'skills')) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Type must be "riasec" or "skills"');
  }

  if (type === 'riasec' && (!statement || !riasecType || !category)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Statement, riasecType, and category are required for RIASEC questions');
  }

  if (type === 'skills' && (!text || !category)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Text and category are required for Skills questions');
  }

  try {
    if (type === 'riasec') {
      const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
      const question = new RiasecQuestion();

      question.set('questionId', questionId || Date.now());
      question.set('category', category);
      question.set('statement', statement);
      question.set('riasecType', riasecType);
      question.set('kenyaContext', kenyaContext || '');
      question.set('isActive', true);

      await question.save(null, { useMasterKey: true });

      return {
        success: true,
        question: {
          id: question.id,
          type: 'riasec',
          questionId: question.get('questionId'),
          statement: question.get('statement')
        }
      };
    } else {
      const SkillQuestion = Parse.Object.extend('SkillQuestion');
      const question = new SkillQuestion();

      question.set('questionId', questionId || Date.now());
      question.set('category', category);
      question.set('text', text);
      question.set('isActive', true);

      await question.save(null, { useMasterKey: true });

      return {
        success: true,
        question: {
          id: question.id,
          type: 'skills',
          questionId: question.get('questionId'),
          text: question.get('text')
        }
      };
    }
  } catch (error) {
    console.error('Error creating assessment question:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to create assessment question');
  }
});

/**
 * Update an existing assessment question
 */
Parse.Cloud.define('updateAssessmentQuestion', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id, type, ...updates } = params;

  if (!id || !type) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Question ID and type are required');
  }

  try {
    if (type === 'riasec') {
      const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
      const query = new Parse.Query(RiasecQuestion);
      const question = await query.get(id, { useMasterKey: true });

      // Update allowed fields
      const allowedFields = ['category', 'statement', 'riasecType', 'kenyaContext', 'isActive'];

      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          question.set(field, updates[field]);
        }
      });

      await question.save(null, { useMasterKey: true });

      return {
        success: true,
        question: {
          id: question.id,
          statement: question.get('statement')
        }
      };
    } else {
      const SkillQuestion = Parse.Object.extend('SkillQuestion');
      const query = new Parse.Query(SkillQuestion);
      const question = await query.get(id, { useMasterKey: true });

      // Update allowed fields
      const allowedFields = ['category', 'text', 'isActive'];

      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          question.set(field, updates[field]);
        }
      });

      await question.save(null, { useMasterKey: true });

      return {
        success: true,
        question: {
          id: question.id,
          text: question.get('text')
        }
      };
    }
  } catch (error) {
    console.error('Error updating assessment question:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to update assessment question');
  }
});

/**
 * Delete an assessment question
 */
Parse.Cloud.define('deleteAssessmentQuestion', async (request) => {
  const { user, master, params } = request;

  // RBAC: Admin only
  if (!user && !master) {
    throw new Error('Authentication required');
  }

  const { id, type } = params;

  if (!id || !type) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Question ID and type are required');
  }

  try {
    if (type === 'riasec') {
      const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
      const query = new Parse.Query(RiasecQuestion);
      const question = await query.get(id, { useMasterKey: true });

      await question.destroy({ useMasterKey: true });
    } else {
      const SkillQuestion = Parse.Object.extend('SkillQuestion');
      const query = new Parse.Query(SkillQuestion);
      const question = await query.get(id, { useMasterKey: true });

      await question.destroy({ useMasterKey: true });
    }

    return {
      success: true,
      message: 'Assessment question deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting assessment question:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to delete assessment question');
  }
});

// ============================================
// CAREER RESOURCES
// ============================================

const DEFAULT_RESOURCES = [
  {
    title: 'KUCCPS Application Guide 2025',
    type: 'pdf',
    category: 'kuccps',
    description: 'Step-by-step guide to the KUCCPS university placement application process. Covers deadlines, cluster points, and how to maximise your choices.',
    url: null,
    downloadUrl: '/resources/kuccps-application-guide.pdf',
    pages: 32,
    duration: null,
    popularity: 1840,
    tags: ['kuccps', 'application', 'deadlines'],
    popular: true
  },
  {
    title: 'Kenya Career Handbook 2025',
    type: 'guide',
    category: 'career',
    description: 'Comprehensive overview of 200+ careers available in Kenya: education requirements, salary ranges, growth prospects, and real employer insights.',
    url: 'https://kuccps.ac.ke',
    downloadUrl: null,
    pages: 120,
    duration: null,
    popularity: 1320,
    tags: ['careers', 'kenya', 'salary'],
    popular: true
  },
  {
    title: 'University Course Comparison Tool',
    type: 'tool',
    category: 'university',
    description: 'Compare Kenyan universities side-by-side: fees, programmes, accommodation, student life, and graduate outcomes. Updated for 2025 intake.',
    url: '/assessment/university',
    downloadUrl: null,
    pages: null,
    duration: null,
    popularity: 2100,
    tags: ['university', 'comparison', 'fees'],
    popular: true
  },
  {
    title: 'KCSE Grade & Cluster Points Calculator',
    type: 'tool',
    category: 'kcse',
    description: 'Calculate your cluster points from KCSE grades and see which university programmes you qualify for. Supports all 8 subject clusters.',
    url: '/assessment/subjects',
    downloadUrl: null,
    pages: null,
    duration: null,
    popularity: 1650,
    tags: ['kcse', 'grades', 'cluster-points'],
    popular: true
  },
  {
    title: 'How to Choose a Career in Kenya',
    type: 'video',
    category: 'career',
    description: 'Expert counselors walk you through a proven decision-making framework for choosing a career that fits your personality, skills, and family expectations.',
    url: '/resources/videos/choose-career',
    downloadUrl: null,
    pages: null,
    duration: '22 mins',
    popularity: 980,
    tags: ['career-planning', 'decision-making'],
    popular: false
  },
  {
    title: 'Scholarship Opportunities for Kenyan Students',
    type: 'guide',
    category: 'career',
    description: 'Curated list of scholarships available to Kenyan students: government bursaries, university grants, NGO funding, and international scholarships.',
    url: null,
    downloadUrl: '/resources/scholarships-guide.pdf',
    pages: 48,
    duration: null,
    popularity: 1450,
    tags: ['scholarships', 'funding', 'bursaries'],
    popular: true
  },
  {
    title: 'Form 4 to University: What to Expect',
    type: 'guide',
    category: 'university',
    description: 'A realistic guide for Form 4 students: KCSE results day, KUCCPS placement, reporting to university, and surviving first semester.',
    url: null,
    downloadUrl: '/resources/form4-to-university.pdf',
    pages: 28,
    duration: null,
    popularity: 870,
    tags: ['transition', 'university', 'form-4'],
    popular: false
  },
  {
    title: 'Skills for the Kenyan Job Market',
    type: 'guide',
    category: 'skills',
    description: 'What employers in Kenya are looking for in 2025. Practical tips on building digital skills, communication, and leadership while still in school.',
    url: null,
    downloadUrl: '/resources/job-market-skills.pdf',
    pages: 36,
    duration: null,
    popularity: 720,
    tags: ['skills', 'employability', 'job-market'],
    popular: false
  }
];

/**
 * Get career resources — public, no auth required
 * Falls back to seeded defaults if CareerResource class is empty
 */
Parse.Cloud.define('getCareerResources', async (request) => {
  const { params } = request;
  const { category, search, limit: rawLimit } = params || {};
  const limit = Math.min(parseInt(rawLimit) || 50, 100);

  try {
    const CareerResource = Parse.Object.extend('CareerResource');
    const query = new Parse.Query(CareerResource);

    if (category && category !== 'all') {
      query.equalTo('category', category);
    }
    if (search) {
      query.matches('title', new RegExp(search, 'i'));
    }
    query.limit(limit);
    query.descending('popularity');

    const results = await query.find({ useMasterKey: true });

    // Seed defaults on first call if class is empty
    if (results.length === 0) {
      const seedObjs = DEFAULT_RESOURCES.map(r => {
        const obj = new CareerResource();
        Object.entries(r).forEach(([k, v]) => obj.set(k, v));
        return obj;
      });
      await Parse.Object.saveAll(seedObjs, { useMasterKey: true });

      const allResults = await query.find({ useMasterKey: true });
      const resources = allResults.map(r => ({
        id: r.id,
        title: r.get('title'),
        type: r.get('type'),
        category: r.get('category'),
        description: r.get('description'),
        url: r.get('url'),
        downloadUrl: r.get('downloadUrl'),
        pages: r.get('pages'),
        duration: r.get('duration'),
        popularity: r.get('popularity') || 0,
        tags: r.get('tags') || [],
        popular: r.get('popular') || false
      }));

      return { success: true, resources, total: resources.length, seeded: true };
    }

    const resources = results.map(r => ({
      id: r.id,
      title: r.get('title'),
      type: r.get('type'),
      category: r.get('category'),
      description: r.get('description'),
      url: r.get('url'),
      downloadUrl: r.get('downloadUrl'),
      pages: r.get('pages'),
      duration: r.get('duration'),
      popularity: r.get('popularity') || 0,
      tags: r.get('tags') || [],
      popular: r.get('popular') || false
    }));

    return { success: true, resources, total: resources.length, seeded: false };
  } catch (error) {
    console.error('Error fetching career resources:', error);
    // Return hardcoded defaults on any error
    return {
      success: true,
      resources: DEFAULT_RESOURCES.map((r, i) => ({ ...r, id: String(i + 1) })),
      total: DEFAULT_RESOURCES.length,
      fallback: true
    };
  }
}, { requireUser: false });

}; // End of module.exports function
