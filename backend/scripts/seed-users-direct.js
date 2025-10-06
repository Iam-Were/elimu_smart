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

        // Prepare user data (Parse Server standard columns only)
        const now = new Date();

        // Insert into _User table with standard Parse columns
        const sql = `
          INSERT INTO "_User" (
            "objectId",
            "username",
            "email",
            "_hashed_password",
            "emailVerified",
            "createdAt",
            "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        const values = [
          objectId,
          userData.username,
          userData.email,
          passwordHash,
          false,  // emailVerified
          now,    // createdAt
          now     // updatedAt
        ];

        await client.query(sql, values);

        // Update with custom fields (if columns exist)
        const updateSql = `
          UPDATE "_User"
          SET
            "firstName" = $1,
            "lastName" = $2,
            "role" = $3,
            "isActive" = $4
          WHERE "objectId" = $5
        `;

        try {
          await client.query(updateSql, [
            userData.firstName,
            userData.lastName,
            userData.role,
            true,
            objectId
          ]);
        } catch (updateError) {
          // Custom columns might not exist yet - that's okay
          console.log(`   ⚠️  Custom fields not added (columns may not exist yet)`);
        }
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
