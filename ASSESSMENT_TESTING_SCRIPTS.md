# Assessment Testing Scripts

## 🧪 Quick Assessment Verification Tests

### 1. Backend API Testing Script

```javascript
// File: test-assessment-api.js
// Quick test for assessment Cloud Functions

const API_URL = 'http://localhost:1337/parse';
const APP_ID = 'elimu-smart-app-id';

async function testAssessmentAPI() {
  console.log('🧪 Testing Assessment API Endpoints...\n');
  
  // Test 1: Start Assessment
  console.log('1. Testing startRiasecAssessment...');
  try {
    const startResponse = await fetch(`${API_URL}/functions/startRiasecAssessment`, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-Session-Token': 'YOUR_SESSION_TOKEN', // Replace with actual token
        'Content-Type': 'application/json'
      }
    });
    
    const startData = await startResponse.json();
    console.log('✅ Start Assessment:', startData);
    
    const assessmentId = startData.result?.assessmentId;
    
    if (assessmentId) {
      // Test 2: Save Response
      console.log('\n2. Testing saveRiasecResponse...');
      const saveResponse = await fetch(`${API_URL}/functions/saveRiasecResponse`, {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-Session-Token': 'YOUR_SESSION_TOKEN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assessmentId,
          questionId: 1,
          response: 3,
          questionData: {
            text: "Test question",
            riasecType: "R"
          }
        })
      });
      
      const saveData = await saveResponse.json();
      console.log('✅ Save Response:', saveData);
      
      // Test 3: Complete Assessment
      console.log('\n3. Testing completeRiasecAssessment...');
      const completeResponse = await fetch(`${API_URL}/functions/completeRiasecAssessment`, {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-Session-Token': 'YOUR_SESSION_TOKEN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assessmentId })
      });
      
      const completeData = await completeResponse.json();
      console.log('✅ Complete Assessment:', completeData);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
}

// Run the test
testAssessmentAPI();
```

### 2. Frontend Component Testing Script

```javascript
// File: test-assessment-components.js
// Test assessment components in browser console

// Test 1: Verify assessment cards load
function testAssessmentCards() {
  console.log('🧪 Testing Assessment Cards...');
  
  const cards = document.querySelectorAll('[data-testid*="assessment-card"]');
  console.log(`Found ${cards.length} assessment cards`);
  
  cards.forEach((card, index) => {
    const title = card.querySelector('h3')?.textContent;
    const button = card.querySelector('button');
    console.log(`Card ${index + 1}: "${title}" - Button enabled: ${!button?.disabled}`);
  });
}

// Test 2: Verify question navigation
function testQuestionNavigation() {
  console.log('🧪 Testing Question Navigation...');
  
  const currentQuestion = document.querySelector('[data-testid="current-question"]');
  const totalQuestions = document.querySelector('[data-testid="total-questions"]');
  const progressBar = document.querySelector('[data-testid="progress-bar"]');
  
  console.log('Current Question:', currentQuestion?.textContent);
  console.log('Total Questions:', totalQuestions?.textContent);
  console.log('Progress Bar Width:', progressBar?.style.width);
}

// Test 3: Verify response selection
function testResponseSelection() {
  console.log('🧪 Testing Response Selection...');
  
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  const nextButton = document.querySelector('[data-testid="next-button"]');
  
  console.log(`Found ${radioButtons.length} response options`);
  console.log('Next button enabled:', !nextButton?.disabled);
  
  // Simulate selection
  if (radioButtons.length > 0) {
    radioButtons[2].click(); // Select middle option
    setTimeout(() => {
      console.log('After selection - Next button enabled:', !nextButton?.disabled);
    }, 100);
  }
}

// Run all component tests
function runComponentTests() {
  testAssessmentCards();
  testQuestionNavigation();
  testResponseSelection();
}
```

### 3. Database Verification Script

```javascript
// File: verify-assessment-data.js
// Check Parse Server for assessment data

const Parse = require('parse/node');

Parse.initialize('elimu-smart-app-id');
Parse.serverURL = 'http://localhost:1337/parse';

async function verifyAssessmentData() {
  console.log('🧪 Verifying Assessment Database Data...\n');
  
  try {
    // Check RiasecAssessment records
    const AssessmentQuery = new Parse.Query('RiasecAssessment');
    AssessmentQuery.descending('createdAt');
    AssessmentQuery.limit(5);
    const assessments = await AssessmentQuery.find({ useMasterKey: true });
    
    console.log(`Found ${assessments.length} recent assessments:`);
    assessments.forEach((assessment, index) => {
      console.log(`${index + 1}. Status: ${assessment.get('status')}, Questions: ${Object.keys(assessment.get('responses') || {}).length}/96`);
    });
    
    // Check UserActivity logs
    const ActivityQuery = new Parse.Query('UserActivity');
    ActivityQuery.contains('activityType', 'riasec');
    ActivityQuery.descending('createdAt');
    ActivityQuery.limit(10);
    const activities = await ActivityQuery.find({ useMasterKey: true });
    
    console.log(`\nFound ${activities.length} assessment activities:`);
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.get('activityType')} at ${activity.get('timestamp')}`);
    });
    
    // Check Email logs
    const EmailQuery = new Parse.Query('EmailLog');
    EmailQuery.equalTo('type', 'assessment_completion');
    EmailQuery.descending('createdAt');
    EmailQuery.limit(5);
    const emails = await EmailQuery.find({ useMasterKey: true });
    
    console.log(`\nFound ${emails.length} assessment completion emails:`);
    emails.forEach((email, index) => {
      console.log(`${index + 1}. To: ${email.get('recipient')}, Status: ${email.get('status')}`);
    });
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  }
}

verifyAssessmentData();
```

## 🎯 Manual Testing Checklists

### Checklist 1: Assessment Discovery
- [ ] Navigate to `/student/dashboard`
- [ ] Verify assessment cards are visible
- [ ] Check card styling and hover effects
- [ ] Verify "Start Assessment" buttons work
- [ ] Test card completion status indicators

### Checklist 2: Assessment Flow
- [ ] Start RIASEC assessment
- [ ] Verify question 1 loads properly
- [ ] Test rating scale (1-5) on multiple questions
- [ ] Check progress indicator updates
- [ ] Test "Previous" and "Next" navigation
- [ ] Complete all 96 questions
- [ ] Verify results page loads

### Checklist 3: Data Persistence
- [ ] Start assessment, answer 10 questions
- [ ] Close browser/refresh page
- [ ] Return to assessment
- [ ] Verify progress resumed correctly
- [ ] Complete assessment
- [ ] Check backend for saved data

### Checklist 4: Results Validation
- [ ] Complete assessment with known pattern
- [ ] Verify RIASEC scores calculated correctly
- [ ] Check Holland Code generation
- [ ] Review career matches for Kenya relevance
- [ ] Test results download/sharing
- [ ] Verify results persist on revisit

## 🚀 Quick Verification Commands

### Start Backend Test
```bash
cd backend
node test-assessment-api.js
```

### Start Frontend Test
```bash
cd frontend
npm run dev
# Open browser console and run:
# runComponentTests()
```

### Verify Database
```bash
cd backend
node verify-assessment-data.js
```

### Performance Test
```bash
# Open Chrome DevTools
# Go to Lighthouse tab
# Run performance audit on assessment pages
# Ensure scores > 90 for Performance, Accessibility
```

This comprehensive testing approach ensures your assessment system works correctly across all scenarios!