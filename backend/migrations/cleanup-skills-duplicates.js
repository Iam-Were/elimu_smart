/**
 * Cleanup Duplicate Skills Questions
 * Removes duplicate SkillQuestion entries, keeping the oldest one
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  'javascript_key_2024',
  process.env.MASTER_KEY ?? (() => { throw new Error('MASTER_KEY env var is required'); })()
);
Parse.serverURL = 'http://localhost:1337/parse';

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate Skills questions...\n');

  try {
    const SkillQuestion = Parse.Object.extend('SkillQuestion');

    // Get all questions sorted by questionId and createdAt
    const allQuery = new Parse.Query(SkillQuestion);
    allQuery.ascending('questionId');
    allQuery.ascending('createdAt');
    allQuery.limit(1000);

    const allQuestions = await allQuery.find({ useMasterKey: true });
    console.log(`Total questions found: ${allQuestions.length}`);

    const seen = new Set();
    const toDelete = [];

    // Find duplicates (keep first occurrence)
    for (const question of allQuestions) {
      const qId = question.get('questionId');

      if (seen.has(qId)) {
        toDelete.push(question);
      } else {
        seen.add(qId);
      }
    }

    console.log(`Unique questions: ${seen.size}`);
    console.log(`Duplicates to delete: ${toDelete.length}\n`);

    if (toDelete.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    // Delete duplicates
    console.log('Deleting duplicates...');
    for (const question of toDelete) {
      await question.destroy({ useMasterKey: true });
    }

    console.log(`✅ Deleted ${toDelete.length} duplicate questions`);

    // Verify cleanup
    const finalQuery = new Parse.Query(SkillQuestion);
    const finalCount = await finalQuery.count({ useMasterKey: true });
    console.log(`\n🔍 Final count: ${finalCount} questions\n`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  }
}

// Run cleanup
if (require.main === module) {
  cleanupDuplicates()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { cleanupDuplicates };
