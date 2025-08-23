# Sprint 1: Color System Foundation - Final Implementation

## 🎯 Sprint Goal
Implement the complete Elimu Smart color system with exact CSS custom properties, role-based theming, and gradient utilities that form the visual foundation of the platform.

## 📋 Core Color System Implementation

### Root CSS Custom Properties (EXACT VALUES)
```css
:root {
  /* Base Typography & Layout */
  --font-size: 14px;                    /* Base font size for entire system */
  --radius: 0.625rem;                   /* 10px - Universal border radius */
  
  /* Core Background & Foreground Colors */
  --background: #ffffff;                /* Pure white page backgrounds */
  --foreground: oklch(0.145 0 0);      /* #262626 - Primary text color */
  --card: #ffffff;                      /* White card backgrounds */
  --card-foreground: oklch(0.145 0 0); /* Dark text on white cards */
  --popover: oklch(1 0 0);             /* Pure white popover backgrounds */
  --popover-foreground: oklch(0.145 0 0); /* Dark text on popovers */
  
  /* Student Theme Colors (Orange System - DEFAULT) */
  --primary: #f97316;                   /* Vibrant orange - MAIN BRAND COLOR */
  --primary-foreground: #ffffff;        /* White text on orange backgrounds */
  --secondary: #fef3c7;                /* Light cream yellow - supporting */
  --secondary-foreground: #92400e;      /* Dark amber text on cream */
  --muted: #fef9e7;                    /* Very light cream for large areas */
  --muted-foreground: #a16207;         /* Medium amber for muted text */
  --accent: #fed7aa;                   /* Light peach for accents */
  --accent-foreground: #9a3412;        /* Dark red-brown for accent text */
  
  /* Interactive Element Colors */
  --destructive: #dc2626;              /* Red for delete/danger actions */
  --destructive-foreground: #ffffff;   /* White text on red backgrounds */
  --border: rgba(249, 115, 22, 0.2);  /* Semi-transparent orange borders */
  --input: transparent;                /* Transparent input backgrounds */
  --input-background: #fef9e7;        /* Light cream input backgrounds */
  --switch-background: #fed7aa;        /* Light peach switch backgrounds */
  --ring: #f97316;                     /* Orange focus rings */
  
  /* Status Colors */
  --success: #059669;                  /* Green for success states */
  --success-foreground: #ffffff;       /* White text on green */
  --warning: #d97706;                  /* Amber for warning states */
  --warning-foreground: #ffffff;       /* White text on amber */
  --info: #0ea5e9;                    /* Blue for information */
  --info-foreground: #ffffff;         /* White text on blue */
  
  /* Chart Colors */
  --chart-1: #f97316;                  /* Primary orange */
  --chart-2: #eab308;                  /* Golden yellow */
  --chart-3: #f59e0b;                  /* Amber */
  --chart-4: #d97706;                  /* Dark amber */
  --chart-5: #ea580c;                  /* Red-orange */
  
  /* Typography Weights */
  --font-weight-medium: 500;           /* Medium weight for headings */
  --font-weight-normal: 400;           /* Normal weight for body text */
  
  /* Sidebar Colors */
  --sidebar: #fef9e7;                 /* Light cream sidebar background */
  --sidebar-foreground: #92400e;      /* Dark amber sidebar text */
  --sidebar-primary: #f97316;         /* Orange for sidebar active items */
  --sidebar-primary-foreground: #ffffff; /* White text on orange sidebar */
  --sidebar-accent: #fed7aa;          /* Light peach sidebar accents */
  --sidebar-accent-foreground: #9a3412; /* Dark text on sidebar accents */
  --sidebar-border: rgba(249, 115, 22, 0.2); /* Sidebar border color */
  --sidebar-ring: #f97316;            /* Sidebar focus rings */

  /* Admin Theme Colors (Purple System) */
  --admin-primary: #a855f7;           /* Rich purple - admin authority */
  --admin-primary-foreground: #ffffff; /* White text on purple */
  --admin-secondary: #f3e8ff;         /* Very light lavender */
  --admin-secondary-foreground: #7c3aed; /* Purple text on lavender */
  --admin-muted: #faf5ff;             /* Ultra-light purple tint */
  --admin-muted-foreground: #8b5cf6;  /* Medium purple for muted text */
  --admin-accent: #ddd6fe;            /* Soft lavender accents */
  --admin-accent-foreground: #6d28d9; /* Dark purple accent text */
  --admin-border: rgba(168, 85, 247, 0.2); /* Purple border transparency */
  --admin-sidebar: #faf5ff;           /* Ultra-light purple sidebar */
  --admin-sidebar-foreground: #7c3aed; /* Purple sidebar text */
  --admin-sidebar-primary: #a855f7;   /* Purple sidebar active items */
  --admin-sidebar-accent: #ddd6fe;    /* Lavender sidebar accents */
  --admin-sidebar-border: rgba(168, 85, 247, 0.2); /* Purple sidebar borders */

  /* Counselor Theme Colors (Yellow System) */
  --counselor-primary: #eab308;        /* Golden yellow - warmth & guidance */
  --counselor-primary-foreground: #ffffff; /* White text on yellow */
  --counselor-secondary: #fef3c7;      /* Light cream yellow */
  --counselor-secondary-foreground: #ca8a04; /* Dark yellow text */
  --counselor-muted: #fefce8;          /* Very light yellow background */
  --counselor-muted-foreground: #facc15; /* Medium yellow text */
  --counselor-accent: #fde047;         /* Bright yellow accents */
  --counselor-accent-foreground: #a16207; /* Brown accent text */
  --counselor-border: rgba(234, 179, 8, 0.2); /* Yellow border transparency */
  --counselor-sidebar: #fefce8;        /* Light yellow sidebar */
  --counselor-sidebar-foreground: #ca8a04; /* Dark yellow sidebar text */
  --counselor-sidebar-primary: #eab308; /* Golden sidebar active items */
  --counselor-sidebar-accent: #fde047; /* Bright yellow sidebar accents */
  --counselor-sidebar-border: rgba(234, 179, 8, 0.2); /* Yellow sidebar borders */
}
```

