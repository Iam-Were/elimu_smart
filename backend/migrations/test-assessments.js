/**
 * Test Suite: Assessment Data (RIASEC & Skills)
 *
 * Tests both RIASEC and Skills assessment data
 * Verifies Cloud Functions work correctly
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
  console.log('🧪 Starting Assessment Data Tests...\n');

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Verify RIASEC questions count
    console.log('📋 Test 1: Verify RIASEC questions in database');
    const RiasecQuestion = Parse.Object.extend('RiasecQuestion');
    const riasecQuery = new Parse.Query(RiasecQuestion);
    const riasecCount = await riasecQuery.count({ useMasterKey: true });

    if (riasecCount === 96) {
      console.log(`   ✅ PASS: Found ${riasecCount} RIASEC questions (expected 96)`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 96 RIASEC questions, found ${riasecCount}`);
      failed++;
    }

    // Test 2: Verify Skills questions count
    console.log('\n📋 Test 2: Verify Skills questions in database');
    const SkillQuestion = Parse.Object.extend('SkillQuestion');
    const skillQuery = new Parse.Query(SkillQuestion);
    const skillCount = await skillQuery.count({ useMasterKey: true });

    if (skillCount === 36) {
      console.log(`   ✅ PASS: Found ${skillCount} Skills questions (expected 36)`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 36 Skills questions, found ${skillCount}`);
      failed++;
    }

    // Test 3: Verify RIASEC question structure
    console.log('\n📋 Test 3: Verify RIASEC question structure');
    const sampleRiasec = await riasecQuery.first({ useMasterKey: true });

    if (sampleRiasec) {
      const requiredFields = ['questionId', 'category', 'statement', 'riasecType', 'isActive'];
      const missingFields = requiredFields.filter(f => !sampleRiasec.has(f));

      if (missingFields.length === 0) {
        console.log(`   ✅ PASS: All required fields present`);
        console.log(`      Sample: Q${sampleRiasec.get('questionId')} - ${sampleRiasec.get('statement').substring(0, 50)}...`);
        console.log(`      Type: ${sampleRiasec.get('riasecType')}, Category: ${sampleRiasec.get('category')}`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: Missing fields: ${missingFields.join(', ')}`);
        failed++;
      }
    }

    // Test 4: Verify Skills question structure
    console.log('\n📋 Test 4: Verify Skills question structure');
    const sampleSkill = await skillQuery.first({ useMasterKey: true });

    if (sampleSkill) {
      const requiredFields = ['questionId', 'text', 'category', 'isActive'];
      const missingFields = requiredFields.filter(f => !sampleSkill.has(f));

      if (missingFields.length === 0) {
        console.log(`   ✅ PASS: All required fields present`);
        console.log(`      Sample: Q${sampleSkill.get('questionId')} - ${sampleSkill.get('text').substring(0, 50)}...`);
        console.log(`      Category: ${sampleSkill.get('category')}`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: Missing fields: ${missingFields.join(', ')}`);
        failed++;
      }
    }

    // Test 5: Test getRiasecQuestions Cloud Function
    console.log('\n📋 Test 5: Test getRiasecQuestions Cloud Function');

    try {
      const riasecResult = await Parse.Cloud.run('getRiasecQuestions', {}, { useMasterKey: true });

      if (riasecResult && riasecResult.length > 0) {
        console.log(`   ✅ PASS: Cloud Function returned ${riasecResult.length} questions`);
        console.log(`      Categories: ${[...new Set(riasecResult.map(q => q.category))].join(', ')}`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: No questions returned`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ FAIL: Cloud Function error: ${error.message}`);
      failed++;
    }

    // Test 6: Test getSkillsQuestions Cloud Function
    console.log('\n📋 Test 6: Test getSkillsQuestions Cloud Function');

    try {
      const skillsResult = await Parse.Cloud.run('getSkillsQuestions', {}, { useMasterKey: true });

      if (skillsResult && skillsResult.length > 0) {
        console.log(`   ✅ PASS: Cloud Function returned ${skillsResult.length} questions`);
        const categories = [...new Set(skillsResult.map(q => q.category))];
        console.log(`      Categories (${categories.length}): ${categories.join(', ')}`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: No questions returned`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ FAIL: Cloud Function error: ${error.message}`);
      failed++;
    }

    // Test 7: Verify RIASEC types distribution
    console.log('\n📋 Test 7: Verify RIASEC types distribution');

    const typeStats = {};
    const allRiasec = await riasecQuery.find({ useMasterKey: true });

    for (const q of allRiasec) {
      const type = q.get('riasecType');
      typeStats[type] = (typeStats[type] || 0) + 1;
    }

    console.log('   RIASEC Type Distribution:');
    Object.entries(typeStats).sort().forEach(([type, count]) => {
      const typeName = {
        'R': 'Realistic',
        'I': 'Investigative',
        'A': 'Artistic',
        'S': 'Social',
        'E': 'Enterprising',
        'C': 'Conventional'
      }[type] || type;
      console.log(`      ${type} (${typeName}): ${count} questions`);
    });

    if (Object.keys(typeStats).length === 6) {
      console.log(`   ✅ PASS: All 6 RIASEC types present`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 6 types, found ${Object.keys(typeStats).length}`);
      failed++;
    }

    // Test 8: Verify Skills categories distribution
    console.log('\n📋 Test 8: Verify Skills categories distribution');

    const catStats = {};
    const allSkills = await skillQuery.find({ useMasterKey: true });

    for (const q of allSkills) {
      const cat = q.get('category');
      catStats[cat] = (catStats[cat] || 0) + 1;
    }

    console.log('   Skills Category Distribution:');
    Object.entries(catStats).forEach(([cat, count]) => {
      console.log(`      ${cat}: ${count} questions`);
    });

    if (Object.keys(catStats).length === 6) {
      console.log(`   ✅ PASS: All 6 skill categories present`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 6 categories, found ${Object.keys(catStats).length}`);
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
      console.log('✅ All tests passed! Assessment data migration successful.\n');
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
