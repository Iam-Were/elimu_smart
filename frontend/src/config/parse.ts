// Parse SDK configuration with browser compatibility handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Parse: any = null;
let parseInitialized = false;

export const initializeParse = async () => {
  if (!parseInitialized && !Parse) {
    try {
      // Dynamic import for better browser compatibility with Vite
      Parse = (await import('parse')).default;

      // Configure localStorage as AsyncStorage for browser environment
      // This prevents "currentInstallationId" undefined errors
      Parse.setAsyncStorage({
        getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
        removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
        getAllKeys: () => Promise.resolve(Object.keys(localStorage)),
        clear: () => Promise.resolve(localStorage.clear())
      });

      Parse.initialize(
        import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
        import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
      );
      Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse';

      parseInitialized = true;
      console.log('✅ Parse SDK initialized successfully:', {
        appId: Parse.applicationId,
        serverURL: Parse.serverURL
      });
    } catch (error) {
      console.error('❌ Parse SDK initialization failed:', error);
      throw new Error('Failed to initialize Parse SDK');
    }
  }
  return Parse;
};

export const getParse = async () => {
  if (!Parse) {
    await initializeParse();
  }
  return Parse;
};
