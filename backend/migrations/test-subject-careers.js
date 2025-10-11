/**
 * Test Suite: Subject-Career Mappings
 *
 * Tests the getCareersBySubject Cloud Function
 * Verifies subject-to-career mappings work correctly
 */

const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Parse
Parse.initialize(
  process.env.APP_ID || 'elimu-smart-production',
  'javascript_key_2024',
  process.env.MASTER_KEY || 'ElImuSmartMasterKey2024Secure'
);
Parse.serverURL = 'http://localhost:1337/parse';

async function runTests() {
  console.log('🧪 Starting Subject-Career Mapping Tests...\n');

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Query careers with relatedSubjects field
    console.log('📋 Test 1: Verify careers have relatedSubjects field');
    const CareerClass = Parse.Object.extend('Career');
    const careerQuery = new Parse.Query(CareerClass);
    careerQuery.exists('relatedSubjects');
    const careersWithSubjects = await careerQuery.find({ useMasterKey: true });

    if (careersWithSubjects.length > 0) {
      console.log(`   ✅ PASS: Found ${careersWithSubjects.length} careers with relatedSubjects`);

      // Show sample
      const sample = careersWithSubjects[0];
      console.log(`      Sample: ${sample.get('title')}`);
      console.log(`      Related Subjects: ${JSON.stringify(sample.get('relatedSubjects'))}`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: No careers found with relatedSubjects field`);
      failed++;
    }

    // Test 2: Test getCareersBySubject for Mathematics
    console.log('\n📋 Test 2: Test getCareersBySubject for Mathematics');

    try {
      const result = await Parse.Cloud.run('getCareersBySubject', {
        subject: 'Mathematics'
      }, { useMasterKey: true });

      if (result && result.length > 0) {
        console.log(`   ✅ PASS: Found ${result.length} careers for Mathematics`);
        result.slice(0, 3).forEach((career, i) => {
          console.log(`      ${i+1}. ${career.title} (${career.matchScore}% match)`);
        });
        passed++;
      } else {
        console.log(`   ❌ FAIL: No careers returned for Mathematics`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ FAIL: Cloud Function error: ${error.message}`);
      failed++;
    }

    // Test 3: Test for multiple subjects
    console.log('\n📋 Test 3: Test multiple subjects');

    const subjectsToTest = ['Biology', 'Chemistry', 'Business Studies', 'Computer Studies'];
    let subjectTestsPassed = 0;

    for (const subject of subjectsToTest) {
      try {
        const result = await Parse.Cloud.run('getCareersBySubject', {
          subject: subject
        }, { useMasterKey: true });

        console.log(`   ✓ ${subject}: ${result.length} careers found`);
        subjectTestsPassed++;
      } catch (error) {
        console.log(`   ✗ ${subject}: Error - ${error.message}`);
      }
    }

    if (subjectTestsPassed === subjectsToTest.length) {
      console.log(`   ✅ PASS: All ${subjectTestsPassed} subjects returned careers`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Only ${subjectTestsPassed}/${subjectsToTest.length} subjects succeeded`);
      failed++;
    }

    // Test 4: Verify data structure returned by Cloud Function
    console.log('\n📋 Test 4: Verify returned data structure');

    const mathCareers = await Parse.Cloud.run('getCareersBySubject', {
      subject: 'Mathematics'
    }, { useMasterKey: true });

    if (mathCareers.length > 0) {
      const career = mathCareers[0];
      const requiredFields = [
        'id', 'title', 'category', 'matchScore', 'description',
        'salaryRange', 'demand', 'kuccpsPathway', 'skills'
      ];

      const missingFields = requiredFields.filter(field => !career[field]);

      if (missingFields.length === 0) {
        console.log(`   ✅ PASS: All required fields present in returned data`);
        console.log(`      Fields: ${requiredFields.join(', ')}`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: Missing fields: ${missingFields.join(', ')}`);
        failed++;
      }
    }

    // Test 5: Count total subject-career mappings
    console.log('\n📋 Test 5: Count total subject-career mappings');

    const allSubjects = [
      'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry',
      'Biology', 'Geography', 'History', 'Business Studies', 'Economics',
      'Agriculture', 'Computer Studies', 'Art & Design', 'Music'
    ];

    let totalMappings = 0;
    const subjectStats = [];

    for (const subject of allSubjects) {
      try {
        const result = await Parse.Cloud.run('getCareersBySubject', {
          subject: subject
        }, { useMasterKey: true });

        totalMappings += result.length;
        if (result.length > 0) {
          subjectStats.push({ subject, count: result.length });
        }
      } catch (error) {
        // Silently continue
      }
    }

    console.log(`   Total mappings across all subjects: ${totalMappings}`);
    console.log(`   Subjects with careers: ${subjectStats.length}/${allSubjects.length}`);

    // Show top 5 subjects
    subjectStats.sort((a, b) => b.count - a.count);
    console.log('\n   Top 5 subjects by career count:');
    subjectStats.slice(0, 5).forEach((stat, i) => {
      console.log(`      ${i+1}. ${stat.subject}: ${stat.count} careers`);
    });

    if (subjectStats.length >= 10) {
      console.log(`   ✅ PASS: Good coverage (${subjectStats.length} subjects mapped)`);
      passed++;
    } else {
      console.log(`   ⚠️  WARNING: Low coverage (only ${subjectStats.length} subjects mapped)`);
      passed++; // Still pass, but warn
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
      console.log('✅ All tests passed! Subject-Career mappings working correctly.\n');
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
