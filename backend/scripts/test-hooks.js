// Test script to verify hooks are working
const Parse = require('parse/node');

// Initialize Parse
Parse.initialize('elimu-smart-production');
Parse.serverURL = 'http://localhost:1337/parse';
Parse.masterKey = process.env.MASTER_KEY;

async function testHooks() {
  try {
    console.log('🧪 Testing Parse Hooks...\n');
    
    // Test 1: Create a user to trigger afterSave(Parse.User) hook
    console.log('1. Testing User afterSave hook...');
    
    const testUser = new Parse.User();
    testUser.set('username', 'test-hook-user@elimu.com');
    testUser.set('email', 'test-hook-user@elimu.com');
    testUser.set('password', 'testpassword');
    testUser.set('firstName', 'Hook');
    testUser.set('lastName', 'Test');
    testUser.set('role', 'student');
    testUser.set('isActive', true);

    await testUser.signUp(null, { useMasterKey: true });
    console.log('✅ Test user created - afterSave hook should have triggered');
    
    // Wait a moment for hook to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if StudentProgress was created by the hook
    const progressQuery = new Parse.Query('StudentProgress');
    progressQuery.equalTo('user', testUser);
    const progress = await progressQuery.first({ useMasterKey: true });
    
    if (progress) {
      console.log('✅ Hook SUCCESS: StudentProgress created automatically');
      console.log(`   - User ID: ${testUser.id}`);
      console.log(`   - Progress ID: ${progress.id}`);
      console.log(`   - Career Readiness Score: ${progress.get('careerReadinessScore')}`);
    } else {
      console.log('❌ Hook FAILED: No StudentProgress found');
    }
    
    // Cleanup: Delete test user
    await testUser.destroy({ useMasterKey: true });
    if (progress) {
      await progress.destroy({ useMasterKey: true });
    }
    console.log('🧹 Cleaned up test data');
    
  } catch (error) {
    console.error('❌ Hook test failed:', error.message);
  }
}

// Run the test
testHooks().then(() => {
  console.log('\n🎉 Hook testing completed!');
  process.exit(0);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});