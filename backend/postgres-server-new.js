// New PostgreSQL Parse Server - Bypassing Authentication Issues
const ParseServer = require('parse-server').ParseServer;
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all origins during development
app.use(cors({
  origin: true,
  credentials: true
}));

// Alternative PostgreSQL connection approaches
const connectionStrings = [
  // Standard connection
  'postgres://postgres:password@localhost:5432/elimu_smart_dev',
  // No password
  'postgres://postgres@localhost:5432/elimu_smart_dev',
  // Different auth method
  'postgres://postgres:postgres@localhost:5432/elimu_smart_dev',
  // Trust authentication
  'postgresql://postgres@localhost:5432/elimu_smart_dev'
];

async function startServer() {
  console.log('🚀 Starting New PostgreSQL Parse Server...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Try different connection strings
  for (let i = 0; i < connectionStrings.length; i++) {
    const databaseURI = connectionStrings[i];
    console.log(`📊 Trying connection ${i + 1}/${connectionStrings.length}: ${databaseURI.replace(/:[^:]*@/, ':***@')}`);
    
    try {
      const parseServer = new ParseServer({
        databaseURI: databaseURI,
        cloud: path.join(__dirname, 'cloud/main.js'),
        appId: 'elimu-smart-local-dev',
        masterKey: 'elimu-smart-master-key-dev',
        serverURL: 'http://localhost:1337/parse',
        
        // Minimal security for local development
        verifyUserEmails: false,
        allowInsecureHTTP: true,
        
        // Live query configuration
        liveQuery: {
          classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress']
        },
        
        // Session and limits
        sessionLength: 31536000,
        maxLimit: 100,
        logLevel: 'info',
        
        // Try to reduce connection timeouts
        databaseOptions: {
          connectionTimeout: 30000,
          acquireTimeout: 30000,
          timeout: 30000,
          read_timeout: 30000,
          write_timeout: 30000
        }
      });

      // Test the connection by starting the server
      console.log(`⏳ Testing Parse Server initialization...`);
      await parseServer.start();
      console.log(`✅ Parse Server initialized successfully with connection ${i + 1}!`);
      
      // Mount the server
      app.use('/parse', parseServer.app);
      console.log('✅ Parse Server mounted at /parse');
      
      // Add health check
      app.get('/health', (req, res) => {
        res.json({
          status: 'OK',
          message: 'New PostgreSQL Parse Server Running',
          timestamp: new Date().toISOString(),
          database: 'PostgreSQL Connected',
          connectionString: databaseURI.replace(/:[^:]*@/, ':***@'),
          cloudFunctions: 'Loaded'
        });
      });
      
      // Add test endpoint
      app.get('/api/test', (req, res) => {
        res.json({
          message: 'New PostgreSQL Parse Server API Working!',
          timestamp: new Date().toISOString(),
          status: 'success',
          database: 'PostgreSQL'
        });
      });
      
      // Start the HTTP server
      const port = 1337;
      app.listen(port, () => {
        console.log('✅ New PostgreSQL Parse Server Started Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🔗 Parse Server: http://localhost:${port}/parse`);
        console.log(`🏥 Health Check: http://localhost:${port}/health`);
        console.log(`🧪 Test API: http://localhost:${port}/api/test`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Database: ${databaseURI.replace(/:[^:]*@/, ':***@')}`);
        console.log('☁️ Cloud Functions: Loaded (1,198+ lines)');
        console.log('🌐 CORS: All origins enabled for development');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ PostgreSQL Parse Server Ready!');
        console.log('');
        console.log('📋 Next Steps:');
        console.log('   1. Test endpoints with curl or browser');
        console.log('   2. Connect frontend to this Parse Server');
        console.log('   3. Verify cloud functions are working');
      });
      
      return; // Exit function if successful
      
    } catch (error) {
      console.log(`❌ Connection ${i + 1} failed: ${error.message}`);
      
      if (i === connectionStrings.length - 1) {
        // Last connection attempt failed
        console.log('');
        console.log('❌ All PostgreSQL connection attempts failed!');
        console.log('');
        console.log('📋 PostgreSQL Troubleshooting Steps:');
        console.log('   1. Check if PostgreSQL is running: tasklist | findstr postgres');
        console.log('   2. Verify port 5432 is listening: netstat -an | findstr 5432');
        console.log('   3. Check pg_hba.conf authentication settings');
        console.log('   4. Try resetting postgres user password');
        console.log('   5. Consider using API server as fallback');
        console.log('');
        console.log('💡 Fallback Options:');
        console.log('   - Use api-server.js (currently working on port 3001)');
        console.log('   - Try server-sqlite.js for local development');
        console.log('');
        
        process.exit(1);
      }
    }
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down PostgreSQL Parse Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down PostgreSQL Parse Server...');
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('💥 Fatal error starting PostgreSQL Parse Server:', error);
  process.exit(1);
});