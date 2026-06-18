/**
 * Add Career Detail Fields via Parse API (PostgreSQL)
 *
 * This approach uses Parse Cloud Function to add schema fields,
 * bypassing the Node SDK schema authorization issues.
 */

require('dotenv').config();
const Parse = require('parse/node');

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  process.env.JAVASCRIPT_KEY,
  process.env.MASTER_KEY
);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

async function addFieldsViaAPI() {
  console.log('🚀 Adding Career fields via Parse API...\n');

  try {
    // Approach: Create a dummy career object with all new fields
    // Parse will automatically add columns to PostgreSQL when saving new fields

    const CareerClass = Parse.Object.extend('Career');

    // Get any existing career to update
    const query = new Parse.Query(CareerClass);
    query.limit(1);
    const existingCareer = await query.first({ useMasterKey: true });

    if (!existingCareer) {
      console.error('❌ No careers found in database. Run seed-careers.js first.');
      process.exit(1);
    }

    console.log(`✅ Found career: ${existingCareer.get('title')}`);
    console.log('📝 Adding new fields by setting them on existing object...\n');

    // Add all new fields with sample/empty data
    // PostgreSQL will create columns automatically
    existingCareer.set('dailyTasks', existingCareer.get('dailyTasks') || []);
    existingCareer.set('personalityTraits', existingCareer.get('personalityTraits') || []);
    existingCareer.set('careerProgression', existingCareer.get('careerProgression') || '');
    existingCareer.set('kenyaSpecific', existingCareer.get('kenyaSpecific') || {});
    existingCareer.set('educationPath', existingCareer.get('educationPath') || '');
    existingCareer.set('educationLevel', existingCareer.get('educationLevel') || '');
    existingCareer.set('salaryRangeMin', existingCareer.get('salaryRangeMin') || 0);
    existingCareer.set('salaryRangeMax', existingCareer.get('salaryRangeMax') || 0);
    existingCareer.set('keySubjects', existingCareer.get('keySubjects') || []);
    existingCareer.set('minimumGrades', existingCareer.get('minimumGrades') || {});
    existingCareer.set('workEnvironment', existingCareer.get('workEnvironment') || '');
    existingCareer.set('jobOutlook', existingCareer.get('jobOutlook') || '');
    existingCareer.set('industryGrowth', existingCareer.get('industryGrowth') || '');
    existingCareer.set('challenges', existingCareer.get('challenges') || []);
    existingCareer.set('rewards', existingCareer.get('rewards') || []);
    existingCareer.set('relatedCareers', existingCareer.get('relatedCareers') || []);

    // Save - this will create the PostgreSQL columns
    await existingCareer.save(null, { useMasterKey: true });

    console.log('✅ All fields added successfully!');
    console.log('\n📊 PostgreSQL columns created:');
    console.log('   - dailyTasks (jsonb)');
    console.log('   - personalityTraits (jsonb)');
    console.log('   - careerProgression (text)');
    console.log('   - kenyaSpecific (jsonb)');
    console.log('   - educationPath (text)');
    console.log('   - educationLevel (text)');
    console.log('   - salaryRangeMin (numeric)');
    console.log('   - salaryRangeMax (numeric)');
    console.log('   - keySubjects (jsonb)');
    console.log('   - minimumGrades (jsonb)');
    console.log('   - workEnvironment (text)');
    console.log('   - jobOutlook (text)');
    console.log('   - industryGrowth (text)');
    console.log('   - challenges (jsonb)');
    console.log('   - rewards (jsonb)');
    console.log('   - relatedCareers (jsonb)');

    console.log('\n🎯 Next Steps:');
    console.log('   1. Run: node migrations/seed-career-details-complete.js production');
    console.log('   2. Verify in Parse Dashboard');
    console.log('   3. Test Learn More modal');

  } catch (error) {
    console.error('❌ Failed to add fields:', error);
    process.exit(1);
  }
}

// Run
addFieldsViaAPI()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
