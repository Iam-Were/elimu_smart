// Parse SDK Configuration for Elimu Smart Frontend
// Use import for better ES module compatibility with Parse SDK
import Parse from 'parse';

// Lazy initialization to avoid browser compatibility issues
let parseInitialized = false;

export const initializeParse = () => {
  if (!parseInitialized) {
    // Read configuration from environment variables
    const appId = import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev';
    const jsKey = import.meta.env.VITE_PARSE_JS_KEY || 'your-javascript-key-here';
    const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse';

    Parse.initialize(appId, jsKey);
    Parse.serverURL = serverURL;

    parseInitialized = true;

    console.log('✅ Parse SDK initialized:', {
      appId,
      serverURL,
      environment: import.meta.env.MODE
    });
  }
  return Parse;
};

// Export Parse with lazy initialization
const getParseInstance = () => {
  return initializeParse();
};

export default getParseInstance;