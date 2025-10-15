/**
 * Cluster-Safe Parse Server Startup
 * Uses PostgreSQL advisory locks to prevent race conditions
 */

const StartupLock = require('./startup-lock');

// Load environment variables
if (!process.env.DOTENV_LOADED) {
  require('dotenv').config();
}

const databaseURI = process.env.DATABASE_URI || 'postgres://postgres:password@localhost:5432/elimu_smart_production';

async function startWithLock() {
  const lock = new StartupLock(databaseURI);
  
  try {
    // Acquire lock before starting server
    console.log('🔐 Attempting to acquire startup lock...');
    await lock.acquireLock(30000); // 30 second timeout
    
    // Only one instance will execute this code at a time
    console.log('✅ Lock acquired, initializing Parse Server...');
    
    // Small delay to ensure database functions are created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Release lock before starting server (initialization complete)
    await lock.releaseLock();
    await lock.disconnect();
    
    // Now start the actual server
    console.log('🚀 Starting Parse Server instance...');
    require('./server-working.js');
    
  } catch (error) {
    console.error('❌ Startup lock error:', error);
    await lock.releaseLock();
    await lock.disconnect();
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('⚠️  Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('⚠️  Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start server with lock protection
startWithLock();
