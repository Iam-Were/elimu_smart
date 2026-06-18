/**
 * Test Login Script
 * Tests if seeded users can login via Parse SDK
 */

const Parse = require('parse/node');

// Get environment from command line arg or default to development
const environment = process.argv[2] || 'development';

// Load correct .env file based on environment
if (environment === 'staging') {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env.staging') });
} else if (environment === 'production') {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
} else {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
}

const configs = {
  development: {
    appId: 'elimu-smart-production',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY
  },
  staging: {
    appId: process.env.APP_ID || 'elimu-smart-production',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY
  },
  production: {
    appId: process.env.APP_ID || 'elimu-smart-production',
    serverURL: 'http://localhost:1337/parse',
    masterKey: process.env.MASTER_KEY || 'CHANGE_THIS_MASTER_KEY'
  }
};

const config = configs[environment];

if (!config) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.log('Usage: node test-login.js [development|staging|production]');
  process.exit(1);
}

console.log(`🌍 Environment: ${environment}`);
console.log(`🔗 Server URL: ${config.serverURL}\n`);

// Initialize Parse
Parse.initialize(config.appId, null, config.masterKey);
Parse.serverURL = config.serverURL;

async function testLogin() {
  const testUsers = [
    { username: 'student@elimu.com', password: 'student', role: 'Student' },
    { username: 'counselor@elimu.com', password: 'counselor', role: 'Counselor' },
    { username: 'admin@elimu.com', password: 'admin', role: 'Admin' }
  ];

  let successes = 0;
  let failures = 0;

  for (const testUser of testUsers) {
    try {
      console.log(`🔐 Testing login: ${testUser.username}...`);

      const user = await Parse.User.logIn(testUser.username, testUser.password);

      console.log(`✅ Login successful!`);
      console.log(`   Username: ${user.get('username')}`);
      console.log(`   Email: ${user.get('email')}`);
      console.log(`   Role: ${user.get('role') || 'Not set'}`);
      console.log(`   Session Token: ${user.getSessionToken().substring(0, 20)}...`);
      console.log('');

      successes++;

      // Logout after each test
      await Parse.User.logOut();

    } catch (error) {
      console.log(`❌ Login failed: ${error.message}\n`);
      failures++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   Successful logins: ${successes}`);
  console.log(`   Failed logins: ${failures}`);

  if (failures === 0) {
    console.log(`\n✅ All users can login successfully!`);
  } else {
    console.log(`\n⚠️  Some users failed to login. Check bcrypt hash compatibility.`);
  }
}

testLogin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
