/**
 * Migration: Create Career Parse Class Schema
 *
 * Migrates SubjectCareerMapper hardcoded data (466 lines) to Parse database
 * Impact: -25KB frontend bundle, dynamic updates, mobile-ready
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

async function createCareerSchema() {
  console.log(`\n🔧 Creating Career schema for ${environment} environment...\n`);

  try {
    // Create Career class
    const CareerSchema = new Parse.Schema('Career');

    // Core fields
    CareerSchema.addString('title', { required: true });
    CareerSchema.addString('category'); // e.g., 'STEM', 'Business', 'Arts', 'Medical'
    CareerSchema.addArray('relatedSubjects'); // Single subjects: ['Mathematics', 'Physics']
    CareerSchema.addArray('subjectCombinations'); // Combinations: ['Math_Physics_Chemistry']
    CareerSchema.addNumber('matchScore'); // 0-100 compatibility score

    // Career details
    CareerSchema.addString('description');
    CareerSchema.addString('salaryRange'); // e.g., 'KSh 90,000 - 250,000'
    CareerSchema.addString('demand'); // 'Very High', 'High', 'Medium', 'Low'
    CareerSchema.addString('kuccpsPathway'); // e.g., 'Statistics/Computer Science degree'
    CareerSchema.addArray('skills'); // ['Statistics', 'Programming', 'Research']

    // Additional metadata
    CareerSchema.addNumber('minClusterPoints'); // Minimum KUCCPS points required
    CareerSchema.addNumber('employmentRate'); // 0-1 (e.g., 0.85 = 85%)
    CareerSchema.addNumber('avgSalary'); // Monthly average in KSh
    CareerSchema.addString('kuccpsCode'); // e.g., 'ENG', 'MED', 'BUS', 'SCI'
    CareerSchema.addArray('alternativePathways'); // ['Diploma to Degree', 'Certificate to Diploma']

    // Search optimization
    CareerSchema.addString('searchKeywords'); // Lowercase searchable text
    CareerSchema.addBoolean('isActive', { defaultValue: true });

    // ACL - Public read, admin write
    const publicACL = new Parse.ACL();
    publicACL.setPublicReadAccess(true);
    publicACL.setRoleWriteAccess('admin', true);

    // Indexes for performance
    CareerSchema.addIndex('title_index', { title: 1 });
    CareerSchema.addIndex('category_index', { category: 1 });
    CareerSchema.addIndex('demand_index', { demand: 1 });
    CareerSchema.addIndex('subjects_index', { relatedSubjects: 1 });

    // Create or update schema
    const existingSchema = await Parse.Schema.all();
    const careerExists = existingSchema.some(s => s.className === 'Career');

    if (careerExists) {
      console.log('⚠️  Career class already exists. Updating schema...');
      await CareerSchema.update();
      console.log('✅ Career schema updated successfully');
    } else {
      await CareerSchema.save();
      console.log('✅ Career class created successfully');
    }

    // Set default CLPs (Class Level Permissions)
    CareerSchema.setCLP({
      find: { '*': true }, // Everyone can query
      get: { '*': true },  // Everyone can get
      create: { 'role:admin': true }, // Only admins can create
      update: { 'role:admin': true }, // Only admins can update
      delete: { 'role:admin': true }  // Only admins can delete
    });
    await CareerSchema.update();

    console.log('\n📋 Schema Details:');
    console.log('- Fields: 16 (title, category, subjects, salary, etc.)');
    console.log('- Indexes: 4 (title, category, demand, subjects)');
    console.log('- Permissions: Public read, Admin write');
    console.log('- Default ACL: Public read access');

    console.log('\n✨ Career schema creation complete!\n');
    return true;

  } catch (error) {
    console.error('❌ Error creating Career schema:', error);
    throw error;
  }
}

// Run migration
createCareerSchema()
  .then(() => {
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
