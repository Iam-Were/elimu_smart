/**
 * Direct PostgreSQL seed script
 * Bypasses Parse Server to create demo users directly in database
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Get environment from command line arg or default to development
const environment = process.argv[2] || 'development';

const configs = {
  development: {
    connectionString: 'postgres://postgres:password@localhost:5432/elimu_smart_dev'
  },
  staging: {
    connectionString: 'postgres://postgres:El1musmart2024@localhost:5432/elimu_smart_staging'
  },
  production: {
    connectionString: 'postgres://postgres:El1musmart2024@localhost:5432/elimu_smart_production'
  }
};

const config = configs[environment];

if (!config) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.log('Usage: node seed-users-direct.js [development|staging|production]');
  process.exit(1);
}

const demoUsers = [
  {
    username: 'student@elimu.com',
    email: 'student@elimu.com',
    password: 'student',
    firstName: 'Alex',
    lastName: 'Mwangi',
    role: 'student'
  },
  {
    username: 'sarah.counselor@elimu.com',
    email: 'sarah.counselor@elimu.com',
    password: 'counselor2024',
    firstName: 'Sarah',
    lastName: 'Njeri',
    role: 'counselor'
  },
  {
    username: 'james.coach@elimu.com',
    email: 'james.coach@elimu.com',
    password: 'coach2024',
    firstName: 'James',
    lastName: 'Mutua',
    role: 'counselor'
  },
  {
    username: 'counselor@elimu.com',
    email: 'counselor@elimu.com',
    password: 'counselor',
    firstName: 'Demo',
    lastName: 'Counselor',
    role: 'counselor'
  },
  {
    username: 'mike.platform@elimu.com',
    email: 'mike.platform@elimu.com',
    password: 'platform2024',
    firstName: 'Mike',
    lastName: 'Kamau',
    role: 'admin',
    adminRoleType: 'platform'
  },
  {
    username: 'linda.operations@elimu.com',
    email: 'linda.operations@elimu.com',
    password: 'operations2024',
    firstName: 'Linda',
    lastName: 'Wambui',
    role: 'admin',
    adminRoleType: 'operations'
  },
  {
    username: 'peter.safety@elimu.com',
    email: 'peter.safety@elimu.com',
    password: 'safety2024',
    firstName: 'Peter',
    lastName: 'Otieno',
    role: 'admin',
    adminRoleType: 'provider_safety'
  },
  {
    username: 'admin@elimu.com',
    email: 'admin@elimu.com',
    password: 'admin',
    firstName: 'Demo',
    lastName: 'Admin',
    role: 'admin'
  }
];

async function seedUsers() {
  const client = new Client({ connectionString: config.connectionString });

  try {
    await client.connect();
    console.log(`🌍 Environment: ${environment}`);
    console.log(`🔗 Database: ${config.connectionString.replace(/:[^:@]+@/, ':****@')}\n`);

    let created = 0;
    let existing = 0;
    let errors = 0;

    for (const userData of demoUsers) {
      try {
        // Check if user exists
        const checkResult = await client.query(
          'SELECT "objectId" FROM "_User" WHERE email = $1',
          [userData.email]
        );

        if (checkResult.rows.length > 0) {
          console.log(`✅ User ${userData.email} already exists, skipping...`);
          existing++;
          continue;
        }

        // Generate Parse-compatible objectId (10 characters alphanumeric)
        const objectId = Math.random().toString(36).substring(2, 12);

        // Hash password with bcrypt (Parse Server uses bcrypt)
        const passwordHash = await bcrypt.hash(userData.password, 10);

        // Prepare user data
        const now = new Date();
        const userRecord = {
          objectId,
          username: userData.username,
          email: userData.email,
          password: passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          _created_at: now,
          _updated_at: now,
          emailVerified: false
        };

        // Build SQL query
        const columns = Object.keys(userRecord).map(k => `"${k}"`).join(', ');
        const values = Object.values(userRecord);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        // Add adminRoleType if admin
        let sql = `INSERT INTO "_User" (${columns}) VALUES (${placeholders})`;

        if (userData.adminRoleType) {
          sql = `INSERT INTO "_User" (${columns}, "adminRoleType") VALUES (${placeholders}, $${values.length + 1})`;
          values.push(userData.adminRoleType);
        }

        await client.query(sql, values);
        console.log(`✅ Created user: ${userData.email}`);
        created++;

      } catch (error) {
        console.error(`❌ Failed to create ${userData.email}:`, error.message);
        errors++;
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`   Created: ${created}`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Errors: ${errors}`);

    console.log(`\n📋 Demo Login Credentials:`);
    console.log(`Student: student@elimu.com / student`);
    console.log(`Counselor: sarah.counselor@elimu.com / counselor2024`);
    console.log(`Admin (Platform): mike.platform@elimu.com / platform2024`);
    console.log(`Admin (Operations): linda.operations@elimu.com / operations2024`);
    console.log(`Admin (Safety): peter.safety@elimu.com / safety2024`);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedUsers();
