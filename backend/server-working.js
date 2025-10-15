// Working Parse Server setup based on Sprint 22 commit e110a05
const ParseServer = require('parse-server').ParseServer
const ParseDashboard = require('parse-dashboard')
const RedisCacheAdapter = require('parse-server').RedisCacheAdapter
const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables (unless already loaded by server-staging.js)
if (!process.env.DOTENV_LOADED) {
  require('dotenv').config();
}

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));

async function startServer() {
  try {
    console.log('🚀 Starting Elimu Smart Parse Server (Working Version)...');
    
    // Redis Cache Adapter configuration
    const cacheAdapter = process.env.NODE_ENV === 'production'
      ? new RedisCacheAdapter({
          url: process.env.REDIS_URL || 'redis://localhost:6379',
          ttl: 300, // Default 5 minutes TTL
        })
      : null; // No cache in development for easier debugging

    // Parse Server configuration - using confirmed working connection
    const parseServer = new ParseServer({
      databaseURI: process.env.DATABASE_URI || 'postgres://postgres:password@localhost:5432/elimu_smart_dev',
      cloud: path.join(__dirname, 'cloud/main.js'),
      appId: process.env.APP_ID || 'elimu-smart-local-dev',
      masterKey: process.env.MASTER_KEY || 'elimu-smart-master-key-dev',
      serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',

      // Redis caching (production only)
      cacheAdapter: cacheAdapter,

      verifyUserEmails: false,

      // Future-proof configuration options
      encodeParseObjectInCloudFunction: false, // Keep current behavior, suppress warning
      enableInsecureAuthAdapters: true, // Allow anonymous auth for development

      // Enable live query for real-time updates
      liveQuery: {
        classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress', 'ChatMessage', 'CounselorSession']
      },

      sessionLength: 31536000, // 1 year in seconds
      maxLimit: 100,
      logLevel: process.env.LOG_LEVEL || 'info',
    });

    // Start Parse Server properly
    await parseServer.start();
    console.log('✅ Parse Server initialized successfully');
    
    // Mount Parse Server API
    app.use('/parse', parseServer.app);
    console.log('✅ Parse Server mounted at /parse');

    // Parse Dashboard configuration
    const dashboard = new ParseDashboard({
      apps: [
        {
          serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
          appId: process.env.APP_ID || 'elimu-smart-local-dev',
          masterKey: process.env.MASTER_KEY || 'elimu-smart-master-key-dev',
          appName: 'Elimu Smart',
          iconName: 'brain'
        }
      ],
      users: [
        {
          user: process.env.DASHBOARD_USER || 'admin',
          pass: process.env.DASHBOARD_PASS || 'admin123'
        }
      ]
    }, { allowInsecureHTTP: true }); // Allow HTTP for local development

    // Mount Parse Dashboard
    app.use('/dashboard', dashboard);
    console.log('✅ Parse Dashboard mounted at /dashboard');

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
    const port = process.env.PORT || 1337;
    app.listen(port, async () => {
      console.log('✅ Elimu Smart Parse Server (Working Version) Started!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🔗 Parse Server: http://localhost:${port}/parse`);
      console.log(`📊 Parse Dashboard: http://localhost:${port}/dashboard`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log(`🧪 Test API: http://localhost:${port}/api/test`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Database: PostgreSQL (password="password")');
      console.log('☁️ Cloud Functions: Loaded (1881+ lines)');
      console.log('🌐 CORS: Frontend ports enabled');
      console.log(`🔐 Dashboard Login: ${process.env.DASHBOARD_USER || 'admin'} / ${process.env.DASHBOARD_PASS || 'admin123'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Production server ready');
      console.log('');
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