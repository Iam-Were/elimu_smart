/**
 * Assessment Cloud Functions
 * Functions to fetch assessment questions from Parse database
 */

Parse.Cloud.define('getRiasecQuestions', async (request) => {
  try {
    const query = new Parse.Query('RiasecQuestion');
    query.equalTo('isActive', true);
    query.ascending('questionId');
    query.limit(1000); // Get all questions

    const questions = await query.find();

    // Deduplicate by questionId. The RiasecQuestion seed was historically run
    // more than once (non-idempotent), leaving each of the ~50 unique questions
    // stored twice. Returning the raw rows made students answer everything
    // twice and re-show already-answered questions pre-filled. Keep the first
    // occurrence of each questionId so the assessment is the real unique set.
    const seen = new Set();
    const unique = [];
    for (const q of questions) {
      const qid = q.get('questionId');
      if (seen.has(qid)) continue;
      seen.add(qid);
      unique.push({
        id: qid,
        category: q.get('category'),
        statement: q.get('statement'),
        riasecType: q.get('riasecType'),
        kenyaContext: q.get('kenyaContext') || null
      });
    }

    return unique;
  } catch (error) {
    console.error('Error fetching RIASEC questions:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch RIASEC questions');
  }
});

Parse.Cloud.define('getSkillsQuestions', async (request) => {
  try {
    const query = new Parse.Query('SkillQuestion');
    query.equalTo('isActive', true);
    query.ascending('questionId');
    query.limit(1000); // Get all questions

    const questions = await query.find();

    // Deduplicate by questionId — same non-idempotent-seed issue as RIASEC: the
    // SkillQuestion seed double-ran, storing each of the 36 unique questions
    // twice (72 rows). Keep the first occurrence of each id.
    const seen = new Set();
    const unique = [];
    for (const q of questions) {
      const qid = q.get('questionId');
      if (seen.has(qid)) continue;
      seen.add(qid);
      unique.push({
        id: qid,
        text: q.get('text'),
        category: q.get('category')
      });
    }

    return unique;
  } catch (error) {
    console.error('Error fetching Skills questions:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch Skills questions');
  }
});

// Save assessment results
Parse.Cloud.define('saveAssessmentResult', async (request) => {
  const { user, assessmentType, responses, scores, results } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User must be authenticated');
  }

  if (!assessmentType || !responses || !scores || !results) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Missing required parameters');
  }

  try {
    const AssessmentResult = Parse.Object.extend('AssessmentResult');
    const result = new AssessmentResult();

    result.set('user', request.user);
    result.set('assessmentType', assessmentType);
    result.set('responses', responses);
    result.set('scores', scores);
    result.set('results', results);
    result.set('completedAt', new Date());
    result.set('isActive', true);

    await result.save(null, { useMasterKey: true });

    return {
      success: true,
      resultId: result.id,
      message: 'Assessment result saved successfully'
    };
  } catch (error) {
    console.error('Error saving assessment result:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to save assessment result');
  }
});

// Get user's assessment history
Parse.Cloud.define('getUserAssessments', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User must be authenticated');
  }

  const { assessmentType } = request.params;

  try {
    const query = new Parse.Query('AssessmentResult');
    query.equalTo('user', request.user);
    query.equalTo('isActive', true);

    if (assessmentType) {
      query.equalTo('assessmentType', assessmentType);
    }

    query.descending('completedAt');
    query.limit(10); // Get last 10 assessments

    const results = await query.find();

    return results.map(r => ({
      id: r.id,
      assessmentType: r.get('assessmentType'),
      completedAt: r.get('completedAt'),
      scores: r.get('scores'),
      results: r.get('results')
    }));
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch user assessments');
  }
});

// Get user's skills data (for profile page)
Parse.Cloud.define('getUserSkills', async (request) => {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User must be authenticated');
  }

  try {
    // Get most recent Skills assessment
    const query = new Parse.Query('AssessmentResult');
    query.equalTo('user', request.user);
    query.equalTo('assessmentType', 'skills');
    query.equalTo('isActive', true);
    query.descending('completedAt');
    query.limit(1);

    const results = await query.find({ useMasterKey: true });

    if (results.length === 0) {
      return {
        hasCompleted: false,
        skills: []
      };
    }

    const assessment = results[0];
    const scores = assessment.get('scores') || {};

    // Convert scores object to array format expected by frontend
    const skillsArray = Object.entries(scores).map(([category, score]) => ({
      category,
      score: score || 0
    }));

    return {
      hasCompleted: true,
      completedAt: assessment.get('completedAt'),
      skills: skillsArray,
      results: assessment.get('results')
    };
  } catch (error) {
    console.error('Error fetching user skills:', error);
    console.error('Stack:', error.stack);
    // Return empty result instead of throwing to prevent UI breakage
    return {
      hasCompleted: false,
      skills: [],
      error: error.message
    };
  }
});

console.log('✓ Assessment Cloud Functions loaded');
