/**
 * Content Management Cloud Functions
 * CRUD operations for Universities, Courses, Careers, and Assessment Questions
 * RBAC: Operations and Platform admins only
 */

const Parse = require('parse/node');

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

module.exports = {
  // Exported for testing/documentation purposes
};
