// Parse SDK Configuration for Elimu Smart Frontend
import Parse from 'parse';

// Initialize Parse SDK for frontend
Parse.initialize(
  'elimu-smart-local-dev', // Application ID
  'your-javascript-key-here' // JavaScript Key (can be same as app ID for local dev)
);

// Set server URL
Parse.serverURL = 'http://localhost:1337/parse';

export default Parse;