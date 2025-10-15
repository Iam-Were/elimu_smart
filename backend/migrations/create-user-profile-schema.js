/**
 * Create UserProject and UserExperience Schemas
 *
 * Creates Parse classes for user profile data:
 * - UserProject: Academic/personal/professional projects
 * - UserExperience: Work/internship/volunteer/leadership experience
 *
 * Run: node backend/migrations/create-user-profile-schema.js [development|staging|production]
 */

const Parse = require('parse/node');
require('dotenv').config();

const environment = process.argv[2] || 'development';

const configs = {
  development: {
    appId: process.env.APP_ID || 'elimu-smart-local-dev',
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY || 'elimu-smart-master-key-dev-change-in-production'
  },
  staging: {
    appId: process.env.APP_ID || 'elimu_smart_app_2024',
    serverURL: 'http://localhost:1338/parse',
    masterKey: process.env.MASTER_KEY || 'CHANGE_THIS_MASTER_KEY'
  },
  production: {
    appId: process.env.APP_ID || 'elimu_smart_app_2024',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY || 'CHANGE_THIS_MASTER_KEY'
  }
};

const config = configs[environment];

if (!config) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.log('Usage: node create-user-profile-schema.js [development|staging|production]');
  process.exit(1);
}

console.log(`🌍 Environment: ${environment}`);
console.log(`🔗 Server URL: ${config.serverURL}\n`);

Parse.initialize(config.appId, null, config.masterKey);
Parse.serverURL = config.serverURL;

async function createUserProjectSchema() {
  try {
    console.log('📋 Creating UserProject schema...\n');

    const schema = new Parse.Schema('UserProject');

    // User reference (pointer to _User)
    schema.addPointer('user', '_User');

    // Project details
    schema.addString('title');
    schema.addString('description');
    schema.addString('type'); // personal, academic, professional
    schema.addString('status'); // in_progress, completed, archived

    // Dates
    schema.addDate('startDate');
    schema.addDate('endDate');

    // Technical details
    schema.addArray('skills'); // Array of skill names
    schema.addArray('technologies'); // Array of technologies used
    schema.addArray('achievements'); // Array of achievement strings

    // Links
    schema.addString('url'); // Live project URL
    schema.addString('repositoryUrl'); // GitHub/GitLab URL
    schema.addString('imageUrl'); // Project screenshot/thumbnail

    // Indexes for performance
    schema.addIndex('user_index', { user: 1 });
    schema.addIndex('user_status_index', { user: 1, status: 1 });

    // Class-Level Permissions
    const classLevelPermissions = {
      find: { requiresAuthentication: true },
      get: { requiresAuthentication: true },
      create: { requiresAuthentication: true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: {},
      protectedFields: {}
    };

    schema.setCLP(classLevelPermissions);

    // Save schema
    await schema.save();

    console.log('✅ UserProject schema created successfully!\n');
    console.log('📊 Schema Details:');
    console.log('   - user (Pointer to _User)');
    console.log('   - title, description, type, status (String)');
    console.log('   - startDate, endDate (Date)');
    console.log('   - skills, technologies, achievements (Array)');
    console.log('   - url, repositoryUrl, imageUrl (String)');
    console.log('\n🔒 Permissions: Authenticated users only');
    console.log('🔍 Indexes: user, user+status\n');

  } catch (error) {
    if (error.code === 103) {
      console.log('⚠️  UserProject class already exists, updating schema...');
      try {
        const schema = new Parse.Schema('UserProject');
        await schema.update();
        console.log('✅ UserProject schema updated successfully!\n');
      } catch (updateError) {
        console.error('❌ Failed to update UserProject schema:', updateError.message);
        throw updateError;
      }
    } else {
      console.error('❌ Failed to create UserProject schema:', error.message);
      throw error;
    }
  }
}

async function createUserExperienceSchema() {
  try {
    console.log('📋 Creating UserExperience schema...\n');

    const schema = new Parse.Schema('UserExperience');

    // User reference (pointer to _User)
    schema.addPointer('user', '_User');

    // Experience details
    schema.addString('title'); // Job title / Role
    schema.addString('company'); // Company name
    schema.addString('organization'); // Organization (for volunteer work)
    schema.addString('type'); // work, internship, volunteer, leadership
    schema.addString('location'); // City, Country or "Remote"
    schema.addString('description'); // Overall description

    // Details
    schema.addArray('responsibilities'); // Array of responsibility strings
    schema.addArray('achievements'); // Array of achievement strings
    schema.addArray('skills'); // Skills gained/used

    // Dates
    schema.addDate('startDate');
    schema.addDate('endDate');
    schema.addBoolean('isCurrent'); // Currently working here

    // Verification
    schema.addString('verificationUrl'); // LinkedIn, certificate URL
    schema.addString('referenceContact'); // Reference person's contact (optional)

    // Indexes for performance
    schema.addIndex('user_index', { user: 1 });
    schema.addIndex('user_type_index', { user: 1, type: 1 });
    schema.addIndex('user_current_index', { user: 1, isCurrent: 1 });

    // Class-Level Permissions
    const classLevelPermissions = {
      find: { requiresAuthentication: true },
      get: { requiresAuthentication: true },
      create: { requiresAuthentication: true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: {},
      protectedFields: {}
    };

    schema.setCLP(classLevelPermissions);

    // Save schema
    await schema.save();

    console.log('✅ UserExperience schema created successfully!\n');
    console.log('📊 Schema Details:');
    console.log('   - user (Pointer to _User)');
    console.log('   - title, company, organization, type, location, description (String)');
    console.log('   - responsibilities, achievements, skills (Array)');
    console.log('   - startDate, endDate (Date)');
    console.log('   - isCurrent (Boolean)');
    console.log('   - verificationUrl, referenceContact (String)');
    console.log('\n🔒 Permissions: Authenticated users only');
    console.log('🔍 Indexes: user, user+type, user+isCurrent\n');

  } catch (error) {
    if (error.code === 103) {
      console.log('⚠️  UserExperience class already exists, updating schema...');
      try {
        const schema = new Parse.Schema('UserExperience');
        await schema.update();
        console.log('✅ UserExperience schema updated successfully!\n');
      } catch (updateError) {
        console.error('❌ Failed to update UserExperience schema:', updateError.message);
        throw updateError;
      }
    } else {
      console.error('❌ Failed to create UserExperience schema:', error.message);
      throw error;
    }
  }
}

async function runMigration() {
  try {
    await createUserProjectSchema();
    await createUserExperienceSchema();

    console.log('✅ All schemas created successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Cloud Functions getUserProjects and getUserExperience are ready');
    console.log('   2. Frontend can now call these functions to fetch user profile data');
    console.log('   3. Consider adding CRUD functions for creating/updating projects and experience\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
