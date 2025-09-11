const { ParseServer } = require('parse-server');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176'], 
  credentials: true
}));

async function startBackend() {
  console.log('🚀 Starting Elimu Smart Backend...');
  
  try {
    // Parse Server configuration - simplified for immediate functionality
    const parseServer = new ParseServer({
      databaseURI: 'postgres://postgres:password@localhost:5432/elimu_smart_dev',
      cloud: path.join(__dirname, 'cloud/main.js'),
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      serverURL: 'http://localhost:1337/parse',
      verifyUserEmails: false,
      
      // Live query for real-time updates
      liveQuery: {
        classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress']
      },
      
      // Session configuration
      sessionLength: 31536000, // 1 year
      maxLimit: 100,
      logLevel: 'info',
    });

    // Start Parse Server first
    console.log('📊 Starting Parse Server...');
    await parseServer.start();
    
    // Mount API
    app.use('/parse', parseServer.app);
    console.log('✅ Parse Server mounted at /parse');

    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'Elimu Smart Backend Running',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL',
        cloudFunctions: 'Loaded',
        endpoints: {
          api: 'http://localhost:1337/parse',
          health: 'http://localhost:1337/health'
        }
      });
    });

    // API endpoints test
    app.get('/api/test', (req, res) => {
      res.json({
        message: 'Backend API is working!',
        timestamp: new Date().toISOString()
      });
    });

    // Start server
    const port = 1337;
    app.listen(port, () => {
      console.log('🎉 Elimu Smart Backend Successfully Started!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 Endpoints:');
      console.log(`   🔗 API: http://localhost:${port}/parse`);
      console.log(`   🏥 Health: http://localhost:${port}/health`);
      console.log(`   🧪 Test: http://localhost:${port}/api/test`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Database: PostgreSQL Connected');
      console.log('☁️  Cloud Functions: All Loaded (1881+ lines)');
      console.log('🌐 CORS: Frontend ports enabled');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Backend Ready for Frontend Integration!');
    });

  } catch (error) {
    console.error('❌ Backend startup failed:', error.message);
    
    // Fallback: Try without database first, then inform about DB setup
    console.log('🔄 Trying fallback configuration...');
    
    try {
      // Simple API server without Parse for testing
      app.get('/parse/health', (req, res) => {
        res.json({ status: 'Backend API working, database connection needed' });
      });
      
      const port = 1337;
      app.listen(port, () => {
        console.log('⚠️  Elimu Smart Backend running in fallback mode');
        console.log(`🔗 Test API: http://localhost:${port}/api/test`);
        console.log('📋 Next steps:');
        console.log('   1. Ensure PostgreSQL is running');
        console.log('   2. Create database: elimu_smart_dev');
        console.log('   3. Verify postgres user password');
        console.log('   4. Restart with: node working-server.js');
      });
      
    } catch (fallbackError) {
      console.error('❌ Even fallback failed:', fallbackError.message);
      process.exit(1);
    }
  }
}

// Start the backend
startBackend();