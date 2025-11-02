/**
 * Community Forum Cloud Functions
 *
 * Reddit-style Q&A forum with:
 * - 2-level nesting (Question → Answer → Reply)
 * - Upvoting system with toggle
 * - Counselor moderation (best answer, verify, pin, delete)
 * - Pagination for performance
 * - Real names only (no anonymity)
 *
 * NOTE: Uses global Parse object from main.js (no local require needed)
 */

// =============================================================================
// SCHEMA INITIALIZATION (Run Once)
// =============================================================================

/**
 * Initialize Community Forum Schema
 * Creates CommunityQuestion and CommunityAnswer tables with indexes
 * Call this once after deployment: Parse.Cloud.run('initializeCommunityForumSchema', {}, { sessionToken })
 */
Parse.Cloud.define('initializeCommunityForumSchema', async () => {
  try {
    console.log('🚀 Starting Community Forum schema initialization...');

    // APPROACH: Create dummy objects and save them
    // PostgreSQL automatically creates tables with all fields
    // This bypasses Parse Schema API authorization issues

    // 1. Create CommunityQuestion table
    console.log('1️⃣ Creating CommunityQuestion table...');
    const QuestionClass = Parse.Object.extend('CommunityQuestion');
    const dummyQuestion = new QuestionClass();

    // Set all fields - PostgreSQL creates columns automatically
    dummyQuestion.set('title', '__INIT_DUMMY__');
    dummyQuestion.set('question', 'Schema initialization dummy question');
    dummyQuestion.set('category', 'general');
    dummyQuestion.set('askedByName', 'System');
    dummyQuestion.set('upvotes', 0);
    dummyQuestion.set('upvotedBy', []);
    dummyQuestion.set('viewCount', 0);
    dummyQuestion.set('answerCount', 0);
    dummyQuestion.set('status', 'open');
    dummyQuestion.set('hasBestAnswer', false);
    dummyQuestion.set('isPinned', false);
    dummyQuestion.set('isDeleted', true); // Mark as deleted so it doesn't show
    dummyQuestion.set('deletedReason', 'Schema initialization dummy');
    dummyQuestion.set('lastActivityAt', new Date());

    await dummyQuestion.save(null, { useMasterKey: true });
    console.log('✅ CommunityQuestion table created');

    // 2. Create CommunityAnswer table
    console.log('2️⃣ Creating CommunityAnswer table...');
    const AnswerClass = Parse.Object.extend('CommunityAnswer');
    const dummyAnswer = new AnswerClass();

    // Set all fields
    dummyAnswer.set('answer', 'Schema initialization dummy answer');
    dummyAnswer.set('answeredByName', 'System');
    dummyAnswer.set('isCounselor', false);
    dummyAnswer.set('upvotes', 0);
    dummyAnswer.set('upvotedBy', []);
    dummyAnswer.set('isBestAnswer', false);
    dummyAnswer.set('isVerified', false);
    dummyAnswer.set('isDeleted', true); // Mark as deleted
    dummyAnswer.set('deletedReason', 'Schema initialization dummy');
    dummyAnswer.set('depth', 0);

    await dummyAnswer.save(null, { useMasterKey: true });
    console.log('✅ CommunityAnswer table created');

    console.log('✅ Schema initialization complete!');
    console.log('📝 Note: Dummy records marked as deleted - they won\'t appear in queries');

    return {
      success: true,
      message: 'Community Forum schema initialized successfully',
      tables: ['CommunityQuestion', 'CommunityAnswer'],
      note: 'Dummy initialization records created and marked as deleted'
    };

  } catch (error) {
    console.error('❌ Error initializing schema:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, `Schema initialization failed: ${error.message}`);
  }
});

// =============================================================================
// COMMUNITY Q&A FUNCTIONS
// =============================================================================

// Rate limiting helper
const rateLimit = {
  cache: new Map(),
  check: function(userId, action, limit, windowMs) {
    const key = `${userId}:${action}`;
    const now = Date.now();
    const userActions = this.cache.get(key) || [];

    // Clean old entries
    const recentActions = userActions.filter(time => now - time < windowMs);

    if (recentActions.length >= limit) {
      return false; // Rate limit exceeded
    }

    recentActions.push(now);
    this.cache.set(key, recentActions);
    return true;
  }
};

/**
 * Get all community questions with pagination and filtering
 *
 * @param {string} category - Filter by category ('all', 'career', 'academic', 'university', 'personal')
 * @param {number} page - Page number (0-indexed)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} sortBy - Sort method ('recent', 'popular')
 * @returns {object} { questions, total, page, hasMore }
 */
Parse.Cloud.define('getAllQuestions', async (request) => {
  const { category, page = 0, limit = 20, sortBy = 'recent' } = request.params;

  try {
    const Question = Parse.Object.extend('CommunityQuestion');
    const query = new Parse.Query(Question);

    // Filter by category
    if (category && category !== 'all') {
      query.equalTo('category', category);
    }

    // Filter out deleted questions
    query.equalTo('isDeleted', false);

    // Sorting
    if (sortBy === 'recent') {
      query.descending('isPinned'); // Pinned questions first
      query.descending('lastActivityAt'); // Then by activity
    } else if (sortBy === 'popular') {
      query.descending('isPinned');
      query.descending('upvotes');
    }

    // Pagination
    query.skip(page * limit);
    query.limit(limit);
    query.include('askedBy'); // Include user data

    const questions = await query.find({ useMasterKey: true });
    const total = await query.count({ useMasterKey: true });

    return {
      questions: questions.map(q => q.toJSON()),
      total,
      page,
      hasMore: (page + 1) * limit < total
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch questions');
  }
});

/**
 * Submit a new community question
 *
 * Rate limit: 5 questions per day per user
 *
 * @param {string} title - Question title
 * @param {string} question - Question details
 * @param {string} category - Question category
 * @returns {object} Created question object
 */
Parse.Cloud.define('submitQuestion', async (request) => {
  const { user } = request;
  const { title, question, category } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  // Validate inputs
  if (!title || !question || !category) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Title, question, and category are required');
  }

  // Rate limiting: 5 questions per day
  const canPost = rateLimit.check(user.id, 'submitQuestion', 5, 24 * 60 * 60 * 1000);
  if (!canPost) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Rate limit exceeded. Maximum 5 questions per day.');
  }

  try {
    const Question = Parse.Object.extend('CommunityQuestion');
    const newQuestion = new Question();

    newQuestion.set('title', title);
    newQuestion.set('question', question);
    newQuestion.set('category', category);
    newQuestion.set('askedBy', user);
    newQuestion.set('askedByName', user.get('firstName') + ' ' + user.get('lastName'));
    newQuestion.set('upvotes', 0);
    newQuestion.set('upvotedBy', []);
    newQuestion.set('viewCount', 0);
    newQuestion.set('answerCount', 0);
    newQuestion.set('status', 'open');
    newQuestion.set('hasBestAnswer', false);
    newQuestion.set('isPinned', false);
    newQuestion.set('isDeleted', false);
    newQuestion.set('lastActivityAt', new Date());

    await newQuestion.save(null, { useMasterKey: true });

    return newQuestion;
  } catch (error) {
    console.error('Error submitting question:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to submit question');
  }
});

