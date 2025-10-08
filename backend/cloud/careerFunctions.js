/**
 * Career Cloud Functions
 *
 * Backend functions for querying Career database
 * Replaces hardcoded SubjectCareerMapper data
 */

const Parse = require('parse/node');

/**
 * Get careers by subject
 * Replaces frontend SUBJECT_CAREERS lookup
 */
Parse.Cloud.define('getCareersBySubject', async (request) => {
  const { subject } = request.params;

  if (!subject) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Subject parameter required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);

    query.equalTo('relatedSubjects', subject);
    query.equalTo('isActive', true);
    query.descending('matchScore');
    query.limit(10); // Top 10 careers per subject

    const results = await query.find();

    return results.map(career => ({
      id: career.id,
      title: career.get('title'),
      category: career.get('category'),
      matchScore: career.get('matchScore'),
      description: career.get('description'),
      salaryRange: career.get('salaryRange'),
      demand: career.get('demand'),
      kuccpsPathway: career.get('kuccpsPathway'),
      skills: career.get('skills'),
      minClusterPoints: career.get('minClusterPoints'),
      employmentRate: career.get('employmentRate'),
      avgSalary: career.get('avgSalary')
    }));

  } catch (error) {
    console.error('Error getting careers by subject:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch careers');
  }
});

/**
 * Search careers by keyword
 */
Parse.Cloud.define('searchCareers', async (request) => {
  const { query: searchQuery, category, minSalary, demand } = request.params;

  if (!searchQuery) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Search query required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);

    // Search in title and keywords
    query.contains('searchKeywords', searchQuery.toLowerCase());
    query.equalTo('isActive', true);

    // Optional filters
    if (category) {
      query.equalTo('category', category);
    }
    if (minSalary) {
      query.greaterThanOrEqualTo('avgSalary', minSalary);
    }
    if (demand) {
      query.equalTo('demand', demand);
    }

    query.descending('matchScore');
    query.limit(20);

    const results = await query.find();

    return results.map(career => ({
      id: career.id,
      title: career.get('title'),
      category: career.get('category'),
      matchScore: career.get('matchScore'),
      description: career.get('description'),
      salaryRange: career.get('salaryRange'),
      demand: career.get('demand'),
      kuccpsPathway: career.get('kuccpsPathway'),
      skills: career.get('skills')
    }));

  } catch (error) {
    console.error('Error searching careers:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to search careers');
  }
});

/**
 * Get all career categories
 */
Parse.Cloud.define('getCareerCategories', async () => {
  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);

    query.equalTo('isActive', true);
    query.select('category');

    const results = await query.find();
    const categories = [...new Set(results.map(c => c.get('category')))];

    return categories.filter(Boolean);

  } catch (error) {
    console.error('Error getting career categories:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch categories');
  }
});

/**
 * Get career details by ID
 */
Parse.Cloud.define('getCareerById', async (request) => {
  const { careerId } = request.params;

  if (!careerId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Career ID required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);

    const career = await query.get(careerId);

    if (!career) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Career not found');
    }

    return {
      id: career.id,
      title: career.get('title'),
      category: career.get('category'),
      relatedSubjects: career.get('relatedSubjects'),
      subjectCombinations: career.get('subjectCombinations'),
      matchScore: career.get('matchScore'),
      description: career.get('description'),
      salaryRange: career.get('salaryRange'),
      demand: career.get('demand'),
      kuccpsPathway: career.get('kuccpsPathway'),
      skills: career.get('skills'),
      minClusterPoints: career.get('minClusterPoints'),
      employmentRate: career.get('employmentRate'),
      avgSalary: career.get('avgSalary'),
      alternativePathways: career.get('alternativePathways'),
      kuccpsCode: career.get('kuccpsCode')
    };

  } catch (error) {
    console.error('Error getting career by ID:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch career details');
  }
});

/**
 * Get top careers across all subjects
 */
Parse.Cloud.define('getTopCareers', async (request) => {
  const { limit = 20, category } = request.params;

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);

    query.equalTo('isActive', true);

    if (category) {
      query.equalTo('category', category);
    }

    query.descending('matchScore');
    query.descending('avgSalary');
    query.limit(limit);

    const results = await query.find();

    return results.map(career => ({
      id: career.id,
      title: career.get('title'),
      category: career.get('category'),
      matchScore: career.get('matchScore'),
      salaryRange: career.get('salaryRange'),
      demand: career.get('demand'),
      description: career.get('description')
    }));

  } catch (error) {
    console.error('Error getting top careers:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch top careers');
  }
});

module.exports = {
  // Export for testing if needed
};
