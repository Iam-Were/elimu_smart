/**
 * Career Data Migration
 *
 * Migrates hardcoded KENYA_CAREERS_DATABASE to Career Parse Class
 * Updates schema with missing fields and migrates 5 careers
 *
 * Usage: node backend/migrations/migrate-careers.js
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
 * Hardcoded Careers from backend/cloud/main.js (lines 3796-4000+)
 */
const KENYA_CAREERS_DATABASE = [
  // Healthcare & Medical
  {
    id: 'medical-doctor',
    title: 'Medical Doctor',
    category: 'Healthcare & Medical',
    averageSalary: 450000,
    salaryRange: { min: 200000, max: 800000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Medicine & Surgery (6 years) + Internship (1 year)',
    keySubjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    minimumGrades: { overall: 'A-', math: 'B+', sciences: 'A-' },
    workEnvironment: 'Hospitals, Clinics, Private Practice',
    jobOutlook: 'excellent',
    industryGrowth: 'high',
    employmentRate: 0.95,
    description: 'Diagnose and treat illnesses, injuries, and diseases. Provide medical care and health advice to patients.',
    dailyTasks: [
      'Examine patients and diagnose illnesses',
      'Prescribe medications and treatments',
      'Perform medical procedures',
      'Maintain patient records',
      'Consult with specialists'
    ],
    skills: ['Medical knowledge', 'Problem-solving', 'Communication', 'Empathy', 'Decision-making'],
    personalityTraits: ['Compassionate', 'Detail-oriented', 'Resilient', 'Ethical'],
    careerProgression: 'Medical Officer → Senior Medical Officer → Consultant → Specialist',
    challenges: ['Long hours', 'High responsibility', 'Emotional stress', 'Continuous learning required'],
    rewards: ['Save lives', 'High income potential', 'Respect in society', 'Job security'],
    relatedCareers: ['Nurse', 'Pharmacist', 'Medical Researcher', 'Surgeon'],
    kenyaSpecific: {
      majorEmployers: ['Ministry of Health', 'Private Hospitals', 'NGOs', 'Private Practice'],
      licensingBody: 'Kenya Medical Practitioners and Dentists Council (KMPDC)',
      universities: ['University of Nairobi', 'Moi University', 'JKUAT'],
      internshipProgram: 'Mandatory 1-year internship in government hospitals'
    }
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology & IT',
    averageSalary: 320000,
    salaryRange: { min: 120000, max: 600000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Science in Computer Science/IT (4 years)',
    keySubjects: ['Mathematics', 'Physics', 'Computer Studies', 'English'],
    minimumGrades: { overall: 'B', math: 'B+', physics: 'B' },
    workEnvironment: 'Tech companies, Offices, Remote work',
    jobOutlook: 'excellent',
    industryGrowth: 'very_high',
    employmentRate: 0.90,
    description: 'Design, develop, and maintain software applications and systems. Solve complex technical problems through code.',
    dailyTasks: [
      'Write and test code',
      'Debug software issues',
      'Collaborate with team members',
      'Review code and design systems',
      'Learn new technologies'
    ],
    skills: ['Programming', 'Problem-solving', 'Logical thinking', 'Teamwork', 'Continuous learning'],
    personalityTraits: ['Analytical', 'Creative', 'Patient', 'Detail-oriented'],
    careerProgression: 'Junior Developer → Mid-level Developer → Senior Developer → Tech Lead → CTO',
    challenges: ['Rapidly changing technology', 'Tight deadlines', 'Complex problem-solving', 'Remote work isolation'],
    rewards: ['High salary potential', 'Remote work flexibility', 'Creative expression', 'Global opportunities'],
    relatedCareers: ['Data Scientist', 'DevOps Engineer', 'System Administrator', 'IT Consultant'],
    kenyaSpecific: {
      majorEmployers: ['Safaricom', 'Equity Bank', 'Tech Startups', 'International Companies'],
      licensingBody: 'None (Professional certifications available)',
      universities: ['JKUAT', 'Strathmore University', 'University of Nairobi'],
      internshipProgram: 'Recommended internships with tech companies'
    }
  },
  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering & Construction',
    averageSalary: 350000,
    salaryRange: { min: 150000, max: 700000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Engineering in Civil Engineering (4 years)',
    keySubjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    minimumGrades: { overall: 'B+', math: 'A-', physics: 'B+' },
    workEnvironment: 'Construction sites, Offices, Field work',
    jobOutlook: 'very_good',
    industryGrowth: 'high',
    employmentRate: 0.88,
    description: 'Design, build, and maintain infrastructure projects like roads, bridges, and buildings.',
    dailyTasks: [
      'Design infrastructure projects',
      'Supervise construction',
      'Inspect project sites',
      'Prepare technical reports',
      'Manage project budgets'
    ],
    skills: ['Technical design', 'Project management', 'Problem-solving', 'Attention to detail', 'Leadership'],
    personalityTraits: ['Practical', 'Organized', 'Analytical', 'Safety-conscious'],
    careerProgression: 'Assistant Engineer → Project Engineer → Senior Engineer → Project Manager → Chief Engineer',
    challenges: ['Long hours on site', 'Weather conditions', 'Budget constraints', 'Safety responsibility'],
    rewards: ['Visible impact', 'Good salary', 'Job variety', 'Nation building'],
    relatedCareers: ['Architect', 'Structural Engineer', 'Quantity Surveyor', 'Construction Manager'],
    kenyaSpecific: {
      majorEmployers: ['Kenya Roads Board', 'Construction Companies', 'Government Ministries', 'Private Sector'],
      licensingBody: 'Engineers Board of Kenya (EBK)',
      universities: ['JKUAT', 'University of Nairobi', 'Moi University'],
      internshipProgram: '6-month industrial attachment required for registration'
    }
  },
  {
    id: 'accountant',
    title: 'Accountant',
    category: 'Business & Finance',
    averageSalary: 280000,
    salaryRange: { min: 100000, max: 500000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Commerce (Accounting) + CPA qualification',
    keySubjects: ['Mathematics', 'Business Studies', 'English', 'Economics'],
    minimumGrades: { overall: 'B', math: 'B+' },
    workEnvironment: 'Offices, Corporate settings, Remote work possible',
    jobOutlook: 'good',
    industryGrowth: 'steady',
    employmentRate: 0.82,
    description: 'Manage financial records, prepare financial statements, and ensure compliance with tax regulations.',
    dailyTasks: [
      'Prepare financial statements',
      'Process invoices and payments',
      'Tax compliance and filing',
      'Budget preparation',
      'Financial analysis'
    ],
    skills: ['Financial analysis', 'Attention to detail', 'Tax knowledge', 'Software proficiency', 'Communication'],
    personalityTraits: ['Detail-oriented', 'Ethical', 'Analytical', 'Organized'],
    careerProgression: 'Junior Accountant → Accountant → Senior Accountant → Finance Manager → CFO',
    challenges: ['Month-end pressure', 'Regulatory changes', 'Long hours during audits', 'High responsibility'],
    rewards: ['Job security', 'Professional respect', 'Clear career path', 'Competitive salary'],
    relatedCareers: ['Auditor', 'Tax Consultant', 'Financial Analyst', 'Bookkeeper'],
    kenyaSpecific: {
      majorEmployers: ['Banks', 'Audit Firms', 'Corporations', 'Government Agencies'],
      licensingBody: 'Institute of Certified Public Accountants of Kenya (ICPAK)',
      universities: ['Strathmore University', 'JKUAT', 'University of Nairobi'],
      internshipProgram: 'Required 3-year practical experience for CPA certification'
    }
  },
  {
    id: 'teacher',
    title: 'Secondary School Teacher',
    category: 'Education & Training',
    averageSalary: 220000,
    salaryRange: { min: 80000, max: 350000 },
    educationLevel: 'University Degree',
    educationPath: 'Bachelor of Education (4 years)',
    keySubjects: ['Two teaching subjects', 'English', 'Mathematics'],
    minimumGrades: { overall: 'C+', teachingSubjects: 'B' },
    workEnvironment: 'Schools, Classrooms, Staff rooms',
    jobOutlook: 'good',
    industryGrowth: 'steady',
    employmentRate: 0.85,
    description: 'Educate and inspire students in specific subject areas. Shape the next generation of Kenyans.',
    dailyTasks: [
      'Prepare and deliver lessons',
      'Grade assignments and exams',
      'Manage classroom discipline',
      'Mentor students',
      'Attend staff meetings'
    ],
    skills: ['Communication', 'Patience', 'Subject expertise', 'Classroom management', 'Motivation'],
    personalityTraits: ['Patient', 'Passionate', 'Empathetic', 'Creative'],
    careerProgression: 'Teacher → Senior Teacher → Deputy Principal → Principal → TSC Director',
    challenges: ['Large class sizes', 'Limited resources', 'Exam pressure', 'Moderate salary'],
    rewards: ['Impact on youth', 'Job security', 'School holidays', 'Respect in community'],
    relatedCareers: ['University Lecturer', 'Education Officer', 'Tutor', 'Curriculum Developer'],
    kenyaSpecific: {
      majorEmployers: ['Teachers Service Commission (TSC)', 'Private Schools', 'International Schools'],
      licensingBody: 'Teachers Service Commission (TSC)',
      universities: ['Kenyatta University', 'Moi University', 'Egerton University'],
      internshipProgram: 'Teaching practice during university'
    }
  }
];

/**
 * Update Career Schema with Missing Fields
 */
async function updateCareerSchema() {
  console.log('\n📋 Updating Career schema with missing fields...');

  const schema = new Parse.Schema('Career');

  try {
    // Add missing fields
    const missingFields = [
      { name: 'careerId', type: 'String' },
      { name: 'salaryRangeMin', type: 'Number' },
      { name: 'salaryRangeMax', type: 'Number' },
      { name: 'educationLevel', type: 'String' },
      { name: 'educationPath', type: 'String' },
      { name: 'keySubjects', type: 'Array' },
      { name: 'minimumGrades', type: 'Object' },
      { name: 'workEnvironment', type: 'String' },
      { name: 'jobOutlook', type: 'String' },
      { name: 'industryGrowth', type: 'String' },
      { name: 'dailyTasks', type: 'Array' },
      { name: 'personalityTraits', type: 'Array' },
      { name: 'careerProgression', type: 'String' },
      { name: 'challenges', type: 'Array' },
      { name: 'rewards', type: 'Array' },
      { name: 'relatedCareers', type: 'Array' },
      { name: 'kenyaSpecific', type: 'Object' }
    ];

    for (const field of missingFields) {
      try {
        if (field.type === 'Array') {
          schema.addArray(field.name);
        } else if (field.type === 'Object') {
          schema.addObject(field.name);
        } else {
          schema[`add${field.type}`](field.name);
        }
        console.log(`   ✓ Added field: ${field.name}`);
      } catch (error) {
        // Field might already exist
        console.log(`   ⚠️  Field ${field.name}: ${error.message}`);
      }
    }

    await schema.update();
    console.log('✅ Career schema updated successfully\n');
    return true;
  } catch (error) {
    console.error('❌ Schema update failed:', error.message);
    return false;
  }
}

/**
 * Migrate Career Data
 */
async function migrate() {
  console.log('🚀 Starting Career Data Migration...\n');
  console.log(`📍 Parse Server: ${Parse.serverURL}`);
  console.log(`📦 App ID: ${process.env.APP_ID}\n`);

  let careersCreated = 0;
  let errors = 0;

  try {
    // Update schema first
    const schemaSuccess = await updateCareerSchema();
    if (!schemaSuccess) {
      throw new Error('Schema update failed');
    }

    // Check existing careers
    const CareerClass = Parse.Object.extend('Career');
    const existingQuery = new Parse.Query(CareerClass);
    const existingCount = await existingQuery.count({ useMasterKey: true });

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing careers`);
      console.log('   This will add/update data, not replace it.\n');
    }

    console.log(`📊 Starting migration of ${KENYA_CAREERS_DATABASE.length} careers...\n`);

    for (const careerData of KENYA_CAREERS_DATABASE) {
      try {
        console.log(`📍 Processing: ${careerData.title}`);

        // Check if career exists
        const existingCareerQuery = new Parse.Query(CareerClass);
        existingCareerQuery.equalTo('careerId', careerData.id);
        let career = await existingCareerQuery.first({ useMasterKey: true });

        if (career) {
          console.log(`   ⚠️  Career already exists, updating...`);
        } else {
          career = new CareerClass();
          console.log(`   ✓ Creating new career`);
        }

        // Set all fields
        career.set('careerId', careerData.id);
        career.set('title', careerData.title);
        career.set('category', careerData.category);
        career.set('avgSalary', careerData.averageSalary);
        career.set('salaryRangeMin', careerData.salaryRange.min);
        career.set('salaryRangeMax', careerData.salaryRange.max);
        career.set('educationLevel', careerData.educationLevel);
        career.set('educationPath', careerData.educationPath);
        career.set('keySubjects', careerData.keySubjects);
        career.set('minimumGrades', careerData.minimumGrades);
        career.set('workEnvironment', careerData.workEnvironment);
        career.set('jobOutlook', careerData.jobOutlook);
        career.set('industryGrowth', careerData.industryGrowth);
        career.set('employmentRate', careerData.employmentRate);
        career.set('description', careerData.description);
        career.set('dailyTasks', careerData.dailyTasks);
        career.set('skills', careerData.skills);
        career.set('personalityTraits', careerData.personalityTraits);
        career.set('careerProgression', careerData.careerProgression);
        career.set('challenges', careerData.challenges);
        career.set('rewards', careerData.rewards);
        career.set('relatedCareers', careerData.relatedCareers);
        career.set('kenyaSpecific', careerData.kenyaSpecific);
        career.set('isActive', true);

        await career.save(null, { useMasterKey: true });
        careersCreated++;
        console.log(`   ✅ Career saved: ${career.id}\n`);

      } catch (error) {
        console.error(`   ❌ Error processing career "${careerData.title}":`, error.message);
        errors++;
      }
    }

    // Migration summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Careers: ${careersCreated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify
    console.log('🔍 Verifying migrated data...');
    const verifyQuery = new Parse.Query(CareerClass);
    const totalCareers = await verifyQuery.count({ useMasterKey: true });
    console.log(`✅ Verified: ${totalCareers} careers in database\n`);

    console.log('✅ Next steps:');
    console.log('   1. Test career queries via Parse Dashboard');
    console.log('   2. Update career Cloud Functions to use Parse Classes');
    console.log('   3. Mark hardcoded data as deprecated\n');

    return { careersCreated, errors };

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  migrate().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { migrate, KENYA_CAREERS_DATABASE };
