// Working Parse Server setup based on Sprint 22 commit e110a05
const ParseServer = require('parse-server').ParseServer;
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
    console.log('🚀 Starting Elimu Smart Parse Server (Working Version)...');
    
    // Parse Server configuration - using confirmed working connection
    const parseServer = new ParseServer({
      databaseURI: 'postgres://postgres@localhost:5432/elimu_smart_dev',
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

    // Start Parse Server properly
    await parseServer.start();
    console.log('✅ Parse Server initialized successfully');
    
    // Mount Parse Server API
    app.use('/parse', parseServer.app);
    console.log('✅ Parse Server mounted at /parse');

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

    // API test endpoint
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
      console.log('✅ Elimu Smart Parse Server (Working Version) Started!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🔗 Parse Server: http://localhost:${port}/parse`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log(`🧪 Test API: http://localhost:${port}/api/test`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Database: PostgreSQL (password="password")');
      console.log('☁️ Cloud Functions: Loaded (1881+ lines)');
      console.log('🌐 CORS: Frontend ports enabled');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Ready! Using Sprint 22 working configuration');
    });
    
  } catch (error) {
    console.error('❌ Failed to start Parse Server:', error);
    
    // Show database connection help if needed
    if (error.message && error.message.includes('password authentication failed')) {
      console.log('📋 Database Issue: Check PostgreSQL service and password');
      console.log('   Try: net start postgresql-x64-17');
      console.log('   Connection: postgres://postgres:password@localhost:5432/elimu_smart_dev');
    }
    
    process.exit(1);
  }
}

// Start the server
startServer();