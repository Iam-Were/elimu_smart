/**
 * Data Migration: Universities & Courses
 *
 * Migrates hardcoded KENYA_UNIVERSITIES_DATABASE to Parse Classes
 * - Transforms 4+ universities with 5+ programs
 * - Creates University and Course objects
 * - Establishes relationships via Pointers
 *
 * Run AFTER schema creation
 * Usage: node backend/migrations/migrate-universities-courses.js
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  'javascript_key_2024',
  process.env.MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = 'http://localhost:1337/parse';

/**
 * Hardcoded Universities Data
 * Source: backend/cloud/main.js lines 3228-3358
 */
const KENYA_UNIVERSITIES_DATABASE = [
  // Public Universities
  {
    id: 'uon',
    name: 'University of Nairobi',
    type: 'public',
    location: 'Nairobi',
    kuccpsCode: '01',
    programs: [
      {
        id: 'medicine',
        name: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)',
        kuccpsCode: '01101',
        cutoffPoints: 78,
        duration: '6 years',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
        careerOutcomes: ['Medical Doctor', 'Surgeon', 'Specialist Doctor'],
        averageSalary: 450000,
        employmentRate: 0.95,
        annualFees: 45000,
        scholarships: ['HELB', 'Government Scholarship', 'Merit Scholarships']
      },
      {
        id: 'engineering',
        name: 'Bachelor of Engineering (Civil Engineering)',
        kuccpsCode: '01102',
        cutoffPoints: 72,
        duration: '4 years',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
        careerOutcomes: ['Civil Engineer', 'Project Manager', 'Construction Manager'],
        averageSalary: 350000,
        employmentRate: 0.88,
        annualFees: 42000,
        scholarships: ['HELB', 'Engineering Scholarship']
      },
      {
        id: 'business',
        name: 'Bachelor of Commerce',
        kuccpsCode: '01103',
        cutoffPoints: 65,
        duration: '4 years',
        subjects: ['Mathematics', 'English', 'Business Studies', 'Economics'],
        careerOutcomes: ['Business Analyst', 'Financial Manager', 'Marketing Manager'],
        averageSalary: 280000,
        employmentRate: 0.82,
        annualFees: 38000,
        scholarships: ['HELB', 'Business Leaders Scholarship']
      }
    ]
  },
  {
    id: 'jkuat',
    name: 'Jomo Kenyatta University of Agriculture and Technology',
    type: 'public',
    location: 'Juja',
    kuccpsCode: '02',
    programs: [
      {
        id: 'computer-science',
        name: 'Bachelor of Science in Computer Science',
        kuccpsCode: '02201',
        cutoffPoints: 68,
        duration: '4 years',
        subjects: ['Mathematics', 'Physics', 'English', 'Computer Studies'],
        careerOutcomes: ['Software Developer', 'IT Consultant', 'Systems Analyst'],
        averageSalary: 320000,
        employmentRate: 0.90,
        annualFees: 40000,
        scholarships: ['HELB', 'Tech Innovation Fund']
      },
      {
        id: 'agriculture',
        name: 'Bachelor of Science in Agriculture',
        kuccpsCode: '02202',
        cutoffPoints: 60,
        duration: '4 years',
        subjects: ['Mathematics', 'Chemistry', 'Biology', 'Geography', 'English'],
        careerOutcomes: ['Agricultural Officer', 'Farm Manager', 'Agricultural Consultant'],
        averageSalary: 250000,
        employmentRate: 0.75,
        annualFees: 35000,
        scholarships: ['HELB', 'Agricultural Development Fund']
      }
    ]
  },
  {
    id: 'moi',
    name: 'Moi University',
    type: 'public',
    location: 'Eldoret',
    kuccpsCode: '03',
    programs: [
      {
        id: 'education',
        name: 'Bachelor of Education (Science)',
        kuccpsCode: '03301',
        cutoffPoints: 58,
        duration: '4 years',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
        careerOutcomes: ['Secondary School Teacher', 'Educational Administrator', 'Curriculum Developer'],
        averageSalary: 220000,
        employmentRate: 0.85,
        annualFees: 32000,
        scholarships: ['HELB', 'Teachers Service Commission Bursary']
      }
    ]
  },
  // Private Universities
  {
    id: 'strathmore',
    name: 'Strathmore University',
    type: 'private',
    location: 'Nairobi',
    kuccpsCode: '04',
    programs: [
      {
        id: 'business-admin',
        name: 'Bachelor of Business Administration',
        kuccpsCode: '04401',
        cutoffPoints: 70,
        duration: '4 years',
        subjects: ['Mathematics', 'English', 'Business Studies', 'Economics'],
        careerOutcomes: ['Business Manager', 'Consultant', 'Entrepreneur'],
        averageSalary: 400000,
        employmentRate: 0.92,
        annualFees: 180000,
        scholarships: ['Merit Scholarship', 'Need-based Bursary']
      }
    ]
  }
];

