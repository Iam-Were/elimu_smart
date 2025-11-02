/**
 * RIASEC Assessment Scoring Cloud Functions
 *
 * Moved from frontend for centralized, consistent scoring across all clients
 */

// RIASEC type definitions (Kenya-specific careers and KUCCPS pathways)
const riasecTypes = {
  R: {
    name: 'Realistic',
    kenyaCareers: [
      'Mechanical Engineer',
      'Electrician',
      'Automotive Technician',
      'Agricultural Officer',
      'Construction Manager',
      'Surveyor',
      'Plumber',
      'Aircraft Maintenance Engineer'
    ],
    kuccpsPathways: [
      'Engineering (JKUAT, UoN, TU-K)',
      'Agriculture (Egerton, UoN)',
      'Technical Training (Kenya Technical Trainers College)'
    ]
  },
  I: {
    name: 'Investigative',
    kenyaCareers: [
      'Software Developer',
      'Data Scientist',
      'Medical Doctor',
      'Research Scientist',
      'Pharmacist',
      'Veterinary Officer',
      'Lab Technician',
      'Environmental Scientist'
    ],
    kuccpsPathways: [
      'Medicine (UoN, Moi University)',
      'Computer Science (JKUAT, Strathmore, UoN)',
      'Pure Sciences (UoN, Kenyatta, Egerton)'
    ]
  },
  A: {
    name: 'Artistic',
    kenyaCareers: [
      'Graphic Designer',
      'Journalist',
      'Architect',
      'Interior Designer',
      'Film Producer',
      'Content Creator',
      'Fashion Designer',
      'UI/UX Designer'
    ],
    kuccpsPathways: [
      'Design & Creative Arts (UoN, JKUAT)',
      'Media & Journalism (Daystar, Multimedia University)',
      'Architecture (UoN, JKUAT)'
    ]
  },
  S: {
    name: 'Social',
    kenyaCareers: [
      'Teacher',
      'Counselor',
      'Social Worker',
      'Nurse',
      'Community Health Worker',
      'HR Manager',
      'NGO Program Officer',
      'Clinical Officer'
    ],
    kuccpsPathways: [
      'Education (Kenyatta, Moi, Egerton)',
      'Nursing (UoN, Kenya Medical Training College)',
      'Counseling Psychology (Daystar, Kenyatta)'
    ]
  },
  E: {
    name: 'Enterprising',
    kenyaCareers: [
      'Business Owner',
      'Sales Manager',
      'Marketing Director',
      'Lawyer',
      'Event Planner',
      'Bank Manager',
      'Real Estate Agent',
      'Insurance Broker'
    ],
    kuccpsPathways: [
      'Business Administration (Strathmore, UoN, JKUAT)',
      'Law (UoN, Moi, Strathmore)',
      'Economics (UoN, Kenyatta)'
    ]
  },
  C: {
    name: 'Conventional',
    kenyaCareers: [
      'Accountant',
      'Auditor',
      'Administrative Assistant',
      'Financial Analyst',
      'Tax Consultant',
      'Data Entry Clerk',
      'Records Manager',
      'Compliance Officer'
    ],
    kuccpsPathways: [
      'Accounting (Strathmore, JKUAT, UoN)',
      'Finance (Strathmore, UoN)',
      'Business IT (Strathmore, JKUAT)'
    ]
  }
};

/**
 * Calculate RIASEC scores from user responses
 */
Parse.Cloud.define('calculateRiasecScores', async (request) => {
  const { responses, assessmentId } = request.params;

  if (!responses || typeof responses !== 'object') {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Responses are required');
  }

  try {
    // Fetch all RIASEC questions to determine types
    const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
    const query = new Parse.Query(RiasecQuestion);
    query.equalTo('isActive', true);
    query.ascending('questionId');
    const questions = await query.find({ useMasterKey: true });

    // Calculate raw scores for each RIASEC type
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    questions.forEach(question => {
      const questionId = question.get('questionId');
      const response = responses[questionId];

      if (response !== undefined && response !== null) {
        const type = question.get('riasecType');
        if (scores[type] !== undefined) {
          scores[type] += Number(response);
        }
      }
    });

    // Normalize scores to 0-100 scale
    const riasecKeys = ['R', 'I', 'A', 'S', 'E', 'C'];
    riasecKeys.forEach(type => {
      const typeQuestions = questions.filter(q => q.get('riasecType') === type);
      const maxScore = typeQuestions.length * 4; // 4 = max response value (Likert scale)
      if (maxScore > 0) {
        scores[type] = Math.round((scores[type] / maxScore) * 100);
      }
    });

    // Determine Holland Code (top 3 types)
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    const hollandCode = sortedTypes.join('');
    const primaryType = sortedTypes[0];

    // Generate career matches
    const careerMatches = generateCareerMatches(scores, primaryType);

    // Generate development areas
    const developmentAreas = generateDevelopmentAreas(scores);

    // Generate next steps
    const nextSteps = generateNextSteps(primaryType);

    const results = {
      scores,
      hollandCode,
      primaryType,
      careerMatches,
      developmentAreas,
      nextSteps,
      calculatedAt: new Date(),
      assessmentId: assessmentId || 'unknown'
    };

    // Save results to database if user is authenticated
    if (request.user) {
      const AssessmentResult = Parse.Object.extend('AssessmentResult');
      const result = new AssessmentResult();

      result.set('user', request.user);
      result.set('assessmentType', 'riasec');
      result.set('assessmentId', assessmentId || 'unknown');
      result.set('scores', scores);
      result.set('hollandCode', hollandCode);
      result.set('primaryType', primaryType);
      result.set('careerMatches', careerMatches);
      result.set('developmentAreas', developmentAreas);
      result.set('nextSteps', nextSteps);
      result.set('completedAt', new Date());

      // Set ACL: only user and admins can read
      const acl = new Parse.ACL(request.user);
      acl.setPublicReadAccess(false);
      acl.setRoleReadAccess('admin', true);
      result.setACL(acl);

      await result.save(null, { useMasterKey: true });
    }

    return results;

  } catch (error) {
    console.error('Error calculating RIASEC scores:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to calculate scores');
  }
});