### Dark Mode Color System (EXACT VALUES)
```css
.dark {
  /* Dark Mode Base Colors */
  --background: #1a1a1a;              /* Warm dark gray - NOT pure black */
  --foreground: #fafafa;              /* Off-white for readability */
  --card: #262626;                    /* Slightly lighter for cards */
  --card-foreground: #fafafa;         /* Off-white text on dark cards */
  --popover: #262626;                 /* Dark popover backgrounds */
  --popover-foreground: #fafafa;      /* Light text on dark popovers */
  
  /* Primary remains the same for brand consistency */
  --primary: #f97316;                 /* Keep brand orange in dark mode */
  --primary-foreground: #ffffff;      /* White text on orange */
  
  /* Dark Mode Supporting Colors */
  --secondary: #404040;               /* Medium gray for secondary elements */
  --secondary-foreground: #fbbf24;    /* Warm yellow for contrast */
  --muted: #404040;                   /* Same as secondary for consistency */
  --muted-foreground: #a3a3a3;       /* Light gray for muted text */
  --accent: #525252;                  /* Slightly lighter gray for accents */
  --accent-foreground: #fbbf24;       /* Warm yellow for accent text */
  
  /* Dark Mode Interactive Elements */
  --destructive: #dc2626;             /* Keep destructive red */
  --destructive-foreground: #fafafa;  /* Light text on red */
  --border: rgba(249, 115, 22, 0.3);  /* More visible orange borders */
  --input: #404040;                   /* Medium gray input backgrounds */
  --ring: #f97316;                    /* Keep orange focus rings */
  
  /* Dark Mode Sidebar */
  --sidebar: #262626;                 /* Dark sidebar background */
  --sidebar-foreground: #fafafa;      /* Light text on dark sidebar */
  --sidebar-primary: #f97316;         /* Keep orange for active items */
  --sidebar-primary-foreground: #ffffff; /* White text on orange */
  --sidebar-accent: #404040;          /* Medium gray sidebar accents */
  --sidebar-accent-foreground: #fbbf24; /* Yellow accent text */
  --sidebar-border: rgba(249, 115, 22, 0.3); /* Visible sidebar borders */
  --sidebar-ring: #f97316;            /* Orange sidebar focus rings */
  
  /* Dark Mode Status Colors */
  --success: #059669;                 /* Keep success green */
  --success-foreground: #ffffff;      /* White text on green */
  --warning: #d97706;                 /* Keep warning amber */
  --warning-foreground: #ffffff;      /* White text on amber */
  --info: #0ea5e9;                   /* Keep info blue */
  --info-foreground: #ffffff;        /* White text on blue */
  
  /* Dark Mode Chart Colors */
  --chart-1: #f97316;                 /* Keep brand colors for charts */
  --chart-2: #eab308;
  --chart-3: #f59e0b;
  --chart-4: #d97706;
  --chart-5: #ea580c;

  /* Dark Mode Admin Theme */
  --admin-primary: #a855f7;           /* Keep purple brand */
  --admin-primary-foreground: #ffffff;
  --admin-secondary: #3730a3;         /* Dark purple */
  --admin-secondary-foreground: #c4b5fd; /* Light purple text */
  --admin-muted: #312e81;             /* Deep purple-blue */
  --admin-muted-foreground: #a78bfa;  /* Medium light purple */
  --admin-accent: #4c1d95;            /* Medium dark purple */
  --admin-accent-foreground: #c4b5fd; /* Light purple text */
  --admin-border: rgba(168, 85, 247, 0.3); /* More visible purple borders */
  --admin-sidebar: #312e81;           /* Deep purple sidebar */
  --admin-sidebar-foreground: #c4b5fd; /* Light purple sidebar text */
  --admin-sidebar-primary: #a855f7;   /* Keep purple active items */
  --admin-sidebar-accent: #4c1d95;    /* Dark purple sidebar accents */
  --admin-sidebar-border: rgba(168, 85, 247, 0.3); /* Visible purple borders */

  /* Dark Mode Counselor Theme */
  --counselor-primary: #eab308;        /* Keep golden yellow */
  --counselor-primary-foreground: #1a1a1a; /* Dark text on yellow in dark mode */
  --counselor-secondary: #713f12;      /* Dark yellow-brown */
  --counselor-secondary-foreground: #fef3c7; /* Light cream text */
  --counselor-muted: #451a03;          /* Very dark brown */
  --counselor-muted-foreground: #fbbf24; /* Bright yellow text */
  --counselor-accent: #92400e;         /* Medium amber */
  --counselor-accent-foreground: #fef3c7; /* Light cream text */
  --counselor-border: rgba(234, 179, 8, 0.3); /* More visible yellow borders */
  --counselor-sidebar: #451a03;        /* Dark brown sidebar */
  --counselor-sidebar-foreground: #fef3c7; /* Light cream sidebar text */
  --counselor-sidebar-primary: #eab308; /* Keep golden active items */
  --counselor-sidebar-accent: #92400e; /* Amber sidebar accents */
  --counselor-sidebar-border: rgba(234, 179, 8, 0.3); /* Visible yellow borders */
}
```

