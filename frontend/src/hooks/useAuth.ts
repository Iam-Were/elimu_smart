import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Backend API URL
const API_BASE_URL = 'http://localhost:3001/api';

// Real authentication service connecting to backend
const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    // Convert backend user format to frontend User type
    return {
      id: data.user.name?.split(' ')[0]?.toLowerCase() || 'user',
      email: credentials.email,
      firstName: data.user.name?.split(' ')[0] || 'User',
      lastName: data.user.name?.split(' ')[1] || '',
      role: data.user.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
