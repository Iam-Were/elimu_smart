# Elimu Smart Design System

## 🎨 Typography System

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**System Font Stack Breakdown:**
- **macOS/iOS:** `-apple-system` (San Francisco)
- **macOS (older):** `BlinkMacSystemFont`
- **Windows:** `Segoe UI`
- **Android/Chrome OS:** `Roboto`
- **macOS/iOS (fallback):** `Helvetica Neue`
- **Universal fallback:** `Arial`, `sans-serif`

### Font Weights
```css
--font-weight-normal: 400;    /* Body text, paragraphs */
--font-weight-medium: 500;    /* Subheadings, emphasis */
--font-weight-semibold: 600;  /* Section headings */
--font-weight-bold: 700;      /* Main headings, titles */
```

### Typography Scale (Tailwind)
```css
/* Headings */
text-6xl: 3.75rem (60px)  /* Hero headlines */
text-5xl: 3rem (48px)      /* Page titles */
text-4xl: 2.25rem (36px)   /* Section headers */
text-3xl: 1.875rem (30px)  /* Card titles */
text-2xl: 1.5rem (24px)    /* Subheadings */
text-xl: 1.25rem (20px)    /* Large body text */

/* Body Text */
text-lg: 1.125rem (18px)   /* Featured text */
text-base: 1rem (16px)     /* Default body text */
text-sm: 0.875rem (14px)   /* Secondary text */
text-xs: 0.75rem (12px)    /* Labels, metadata */
```

### Usage Examples
```tsx
// Page Title
<h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">

// Section Heading
<h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-white">

// Card Title
<h3 className="text-lg font-semibold text-slate-800 dark:text-white">

// Body Text
<p className="text-base font-normal text-slate-600 dark:text-slate-300">

// Small Text / Labels
<span className="text-sm font-medium text-slate-500 dark:text-slate-400">
```

---

## 🎨 Color System

### Base Colors (Light Mode)
```css
--background: #ffffff         /* Pure white backgrounds */
--foreground: #262626         /* Primary text (oklch(0.145 0 0)) */
--card: #ffffff               /* Card backgrounds */
--card-foreground: #262626    /* Text on cards */
```

### Base Colors (Dark Mode)
```css
--background: #1a1a1a         /* Warm dark gray (NOT pure black) */
--foreground: #fafafa         /* Off-white text for readability */
--card: #262626               /* Slightly lighter cards */
--card-foreground: #fafafa    /* Light text on dark cards */
```

---

## 🧡 Student Theme (Orange - DEFAULT)

### Primary Colors
```css
--primary: #ff6b35            /* Figma exact orange (LinkedIn-inspired) */
--primary-foreground: #ffffff /* White text on orange */
```

### Tailwind Equivalents
- `bg-orange-500`: Primary orange buttons/CTAs
- `bg-orange-600`: Hover states
- `text-orange-600`: Orange text (light mode)
- `text-orange-300`: Orange text (dark mode)

### Secondary & Supporting
```css
--secondary: #fff4f0          /* Very light orange backgrounds */
--secondary-foreground: #ff6b35
--muted: #fafafa              /* Neutral backgrounds */
--muted-foreground: #666666   /* Professional gray text */
--accent: #ff6b35
--accent-foreground: #ffffff
```

### Usage Examples
```tsx
// Primary Button
<Button className="bg-orange-500 hover:bg-orange-600 text-white">

// Text Colors (Light Mode)
<p className="text-orange-600">

// Text Colors (Dark Mode)
<p className="text-orange-300 dark:text-orange-300">

// Gradient Hero Banner
<div className="bg-gradient-to-r from-orange-500 to-orange-400">
```

---

## 💜 Admin Theme (Purple)

### Primary Colors
```css
--admin-primary: #a855f7      /* Violet 500 - Authority */
--admin-primary-foreground: #ffffff
```

### Tailwind Equivalents
- `bg-violet-500`: Admin buttons/CTAs
- `bg-violet-600`: Hover states
- `text-violet-600`: Purple text (light mode)
- `text-violet-300`: Purple text (dark mode)

---

## 💛 Counselor Theme (Yellow)

### Primary Colors
```css
--counselor-primary: #eab308  /* Yellow 500 - Warmth & Guidance */
--counselor-primary-foreground: #ffffff
```

### Tailwind Equivalents
- `bg-yellow-500`: Counselor buttons/CTAs
- `bg-yellow-600`: Hover states
- `text-yellow-600`: Yellow text (light mode)
- `text-yellow-300`: Yellow text (dark mode)

---

## 🎯 Semantic/Status Colors

### System States
```css
/* Success */
--success: #059669            /* Green 600 */
--success-foreground: #ffffff
Tailwind: bg-emerald-600, text-emerald-600/400/300

/* Error/Destructive */
--destructive: #dc2626        /* Red 600 */
--destructive-foreground: #ffffff
Tailwind: bg-red-600, text-red-600/400/300

/* Warning */
--warning: #d97706            /* Amber 600 */
--warning-foreground: #ffffff
Tailwind: bg-amber-600, text-amber-600/400/300

/* Info */
--info: #0ea5e9              /* Sky 500 */
--info-foreground: #ffffff
Tailwind: bg-sky-500, text-sky-500/400/300
```

