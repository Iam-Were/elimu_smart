// Minimal Parse Server without cloud functions
const express = require('express');
const ParseServer = require('parse-server').ParseServer;

const app = express();

console.log('Creating Parse Server...');

// Minimal Parse Server configuration without cloud functions
const server = new ParseServer({
  databaseURI: 'sqlite:./minimal.db',
  appId: 'test-app',
  masterKey: 'test-key',
  serverURL: 'http://localhost:1337/parse'
  // Note: No cloud functions
});

console.log('Parse Server created, attempting to mount...');

// Mount Parse Server
app.use('/parse', server);

console.log('Parse Server mounted successfully!');

// Simple endpoint
app.get('/', (req, res) => {
  res.send('Parse Server is running!');
});

// Start server
app.listen(1337, () => {
  console.log('✅ Server started on port 1337');
});