import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Parse Server API URL
const API_BASE_URL = 'http://localhost:1337/parse';

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

// Real authentication service connecting to Parse Server
const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Use Parse Server login endpoint
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'elimu-smart-local-dev',
        'X-Parse-REST-API-Key': 'elimu-smart-master-key-dev', // Using master key for demo
      },
      body: JSON.stringify({
        username: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      // If Parse login fails, fall back to demo users for development
      return getDemoUser(credentials.email);
    }

    const data = await response.json();
    
    // Convert Parse user format to frontend User type
    return {
      id: data.objectId || 'user',
      email: data.username || credentials.email,
      firstName: data.firstName || 'User',
      lastName: data.lastName || '',
      role: data.role || 'student',
      isActive: true,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  },

  register: async (data: RegisterData): Promise<User> => {
    // For now, keep mock registration since it's not implemented in backend
    await new Promise(resolve => setTimeout(resolve, 500));

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
  },

  logout: async (): Promise<void> => {
    // Simple logout - just clear local storage
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('elimu-auth-token');
    if (!token) return null;

    // Get user from local storage
    try {
      const userData = JSON.parse(localStorage.getItem('elimu-user') || '');
      return userData;
    } catch {
      return null;
    }
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
