// Seed data script for Elimu Smart Parse Server
const Parse = require('parse/node');

// Initialize Parse with master key
Parse.initialize('elimu-smart-local-dev');
Parse.serverURL = 'http://localhost:1337/parse';
Parse.masterKey = 'elimu-smart-master-key-dev';

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
  },
  {
    username: 'counselor@elimu.com',
    email: 'counselor@elimu.com',
    password: 'counselor',
    firstName: 'Demo',
    lastName: 'Counselor',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'admin@elimu.com',
    email: 'admin@elimu.com',
    password: 'admin',
    firstName: 'Demo',
    lastName: 'Admin',
    role: 'admin',
    isActive: true
  }
];

async function seedUsers() {
  console.log('🌱 Starting user seeding...');

  for (const userData of demoUsers) {
    try {
      // Check if user already exists
      const existingUserQuery = new Parse.Query(Parse.User);
      existingUserQuery.equalTo('email', userData.email);
      const existingUser = await existingUserQuery.first({ useMasterKey: true });

      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create new user
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

      await user.signUp(null, { useMasterKey: true });
      console.log(`✅ Created user: ${userData.email}`);

    } catch (error) {
      console.error(`❌ Failed to create user ${userData.email}:`, error.message);
    }
  }
}

async function seedStudentProgress() {
  console.log('📊 Creating sample student progress data...');

  try {
    // Find the student user
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo('email', 'student@elimu.com');
    const student = await userQuery.first({ useMasterKey: true });

    if (!student) {
      console.log('❌ Student user not found, skipping progress creation');
      return;
    }

    // Check if progress already exists
    const progressQuery = new Parse.Query('StudentProgress');
    progressQuery.equalTo('user', student);
    const existingProgress = await progressQuery.first({ useMasterKey: true });

    if (existingProgress) {
      console.log('✅ Student progress already exists, skipping...');
      return;
    }

    // Create student progress
    const StudentProgress = Parse.Object.extend('StudentProgress');
    const progress = new StudentProgress();
    
    progress.set('user', student);
    progress.set('careerReadinessScore', 82);
    progress.set('assessmentsCompleted', 3);
    progress.set('streakCount', 7);
    progress.set('lastActivity', new Date());
    progress.set('lastCheckin', new Date());
    progress.set('isActive', true);

    await progress.save(null, { useMasterKey: true });
    console.log('✅ Created student progress data');

  } catch (error) {
    console.error('❌ Failed to create student progress:', error.message);
  }
}

async function seedUniversityData() {
  console.log('🎓 Creating sample university placement data...');

  try {
    // Find the student user
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo('email', 'student@elimu.com');
    const student = await userQuery.first({ useMasterKey: true });

    if (!student) {
      console.log('❌ Student user not found, skipping university data creation');
      return;
    }

    // Check if placement data already exists
    const placementQuery = new Parse.Query('UniversityPlacement');
    placementQuery.equalTo('user', student);
    const existingPlacement = await placementQuery.first({ useMasterKey: true });

    if (existingPlacement) {
      console.log('✅ University placement data already exists, skipping...');
      return;
    }

    // Create university placement data
    const UniversityPlacement = Parse.Object.extend('UniversityPlacement');
    const placement = new UniversityPlacement();
    
    placement.set('user', student);
    placement.set('cutoffPoints', 42.5);
    placement.set('eligibleCourses', [
      {
        name: 'Computer Science',
        university: 'University of Nairobi',
        cutoff: 10.5,
        duration: '4 years'
      },
      {
        name: 'Business Administration',
        university: 'Kenyatta University',
        cutoff: 9.0,
        duration: '4 years'
      }
    ]);
    placement.set('preferredInstitutions', [
      'University of Nairobi',
      'Kenyatta University',
      'JKUAT'
    ]);
    placement.set('placementStatus', 'eligible');
    placement.set('applicationData', {
      submissionDate: new Date().toISOString(),
      documentsSubmitted: true,
      feePaid: true
    });

    await placement.save(null, { useMasterKey: true });
    console.log('✅ Created university placement data');

  } catch (error) {
    console.error('❌ Failed to create university placement data:', error.message);
  }
}

async function runSeedScript() {
  try {
    console.log('🚀 Starting Elimu Smart database seeding...\n');
    
    await seedUsers();
    console.log('');
    
    await seedStudentProgress();
    console.log('');
    
    await seedUniversityData();
    console.log('');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Student: student@elimu.com / student');
    console.log('Counselor: sarah.counselor@elimu.com / counselor2024');
    console.log('Admin (Platform): mike.platform@elimu.com / platform2024');
    console.log('Admin (Operations): linda.operations@elimu.com / operations2024');
    console.log('Admin (Safety): peter.safety@elimu.com / safety2024');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding script
runSeedScript();