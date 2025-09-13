import { useState, useEffect, useCallback } from 'react';
import { getParse, initializeParse } from '../config/parse';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';
import type { ParseUserLike } from '../types/shared';
import { applyRoleTheme } from '../theme/mantineTheme';

// Convert Parse User to our User interface
const parseUserToUser = (parseUser: ParseUserLike): User => {
  return {
    id: parseUser.id || '',
    email: (parseUser.get('email') || parseUser.get('username') || '') as string,
    firstName: (parseUser.get('firstName') || '') as string,
    lastName: (parseUser.get('lastName') || '') as string,
    role: (parseUser.get('role') || 'student') as User['role'],
    adminRoleType: parseUser.get('adminRoleType') as User['adminRoleType'],
    profileImage: parseUser.get('profileImage') as string | undefined,
    isActive: parseUser.get('isActive') !== false,
    createdAt: parseUser.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: parseUser.updatedAt?.toISOString() || new Date().toISOString(),
  };
};

export const useParseAuth = () => {
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
        const Parse = await getParse();
        const currentParseUser = Parse.User.current();
        
        if (currentParseUser) {
          const user = parseUserToUser(currentParseUser);
          
          // Apply role-based theme
          const roleThemeMap: Record<string, string> = {
            'student': 'student',
            'counselor': 'counselor', 
            'admin': 'admin'
          };
          const themeRole = roleThemeMap[user.role] || 'student';
          localStorage.setItem('elimu-theme', themeRole);
          applyRoleTheme(themeRole as 'student' | 'counselor' | 'admin');
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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
      await initializeParse(); // Initialize Parse before using it
      const Parse = await getParse();
      const parseUser = await Parse.User.logIn(credentials.email, credentials.password);
      const user = parseUserToUser(parseUser);

      // Apply role-based theme
      const roleThemeMap: Record<string, string> = {
        'student': 'student',
        'counselor': 'counselor', 
        'admin': 'admin'
      };
      const themeRole = roleThemeMap[user.role] || 'student';
      localStorage.setItem('elimu-theme', themeRole);
      applyRoleTheme(themeRole as 'student' | 'counselor' | 'admin');

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
      const Parse = await getParse();
      const parseUser = new Parse.User();
      parseUser.set('username', data.email);
      parseUser.set('email', data.email);
      parseUser.set('password', data.password);
      parseUser.set('firstName', data.firstName);
      parseUser.set('lastName', data.lastName);
      parseUser.set('role', data.role);
      parseUser.set('isActive', true);

      await parseUser.signUp();
      
      const user = parseUserToUser(parseUser);

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
      const Parse = await getParse();
      await Parse.User.logOut();
      
      localStorage.removeItem('elimu-theme');

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

  // Test cloud function
  const testCloudFunction = useCallback(async () => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('hello');
      console.log('Cloud function result:', result);
      return result;
    } catch (error) {
      console.error('Cloud function error:', error);
      throw error;
    }
  }, []);

  // Calculate KUCCPS points using cloud function
  const calculateKUCCPSPoints = useCallback(async (subjects: string[], gradePoints: Record<string, string>) => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('calculateKUCCPSPoints', {
        subjects,
        gradePoints
      });
      return result;
    } catch (error) {
      console.error('KUCCPS calculation error:', error);
      throw error;
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    testCloudFunction,
    calculateKUCCPSPoints,
  };
};