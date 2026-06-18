#!/usr/bin/env node

/**
 * Premium Test User Seeding Script
 * Creates 2-3 counselors and 2 premium students for user journey testing
 * Usage: node seed-premium-users.js [environment]
 */

const Parse = require('parse/node');
const bcrypt = require('bcryptjs');
const path = require('path');

// Get environment from command line arg or default to development
const environment = process.argv[2] || 'development';

// Load correct .env file based on environment
if (environment === 'staging') {
  require('dotenv').config({ path: path.join(__dirname, '../.env.staging') });
} else if (environment === 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} else {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const configs = {
  development: {
    appId: 'elimu-smart-production',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY
  },
  staging: {
    appId: process.env.APP_ID || 'elimu-smart-production',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY
  },
  production: {
    appId: process.env.APP_ID || 'elimu-smart-production',
    serverURL: process.env.PARSE_SERVER_URL || 'https://elimu-smart.co.ke/parse',
    masterKey: process.env.MASTER_KEY || 'CHANGE_THIS_MASTER_KEY'
  }
};

const config = configs[environment];

if (!config) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.log('Usage: node seed-premium-users.js [development|staging|production]');
  process.exit(1);
}

console.log(`\n🌍 Environment: ${environment}`);
console.log(`🔗 Server URL: ${config.serverURL}\n`);

// Initialize Parse
Parse.initialize(config.appId, null, config.masterKey);
Parse.serverURL = config.serverURL;

