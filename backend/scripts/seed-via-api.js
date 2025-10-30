#!/usr/bin/env node

/**
 * Seed Premium Users via Parse REST API
 * Direct HTTP calls to Parse Server
 * Usage: node seed-via-api.js [environment]
 */

const https = require('https');
const http = require('http');
const querystring = require('querystring');
const path = require('path');

// Get environment from command line arg or default to production
const environment = process.argv[2] || 'production';

// Load .env file
if (environment === 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} else {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const configs = {
  development: {
    host: 'localhost',
    port: 1337,
    protocol: 'http',
    appId: 'elimu-smart-local-dev',
    masterKey: 'elimu-smart-master-key-dev'
  },
  staging: {
    host: 'staging.elimu-smart.co.ke',
    port: 443,
    protocol: 'https',
    appId: process.env.APP_ID || 'elimu-smart-staging',
    masterKey: process.env.MASTER_KEY || 'ElImuSmartStagingMasterKey2024Secure'
  },
  production: {
    host: 'elimu-smart.co.ke',
    port: 443,
    protocol: 'https',
    appId: process.env.APP_ID || 'elimu_smart_app_2024',
    masterKey: process.env.MASTER_KEY || 'CHANGE_THIS_MASTER_KEY'
  }
};

const config = configs[environment];

if (!config) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.log('Usage: node seed-via-api.js [development|staging|production]');
  process.exit(1);
}

console.log(`\n🌍 Environment: ${environment}`);
console.log(`🔗 Server: ${config.protocol}://${config.host}:${config.port}\n`);

