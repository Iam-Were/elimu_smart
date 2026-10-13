/**
 * Test Suite: Career Migration
 *
 * Tests the updated career Cloud Functions
 * Verifies data can be queried from Parse Classes
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  'javascript_key_2024',
  process.env.MASTER_KEY ?? (() => { throw new Error('MASTER_KEY env var is required'); })()
);
Parse.serverURL = 'http://localhost:1337/parse';

async function runTests() {
  console.log('🧪 Starting Career Migration Tests...\n');

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Verify Career class has data
    console.log('📋 Test 1: Query Career class');
    const CareerClass = Parse.Object.extend('Career');
    const careerQuery = new Parse.Query(CareerClass);
    const careers = await careerQuery.find({ useMasterKey: true });

    if (careers.length >= 5) {
      console.log(`   ✅ PASS: Found ${careers.length} careers`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 5+ careers, found ${careers.length}`);
      failed++;
    }

    // Test 2: Verify specific career exists
    console.log('\n📋 Test 2: Query specific career (medical-doctor)');
    const medicalQuery = new Parse.Query(CareerClass);
    medicalQuery.equalTo('careerId', 'medical-doctor');
    const medicalDoctor = await medicalQuery.first({ useMasterKey: true });

    if (medicalDoctor) {
      console.log(`   ✅ PASS: Found Medical Doctor career`);
      console.log(`      - Title: ${medicalDoctor.get('title')}`);
      console.log(`      - Category: ${medicalDoctor.get('category')}`);
      console.log(`      - Salary: KES ${medicalDoctor.get('avgSalary')}`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Medical Doctor career not found`);
      failed++;
    }

    // Test 3: Test exploreCareers Cloud Function
    console.log('\n📋 Test 3: Test exploreCareers Cloud Function');

    // Call the Cloud Function with test user context
    try {
      // Create a test user for authentication
      const testUser = new Parse.User();
      testUser.set('username', `test_career_${Date.now()}`);
      testUser.set('password', 'testpass123');
      testUser.set('email', `test_career_${Date.now()}@test.com`);
      testUser.set('role', 'student');
      await testUser.signUp();
      console.log('   ✓ Created test user');

      const result = await Parse.Cloud.run('exploreCareers', {
        filters: {
          categories: ['Healthcare & Medical']
        },
        limit: 10
      }, { useMasterKey: true });

      console.log('   ✓ Cloud Function executed successfully');
      console.log(`   ✓ Returned careers: ${result.careers.length}`);

      if (result.success && result.careers.length > 0) {
        console.log(`   ✅ PASS: exploreCareers working correctly`);
        const medicalCareer = result.careers.find(c => c.id === 'medical-doctor');
        if (medicalCareer) {
          console.log(`   ✅ PASS: Medical Doctor found in results`);
          console.log(`      - Salary: KES ${medicalCareer.averageSalary}`);
        } else {
          console.log(`   ⚠️  WARNING: Medical Doctor not in filtered results`);
        }
        passed++;
      } else {
        console.log(`   ❌ FAIL: No careers returned`);
        failed++;
      }

      // Cleanup test user
      await testUser.destroy({ useMasterKey: true });
      console.log('   ✓ Cleaned up test user (Test 3)');
    } catch (error) {
      console.log(`   ❌ FAIL: Cloud Function error: ${error.message}`);
      failed++;
    }

    // Test 4: Test getCareerDetails Cloud Function
    console.log('\n📋 Test 4: Test getCareerDetails Cloud Function');

    try {
      // Create another test user
      const testUser2 = new Parse.User();
      testUser2.set('username', `test_career_details_${Date.now()}`);
      testUser2.set('password', 'testpass123');
      testUser2.set('email', `test_career_details_${Date.now()}@test.com`);
      await testUser2.signUp();

      const result = await Parse.Cloud.run('getCareerDetails', {
        careerId: 'medical-doctor',
        studentProfile: {
          subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
          grades: {
            'Mathematics': 'A',
            'Physics': 'A',
            'Chemistry': 'A',
            'Biology': 'A',
            'English': 'B'
          }
        }
      }, { useMasterKey: true });

      console.log('   ✓ Cloud Function executed successfully');

      if (result.success && result.career) {
        console.log(`   ✅ PASS: getCareerDetails working correctly`);
        console.log(`      - Career: ${result.career.title}`);
        console.log(`      - Match Score: ${result.career.matchScore || 'N/A'}`);
        console.log(`      - Education Path: ${result.career.educationPath}`);
        console.log(`      - Daily Tasks: ${result.career.dailyTasks.length} tasks`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: Career details not returned correctly`);
        failed++;
      }

      // Cleanup test user
      await testUser2.destroy({ useMasterKey: true });
      console.log('   ✓ Cleaned up test user (Test 4)');
    } catch (error) {
      console.log(`   ❌ FAIL: Cloud Function error: ${error.message}`);
      failed++;
    }

    // Test 5: Test career search functionality
    console.log('\n📋 Test 5: Test career search with searchQuery');

    try {
      // Create another test user
      const testUser3 = new Parse.User();
      testUser3.set('username', `test_career_search_${Date.now()}`);
      testUser3.set('password', 'testpass123');
      testUser3.set('email', `test_career_search_${Date.now()}@test.com`);
      await testUser3.signUp();

      const result = await Parse.Cloud.run('exploreCareers', {
        searchQuery: 'doctor',
        limit: 10
      }, { useMasterKey: true });

      if (result.success && result.careers.length > 0) {
        console.log(`   ✅ PASS: Search found ${result.careers.length} matching careers`);
        result.careers.forEach(c => {
          console.log(`      - ${c.title} (${c.category})`);
        });
        passed++;
      } else {
        console.log(`   ❌ FAIL: Search returned no results`);
        failed++;
      }

      // Cleanup test user
      await testUser3.destroy({ useMasterKey: true });
      console.log('   ✓ Cleaned up test user (Test 5)');
    } catch (error) {
      console.log(`   ❌ FAIL: Search error: ${error.message}`);
      failed++;
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Test Results Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (failed === 0) {
      console.log('✅ All tests passed! Career migration successful.\n');
      return true;
    } else {
      console.log(`❌ ${failed} test(s) failed. Review and fix issues.\n`);
      return false;
    }

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
