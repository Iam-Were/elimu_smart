// Fixed Parse Server setup for Node.js 22 + PostgreSQL Windows Authentication
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

// Fixed Parse Server configuration for Node.js 22
const api = new ParseServer({
  // Use Windows authentication for PostgreSQL (no password needed)
  databaseURI: 'postgres://localhost:5432/elimu_smart_dev',
  cloud: __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'elimu-smart-local-dev',
  masterKey: process.env.MASTER_KEY || 'elimu-smart-master-key-dev',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  
  // Disable user email verification for local dev
  verifyUserEmails: false,
  
  // Session configuration
  sessionLength: 31536000, // 1 year in seconds
  maxLimit: 100,
  
  // Logging for development
  logLevel: 'info',
  
  // Enable silent deprecation warnings for cleaner output
  silent: false
});

// Simplified Parse Dashboard configuration
const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: 'http://localhost:1337/parse',
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      appName: 'Elimu Smart - Local Dev'
    }
  ]
}, {
  allowInsecureHTTP: true,
  users: [{
    user: 'admin',
    pass: 'admin123'
  }]
});

// Mount Parse Server API at /parse
app.use('/parse', api.app);

// Mount Parse Dashboard at /dashboard  
app.use('/dashboard', dashboard);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Elimu Smart Parse Server is running',
    nodeVersion: process.version,
    parseServerVersion: '8.2.4',
    timestamp: new Date().toISOString()
  });
});

// Create database function
async function createDatabaseIfNeeded() {
  const { Client } = require('pg');
  
  // Try to connect without database first
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: process.env.USERNAME, // Use Windows username
    database: 'postgres' // Connect to default postgres database
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Check if our database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'elimu_smart_dev'"
    );
    
    if (result.rows.length === 0) {
      // Create database
      await client.query('CREATE DATABASE elimu_smart_dev');
      console.log('✅ Created database elimu_smart_dev');
    } else {
      console.log('✅ Database elimu_smart_dev already exists');
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.log('ℹ️  Database setup info:', error.message);
    await client.end();
    return false;
  }
}

// Start the server
const port = process.env.PORT || 1337;

async function startServer() {
  try {
    console.log('🚀 Starting Elimu Smart Parse Server...');
    
    // Try to create database
    await createDatabaseIfNeeded();
    
    // Start Express server
    app.listen(port, () => {
      console.log('✅ Elimu Smart Parse Server running on port', port);
      console.log('📊 Parse Dashboard: http://localhost:1337/dashboard');
      console.log('⚡ API Server: http://localhost:1337/parse');
      console.log('🏥 Health check: http://localhost:1337/health');
      console.log('🔑 Dashboard login: admin / admin123');
    });
    
  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    
    // Fallback to SQLite for immediate development
    console.log('🔄 Falling back to SQLite for immediate development...');
    
    const fallbackApi = new ParseServer({
      databaseURI: 'sqlite:./elimu_smart.db',
      cloud: __dirname + '/cloud/main.js',
      appId: 'elimu-smart-local-dev',
      masterKey: 'elimu-smart-master-key-dev',
      serverURL: 'http://localhost:1337/parse',
      verifyUserEmails: false,
      logLevel: 'info'
    });
    
    // Clear previous routes and mount fallback
    app._router = null;
    app.use('/parse', fallbackApi.app);
    
    app.listen(port, () => {
      console.log('✅ Elimu Smart Parse Server (SQLite) running on port', port);
      console.log('📊 API Server: http://localhost:1337/parse');
      console.log('🏥 Health check: http://localhost:1337/health');
    });
  }
}

startServer();