/**
 * Create University Parse Object
 */
function createUniversityObject(universityData) {
  const University = Parse.Object.extend('University');
  const university = new University();

  // Core identification
  university.set('universityId', universityData.id);
  university.set('name', universityData.name);
  university.set('shortName', extractShortName(universityData.name));

  // Classification
  university.set('type', universityData.type);
  university.set('category', 'university');

  // Location
  university.set('location', universityData.location);
  university.set('county', getCountyFromLocation(universityData.location));
  university.set('region', getRegionFromLocation(universityData.location));

  // KUCCPS Integration
  university.set('kuccpsCode', universityData.kuccpsCode);
  university.set('kuccpsEnabled', true);

  // Accreditation
  university.set('accredited', true);
  university.set('accreditationBody', 'CUE');

  // Metadata
  university.set('active', true);

  return university;
}

/**
 * Create Course Parse Object
 */
function createCourseObject(programData, university, universityId) {
  const Course = Parse.Object.extend('Course');
  const course = new Course();

  // Core identification
  course.set('courseId', programData.id);
  course.set('name', programData.name);

  // University relationship
  course.set('university', university);
  course.set('universityId', universityId);

  // KUCCPS Integration
  course.set('kuccpsCode', programData.kuccpsCode);
  course.set('cutoffPoints', programData.cutoffPoints);

  // Program details
  course.set('duration', programData.duration);
  course.set('qualification', extractQualification(programData.name));

  // Admission requirements
  course.set('subjects', programData.subjects);

  // Career outcomes
  course.set('careerOutcomes', programData.careerOutcomes);
  course.set('averageSalary', programData.averageSalary);
  course.set('employmentRate', programData.employmentRate);

  // Financial
  course.set('annualFees', programData.annualFees);
  course.set('totalCost', calculateTotalCost(programData.annualFees, programData.duration));
  course.set('scholarships', programData.scholarships);

  // Metadata
  course.set('active', true);
  course.set('intakeMonths', ['September']); // Default intake month

  return course;
}

/**
 * Helper: Extract short name from full name
 */
function extractShortName(fullName) {
  const shortNames = {
    'University of Nairobi': 'UoN',
    'Jomo Kenyatta University of Agriculture and Technology': 'JKUAT',
    'Moi University': 'Moi',
    'Strathmore University': 'Strathmore'
  };
  return shortNames[fullName] || fullName.split(' ')[0];
}

/**
 * Helper: Get county from location
 */
function getCountyFromLocation(location) {
  const counties = {
    'Nairobi': 'Nairobi',
    'Juja': 'Kiambu',
    'Eldoret': 'Uasin Gishu'
  };
  return counties[location] || location;
}

/**
 * Helper: Get region from location
 */
function getRegionFromLocation(location) {
  const regions = {
    'Nairobi': 'Nairobi Region',
    'Juja': 'Central Region',
    'Eldoret': 'Rift Valley Region'
  };
  return regions[location] || 'Kenya';
}

/**
 * Helper: Extract qualification from program name
 */
function extractQualification(programName) {
  if (programName.includes('Bachelor')) return 'Bachelor';
  if (programName.includes('Diploma')) return 'Diploma';
  if (programName.includes('Certificate')) return 'Certificate';
  return 'Bachelor'; // Default
}

/**
 * Helper: Calculate total program cost
 */
function calculateTotalCost(annualFees, duration) {
  const years = parseInt(duration.split(' ')[0]) || 4;
  return annualFees * years;
}

/**
 * Main Migration Function
 */
