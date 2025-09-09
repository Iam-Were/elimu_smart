// Parse Server with PostgreSQL - Auto-setup and authentication handling
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
require('dotenv').config();

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// PostgreSQL connection configuration
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  // Try common default passwords or no password
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  database: 'elimu_smart_dev'
};

// Function to test PostgreSQL connection and create database if needed
async function setupPostgreSQL() {
  console.log('🔍 Testing PostgreSQL connection...');
  
  // Common passwords to try
  const passwordsToTry = [
    '', // No password (Windows auth)
    'postgres', // Common default
    'password', // Common default
    'admin', // Common default
    'root', // Common default
    process.env.DB_PASSWORD,
    process.env.POSTGRES_PASSWORD
  ].filter(Boolean);

  for (const password of passwordsToTry) {
    try {
      // Test connection to postgres database first
      const testClient = new Client({
        ...DB_CONFIG,
        password: password,
        database: 'postgres' // Connect to default postgres database
      });

      await testClient.connect();
      console.log(`✅ PostgreSQL connection successful with password: ${password ? '[set]' : '[empty]'}`);
      
      // Check if our target database exists
      const dbCheck = await testClient.query(
        "SELECT 1 FROM pg_database WHERE datname = 'elimu_smart_dev'"
      );
      
      if (dbCheck.rows.length === 0) {
        console.log('📅 Creating elimu_smart_dev database...');
        await testClient.query('CREATE DATABASE elimu_smart_dev');
        console.log('✅ Database elimu_smart_dev created successfully');
      } else {
        console.log('✅ Database elimu_smart_dev already exists');
      }
      
      await testClient.end();
      
      // Update our config with working password
      DB_CONFIG.password = password;
      return true;
      
    } catch (error) {
      console.log(`❌ Password '${password || '[empty]'}' failed: ${error.message}`);
      continue;
    }
  }
  
  throw new Error('Could not connect to PostgreSQL with any common passwords');
}

// Create Parse Server configuration
function createParseServer(databaseURI) {
  return new ParseServer({
    databaseURI: databaseURI,
    cloud: __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'elimu-smart-local-dev',
    masterKey: process.env.MASTER_KEY || 'elimu-smart-master-key-dev',
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
    
    // Production-ready settings
    verifyUserEmails: false,
    sessionLength: 31536000, // 1 year
    maxLimit: 100,
    logLevel: 'info',
    
    // Enable live query for real-time updates
    liveQuery: {
      classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress']
    }
  });
}

// Create Parse Dashboard
const dashboard = new ParseDashboard({
  apps: [{
    serverURL: 'http://localhost:1337/parse',
    appId: 'elimu-smart-local-dev',
    masterKey: 'elimu-smart-master-key-dev',
    appName: 'Elimu Smart - PostgreSQL'
  }],
  users: [{
    user: 'admin',
    pass: 'admin123',
    apps: [{ appId: 'elimu-smart-local-dev' }]
  }],
  useEncryptedPasswords: false
}, { allowInsecureHTTP: true });

// Start server function
async function startServer() {
  try {
    console.log('🚀 Starting Elimu Smart Parse Server with PostgreSQL...\n');
    
    // Setup PostgreSQL connection
    await setupPostgreSQL();
    
    // Create database URI
    const databaseURI = `postgres://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`;
    console.log(`📊 Database URI: postgres://${DB_CONFIG.user}:[password]@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
    
    // Create Parse Server instance
    const api = createParseServer(databaseURI);
    
    // Mount Parse Server and Dashboard
    app.use('/parse', api.app);
    app.use('/dashboard', dashboard);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        message: 'Elimu Smart Parse Server with PostgreSQL',
        database: 'PostgreSQL',
        nodeVersion: process.version,
        parseServerVersion: '8.2.4',
        timestamp: new Date().toISOString()
      });
    });
    
    // Start Express server
    const port = process.env.PORT || 1337;
    app.listen(port, () => {
      console.log('\n🎉 Elimu Smart Parse Server (PostgreSQL) started successfully!');
      console.log(`📊 Parse Dashboard: http://localhost:${port}/dashboard`);
      console.log(`⚡ API Server: http://localhost:${port}/parse`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log(`🔑 Dashboard Login: admin / admin123`);
      console.log(`🗄️  Database: PostgreSQL (${DB_CONFIG.database})`);
    });
    
  } catch (error) {
    console.error('\n❌ Failed to start server with PostgreSQL:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check if you can connect to PostgreSQL with pgAdmin');
    console.log('3. Try setting DB_PASSWORD environment variable');
    console.log('4. Check PostgreSQL authentication settings in pg_hba.conf');
    
    process.exit(1);
  }
}

startServer();