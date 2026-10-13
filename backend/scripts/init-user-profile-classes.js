/**
 * Initialize UserProject and UserExperience Parse Classes
 * Parse Server with PostgreSQL automatically creates tables when first object is saved
 * This script creates sample objects to initialize the schema
 */

const Parse = require('parse/node');

// Initialize Parse
Parse.initialize(
  'elimu-smart-production',
  null,
  process.env.MASTER_KEY ?? (() => { throw new Error('MASTER_KEY env var is required'); })()
);
Parse.serverURL = 'http://localhost:1337/parse';

async function initializeUserProfileClasses() {
  try {
    console.log('🔧 Initializing UserProject and UserExperience classes...');

    // Get a test user (first user in database)
    const userQuery = new Parse.Query(Parse.User);
    userQuery.limit(1);
    const testUser = await userQuery.first({ useMasterKey: true });

    if (!testUser) {
      console.log('⚠️  No users found. Create a user first before running this script.');
      return;
    }

    // Initialize UserProject class
    const UserProject = Parse.Object.extend('UserProject');
    const sampleProject = new UserProject();
    sampleProject.set('user', testUser);
    sampleProject.set('name', 'Sample Project');
    sampleProject.set('description', 'This is a sample project to initialize the schema');
    sampleProject.set('startDate', new Date());
    sampleProject.set('endDate', null);
    sampleProject.set('technologies', ['React', 'Node.js']);
    sampleProject.set('url', 'https://example.com');
    await sampleProject.save(null, { useMasterKey: true });
    console.log('✅ UserProject class initialized');

    // Initialize UserExperience class
    const UserExperience = Parse.Object.extend('UserExperience');
    const sampleExperience = new UserExperience();
    sampleExperience.set('user', testUser);
    sampleExperience.set('title', 'Sample Position');
    sampleExperience.set('organization', 'Sample Company');
    sampleExperience.set('description', 'This is a sample experience to initialize the schema');
    sampleExperience.set('startDate', new Date());
    sampleExperience.set('endDate', null);
    sampleExperience.set('location', 'Nairobi, Kenya');
    sampleExperience.set('type', 'internship'); // internship, volunteer, part-time, full-time
    await sampleExperience.save(null, { useMasterKey: true });
    console.log('✅ UserExperience class initialized');

    console.log('✅ All user profile classes initialized successfully!');
    console.log('📋 Parse Server has automatically created PostgreSQL tables:');
    console.log('   - UserProject');
    console.log('   - UserExperience');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing classes:', error);
    process.exit(1);
  }
}

initializeUserProfileClasses();
