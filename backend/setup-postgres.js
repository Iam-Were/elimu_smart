// PostgreSQL Database Setup and Connection Test
const { Client } = require('pg');

// Different connection configurations to try
const configs = [
  {
    name: 'Default with password',
    config: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'password',
      database: 'postgres' // Connect to default postgres database first
    }
  },
  {
    name: 'No password (trust)',
    config: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      database: 'postgres'
    }
  },
  {
    name: 'Alternative password',
    config: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'postgres'
    }
  },
  {
    name: 'Empty password',
    config: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '',
      database: 'postgres'
    }
  }
];

async function testConnection(config) {
  const client = new Client(config.config);
  
  try {
    console.log(`🔍 Testing: ${config.name}`);
    await client.connect();
    console.log(`✅ ${config.name}: Connection successful!`);
    
    // Test a simple query
    const result = await client.query('SELECT version()');
    console.log(`📊 PostgreSQL Version: ${result.rows[0].version.substring(0, 50)}...`);
    
    return { success: true, config: config.config };
  } catch (error) {
    console.log(`❌ ${config.name}: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Ignore connection close errors
    }
  }
}

async function createDatabase(workingConfig) {
  const client = new Client(workingConfig);
  
  try {
    await client.connect();
    console.log('📊 Connected to PostgreSQL server');
    
    // Check if elimu_smart_dev database exists
    const dbCheckResult = await client.query(
      "SELECT datname FROM pg_database WHERE datname = 'elimu_smart_dev'"
    );
    
    if (dbCheckResult.rows.length > 0) {
      console.log('✅ Database elimu_smart_dev already exists');
    } else {
      console.log('🔧 Creating database elimu_smart_dev...');
      await client.query('CREATE DATABASE elimu_smart_dev');
      console.log('✅ Database elimu_smart_dev created successfully');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Database creation error: ${error.message}`);
    return false;
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Ignore connection close errors
    }
  }
}

async function testTargetDatabase(workingConfig) {
  const targetConfig = { ...workingConfig, database: 'elimu_smart_dev' };
  const client = new Client(targetConfig);
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to elimu_smart_dev database');
    
    // Test creating a simple table
    await client.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Insert test data
    await client.query(
      "INSERT INTO connection_test (test_message) VALUES ('PostgreSQL connection working!')"
    );
    
    // Read test data
    const result = await client.query('SELECT * FROM connection_test ORDER BY created_at DESC LIMIT 1');
    console.log(`📝 Test data: ${result.rows[0].test_message}`);
    
    // Clean up test table
    await client.query('DROP TABLE connection_test');
    console.log('🧹 Test table cleaned up');
    
    return targetConfig;
  } catch (error) {
    console.log(`❌ Target database test error: ${error.message}`);
    return null;
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Ignore connection close errors
    }
  }
}

async function setupPostgreSQL() {
  console.log('🚀 PostgreSQL Setup and Connection Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  let workingConfig = null;
  
  // Test different connection methods
  for (const config of configs) {
    const result = await testConnection(config);
    if (result.success) {
      workingConfig = result.config;
      console.log(`✅ Found working configuration: ${config.name}`);
      break;
    }
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!workingConfig) {
    console.log('');
    console.log('❌ No working PostgreSQL connection found!');
    console.log('');
    console.log('📋 Possible Solutions:');
    console.log('   1. Check if PostgreSQL service is running');
    console.log('   2. Verify pg_hba.conf allows local connections');
    console.log('   3. Reset postgres user password');
    console.log('   4. Check PostgreSQL installation');
    console.log('');
    process.exit(1);
  }
  
  console.log('');
  console.log('🔧 Setting up elimu_smart_dev database...');
  
  // Create the database
  const dbCreated = await createDatabase(workingConfig);
  if (!dbCreated) {
    console.log('❌ Failed to create database');
    process.exit(1);
  }
  
  console.log('');
  console.log('🧪 Testing target database connection...');
  
  // Test connection to target database
  const finalConfig = await testTargetDatabase(workingConfig);
  if (!finalConfig) {
    console.log('❌ Failed to connect to target database');
    process.exit(1);
  }
  
  console.log('');
  console.log('✅ PostgreSQL Setup Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Working Configuration:');
  console.log(`   Host: ${finalConfig.host}`);
  console.log(`   Port: ${finalConfig.port}`);
  console.log(`   User: ${finalConfig.user}`);
  console.log(`   Password: ${finalConfig.password ? '***' : '(none)'}`);
  console.log(`   Database: ${finalConfig.database}`);
  console.log('');
  console.log('🔗 Connection String for Parse Server:');
  
  const connectionString = finalConfig.password 
    ? `postgres://${finalConfig.user}:${finalConfig.password}@${finalConfig.host}:${finalConfig.port}/${finalConfig.database}`
    : `postgres://${finalConfig.user}@${finalConfig.host}:${finalConfig.port}/${finalConfig.database}`;
    
  console.log(`   ${connectionString}`);
  console.log('');
  console.log('📋 Next Steps:');
  console.log('   1. Update Parse Server configuration with this connection string');
  console.log('   2. Test Parse Server with PostgreSQL');
  console.log('   3. Verify all cloud functions are working');
  
  return finalConfig;
}

// Run the setup
if (require.main === module) {
  setupPostgreSQL().catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupPostgreSQL };