// Enhanced seed data script that bypasses Parse security restrictions
const Parse = require('parse/node');

// Initialize Parse with master key
Parse.initialize('elimu-smart-local-dev');
Parse.serverURL = 'http://localhost:1337/parse';
Parse.masterKey = 'elimu-smart-master-key-dev';

// Use Parse as master user to bypass restrictions
Parse.Cloud.useMasterKey();

// Demo users data
const demoUsers = [
  {
    username: 'student@elimu.com',
    email: 'student@elimu.com',
    password: 'student',
    firstName: 'Alex',
    lastName: 'Mwangi',
    role: 'student',
    isActive: true
  },
  {
    username: 'sarah.counselor@elimu.com',
    email: 'sarah.counselor@elimu.com',
    password: 'counselor2024',
    firstName: 'Sarah',
    lastName: 'Njeri',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'james.coach@elimu.com',
    email: 'james.coach@elimu.com',
    password: 'coach2024',
    firstName: 'James',
    lastName: 'Mutua',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'maria.guidance@elimu.com',
    email: 'maria.guidance@elimu.com',
    password: 'guidance2024',
    firstName: 'Maria',
    lastName: 'Ochieng',
    role: 'career_counselor',
    isActive: true
  },
  {
    username: 'mike.platform@elimu.com',
    email: 'mike.platform@elimu.com',
    password: 'platform2024',
    firstName: 'Mike',
    lastName: 'Kamau',
    role: 'admin',
    adminRoleType: 'platform',
    isActive: true
  },
  {
    username: 'linda.operations@elimu.com',
    email: 'linda.operations@elimu.com',
    password: 'operations2024',
    firstName: 'Linda',
    lastName: 'Wambui',
    role: 'admin',
    adminRoleType: 'operations',
    isActive: true
  },
  {
    username: 'peter.safety@elimu.com',
    email: 'peter.safety@elimu.com',
    password: 'safety2024',
    firstName: 'Peter',
    lastName: 'Otieno',
    role: 'admin',
    adminRoleType: 'provider_safety',
    isActive: true
  }
];