### Tailwind V4 Color Integration (EXACT MAPPING)
```css
@theme inline {
  /* Map CSS Custom Properties to Tailwind Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  
  /* Border Radius System */
  --radius-sm: calc(var(--radius) - 4px);    /* 6px */
  --radius-md: calc(var(--radius) - 2px);    /* 8px */
  --radius-lg: var(--radius);                /* 10px */
  --radius-xl: calc(var(--radius) + 4px);    /* 14px */
  
  /* Sidebar Color Mappings */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Role-based Color Mappings */
  --color-admin-primary: var(--admin-primary);
  --color-admin-secondary: var(--admin-secondary);
  --color-admin-muted: var(--admin-muted);
  --color-admin-accent: var(--admin-accent);
  --color-admin-border: var(--admin-border);
  --color-counselor-primary: var(--counselor-primary);
  --color-counselor-secondary: var(--counselor-secondary);
  --color-counselor-muted: var(--counselor-muted);
  --color-counselor-accent: var(--counselor-accent);
  --color-counselor-border: var(--counselor-border);
}
```

## 🎭 Role-Based Theme Implementation (EXACT CSS)

### Theme Application Classes
```css
@layer base {
  /* Universal Border and Outline Styles */
  * {
    @apply border-border outline-ring/50;
  }

  /* Body Background and Text */
  body {
    @apply bg-background text-foreground;
  }

  /* Admin Theme Class - Applied to <body> when admin user */
  .theme-admin {
    --primary: var(--admin-primary);
    --primary-foreground: var(--admin-primary-foreground);
    --secondary: var(--admin-secondary);
    --secondary-foreground: var(--admin-secondary-foreground);
    --muted: var(--admin-muted);
    --muted-foreground: var(--admin-muted-foreground);
    --accent: var(--admin-accent);
    --accent-foreground: var(--admin-accent-foreground);
    --border: var(--admin-border);
    --sidebar: var(--admin-sidebar);
    --sidebar-foreground: var(--admin-sidebar-foreground);
    --sidebar-primary: var(--admin-sidebar-primary);
    --sidebar-accent: var(--admin-sidebar-accent);
    --sidebar-border: var(--admin-sidebar-border);
  }

  /* Counselor Theme Class - Applied to <body> when counselor user */
  .theme-counselor {
    --primary: var(--counselor-primary);
    --primary-foreground: var(--counselor-primary-foreground);
    --secondary: var(--counselor-secondary);
    --secondary-foreground: var(--counselor-secondary-foreground);
    --muted: var(--counselor-muted);
    --muted-foreground: var(--counselor-muted-foreground);
    --accent: var(--counselor-accent);
    --accent-foreground: var(--counselor-accent-foreground);
    --border: var(--counselor-border);
    --sidebar: var(--counselor-sidebar);
    --sidebar-foreground: var(--counselor-sidebar-foreground);
    --sidebar-primary: var(--counselor-sidebar-primary);
    --sidebar-accent: var(--counselor-sidebar-accent);
    --sidebar-border: var(--counselor-sidebar-border);
  }
  
  /* Student Theme is Default - No class needed */
}
```