async function seedUsers() {
  const createdAccounts = [];

  try {
    // ========== CREATE TEST COUNSELORS ==========
    const counselors = [
      {
        username: 'ruth.counselor@elimu.com',
        email: 'ruth.counselor@elimu.com',
        password: 'RuthTest2024!',
        name: 'Ruth Kipchoge',
        role: 'counselor',
        specialty: 'STEM & Engineering',
        bio: 'Experienced STEM career counselor with 8 years of university placement experience'
      },
      {
        username: 'david.counselor@elimu.com',
        email: 'david.counselor@elimu.com',
        password: 'DavidTest2024!',
        name: 'David Okonkwo',
        role: 'counselor',
        specialty: 'Business & Social Sciences',
        bio: 'Business and economics counselor specializing in KUCCPS university matching'
      },
      {
        username: 'grace.counselor@elimu.com',
        email: 'grace.counselor@elimu.com',
        password: 'GraceTest2024!',
        name: 'Grace Muendo',
        role: 'counselor',
        specialty: 'Creative Arts & Humanities',
        bio: 'Creative industries counselor helping students explore unconventional career paths'
      }
    ];

    console.log('📝 Creating test counselors...\n');

    for (const counselorData of counselors) {
      try {
        // Check if user already exists
        const query = new Parse.Query(Parse.User);
        query.equalTo('username', counselorData.username);
        const existing = await query.first({ useMasterKey: true });

        if (existing) {
          console.log(`✅ Counselor already exists: ${counselorData.name} (${counselorData.username})`);
          createdAccounts.push({
            type: 'Counselor',
            name: counselorData.name,
            email: counselorData.username,
            status: 'already_exists'
          });
          continue;
        }

        const user = new Parse.User();
        user.set('username', counselorData.username);
        user.set('email', counselorData.email);
        user.set('password', counselorData.password);
        user.set('name', counselorData.name);
        user.set('role', counselorData.role);
        user.set('specialty', counselorData.specialty);
        user.set('bio', counselorData.bio);
        user.set('isActive', true);

        await user.save(null, { useMasterKey: true });

        console.log(`✅ Counselor created: ${counselorData.name}`);
        console.log(`   Email: ${counselorData.username}`);
        console.log(`   Specialty: ${counselorData.specialty}\n`);

        createdAccounts.push({
          type: 'Counselor',
          name: counselorData.name,
          email: counselorData.username,
          password: counselorData.password,
          status: 'created'
        });

      } catch (error) {
        console.log(`⚠️  Failed to create counselor ${counselorData.name}: ${error.message}\n`);
      }
    }

    // ========== CREATE TEST PREMIUM STUDENTS ==========
    const students = [
      {
        username: 'amara.student@elimu.com',
        email: 'amara.student@elimu.com',
        password: 'AmaraTest2024!',
        name: 'Amara Kipyegon',
        role: 'student',
        school: 'Loreto Convent Nairobi',
        form: 4,
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kiswahili'],
        careerInterest: 'Medicine',
        parentEmail: 'kipyegon.family@example.com'
      },
      {
        username: 'juma.student@elimu.com',
        email: 'juma.student@elimu.com',
        password: 'JumaTest2024!',
        name: 'Juma Omondi',
        role: 'student',
        school: 'Nairobi School',
        form: 4,
        subjects: ['Mathematics', 'Physics', 'Computer Science', 'English', 'Kiswahili', 'History'],
        careerInterest: 'Software Engineering',
        parentEmail: 'omondi.family@example.com'
      }
    ];

    console.log('📚 Creating premium test students...\n');

    for (const studentData of students) {
      try {
        // Check if user already exists
        const query = new Parse.Query(Parse.User);
        query.equalTo('username', studentData.username);
        const existing = await query.first({ useMasterKey: true });

        if (existing) {
          console.log(`✅ Student already exists: ${studentData.name} (${studentData.username})`);
          createdAccounts.push({
            type: 'Student (Premium)',
            name: studentData.name,
            email: studentData.username,
            status: 'already_exists'
          });
          continue;
        }

        const user = new Parse.User();
        user.set('username', studentData.username);
        user.set('email', studentData.email);
        user.set('password', studentData.password);
        user.set('name', studentData.name);
        user.set('role', studentData.role);
        user.set('school', studentData.school);
        user.set('form', studentData.form);
        user.set('subjects', studentData.subjects);
        user.set('careerInterest', studentData.careerInterest);
        user.set('parentEmail', studentData.parentEmail);
        user.set('isActive', true);

        await user.save(null, { useMasterKey: true });

        console.log(`✅ Student created: ${studentData.name}`);
        console.log(`   Email: ${studentData.username}`);
        console.log(`   School: ${studentData.school}, Form ${studentData.form}`);
        console.log(`   Career Interest: ${studentData.careerInterest}\n`);

        createdAccounts.push({
          type: 'Student (Premium)',
          name: studentData.name,
          email: studentData.username,
          password: studentData.password,
          status: 'created'
        });

      } catch (error) {
        console.log(`⚠️  Failed to create student ${studentData.name}: ${error.message}\n`);
      }
    }

    // ========== CREATE PREMIUM SUBSCRIPTIONS ==========
    console.log('💳 Creating premium subscriptions...\n');

    const Subscription = Parse.Object.extend('Subscription');

    for (const studentData of students) {
      try {
        // Find the student user
        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo('username', studentData.username);
        const studentUser = await userQuery.first({ useMasterKey: true });

        if (!studentUser) {
          console.log(`⚠️  Student not found: ${studentData.username}`);
          continue;
        }

        // Check if subscription already exists
        const subQuery = new Parse.Query(Subscription);
        subQuery.equalTo('user', studentUser);
        subQuery.equalTo('status', 'active');
        const existingSub = await subQuery.first({ useMasterKey: true });

        if (existingSub) {
          console.log(`✅ Premium subscription already active: ${studentData.name}`);
          console.log(`   Expires: ${existingSub.get('expiresAt')}\n`);
          continue;
        }

        // Create premium subscription (12 months)
        const subscription = new Subscription();
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        subscription.set('user', studentUser);
        subscription.set('planId', 'premium-yearly');
        subscription.set('planName', 'Premium - Annual');
        subscription.set('status', 'active');
        subscription.set('amount', 2990); // KES 2,990 annually
        subscription.set('currency', 'KES');
        subscription.set('paymentMethod', 'test');
        subscription.set('transactionId', `TEST-${Date.now()}-${studentData.username}`);
        subscription.set('startDate', new Date());
        subscription.set('expiresAt', expiresAt);
        subscription.set('renewalEnabled', true);
        subscription.set('features', [
          'unlimited_counselor_messaging',
          'priority_question_response',
          'session_booking',
          'advanced_career_reports',
          'scholarship_alerts'
        ]);

        await subscription.save(null, { useMasterKey: true });

        console.log(`✅ Premium subscription created: ${studentData.name}`);
        console.log(`   Plan: Premium - Annual`);
        console.log(`   Expires: ${expiresAt.toDateString()}\n`);

      } catch (error) {
        console.log(`⚠️  Failed to create subscription for ${studentData.name}: ${error.message}\n`);
      }
    }

    // ========== ASSIGN STUDENTS TO COUNSELORS ==========
    console.log('🔗 Assigning students to counselors...\n');

    const assignments = [
      { studentEmail: 'amara.student@elimu.com', counselorEmail: 'ruth.counselor@elimu.com' },
      { studentEmail: 'juma.student@elimu.com', counselorEmail: 'david.counselor@elimu.com' }
    ];

    for (const assignment of assignments) {
      try {
        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo('username', assignment.studentEmail);
        const student = await userQuery.first({ useMasterKey: true });

        const counselorQuery = new Parse.Query(Parse.User);
        counselorQuery.equalTo('username', assignment.counselorEmail);
        const counselor = await counselorQuery.first({ useMasterKey: true });

        if (!student || !counselor) {
          console.log(`⚠️  Student or counselor not found for assignment`);
          continue;
        }

        student.set('assignedCounselorId', counselor.id);
        student.set('assignedCounselorName', counselor.get('name'));
        await student.save(null, { useMasterKey: true });

        console.log(`✅ Assigned ${student.get('name')} to ${counselor.get('name')}\n`);

      } catch (error) {
        console.log(`⚠️  Failed to assign student: ${error.message}\n`);
      }
    }

    // ========== PRINT SUMMARY ==========
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST ACCOUNT CREATION COMPLETE');
    console.log('='.repeat(60));

    console.log('\n📋 COUNSELOR ACCOUNTS:');
    counselors.forEach((c, i) => {
      console.log(`\n${i + 1}. ${c.name}`);
      console.log(`   Email: ${c.username}`);
      console.log(`   Password: ${c.password}`);
      console.log(`   Specialty: ${c.specialty}`);
    });

    console.log('\n\n👥 PREMIUM STUDENT ACCOUNTS:');
    students.forEach((s, i) => {
      console.log(`\n${i + 1}. ${s.name}`);
      console.log(`   Email: ${s.username}`);
      console.log(`   Password: ${s.password}`);
      console.log(`   School: ${s.school}`);
      console.log(`   Career Interest: ${s.careerInterest}`);
      console.log(`   Status: PREMIUM (1-year subscription)`);
    });

    console.log('\n\n🎯 QUICK TEST FLOWS:');
    console.log('\n1. STUDENT JOURNEY:');
    console.log('   - Login as: amara.student@elimu.com / AmaraTest2024!');
    console.log('   - Access: Dashboard → Assessments → Guidance → Inbox → Profile');
    console.log('   - Test: Send message to assigned counselor (Ruth Kipchoge)');

    console.log('\n2. COUNSELOR JOURNEY:');
    console.log('   - Login as: ruth.counselor@elimu.com / RuthTest2024!');
    console.log('   - Access: Counselor Dashboard → Students → Questions → Sessions → Analytics');
    console.log('   - Test: Reply to student questions, view assigned students');

    console.log('\n3. MESSAGING VERIFICATION:');
    console.log('   - Login as Amara, send message in Inbox');
    console.log('   - Login as Ruth, verify message received');
    console.log('   - Reply and verify student receives response');

    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedUsers()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
