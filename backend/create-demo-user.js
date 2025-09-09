// Simple script to create demo users via Parse REST API
const Parse = require('parse/node');

// Initialize Parse
Parse.initialize('elimu-smart-local-dev');
Parse.serverURL = 'http://localhost:1337/parse';
Parse.masterKey = 'elimu-smart-master-key-dev';

async function createDemoUser() {
  try {
    console.log('Creating demo student user...');

    // Create a demo student user
    const user = new Parse.User();
    user.set('username', 'student@elimu.com');
    user.set('email', 'student@elimu.com');
    user.set('password', 'student');
    user.set('firstName', 'Alex');
    user.set('lastName', 'Mwangi');
    user.set('role', 'student');
    user.set('isActive', true);

    await user.signUp(null, { useMasterKey: true });

    console.log('✅ Demo student user created successfully!');
    console.log('📧 Email: student@elimu.com');
    console.log('🔑 Password: student');
    console.log('👤 Role: student');

    // Try to create additional users
    const counselor = new Parse.User();
    counselor.set('username', 'counselor@elimu.com');
    counselor.set('email', 'counselor@elimu.com');
    counselor.set('password', 'counselor');
    counselor.set('firstName', 'Sarah');
    counselor.set('lastName', 'Njeri');
    counselor.set('role', 'counselor');
    counselor.set('isActive', true);

    await counselor.signUp(null, { useMasterKey: true });
    console.log('✅ Demo counselor user created successfully!');

    // Create admin user
    const admin = new Parse.User();
    admin.set('username', 'admin@elimu.com');
    admin.set('email', 'admin@elimu.com');
    admin.set('password', 'admin');
    admin.set('firstName', 'Mike');
    admin.set('lastName', 'Kamau');
    admin.set('role', 'admin');
    admin.set('adminRoleType', 'platform');
    admin.set('isActive', true);

    await admin.signUp(null, { useMasterKey: true });
    console.log('✅ Demo admin user created successfully!');

    console.log('\n🎉 All demo users created! You can now test authentication.');

  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
    
    if (error.code === 202) {
      console.log('ℹ️  User already exists - this is normal if you\'ve run this before');
    }
  }

  process.exit(0);
}

createDemoUser();