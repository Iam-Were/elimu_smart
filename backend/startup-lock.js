/**
 * Startup Lock Mechanism for Parse Server Cluster Mode
 * Prevents race conditions during PostgreSQL initialization
 * Uses PostgreSQL advisory locks for coordination
 */

const { Client } = require('pg');

const LOCK_ID = 123456789; // Unique lock ID for Parse Server startup

class StartupLock {
  constructor(databaseURI) {
    this.databaseURI = databaseURI;
    this.client = null;
    this.lockAcquired = false;
  }

  async connect() {
    this.client = new Client({ connectionString: this.databaseURI });
    await this.client.connect();
  }

  async acquireLock(timeoutMs = 30000) {
    if (!this.client) {
      await this.connect();
    }

    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        // Try to acquire advisory lock (non-blocking)
        const result = await this.client.query(
          'SELECT pg_try_advisory_lock($1) as acquired',
          [LOCK_ID]
        );
        
        if (result.rows[0].acquired) {
          this.lockAcquired = true;
          console.log('🔒 Startup lock acquired - proceeding with initialization');
          return true;
        }
        
        // Lock not available, wait and retry
        console.log('⏳ Waiting for startup lock...');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('❌ Error acquiring lock:', error);
        throw error;
      }
    }
    
    throw new Error('Timeout waiting for startup lock');
  }

  async releaseLock() {
    if (!this.client || !this.lockAcquired) {
      return;
    }

    try {
      await this.client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]);
      console.log('🔓 Startup lock released');
      this.lockAcquired = false;
    } catch (error) {
      console.error('❌ Error releasing lock:', error);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  async executeWithLock(fn) {
    try {
      await this.acquireLock();
      await fn();
    } finally {
      await this.releaseLock();
      await this.disconnect();
    }
  }
}

module.exports = StartupLock;
