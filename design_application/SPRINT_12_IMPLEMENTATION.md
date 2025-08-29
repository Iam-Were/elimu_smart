# Sprint 12 Implementation Checklist

## 🚀 Quick Start Implementation Guide

### Step 1: Install Dependencies
```bash
cd frontend
npm install tailwindcss@^4.1.12 @tailwindcss/postcss@^4.1.12 autoprefixer@^10.4.20 lucide-react@^0.541.0 --save-dev
```

### Step 2: Create Configuration Files

#### `tailwind.config.js`
```javascript
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
```

#### `postcss.config.js`
```javascript
export default {
  plugins: [
    import('@tailwindcss/postcss'),
    import('autoprefixer'),
  ],
}
```

### Step 3: Update CSS Files

#### Add to `src/styles/globals.css`
```css
/* Tailwind directives - AFTER existing Mantine styles */
@import 'tailwindcss/base';
@import 'tailwindcss/components';  
@import 'tailwindcss/utilities';

/* IMPORTANT: Add these AFTER the existing CSS variables and theme classes */

/* Tailwind-Mantine Integration Utilities */
@layer utilities {
  /* Focus states matching Mantine design */
  .mantine-focus {
    @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2;
  }
  
  /* Role-based color utilities */
  .text-role-primary {
    color: var(--primary);
  }
  
  .bg-role-primary {
    background-color: var(--primary);
  }
  
  .border-role-primary {
    border-color: var(--primary);
  }
  
  /* LinkedIn-style professional components */
  .card-professional {
    @apply bg-white border border-gray-200 rounded-lg p-5 shadow-card;
    @apply hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200;
    @apply relative overflow-hidden cursor-pointer;
  }
  
  .card-professional::before {
    content: '';
    @apply absolute top-0 left-0 right-0 h-1 opacity-0 transition-opacity duration-200;
    background: var(--primary);
  }
  
  .card-professional:hover::before {
    @apply opacity-100;
  }
  
  /* Button variants matching Mantine theme */
  .btn-professional-primary {
    @apply bg-primary-400 text-white border border-primary-400 rounded-full px-5 py-2;
    @apply text-sm font-semibold transition-all duration-200;
    @apply hover:bg-primary-500 hover:-translate-y-0.5 hover:shadow-btn-primary;
  }
  
  .btn-professional-secondary {
    @apply bg-transparent text-primary-400 border border-primary-400 rounded-full px-5 py-2;
    @apply text-sm font-semibold transition-all duration-200;
    @apply hover:bg-primary-400 hover:text-white hover:-translate-y-0.5;
  }
  
  .btn-professional-ghost {
    @apply bg-transparent text-gray-700 border border-transparent rounded-full px-5 py-2;
    @apply text-sm font-medium transition-all duration-200;
    @apply hover:bg-primary-50 hover:text-primary-400;
  }
  
  /* Sidebar navigation matching current design */
  .sidebar-nav-item {
    @apply flex items-center px-5 py-3 mx-2 rounded-lg transition-all duration-200;
    @apply text-gray-700 hover:bg-primary-50 hover:text-primary-400;
  }
  
  .sidebar-nav-item.active {
    @apply bg-primary-400 text-white font-medium;
  }
  
  .sidebar-nav-item.active::before {
    content: '';
    @apply absolute left-0 top-0 bottom-0 w-1 bg-white;
  }
  
  /* Icon sizing standards */
  .icon-sm { @apply h-4 w-4; }
  .icon-base { @apply h-5 w-5; }
  .icon-lg { @apply h-6 w-6; }
  .icon-xl { @apply h-8 w-8; }
  
  /* Responsive spacing utilities */
  .spacing-section { @apply py-12 lg:py-20; }
  .spacing-card { @apply p-6 lg:p-8; }
  .spacing-element { @apply mb-4 lg:mb-6; }
}

/* Component-specific Tailwind enhancements */
@layer components {
  /* Dashboard card matching current design */
  .dashboard-card {
    @apply bg-white rounded-xl border border-gray-100 p-6;
    @apply shadow-sm hover:shadow-md transition-all duration-300;
  }
  
  /* Form elements matching Mantine style */
  .form-input-professional {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent;
    @apply bg-white text-gray-900 text-sm;
  }
  
  /* Loading states */
  .loading-shimmer {
    @apply animate-skeleton-loading bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200;
    background-size: 200% 100%;
  }
  
  /* Success/Error states */
  .state-success {
    @apply bg-success-50 border-success-500 text-success-600;
  }
  
  .state-error {
    @apply bg-error-50 border-error-500 text-error-600;
  }
  
  .state-warning {
    @apply bg-warning-50 border-warning-500 text-warning-600;
  }
}

/* Dark mode compatibility */
.dark {
  .card-professional {
    @apply bg-gray-800 border-gray-700;
  }
  
  .btn-professional-ghost {
    @apply text-gray-300 hover:bg-gray-700 hover:text-primary-400;
  }
  
  .sidebar-nav-item {
    @apply text-gray-300 hover:bg-gray-700;
  }
  
  .form-input-professional {
    @apply bg-gray-800 border-gray-600 text-gray-100;
  }
}
```

### Icon Migration Strategy

