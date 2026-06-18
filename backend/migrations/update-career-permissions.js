/**
 * Migration: Update Career Class Permissions
 *
 * Sets public read access for Career class
 */

require('dotenv').config();
const Parse = require('parse/node');

const environment = process.argv[2] || 'production';

// Parse Server configuration
const parseConfig = {
  production: {
    serverURL: process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse',
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY
  },
  staging: {
    serverURL: process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse',
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY
  }
};

const config = parseConfig[environment];

Parse.initialize(config.appId, null, config.masterKey);
Parse.serverURL = config.serverURL;

async function updateCareerPermissions() {
  console.log(`\n🔧 Updating Career class permissions for ${environment} environment...\n`);

  try {
    // Get existing schema
    const CareerSchema = new Parse.Schema('Career');

    // Set CLPs (Class Level Permissions)
    CareerSchema.setCLP({
      find: { '*': true }, // Everyone can query
      get: { '*': true },  // Everyone can get
      create: { 'role:admin': true }, // Only admins can create
      update: { 'role:admin': true }, // Only admins can update
      delete: { 'role:admin': true }  // Only admins can delete
    });

    await CareerSchema.update();

    console.log('✅ Career class permissions updated successfully');
    console.log('\n📋 New Permissions:');
    console.log('- find: Public (*)');
    console.log('- get: Public (*)');
    console.log('- create: Admin only');
    console.log('- update: Admin only');
    console.log('- delete: Admin only');

    console.log('\n✨ Permission update complete!\n');
    return true;

  } catch (error) {
    console.error('❌ Error updating Career permissions:', error);
    throw error;
  }
}

// Run migration
updateCareerPermissions()
  .then(() => {
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