/**
 * Get answers for a specific question (with nested replies)
 *
 * @param {string} questionId - Question object ID
 * @param {number} page - Page number (0-indexed)
 * @param {number} limit - Items per page (default: 10)
 * @returns {array} List of answers with nested replies
 */
Parse.Cloud.define('getQuestionAnswers', async (request) => {
  const { questionId, page = 0, limit = 10 } = request.params;

  if (!questionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'questionId is required');
  }

  try {
    const Answer = Parse.Object.extend('CommunityAnswer');
    const query = new Parse.Query(Answer);

    query.equalTo('question', {
      __type: 'Pointer',
      className: 'CommunityQuestion',
      objectId: questionId
    });
    query.equalTo('isDeleted', false);
    query.equalTo('depth', 0); // Only top-level answers (replies fetched separately)

    // Sort: Best answer first, then by upvotes, then chronological
    query.descending('isBestAnswer');
    query.descending('upvotes');
    query.addAscending('createdAt');

    query.skip(page * limit);
    query.limit(limit);
    query.include('answeredBy');

    const answers = await query.find({ useMasterKey: true });

    // Fetch nested replies for each answer
    const answersWithReplies = await Promise.all(
      answers.map(async (answer) => {
        const replyQuery = new Parse.Query(Answer);
        replyQuery.equalTo('parentAnswer', answer);
        replyQuery.equalTo('isDeleted', false);
        replyQuery.ascending('createdAt'); // Chronological order for replies
        replyQuery.include('answeredBy');

        const replies = await replyQuery.find({ useMasterKey: true });

        return {
          ...answer.toJSON(),
          replies: replies.map(r => r.toJSON())
        };
      })
    );

    return answersWithReplies;
  } catch (error) {
    console.error('Error fetching answers:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch answers');
  }
});

