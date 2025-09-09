const ParseServer = require('parse-server').ParseServer;
const express = require('express');
require('dotenv').config();

const app = express();

// Parse Server configuration
const api = new ParseServer({
  databaseURI: 'sqlite:./database.db', // Use SQLite for quick setup
  cloud: './cloud/main.js',
  appId: 'elimu-smart-local-dev',
  masterKey: 'elimu-smart-master-key-dev',
  serverURL: 'http://localhost:1337/parse',
  verifyUserEmails: false,
  logLevel: 'info'
});

// Serve Parse API at /parse
app.use('/parse', api);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Elimu Smart Parse Server is running (SQLite)',
    timestamp: new Date().toISOString()
  });
});

// Start server
const port = 1337;
app.listen(port, () => {
  console.log('🚀 Elimu Smart Parse Server running on port', port);
  console.log('⚡ API Server available at http://localhost:1337/parse');
  console.log('🏥 Health check available at http://localhost:1337/health');
});