## 🎨 Gradient System (EXACT IMPLEMENTATIONS)

### Primary Gradient Definitions
```css
@layer utilities {
  /* Student/Primary Gradient - MOST IMPORTANT */
  .gradient-primary {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    /* Creates depth from vibrant orange to darker orange */
    /* 135° angle creates natural light source feel */
    /* Used for: Primary buttons, CTAs, hero sections */
  }
  
  /* Secondary Gradient - Supporting Actions */
  .gradient-secondary {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    /* Light yellow to amber */
    /* Used for: Secondary buttons, highlights */
  }
  
  /* Success Gradient - Positive Actions */
  .gradient-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    /* Emerald green gradient */
    /* Used for: Success notifications, completed states */
  }
  
  /* Warning Gradient - Attention Required */
  .gradient-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    /* Amber to orange gradient */
    /* Used for: Warning states, important notices */
  }
  
  /* Info Gradient - Informational Content */
  .gradient-info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    /* Blue gradient */
    /* Used for: Information panels, help sections */
  }
  
  /* Admin Gradient - Authority & Premium */
  .gradient-admin {
    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    /* Rich purple to deeper purple */
    /* Conveys professionalism and premium features */
    /* Used for: Admin buttons, dashboard headers, premium features */
  }

  /* Counselor Gradient - Warmth & Support */
  .gradient-counselor {
    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
    /* Golden yellow to amber */
    /* Warm and approachable for guidance context */
    /* Used for: Counselor tools, support sections, guidance CTAs */
  }
}
```

