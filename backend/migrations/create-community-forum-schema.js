/**
 * Migration: Create Community Forum Schema
 *
 * Creates CommunityQuestion and CommunityAnswer tables for Reddit-style Q&A forum
 *
 * Features:
 * - 2-level nesting (Question → Answer → Reply to answer)
 * - Upvoting system with user tracking (<100 users)
 * - Counselor moderation (best answer, verify, pin, delete)
 * - Always show real names (no anonymity)
 * - Optimized indexes for pagination and search
 *
 * Run: node backend/migrations/create-community-forum-schema.js
 */

const Parse = require('parse/node');

// Initialize Parse
Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  null, // JavaScript key (not needed for Node.js)
  process.env.PARSE_MASTER_KEY || 'elimu_smart_master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

async function createCommunityForumSchema() {
  console.log('🚀 Starting Community Forum schema creation...\n');

  try {
    // 1. Create CommunityQuestion Schema
    console.log('1️⃣ Creating CommunityQuestion table...');
    const CommunityQuestion = new Parse.Schema('CommunityQuestion');

    CommunityQuestion
      // Content fields
      .addString('title', { required: true })
      .addString('question', { required: true })
      .addString('category', { required: true }) // 'career', 'academic', 'university', 'personal'

      // Author fields (always show names - no anonymity)
      .addPointer('askedBy', '_User', { required: true })
      .addString('askedByName', { required: true })

      // Engagement fields
      .addNumber('upvotes', { defaultValue: 0 })
      .addArray('upvotedBy') // Array of user IDs (keep <100 per best practices)
      .addNumber('viewCount', { defaultValue: 0 })
      .addNumber('answerCount', { defaultValue: 0 }) // Denormalized count for performance

      // Status fields
      .addString('status', { defaultValue: 'open' }) // 'open', 'answered', 'closed'
      .addBoolean('hasBestAnswer', { defaultValue: false })
      .addBoolean('isPinned', { defaultValue: false }) // Counselor can pin important questions
      .addBoolean('isDeleted', { defaultValue: false })
      .addString('deletedReason')
      .addPointer('deletedBy', '_User')

      // Timestamps
      .addDate('lastActivityAt'); // For sorting by recent activity (updated on new answers)

    await CommunityQuestion.save({ useMasterKey: true });
    console.log('✅ CommunityQuestion table created\n');

    // 2. Create CommunityAnswer Schema
    console.log('2️⃣ Creating CommunityAnswer table...');
    const CommunityAnswer = new Parse.Schema('CommunityAnswer');

    CommunityAnswer
      // Relationship fields
      .addPointer('question', 'CommunityQuestion', { required: true })
      .addPointer('parentAnswer', 'CommunityAnswer') // For nested replies (2-level max)

      // Content field
      .addString('answer', { required: true })

      // Author fields
      .addPointer('answeredBy', '_User', { required: true })
      .addString('answeredByName', { required: true })
      .addBoolean('isCounselor', { defaultValue: false }) // Show counselor badge

      // Engagement fields
      .addNumber('upvotes', { defaultValue: 0 })
      .addArray('upvotedBy') // Array of user IDs (<100 limit)

      // Moderation fields (counselor powers)
      .addBoolean('isBestAnswer', { defaultValue: false }) // Only 1 per question, pinned to top
      .addBoolean('isVerified', { defaultValue: false }) // Verified by counselor badge
      .addPointer('verifiedBy', '_User') // Which counselor verified
      .addBoolean('isDeleted', { defaultValue: false })
      .addString('deletedReason')
      .addPointer('deletedBy', '_User')

      // Nesting level
      .addNumber('depth', { defaultValue: 0 }); // 0=top-level answer, 1=reply to answer, 2=max depth

    await CommunityAnswer.save({ useMasterKey: true });
    console.log('✅ CommunityAnswer table created\n');

    // 3. Add Indexes for Performance
    console.log('3️⃣ Adding indexes for query performance...');

    // CommunityQuestion indexes
    console.log('  - Adding CommunityQuestion indexes...');
    await Parse.Cloud.httpRequest({
      method: 'POST',
      url: `${Parse.serverURL}/schemas/CommunityQuestion`,
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': Parse.masterKey,
        'Content-Type': 'application/json',
      },
      body: {
        indexes: {
          // Category + recent activity (for filtered lists)
          category_activity: { category: 1, lastActivityAt: -1 },
          // Popular sorting
          popular: { upvotes: -1, createdAt: -1 },
          // Status filtering
          status: { status: 1, isPinned: -1 },
          // Pinned questions (show first)
          pinned_date: { isPinned: -1, createdAt: -1 }
        }
      }
    });

    // CommunityAnswer indexes
    console.log('  - Adding CommunityAnswer indexes...');
    await Parse.Cloud.httpRequest({
      method: 'POST',
      url: `${Parse.serverURL}/schemas/CommunityAnswer`,
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': Parse.masterKey,
        'Content-Type': 'application/json',
      },
      body: {
        indexes: {
          // Question + score (top answers per question)
          question_score: { question: 1, upvotes: -1 },
          // Nested replies
          parent_depth: { question: 1, parentAnswer: 1, depth: 1 },
          // Best answer lookup
          best_answer: { question: 1, isBestAnswer: -1 }
        }
      }
    });

    console.log('✅ Indexes created\n');

    // 4. Set Class Level Permissions
    console.log('4️⃣ Setting Class Level Permissions...');

    // CommunityQuestion CLPs
    const questionCLP = {
      get: { '*': true }, // Public read
      find: { '*': true }, // Public find
      create: { 'role:student': true, 'role:counselor': true }, // Authenticated users
      update: { requiresAuthentication: true }, // Only author or counselor
      delete: { 'role:counselor': true, 'role:admin': true }, // Only counselors/admins
      addField: {}
    };

    await Parse.Cloud.httpRequest({
      method: 'PUT',
      url: `${Parse.serverURL}/schemas/CommunityQuestion`,
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': Parse.masterKey,
        'Content-Type': 'application/json',
      },
      body: {
        classLevelPermissions: questionCLP
      }
    });

    // CommunityAnswer CLPs
    const answerCLP = {
      get: { '*': true }, // Public read
      find: { '*': true }, // Public find
      create: { 'role:student': true, 'role:counselor': true }, // Authenticated users
      update: { requiresAuthentication: true }, // Only author or counselor
      delete: { 'role:counselor': true, 'role:admin': true }, // Only counselors/admins
      addField: {}
    };

    await Parse.Cloud.httpRequest({
      method: 'PUT',
      url: `${Parse.serverURL}/schemas/CommunityAnswer`,
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': Parse.masterKey,
        'Content-Type': 'application/json',
      },
      body: {
        classLevelPermissions: answerCLP
      }
    });

    console.log('✅ Class Level Permissions set\n');

    console.log('🎉 Community Forum schema created successfully!');
    console.log('\nNext steps:');
    console.log('1. Implement cloud functions in backend/cloud/communityForumFunctions.js');
    console.log('2. Update frontend CommunityQA.tsx to use new schema');
    console.log('3. Test with seed data');
    console.log('4. Deploy to production\n');

  } catch (error) {
    console.error('❌ Error creating schema:', error);
    throw error;
  }
}

// Run migration
createCommunityForumSchema()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
