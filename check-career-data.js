const Parse = require('parse/node');

Parse.initialize('elimuSmartAppId');
Parse.serverURL = 'https://elimu-smart.co.ke/parse';

(async () => {
  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);
    query.equalTo('title', 'Data Scientist');
    const career = await query.first({ useMasterKey: true });
    
    if (career) {
      console.log('\n📊 Data Scientist Career Object:');
      console.log('Title:', career.get('title'));
      console.log('Description:', career.get('description') ? 'EXISTS' : 'MISSING');
      console.log('Daily Tasks:', career.get('dailyTasks') || 'MISSING');
      console.log('Skills:', career.get('skills') || 'MISSING');
      console.log('Personality Traits:', career.get('personalityTraits') || 'MISSING');
      console.log('Career Progression:', career.get('careerProgression') ? 'EXISTS' : 'MISSING');
      console.log('Education Path:', career.get('educationPath') || 'MISSING');
      console.log('Kenya Specific:', career.get('kenyaSpecific') || 'MISSING');
      console.log('Challenges:', career.get('challenges') || 'MISSING');
      console.log('Rewards:', career.get('rewards') || 'MISSING');
      
      console.log('\n✅ Full object keys:', Object.keys(career.attributes));
    } else {
      console.log('❌ Career not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
