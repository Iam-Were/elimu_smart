import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
  // Use system font stack for better performance
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    'SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Base font size matches CSS custom property
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px - Base size
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
  },

  // Line heights for readability
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.55',
    lg: '1.6',
    xl: '1.65',
  },

  // Spacing system aligned with CSS variables (8px grid)
  spacing: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },

  // Border radius system
  radius: {
    xs: '0.375rem', // 6px
    sm: '0.5rem', // 8px
    md: '0.625rem', // 10px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
  },

  // Color palette with role-based theming
  colors: {
    // Student theme colors (Orange)
    primary: [
      '#fef9e7', // 50
      '#fed7aa', // 100
      '#fdba74', // 200
      '#fb923c', // 300
      '#f97316', // 400 - Primary
      '#ea580c', // 500
      '#dc2626', // 600
      '#b91c1c', // 700
      '#991b1b', // 800
      '#7f1d1d', // 900
    ],

    // Admin theme colors (Purple/Violet)
    admin: [
      '#faf5ff', // 50
      '#f3e8ff', // 100
      '#e9d5ff', // 200
      '#d8b4fe', // 300
      '#a855f7', // 400 - Primary
      '#9333ea', // 500
      '#7c3aed', // 600
      '#6d28d9', // 700
      '#5b21b6', // 800
      '#4c1d95', // 900
    ],

    // Counselor theme colors (Yellow)
    counselor: [
      '#fefce8', // 50
      '#fef3c7', // 100
      '#fde047', // 200
      '#facc15', // 300
      '#eab308', // 400 - Primary
      '#ca8a04', // 500
      '#a16207', // 600
      '#854d0e', // 700
      '#713f12', // 800
      '#52341b', // 900
    ],

    // System colors
    success: [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#14532d',
    ],

    warning: [
      '#fffbeb',
      '#fef3c7',
      '#fde68a',
      '#fcd34d',
      '#fbbf24',
      '#f59e0b',
      '#d97706',
      '#b45309',
      '#92400e',
      '#78350f',
    ],

    error: [
      '#fef2f2',
      '#fecaca',
      '#fca5a5',
      '#f87171',
      '#ef4444',
      '#dc2626',
      '#b91c1c',
      '#991b1b',
      '#7f1d1d',
      '#6b1e1e',
    ],

    info: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
    ],
  },

  // Default to primary color (will be overridden by role theming)
  primaryColor: 'primary',
  primaryShade: 4,

  // Default radius
  defaultRadius: 'md',

  // Shadow system
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '36em', // 576px
    sm: '48em', // 768px
    md: '62em', // 992px
    lg: '75em', // 1200px
    xl: '88em', // 1408px
  },
});

// Helper function to apply role-based theme to document
export const applyRoleTheme = (role: string) => {
  // Remove existing theme classes
  document.body.className = document.body.className.replace(/theme-\w+/g, '');

  // Add smooth transition
  document.body.style.transition = 'all 0.3s ease-in-out';

  // Apply role-specific theme class
  if (role === 'admin' || role === 'super_admin') {
    document.body.classList.add('theme-admin');
  } else if (role === 'counselor' || role === 'career_counselor') {
    document.body.classList.add('theme-counselor');
  }
  // Student theme is default (no class needed)

  // Remove transition after animation completes
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
};

// Helper function to get current theme class
export const getCurrentTheme = () => {
  if (document.body.classList.contains('theme-admin')) return 'admin';
  if (document.body.classList.contains('theme-counselor')) return 'counselor';
  return 'student';
};

// Helper function to create role-specific Mantine provider props
export const getMantineProviderProps = (role: string) => ({
  theme: {
    ...mantineTheme,
    primaryColor:
      role === 'admin'
        ? 'admin'
        : role === 'counselor'
          ? 'counselor'
          : 'primary',
  },
});

export default mantineTheme;
