const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

// Parse Server configuration for local development
const api = new ParseServer({
  databaseURI: process.env.DATABASE_URI || 'postgres://localhost:5432/elimu_smart_dev',
  cloud: './cloud/main.js',
  appId: process.env.APP_ID || 'elimu-smart-local-dev',
  masterKey: process.env.MASTER_KEY || 'elimu-smart-master-key-dev',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  
  // Enable user email verification (optional for dev)
  verifyUserEmails: false,
  
  // Enable live query for real-time updates
  liveQuery: {
    classNames: ['User', 'StudentProgress', 'UniversityPlacement', 'CareerProgress']
  },
  
  // Session configuration
  sessionLength: 31536000, // 1 year in seconds
  maxLimit: 100,
  
  // Logging for development
  logLevel: 'info',
});

// Parse Dashboard configuration
const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: 'http://localhost:1337/parse',
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      appName: 'Elimu Smart - Local Dev'
    }
  ],
  users: [
    {
      user: 'admin',
      pass: 'admin123', // Change in production
      apps: [{ appId: 'elimu-smart-local-dev' }]
    }
  ],
  useEncryptedPasswords: false // For local development only
}, { allowInsecureHTTP: true });

// Mount Parse Server API at /parse
app.use('/parse', api);

// Mount Parse Dashboard at /dashboard
app.use('/dashboard', dashboard);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Elimu Smart Parse Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log('🚀 Elimu Smart Parse Server running on port', port);
  console.log('📊 Parse Dashboard available at http://localhost:1337/dashboard');
  console.log('⚡ API Server available at http://localhost:1337/parse');
  console.log('🏥 Health check available at http://localhost:1337/health');
});