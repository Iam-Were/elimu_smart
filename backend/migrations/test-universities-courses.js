/**
 * Test Suite: Universities & Courses Migration
 *
 * Tests the updated findUniversityCourses Cloud Function
 * Verifies data can be queried from Parse Classes
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

async function runTests() {
  console.log('🧪 Starting Migration Tests...\n');

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Verify University class has data
    console.log('📋 Test 1: Query University class');
    const UniversityClass = Parse.Object.extend('University');
    const univQuery = new Parse.Query(UniversityClass);
    const universities = await univQuery.find({ useMasterKey: true });

    if (universities.length >= 4) {
      console.log(`   ✅ PASS: Found ${universities.length} universities`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 4+ universities, found ${universities.length}`);
      failed++;
    }

    // Test 2: Verify Course class has data
    console.log('\n📋 Test 2: Query Course class');
    const CourseClass = Parse.Object.extend('Course');
    const courseQuery = new Parse.Query(CourseClass);
    const courses = await courseQuery.find({ useMasterKey: true });

    if (courses.length >= 7) {
      console.log(`   ✅ PASS: Found ${courses.length} courses`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 7+ courses, found ${courses.length}`);
      failed++;
    }

    // Test 3: Verify University-Course relationship
    console.log('\n📋 Test 3: Verify University-Course pointer relationship');
    const uonQuery = new Parse.Query(UniversityClass);
    uonQuery.equalTo('universityId', 'uon');
    const uon = await uonQuery.first({ useMasterKey: true });

    const uonCoursesQuery = new Parse.Query(CourseClass);
    uonCoursesQuery.equalTo('university', uon);
    const uonCourses = await uonCoursesQuery.find({ useMasterKey: true });

    if (uonCourses.length === 3) {
      console.log(`   ✅ PASS: University of Nairobi has ${uonCourses.length} courses`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 3 UoN courses, found ${uonCourses.length}`);
      failed++;
    }

    // Test 4: Verify course has all required fields
    console.log('\n📋 Test 4: Verify Course object structure');
    const medicineCourse = uonCourses.find(c => c.get('courseId') === 'medicine');

    const requiredFields = [
      'courseId', 'name', 'kuccpsCode', 'cutoffPoints', 'duration',
      'subjects', 'careerOutcomes', 'averageSalary', 'employmentRate',
      'annualFees', 'scholarships', 'active'
    ];

    const missingFields = requiredFields.filter(field => !medicineCourse.has(field));

    if (missingFields.length === 0) {
      console.log(`   ✅ PASS: Medicine course has all required fields`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Medicine course missing fields: ${missingFields.join(', ')}`);
      failed++;
    }

    // Test 5: Test findUniversityCourses Cloud Function
    console.log('\n📋 Test 5: Test findUniversityCourses Cloud Function');

    // First create a test user
    const testUser = new Parse.User();
    testUser.set('username', `test_${Date.now()}`);
    testUser.set('password', 'testpass123');
    testUser.set('email', `test_${Date.now()}@test.com`);
    await testUser.signUp();

    console.log('   ✓ Created test user');

    // Call the Cloud Function
    try {
      const result = await Parse.Cloud.run('findUniversityCourses', {
        studentProfile: {
          subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
          grades: {
            'Mathematics': 'A',
            'Physics': 'A',
            'Chemistry': 'A',
            'Biology': 'A',
            'English': 'B'
          }
        },
        academicPreferences: {
          careerInterests: ['Medical Doctor']
        },
        financialConstraints: {
          maxAnnualFees: 50000
        },
        locationPreferences: ['Nairobi']
      }, { sessionToken: testUser.getSessionToken() });

      console.log('   ✓ Cloud Function executed successfully');
      console.log(`   ✓ Data source: ${result.dataSource}`);
      console.log(`   ✓ Cluster points: ${result.clusterPoints}`);
      console.log(`   ✓ Matching programs: ${result.matchingPrograms.length}`);

      if (result.dataSource === 'parse_class') {
        console.log(`   ✅ PASS: Cloud Function using Parse Classes`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: Cloud Function not using Parse Classes`);
        failed++;
      }

      if (result.matchingPrograms.length > 0) {
        console.log(`   ✅ PASS: Found matching programs`);
        const medicine = result.matchingPrograms.find(p =>
          p.program.id === 'medicine'
        );
        if (medicine) {
          console.log(`   ✅ PASS: Medicine program found in results`);
          console.log(`      - Match score: ${medicine.program.matchScore}`);
          console.log(`      - Eligible: ${medicine.program.eligible}`);
        } else {
          console.log(`   ⚠️  WARNING: Medicine program not in top matches`);
        }
        passed++;
      } else {
        console.log(`   ❌ FAIL: No matching programs found`);
        failed++;
      }

      // Cleanup test user
      await testUser.destroy({ useMasterKey: true });
      console.log('   ✓ Cleaned up test user');

    } catch (error) {
      console.log(`   ❌ FAIL: Cloud Function error: ${error.message}`);
      failed++;
    }

    // Test 6: Verify data fields match original structure
    console.log('\n📋 Test 6: Verify data integrity');
    const engineeringQuery = new Parse.Query(CourseClass);
    engineeringQuery.equalTo('courseId', 'engineering');
    const engineering = await engineeringQuery.first({ useMasterKey: true });

    const checks = [
      { field: 'cutoffPoints', expected: 72 },
      { field: 'averageSalary', expected: 350000 },
      { field: 'employmentRate', expected: 0.88 },
      { field: 'annualFees', expected: 42000 }
    ];

    let dataValid = true;
    for (const check of checks) {
      const actual = engineering.get(check.field);
      if (actual !== check.expected) {
        console.log(`   ❌ ${check.field}: expected ${check.expected}, got ${actual}`);
        dataValid = false;
      }
    }

    if (dataValid) {
      console.log(`   ✅ PASS: All data fields match original structure`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Data integrity issues found`);
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
      console.log('✅ All tests passed! Migration successful.\n');
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