/**
 * Post an answer or reply to a question
 *
 * @param {string} questionId - Question object ID
 * @param {string} answer - Answer text
 * @param {string} parentAnswerId - (Optional) Parent answer ID for nested reply
 * @returns {object} Created answer object
 */
Parse.Cloud.define('answerQuestion', async (request) => {
  const { user } = request;
  const { questionId, answer, parentAnswerId } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  if (!questionId || !answer) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'questionId and answer are required');
  }

  try {
    const Answer = Parse.Object.extend('CommunityAnswer');
    const newAnswer = new Answer();

    // Set basic fields
    newAnswer.set('question', {
      __type: 'Pointer',
      className: 'CommunityQuestion',
      objectId: questionId
    });
    newAnswer.set('answer', answer);
    newAnswer.set('answeredBy', user);
    newAnswer.set('answeredByName', user.get('firstName') + ' ' + user.get('lastName'));
    newAnswer.set('isCounselor', user.get('role') === 'counselor');
    newAnswer.set('upvotes', 0);
    newAnswer.set('upvotedBy', []);
    newAnswer.set('isBestAnswer', false);
    newAnswer.set('isVerified', false);
    newAnswer.set('isDeleted', false);

    // Handle nesting (max 2 levels: answer → reply)
    if (parentAnswerId) {
      newAnswer.set('parentAnswer', {
        __type: 'Pointer',
        className: 'CommunityAnswer',
        objectId: parentAnswerId
      });
      newAnswer.set('depth', 1); // Reply to answer
    } else {
      newAnswer.set('depth', 0); // Top-level answer
    }

    await newAnswer.save(null, { useMasterKey: true });

    // Update question's answerCount and lastActivityAt
    const Question = Parse.Object.extend('CommunityQuestion');
    const questionQuery = new Parse.Query(Question);
    const question = await questionQuery.get(questionId, { useMasterKey: true });

    if (!parentAnswerId) {
      question.increment('answerCount', 1); // Only count top-level answers
    }
    question.set('lastActivityAt', new Date());
    question.set('status', 'answered');

    await question.save(null, { useMasterKey: true });

    return newAnswer;
  } catch (error) {
    console.error('Error posting answer:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to post answer');
  }
});

/**
 * Upvote a question (toggle on/off)
 *
 * @param {string} questionId - Question object ID
 * @returns {object} { upvotes, userHasUpvoted }
 */
Parse.Cloud.define('upvoteQuestion', async (request) => {
  const { user } = request;
  const { questionId } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  if (!questionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'questionId is required');
  }

  try {
    const Question = Parse.Object.extend('CommunityQuestion');
    const query = new Parse.Query(Question);
    const question = await query.get(questionId, { useMasterKey: true });

    const upvotedBy = question.get('upvotedBy') || [];
    const hasUpvoted = upvotedBy.includes(user.id);

    if (hasUpvoted) {
      // Remove upvote
      question.set('upvotedBy', upvotedBy.filter(id => id !== user.id));
      question.increment('upvotes', -1);
    } else {
      // Add upvote (check <100 limit for array performance)
      if (upvotedBy.length >= 100) {
        // Fallback: just increment count, don't track user
        question.increment('upvotes', 1);
      } else {
        upvotedBy.push(user.id);
        question.set('upvotedBy', upvotedBy);
        question.increment('upvotes', 1);
      }
    }

    await question.save(null, { useMasterKey: true });

    return {
      upvotes: question.get('upvotes'),
      userHasUpvoted: !hasUpvoted
    };
  } catch (error) {
    console.error('Error upvoting question:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to upvote question');
  }
});

