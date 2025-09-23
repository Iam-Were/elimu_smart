// Quick database check script
const { Client } = require('pg');

async function checkDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'elimu_smart_dev',
    password: 'password',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database: elimu_smart_dev');
    
    // List all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check if we have any users
    try {
      const userCount = await client.query('SELECT COUNT(*) FROM "_User"');
      console.log(`\n👥 Users in database: ${userCount.rows[0].count}`);
      
      // Show some user data (without passwords)
      const users = await client.query('SELECT "objectId", "username", "email", "role", "createdAt" FROM "_User" LIMIT 5');
      if (users.rows.length > 0) {
        console.log('\n👤 Sample users:');
        users.rows.forEach(user => {
          console.log(`  - ${user.username} (${user.email}) - Role: ${user.role}`);
        });
      }
    } catch (err) {
      console.log('\n⚠️ User table might not exist yet or has different structure');
    }
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await client.end();
  }
}

checkDatabase();