### Usage Examples
```tsx
// Success State
<Badge className="bg-emerald-600 text-white">Completed</Badge>
<p className="text-emerald-600 dark:text-emerald-400">Success message</p>

// Error State
<Badge className="bg-red-600 text-white">Error</Badge>
<p className="text-red-600 dark:text-red-400">Error message</p>

// Warning State
<Badge className="bg-amber-600 text-white">Warning</Badge>
<p className="text-amber-600 dark:text-amber-400">Warning message</p>
```

---

## 🌓 Dark Mode Best Practices

### Text Color Pairs
```tsx
// Headings
text-slate-800 dark:text-white

// Body Text
text-slate-600 dark:text-slate-300

// Secondary Text
text-slate-500 dark:text-slate-400

// Muted Text
text-slate-400 dark:text-slate-500
```

### Background Pairs
```tsx
// Cards
bg-white/90 dark:bg-slate-900

// Subtle Backgrounds
bg-slate-50 dark:bg-slate-800

// Borders
border-slate-200 dark:border-slate-800
border-orange-200/30 dark:border-orange-800/30
```

---

## 🎨 Design Principles

### 1. **Minimal Glassmorphism**
- ✅ **Use:** Subtle backdrop blur for navigation (`backdrop-blur-sm`)
- ✅ **Use:** Loading overlays (`bg-background/80 backdrop-blur-sm`)
- ❌ **Avoid:** Heavy glass effects on cards
- ❌ **Avoid:** Multiple layered glass components

### 2. **Solid Backgrounds First**
```tsx
// ✅ Good: Clean, readable
<Card className="bg-white/90 dark:bg-slate-900">

// ❌ Avoid: Too much transparency
<Card className="bg-white/20 backdrop-blur-md">
```

### 3. **Color Consistency**
- Always pair light and dark mode colors
- Use semantic color names (emerald, orange, slate)
- Maintain 4.5:1 contrast ratio for text

### 4. **Mobile-First Typography**
```tsx
// Responsive scaling
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">

// Responsive spacing
<div className="px-4 md:px-6 lg:px-8">
```

---

## 📏 Spacing System (8px Grid)

```css
--space-1: 0.125rem  /* 2px */
--space-2: 0.25rem   /* 4px */
--space-3: 0.5rem    /* 8px - Base unit */
--space-4: 0.75rem   /* 12px */
--space-5: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

### Tailwind Spacing
- `gap-4` = 16px (1rem)
- `gap-6` = 24px (1.5rem)
- `p-4` = 16px padding
- `p-6` = 24px padding
- `space-y-6` = 24px vertical spacing

---

## 🎭 Component Patterns

### Hero Banner
```tsx
<Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg">
  <CardContent className="p-6 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-white">
      Welcome back, Student! 👋
    </h1>
    <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
      Profile 85% Complete
    </Badge>
  </CardContent>
</Card>
```

### Stat Cards
```tsx
<div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow">
  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
    5
  </div>
  <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
    Assessments Completed
  </div>
</div>
```

### Image Cards with Hero Images
```tsx
<Card className="bg-white/90 dark:bg-slate-900 border-orange-200/30 rounded-xl">
  {/* Hero Image */}
  <div className="relative h-48 w-full">
    <img src="..." className="w-full h-full object-cover" />
    <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
      60% Complete
    </Badge>
  </div>
  
  {/* Content */}
  <CardHeader>
    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
      Title
    </CardTitle>
  </CardHeader>
</Card>
```

---

## ✅ Checklist for New Components

- [ ] Typography uses system font stack
- [ ] Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- [ ] Colors have dark mode pairs (`dark:` variants)
- [ ] Text maintains 4.5:1 contrast ratio
- [ ] Backgrounds are solid or minimal transparency (90%)
- [ ] No heavy glassmorphism on cards
- [ ] Responsive typography (`text-base md:text-lg`)
- [ ] 8px spacing grid (gap-4, gap-6, p-4, p-6)
- [ ] Orange theme for students (#ff6b35)
- [ ] Semantic colors for states (emerald, red, amber)

---

## 🔗 Quick Reference

**Primary Orange:** `#ff6b35` → `bg-orange-500`, `text-orange-600/300`  
**Success Green:** `#059669` → `bg-emerald-600`, `text-emerald-600/400`  
**Error Red:** `#dc2626` → `bg-red-600`, `text-red-600/400`  
**Warning Amber:** `#d97706` → `bg-amber-600`, `text-amber-600/400`  

**Font Stack:** System fonts (San Francisco, Segoe UI, Roboto)  
**Base Font Size:** 14px (customizable via `--font-size`)  
**Border Radius:** 10px (`--radius: 0.625rem`)  
**Transitions:** 150ms (fast), 200ms (base), 300ms (slow)
