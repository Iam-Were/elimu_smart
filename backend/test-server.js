// Minimal Parse Server test
const ParseServer = require('parse-server').ParseServer;
const express = require('express');

const app = express();

console.log('Starting Parse Server setup...');

// Very basic Parse Server configuration
const api = new ParseServer({
  databaseURI: 'sqlite:./test.db',
  appId: 'test-app-id',
  masterKey: 'test-master-key',
  serverURL: 'http://localhost:1337/parse'
});

console.log('Parse Server initialized, mounting...');

// Mount Parse Server
app.use('/parse', api);

console.log('Parse Server mounted, setting up health check...');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

console.log('Starting server on port 1337...');

// Start server
app.listen(1337, () => {
  console.log('✅ Server running on http://localhost:1337');
});