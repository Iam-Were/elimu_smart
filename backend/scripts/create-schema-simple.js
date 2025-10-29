const Parse = require('parse/node');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;

async function createClasses() {
  console.log('Creating AssessmentResult class...');
  
  const AssessmentResult = Parse.Object.extend('AssessmentResult');
  const result = new AssessmentResult();
  
  result.set('user', { __type: 'Pointer', className: '_User', objectId: 'init' });
  result.set('assessmentType', 'init');
  result.set('responses', {});
  result.set('scores', {});
  result.set('results', {});
  result.set('completedAt', new Date());
  result.set('isActive', false);
  
  try {
    await result.save(null, { useMasterKey: true });
    console.log('✅ AssessmentResult class created successfully!');
    
    // Delete the test record
    await result.destroy({ useMasterKey: true });
    console.log('✅ Test record cleaned up');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createClasses();
