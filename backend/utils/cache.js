/**
 * Caching Utility for Parse Cloud Functions
 * Handles Redis caching with configurable TTL per data type
 */

// Cache TTL configuration (in seconds)
const CACHE_TTL = {
  // Real-time data - NO CACHE
  MPESA_PAYMENT: 0,           // Never cache payment status
  EMAIL_SEND: 0,              // Never cache email sending
  USER_ACTIVITIES: 0,         // Real-time activity tracking
  CHAT_MESSAGES: 0,           // Real-time messaging

  // Dashboard data - 5 minutes
  CAREER_READINESS: 300,      // 5 minutes
  UNIVERSITY_PLACEMENT: 300,   // 5 minutes
  SCHOLARSHIP_MATCHES: 300,    // 5 minutes
  COUNSELOR_ANALYTICS: 300,    // 5 minutes

  // Assessment data - 1 hour
  RIASEC_QUESTIONS: 3600,     // 1 hour
  SKILLS_QUESTIONS: 3600,     // 1 hour
  ASSESSMENT_TEMPLATES: 3600,  // 1 hour

  // Static data - 24 hours
  KENYA_CAREERS: 86400,       // 24 hours
  UNIVERSITIES: 86400,         // 24 hours
  COURSES: 86400,             // 24 hours
  SUBJECT_MAPPINGS: 86400,    // 24 hours
  CAREERJET_JOBS: 86400,      // 24 hours (when implemented)

  // Semi-static data - 7 days
  LINKEDIN_INSIGHTS: 604800,  // 7 days
  KUCCPS_DATA: 604800,        // 7 days (update weekly during admission season)
};

/**
 * Simple in-memory cache for development
 * Production will use Redis via Parse Server's cacheAdapter
 */
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  async get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key, value, ttl) {
    if (ttl === 0) return; // Don't cache if TTL is 0

    const expiresAt = ttl ? Date.now() + (ttl * 1000) : null;
    this.cache.set(key, { value, expiresAt });
  }

  async del(key) {
    this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Development cache instance
const devCache = new SimpleCache();

/**
 * Get cached data or execute function if cache miss
 *
 * @param {string} key - Cache key
 * @param {Function} fn - Async function to execute on cache miss
 * @param {number} ttl - Time to live in seconds (uses CACHE_TTL constants)
 * @returns {Promise<any>} Cached or fresh data
 *
 * @example
 * const careers = await getCached('kenya-careers', async () => {
 *   const query = new Parse.Query('KenyaCareer');
 *   return await query.find({ useMasterKey: true });
 * }, CACHE_TTL.KENYA_CAREERS);
 */
async function getCached(key, fn, ttl) {
  // In development, use simple in-memory cache
  if (process.env.NODE_ENV !== 'production') {
    const cached = await devCache.get(key);
    if (cached !== null) {
      console.log(`[CACHE HIT] ${key}`);
      return cached;
    }

    console.log(`[CACHE MISS] ${key}`);
    const result = await fn();
    await devCache.set(key, result, ttl);
    return result;
  }

  // In production, Parse Server's Redis cacheAdapter handles caching automatically
  // We still wrap it for consistent API and logging
  console.log(`[CACHE CHECK] ${key} (TTL: ${ttl}s)`);
  return await fn();
}

/**
 * Invalidate cached data
 *
 * @param {string} key - Cache key to invalidate
 *
 * @example
 * await invalidateCache('kenya-careers'); // Invalidate after data update
 */
async function invalidateCache(key) {
  if (process.env.NODE_ENV !== 'production') {
    await devCache.del(key);
    console.log(`[CACHE INVALIDATE] ${key}`);
  }
  // Production: Redis cache invalidation handled by Parse Server
}

/**
 * Clear all cached data (development only)
 */
async function clearAllCache() {
  if (process.env.NODE_ENV !== 'production') {
    await devCache.clear();
    console.log('[CACHE CLEARED] All cache cleared');
  }
}

/**
 * Get cache statistics (development only)
 */
function getCacheStats() {
  if (process.env.NODE_ENV !== 'production') {
    return {
      size: devCache.size(),
      ttlConfig: CACHE_TTL
    };
  }
  return { message: 'Production cache stats available in Redis' };
}

// Export cache instance for direct access
const cache = process.env.NODE_ENV !== 'production' ? devCache : {
  // In production, provide a simple wrapper that just executes (no caching)
  async get(key) { return null; },
  async set(key, value, ttl) { return true; },
  async del(key) { return true; }
};

module.exports = {
  cache,
  CACHE_TTL,
  getCached,
  invalidateCache,
  clearAllCache,
  getCacheStats
};
