// Parse SDK Configuration for Elimu Smart Frontend
// Use import for better ES module compatibility with Parse SDK
import Parse from 'parse';

// Lazy initialization to avoid browser compatibility issues
let parseInitialized = false;

export const initializeParse = () => {
  if (!parseInitialized) {
    Parse.initialize(
      'elimu-smart-local-dev', // Application ID
      'your-javascript-key-here' // JavaScript Key (can be same as app ID for local dev)
    );
    
    // Set server URL
    Parse.serverURL = 'http://localhost:1337/parse';
    parseInitialized = true;
  }
  return Parse;
};

// Export Parse with lazy initialization
const getParseInstance = () => {
  return initializeParse();
};

export default getParseInstance;