// Parse SDK configuration for browser environment
// Using static import to avoid Vite bundler issues
// Build: 1760631402
import Parse from 'parse';

let parseInitialized = false;

/**
 * Initialize Parse SDK for browser
 * Must be called before any Parse operations
 */
export const initializeParse = () => {
  if (parseInitialized) {
    console.log('ℹ️ Parse already initialized, returning existing instance');
    return Parse;
  }

  console.log('🔧 Starting Parse SDK initialization...', {
    parseExists: !!Parse,
    hasInitialize: typeof Parse?.initialize === 'function',
    envVars: {
      appId: import.meta.env.VITE_PARSE_APP_ID || 'NOT_SET',
      jsKey: import.meta.env.VITE_PARSE_JS_KEY ? 'SET' : 'NOT_SET',
      serverURL: import.meta.env.VITE_PARSE_SERVER_URL || 'NOT_SET',
      mode: import.meta.env.MODE || 'NOT_SET'
    }
  });

  try {
    // Validate Parse SDK is available
    if (!Parse || typeof Parse.initialize !== 'function') {
      console.error('❌ Parse SDK validation failed:', {
        Parse,
        typeofParse: typeof Parse,
        typeofInitialize: typeof Parse?.initialize
      });
      throw new Error('Parse SDK not properly loaded. Check if parse package is installed correctly.');
    }

    const appId = import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-production';
    const jsKey = import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key';
    const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://elimu-smart.co.ke/parse';

    console.log('🔐 Initializing with credentials:', {
      appId: appId,
      jsKeyLength: jsKey.length,
      serverURL: serverURL
    });

    // Initialize Parse SDK with credentials
    Parse.initialize(appId, jsKey);
    Parse.serverURL = serverURL;
    
    // Enable Live Query WebSocket connection
    Parse.liveQueryServerURL = import.meta.env.VITE_LIVE_QUERY_URL || 'wss://elimu-smart.co.ke/parse';

    parseInitialized = true;
    
    console.log('✅ Parse SDK initialized successfully:', {
      appId: Parse.applicationId,
      serverURL: Parse.serverURL,
      liveQueryURL: Parse.liveQueryServerURL,
      environment: import.meta.env.MODE || 'production'
    });
    
    return Parse;
  } catch (error) {
    console.error('❌ Parse SDK initialization failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to initialize Parse SDK: ${errorMessage}`);
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

// Default export for compatibility
export default Parse;
