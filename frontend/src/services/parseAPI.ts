// Parse Server HTTP API Client - Clean Architecture Following CLAUDE.md
// No Parse SDK dependency issues, direct REST API approach

interface ParseConfig {
  serverURL: string;
  appId: string;
  jsKey: string;
}

class ParseAPIClient {
  private config: ParseConfig;

  constructor() {
    this.config = {
      serverURL: import.meta.env.VITE_PARSE_SERVER_URL || 'http://localhost:1337/parse',
      appId: import.meta.env.VITE_PARSE_APP_ID || 'elimu-smart-local-dev',
      jsKey: import.meta.env.VITE_PARSE_JS_KEY || 'elimu-smart-js-key-dev'
    };
    
    console.log('✅ Parse API Client initialized:', {
      serverURL: this.config.serverURL,
      appId: this.config.appId
    });
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': this.config.appId,
      'X-Parse-JavaScript-Key': this.config.jsKey
    };
  }

  // Authentication Methods
  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.config.serverURL}/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Parse login successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Parse login failed:', error);
      throw error;
    }
  }

  async signUp(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    try {
      const response = await fetch(`${this.config.serverURL}/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`Signup failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Parse signup successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Parse signup failed:', error);
      throw error;
    }
  }

  async logout(sessionToken: string) {
    try {
      const response = await fetch(`${this.config.serverURL}/logout`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'X-Parse-Session-Token': sessionToken
        }
      });
      
      console.log('✅ Parse logout completed');
      return response.ok;
    } catch (error) {
      console.error('❌ Parse logout failed:', error);
      return false;
    }
  }

  // Cloud Function Methods
  async callCloudFunction(functionName: string, params: Record<string, unknown> = {}, sessionToken?: string) {
    try {
      const headers = { ...this.getHeaders() };
      if (sessionToken) {
        headers['X-Parse-Session-Token'] = sessionToken;
      }

      const response = await fetch(`${this.config.serverURL}/functions/${functionName}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Cloud function ${functionName} failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`✅ Cloud function ${functionName} success:`, result);
      return result.result;
    } catch (error) {
      console.error(`❌ Cloud function ${functionName} failed:`, error);
      throw error;
    }
  }

  // Test connection to Parse Server
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverURL}/health`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      console.log('✅ Parse Server connection test successful');
      return response.ok;
    } catch (error) {
      console.error('❌ Parse Server connection test failed:', error);
      return false;
    }
  }
}

// Single instance export following CLAUDE.md patterns
export const parseAPI = new ParseAPIClient();
export default parseAPI;
