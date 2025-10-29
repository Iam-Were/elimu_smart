/**
 * Complete RIASEC Assessment - Browser Automation
 * This runs directly in the browser via Puppeteer-style automation
 */

const puppeteer = require('puppeteer');

async function autoCompleteRiasec() {
  let browser;
  
  try {
    console.log('🚀 Launching browser...\n');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to site
    console.log('🌐 Navigating to https://elimu-smart.co.ke...');
    await page.goto('https://elimu-smart.co.ke/assessment/riasec', {
      waitUntil: 'networkidle2'
    });
    
    console.log('⏳ Waiting for login...');
    console.log('👉 Please log in if not already logged in');
    console.log('👉 Press Enter when ready to continue...');
    
    // Wait for user to log in
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    // Execute completion script
    console.log('\n📝 Starting RIASEC auto-completion...\n');
    
    const result = await page.evaluate(async () => {
      const sessionToken = localStorage.getItem('parse-session-token');
      
      if (!sessionToken) {
        return { error: 'No session token found' };
      }

      // Initialize Parse
      Parse.initialize('elimuSmartAppId');
      Parse.serverURL = 'https://elimu-smart.co.ke/parse';
      
      try {
        await Parse.User.become(sessionToken);
        const username = Parse.User.current().get('username');

        // Start assessment
        const startResult = await Parse.Cloud.run('startRiasecAssessment');
        const assessmentId = startResult.assessmentId;

        // Save all 96 responses
        const likertScale = [1, 2, 3, 4, 5];
        
        for (let i = 1; i <= 96; i++) {
          const randomResponse = likertScale[Math.floor(Math.random() * likertScale.length)];
          await Parse.Cloud.run('saveRiasecResponse', {
            assessmentId: assessmentId,
            questionNumber: i,
            response: randomResponse
          });
        }

        // Complete assessment
        const results = await Parse.Cloud.run('completeRiasecAssessment', {
          assessmentId: assessmentId
        });

        return {
          success: true,
          username: username,
          assessmentId: assessmentId,
          riasecScores: results.riasecScores,
          careerProfile: results.careerProfile
        };

      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (result.error) {
      console.error('❌ Error:', result.error);
      return;
    }
    
    console.log('✨ ASSESSMENT COMPLETED! ✨\n');
    console.log('👤 User:', result.username);
    console.log('📊 Assessment ID:', result.assessmentId);
    console.log('\n🎯 RIASEC Scores:');
    
    if (result.riasecScores) {
      const sortedScores = Object.entries(result.riasecScores)
        .sort((a, b) => b[1] - a[1]);
      
      sortedScores.forEach(([dimension, score], index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        console.log(`  ${emoji} ${dimension}: ${score}/100`);
      });
    }
    
    console.log('\n📈 Career Profile:', result.careerProfile);
    console.log('\n🔗 Navigating to dashboard...');
    
    await page.goto('https://elimu-smart.co.ke/dashboard');
    
    console.log('✅ Done! Check the browser to see dashboard changes.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

autoCompleteRiasec();
