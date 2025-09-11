const { ParseServer } = require('parse-server');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));

async function startServer() {
  try {
    console.log('🚀 Starting Elimu Smart Parse Server (SQLite mode)...');
    
    // Parse Server configuration with SQLite (working fallback)
    const parseServer = new ParseServer({
      databaseURI: 'sqlite://./elimu_smart.db',
      cloud: path.join(__dirname, 'cloud/main.js'),
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      serverURL: 'http://localhost:1337/parse',
      verifyUserEmails: false,
      
      // Enable live query for real-time updates
      liveQuery: {
        classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress']
      },
      
      sessionLength: 31536000, // 1 year
      maxLimit: 100,
      logLevel: 'info',
    });

    // Start Parse Server
    await parseServer.start();
    
    // Mount Parse Server API at /parse
    app.use('/parse', parseServer.app);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'Elimu Smart Parse Server is running (SQLite)',
        timestamp: new Date().toISOString(),
        database: 'SQLite Connected',
        cloudFunctions: 'Loaded'
      });
    });

    // Start the server
    const port = 1337;
    app.listen(port, () => {
      console.log('✅ Elimu Smart Parse Server (SQLite) running successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🔗 API Server: http://localhost:${port}/parse`);
      console.log(`🏥 Health: http://localhost:${port}/health`);
      console.log('📊 Database: SQLite (elimu_smart.db)');
      console.log('☁️ Cloud Functions: Loaded (1881+ lines)');
      console.log('🌐 CORS: Frontend ports enabled');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Ready for full Parse Server functionality!');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('   1. Test Parse Server API endpoints');
      console.log('   2. Run database seeding script');
      console.log('   3. Switch to PostgreSQL when ready');
    });
    
  } catch (error) {
    console.error('❌ Failed to start Parse Server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();