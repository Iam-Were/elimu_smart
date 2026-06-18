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
    appId: process.env.APP_ID || 'elimu-smart-production',
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY
  },
  staging: {
    appId: process.env.APP_ID || 'elimu-smart-production',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY || 'CHANGE_THIS_MASTER_KEY'
  },
  production: {
    appId: process.env.APP_ID || 'elimu-smart-production',
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

// Helper function to create or update schema with error handling
async function createOrUpdateSchema(className, schemaBuilder, schemaDetails) {
  try {
    console.log(`📋 Creating ${className} schema...\n`);
    
    const schema = new Parse.Schema(className);
    schemaBuilder(schema);
    
    // Class-Level Permissions (same for all schemas)
    schema.setCLP({
      find: { requiresAuthentication: true },
      get: { requiresAuthentication: true },
      create: { requiresAuthentication: true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: {},
      protectedFields: {}
    });
    
    await schema.save();
    
    console.log(`✅ ${className} schema created successfully!\n`);
    console.log('📊 Schema Details:');
    schemaDetails.forEach(detail => console.log(`   ${detail}`));
    console.log('\n🔒 Permissions: Authenticated users only\n');
    
  } catch (error) {
    if (error.code === 103) {
      console.log(`⚠️  ${className} class already exists, updating schema...`);
      try {
        const schema = new Parse.Schema(className);
        await schema.update();
        console.log(`✅ ${className} schema updated successfully!\n`);
      } catch (updateError) {
        console.error(`❌ Failed to update ${className} schema:`, updateError.message);
        throw updateError;
      }
    } else {
      console.error(`❌ Failed to create ${className} schema:`, error.message);
      throw error;
    }
  }
}

async function createUserProjectSchema() {
  return createOrUpdateSchema(
    'UserProject',
    (schema) => {
      schema.addPointer('user', '_User');
      schema.addString('title');
      schema.addString('description');
      schema.addString('type');
      schema.addString('status');
      schema.addDate('startDate');
      schema.addDate('endDate');
      schema.addArray('skills');
      schema.addArray('technologies');
      schema.addArray('achievements');
      schema.addString('url');
      schema.addString('repositoryUrl');
      schema.addString('imageUrl');
      schema.addIndex('user_index', { user: 1 });
      schema.addIndex('user_status_index', { user: 1, status: 1 });
    },
    [
      '- user (Pointer to _User)',
      '- title, description, type, status (String)',
      '- startDate, endDate (Date)',
      '- skills, technologies, achievements (Array)',
      '- url, repositoryUrl, imageUrl (String)',
      '🔍 Indexes: user, user+status'
    ]
  );
}

async function createUserExperienceSchema() {
  return createOrUpdateSchema(
    'UserExperience',
    (schema) => {
      schema.addPointer('user', '_User');
      schema.addString('title');
      schema.addString('company');
      schema.addString('organization');
      schema.addString('type');
      schema.addString('location');
      schema.addString('description');
      schema.addArray('responsibilities');
      schema.addArray('achievements');
      schema.addArray('skills');
      schema.addDate('startDate');
      schema.addDate('endDate');
      schema.addBoolean('isCurrent');
      schema.addString('verificationUrl');
      schema.addString('referenceContact');
      schema.addIndex('user_index', { user: 1 });
      schema.addIndex('user_type_index', { user: 1, type: 1 });
      schema.addIndex('user_current_index', { user: 1, isCurrent: 1 });
    },
    [
      '- user (Pointer to _User)',
      '- title, company, organization, type, location, description (String)',
      '- responsibilities, achievements, skills (Array)',
      '- startDate, endDate (Date), isCurrent (Boolean)',
      '- verificationUrl, referenceContact (String)',
      '🔍 Indexes: user, user+type, user+isCurrent'
    ]
  );
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
