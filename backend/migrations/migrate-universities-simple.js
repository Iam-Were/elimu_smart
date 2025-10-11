/**
 * Simple Data Migration: Universities & Courses
 *
 * Directly saves objects - Parse will auto-create classes
 * Usage: node backend/migrations/migrate-universities-simple.js
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu_smart_app_2024',
  'javascript_key_2024',
  process.env.MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = 'http://localhost:1337/parse';

// Hardcoded university data
const UNIVERSITIES = [
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

async function migrate() {
  console.log('🚀 Starting Simple Universities Migration...\n');

  let universitiesCreated = 0;
  let coursesCreated = 0;

  try {
    for (const uniData of UNIVERSITIES) {
      console.log(`\n📍 Processing: ${uniData.name}`);

      // Create University object
      const University = Parse.Object.extend('University');
      const university = new University();

      university.set('universityId', uniData.id);
      university.set('name', uniData.name);
      university.set('type', uniData.type);
      university.set('location', uniData.location);
      university.set('kuccpsCode', uniData.kuccpsCode);
      university.set('active', true);
      university.set('kuccpsEnabled', true);
      university.set('accredited', true);

      // Save university
      await university.save(null, { useMasterKey: true });
      universitiesCreated++;
      console.log(`   ✅ University saved`);

      // Create Course objects
      for (const prog of uniData.programs) {
        const Course = Parse.Object.extend('Course');
        const course = new Course();

        course.set('courseId', prog.id);
        course.set('name', prog.name);
        course.set('university', university);
        course.set('universityId', uniData.id);
        course.set('kuccpsCode', prog.kuccpsCode);
        course.set('cutoffPoints', prog.cutoffPoints);
        course.set('duration', prog.duration);
        course.set('subjects', prog.subjects);
        course.set('careerOutcomes', prog.careerOutcomes);
        course.set('averageSalary', prog.averageSalary);
        course.set('employmentRate', prog.employmentRate);
        course.set('annualFees', prog.annualFees);
        course.set('scholarships', prog.scholarships);
        course.set('active', true);

        await course.save(null, { useMasterKey: true });
        coursesCreated++;
        console.log(`      ✅ Course: ${prog.name.substring(0, 50)}...`);
      }
    }

    console.log('\n✅ Migration Complete!');
    console.log(`📊 Universities: ${universitiesCreated}`);
    console.log(`📚 Courses: ${coursesCreated}\n`);

    // Verify
    const UniversityClass = Parse.Object.extend('University');
    const query = new Parse.Query(UniversityClass);
    const count = await query.count({ useMasterKey: true });
    console.log(`✅ Verified: ${count} universities in database\n`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    throw error;
  }
}

// Run
migrate().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
