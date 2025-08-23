# Dark Mode Implementation Guide

## 🌙 Dark Mode Design Philosophy

### Core Principles
1. **Maintain Brand Identity**: Primary colors (orange, purple, yellow) remain vibrant
2. **Reduce Eye Strain**: Use dark grays instead of pure black
3. **Preserve Contrast**: Ensure accessibility standards are met
4. **Smooth Transitions**: Implement seamless mode switching
5. **Context Awareness**: Respect user preferences and system settings

## 🎨 Dark Mode Color System

### Base Color Palette
```css
/* Dark Mode Foundation Colors */
:root.dark {
  /* Background Hierarchy */
  --background: #1a1a1a;          /* Main page background - warm dark */
  --card: #262626;                /* Card backgrounds - slightly lighter */
  --popover: #2d2d2d;            /* Overlays and popovers */
  --muted: #404040;               /* Muted sections and inactive areas */
  
  /* Text Hierarchy */
  --foreground: #fafafa;          /* Primary text - off-white for comfort */
  --card-foreground: #f5f5f5;     /* Text on cards */
  --muted-foreground: #a3a3a3;    /* Secondary text */
  
  /* Interactive Elements */
  --border: #404040;              /* Subtle borders */
  --input: #2d2d2d;              /* Form input backgrounds */
  --ring: var(--primary);         /* Focus rings maintain brand colors */
  
  /* Brand Colors (Stay Vibrant) */
  --primary: #f97316;             /* Orange stays vibrant */
  --admin-primary: #a855f7;       /* Purple stays vibrant */
  --counselor-primary: #eab308;   /* Yellow stays vibrant */
  
  /* Status Colors (Adjusted for Dark) */
  --success: #10b981;             /* Green - slightly more vibrant */
  --destructive: #ef4444;         /* Red - adjusted for dark backgrounds */
  --warning: #f59e0b;             /* Orange-yellow for warnings */
  --info: #3b82f6;               /* Blue for information */
}
```

### Role-Themed Dark Mode Colors
```css
/* Student Dark Theme */
.dark.theme-student {
  --primary: #f97316;
  --secondary: #451a03;           /* Very dark orange */
  --accent: #7c2d12;              /* Medium dark orange */
  --muted: #1c1917;              /* Warm dark brown */
  --border: rgba(249, 115, 22, 0.3);
}

/* Admin Dark Theme */
.dark.theme-admin {
  --primary: #a855f7;
  --secondary: #3730a3;           /* Dark purple */
  --accent: #4c1d95;              /* Medium dark purple */
  --muted: #1e1b4b;              /* Deep purple-blue */
  --border: rgba(168, 85, 247, 0.3);
}

/* Counselor Dark Theme */
.dark.theme-counselor {
  --primary: #eab308;
  --secondary: #713f12;           /* Dark yellow-brown */
  --accent: #92400e;              /* Medium amber */
  --muted: #451a03;              /* Warm dark brown */
  --border: rgba(234, 179, 8, 0.3);
}
```

## 🔧 Implementation Patterns

### Dark Mode Toggle Component
```tsx
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemPreference === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'system': return 'System';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        inline-flex items-center space-x-2 px-3 py-2 rounded-lg
        bg-gray-100 dark:bg-gray-800 
        hover:bg-gray-200 dark:hover:bg-gray-700
        text-gray-700 dark:text-gray-200
        transition-colors duration-200
        ${className}
      `}
      title={`Current: ${getLabel()}. Click to cycle themes.`}
    >
      {getIcon()}
      <span className="text-sm font-medium hidden sm:inline">{getLabel()}</span>
    </button>
  );
};

export default DarkModeToggle;
```

### Dark Mode-Aware Component Patterns

#### Card Component with Dark Mode
```tsx
// Dark mode card component
<div className="
  bg-white dark:bg-gray-800 
  border border-gray-200 dark:border-gray-700 
  rounded-lg shadow-sm 
  hover:shadow-md dark:hover:shadow-lg
  transition-all duration-200
  p-6
