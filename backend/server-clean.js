// Clean Parse Server with PostgreSQL - Fixed configuration
const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');
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
  password: process.env.DB_PASSWORD || 'root', // Try 'root' as working password
  database: 'elimu_smart_dev'
};

// Function to test PostgreSQL connection
async function setupPostgreSQL() {
  console.log('🔍 Testing PostgreSQL connection...');
  
  const passwordsToTry = ['root', '', 'postgres', 'password', 'admin'];
  
  for (const password of passwordsToTry) {
    try {
      const testClient = new Client({
        ...DB_CONFIG,
        password: password,
        database: 'postgres'
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

// Start server function
async function startServer() {
  try {
    console.log('🚀 Starting Clean Parse Server with PostgreSQL...\\n');
    
    // Setup PostgreSQL connection
    await setupPostgreSQL();
    
    // Create database URI
    const databaseURI = `postgres://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`;
    console.log(`📊 Database URI: postgres://${DB_CONFIG.user}:[password]@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
    
    // Create Parse Server instance
    const api = new ParseServer({
      databaseURI: databaseURI,
      cloud: __dirname + '/cloud/main.js',
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      serverURL: 'http://localhost:1337/parse',
      
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

    // Wait for Parse Server to fully initialize
    await api.start();
    
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
    
    // Mount Parse Server and Dashboard
    app.use('/parse', api.app);
    app.use('/dashboard', dashboard);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        message: 'Clean Elimu Smart Parse Server with PostgreSQL',
        database: 'PostgreSQL',
        nodeVersion: process.version,
        parseServerVersion: require('parse-server/package.json').version,
        timestamp: new Date().toISOString()
      });
    });
    
    // Start Express server
    const port = process.env.PORT || 1337;
    app.listen(port, () => {
      console.log('\\n🎉 Clean Parse Server (PostgreSQL) started successfully!');
      console.log(`📊 Parse Dashboard: http://localhost:${port}/dashboard`);
      console.log(`⚡ API Server: http://localhost:${port}/parse`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log(`🔑 Dashboard Login: admin / admin123`);
      console.log(`🗄️  Database: PostgreSQL (${DB_CONFIG.database})`);
    });
    
  } catch (error) {
    console.error('\\n❌ Failed to start server with PostgreSQL:', error.message);
    console.log('\\n💡 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check if you can connect to PostgreSQL with pgAdmin');
    console.log('3. Try setting DB_PASSWORD environment variable');
    console.log('4. Check PostgreSQL authentication settings in pg_hba.conf');
    
    process.exit(1);
  }
}

startServer();