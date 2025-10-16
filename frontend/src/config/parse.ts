// Parse SDK configuration for browser environment
// Using static import to avoid Vite bundler issues
import * as ParseSDK from 'parse';

// Type-safe Parse reference
const Parse = ParseSDK.default || ParseSDK;

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
    // Validate Parse SDK is available
    if (!Parse || typeof Parse.initialize !== 'function') {
      throw new Error('Parse SDK not properly loaded. Check if parse package is installed correctly.');
    }

    // Initialize Parse SDK with credentials
    Parse.initialize(
      import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-production',
      import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key'
    );
    
    Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://elimu-smart.co.ke/parse';

    parseInitialized = true;
    
    console.log('✅ Parse SDK initialized successfully:', {
      appId: Parse.applicationId,
      serverURL: Parse.serverURL,
      environment: import.meta.env.MODE || 'production'
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

// Default export for compatibility
export default Parse;