">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Card Title
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Card description
        </p>
      </div>
    </div>
  </div>
  
  <div className="space-y-3">
    <p className="text-gray-700 dark:text-gray-200">
      Content text that adapts to theme
    </p>
  </div>
  
  <div className="flex items-center justify-between mt-4 pt-4 
                  border-t border-gray-100 dark:border-gray-700">
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Additional info
    </span>
    <Button variant="primary">Action</Button>
  </div>
</div>

/* Key Dark Mode Patterns:
- Background: white → gray-800
- Borders: gray-200 → gray-700  
- Primary text: gray-900 → gray-100
- Secondary text: gray-600 → gray-300
- Muted text: gray-500 → gray-400
- Icon backgrounds get slightly more opacity in dark mode
*/
```

#### Form Components with Dark Mode
```tsx
// Dark mode form input
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Input Label
    </label>
    <input
      type="text"
      className="
        block w-full px-3 py-2 rounded-lg
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-gray-100
        placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
        transition-colors duration-200
      "
      placeholder="Enter text here..."
    />
  </div>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Select Option
    </label>
    <select className="
      block w-full px-3 py-2 rounded-lg
      bg-white dark:bg-gray-800
      border border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-gray-100
      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
      transition-colors duration-200
    ">
      <option value="">Choose option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
</div>
```

#### Button Variations in Dark Mode
```tsx
// Primary button (stays the same - gradient works in both modes)
<Button className="
  bg-gradient-primary text-white 
  hover:shadow-lg hover:-translate-y-0.5
  transition-all duration-200
">
  Primary Action
</Button>

// Secondary button (adapts to dark mode)
<Button className="
  bg-white dark:bg-gray-800 
  border-2 border-primary 
  text-primary 
  hover:bg-primary hover:text-white
  transition-all duration-200
">
  Secondary Action
</Button>

// Ghost button (adapts to dark mode)
<Button className="
  bg-transparent 
  text-primary 
  hover:bg-primary/10 dark:hover:bg-primary/20
  transition-all duration-200
">
  Ghost Action
</Button>

/* Button Dark Mode Principles:
- Primary buttons keep gradients (they work well in both modes)
- Secondary buttons adapt background and border colors
- Ghost buttons increase hover background opacity in dark mode
- Text colors remain consistent (primary brand colors)
*/
```

### Navigation Components in Dark Mode

#### Header Navigation
```tsx
<header className="
  bg-white dark:bg-gray-900 
  border-b border-gray-200 dark:border-gray-700 
  shadow-sm dark:shadow-md
  sticky top-0 z-50
">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
        <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
          Elimu Smart
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="
          flex items-center space-x-2 px-3 py-2 rounded-lg
          text-gray-600 dark:text-gray-300 
          hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10
          transition-colors duration-200
        ">
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </a>
      </nav>
      
      {/* Theme toggle and user menu */}
      <div className="flex items-center space-x-3">
        <DarkModeToggle />
        <Button variant="primary" size="sm">Upgrade</Button>
        <div className="relative">
          <img className="h-8 w-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700" 
               src="/avatar.jpg" alt="User" />
        </div>
      </div>
      
    </div>
  </div>
</header>
```

#### Sidebar Navigation
```tsx
<aside className="
  w-64 bg-white dark:bg-gray-900 
  border-r border-gray-200 dark:border-gray-700 
  flex flex-col
">
  <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
    <nav className="mt-5 flex-1 px-2 space-y-1">
      
      {/* Navigation item */}
      <a href="#" className="
        group flex items-center px-2 py-2 text-sm font-medium rounded-md
        text-gray-900 dark:text-gray-100 
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-200
      ">
        <Icon className="mr-3 h-5 w-5 text-primary" />
        Navigation Item
      </a>
      
      {/* Inactive navigation item */}
      <a href="#" className="
        group flex items-center px-2 py-2 text-sm font-medium rounded-md
        text-gray-600 dark:text-gray-300 
        hover:bg-gray-100 dark:hover:bg-gray-800 
        hover:text-gray-900 dark:hover:text-gray-100
        transition-colors duration-200
      ">
        <Icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-primary" />
        Inactive Item
      </a>
      
    </nav>
  </div>
