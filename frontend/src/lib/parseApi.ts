// Parse Server REST API client - browser-compatible approach
// This avoids Parse SDK Node.js compatibility issues with Vite

import type { 
  GenericApiResponse, 
  ParseApiParams, 
  ParseObjectData, 
  CloudFunctionParams, 
  CloudFunctionResponse 
} from '../types/shared';

interface ParseConfig {
  serverURL: string;
  applicationId: string;
  javascriptKey: string;
}

const parseConfig: ParseConfig = {
  serverURL: import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse',
  applicationId: import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
  javascriptKey: import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
};

// Parse API headers
const getHeaders = (sessionToken?: string): HeadersInit => {
  const headers: HeadersInit = {
    'X-Parse-Application-Id': parseConfig.applicationId,
    'X-Parse-Javascript-Key': parseConfig.javascriptKey,
    'Content-Type': 'application/json'
  };
  
  if (sessionToken) {
    headers['X-Parse-Session-Token'] = sessionToken;
  }
  
  return headers;
};

// Parse User types
export interface ParseUser {
  objectId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'student' | 'counselor' | 'admin';
  isActive?: boolean;
  sessionToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'counselor' | 'admin';
}

// Parse API client
export class ParseApi {
  // User authentication
  static async login(credentials: LoginCredentials): Promise<ParseUser> {
    const response = await fetch(`${parseConfig.serverURL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  }
  
  static async register(userData: RegisterData): Promise<ParseUser> {
    const response = await fetch(`${parseConfig.serverURL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  }
  
  static async getCurrentUser(sessionToken: string): Promise<ParseUser> {
    const response = await fetch(`${parseConfig.serverURL}/users/me`, {
      method: 'GET',
      headers: getHeaders(sessionToken)
    });
    
    if (!response.ok) {
      throw new Error('Invalid session');
    }
    
    return response.json();
  }
  
  static async logout(sessionToken: string): Promise<void> {
    await fetch(`${parseConfig.serverURL}/logout`, {
      method: 'POST',
      headers: getHeaders(sessionToken)
    });
  }
  
  // Cloud function calls
  static async callCloudFunction(functionName: string, params: CloudFunctionParams = {}, sessionToken?: string): Promise<CloudFunctionResponse> {
    const response = await fetch(`${parseConfig.serverURL}/functions/${functionName}`, {
      method: 'POST',
      headers: getHeaders(sessionToken),
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Cloud function ${functionName} failed`);
    }
    
    const result = await response.json();
    return result.result;
  }
  
  // Object operations
  static async createObject(className: string, data: ParseObjectData, sessionToken?: string): Promise<ParseObjectData> {
    const response = await fetch(`${parseConfig.serverURL}/classes/${className}`, {
      method: 'POST',
      headers: getHeaders(sessionToken),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create ${className}`);
    }
    
    return response.json();
  }
  
  static async getObject(className: string, objectId: string, sessionToken?: string): Promise<ParseObjectData> {
    const response = await fetch(`${parseConfig.serverURL}/classes/${className}/${objectId}`, {
      method: 'GET',
      headers: getHeaders(sessionToken)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to get ${className}`);
    }
    
    return response.json();
  }
  
  static async queryObjects(className: string, params: ParseApiParams = {}, sessionToken?: string): Promise<GenericApiResponse<ParseObjectData[]>> {
    // Convert ParseApiParams to URLSearchParams format
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.append(key, JSON.stringify(value));
        } else if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    const queryString = searchParams.toString();
    const url = `${parseConfig.serverURL}/classes/${className}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(sessionToken)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to query ${className}`);
    }
    
    return response.json();
  }
}

// Initialize Parse API (no SDK needed)
console.log('✅ Parse API initialized:', {
  serverURL: parseConfig.serverURL,
  applicationId: parseConfig.applicationId
});

export default ParseApi;
