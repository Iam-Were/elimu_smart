// Parse SDK configuration for browser environment
// Using static import to avoid Vite bundler issues
import Parse from 'parse';

let parseInitialized = false;

/**
 * Initialize Parse SDK for browser
 * Must be called before any Parse operations
 */
export const initializeParse = () => {
  if (parseInitialized) {
    return Parse;
  }

  try {
    // Initialize Parse SDK with credentials
    Parse.initialize(
      import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
      import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
    );
    
    Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse';

    parseInitialized = true;
    
    console.log('✅ Parse SDK initialized successfully:', {
      appId: Parse.applicationId,
      serverURL: Parse.serverURL,
      environment: 'browser'
    });
    
    return Parse;
  } catch (error) {
    console.error('❌ Parse SDK initialization failed:', error);
    throw new Error('Failed to initialize Parse SDK');
  }
};

/**
 * Get the Parse SDK instance
 * Throws error if not initialized
 */
export const getParse = () => {
  if (!parseInitialized) {
    throw new Error('Parse SDK not initialized. Call initializeParse() first.');
  }
  return Parse;
};

/**
 * Check if Parse SDK is initialized
 */
export const isParseInitialized = () => parseInitialized;

// Export Parse for direct use
export { Parse };