</aside>
```

## 🎨 Dark Mode Color Usage Guidelines

### Text Color Hierarchy
```css
/* Light Mode → Dark Mode */
Primary Text:    gray-900 → gray-100      /* Main headings, important text */
Secondary Text:  gray-700 → gray-200      /* Body text, descriptions */
Tertiary Text:   gray-600 → gray-300      /* Supporting text, labels */
Muted Text:      gray-500 → gray-400      /* Timestamps, metadata */
Disabled Text:   gray-400 → gray-500      /* Disabled states */
```

### Background Color Hierarchy
```css
/* Light Mode → Dark Mode */
Page Background:   white → gray-900       /* Main app background */
Card Background:   white → gray-800       /* Cards, panels, modals */
Section Background: gray-50 → gray-850    /* Subtle section divisions */
Muted Background:  gray-100 → gray-700    /* Less important areas */
Input Background:  white → gray-800       /* Form inputs */
```

### Border and Separator Colors
```css
/* Light Mode → Dark Mode */
Strong Borders:    gray-300 → gray-600    /* Defined separations */
Subtle Borders:    gray-200 → gray-700    /* Gentle separations */
Dividers:          gray-100 → gray-800    /* List dividers */
```

### Interactive State Colors
```css
/* Hover States */
Hover Background:  gray-100 → gray-800    /* Button/link hover */
Hover Text:        gray-900 → gray-100    /* Text on hover */

/* Focus States */
Focus Ring:        primary/50 → primary/50 /* Keep brand color */
Focus Border:      primary → primary       /* Keep brand color */

/* Active States */
Active Background: primary/10 → primary/20 /* Slightly more opacity */
Active Text:       primary → primary       /* Keep brand color */
```

## ⚡ Performance Considerations

### CSS Variables for Smooth Transitions
```css
/* Smooth theme transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Prevent flash of unstyled content */
html {
  color-scheme: light dark;
}

/* Optimize for system theme changes */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* Apply dark theme automatically */
  }
}
```

### JavaScript Theme Management
```typescript
// Theme management utility
class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: 'light' | 'dark' | 'system' = 'system';
  
  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }
  
  initialize(): void {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        this.applySystemTheme();
      }
    });
  }
  
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      this.applySystemTheme();
    } else {
      this.applyTheme(theme);
    }
  }
  
  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
  
  private applySystemTheme(): void {
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(systemIsDark ? 'dark' : 'light');
  }
}

// Initialize theme manager
ThemeManager.getInstance().initialize();
```

## 🔍 Testing Dark Mode

### Manual Testing Checklist
- [ ] All text is readable with sufficient contrast
- [ ] Brand colors remain vibrant and recognizable
- [ ] Interactive elements have clear hover/focus states
- [ ] Form inputs are clearly visible and functional
- [ ] Icons maintain visibility and context
- [ ] Transitions between themes are smooth
- [ ] System theme preference is respected
- [ ] Theme selection persists across sessions

### Automated Testing Considerations
```typescript
// Contrast ratio testing
const checkContrast = (foreground: string, background: string): boolean => {
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  const ratio = calculateContrastRatio(foreground, background);
  return ratio >= 4.5;
};

// Dark mode component testing
test('Component renders correctly in dark mode', () => {
  document.documentElement.classList.add('dark');
  
  render(<Component />);
  
  // Verify dark mode classes are applied
  expect(screen.getByRole('button')).toHaveClass('dark:bg-gray-800');
  
  // Clean up
  document.documentElement.classList.remove('dark');
});
```

This comprehensive dark mode implementation ensures that Elimu Smart maintains its professional appearance and brand identity while providing users with a comfortable viewing experience in low-light conditions.