### Role-Based Background Utilities
```css
@layer utilities {
  /* Role-based background utilities */
  .bg-role-primary {
    background-color: var(--primary);
  }

  .bg-role-secondary {
    background-color: var(--secondary);
  }

  .bg-role-muted {
    background-color: var(--muted);
  }

  .text-role-primary {
    color: var(--primary);
  }

  .text-role-secondary {
    color: var(--secondary-foreground);
  }

  .border-role-primary {
    border-color: var(--border);
  }
}
```

## 🛠️ Theme Management JavaScript (EXACT IMPLEMENTATION)

### Theme Application Functions
```typescript
// utils/themeUtils.ts - EXACT IMPLEMENTATION
export function applyRoleTheme(role: string): void {
  const body = document.body;
  
  // Remove ALL existing theme classes first
  body.classList.remove('theme-student', 'theme-admin', 'theme-counselor');
  
  // Apply new theme class based on role
  switch (role) {
    case 'admin':
      body.classList.add('theme-admin');
      console.log('🎨 Applied admin theme (purple system)');
      break;
    case 'counselor':
      body.classList.add('theme-counselor');
      console.log('🎨 Applied counselor theme (yellow system)');
      break;
    case 'student':
    default:
      body.classList.add('theme-student');
      console.log('🎨 Applied student theme (orange system)');
      break;
  }
}

export function getRoleThemeClass(role: string): string {
  switch (role) {
    case 'admin': return 'theme-admin';
    case 'counselor': return 'theme-counselor';
    case 'student':
    default: return 'theme-student';
  }
}

export function getRolePrimaryColor(role: string): string {
  switch (role) {
    case 'admin': return '#a855f7';     // Purple
    case 'counselor': return '#eab308';  // Yellow
    case 'student':
    default: return '#f97316';           // Orange
  }
}

export function getRoleGradientClass(role: string): string {
  switch (role) {
    case 'admin': return 'gradient-admin';
    case 'counselor': return 'gradient-counselor';
    case 'student':
    default: return 'gradient-primary';
  }
}
```

## 🎯 Color Usage Decision Matrix (EXACT APPLICATIONS)

### Primary Color Applications
```typescript
const ColorUsageMatrix = {
  primary: {
    // Main brand color - Orange for students, Purple for admin, Yellow for counselor
    usage: [
      'Primary button backgrounds',
      'Active navigation states', 
      'Link colors',
      'Focus ring colors',
      'Progress bar fills',
      'Icon colors for primary actions',
      'Border colors for active elements',
      'Brand text and logos'
    ],
    classes: [
      'bg-primary',
      'text-primary', 
      'border-primary',
      'ring-primary',
      'focus:ring-primary'
    ],
    avoid: [
      'Large background areas (use muted instead)',
      'Body text color (use foreground)',
      'Input field backgrounds (use input-background)',
      'Card backgrounds (use card)'
    ]
  },
  
  secondary: {
    // Light supporting color
    usage: [
      'Card backgrounds in role sections',
      'Subtle highlight backgrounds',
      'Breadcrumb backgrounds',
      'Tag/badge backgrounds',
      'Form section backgrounds',
      'Secondary button backgrounds'
    ],
    classes: [
      'bg-secondary',
      'text-secondary-foreground',
      'border-secondary'
    ]
  },
  
  muted: {
    // Very light color for large areas
    usage: [
      'Page backgrounds',
      'Sidebar backgrounds', 
      'Large section backgrounds',
      'Input field backgrounds',
      'Disabled element backgrounds',
      'Skeleton loading states'
    ],
    classes: [
      'bg-muted',
      'text-muted-foreground'
    ]
  },
  
  accent: {
    // Medium supporting color
    usage: [
      'Hover state backgrounds',
      'Secondary button borders',
      'Divider colors',
      'Icon backgrounds in cards',
      'Subtle emphasis elements'
    ],
    classes: [
      'bg-accent',
      'text-accent-foreground',
      'border-accent'
    ]
  }
};
```

