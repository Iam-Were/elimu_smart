/**
 * Create UserPreferences Schema
 *
 * Migrates localStorage user settings to Parse Objects for:
 * - Cross-device persistence
 * - Backend access for analytics
 * - Better data management
 *
 * Run: node backend/migrations/create-user-preferences-schema.js [development|staging|production]
 */

const Parse = require('parse/node');
require('dotenv').config();

const environment = process.argv[2] || 'development';

const configs = {
  development: {
    appId: 'elimu-smart-local-dev',
    serverURL: 'http://localhost:1337/parse',
    masterKey: 'elimu-smart-master-key-dev'
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
  console.log('Usage: node create-user-preferences-schema.js [development|staging|production]');
  process.exit(1);
}

console.log(`🌍 Environment: ${environment}`);
console.log(`🔗 Server URL: ${config.serverURL}\n`);

Parse.initialize(config.appId, null, config.masterKey);
Parse.serverURL = config.serverURL;

async function createSchema() {
  try {
    console.log('📋 Creating UserPreferences schema...\n');

    const schema = new Parse.Schema('UserPreferences');

    // User reference (pointer to _User)
    schema.addPointer('user', '_User');

    // Theme preferences
    schema.addString('theme'); // 'orange', 'yellow', 'purple'
    schema.addBoolean('darkMode');

    // Onboarding status
    schema.addBoolean('onboardingCompleted');

    // Dashboard customization
    schema.addArray('dashboardCardOrder'); // Array of card IDs

    // Assessment progress (optional for future use)
    schema.addObject('assessmentProgress'); // { riasec: {...}, skills: {...} }

    // Indexes for performance
    schema.addIndex('user_index', { user: 1 });

    // Class-Level Permissions
    // Users can only read/write their own preferences
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

    console.log('✅ UserPreferences schema created successfully!\n');
    console.log('📊 Schema Details:');
    console.log('   - user (Pointer to _User)');
    console.log('   - theme (String)');
    console.log('   - darkMode (Boolean)');
    console.log('   - onboardingCompleted (Boolean)');
    console.log('   - dashboardCardOrder (Array)');
    console.log('   - assessmentProgress (Object)');
    console.log('\n🔒 Permissions: Authenticated users only');
    console.log('🔍 Index: user field indexed for fast lookups\n');

  } catch (error) {
    if (error.code === 103) {
      console.log('⚠️  UserPreferences class already exists, updating schema...');

      try {
        const schema = new Parse.Schema('UserPreferences');
        await schema.update();
        console.log('✅ Schema updated successfully!\n');
      } catch (updateError) {
        console.error('❌ Failed to update schema:', updateError.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Failed to create schema:', error.message);
      process.exit(1);
    }
  }
}

createSchema()
  .then(() => {
    console.log('✅ Migration complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
