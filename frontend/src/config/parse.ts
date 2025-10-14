// Parse SDK configuration for browser environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Parse: any = null;
let parseInitialized = false;

export const initializeParse = async () => {
  if (!parseInitialized && !Parse) {
    try {
      // Dynamic import for better browser compatibility with Vite
      Parse = (await import('parse')).default;

      // Initialize Parse SDK with credentials
      Parse.initialize(
        import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
        import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
      );
      Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse';

      // Enable local datastore for browser caching (optional)
      // Parse SDK uses localStorage by default in browser environments
      try {
        await Parse.enableLocalDatastore();
      } catch (e) {
        console.warn('Local datastore already enabled or not available:', e);
      }

      parseInitialized = true;
      console.log('✅ Parse SDK initialized successfully:', {
        appId: Parse.applicationId,
        serverURL: Parse.serverURL,
        environment: 'browser'
      });
    } catch (error) {
      console.error('❌ Parse SDK initialization failed:', error);
      throw new Error('Failed to initialize Parse SDK');
    }
  }
  return Parse;
};

export const getParse = async () => {
  if (!Parse || !parseInitialized) {
    await initializeParse();
  }
  return Parse;
};