/**
 * Upvote an answer (toggle on/off)
 *
 * @param {string} questionId - Question object ID (for cache invalidation)
 * @param {string} answerId - Answer object ID
 * @returns {object} { upvotes, userHasUpvoted }
 */
Parse.Cloud.define('upvoteAnswer', async (request) => {
  const { user } = request;
  const { questionId, answerId } = request.params;

  if (!user) {
    throw new Parse.Error(Parse.Error.UNAUTHENTICATED, 'User must be authenticated');
  }

  if (!answerId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'answerId is required');
  }

  try {
    const Answer = Parse.Object.extend('CommunityAnswer');
    const query = new Parse.Query(Answer);
    const answer = await query.get(answerId, { useMasterKey: true });

    const upvotedBy = answer.get('upvotedBy') || [];
    const hasUpvoted = upvotedBy.includes(user.id);

    if (hasUpvoted) {
      // Remove upvote
      answer.set('upvotedBy', upvotedBy.filter(id => id !== user.id));
      answer.increment('upvotes', -1);
    } else {
      // Add upvote (check <100 limit)
      if (upvotedBy.length >= 100) {
        answer.increment('upvotes', 1);
      } else {
        upvotedBy.push(user.id);
        answer.set('upvotedBy', upvotedBy);
        answer.increment('upvotes', 1);
      }
    }

    await answer.save(null, { useMasterKey: true });

    return {
      upvotes: answer.get('upvotes'),
      userHasUpvoted: !hasUpvoted
    };
  } catch (error) {
    console.error('Error upvoting answer:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to upvote answer');
  }
});

// =============================================================================
// COUNSELOR MODERATION FUNCTIONS
// =============================================================================

/**
 * Mark an answer as "Best Answer" (counselor only)
 * Only 1 best answer per question, pinned to top
 *
 * @param {string} questionId - Question object ID
 * @param {string} answerId - Answer object ID
 * @returns {object} Updated question and answer
 */
Parse.Cloud.define('markBestAnswer', async (request) => {
  const { user } = request;
  const { questionId, answerId } = request.params;

  if (!user || user.get('role') !== 'counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors can mark best answers');
  }

  if (!questionId || !answerId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'questionId and answerId are required');
  }

  try {
    // Remove previous best answer
    const Answer = Parse.Object.extend('CommunityAnswer');
    const prevBestQuery = new Parse.Query(Answer);
    prevBestQuery.equalTo('question', {
      __type: 'Pointer',
      className: 'CommunityQuestion',
      objectId: questionId
    });
    prevBestQuery.equalTo('isBestAnswer', true);

    const prevBestAnswer = await prevBestQuery.first({ useMasterKey: true });
    if (prevBestAnswer) {
      prevBestAnswer.set('isBestAnswer', false);
      await prevBestAnswer.save(null, { useMasterKey: true });
    }

    // Set new best answer
    const answerQuery = new Parse.Query(Answer);
    const answer = await answerQuery.get(answerId, { useMasterKey: true });
    answer.set('isBestAnswer', true);
    await answer.save(null, { useMasterKey: true });

    // Update question
    const Question = Parse.Object.extend('CommunityQuestion');
    const questionQuery = new Parse.Query(Question);
    const question = await questionQuery.get(questionId, { useMasterKey: true });
    question.set('hasBestAnswer', true);
    await question.save(null, { useMasterKey: true });

    return { success: true, message: 'Best answer marked successfully' };
  } catch (error) {
    console.error('Error marking best answer:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to mark best answer');
  }
});

