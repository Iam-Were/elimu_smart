// Multi-Database Connection Manager
// Handles connections to main application DB and payment vault DB
// For PCI DSS compliance: separate payment data storage

const { Client, Pool } = require('pg');
require('dotenv').config();

// Main Application Database Configuration
const MAIN_DB_URI = process.env.DATABASE_URI;

// Payment Vault Database Configuration (PCI-compliant separation)
const PAYMENT_DB_URI = process.env.PAYMENT_DATABASE_URI;

// Connection pools for better performance
let mainDBPool = null;
let paymentDBPool = null;

/**
 * Initialize Main Application Database Pool
 */
function initMainDB() {
  if (!MAIN_DB_URI) {
    console.warn('⚠️  DATABASE_URI not set, main database will not be available');
    return null;
  }

  if (!mainDBPool) {
    mainDBPool = new Pool({
      connectionString: MAIN_DB_URI,
      max: 20, // Maximum number of clients
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    mainDBPool.on('error', (err) => {
      console.error('❌ Main database pool error:', err);
    });

    console.log('✅ Main database pool initialized');
  }

  return mainDBPool;
}

/**
 * Initialize Payment Vault Database Pool
 * Separate pool with different settings for payment data
 */
function initPaymentDB() {
  if (!PAYMENT_DB_URI) {
    console.warn('⚠️  PAYMENT_DATABASE_URI not set, payment vault will not be available');
    console.warn('    Subscription and billing features will not work.');
    return null;
  }

  if (!paymentDBPool) {
    paymentDBPool = new Pool({
      connectionString: PAYMENT_DB_URI,
      max: 10, // Smaller pool for payment DB
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    paymentDBPool.on('error', (err) => {
      console.error('❌ Payment vault database pool error:', err);
    });

    console.log('✅ Payment vault database pool initialized');
  }

  return paymentDBPool;
}

/**
 * Get Main Database Pool
 * @returns {Pool} PostgreSQL connection pool
 */
function getMainDB() {
  if (!mainDBPool) {
    return initMainDB();
  }
  return mainDBPool;
}

/**
 * Get Payment Vault Database Pool
 * @returns {Pool} PostgreSQL connection pool
 */
function getPaymentDB() {
  if (!paymentDBPool) {
    return initPaymentDB();
  }
  return paymentDBPool;
}

/**
 * Execute query on main database
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function queryMainDB(query, params = []) {
  const pool = getMainDB();
  if (!pool) {
    throw new Error('Main database not available');
  }

  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('❌ Main DB query failed:', error.message);
    throw error;
  }
}

/**
 * Execute query on payment vault database
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function queryPaymentDB(query, params = []) {
  const pool = getPaymentDB();
  if (!pool) {
    throw new Error('Payment vault database not available');
  }

  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('❌ Payment DB query failed:', error.message);
    throw error;
  }
}

/**
 * Transaction helper for payment vault
 * Ensures all payment operations are atomic
 * @param {Function} callback - Transaction callback function
 * @returns {Promise<any>} Transaction result
 */
async function paymentTransaction(callback) {
  const pool = getPaymentDB();
  if (!pool) {
    throw new Error('Payment vault database not available');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Payment transaction failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check database connections health
 * @returns {Promise<Object>} Health status
 */
async function checkDatabaseHealth() {
  const health = {
    mainDB: { connected: false, error: null },
    paymentDB: { connected: false, error: null }
  };

  // Check main DB
  try {
    const pool = getMainDB();
    if (pool) {
      await pool.query('SELECT 1');
      health.mainDB.connected = true;
    }
  } catch (error) {
    health.mainDB.error = error.message;
  }

  // Check payment DB
  try {
    const pool = getPaymentDB();
    if (pool) {
      await pool.query('SELECT 1');
      health.paymentDB.connected = true;
    }
  } catch (error) {
    health.paymentDB.error = error.message;
  }

  return health;
}

/**
 * Close all database connections
 * Call this on server shutdown
 */
async function closeAllConnections() {
  console.log('🔌 Closing database connections...');

  if (mainDBPool) {
    await mainDBPool.end();
    console.log('✅ Main database pool closed');
  }

  if (paymentDBPool) {
    await paymentDBPool.end();
    console.log('✅ Payment vault pool closed');
  }
}

// Handle process termination
process.on('SIGTERM', closeAllConnections);
process.on('SIGINT', closeAllConnections);

module.exports = {
  // Initialization
  initMainDB,
  initPaymentDB,

  // Getters
  getMainDB,
  getPaymentDB,

  // Query helpers
  queryMainDB,
  queryPaymentDB,

  // Transaction helpers
  paymentTransaction,

  // Health checks
  checkDatabaseHealth,

  // Cleanup
  closeAllConnections
};

// CLI tool: Test database connections
if (require.main === module) {
  console.log('\n🧪 Testing Database Connections...\n');

  checkDatabaseHealth()
    .then(health => {
      console.log('Main Database:', health.mainDB.connected ? '✅ Connected' : `❌ ${health.mainDB.error}`);
      console.log('Payment Vault:', health.paymentDB.connected ? '✅ Connected' : `❌ ${health.paymentDB.error}`);
      console.log('');
      process.exit(health.mainDB.connected && health.paymentDB.connected ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    })
    .finally(() => {
      closeAllConnections();
    });
}