// Helper to make HTTP/HTTPS requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const requestModule = config.protocol === 'https' ? https : http;

    const options = {
      hostname: config.host,
      port: config.port,
      path: `/parse${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': config.appId,
        'X-Parse-Master-Key': config.masterKey
      }
    };

    const req = requestModule.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(responseData));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function seedViaAPI() {
  try {
    console.log('📝 Creating test counselors...\n');

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

    const createdCounselors = {};

    for (const counselorData of counselors) {
      try {
        const response = await makeRequest('POST', '/users', counselorData);
        console.log(`✅ Counselor created: ${counselorData.name}`);
        console.log(`   Email: ${counselorData.username}`);
        console.log(`   Specialty: ${counselorData.specialty}\n`);
        createdCounselors[counselorData.username] = response.objectId;
      } catch (error) {
        console.log(`⚠️  Counselor may already exist: ${counselorData.name}\n`);
      }
    }

    // ========== CREATE TEST PREMIUM STUDENTS ==========
    console.log('📚 Creating premium test students...\n');

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

    const createdStudents = {};

    for (const studentData of students) {
      try {
        const response = await makeRequest('POST', '/users', studentData);
        console.log(`✅ Student created: ${studentData.name}`);
        console.log(`   Email: ${studentData.username}`);
        console.log(`   School: ${studentData.school}, Form ${studentData.form}`);
        console.log(`   Career Interest: ${studentData.careerInterest}\n`);
        createdStudents[studentData.username] = response.objectId;
      } catch (error) {
        console.log(`⚠️  Student may already exist: ${studentData.name}\n`);
      }
    }

    // ========== CREATE PREMIUM SUBSCRIPTIONS ==========
    console.log('💳 Creating premium subscriptions...\n');

    for (const studentEmail of Object.keys(createdStudents)) {
      try {
        const studentId = createdStudents[studentEmail];
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const subscriptionData = {
          user: {
            __type: 'Pointer',
            className: '_User',
            objectId: studentId
          },
          planId: 'premium-yearly',
          planName: 'Premium - Annual',
          status: 'active',
          amount: 2990,
          currency: 'KES',
          paymentMethod: 'test',
          transactionId: `TEST-${Date.now()}-${studentEmail}`,
          startDate: {
            __type: 'Date',
            iso: new Date().toISOString()
          },
          expiresAt: {
            __type: 'Date',
            iso: expiresAt.toISOString()
          },
          renewalEnabled: true,
          features: [
            'unlimited_counselor_messaging',
            'priority_question_response',
            'session_booking',
            'advanced_career_reports',
            'scholarship_alerts'
          ]
        };

        const response = await makeRequest('POST', '/classes/Subscription', subscriptionData);
        console.log(`✅ Premium subscription created for ${studentEmail}`);
        console.log(`   Plan: Premium - Annual`);
        console.log(`   Expires: ${expiresAt.toDateString()}\n`);
      } catch (error) {
        console.log(`⚠️  Failed to create subscription for ${studentEmail}: ${error.message}\n`);
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
        const studentId = createdStudents[assignment.studentEmail];
        const counselorId = createdCounselors[assignment.counselorEmail];

        if (!studentId || !counselorId) {
          console.log(`⚠️  Student or counselor ID not found for assignment\n`);
          continue;
        }

        // Get student and counselor details
        const studentResponse = await makeRequest('GET', `/users/${studentId}`);
        const counselorResponse = await makeRequest('GET', `/users/${counselorId}`);
        const counselorName = counselorResponse.name;
        const studentName = studentResponse.name;

        // 1. Update student with assigned counselor
        await makeRequest('PUT', `/users/${studentId}`, {
          assignedCounselorId: counselorId,
          assignedCounselorName: counselorName
        });

        // 2. Create StudentAssignment record (required by getCounselorAssignedStudents)
        const assignmentData = {
          studentId: studentId,
          counselorId: counselorId,
          studentName: studentName,
          counselorName: counselorName,
          gradeLevel: studentResponse.form ? `Form ${studentResponse.form}` : 'Form 4',
          status: 'active',
          lastContact: {
            __type: 'Date',
            iso: new Date().toISOString()
          },
          urgentFlags: []
        };

        const assignmentResponse = await makeRequest('POST', '/classes/StudentAssignment', assignmentData);
        console.log(`✅ Assigned ${assignment.studentEmail} to ${counselorName}`);
        console.log(`   StudentAssignment record created: ${assignmentResponse.objectId}\n`);
      } catch (error) {
        console.log(`⚠️  Failed to assign student: ${error.message}\n`);
      }
    }

    // ========== PRINT SUMMARY ==========
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST ACCOUNT CREATION COMPLETE (VIA API)');
    console.log('='.repeat(60));

    console.log('\n📋 COUNSELOR ACCOUNTS:');
    console.log(`\n1. Ruth Kipchoge`);
    console.log(`   Email: ruth.counselor@elimu.com`);
    console.log(`   Password: RuthTest2024!`);
    console.log(`   Specialty: STEM & Engineering`);

    console.log(`\n2. David Okonkwo`);
    console.log(`   Email: david.counselor@elimu.com`);
    console.log(`   Password: DavidTest2024!`);
    console.log(`   Specialty: Business & Social Sciences`);

    console.log(`\n3. Grace Muendo`);
    console.log(`   Email: grace.counselor@elimu.com`);
    console.log(`   Password: GraceTest2024!`);
    console.log(`   Specialty: Creative Arts & Humanities`);

    console.log('\n\n👥 PREMIUM STUDENT ACCOUNTS:');
    console.log(`\n1. Amara Kipyegon`);
    console.log(`   Email: amara.student@elimu.com`);
    console.log(`   Password: AmaraTest2024!`);
    console.log(`   School: Loreto Convent Nairobi`);
    console.log(`   Career Interest: Medicine`);
    console.log(`   Status: PREMIUM (1-year subscription)`);

    console.log(`\n2. Juma Omondi`);
    console.log(`   Email: juma.student@elimu.com`);
    console.log(`   Password: JumaTest2024!`);
    console.log(`   School: Nairobi School`);
    console.log(`   Career Interest: Software Engineering`);
    console.log(`   Status: PREMIUM (1-year subscription)`);

    console.log('\n\n🎯 LOGIN URLS:');
    console.log(`\n📱 Student Login: https://elimu-smart.co.ke/login`);
    console.log(`   → Amara: amara.student@elimu.com / AmaraTest2024!`);
    console.log(`   → Juma: juma.student@elimu.com / JumaTest2024!`);

    console.log(`\n👨‍⚖️  Counselor Login: https://elimu-smart.co.ke/login`);
    console.log(`   → Ruth: ruth.counselor@elimu.com / RuthTest2024!`);
    console.log(`   → David: david.counselor@elimu.com / DavidTest2024!`);
    console.log(`   → Grace: grace.counselor@elimu.com / GraceTest2024!`);

    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedViaAPI()
  .then(() => {
    console.log('✅ API seeding completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ API seeding failed:', err);
    process.exit(1);
  });
