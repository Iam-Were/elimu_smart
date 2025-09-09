// Create demo users via HTTP requests to avoid Parse initialization conflicts
const http = require('http');

// Demo users to create
const demoUsers = [
  {
    username: 'student@elimu.com',
    email: 'student@elimu.com', 
    password: 'student',
    firstName: 'Alex',
    lastName: 'Mwangi',
    role: 'student',
    isActive: true
  },
  {
    username: 'counselor@elimu.com',
    email: 'counselor@elimu.com',
    password: 'counselor', 
    firstName: 'Sarah',
    lastName: 'Njeri',
    role: 'counselor',
    isActive: true
  },
  {
    username: 'admin@elimu.com', 
    email: 'admin@elimu.com',
    password: 'admin',
    firstName: 'Mike',
    lastName: 'Kamau',
    role: 'admin',
    adminRoleType: 'platform',
    isActive: true
  }
];

// Function to create user via Parse REST API
function createUser(userData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(userData);
    
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: '/parse/users',
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': 'elimu-smart-local-dev',
        'X-Parse-Master-Key': 'elimu-smart-master-key-dev',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log(`✅ Created user: ${userData.email}`);
          resolve(JSON.parse(data));
        } else if (res.statusCode === 400 && data.includes('already taken')) {
          console.log(`ℹ️  User ${userData.email} already exists - skipping`);
          resolve(null);
        } else {
          console.log(`❌ Failed to create ${userData.email}: ${data}`);
          reject(new Error(data));
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Network error creating ${userData.email}: ${err.message}`);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Create all demo users
async function createAllDemoUsers() {
  console.log('🚀 Creating demo users via HTTP API...\n');
  
  for (const userData of demoUsers) {
    try {
      await createUser(userData);
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to create ${userData.email}:`, error.message);
    }
  }
  
  console.log('\n🎉 Demo user creation completed!');
  console.log('\n📧 Test login credentials:');
  console.log('Student: student@elimu.com / student');
  console.log('Counselor: counselor@elimu.com / counselor'); 
  console.log('Admin: admin@elimu.com / admin');
  
  process.exit(0);
}

createAllDemoUsers();