/**
 * Verify an answer (counselor only)
 * Adds "Verified by Counselor" badge
 *
 * @param {string} answerId - Answer object ID
 * @param {boolean} isVerified - true to verify, false to unverify
 * @returns {object} Updated answer
 */
Parse.Cloud.define('verifyAnswer', async (request) => {
  const { user } = request;
  const { answerId, isVerified = true } = request.params;

  if (!user || user.get('role') !== 'counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors can verify answers');
  }

  if (!answerId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'answerId is required');
  }

  try {
    const Answer = Parse.Object.extend('CommunityAnswer');
    const query = new Parse.Query(Answer);
    const answer = await query.get(answerId, { useMasterKey: true });

    answer.set('isVerified', isVerified);
    if (isVerified) {
      answer.set('verifiedBy', user);
    } else {
      answer.unset('verifiedBy');
    }

    await answer.save(null, { useMasterKey: true });

    return { success: true, isVerified };
  } catch (error) {
    console.error('Error verifying answer:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to verify answer');
  }
});

/**
 * Pin/unpin a question (counselor only)
 * Pinned questions appear at top of forum
 *
 * @param {string} questionId - Question object ID
 * @param {boolean} isPinned - true to pin, false to unpin
 * @returns {object} Updated question
 */
Parse.Cloud.define('pinQuestion', async (request) => {
  const { user } = request;
  const { questionId, isPinned = true } = request.params;

  if (!user || user.get('role') !== 'counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors can pin questions');
  }

  if (!questionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'questionId is required');
  }

  try {
    const Question = Parse.Object.extend('CommunityQuestion');
    const query = new Parse.Query(Question);
    const question = await query.get(questionId, { useMasterKey: true });

    question.set('isPinned', isPinned);
    await question.save(null, { useMasterKey: true });

    return { success: true, isPinned };
  } catch (error) {
    console.error('Error pinning question:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to pin question');
  }
});

/**
 * Delete a question (soft delete, counselor/admin only)
 *
 * @param {string} questionId - Question object ID
 * @param {string} reason - Reason for deletion
 * @returns {object} Updated question
 */
Parse.Cloud.define('deleteQuestion', async (request) => {
  const { user } = request;
  const { questionId, reason } = request.params;

  const isCounselor = user && user.get('role') === 'counselor';
  const isAdmin = user && user.get('role') === 'admin';

  if (!isCounselor && !isAdmin) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors and admins can delete questions');
  }

  if (!questionId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'questionId is required');
  }

  try {
    const Question = Parse.Object.extend('CommunityQuestion');
    const query = new Parse.Query(Question);
    const question = await query.get(questionId, { useMasterKey: true });

    question.set('isDeleted', true);
    question.set('deletedReason', reason || 'Inappropriate content');
    question.set('deletedBy', user);
    await question.save(null, { useMasterKey: true });

    return { success: true, message: 'Question deleted' };
  } catch (error) {
    console.error('Error deleting question:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to delete question');
  }
});

/**
 * Delete an answer (soft delete, counselor/admin only)
 *
 * @param {string} answerId - Answer object ID
 * @param {string} reason - Reason for deletion
 * @returns {object} Updated answer
 */
Parse.Cloud.define('deleteAnswer', async (request) => {
  const { user } = request;
  const { answerId, reason } = request.params;

  const isCounselor = user && user.get('role') === 'counselor';
  const isAdmin = user && user.get('role') === 'admin';

  if (!isCounselor && !isAdmin) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only counselors and admins can delete answers');
  }

  if (!answerId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'answerId is required');
  }

  try {
    const Answer = Parse.Object.extend('CommunityAnswer');
    const query = new Parse.Query(Answer);
    const answer = await query.get(answerId, { useMasterKey: true });

    answer.set('isDeleted', true);
    answer.set('deletedReason', reason || 'Inappropriate content');
    answer.set('deletedBy', user);
    await answer.save(null, { useMasterKey: true });

    return { success: true, message: 'Answer deleted' };
  } catch (error) {
    console.error('Error deleting answer:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to delete answer');
  }
});

module.exports = {
  // Exported for testing
  rateLimit
};