async function migrate() {
  console.log('🚀 Starting Universities & Courses Data Migration...\n');
  console.log(`📍 Parse Server: ${Parse.serverURL}`);
  console.log(`📦 App ID: ${process.env.APP_ID}\n`);

  let universitiesCreated = 0;
  let coursesCreated = 0;
  let errors = 0;

  try {
    // Check if data already exists
    const UniversityClass = Parse.Object.extend('University');
    const existingQuery = new Parse.Query(UniversityClass);
    const existingCount = await existingQuery.count({ useMasterKey: true });

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing universities`);
      console.log('   This will add/update data, not replace it.\n');
    }

    console.log(`📊 Starting migration of ${KENYA_UNIVERSITIES_DATABASE.length} universities...\n`);

    for (const universityData of KENYA_UNIVERSITIES_DATABASE) {
      try {
        console.log(`\n📍 Processing: ${universityData.name}`);

        // Check if university already exists
        const existingUnivQuery = new Parse.Query(UniversityClass);
        existingUnivQuery.equalTo('universityId', universityData.id);
        let university = await existingUnivQuery.first({ useMasterKey: true });

        if (university) {
          console.log(`   ⚠️  University already exists, updating...`);
          // Update existing university
          university.set('name', universityData.name);
          university.set('type', universityData.type);
          university.set('location', universityData.location);
          university.set('kuccpsCode', universityData.kuccpsCode);
        } else {
          // Create new university
          university = createUniversityObject(universityData);
          console.log(`   ✓ Created new university object`);
        }

        // Save university
        await university.save(null, { useMasterKey: true });
        universitiesCreated++;
        console.log(`   ✅ University saved: ${university.id}`);

        // Migrate programs (courses)
        console.log(`   📚 Migrating ${universityData.programs.length} programs...`);

        for (const programData of universityData.programs) {
          try {
            // Check if course already exists
            const CourseClass = Parse.Object.extend('Course');
            const existingCourseQuery = new Parse.Query(CourseClass);
            existingCourseQuery.equalTo('courseId', programData.id);
            existingCourseQuery.equalTo('universityId', universityData.id);
            let course = await existingCourseQuery.first({ useMasterKey: true });

            if (course) {
              console.log(`      ⚠️  Course "${programData.name}" already exists, updating...`);
              // Update existing course
              course.set('name', programData.name);
              course.set('cutoffPoints', programData.cutoffPoints);
              course.set('duration', programData.duration);
              course.set('subjects', programData.subjects);
              course.set('careerOutcomes', programData.careerOutcomes);
              course.set('averageSalary', programData.averageSalary);
              course.set('employmentRate', programData.employmentRate);
              course.set('annualFees', programData.annualFees);
              course.set('scholarships', programData.scholarships);
            } else {
              // Create new course
              course = createCourseObject(programData, university, universityData.id);
              console.log(`      ✓ Created course: ${programData.name}`);
            }

            await course.save(null, { useMasterKey: true });
            coursesCreated++;
            console.log(`      ✅ Course saved: ${course.id}`);

          } catch (courseError) {
            console.error(`      ❌ Error saving course "${programData.name}":`, courseError.message);
            errors++;
          }
        }

        console.log(`   ✅ University migration complete`);

      } catch (error) {
        console.error(`   ❌ Error processing university "${universityData.name}":`, error.message);
        errors++;
      }
    }

    // Migration summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Universities: ${universitiesCreated}`);
    console.log(`📚 Courses: ${coursesCreated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify data
    console.log('🔍 Verifying migrated data...');
    const verifyUnivQuery = new Parse.Query(UniversityClass);
    const totalUniversities = await verifyUnivQuery.count({ useMasterKey: true });

    const CourseClass = Parse.Object.extend('Course');
    const verifyCourseQuery = new Parse.Query(CourseClass);
    const totalCourses = await verifyCourseQuery.count({ useMasterKey: true });

    console.log(`✅ Verified: ${totalUniversities} universities, ${totalCourses} courses in database\n`);

    console.log('✅ Next steps:');
    console.log('   1. Test queries via Parse Dashboard');
    console.log('   2. Update backend Cloud Functions to use Parse Classes');
    console.log('   3. Run test suite: node backend/migrations/test-universities-courses.js\n');

    return { universitiesCreated, coursesCreated, errors };

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  migrate().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { migrate, KENYA_UNIVERSITIES_DATABASE };
