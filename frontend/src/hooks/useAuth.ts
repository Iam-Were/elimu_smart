import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Mock authentication service - replace with real API calls
const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'admin@elimu.com' && credentials.password === 'admin') {
      return {
        id: '1',
        email: credentials.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (credentials.email === 'counselor@elimu.com' && credentials.password === 'counselor') {
      return {
        id: '2',
        email: credentials.email,
        firstName: 'Career',
        lastName: 'Counselor',
        role: 'counselor',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (credentials.email === 'student@elimu.com' && credentials.password === 'student') {
      return {
        id: '3',
        email: credentials.email,
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Invalid email or password');
  },

  register: async (data: RegisterData): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user creation
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
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('elimu-auth-token');
    if (!token) return null;

    // Mock token validation
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
        const user = await mockAuthService.getCurrentUser();
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
          error: error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await mockAuthService.login(credentials);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
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
      const user = await mockAuthService.register(data);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
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
      await mockAuthService.logout();
      
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