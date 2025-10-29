/**
 * Auto-complete RIASEC Assessment - Node.js Script
 * Run with: node run-riasec-completion.js
 */

const Parse = require('parse/node');

// Configuration
Parse.initialize('elimuSmartAppId');
Parse.serverURL = 'https://elimu-smart.co.ke/parse';

// Get session token from command line or use default
const sessionToken = process.argv[2] || 'YOUR_SESSION_TOKEN_HERE';

async function completeRiasecAssessment() {
  try {
    console.log('🚀 Starting RIASEC Auto-Completion...\n');

    // Authenticate
    console.log('🔐 Authenticating...');
    const user = await Parse.User.become(sessionToken);
    console.log('✅ Logged in as:', user.get('username'));

    // Start assessment
    console.log('\n📝 Starting new RIASEC assessment...');
    const startResult = await Parse.Cloud.run('startRiasecAssessment');
    const assessmentId = startResult.assessmentId;
    console.log('✅ Assessment ID:', assessmentId);

    // Generate responses
    console.log('\n💾 Saving 96 responses...');
    const likertScale = [1, 2, 3, 4, 5];
    
    for (let i = 1; i <= 96; i++) {
      const randomResponse = likertScale[Math.floor(Math.random() * likertScale.length)];
      
      await Parse.Cloud.run('saveRiasecResponse', {
        assessmentId: assessmentId,
        questionNumber: i,
        response: randomResponse
      });

      // Progress indicator
      if (i % 10 === 0 || i === 96) {
        const percentage = Math.round((i / 96) * 100);
        console.log(`  ✓ Progress: ${i}/96 questions (${percentage}%)`);
      }
    }

    console.log('✅ All responses saved');

    // Complete assessment
    console.log('\n🎯 Completing assessment and calculating results...');
    const results = await Parse.Cloud.run('completeRiasecAssessment', {
      assessmentId: assessmentId
    });

    console.log('\n✨ ASSESSMENT COMPLETED! ✨\n');
    console.log('📊 RIASEC Scores:');
    
    if (results.riasecScores) {
      const sortedScores = Object.entries(results.riasecScores)
        .sort((a, b) => b[1] - a[1]);
      
      sortedScores.forEach(([dimension, score], index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        const bar = '█'.repeat(Math.round(score / 5));
        console.log(`  ${emoji} ${dimension.padEnd(15)} ${score.toFixed(1).padStart(5)}/100 ${bar}`);
      });
    }

    console.log('\n📈 Career Profile:', results.careerProfile || 'Calculating...');
    console.log('\n🔗 View results: https://elimu-smart.co.ke/dashboard');
    console.log('🔗 Or: https://elimu-smart.co.ke/assessment/riasec');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

// Check if session token is provided
if (sessionToken === 'YOUR_SESSION_TOKEN_HERE') {
  console.log('❌ Please provide your session token:');
  console.log('\n1. Open https://elimu-smart.co.ke in browser');
  console.log('2. Open DevTools Console (F12)');
  console.log('3. Run: localStorage.getItem("parse-session-token")');
  console.log('4. Copy the token and run:');
  console.log('   node run-riasec-completion.js "YOUR_TOKEN_HERE"\n');
  process.exit(1);
}

completeRiasecAssessment();
