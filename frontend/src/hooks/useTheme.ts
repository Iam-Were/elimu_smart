import { useState, useEffect, useCallback } from 'react';
import { applyRoleTheme } from '../theme/mantineTheme';
import type { ThemeRole } from '../types';

interface UseThemeReturn {
  currentTheme: ThemeRole;
  setTheme: (theme: ThemeRole) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const [currentTheme, setCurrentTheme] = useState<ThemeRole>(() => {
    // Get initial theme from localStorage or default to student
    const savedTheme = localStorage.getItem('elimu-theme') as ThemeRole;
    return savedTheme || 'student';
  });

  const [isDark, setIsDark] = useState(() => {
    // Get initial dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem('elimu-dark-mode');
    if (savedDarkMode !== null) {
      return JSON.parse(savedDarkMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    applyRoleTheme(currentTheme);
    localStorage.setItem('elimu-theme', currentTheme);
  }, [currentTheme]);

  // Apply dark mode when it changes
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('elimu-dark-mode', JSON.stringify(isDark));
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
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev: boolean) => !prev);
  }, []);

  return {
    currentTheme,
    setTheme,
    isDark,
    toggleDarkMode,
  };
};