async function seedUsers() {
  console.log('🌱 Starting enhanced user seeding...');

  for (const userData of demoUsers) {
    try {
      // Create new user directly without checking existence
      const user = new Parse.User();
      user.set('username', userData.username);
      user.set('email', userData.email);
      user.set('password', userData.password);
      user.set('firstName', userData.firstName);
      user.set('lastName', userData.lastName);
      user.set('role', userData.role);
      user.set('isActive', userData.isActive);
      
      if (userData.adminRoleType) {
        user.set('adminRoleType', userData.adminRoleType);
      }

      // Use master key for signup
      await user.save(null, { useMasterKey: true });
      console.log(`✅ Created user: ${userData.email}`);

    } catch (error) {
      if (error.code === 202) {
        console.log(`✅ User ${userData.email} already exists, skipping...`);
      } else {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }
  }
}

async function seedStudentProgress() {
  console.log('📊 Creating sample student progress data...');

  try {
    // Create student progress without user lookup
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progress = new StudentProgress();
    
    // Create a pointer to the student user
    const studentPointer = Parse.User.createWithoutData('student@elimu.com');
    
    progress.set('userId', 'student@elimu.com'); // Use email as reference
    progress.set('careerReadinessScore', 82);
    progress.set('assessmentsCompleted', 3);
    progress.set('streakCount', 7);
    progress.set('lastActivity', new Date());
    progress.set('lastCheckin', new Date());
    progress.set('isActive', true);
    progress.set('subjects', {
      mathematics: { grade: 'A-', points: 11 },
      english: { grade: 'B+', points: 10 },
      physics: { grade: 'A', points: 12 },
      chemistry: { grade: 'B', points: 9 }
    });
    progress.set('riasecProfile', {
      realistic: 7,
      investigative: 9,
      artistic: 4,
      social: 6,
      enterprising: 8,
      conventional: 5
    });

    await progress.save(null, { useMasterKey: true });
    console.log('✅ Created student progress data');

  } catch (error) {
    if (error.code === 137) {
      console.log('✅ Student progress already exists, skipping...');
    } else {
      console.error('❌ Failed to create student progress:', error.message);
    }
  }
}

async function seedUniversityData() {
  console.log('🎓 Creating sample university placement data...');

  try {
    // Create university placement data
    const UniversityPlacement = Parse.Object.extend('UniversityPlacement');
    const placement = new UniversityPlacement();
    
    placement.set('userId', 'student@elimu.com');
    placement.set('cutoffPoints', 42.5);
    placement.set('kcseGrade', 'A-');
    placement.set('eligibleCourses', [
      {
        name: 'Computer Science',
        university: 'University of Nairobi',
        cutoff: 10.5,
        duration: '4 years',
        cluster: 'Engineering'
      },
      {
        name: 'Business Administration',
        university: 'Kenyatta University', 
        cutoff: 9.0,
        duration: '4 years',
        cluster: 'Business'
      },
      {
        name: 'Information Technology',
        university: 'JKUAT',
        cutoff: 9.5,
        duration: '4 years',
        cluster: 'Engineering'
      }
    ]);
    placement.set('preferredInstitutions', [
      'University of Nairobi',
      'Kenyatta University',
      'JKUAT',
      'Strathmore University'
    ]);
    placement.set('placementStatus', 'eligible');
    placement.set('applicationData', {
      submissionDate: new Date().toISOString(),
      documentsSubmitted: true,
      feePaid: true,
      applicationNumber: 'KUCCPS2024/001234'
    });

    await placement.save(null, { useMasterKey: true });
    console.log('✅ Created university placement data');

  } catch (error) {
    if (error.code === 137) {
      console.log('✅ University placement data already exists, skipping...');
    } else {
      console.error('❌ Failed to create university placement data:', error.message);
    }
  }
}

async function seedCareerData() {
  console.log('💼 Creating sample career exploration data...');

  try {
    const CareerProgress = Parse.Object.extend('CareerProgress');
    const careerData = new CareerProgress();
    
    careerData.set('userId', 'student@elimu.com');
    careerData.set('exploredCareers', [
      {
        title: 'Software Developer',
        industry: 'Technology',
        exploredDate: new Date(),
        interestLevel: 9,
        notes: 'Very interested in mobile app development'
      },
      {
        title: 'Data Scientist',
        industry: 'Technology',
        exploredDate: new Date(),
        interestLevel: 8,
        notes: 'Fascinated by machine learning applications'
      },
      {
        title: 'Business Analyst',
        industry: 'Business',
        exploredDate: new Date(),
        interestLevel: 7,
        notes: 'Good combination of business and tech'
      }
    ]);
    careerData.set('careerGoals', [
      'Complete Computer Science degree',
      'Intern at tech company',
      'Develop mobile applications',
      'Start own tech startup'
    ]);
    careerData.set('skillsToAcquire', [
      'React Native',
      'Python',
      'Machine Learning',
      'Project Management'
    ]);

    await careerData.save(null, { useMasterKey: true });
    console.log('✅ Created career exploration data');

  } catch (error) {
    if (error.code === 137) {
      console.log('✅ Career exploration data already exists, skipping...');
    } else {
      console.error('❌ Failed to create career data:', error.message);
    }
  }
}

async function runEnhancedSeedScript() {
  try {
    console.log('🚀 Starting Enhanced Elimu Smart database seeding...\n');
    
    await seedUsers();
    console.log('');
    
    await seedStudentProgress();
    console.log('');
    
    await seedUniversityData();
    console.log('');
    
    await seedCareerData();
    console.log('');
    
    console.log('🎉 Enhanced database seeding completed successfully!');
    console.log('\n📋 Complete Demo Login Credentials:');
    console.log('Student: student@elimu.com / student');
    console.log('Counselor: sarah.counselor@elimu.com / counselor2024');
    console.log('Career Coach: james.coach@elimu.com / coach2024');
    console.log('Career Counselor: maria.guidance@elimu.com / guidance2024');
    console.log('Admin (Platform): mike.platform@elimu.com / platform2024');
    console.log('Admin (Operations): linda.operations@elimu.com / operations2024');
    console.log('Admin (Safety): peter.safety@elimu.com / safety2024');
    
  } catch (error) {
    console.error('❌ Enhanced seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the enhanced seeding script
runEnhancedSeedScript();