import { useState, useEffect, useCallback } from 'react';
import { applyRoleTheme } from '../constants/theme';
import type { ThemeRole } from '../types';
import { setTheme as saveTheme, setDarkMode as saveDarkMode } from '@/lib/userPreferences';

interface UseThemeReturn {
  currentTheme: ThemeRole;
  setTheme: (theme: ThemeRole) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

// Map theme roles to preference values
const roleToTheme = (role: ThemeRole): 'orange' | 'yellow' | 'purple' => {
  if (role === 'student') return 'orange';
  if (role === 'counselor') return 'yellow';
  if (role === 'admin') return 'purple';
  return 'orange';
};

const themeToRole = (theme: 'orange' | 'yellow' | 'purple'): ThemeRole => {
  if (theme === 'orange') return 'student';
  if (theme === 'yellow') return 'counselor';
  if (theme === 'purple') return 'admin';
  return 'student';
};

// Get user's role-based theme from body classes (set by useAuth)
const getUserRoleTheme = (): ThemeRole | null => {
  try {
    const body = document.body;
    if (body.classList.contains('theme-admin')) return 'admin';
    if (body.classList.contains('theme-counselor')) return 'counselor';
    // Student is default (no class needed per useAuth line 190)
    // If user is logged in but no theme-admin/counselor class, they're a student
    return 'student';
  } catch (error) {
    console.warn('Failed to get user role for theme:', error);
  }
  return null;
};

export const useTheme = (): UseThemeReturn => {
  const [currentTheme, setCurrentTheme] = useState<ThemeRole>(() => {
    // PRIORITY 1: Use user's role-based theme if logged in
    const roleTheme = getUserRoleTheme();
    if (roleTheme) {
      return roleTheme;
    }
    
    // PRIORITY 2: Get theme from localStorage (for manual overrides)
    const savedTheme = localStorage.getItem('elimu-theme');
    if (savedTheme === 'orange' || savedTheme === 'yellow' || savedTheme === 'purple') {
      return themeToRole(savedTheme);
    }
    
    // PRIORITY 3: Default to student theme
    return 'student';
  });

  const [isDark, setIsDark] = useState(() => {
    // Get initial dark mode from localStorage
    const savedDarkMode = localStorage.getItem('elimu-dark-mode');
    if (savedDarkMode !== null) {
      return savedDarkMode === 'true';
    }
    // Default to light mode (don't use system preference to avoid mobile issues)
    return false;
  });

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    applyRoleTheme(currentTheme);
    localStorage.setItem('elimu-theme', roleToTheme(currentTheme));
  }, [currentTheme]);

  // 🎨 AUTO-SYNC THEME WITH USER ROLE
  // When user logs in/out or role changes, update theme automatically
  useEffect(() => {
    const syncThemeWithUserRole = () => {
      const roleTheme = getUserRoleTheme();
      if (roleTheme && roleTheme !== currentTheme) {
        console.log(`🎨 Auto-syncing theme from ${currentTheme} to ${roleTheme} based on user role`);
        setCurrentTheme(roleTheme);
      }
    };

    // Check immediately on mount
    syncThemeWithUserRole();

    // Poll for role changes every 2 seconds (handles role switching, login/logout)
    const interval = setInterval(syncThemeWithUserRole, 2000);

    return () => clearInterval(interval);
  }, [currentTheme]);

  // Apply dark mode when it changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      document.body.classList.add('dark');
      root.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      root.classList.remove('dark');
    }
    localStorage.setItem('elimu-dark-mode', String(isDark));
  }, [isDark]);

  // Remove system dark mode listener to prevent mobile conflicts
  // Users must explicitly toggle dark mode instead of following system preference
  useEffect(() => {
    // Force light mode on initial load if no preference is saved (mobile fix)
    const savedDarkMode = localStorage.getItem('elimu-dark-mode');
    if (savedDarkMode === null) {
      const root = document.documentElement;
      document.body.classList.remove('dark');
      root.classList.remove('dark');
    }
  }, []);

  const setTheme = useCallback((theme: ThemeRole) => {
    setCurrentTheme(theme);
    // Save to Parse backend (non-blocking)
    saveTheme(roleToTheme(theme)).catch(() => {
      console.warn('Theme saved locally, will sync to backend when online');
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev: boolean) => {
      const newValue = !prev;
      // Save to Parse backend (non-blocking)
      saveDarkMode(newValue).catch(() => {
        console.warn('Dark mode saved locally, will sync to backend when online');
      });
      return newValue;
    });
  }, []);

  return {
    currentTheme,
    setTheme,
    isDark,
    toggleDarkMode,
  };
};