#### Current Icon System Analysis
The project currently uses `@tabler/icons-react` with Mantine. Migration will maintain visual consistency while standardizing on Lucide React.

#### Size Mapping (Maintain Current Appearance)
```tsx
// Current Mantine/Tabler usage
<IconHome size={16} />     // Small icons
<IconHome size={20} />     // Default icons  
<IconHome size={24} />     // Large icons
<IconHome size={32} />     // XL icons

// New Lucide React equivalent
<Home className="h-4 w-4" />      // Small (16px)
<Home className="h-5 w-5" />      // Default (20px)
<Home className="h-6 w-6" />      // Large (24px) 
<Home className="h-8 w-8" />      // XL (32px)
```

#### Color Integration (Match Current Theme)
```tsx
// Maintain role-based theming
<Home className="h-5 w-5 text-role-primary" />           // Primary color
<Home className="h-5 w-5 text-gray-600" />               // Muted/secondary
<Home className="h-5 w-5 text-success-600" />            // Success state
<Home className="h-5 w-5 text-error-600" />              // Error state

// Theme-aware icons (automatically adapt to role)
<Home className="h-5 w-5" style={{ color: 'var(--primary)' }} />
```

#### Common Icon Mappings
```tsx
// Navigation & UI
import { 
  Home,           // IconHome
  Users,          // IconUsers  
  Settings,       // IconSettings
  Bell,           // IconBell
  Search,         // IconSearch
  Menu,           // IconMenu
  X,              // IconX
  ChevronDown,    // IconChevronDown
  ChevronRight,   // IconChevronRight
  Plus,           // IconPlus
  Edit,           // IconEdit
  Trash2,         // IconTrash
  Eye,            // IconEye
  EyeOff,         // IconEyeOff
} from 'lucide-react';

// Educational & Career
import {
  GraduationCap,  // IconSchool
  BookOpen,       // IconBook
  Target,         // IconTarget
  TrendingUp,     // IconTrendingUp
  Award,          // IconAward
  Calendar,       // IconCalendar
  Clock,          // IconClock
  MapPin,         // IconMapPin
} from 'lucide-react';

// Communication & Social  
import {
  MessageCircle,  // IconMessage
  Mail,           // IconMail
  Phone,          // IconPhone
  Video,          // IconVideo
  Share,          // IconShare
  Heart,          // IconHeart
  ThumbsUp,       // IconThumbUp
} from 'lucide-react';
```

#### Migration Component Example
```tsx
// Before (Mantine + Tabler)
import { IconHome, IconUsers, IconSettings } from '@tabler/icons-react';

const Navigation = () => (
  <nav className="sidebar-nav">
    <a href="/dashboard" className="sidebar-item-linkedin">
      <IconHome size={20} className="sidebar-icon" />
      <span>Dashboard</span>
    </a>
    <a href="/users" className="sidebar-item-linkedin">
      <IconUsers size={20} className="sidebar-icon" />
      <span>Users</span>
    </a>
  </nav>
);

// After (Mantine + Tailwind + Lucide)
import { Home, Users, Settings } from 'lucide-react';

const Navigation = () => (
  <nav className="sidebar-nav">
    <a href="/dashboard" className="sidebar-nav-item active">
      <Home className="icon-base mr-3" />
      <span>Dashboard</span>
    </a>
    <a href="/users" className="sidebar-nav-item">
      <Users className="icon-base mr-3" />  
      <span>Users</span>
    </a>
  </nav>
);
```

## 📋 Daily Implementation Tasks

### Day 1: Foundation Setup ✅
- [ ] Install all dependencies
- [ ] Create configuration files  
- [ ] Update build scripts if needed
- [ ] Test basic Tailwind utilities
- [ ] Verify Mantine components still work

### Day 2: Icon Migration 🎯
- [ ] Audit current icon usage
- [ ] Create icon mapping guide
- [ ] Start systematic replacement in core components
- [ ] Test icon accessibility

### Day 3: Styling Integration 🎨
- [ ] Add Tailwind utilities to layouts
- [ ] Create utility classes for common patterns
- [ ] Implement responsive design improvements
- [ ] Test component interactions

### Day 4: Optimization & Testing 🔍
- [ ] Bundle size analysis
- [ ] Performance testing
- [ ] Cross-browser verification
- [ ] Documentation updates

### Day 5: Finalization 🚀
- [ ] Code review and cleanup
- [ ] Final testing across all features
- [ ] Documentation completion
- [ ] Sprint retrospective

## 🛠️ Common Issues & Solutions

### Issue: CSS Conflicts
**Solution:** Use `corePlugins: { preflight: false }` in Tailwind config

### Issue: Build Errors
**Solution:** Ensure PostCSS config uses correct Tailwind v4 syntax

### Issue: Icon Size Inconsistencies  
**Solution:** Create standardized size classes: `h-4 w-4`, `h-5 w-5`, `h-6 w-6`

## 🎯 Success Validation

### Quick Tests
```bash
# 1. Build test
npm run build

# 2. Dev server test  
npm run dev

# 3. Check bundle size
npm run build && ls -la dist/
```

### Visual Validation
- [ ] All Mantine components render correctly
- [ ] Tailwind utilities apply properly
- [ ] Icons display consistently
- [ ] No layout breaking changes

---

**Ready to start Sprint 12!** 🚀
