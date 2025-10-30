/**
 * Migration: Add Career Details Fields for Mobile Readiness
 *
 * This migration adds 16 comprehensive fields to the Career class to support
 * mobile development and complete "Learn More" and "Plan Path" features.
 *
 * Critical Fields (8):
 * - dailyTasks: Array of day-to-day responsibilities
 * - personalityTraits: Array of personality fit indicators
 * - careerProgression: Career advancement path description
 * - kenyaSpecific: Object with majorEmployers and universities
 * - educationPath: Education foundation description
 * - educationLevel: Required education level (Bachelor's, Master's, etc.)
 * - salaryRangeMin: Minimum salary in KSh (replaces string parsing)
 * - salaryRangeMax: Maximum salary in KSh (replaces string parsing)
 *
 * Enhanced Fields (8):
 * - keySubjects: Array of important KCSE subjects
 * - minimumGrades: Object with subject grade requirements
 * - workEnvironment: Work setting description
 * - jobOutlook: Future job market outlook
 * - industryGrowth: Industry growth rate percentage
 * - challenges: Array of career challenges
 * - rewards: Array of career benefits/rewards
 * - relatedCareers: Array of similar career paths
 *
 * Usage:
 *   node backend/migrations/add-career-details-schema.js
 */

const Parse = require('parse/node');
require('dotenv').config();

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu_smart_app_2024',
  process.env.JAVASCRIPT_KEY,
  process.env.MASTER_KEY
);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

async function addCareerDetailsSchema() {
  console.log('🚀 Starting Career Details Schema Migration...\n');

  try {
    // Get the Career schema
    const schema = new Parse.Schema('Career');

    console.log('✅ Updating Career schema with new fields...\n');

    // CRITICAL FIELDS (Priority 1 & 2)

    console.log('📝 Adding Critical Fields...');

    // Daily tasks - what professionals do day-to-day
    schema.addArray('dailyTasks');
    console.log('  ✓ dailyTasks (Array)');

    // Personality traits that fit this career
    schema.addArray('personalityTraits');
    console.log('  ✓ personalityTraits (Array)');

    // Career progression path from entry to executive
    schema.addString('careerProgression');
    console.log('  ✓ careerProgression (String)');

    // Kenya-specific information (employers, universities)
    schema.addObject('kenyaSpecific');
    console.log('  ✓ kenyaSpecific (Object)');

    // Education foundation and pathway
    schema.addString('educationPath');
    console.log('  ✓ educationPath (String)');

    // Required education level
    schema.addString('educationLevel');
    console.log('  ✓ educationLevel (String)');

    // Salary range as numbers (for filtering/sorting)
    schema.addNumber('salaryRangeMin');
    console.log('  ✓ salaryRangeMin (Number)');

    schema.addNumber('salaryRangeMax');
    console.log('  ✓ salaryRangeMax (Number)');

    // ENHANCED FIELDS (Phase 2)

    console.log('\n📝 Adding Enhanced Fields...');

    // Key KCSE subjects for this career
    schema.addArray('keySubjects');
    console.log('  ✓ keySubjects (Array)');

    // Minimum grade requirements
    schema.addObject('minimumGrades');
    console.log('  ✓ minimumGrades (Object)');

    // Work environment description
    schema.addString('workEnvironment');
    console.log('  ✓ workEnvironment (String)');

    // Job market outlook
    schema.addString('jobOutlook');
    console.log('  ✓ jobOutlook (String)');

    // Industry growth rate
    schema.addString('industryGrowth');
    console.log('  ✓ industryGrowth (String)');

    // Career challenges
    schema.addArray('challenges');
    console.log('  ✓ challenges (Array)');

    // Career rewards
    schema.addArray('rewards');
    console.log('  ✓ rewards (Array)');

    // Related career paths
    schema.addArray('relatedCareers');
    console.log('  ✓ relatedCareers (Array)');

    // Update the schema with master key
    await schema.update({ useMasterKey: true });

    console.log('\n✅ Career Details Schema Migration Complete!');
    console.log('\n📊 Summary:');
    console.log('   - 8 Critical fields added (Learn More + Plan Path)');
    console.log('   - 8 Enhanced fields added (Comprehensive profiles)');
    console.log('   - Total new fields: 16');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Run: node backend/migrations/seed-career-details-complete.js');
    console.log('   2. Verify in Parse Dashboard: Career class');
    console.log('   3. Test API: getCareerDetails Cloud Function');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
addCareerDetailsSchema()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
