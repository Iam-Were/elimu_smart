/**
 * Auto-complete RIASEC Assessment Script
 * This script simulates a student completing all 96 RIASEC questions
 */

// Get session token from browser localStorage
console.log('INSTRUCTIONS:');
console.log('1. Open https://elimu-smart.co.ke in your browser');
console.log('2. Open DevTools Console (F12)');
console.log('3. Copy and paste this entire script');
console.log('4. Press Enter to run');
console.log('\n=== SCRIPT START ===\n');

(async () => {
  const sessionToken = localStorage.getItem('parse-session-token');
  
  if (!sessionToken) {
    console.error('❌ No session token found. Please log in first.');
    return;
  }

  console.log('✅ Session token found');
  console.log('🚀 Starting RIASEC auto-completion...\n');

  // Initialize Parse
  Parse.initialize('elimuSmartAppId');
  Parse.serverURL = 'https://elimu-smart.co.ke/parse';
  
  try {
    // Authenticate
    await Parse.User.become(sessionToken);
    console.log('✅ Authenticated as:', Parse.User.current().get('username'));

    // Start assessment
    console.log('\n📝 Starting RIASEC assessment...');
    const startResult = await Parse.Cloud.run('startRiasecAssessment');
    console.log('✅ Assessment started:', startResult.assessmentId);

    // Generate random responses for all 96 questions (IIP markers)
    const responses = [];
    const likertScale = [1, 2, 3, 4, 5]; // 1=Strongly Disagree, 5=Strongly Agree
    
    for (let i = 1; i <= 96; i++) {
      // Random response with slight bias toward 3-4 (neutral to agree)
      const randomResponse = likertScale[Math.floor(Math.random() * likertScale.length)];
      responses.push({
        questionNumber: i,
        response: randomResponse
      });
    }

    console.log(`\n💾 Saving ${responses.length} responses...`);
    
    // Save responses in batches of 10
    const batchSize = 10;
    for (let i = 0; i < responses.length; i += batchSize) {
      const batch = responses.slice(i, i + batchSize);
      const progress = Math.min(i + batchSize, responses.length);
      
      for (const response of batch) {
        await Parse.Cloud.run('saveRiasecResponse', {
          assessmentId: startResult.assessmentId,
          questionNumber: response.questionNumber,
          response: response.response
        });
      }
      
      console.log(`  ✓ Progress: ${progress}/96 questions (${Math.round(progress/96*100)}%)`);
    }

    console.log('✅ All responses saved');

    // Complete assessment
    console.log('\n🎯 Completing assessment and calculating results...');
    const results = await Parse.Cloud.run('completeRiasecAssessment', {
      assessmentId: startResult.assessmentId
    });

    console.log('\n✨ ASSESSMENT COMPLETED! ✨\n');
    console.log('📊 Results:');
    console.log('Assessment ID:', startResult.assessmentId);
    console.log('\n🎯 RIASEC Scores:');
    
    if (results.riasecScores) {
      const sortedScores = Object.entries(results.riasecScores)
        .sort((a, b) => b[1] - a[1]);
      
      sortedScores.forEach(([dimension, score], index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        console.log(`  ${emoji} ${dimension}: ${score}/100`);
      });
    }

    console.log('\n📈 Career Profile:', results.careerProfile || 'Calculating...');
    console.log('\n✅ Navigate to /assessment/riasec to see full results');
    console.log('\n🔗 Or go directly to: https://elimu-smart.co.ke/assessment/riasec');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
  }
})();

console.log('\n=== SCRIPT END ===');
