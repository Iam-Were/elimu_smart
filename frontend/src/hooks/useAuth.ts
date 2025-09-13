import { useState, useEffect, useCallback } from 'react';
import ParseApi, { type ParseUser } from '../lib/parseApi';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Convert ParseUser to our User type
const parseUserToUser = (parseUser: ParseUser): User => {
  return {
    id: parseUser.objectId || 'unknown',
    email: parseUser.email || parseUser.username || '',
    firstName: parseUser.firstName || 'User',
    lastName: parseUser.lastName || '',
    role: parseUser.role || 'student',
    isActive: parseUser.isActive !== false,
    createdAt: parseUser.createdAt || new Date().toISOString(),
    updatedAt: parseUser.updatedAt || new Date().toISOString(),
  };
};

// Demo users for development fallback
const getDemoUser = (email: string): User => {
  const demoUsers: Record<string, User> = {
    'student@elimu.com': {
      id: 'student-001',
      email: 'student@elimu.com',
      firstName: 'Alex',
      lastName: 'Mwangi',
      role: 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'counselor@elimu.com': {
      id: 'counselor-001',
      email: 'counselor@elimu.com',
      firstName: 'Sarah',
      lastName: 'Njoki',
      role: 'counselor',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'admin@elimu.com': {
      id: 'admin-001',
      email: 'admin@elimu.com',
      firstName: 'Michael',
      lastName: 'Kimani',
      role: 'admin',
      adminRoleType: 'platform',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  const user = demoUsers[email];
  if (!user) {
    throw new Error('Invalid email or password');
  }
  return user;
};

// Authentication service using REST ParseApi + demo fallback
const SESSION_TOKEN_KEY = 'parse-session-token';

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const parseUser = await ParseApi.login({ username: credentials.email, password: credentials.password });
      if (parseUser.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, parseUser.sessionToken);
      }
      const user = parseUserToUser({
        ...parseUser,
        firstName: parseUser.firstName as string,
        lastName: parseUser.lastName as string,
        role: parseUser.role as string
      } as ParseUser);
      console.log('✅ Parse REST login successful:', user.email);
      return user;
    } catch (error) {
      console.warn('Parse REST login failed, falling back to demo user:', error);
      return getDemoUser(credentials.email);
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    try {
      const parseUser = await ParseApi.register({
        username: data.email,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
  role: (data.role === 'super_admin' || data.role === 'career_counselor') ? 'counselor' : data.role
      });
      if (parseUser.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, parseUser.sessionToken);
      }
      const user = parseUserToUser(parseUser as ParseUser);
      console.log('✅ Parse REST registration successful:', user.email);
      return user;
    } catch (error) {
      console.warn('Parse REST registration failed, using mock fallback:', error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      if (token) {
        await ParseApi.logout(token);
      }
    } catch (error) {
      console.warn('Parse REST logout failed (non-fatal):', error);
    } finally {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (sessionToken) {
      try {
        const parseUser = await ParseApi.getCurrentUser(sessionToken);
        return parseUserToUser(parseUser as ParseUser);
      } catch (error) {
        console.warn('Parse REST session invalid, clearing token:', error);
        localStorage.removeItem(SESSION_TOKEN_KEY);
      }
    }

    // Demo fallback
    try {
      const stored = localStorage.getItem('elimu-user');
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch {/* ignore */}
    return null;
  },
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authService.login(credentials);

      // Store auth data
      localStorage.setItem('elimu-auth-token', 'mock-token');
      localStorage.setItem('elimu-user', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authService.register(data);

      // Store auth data
      localStorage.setItem('elimu-auth-token', 'mock-token');
      localStorage.setItem('elimu-user', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();

      // Clear auth data
      localStorage.removeItem('elimu-auth-token');
      localStorage.removeItem('elimu-user');

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
  };
};
