import Parse from 'parse';

// Parse Server Configuration - Compatible with PostgreSQL Backend
Parse.initialize(
  'elimu-smart-local-dev', // APP_ID from backend/.env
  'unused-javascript-key'  // JavaScript key (not used in Parse Server)
);

Parse.serverURL = 'http://localhost:1337/parse'; // SERVER_URL from backend/.env

// Enable local datastore for offline support (optional)
// Parse.enableLocalDatastore();

// Development settings  
if (import.meta.env?.DEV) {
  Parse.CoreManager.set('REQUEST_HEADERS', {
    'X-Parse-Application-Id': 'elimu-smart-local-dev'
  });
}

export default Parse;

// Export commonly used Parse classes for convenience
export const User = Parse.User;
export const Query = Parse.Query;
export const Object = Parse.Object;
export const Cloud = Parse.Cloud;
export const File = Parse.File;
export const GeoPoint = Parse.GeoPoint;
export const Polygon = Parse.Polygon;
export const ACL = Parse.ACL;
export const Role = Parse.Role;