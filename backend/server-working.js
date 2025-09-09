// Working Parse Server setup based on official documentation
const express = require('express');
const ParseServer = require('parse-server').ParseServer;
require('dotenv').config();

const app = express();

// Parse Server configuration
const server = new ParseServer({
  databaseURI: 'sqlite:./database.db',
  cloud: './cloud/main.js',
  appId: 'elimu-smart-local-dev',
  masterKey: 'elimu-smart-master-key-dev',
  serverURL: 'http://localhost:1337/parse'
});

// Mount Parse Server at /parse
app.use('/parse', server);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Elimu Smart Parse Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const port = 1337;
app.listen(port, function() {
  console.log('🚀 Parse Server running on port ' + port);
  console.log('⚡ API available at http://localhost:1337/parse');
  console.log('🏥 Health check at http://localhost:1337/health');
});