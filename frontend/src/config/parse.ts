// Standard Parse import approach  
import Parse from 'parse';

// Single Parse initialization following CLAUDE.md patterns  
let parseInitialized = false;

const initializeParse = () => {
  if (!parseInitialized) {
    Parse.initialize(
      import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
      import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
    );
    Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse';
    
    parseInitialized = true;
    console.log('✅ Parse SDK initialized:', {
      appId: Parse.applicationId,
      serverURL: Parse.serverURL
    });
  }
  return Parse;
};

// Export function that existing hooks expect
export const getParse = () => {
  return initializeParse();
};

// Export for compatibility with existing imports  
export { initializeParse };

// Initialize Parse immediately for main.tsx
initializeParse();
