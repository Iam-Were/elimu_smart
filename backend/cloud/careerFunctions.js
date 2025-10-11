/**
 * Career Cloud Functions (Optimized)
 *
 * Backend functions for querying Career database
 * Replaces hardcoded SubjectCareerMapper data
 *
 * Optimizations:
 * - Redis caching for frequently accessed data (24h TTL)
 * - Select-only queries to reduce payload size
 * - Batch endpoints for mobile performance
 */

const { getCached, CACHE_TTL } = require('../utils/cache');

/**
 * Get careers by subject (OPTIMIZED with caching)
 * Replaces frontend SUBJECT_CAREERS lookup
 */
Parse.Cloud.define('getCareersBySubject', async (request) => {
  const { subject } = request.params;

  if (!subject) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Subject parameter required');
  }

  try {
    // Cache key includes subject for granular caching
    const cacheKey = `careers-by-subject-${subject}`;

    return await getCached(cacheKey, async () => {
      const Career = Parse.Object.extend('Career');
      const query = new Parse.Query(Career);

      // Use containsAll for array field (relatedSubjects is an Array)
      query.containsAll('relatedSubjects', [subject]);
      query.equalTo('isActive', true);
      query.descending('matchScore');
      query.limit(10); // Top 10 careers per subject

      // Select only needed fields to reduce payload (mobile optimization)
      query.select([
        'title', 'category', 'matchScore', 'description', 'salaryRange',
        'demand', 'kuccpsPathway', 'skills', 'minClusterPoints',
        'employmentRate', 'avgSalary'
      ]);

      // Use master key to bypass ACL (public data)
      const results = await query.find({ useMasterKey: true });

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
    }, CACHE_TTL.KENYA_CAREERS); // 24-hour cache

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

    const results = await query.find({ useMasterKey: true });

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

    const results = await query.find({ useMasterKey: true });
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

    const career = await query.get(careerId, { useMasterKey: true });

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

    const results = await query.find({ useMasterKey: true });

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

/**
 * MOBILE-OPTIMIZED BATCH ENDPOINT
 * Fetch multiple subjects' careers in one request (reduces network calls)
 */
Parse.Cloud.define('getBatchCareersBySubjects', async (request) => {
  const { subjects } = request.params;

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Subjects array required');
  }

  if (subjects.length > 10) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Maximum 10 subjects per batch request');
  }

  try {
    const results = {};

    // Fetch all subjects in parallel for maximum performance
    await Promise.all(
      subjects.map(async (subject) => {
        const cacheKey = `careers-by-subject-${subject}`;

        results[subject] = await getCached(cacheKey, async () => {
          const Career = Parse.Object.extend('Career');
          const query = new Parse.Query(Career);

          query.containsAll('relatedSubjects', [subject]);
          query.equalTo('isActive', true);
          query.descending('matchScore');
          query.limit(10);

          // Mobile-optimized: select only essential fields
          query.select([
            'title', 'category', 'matchScore', 'description', 'salaryRange',
            'demand', 'kuccpsPathway', 'skills', 'minClusterPoints',
            'employmentRate', 'avgSalary'
          ]);

          const careers = await query.find({ useMasterKey: true });

          return careers.map(career => ({
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
        }, CACHE_TTL.KENYA_CAREERS);
      })
    );

    return {
      results,
      metadata: {
        subjectsCount: subjects.length,
        totalCareers: Object.values(results).reduce((sum, arr) => sum + arr.length, 0),
        cached: true
      }
    };

  } catch (error) {
    console.error('Error getting batch careers:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch batch careers');
  }
});

/**
 * MOBILE-OPTIMIZED: Get all KCSE subjects with career counts
 * Returns lightweight metadata for mobile subject picker
 */
Parse.Cloud.define('getSubjectsWithCareerCounts', async () => {
  try {
    const cacheKey = 'subjects-career-counts';

    return await getCached(cacheKey, async () => {
      const Career = Parse.Object.extend('Career');
      const query = new Parse.Query(Career);
      query.equalTo('isActive', true);
      query.select('relatedSubjects');

      const allCareers = await query.find({ useMasterKey: true });

      // Count careers per subject
      const subjectCounts = {};
      allCareers.forEach(career => {
        const subjects = career.get('relatedSubjects') || [];
        subjects.forEach(subject => {
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
      });

      // Convert to array and sort by career count (descending)
      return Object.entries(subjectCounts)
        .map(([subject, count]) => ({ subject, careerCount: count }))
        .sort((a, b) => b.careerCount - a.careerCount);

    }, CACHE_TTL.SUBJECT_MAPPINGS); // 24-hour cache
  } catch (error) {
    console.error('Error getting subjects with counts:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to fetch subject counts');
  }
});

module.exports = {
  // Export for testing if needed
};
