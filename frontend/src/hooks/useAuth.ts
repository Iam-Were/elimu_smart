import { useState, useEffect, useCallback } from 'react';
import ParseApi, { type ParseUser, type SessionError } from '../lib/parseApi';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Convert ParseUser to our User type
const parseUserToUser = (parseUser: ParseUser): User => {
  return {
    id: parseUser.objectId || 'unknown',
    email: parseUser.email || parseUser.username || '',
    firstName: parseUser.firstName || 'User',
    lastName: parseUser.lastName || '',
    role: parseUser.role || 'student',
    profileImage: parseUser.profileImage,
    coverPhoto: parseUser.coverPhoto,
    bio: parseUser.bio,
    location: parseUser.location,
    tagline: parseUser.tagline,
    isActive: parseUser.isActive !== false,
    createdAt: parseUser.createdAt || new Date().toISOString(),
    updatedAt: parseUser.updatedAt || new Date().toISOString(),
  };
};

// Authentication service using REST ParseApi + demo fallback
const SESSION_TOKEN_KEY = 'parse-session-token';
// Cached identity so we can render an authenticated shell immediately on boot
// and survive a transient /users/me failure without logging the user out.
// (App.tsx ProtectedRoutes already reads this key for its synchronous check.)
const USER_CACHE_KEY = 'elimu-user';

const cacheUser = (user: User): void => {
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } catch {
    // storage unavailable/full — non-fatal
  }
};

const readCachedUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const clearSession = (): void => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(USER_CACHE_KEY);
};

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const parseUser = await ParseApi.login({ username: credentials.email, password: credentials.password });
      if (parseUser.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, parseUser.sessionToken);
        // ✅ CRITICAL FIX: Sync REST session with Parse SDK
        // This allows Parse.Cloud.run() and Parse SDK methods to work
        try {
          const { getParse } = await import('@/config/parse');
          const Parse = getParse();
          await Parse.User.become(parseUser.sessionToken);
          console.log('✅ Parse SDK session synced - cloud functions will work');
        } catch (sdkError) {
          console.warn('⚠️  Parse SDK sync failed (non-fatal):', sdkError);
        }
      }
      const user = parseUserToUser({
        ...parseUser,
        firstName: parseUser.firstName as string,
        lastName: parseUser.lastName as string,
        role: parseUser.role as string
      } as ParseUser);
      cacheUser(user);
      console.log('✅ Parse REST login successful:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Parse REST login failed:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    console.log('🔄 Starting registration for:', data.email);
    try {
      console.log('📤 Calling ParseApi.register with data:', {
        username: data.email,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: (data.role === 'super_admin' || data.role === 'career_counselor') ? 'counselor' : data.role
      });
      
      const parseUser = await ParseApi.register({
        username: data.email,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: (data.role === 'super_admin' || data.role === 'career_counselor') ? 'counselor' : data.role
      });
      
      console.log('📥 ParseApi.register response:', parseUser);

      if (parseUser.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, parseUser.sessionToken);
        // ✅ CRITICAL FIX: Sync REST session with Parse SDK
        // This allows Parse.Cloud.run() and Parse SDK methods to work
        try {
          const { getParse } = await import('@/config/parse');
          const Parse = getParse();
          await Parse.User.become(parseUser.sessionToken);
          console.log('✅ Parse SDK session synced - cloud functions will work');
        } catch (sdkError) {
          console.warn('⚠️  Parse SDK sync failed (non-fatal):', sdkError);
        }
      }
      const user = parseUserToUser(parseUser as ParseUser);
      cacheUser(user);
      console.log('✅ Parse REST registration successful:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Parse REST registration failed:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      if (token) {
        await ParseApi.logout(token);
      }

      // Session token removal from localStorage is sufficient
      // Parse SDK logout not needed since we use REST API + session tokens
      console.log('✅ Session token cleared from localStorage');
    } catch (error) {
      console.warn('Parse REST logout failed (non-fatal):', error);
    } finally {
      clearSession();
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!sessionToken) return null;

    try {
      const parseUser = await ParseApi.getCurrentUser(sessionToken);
      // ✅ Sync existing session with Parse SDK
      try {
        const { getParse } = await import('@/config/parse');
        const Parse = getParse();
        await Parse.User.become(sessionToken);
      } catch (sdkError) {
        console.warn('⚠️  Parse SDK sync failed:', sdkError);
      }

      const user = parseUserToUser(parseUser as ParseUser);
      cacheUser(user); // refresh cache on successful revalidation
      return user;
    } catch (error) {
      // Only a genuinely dead session (Parse code 209) clears the token.
      // Transient failures (cold-start timeout, 5xx, rate-limit, network) keep
      // the session and fall back to the cached identity so a refresh on a slow
      // connection doesn't bounce the user to the login screen.
      if ((error as SessionError).invalidSession) {
        console.warn('Parse session invalid (209) — clearing session');
        clearSession();
        return null;
      }
      console.warn('Session revalidation failed (transient) — keeping session, using cached user:', error);
      return readCachedUser();
    }
  },
};

export const useAuth = () => {
  // Hydrate from the cached identity synchronously so a returning user sees the
  // authenticated app immediately and revalidation happens in the background.
  const [authState, setAuthState] = useState<AuthState>(() => {
    const cachedUser = readCachedUser();
    const hasToken = !!localStorage.getItem(SESSION_TOKEN_KEY);
    return {
      user: cachedUser,
      isAuthenticated: !!(cachedUser && hasToken),
      // Only block on the initial fetch when we have a token but no cached
      // identity yet (e.g. a session created before this change).
      isLoading: hasToken && !cachedUser,
      error: null,
    };
  });

  const [isAuthReady, setIsAuthReady] = useState(false);

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
        // Mark auth as ready after Parse SDK session is synced
        setIsAuthReady(true);
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Authentication failed',
        });
        setIsAuthReady(true); // Still mark as ready even on error
      }
    };

    initializeAuth();
  }, []);

  // Apply role-based theme when user role changes
  useEffect(() => {
    if (authState.user?.role && typeof document !== 'undefined') {
      const body = document.body;

      // Remove existing theme classes
      body.className = body.className.replace(/theme-\w+/g, '');

      // Apply role-specific theme
      if (authState.user.role === 'admin') {
        body.classList.add('theme-admin');
      } else if (authState.user.role === 'counselor') {
        body.classList.add('theme-counselor');
      }
      // Student role uses default theme (no class needed)
    } else if (!authState.user && typeof document !== 'undefined') {
      // Remove theme classes when logged out
      const body = document.body;
      body.className = body.className.replace(/theme-\w+/g, '');
    }
  }, [authState.user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    setIsAuthReady(false); // Reset auth ready state during login

    try {
      const user = await authService.login(credentials);

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Mark auth as ready after login completes (Parse SDK session synced in authService)
      setIsAuthReady(true);

      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      setIsAuthReady(true); // Mark as ready even on error
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    setIsAuthReady(false); // Reset auth ready state during registration

    try {
      const user = await authService.register(data);

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Mark auth as ready after registration completes (Parse SDK session synced in authService)
      setIsAuthReady(true);

      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      setIsAuthReady(true); // Mark as ready even on error
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    setIsAuthReady(false);

    try {
      await authService.logout();

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      setIsAuthReady(true);
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
      setIsAuthReady(true);
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    isAuthReady,
    login,
    register,
    logout,
    clearError,
  };
};
