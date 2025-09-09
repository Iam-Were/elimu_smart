// Setup script for Elimu Smart Parse Server
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Elimu Smart Parse Server...\n');

// Check if PostgreSQL is running
function checkPostgreSQL() {
  return new Promise((resolve) => {
    const psql = spawn('psql', ['--version']);
    
    psql.on('close', (code) => {
      if (code === 0) {
        console.log('✅ PostgreSQL found');
        resolve(true);
      } else {
        console.log('❌ PostgreSQL not found or not in PATH');
        console.log('Please install PostgreSQL and ensure it\'s in your PATH');
        resolve(false);
      }
    });

    psql.on('error', () => {
      console.log('❌ PostgreSQL not found or not in PATH');
      console.log('Please install PostgreSQL and ensure it\'s in your PATH');
      resolve(false);
    });
  });
}

// Create database
function createDatabase() {
  return new Promise((resolve) => {
    console.log('📅 Creating database elimu_smart_dev...');
    
    const createDb = spawn('createdb', ['-U', 'postgres', 'elimu_smart_dev']);
    
    createDb.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Database elimu_smart_dev created');
        resolve(true);
      } else {
        console.log('ℹ️  Database may already exist (this is okay)');
        resolve(true); // Continue anyway
      }
    });

    createDb.on('error', () => {
      console.log('❌ Failed to create database');
      console.log('Please create database manually: createdb -U postgres elimu_smart_dev');
      resolve(false);
    });
  });
}

// Check if .env file exists and is configured
function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('your_password_here')) {
    console.log('⚠️  Please update DATABASE_URI in .env with your PostgreSQL password');
    return false;
  }

  console.log('✅ .env file configured');
  return true;
}

// Main setup function
async function runSetup() {
  console.log('🔍 Checking prerequisites...\n');

  // Check PostgreSQL
  const postgresqlOk = await checkPostgreSQL();
  if (!postgresqlOk) {
    console.log('\n❌ Setup failed: PostgreSQL not found');
    return;
  }

  // Check .env configuration
  const envOk = checkEnvFile();
  if (!envOk) {
    console.log('\n❌ Setup failed: .env file needs configuration');
    return;
  }

  // Try to create database
  await createDatabase();

  console.log('\n🎉 Setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Start the Parse Server: npm run dev');
  console.log('2. Seed demo data: node scripts/seed-data.js');
  console.log('3. Access Parse Dashboard: http://localhost:1337/dashboard');
  console.log('4. Update frontend to use Parse authentication');
}

runSetup().catch(console.error);