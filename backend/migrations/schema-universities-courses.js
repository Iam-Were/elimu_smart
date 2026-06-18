/**
 * Schema Initialization: Universities & Courses
 *
 * Creates Parse Class schemas for:
 * - University (21 fields)
 * - Course (24 fields)
 *
 * Run this BEFORE migrating data
 * Usage: node backend/migrations/schema-universities-courses.js
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse with production credentials
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  'javascript_key_2024', // JS key not needed for Node.js
  process.env.MASTER_KEY || 'master_key_2024'
);
// Use localhost since we're running on the same machine
Parse.serverURL = 'http://localhost:1337/parse';

/**
 * University Parse Class Schema
 *
 * Stores Kenya university/college information
 */
const UniversitySchema = {
  className: 'University',
  fields: {
    // Core identification
    universityId: { type: 'String', required: true },        // e.g., 'uon', 'jkuat'
    name: { type: 'String', required: true },                // Full university name
    shortName: { type: 'String', required: false },          // Abbreviation (e.g., 'UoN')

    // Classification
    type: { type: 'String', required: true },                // 'public', 'private', 'constituent'
    category: { type: 'String', required: false },           // 'university', 'technical', 'college'

    // Location
    location: { type: 'String', required: true },            // Primary campus location
    county: { type: 'String', required: false },             // Kenya county
    region: { type: 'String', required: false },             // 'Nairobi', 'Coast', 'Rift Valley', etc.

    // KUCCPS Integration
    kuccpsCode: { type: 'String', required: true },          // KUCCPS institution code
    kuccpsEnabled: { type: 'Boolean', required: true },      // Accepts KUCCPS placements

    // Contact & Links
    website: { type: 'String', required: false },            // Official website
    email: { type: 'String', required: false },              // Admissions email
    phone: { type: 'String', required: false },              // Contact phone

    // Accreditation
    accredited: { type: 'Boolean', required: true },         // CUE accreditation status
    accreditationBody: { type: 'String', required: false },  // 'CUE', 'TVET', etc.

    // Metrics
    ranking: { type: 'Number', required: false },            // National ranking
    establishedYear: { type: 'Number', required: false },    // Year founded
    studentPopulation: { type: 'Number', required: false },  // Total students

    // Metadata
    description: { type: 'String', required: false },        // Brief description
    logoUrl: { type: 'String', required: false },            // University logo
    active: { type: 'Boolean', required: true },             // Currently accepting students
  },
  classLevelPermissions: {
    find: { '*': true },
    get: { '*': true },
    create: { requiresAuthentication: true },
    update: { requiresAuthentication: true },
    delete: { requiresAuthentication: true },
    addField: {},
    protectedFields: {}
  },
  indexes: {
    universityId: { universityId: 1 },
    kuccpsCode: { kuccpsCode: 1 },
    type: { type: 1 },
    location: { location: 1 },
    active: { active: 1 },
    name_text: { name: 'text' }
  }
};

/**
 * Course Parse Class Schema
 *
 * Stores university programs/courses with admission requirements
 */
const CourseSchema = {
  className: 'Course',
  fields: {
    // Core identification
    courseId: { type: 'String', required: true },            // e.g., 'medicine', 'computer-science'
    name: { type: 'String', required: true },                // Full course name

    // University relationship
    university: { type: 'Pointer', targetClass: 'University', required: true },
    universityId: { type: 'String', required: true },        // Denormalized for filtering

    // KUCCPS Integration
    kuccpsCode: { type: 'String', required: true },          // KUCCPS program code
    cutoffPoints: { type: 'Number', required: true },        // Minimum cluster points

    // Program details
    duration: { type: 'String', required: true },            // e.g., '4 years', '6 years'
    qualification: { type: 'String', required: false },      // 'Bachelor', 'Diploma', 'Certificate'
    faculty: { type: 'String', required: false },            // Faculty/school
    department: { type: 'String', required: false },         // Department

    // Admission requirements
    subjects: { type: 'Array', required: true },             // Required subjects
    minimumGrade: { type: 'String', required: false },       // Overall minimum (e.g., 'C+')
    subjectGrades: { type: 'Object', required: false },      // Specific subject grades

    // Career outcomes
    careerOutcomes: { type: 'Array', required: true },       // Potential careers
    averageSalary: { type: 'Number', required: false },      // Monthly average (KES)
    employmentRate: { type: 'Number', required: false },     // 0.0 - 1.0

    // Financial
    annualFees: { type: 'Number', required: true },          // Annual fees (KES)
    totalCost: { type: 'Number', required: false },          // Total program cost
    scholarships: { type: 'Array', required: false },        // Available scholarships

    // Metadata
    description: { type: 'String', required: false },        // Course description
    active: { type: 'Boolean', required: true },             // Currently offered
    intakeMonths: { type: 'Array', required: false },        // Admission months

    // SEO & Search
    keywords: { type: 'Array', required: false },            // Search keywords
    popularityScore: { type: 'Number', required: false },    // 0-100
  },
  classLevelPermissions: {
    find: { '*': true },
    get: { '*': true },
    create: { requiresAuthentication: true },
    update: { requiresAuthentication: true },
    delete: { requiresAuthentication: true },
    addField: {},
    protectedFields: {}
  },
  indexes: {
    courseId: { courseId: 1 },
    universityId: { universityId: 1 },
    kuccpsCode: { kuccpsCode: 1 },
    cutoffPoints: { cutoffPoints: -1 },
    annualFees: { annualFees: 1 },
    active: { active: 1 },
    university: { university: 1 },
    name_text: { name: 'text' }
  }
};

/**
 * Create Parse Class Schema
 */
async function createSchema(schemaDefinition) {
  const schema = new Parse.Schema(schemaDefinition.className);

  console.log(`\n📋 Creating schema: ${schemaDefinition.className}`);

  try {
    // Check if schema already exists
    const existingSchema = await schema.get().catch(() => null);

    if (existingSchema) {
      console.log(`⚠️  Schema ${schemaDefinition.className} already exists`);
      console.log('   Updating existing schema...');

      // Update existing schema with new fields
      Object.entries(schemaDefinition.fields).forEach(([fieldName, fieldDef]) => {
        try {
          if (fieldDef.type === 'Pointer') {
            schema.addPointer(fieldName, fieldDef.targetClass);
          } else if (fieldDef.type === 'Array') {
            schema.addArray(fieldName);
          } else if (fieldDef.type === 'Object') {
            schema.addObject(fieldName);
          } else {
            schema[`add${fieldDef.type}`](fieldName);
          }
        } catch (error) {
          // Field might already exist, skip
        }
      });

      await schema.update();
      console.log(`✅ Schema ${schemaDefinition.className} updated successfully`);
    } else {
      // Create new schema
      Object.entries(schemaDefinition.fields).forEach(([fieldName, fieldDef]) => {
        if (fieldDef.type === 'Pointer') {
          schema.addPointer(fieldName, fieldDef.targetClass);
        } else if (fieldDef.type === 'Array') {
          schema.addArray(fieldName);
        } else if (fieldDef.type === 'Object') {
          schema.addObject(fieldName);
        } else {
          schema[`add${fieldDef.type}`](fieldName);
        }
      });

      // Set permissions
      schema.setCLP(schemaDefinition.classLevelPermissions);

      await schema.save();
      console.log(`✅ Schema ${schemaDefinition.className} created successfully`);
    }

    // Create indexes
    console.log(`📊 Creating indexes for ${schemaDefinition.className}...`);
    for (const [indexName, indexDef] of Object.entries(schemaDefinition.indexes)) {
      try {
        await schema.addIndex(indexName, indexDef);
        console.log(`   ✓ Index created: ${indexName}`);
      } catch (error) {
        console.log(`   ⚠️  Index ${indexName}: ${error.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error(`❌ Error creating schema ${schemaDefinition.className}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting University & Course Schema Initialization...\n');
  console.log(`📍 Parse Server: ${Parse.serverURL}`);
  console.log(`📦 App ID: ${process.env.APP_ID}\n`);

  try {
    // Create University schema first (Course has pointer to University)
    const universitySuccess = await createSchema(UniversitySchema);

    if (!universitySuccess) {
      throw new Error('Failed to create University schema');
    }

    // Create Course schema
    const courseSuccess = await createSchema(CourseSchema);

    if (!courseSuccess) {
      throw new Error('Failed to create Course schema');
    }

    console.log('\n✅ All schemas created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - University: 21 fields, 6 indexes`);
    console.log(`   - Course: 24 fields, 8 indexes`);
    console.log('\n✅ Ready for data migration!');
    console.log('   Next step: node backend/migrations/migrate-universities-courses.js\n');

  } catch (error) {
    console.error('\n❌ Schema initialization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { UniversitySchema, CourseSchema, createSchema };
