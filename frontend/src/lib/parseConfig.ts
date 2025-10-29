// Parse Server configuration helper
// Centralized source for Parse API URLs and headers

export const parseConfig = {
  serverURL: import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse',
  appId: import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
  jsKey: import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
};

export const getParseHeaders = (sessionToken?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': parseConfig.appId,
    'X-Parse-JavaScript-Key': parseConfig.jsKey
  };

  if (sessionToken) {
    headers['X-Parse-Session-Token'] = sessionToken;
  }

  return headers;
};

export const callCloudFunction = async (
  functionName: string,
  params: Record<string, unknown> = {},
  sessionToken?: string
) => {
  const response = await fetch(`${parseConfig.serverURL}/functions/${functionName}`, {
    method: 'POST',
    headers: getParseHeaders(sessionToken),
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Cloud function ${functionName} failed`);
  }

  const result = await response.json();
  return result.result;
};

/**
 * Call Parse Cloud Function with automatic session token from Parse SDK
 * Use this instead of callCloudFunction to avoid localStorage session tokens
 */
export const callParseCloudFunction = async (
  functionName: string,
  params: Record<string, unknown> = {}
) => {
  // Dynamic import to avoid browser compatibility issues
  const { getParse } = await import('@/config/parse');
  const Parse = await getParse();

  const currentUser = Parse.User.current();
  const sessionToken = currentUser?.getSessionToken() ?? undefined;

  return callCloudFunction(functionName, params, sessionToken);
};
