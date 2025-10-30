/**
 * Career Schema Migration Cloud Function
 *
 * This function runs server-side with automatic master key access,
 * bypassing client-side authorization issues.
 *
 * Approach: Save an existing Career object with all 16 new fields.
 * PostgreSQL will automatically create the columns.
 */

Parse.Cloud.define('migrateCareerSchema', async (request) => {
  try {
    console.log('🚀 Starting Career Schema Migration via Cloud Function...');

    // Get any existing career
    const query = new Parse.Query('Career');
    query.limit(1);
    const existingCareer = await query.first({ useMasterKey: true });

    if (!existingCareer) {
      throw new Error('No careers found in database. Run seed-careers.js first.');
    }

    console.log(`✅ Found career: ${existingCareer.get('title')}`);
    console.log('📝 Adding new fields to trigger PostgreSQL schema update...');

    // Add all 16 new fields with empty/default values
    // PostgreSQL will create columns automatically on save
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

    // Save - PostgreSQL creates columns automatically
    await existingCareer.save(null, { useMasterKey: true });

    console.log('✅ Schema migration complete! PostgreSQL columns created.');

    return {
      success: true,
      message: 'Career schema updated successfully',
      careerUpdated: existingCareer.get('title'),
      fieldsAdded: 16
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
});
