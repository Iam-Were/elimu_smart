/**
 * Initialize Assessment Schema on Parse Server
 * Creates AssessmentResult, RiasecQuestion, and SkillQuestion classes with proper permissions
 */

const Parse = require('parse/node');
require('dotenv').config({ path: '../.env' });

// Initialize Parse
Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

async function initializeSchema() {
  console.log('🔧 Initializing Assessment Schema...\n');

  try {
    // 1. Create AssessmentResult class
    console.log('📝 Creating AssessmentResult class...');
    const AssessmentResult = Parse.Object.extend('AssessmentResult');
    const testResult = new AssessmentResult();
    testResult.set('user', Parse.User.current() || { __type: 'Pointer', className: '_User', objectId: 'placeholder' });
    testResult.set('assessmentType', 'test');
    testResult.set('responses', {});
    testResult.set('scores', {});
    testResult.set('results', {});
    testResult.set('completedAt', new Date());
    testResult.set('isActive', true);
    
    try {
      await testResult.save(null, { useMasterKey: true });
      console.log('✅ AssessmentResult class created');
      await testResult.destroy({ useMasterKey: true });
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  AssessmentResult class already exists');
      } else {
        throw error;
      }
    }

    // 2. Create RiasecQuestion class
    console.log('📝 Creating RiasecQuestion class...');
    const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
    const testRiasec = new RiasecQuestion();
    testRiasec.set('questionId', 0);
    testRiasec.set('category', 'test');
    testRiasec.set('statement', 'Test question');
    testRiasec.set('riasecType', 'R');
    testRiasec.set('isActive', false);
    
    try {
      await testRiasec.save(null, { useMasterKey: true });
      console.log('✅ RiasecQuestion class created');
      await testRiasec.destroy({ useMasterKey: true });
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  RiasecQuestion class already exists');
      } else {
        throw error;
      }
    }

    // 3. Create SkillQuestion class
    console.log('📝 Creating SkillQuestion class...');
    const SkillQuestion = Parse.Object.extend('SkillQuestion');
    const testSkill = new SkillQuestion();
    testSkill.set('questionId', 0);
    testSkill.set('text', 'Test question');
    testSkill.set('category', 'test');
    testSkill.set('isActive', false);
    
    try {
      await testSkill.save(null, { useMasterKey: true });
      console.log('✅ SkillQuestion class created');
      await testSkill.destroy({ useMasterKey: true });
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  SkillQuestion class already exists');
      } else {
        throw error;
      }
    }

    // 4. Set Class-Level Permissions for AssessmentResult
    console.log('\n🔐 Setting Class-Level Permissions...');
    
    const schema = new Parse.Schema('AssessmentResult');
    try {
      await schema.get({ useMasterKey: true });
      
      // Set CLP: requiresAuthentication for all operations
      await schema.setCLP({
        find: { requiresAuthentication: true },
        get: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: {},
        protectedFields: {
          '*': []
        }
      }).update({ useMasterKey: true });
      
      console.log('✅ AssessmentResult permissions set (requiresAuthentication)');
    } catch (error) {
      console.log('⚠️  Could not update permissions:', error.message);
    }

    console.log('\n✅ Schema initialization complete!');
    console.log('\nYou can now:');
    console.log('  1. View classes in Parse Dashboard');
    console.log('  2. Test getUserSkills function');
    console.log('  3. Save assessment results');
    
  } catch (error) {
    console.error('\n❌ Error initializing schema:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeSchema()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
