const Parse = require('parse/node');

// Initialize Parse
Parse.initialize('elimu_smart_app_2024');
Parse.serverURL = 'https://elimu-smart.co.ke/parse';
Parse.masterKey = 'ElImuSmartMasterKey2024Secure';

async function fixCareerGoalSchema() {
  try {
    console.log('🔧 Fixing CareerGoal schema...');
    
    // Define schema with proper Pointer type
    const schema = new Parse.Schema('CareerGoal');
    
    // Check if schema exists, if so, update it
    try {
      await schema.get();
      console.log('✅ CareerGoal schema already exists, updating...');
      await schema.update();
    } catch (err) {
      console.log('📝 Creating new CareerGoal schema...');
      schema
        .addPointer('user', '_User')  // Proper pointer definition
        .addString('goal')
        .addString('description')
        .addArray('milestones')
        .addDate('targetDate');
      
      await schema.save({ useMasterKey: true });
    }
    
    console.log('✅ CareerGoal schema fixed successfully');
    
    // Test query
    const CareerGoal = Parse.Object.extend('CareerGoal');
    const query = new Parse.Query(CareerGoal);
    query.limit(1);
    const result = await query.first({ useMasterKey: true });
    console.log('✅ Test query successful:', result ? result.id : 'No results');
    
  } catch (error) {
    console.error('❌ Failed to fix schema:', error);
    process.exit(1);
  }
}

fixCareerGoalSchema().then(() => {
  console.log('✅ Done');
  process.exit(0);
});
