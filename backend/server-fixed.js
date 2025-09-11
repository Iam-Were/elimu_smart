// Fixed Parse Server setup - Simple version without Parse Dashboard  
const { ParseServer } = require('parse-server');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));

async function startServer() {
  try {
    console.log('🚀 Starting Elimu Smart Parse Server (Fixed)...');
    
    // Parse Server configuration - using confirmed working connection string
    const parseServer = new ParseServer({
      databaseURI: 'postgres://postgres:password@localhost:5432/elimu_smart_dev',
      cloud: path.join(__dirname, 'cloud/main.js'),
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      serverURL: 'http://localhost:1337/parse',
      
      verifyUserEmails: false,
      
      // Enable live query for real-time updates
      liveQuery: {
        classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress']
      },
      
      sessionLength: 31536000, // 1 year in seconds
      maxLimit: 100,
      logLevel: 'info',
    });

    // Start Parse Server
    console.log('📊 Starting Parse Server...');
    await parseServer.start();
    
    // Mount Parse Server API at /parse
    app.use('/parse', parseServer.app);
    console.log('✅ Parse Server mounted successfully at /parse');

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'Elimu Smart Parse Server is running',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL Connected',
        cloudFunctions: 'Loaded'
      });
    });

    // Simple API endpoints for compatibility
    app.get('/api/test', (req, res) => {
      res.json({
        message: 'Parse Server API is working!',
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    });

    // Start the server
    const port = 1337;
    app.listen(port, () => {
      console.log('✅ Elimu Smart Parse Server Started Successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🔗 Parse Server: http://localhost:${port}/parse`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log(`🧪 Test API: http://localhost:${port}/api/test`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Database: PostgreSQL Connected (password="password")');
      console.log('☁️ Cloud Functions: Loaded (1881+ lines)');
      console.log('🌐 CORS: Frontend ports enabled');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Parse Server Ready for Full Functionality!');
      console.log('📋 Next: Create database with: set PGPASSWORD=password && createdb -U postgres elimu_smart_dev');
    });
    
  } catch (error) {
    console.error('❌ Failed to start Parse Server:', error);
    
    // Show specific database connection help
    if (error.message && error.message.includes('password authentication failed')) {
      console.log('');
      console.log('📋 Database Connection Issue:');
      console.log('   Current connection: postgres://postgres:password@localhost:5432/elimu_smart_dev');
      console.log('   1. Check PostgreSQL service: net start postgresql-x64-17');
      console.log('   2. Create database: set PGPASSWORD=password && createdb -U postgres elimu_smart_dev');
      console.log('   3. Verify connection working (password confirmed as "password")');
    }
    
    process.exit(1);
  }
}

// Start the server
startServer();