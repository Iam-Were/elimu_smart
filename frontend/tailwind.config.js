/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EXACT MANTINE THEME INTEGRATION - Role-based colors
        // Student Theme (Primary) - Figma Exact Orange #ff6b35
        primary: {
          50: '#fff4f0',   // Very light orange
          100: '#ffe9e0',  // Light orange  
          200: '#ffd6c4',  // Lighter orange
          300: '#ffb899',  // Light-medium orange
          400: '#ff6b35',  // PRIMARY - Figma exact orange
          500: '#e65100',  // Darker orange
          600: '#d84315',  // Dark orange
          700: '#bf360c',  // Very dark orange
          800: '#a6360c',  // Deeper orange
          900: '#8d2e0b',  // Deepest orange
        },
        // Admin Theme - Purple/Violet
        admin: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#a855f7',   // PRIMARY
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Counselor Theme - Yellow
        counselor: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde047',
          300: '#facc15',
          400: '#eab308',   // PRIMARY
          500: '#ca8a04',
          600: '#a16207',
          700: '#854d0e',
          800: '#713f12',
          900: '#52341b',
        },
        // System Colors matching globals.css
        success: {
          50: '#f0fdf4',
          500: '#059669',   // --success color
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#d97706',   // --warning color
          600: '#ca8a04',
        },
        error: {
          50: '#fef2f2',
          500: '#dc2626',   // --destructive color
          600: '#b91c1c',
        },
        info: {
          50: '#f0f9ff',
          500: '#0ea5e9',   // --info color
          600: '#0284c7',
        },
        // Background colors from CSS variables
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
      },
      fontFamily: {
        // Match Mantine font stack
        sans: [
          '-apple-system',
          'BlinkMacSystemFont', 
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'SFMono-Regular',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ],
      },
      fontSize: {
        // Match Mantine font sizes
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px - Base size
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
      },
      spacing: {
        // 8px grid system matching globals.css
        1: '0.125rem',    // 2px
        2: '0.25rem',     // 4px
        3: '0.5rem',      // 8px - Base unit
        4: '0.75rem',     // 12px
        5: '1rem',        // 16px
        6: '1.5rem',      // 24px
        8: '2rem',        // 32px
        10: '2.5rem',     // 40px
        12: '3rem',       // 48px
        16: '4rem',       // 64px
      },
      borderRadius: {
        // Match Mantine radius system
        xs: '0.375rem',   // 6px
        sm: '0.5rem',     // 8px
        DEFAULT: '0.625rem', // 10px - Default radius
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
      },
      boxShadow: {
        // LinkedIn-inspired professional shadows
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'btn-primary': '0 4px 8px rgba(255, 107, 53, 0.3)',
      },
      animation: {
        // Custom animations matching globals.css
        'skeleton-loading': 'skeleton-loading 1.5s ease-in-out infinite',
        'success-scale': 'success-scale 0.3s ease-out',
        'error-shake': 'error-shake 0.5s ease-in-out',
        'progressive-reveal': 'progressive-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
      },
    },
  },
  plugins: [
    // Add custom utilities for Mantine integration
    function({ addUtilities }) {
      addUtilities({
        '.mantine-focus': {
          '&:focus': {
            outline: '2px solid var(--primary)',
            'outline-offset': '2px',
          },
        },
        '.card-linkedin': {
          background: 'var(--background)',
          border: '1px solid #e0e0e0',
          'border-radius': '8px',
          padding: '20px',
          'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        },
        '.btn-linkedin-primary': {
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: '1px solid var(--primary)',
          'border-radius': '24px',
          padding: '8px 20px',
          'font-size': '0.875rem',
          'font-weight': '600',
          transition: 'all 0.2s ease',
        },
      });
    },
  ],
  // CRITICAL: Ensure compatibility with Mantine
  corePlugins: {
    preflight: false, // Disable Tailwind's reset to avoid Mantine conflicts
  },
}