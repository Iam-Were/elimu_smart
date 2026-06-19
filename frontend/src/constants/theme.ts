/**
 * Centralized theme color definitions for role-based theming
 * Single source of truth for all role colors across the application
 */

import type { ThemeRole } from '../types';

export const ROLE_COLORS = {
  student: '#f97316',    // Orange
  counselor: '#eab308',  // Yellow  
  admin: '#a855f7',      // Purple
} as const;

export const ROLE_CSS_COLORS = {
  student: {
    primary: '#f97316',
    light: '#fed7aa',
    dark: '#ea580c',
    gradient: 'from-orange-500 to-orange-600',
  },
  counselor: {
    primary: '#eab308',
    light: '#fef3c7', 
    dark: '#d97706',
    gradient: 'from-yellow-500 to-yellow-600',
  },
  admin: {
    primary: '#a855f7',
    light: '#e9d5ff',
    dark: '#9333ea', 
    gradient: 'from-purple-500 to-purple-600',
  },
} as const;

export const getRoleColor = (role: ThemeRole): string => {
  return ROLE_COLORS[role] || ROLE_COLORS.student;
};

export const getRoleCSSColors = (role: ThemeRole) => {
  return ROLE_CSS_COLORS[role] || ROLE_CSS_COLORS.student;
};

export const getRoleBadgeColor = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'student':
      return 'bg-orange-100 text-orange-700';
    case 'counselor':
      return 'bg-yellow-100 text-yellow-700';
    case 'admin':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Role-based theme utilities — integrated with shadcn system.
// Colors come ONLY from the CSS cascade (:root / .dark / .theme-* in
// globals.css). We never set --primary as an inline style here: inline styles
// outrank class selectors, so an inline --primary would override the .dark
// overrides and break dark mode — the recurring bug across 15+ prior fixes.
export const applyRoleTheme = (role: ThemeRole) => {
  // Remove existing theme classes
  document.body.className = document.body.className.replace(/theme-\w+/g, '');

  // Add smooth transition
  document.body.style.transition = 'all 0.3s ease-in-out';

  // Apply role-specific theme class (student is the default — no class needed)
  if (role === 'admin') {
    document.body.classList.add('theme-admin');
  } else if (role === 'counselor') {
    document.body.classList.add('theme-counselor');
  }

  // Remove transition after animation completes
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
};

// Helper function to get current theme class (migrated from mantineTheme.ts)
export const getCurrentTheme = (): ThemeRole => {
  if (document.body.classList.contains('theme-admin')) return 'admin';
  if (document.body.classList.contains('theme-counselor')) return 'counselor';
  return 'student';
};