### Text Color Hierarchy (EXACT VALUES)
```css
/* Text Color Classes - NEVER USE DIFFERENT VALUES */
.text-foreground     { color: oklch(0.145 0 0); }     /* #262626 - Headlines, important text */
.text-muted-foreground { color: #a16207; }            /* Muted text, supporting information */
.text-primary        { color: var(--primary); }       /* Brand colored text, links */
.text-primary-foreground { color: var(--primary-foreground); } /* White text on colored backgrounds */
.text-secondary-foreground { color: var(--secondary-foreground); } /* Dark text on light backgrounds */
.text-accent-foreground { color: var(--accent-foreground); } /* Accent text colors */
.text-destructive    { color: var(--destructive); }   /* Error text */
.text-success        { color: var(--success); }       /* Success text */
.text-warning        { color: var(--warning); }       /* Warning text */
.text-info           { color: var(--info); }          /* Information text */
```

## 📱 Responsive Color Behavior

### Mobile Color Adaptations
```css
/* Mobile-specific color adjustments */
@media (max-width: 768px) {
  :root {
    /* Slightly increase contrast for mobile readability */
    --border: rgba(249, 115, 22, 0.3);  /* More visible borders */
    --muted-foreground: #92400e;        /* Darker muted text */
  }
  
  .dark {
    --border: rgba(249, 115, 22, 0.4);  /* Even more visible in dark mode */
  }
}
```

### High Contrast Mode Support
```css
/* Accessibility: High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --border: rgba(249, 115, 22, 0.6);
    --muted-foreground: #713f12;
  }
  
  .gradient-primary {
    /* Fallback solid color for high contrast */
    background: var(--primary);
  }
  
  .gradient-admin {
    background: var(--admin-primary);
  }
  
  .gradient-counselor {
    background: var(--counselor-primary);
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .gradient-animate {
    animation: none;
  }
}
```

## ✅ Implementation Checklist

### Color System Setup (MUST COMPLETE ALL)
- [ ] Copy exact CSS custom property values to globals.css
- [ ] Implement role-based theme classes (.theme-admin, .theme-counselor)
- [ ] Add gradient utility classes with exact 135° angles
- [ ] Create theme management JavaScript functions
- [ ] Test theme switching between all three roles
- [ ] Verify dark mode color adaptations
- [ ] Validate accessibility contrast ratios (WCAG AA)
- [ ] Test mobile responsiveness

### Validation Requirements
- [ ] All gradients use exactly 135° angle
- [ ] Primary colors match exact hex values (#f97316, #a855f7, #eab308)
- [ ] Dark mode maintains brand color vibrancy
- [ ] Theme switching works without page refresh
- [ ] Colors pass WCAG AA accessibility standards (4.5:1 contrast ratio)
- [ ] Mobile colors remain readable on small screens
- [ ] CSS custom properties properly cascade to child elements
- [ ] Focus rings are visible and use primary colors
- [ ] High contrast mode provides fallback colors

### Testing Protocol
1. **Role Theme Switching:** Verify each role applies correct color palette
2. **Dark Mode Toggle:** Test all colors adapt properly in dark mode
3. **Contrast Testing:** Use tools like WebAIM to verify accessibility
4. **Mobile Testing:** Verify colors remain legible on small screens
5. **Focus Testing:** Tab through interface to verify focus ring visibility
6. **Gradient Testing:** Verify all gradients render at 135° angle
7. **Border Testing:** Verify transparent borders are visible but subtle

This color system foundation ensures pixel-perfect replication of the Elimu Smart brand identity across all user roles, viewing conditions, and accessibility requirements.