/**
 * Generate career matches based on RIASEC scores
 */
function generateCareerMatches(scores, primaryType) {
  const matches = [];

  // Add primary type careers with high compatibility (85-100%)
  const primaryCareers = riasecTypes[primaryType].kenyaCareers;
  primaryCareers.slice(0, 5).forEach(career => {
    matches.push({
      career,
      compatibility: 85 + Math.floor(Math.random() * 16),
      kuccpsPathway: riasecTypes[primaryType].kuccpsPathways[0],
      reasonsForMatch: [
        `Strong ${riasecTypes[primaryType].name} personality fit`,
        'High demand in Kenya job market',
        'Good KUCCPS pathway availability'
      ]
    });
  });

  // Add secondary type careers (70-85% compatibility)
  const secondaryType = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[1][0];

  const secondaryCareers = riasecTypes[secondaryType].kenyaCareers;
  secondaryCareers.slice(0, 3).forEach(career => {
    matches.push({
      career,
      compatibility: 70 + Math.floor(Math.random() * 16),
      kuccpsPathway: riasecTypes[secondaryType].kuccpsPathways[0],
      reasonsForMatch: [
        `Good ${riasecTypes[secondaryType].name} secondary fit`,
        'Growing field in Kenya',
        'Multiple pathways available'
      ]
    });
  });

  return matches.sort((a, b) => b.compatibility - a.compatibility);
}

/**
 * Generate development areas based on lowest scores
 */
function generateDevelopmentAreas(scores) {
  const lowestScores = Object.entries(scores)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 2);

  return lowestScores.map(([type]) =>
    `Develop ${riasecTypes[type].name.toLowerCase()} skills to become more well-rounded`
  );
}

/**
 * Generate next steps based on primary type
 */
function generateNextSteps(primaryType) {
  return [
    `Research ${riasecTypes[primaryType].kuccpsPathways[0]} programs at Kenyan universities`,
    `Connect with professionals in ${riasecTypes[primaryType].kenyaCareers[0]} field`,
    'Complete subject-to-career mapping for specific requirements',
    'Explore scholarship opportunities for your chosen pathway',
    'Begin building relevant skills and experience'
  ];
}

/**
 * Get RIASEC Personality Type Information (16-Personality Style)
 * Returns detailed personality characteristics, top 3 career matches, strengths, etc.
 *
 * @param {string} typeCode - RIASEC type code (R, I, A, S, E, C)
 * @returns {object} Comprehensive personality type information
 */
Parse.Cloud.define('getRiasecPersonalityType', async (request) => {
  const { typeCode } = request.params;

  if (!typeCode || !/^[RIASEC]$/.test(typeCode)) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid RIASEC type code. Must be R, I, A, S, E, or C.');
  }

  try {
    const RiasecTypeInfo = Parse.Object.extend('RiasecTypeInfo');
    const query = new Parse.Query(RiasecTypeInfo);
    query.equalTo('code', typeCode);
    query.equalTo('isActive', true);

    const typeInfo = await query.first({ useMasterKey: true });

    if (!typeInfo) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `No personality type information found for code: ${typeCode}`);
    }

    // Return comprehensive type information
    return {
      code: typeInfo.get('code'),
      name: typeInfo.get('name'),
      personalityTypeName: typeInfo.get('personalityTypeName'), // "The Craftsman", "The Analyst", etc.
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
      developmentTips: typeInfo.get('developmentTips') || [],
      avatarSuggestions: typeInfo.get('avatarSuggestions') || {}
    };

  } catch (error) {
    console.error('Error fetching RIASEC personality type:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch personality type information');
  }
});

/**
 * Get All RIASEC Personality Types (for comparison/selection)
 */
Parse.Cloud.define('getAllRiasecPersonalityTypes', async () => {
  try {
    const RiasecTypeInfo = Parse.Object.extend('RiasecTypeInfo');
    const query = new Parse.Query(RiasecTypeInfo);
    query.equalTo('isActive', true);
    query.ascending('code'); // R, I, A, S, E, C order

    const types = await query.find({ useMasterKey: true });

    return types.map(type => ({
      code: type.get('code'),
      name: type.get('name'),
      personalityTypeName: type.get('personalityTypeName'),
      tagline: type.get('tagline'),
      description: type.get('description')
    }));

  } catch (error) {
    console.error('Error fetching all RIASEC personality types:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch personality types');
  }
});

console.log('✅ RIASEC Scoring Cloud Functions loaded');
