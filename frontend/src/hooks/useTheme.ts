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

export const useTheme = (): UseThemeReturn => {
  const [currentTheme, setCurrentTheme] = useState<ThemeRole>(() => {
    // Get initial theme from localStorage (Parse fallback handled in service)
    const savedTheme = localStorage.getItem('elimu-theme');
    if (savedTheme === 'orange' || savedTheme === 'yellow' || savedTheme === 'purple') {
      return themeToRole(savedTheme);
    }
    return 'student';
  });

  const [isDark, setIsDark] = useState(() => {
    // Get initial dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem('elimu-dark-mode');
    if (savedDarkMode !== null) {
      return savedDarkMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    applyRoleTheme(currentTheme);
    localStorage.setItem('elimu-theme', roleToTheme(currentTheme));
  }, [currentTheme]);

  // Apply dark mode when it changes
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('elimu-dark-mode', String(isDark));
  }, [isDark]);

  // Listen for system dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set dark mode preference
      const savedDarkMode = localStorage.getItem('elimu-dark-mode');
      if (savedDarkMode === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
