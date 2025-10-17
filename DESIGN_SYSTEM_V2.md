# Elimu Smart Design System v2.0
*Mobile-First | Accessibility-Focused | Kenya Market Optimized*

**Last Updated:** October 17, 2025  
**Status:** Active Development  
**Maintainer:** Design Team

---

## 🎯 Design Philosophy

### Mission
Empowering Kenyan students (Form 1-4) to discover their perfect career path through AI-driven guidance that is accessible, trustworthy, and locally relevant.

### Core Principles

1. **Mobile-First Excellence**
   - Design for 375px (iPhone SE) upward
   - Touch-friendly (min 48px tap targets)
   - Optimized for 2G/3G networks

2. **Clarity Over Cleverness**
   - Clear visual hierarchy
   - Obvious affordances
   - Scannable layouts

3. **Accessibility Built-In**
   - WCAG 2.1 AA compliance
   - 4.5:1 minimum contrast
   - Semantic HTML
   - Keyboard navigation

4. **Performance-Conscious**
   - Minimal glassmorphism (CPU intensive)
   - Solid backgrounds preferred
   - Optimized animations
   - Lazy-loaded images

5. **Culturally Relevant**
   - Colors resonate with Kenyan youth
   - Supports English & Swahili
   - KES currency formatting
   - Local imagery

---

## 🌈 Color System

### Role-Based Color Themes

Our platform serves three distinct user types, each with their own color identity that reflects their role and journey:

#### 🧡 Student Theme: Orange (Energy & Optimism) - DEFAULT

**Represents:**
- **Energy** - Youthful enthusiasm for learning
- **Optimism** - Bright future ahead
- **Warmth** - Approachable guidance
- **Action** - Taking steps toward career goals

```css
/* Student Orange Scale */
orange-50:  #FFF7ED  /* Subtle backgrounds, hover states */
orange-100: #FFEDD5  /* Light badges, secondary elements */
orange-200: #FED7AA  /* Borders, dividers */
orange-300: #FDBA74  /* Secondary CTAs, icons */
orange-400: #FB923C  /* Gradient ends, accents */
orange-500: #F97316  /* PRIMARY BRAND - Main CTAs ⭐ */
orange-600: #EA580C  /* Hover states, active navigation */
orange-700: #C2410C  /* Pressed states, strong emphasis */
orange-800: #9A3412  /* Dark mode text on light backgrounds */
orange-900: #7C2D12  /* Dark mode backgrounds, deep emphasis */
```

**Usage Guidelines:**
- **Primary Actions:** `orange-500` for buttons, links, active states
- **Hover States:** `orange-600` for button hovers
- **Gradients:** `from-orange-500 to-orange-400` for hero banners
- **Backgrounds:** `orange-50/100` for light sections
- **Dark Mode Text:** `orange-300/400` on dark backgrounds
- **Dark Mode Backgrounds:** `orange-900` with `orange-300` text

**Student Journey Examples:**
```tsx
// Student Dashboard Hero
<Card className="bg-gradient-to-r from-orange-500 to-orange-400">
  <h1 className="text-white">Welcome back, Student!</h1>
</Card>

// Student CTA Button
<Button className="bg-orange-500 hover:bg-orange-600 text-white">
  Take Assessment
</Button>

// Student Active Nav
<nav className="bg-orange-500 text-white">Dashboard</nav>
```

---

#### 💛 Counselor Theme: Yellow (Warmth & Guidance)

**Represents:**
- **Warmth** - Caring and supportive mentorship
- **Guidance** - Expert direction and wisdom
- **Trust** - Professional relationship building
- **Clarity** - Clear communication and insights

```css
/* Counselor Yellow Scale */
yellow-50:  #FEFCE8  /* Subtle backgrounds, hover states */
yellow-100: #FEF9C3  /* Light badges, secondary elements */
yellow-200: #FEF08A  /* Borders, dividers */
yellow-300: #FDE047  /* Secondary CTAs, icons */
yellow-400: #FACC15  /* Gradient ends, accents */
yellow-500: #EAB308  /* PRIMARY COUNSELOR - Main CTAs ⭐ */
yellow-600: #CA8A04  /* Hover states, active navigation */
yellow-700: #A16207  /* Pressed states, strong emphasis */
yellow-800: #854D0E  /* Dark mode text on light backgrounds */
yellow-900: #713F12  /* Dark mode backgrounds, deep emphasis */
```

**Usage Guidelines:**
- **Primary Actions:** `yellow-500` for counselor buttons, links, active states
- **Hover States:** `yellow-600` for button hovers
- **Gradients:** `from-yellow-500 to-yellow-400` for counselor hero banners
- **Backgrounds:** `yellow-50/100` for light sections
- **Dark Mode Text:** `yellow-300/400` on dark backgrounds
- **Dark Mode Backgrounds:** `yellow-900` with `yellow-300` text

**Counselor Journey Examples:**
```tsx
// Counselor Dashboard Hero
<Card className="bg-gradient-to-r from-yellow-500 to-yellow-400">
  <h1 className="text-white">Welcome, Counselor!</h1>
</Card>

// Counselor CTA Button
<Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
  View Student Roster
</Button>

// Counselor Active Nav
<nav className="bg-yellow-500 text-white">Sessions</nav>

// Counselor Stat Card
<div className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
  <div className="text-3xl font-bold">24</div>
  <div className="text-sm">Active Students</div>
</div>
```

---

#### 💜 Admin Theme: Purple (Authority & Intelligence)

**Represents:**
- **Authority** - System-wide control and oversight
- **Intelligence** - Data-driven decision making
- **Power** - Administrative capabilities
- **Sophistication** - Professional management tools

```css
/* Admin Purple Scale */
purple-50:  #FAF5FF  /* Subtle backgrounds, hover states */
purple-100: #F3E8FF  /* Light badges, secondary elements */
purple-200: #E9D5FF  /* Borders, dividers */
purple-300: #D8B4FE  /* Secondary CTAs, icons */
purple-400: #C084FC  /* Gradient ends, accents */
purple-500: #A855F7  /* PRIMARY ADMIN - Main CTAs ⭐ */
purple-600: #9333EA  /* Hover states, active navigation */
purple-700: #7E22CE  /* Pressed states, strong emphasis */
purple-800: #6B21A8  /* Dark mode text on light backgrounds */
purple-900: #581C87  /* Dark mode backgrounds, deep emphasis */
```

**Usage Guidelines:**
- **Primary Actions:** `purple-500` for admin buttons, links, active states
- **Hover States:** `purple-600` for button hovers
- **Gradients:** `from-purple-500 to-purple-400` for admin hero banners
- **Backgrounds:** `purple-50/100` for light sections
- **Dark Mode Text:** `purple-300/400` on dark backgrounds
- **Dark Mode Backgrounds:** `purple-900` with `purple-300` text

**Admin Journey Examples:**
```tsx
// Admin Dashboard Hero
<Card className="bg-gradient-to-r from-purple-500 to-purple-400">
  <h1 className="text-white">Admin Dashboard</h1>
</Card>

// Admin CTA Button
<Button className="bg-purple-500 hover:bg-purple-600 text-white">
  Manage Users
</Button>

// Admin Active Nav
<nav className="bg-purple-500 text-white">Analytics</nav>

// Admin Stat Card
<div className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
  <div className="text-3xl font-bold">1,247</div>
  <div className="text-sm">Total Users</div>
</div>
```

---

### Theme Implementation Pattern

```tsx
// Dynamic theme based on user role
const getThemeColors = (role: 'student' | 'counselor' | 'admin') => {
  const themes = {
    student: {
      primary: 'orange-500',
      primaryHover: 'orange-600',
      primaryActive: 'orange-700',
      light: 'orange-100',
      dark: 'orange-900',
      gradient: 'from-orange-500 to-orange-400',
    },
    counselor: {
      primary: 'yellow-500',
      primaryHover: 'yellow-600',
      primaryActive: 'yellow-700',
      light: 'yellow-100',
      dark: 'yellow-900',
      gradient: 'from-yellow-500 to-yellow-400',
    },
    admin: {
      primary: 'purple-500',
      primaryHover: 'purple-600',
      primaryActive: 'purple-700',
      light: 'purple-100',
      dark: 'purple-900',
      gradient: 'from-purple-500 to-purple-400',
    },
  };
  return themes[role];
};

// Usage in components
const UserDashboard = ({ role }: { role: UserRole }) => {
  const theme = getThemeColors(role);
  
  return (
    <Card className={`bg-gradient-to-r ${theme.gradient}`}>
      <h1 className="text-white">Welcome!</h1>
      <Button className={`bg-${theme.primary} hover:bg-${theme.primaryHover}`}>
        Get Started
      </Button>
    </Card>
  );
};
```

### Semantic Colors

#### Success (Emerald - Achievement)
```css
emerald-50:  #ECFDF5  /* Success message backgrounds */
emerald-100: #D1FAE5  /* Success badge backgrounds */
emerald-500: #10B981  /* Completed states, checkmarks ⭐ */
emerald-600: #059669  /* Success emphasis, dark backgrounds */
emerald-700: #047857  /* Dark mode success text */
```
**Use for:** Completed assessments, achievements, positive feedback

#### Warning (Amber - Attention)
```css
amber-50:  #FFFBEB  /* Warning backgrounds */
amber-100: #FEF3C7  /* Warning badge backgrounds */
amber-500: #F59E0B  /* Warnings, priority items ⭐ */
amber-600: #D97706  /* Warning emphasis */
amber-700: #B45309  /* Dark mode warning text */
```
**Use for:** Priority tasks, time-sensitive items, incomplete profiles

#### Error (Red - Critical)
```css
red-50:  #FEF2F2  /* Error backgrounds */
red-100: #FEE2E2  /* Error badge backgrounds */
red-500: #EF4444  /* Errors, validation failures ⭐ */
red-600: #DC2626  /* Error emphasis */
red-700: #B91C1C  /* Dark mode error text */
```
**Use for:** Form errors, failed actions, urgent problems

#### Info (Blue - Guidance)
```css
blue-50:  #EFF6FF  /* Info backgrounds */
blue-100: #DBEAFE  /* Info badge backgrounds */
blue-500: #3B82F6  /* Informational elements, tips ⭐ */
blue-600: #2563EB  /* Info emphasis */
blue-700: #1D4ED8  /* Dark mode info text */
```
**Use for:** Help text, informational messages, tooltips

#### Insight (Purple - AI Features)
```css
purple-50:  #FAF5FF  /* AI insight backgrounds */
purple-500: #A855F7  /* AI features, career insights ⭐ */
purple-600: #9333EA  /* Purple emphasis */
purple-700: #7E22CE  /* Dark mode purple text */
```
**Use for:** AI-powered features, career matching, personalization

### Neutral Palette (Slate - Professional Foundation)

#### Light Mode
```css
slate-50:  #F8FAFC  /* Page backgrounds, subtle fills */
slate-100: #F1F5F9  /* Hover backgrounds, input fills */
slate-200: #E2E8F0  /* Borders, dividers */
slate-300: #CBD5E1  /* Disabled text, placeholders */
slate-400: #94A3B8  /* Secondary icons, metadata */
slate-500: #64748B  /* Secondary body text */
slate-600: #475569  /* Primary body text ⭐ */
slate-700: #334155  /* Headings, strong emphasis */
slate-800: #1E293B  /* Maximum emphasis (light mode) */
slate-900: #0F172A  /* Deepest contrast (rarely used in light) */
```

#### Dark Mode
```css
slate-950: #020617  /* Deep page backgrounds */
slate-900: #0F172A  /* Card backgrounds, surfaces ⭐ */
slate-800: #1E293B  /* Elevated surfaces, hover states */
slate-700: #334155  /* Borders, dividers */
slate-600: #475569  /* Disabled elements */
slate-500: #64748B  /* Secondary text */
slate-400: #94A3B8  /* Secondary text (better contrast) */
slate-300: #CBD5E1  /* Primary body text ⭐ */
slate-200: #E2E8F0  /* Headings, strong emphasis */
slate-50:  #F8FAFC  /* Maximum contrast text */
```

### Gradient Palette

```css
/* Hero Banners */
.gradient-hero-primary: linear-gradient(135deg, #F97316 0%, #FB923C 100%)
.gradient-hero-warm: linear-gradient(135deg, #F97316 0%, #F59E0B 100%)
.gradient-hero-success: linear-gradient(135deg, #10B981 0%, #059669 100%)

/* Subtle Backgrounds */
.gradient-bg-orange: linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)
.gradient-bg-slate: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)

/* CTAs & Buttons */
.gradient-cta: linear-gradient(135deg, #F97316 0%, #EA580C 100%)
.gradient-cta-hover: linear-gradient(135deg, #EA580C 0%, #C2410C 100%)

/* Status Indicators */
.gradient-progress: linear-gradient(90deg, #F97316 0%, #FB923C 100%)
```

---

## ✨ Gradients & Motion (Subtle)

We use subtle gradients and restrained motion to add depth and polish without harming performance or accessibility. Animations are purpose-driven: to indicate state, provide spatial context, and guide attention — never to distract.

Key rules:
- Prefer linear gradients with 2 colors and low contrast stops for large surfaces.
- Keep animations short (100ms–300ms) and use ease-out curves.
- Use transform + opacity for animated properties (GPU-accelerated).
- Respect `prefers-reduced-motion` and provide non-animated fallbacks.
- Avoid continuous animations in critical content areas (e.g., forms, reading flows).

### Tokens

```css
/* Gradient tokens (Tailwind-friendly) */
--grad-hero-student: linear-gradient(135deg, #F97316 0%, #FB923C 100%);
--grad-hero-counselor: linear-gradient(135deg, #EAB308 0%, #FACC15 100%);
--grad-hero-admin: linear-gradient(135deg, #A855F7 0%, #C084FC 100%);

/* Subtle shine overlay for cards (very low opacity) */
--shine-overlay: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);

/* Motion timings */
--motion-fast: 120ms;
--motion-medium: 200ms;
--motion-slow: 320ms;
--easing-default: cubic-bezier(.0, .0, .2, 1);
```

### Tailwind config snippets

Add the following to `theme.extend` in `tailwind.config.js` to centralize keyframes and animations:

```js
// tailwind.config.js (theme.extend)
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "fade-in-up": {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        "shimmer": {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up var(--motion-medium) var(--easing-default) both',
        'fade-in-up-fast': 'fade-in-up var(--motion-fast) var(--easing-default) both',
        'shimmer-slow': 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
```

Use `motion-safe` and `motion-reduce` variants to respect user preferences:

```html
<div className="motion-safe:animate-fade-in-up motion-reduce:transition-none">
  ...
</div>
```

### Subtle motion patterns (examples)

- Hero entrance: `motion-safe:animate-fade-in-up` on hero content, staggered with 40ms delays for multiple elements.
- Button press: scale on active with `active:scale-95 transition-transform duration-120`.
- Card hover: subtle lift `hover:translate-y-[-4px] hover:shadow-lg transition-transform duration-200` combined with `will-change-transform`.
- Progress shimmer (loading): use `bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] motion-safe:animate-shimmer-slow` on skeleton bars.

### Accessibility

- Always honor `prefers-reduced-motion` via `motion-reduce` or CSS media queries.
- Provide instant state changes in addition to animations (e.g., aria-live regions for announcements).
- Avoid relying on motion to communicate essential information.

### Role-specific gradient & motion examples

Student Hero (subtle):

```tsx
<section className="bg-[var(--grad-hero-student)] relative overflow-hidden">
  <div className="px-4 py-8 motion-safe:animate-fade-in-up">
    <h1 className="text-white text-2xl font-bold">Welcome back</h1>
    <p className="text-orange-100">Your next step is one click away.</p>
  </div>
  <div className="absolute inset-0 bg-[var(--shine-overlay)] pointer-events-none" />
</section>
```

Counselor Hero (subtle):

```tsx
<section className="bg-[var(--grad-hero-counselor)] relative overflow-hidden">
  <div className="px-4 py-8 motion-safe:animate-fade-in-up">
    <h1 className="text-white text-2xl font-bold">Good to see you</h1>
    <p className="text-yellow-100">Insights for your students are ready.</p>
  </div>
  <div className="absolute inset-0 bg-[var(--shine-overlay)] pointer-events-none" />
</section>
```

Admin Hero (subtle):

```tsx
<section className="bg-[var(--grad-hero-admin)] relative overflow-hidden">
  <div className="px-4 py-8 motion-safe:animate-fade-in-up">
    <h1 className="text-white text-2xl font-bold">Overview</h1>
    <p className="text-purple-100">System metrics at a glance.</p>
  </div>
  <div className="absolute inset-0 bg-[var(--shine-overlay)] pointer-events-none" />
</section>
```

Button CTA with subtle gradient + micro-interaction:

```tsx
<button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-sm
  bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500
  active:scale-95 transition transform motion-safe:duration-[var(--motion-medium)] motion-reduce:transition-none">
  <span>Take Assessment</span>
</button>
```

Card hover + shine example (subtle):

```tsx
<div className="relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg
  transition-transform duration-200 motion-safe:transform motion-safe:hover:-translate-y-1">
  <div className="absolute inset-0 bg-[var(--shine-overlay)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  <div className="p-4">Card content</div>
</div>
```

---

### Color Usage Examples

```tsx
// ✅ CORRECT: Light/Dark mode pair
<p className="text-slate-600 dark:text-slate-300">Body text</p>
<div className="bg-white dark:bg-slate-900">Card background</div>

// ✅ CORRECT: Brand color with proper contrast
<Button className="bg-orange-500 hover:bg-orange-600 text-white">
  Take Assessment
</Button>

// ✅ CORRECT: Semantic color for success
<Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
  Completed
</Badge>

// ❌ WRONG: No dark mode variant
<p className="text-slate-600">This will be hard to read in dark mode</p>

// ❌ WRONG: Poor contrast
<Button className="bg-orange-200 text-orange-300">Low contrast button</Button>
```

---

## ✍️ Typography System

### Font Stack

```css
/* Primary Font - System Native for Performance */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Why System Fonts?**
- ⚡ **Zero download time** - instant rendering
- 📱 **Native feel** - users' familiar fonts
- 🌍 **Global support** - excellent Unicode coverage
- 🎯 **Optimized rendering** - subpixel antialiasing
- 📊 **Excellent readability** - designed for screens

**Font Breakdown:**
- **macOS/iOS:** San Francisco (`-apple-system`)
- **Windows:** Segoe UI
- **Android:** Roboto
- **Fallback:** Helvetica Neue → Arial → Generic sans-serif

### Type Scale (Mobile-First)

#### Display & Headings

```css
/* Hero Display - Landing pages, marketing */
text-5xl: 3rem (48px) / 1.1 (52.8px)
→ Mobile: text-3xl (1.875rem / 2.25rem)
→ font-bold (700), tracking-tight (-0.025em)
→ Usage: <h1 className="text-3xl md:text-5xl font-bold tracking-tight">

/* Page Title - H1 */
text-4xl: 2.25rem (36px) / 1.2 (43.2px)
→ Mobile: text-2xl (1.5rem / 2rem)
→ font-bold (700), tracking-tight
→ Usage: <h1 className="text-2xl md:text-4xl font-bold">

/* Section Header - H2 */
text-3xl: 1.875rem (30px) / 1.25 (37.5px)
→ Mobile: text-xl (1.25rem / 1.75rem)
→ font-semibold (600), tracking-tight
→ Usage: <h2 className="text-xl md:text-3xl font-semibold">

/* Subsection - H3 */
text-2xl: 1.5rem (24px) / 1.33 (32px)
→ Mobile: text-lg (1.125rem / 1.75rem)
→ font-semibold (600)
→ Usage: <h3 className="text-lg md:text-2xl font-semibold">

/* Card Title - H4 */
text-xl: 1.25rem (20px) / 1.4 (28px)
→ Mobile: text-lg (1.125rem / 1.75rem)
→ font-semibold (600)
→ Usage: <h4 className="text-lg md:text-xl font-semibold">

/* Small Heading - H5 */
text-lg: 1.125rem (18px) / 1.56 (28px)
→ font-medium (500)
→ Usage: <h5 className="text-lg font-medium">
```

#### Body Text

```css
/* Large Body - Introductions, emphasis */
text-lg: 1.125rem (18px) / 1.56 (28px)
→ font-normal (400)
→ Usage: <p className="text-lg text-slate-600 dark:text-slate-300">

/* Base Body - PRIMARY TEXT SIZE ⭐ */
text-base: 1rem (16px) / 1.5 (24px)
→ font-normal (400)
→ Optimal for paragraphs, readability
→ Usage: <p className="text-base text-slate-600 dark:text-slate-300">

/* Small Body - Secondary text, captions */
text-sm: 0.875rem (14px) / 1.43 (20px)
→ font-normal (400)
→ Usage: <p className="text-sm text-slate-500 dark:text-slate-400">

/* Extra Small - Labels, metadata, timestamps */
text-xs: 0.75rem (12px) / 1.33 (16px)
→ font-medium (500) for emphasis
→ Usage: <span className="text-xs font-medium text-slate-400">
```

### Font Weights

```css
font-light:     300  /* Rarely used - delicate text */
font-normal:    400  /* Body text ⭐ */
font-medium:    500  /* Emphasis, labels, small headings */
font-semibold:  600  /* Section headings, buttons ⭐ */
font-bold:      700  /* Main headings, hero text ⭐ */
font-extrabold: 800  /* Marketing, special emphasis */
```

**Usage Guidelines:**
- **Body text:** Always `font-normal` (400)
- **Buttons/CTAs:** Always `font-semibold` (600)
- **Headings:** `font-semibold` (600) for H2-H4, `font-bold` (700) for H1
- **Labels/Badges:** `font-medium` (500)

### Letter Spacing (Tracking)

```css
tracking-tighter: -0.05em  /* Large display text (48px+) */
tracking-tight:   -0.025em /* Headings ⭐ */
tracking-normal:   0em     /* Body text ⭐ */
tracking-wide:     0.025em /* Small caps, uppercase labels */
tracking-wider:    0.05em  /* Very small text (10-12px) */
```

### Line Height Guidelines

```css
/* Headings: Tighter (1.1 - 1.4) */
leading-tight:  1.25  /* Display text */
leading-snug:   1.375 /* Large headings */
leading-normal: 1.5   /* Default */

/* Body: Comfortable (1.5 - 1.75) */
leading-normal: 1.5   /* Standard paragraphs ⭐ */
leading-relaxed: 1.625 /* Long-form content */
leading-loose:  1.75  /* Dense information */
```

### Text Color Semantic Classes

```tsx
// Light Mode → Dark Mode
text-primary:   "text-slate-900 dark:text-slate-50"     // Headings
text-secondary: "text-slate-600 dark:text-slate-300"   // Body ⭐
text-tertiary:  "text-slate-500 dark:text-slate-400"   // Captions
text-disabled:  "text-slate-300 dark:text-slate-600"   // Disabled

// Brand Colors
text-brand:     "text-orange-600 dark:text-orange-400"
text-success:   "text-emerald-600 dark:text-emerald-400"
text-warning:   "text-amber-600 dark:text-amber-400"
text-error:     "text-red-600 dark:text-red-400"
```

### Typography Examples

```tsx
// ✅ Page Title
<h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
  Your Career Journey
</h1>

// ✅ Section Heading
<h2 className="text-xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
  Assessment Progress
</h2>

// ✅ Card Title
<h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-50">
  Career Discovery
</h3>

// ✅ Body Text
<p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
  Complete this assessment to discover careers that match your interests...
</p>

// ✅ Secondary Text
<p className="text-sm text-slate-500 dark:text-slate-400">
  15 minutes • Form 1-4
</p>

// ✅ Badge/Label
<span className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
  In Progress
</span>
```

---

## 🧩 Component Design Specifications

### Cards

#### Standard Content Card
```tsx
<Card className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-700/30 rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
      Card Title
    </CardTitle>
    <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
      Card description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Specifications:**
- Background: `bg-white dark:bg-slate-900`
- Border: `border-slate-200/30` (30% opacity)
- Radius: `rounded-xl` (12px)
- Padding: `p-6` (24px)
- Shadow: `shadow-sm` → `shadow-lg` on hover
- Hover: `scale-[1.02]` (2% scale)
- Transition: `300ms` all properties

#### Hero Banner Card
```tsx
<Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg overflow-hidden">
  <CardContent className="p-6 md:p-8 lg:p-10">
    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
      Welcome back, Student! 👋
    </h1>
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        Profile 85% Complete
      </Badge>
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        Focus: Form 4
      </Badge>
    </div>
    <p className="text-white/80 text-sm mt-2">
      AI-powered career journey tracking
    </p>
  </CardContent>
</Card>
```

**Specifications:**
- Gradient: `from-orange-500 to-orange-400`
- No border: `border-0`
- Text: All white with opacity variants
- Padding: Responsive `p-6 md:p-8 lg:p-10`
- Badges: `bg-white/20` with `backdrop-blur-sm`

#### Stat Card (Metrics Display)
```tsx
<div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center space-y-2 shadow hover:scale-105 transition-transform duration-200">
  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
    12
  </div>
  <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
    Assessments Completed
  </div>
</div>
```

**Specifications:**
- Background: `bg-white/90` (slight transparency)
- Padding: `p-4` (16px)
- Number: `text-3xl font-bold` with semantic color
- Label: `text-sm font-medium`
- Hover: `scale-105` (5% scale)

#### Image Card (Assessment Cards)
```tsx
<Card className="group bg-white/90 dark:bg-slate-900 border border-orange-200/30 dark:border-slate-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
  {/* Hero Image */}
  <div className="relative h-48 w-full overflow-hidden">
    <img 
      src="..." 
      alt="..." 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
    />
    {/* Progress Overlay */}
    <Badge className="absolute top-3 left-3 bg-orange-600 text-white shadow-lg">
      60% Complete
    </Badge>
  </div>
  
  {/* Content */}
  <CardHeader className="pb-4">
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform">
        <Award className="w-6 h-6 text-white" />
      </div>
      {/* Title */}
      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
        Career Assessment
      </CardTitle>
    </div>
  </CardHeader>
  
  <CardContent className="space-y-3">
    <p className="text-sm text-slate-600 dark:text-slate-300">
      Discover your ideal career path through comprehensive assessment
    </p>
    <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
      Get matched with top 5 careers for your profile
    </p>
  </CardContent>
  
  <CardFooter className="pt-3">
    <Button className="w-full gap-2 font-semibold bg-orange-500 hover:bg-orange-600 text-white">
      Continue Assessment
      <ArrowRight className="h-4 w-4" />
    </Button>
  </CardFooter>
</Card>
```

**Specifications:**
- Image height: `h-48` (192px)
- Image hover: Scale 110% on card hover
- Icon container: Gradient with `group-hover:scale-110`
- Progress badge: Absolute positioned, `top-3 left-3`
- Content spacing: `space-y-3` (12px gaps)

### Buttons

#### Primary Button (Main CTAs)
```tsx
<Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
  Get Started
</Button>
```

**Specifications:**
- Background: `orange-500` → `orange-600` (hover) → `orange-700` (active)
- Text: `text-white font-semibold`
- Padding: `px-6 py-3` (24px horizontal, 12px vertical)
- Radius: `rounded-lg` (8px)
- Shadow: `shadow-sm` → `shadow-md` on hover
- Min height: `h-10` (40px) for accessibility

#### Secondary Button
```tsx
<Button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-6 py-3 rounded-lg transition-colors duration-200">
  Learn More
</Button>
```

#### Ghost Button
```tsx
<Button className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-4 py-2 rounded-lg transition-colors duration-200">
  Cancel
</Button>
```

#### Button with Icon
```tsx
<Button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg">
  <span>Take Assessment</span>
  <ArrowRight className="h-4 w-4" />
</Button>
```

### Badges

#### Status Badges
```tsx
// Success
<Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2.5 py-1 rounded-md text-xs font-medium">
  Completed
</Badge>

// Warning
<Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-md text-xs font-medium">
  In Progress
</Badge>

// Info
<Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs font-medium">
  New
</Badge>

// Primary
<Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 px-2.5 py-1 rounded-md text-xs font-medium">
  Priority
</Badge>
```

**Specifications:**
- Padding: `px-2.5 py-1` (10px horizontal, 4px vertical)
- Radius: `rounded-md` (6px)
- Font: `text-xs font-medium`
- Min height: `h-6` (24px)

### Navigation

#### Top Navigation Bar
```tsx
<nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
  <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">E</span>
      </div>
      <span className="text-xl font-bold text-slate-900 dark:text-white">
        Elimu Smart
      </span>
    </div>
    
    {/* Nav Items */}
    <div className="hidden md:flex items-center gap-6">
      <a href="#" className="text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 font-medium transition-colors">
        Dashboard
      </a>
      {/* More nav items */}
    </div>
  </div>
</nav>
```

**Specifications:**
- Position: `sticky top-0 z-50`
- Background: `bg-white/95` with `backdrop-blur-sm`
- Height: `h-16` (64px)
- Border: Bottom border for separation

#### Mobile Bottom Navigation
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
  <div className="flex items-center justify-around px-2 py-2">
    {/* Active Item */}
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-orange-500 text-white min-w-[64px]">
      <Home className="h-5 w-5" />
      <span className="text-xs font-medium">Dashboard</span>
    </button>
    
    {/* Inactive Item */}
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[64px]">
      <ClipboardCheck className="h-5 w-5" />
      <span className="text-xs font-medium">Assessments</span>
    </button>
    
    {/* More items */}
  </div>
</nav>
```

**Specifications:**
- Position: `fixed bottom-0 z-50`
- Height: Content-based, typically `h-16`
- Items: Min width `64px`, min height `48px` (touch target)
- Active state: `bg-orange-500 text-white`
- Hide on desktop: `md:hidden`

### Role-Based Navigation Variants

```tsx
// Student Mobile Nav (Orange)
<nav className="fixed bottom-0 z-50 md:hidden bg-white dark:bg-slate-900">
  <div className="flex items-center justify-around px-2 py-2">
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-orange-500 text-white min-w-[64px]">
      <Home className="h-5 w-5" />
      <span className="text-xs font-medium">Dashboard</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <ClipboardCheck className="h-5 w-5" />
      <span className="text-xs font-medium">Assessments</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <MessageCircle className="h-5 w-5" />
      <span className="text-xs font-medium">Chat</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <Calendar className="h-5 w-5" />
      <span className="text-xs font-medium">Bookings</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <User className="h-5 w-5" />
      <span className="text-xs font-medium">Profile</span>
    </button>
  </div>
</nav>

// Counselor Mobile Nav (Yellow)
<nav className="fixed bottom-0 z-50 md:hidden bg-white dark:bg-slate-900">
  <div className="flex items-center justify-around px-2 py-2">
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-yellow-500 text-white min-w-[64px]">
      <LayoutDashboard className="h-5 w-5" />
      <span className="text-xs font-medium">Dashboard</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <Users className="h-5 w-5" />
      <span className="text-xs font-medium">Students</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <Calendar className="h-5 w-5" />
      <span className="text-xs font-medium">Sessions</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <MessageCircle className="h-5 w-5" />
      <span className="text-xs font-medium">Messages</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <User className="h-5 w-5" />
      <span className="text-xs font-medium">Profile</span>
    </button>
  </div>
</nav>

// Admin Mobile Nav (Purple)
<nav className="fixed bottom-0 z-50 md:hidden bg-white dark:bg-slate-900">
  <div className="flex items-center justify-around px-2 py-2">
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-purple-500 text-white min-w-[64px]">
      <BarChart className="h-5 w-5" />
      <span className="text-xs font-medium">Analytics</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <Users className="h-5 w-5" />
      <span className="text-xs font-medium">Users</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <FileText className="h-5 w-5" />
      <span className="text-xs font-medium">Content</span>
    </button>
    <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 min-w-[64px]">
      <Settings className="h-5 w-5" />
      <span className="text-xs font-medium">Settings</span>
    </button>
  </div>
</nav>

// Dynamic Role-Based Nav Component
interface RoleNavProps {
  role: 'student' | 'counselor' | 'admin';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const RoleBasedMobileNav: React.FC<RoleNavProps> = ({ role, activeTab, onTabChange }) => {
  const navConfigs = {
    student: {
      activeColor: 'bg-orange-500',
      items: [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'assessments', icon: ClipboardCheck, label: 'Assessments' },
        { id: 'chat', icon: MessageCircle, label: 'Chat' },
        { id: 'bookings', icon: Calendar, label: 'Bookings' },
        { id: 'profile', icon: User, label: 'Profile' },
      ],
    },
    counselor: {
      activeColor: 'bg-yellow-500',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'students', icon: Users, label: 'Students' },
        { id: 'sessions', icon: Calendar, label: 'Sessions' },
        { id: 'messages', icon: MessageCircle, label: 'Messages' },
        { id: 'profile', icon: User, label: 'Profile' },
      ],
    },
    admin: {
      activeColor: 'bg-purple-500',
      items: [
        { id: 'analytics', icon: BarChart, label: 'Analytics' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'content', icon: FileText, label: 'Content' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ],
    },
  };

  const config = navConfigs[role];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {config.items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-[64px] transition-colors duration-200',
                isActive
                  ? `${config.activeColor} text-white`
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

---

## 📐 Spacing & Layout System

### Spacing Scale (8px Base Grid)

```css
/* Tailwind Spacing */
space-0:   0px      /* None */
space-px:  1px      /* Hairline borders */
space-0.5: 2px      /* Micro spacing */
space-1:   4px      /* Tiny gaps */
space-2:   8px      /* Tight spacing ⭐ */
space-3:   12px     /* Snug spacing */
space-4:   16px     /* Base spacing ⭐ */
space-5:   20px     /* Comfortable */
space-6:   24px     /* Relaxed spacing ⭐ */
space-8:   32px     /* Spacious ⭐ */
space-10:  40px     /* Very spacious */
space-12:  48px     /* Large sections */
space-16:  64px     /* Page sections */
space-20:  80px     /* Hero sections */
space-24:  96px     /* Large page spacing */
```

**Common Patterns:**
- **Card padding:** `p-6` (24px)
- **Content gaps:** `gap-4` or `gap-6` (16px or 24px)
- **Section spacing:** `space-y-8` (32px)
- **Button padding:** `px-6 py-3` (24px x 12px)
- **Badge padding:** `px-2.5 py-1` (10px x 4px)

### Container & Max Widths

```css
/* Container Sizes */
container-sm:  max-w-640px   /* Forms, narrow content */
container-md:  max-w-768px   /* Blog posts, articles */
container-lg:  max-w-1024px  /* Main application ⭐ */
container-xl:  max-w-1280px  /* Wide dashboards */
container-2xl: max-w-1536px  /* Marketing pages */

/* Tailwind Classes */
max-w-sm   /* 384px */
max-w-md   /* 448px */
max-w-lg   /* 512px */
max-w-xl   /* 576px */
max-w-2xl  /* 672px */
max-w-3xl  /* 768px */
max-w-4xl  /* 896px */
max-w-5xl  /* 1024px ⭐ */
max-w-6xl  /* 1152px */
max-w-7xl  /* 1280px */
```

### Grid Systems

```css
/* Card Grids */
.grid-1-col:  grid-cols-1                    /* Mobile default */
.grid-2-col:  grid-cols-2                    /* Tablet stats */
.grid-3-col:  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  /* Main layout ⭐ */
.grid-4-col:  grid-cols-2 md:grid-cols-4    /* Stat cards */

/* Gap Sizes */
.gap-tight:    gap-4   /* 16px - Compact grids */
.gap-standard: gap-6   /* 24px - Standard grids ⭐ */
.gap-spacious: gap-8   /* 32px - Airy layouts */
```

**Example: Assessment Cards Grid**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## 🎭 Visual Effects

### Elevation (Shadows)

```css
/* Shadow Scale */
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)              /* Subtle elevation */
shadow:      0 1px 3px rgba(0,0,0,0.1)               /* Default cards */
shadow-md:   0 4px 6px rgba(0,0,0,0.1)               /* Raised elements */
shadow-lg:   0 10px 15px rgba(0,0,0,0.1)             /* Floating cards ⭐ */
shadow-xl:   0 20px 25px rgba(0,0,0,0.1)             /* Modals, dropdowns */
shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)            /* Hero sections */
```

**Usage Guidelines:**
- **Default state:** `shadow-sm` or `shadow`
- **Hover state:** `shadow-lg`
- **Interactive elements:** Transition between shadow levels
- **Modals/overlays:** `shadow-xl` or `shadow-2xl`

### Border Radius

```css
rounded-none:  0px       /* Square corners */
rounded-sm:    2px       /* Tight elements */
rounded:       4px       /* Small badges */
rounded-md:    6px       /* Badges, pills ⭐ */
rounded-lg:    8px       /* Buttons, inputs ⭐ */
rounded-xl:    12px      /* Cards, panels ⭐ */
rounded-2xl:   16px      /* Large cards, heroes */
rounded-3xl:   24px      /* Extra large elements */
rounded-full:  9999px    /* Circles, pills */
```

**Hierarchy:**
- **Cards:** `rounded-xl` (12px)
- **Buttons:** `rounded-lg` (8px)
- **Badges:** `rounded-md` (6px)
- **Icons/Avatars:** `rounded-full`

### Transitions & Animations

#### Duration
```css
duration-75:   75ms    /* Instant feedback */
duration-100:  100ms   /* Very quick */
duration-150:  150ms   /* Quick interactions ⭐ */
duration-200:  200ms   /* Standard transitions ⭐ */
duration-300:  300ms   /* Smooth animations ⭐ */
duration-500:  500ms   /* Slow, deliberate */
duration-700:  700ms   /* Very slow */
duration-1000: 1000ms  /* Full second (rare) */
```

#### Easing Functions
```css
ease-linear:     linear                         /* Constant speed */
ease-in:         cubic-bezier(0.4, 0, 1, 1)    /* Accelerate */
ease-out:        cubic-bezier(0, 0, 0.2, 1)    /* Decelerate ⭐ */
ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1)  /* Smooth both ends ⭐ */
```

**Best Practices:**
- **Default:** `transition-all duration-200 ease-out`
- **Colors:** `transition-colors duration-200`
- **Transforms:** `transition-transform duration-300`
- **Hover states:** 150-200ms for responsiveness
- **Large movements:** 300ms for smoothness

#### Common Transitions
```tsx
// ✅ Card hover
<Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">

// ✅ Button hover
<Button className="transition-colors duration-200 bg-orange-500 hover:bg-orange-600">

// ✅ Icon scale
<div className="transition-transform duration-200 hover:scale-110">

// ✅ Fade in/out
<div className="transition-opacity duration-300 opacity-0 hover:opacity-100">
```

### Hover & Focus States

#### Scale Transforms
```css
hover:scale-[1.02]  /* Cards (2% larger) ⭐ */
hover:scale-105     /* Buttons (5% larger) ⭐ */
hover:scale-110     /* Icons (10% larger) ⭐ */
hover:scale-95      /* Press effect (5% smaller) */
```

#### Opacity
```css
hover:opacity-80    /* Images, overlays */
hover:opacity-90    /* Subtle hover effects */
hover:opacity-100   /* Reveal hidden elements */
```

#### Focus Rings (Accessibility)
```tsx
// ✅ Orange focus ring for brand consistency
<Button className="focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">

// ✅ Input focus
<Input className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500">

// ✅ Custom focus (remove default, add custom)
<button className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg">
```

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast Requirements
- **Normal text (< 18px):** Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px or ≥ 14px bold):** Minimum 3:1 contrast ratio
- **UI components & graphics:** Minimum 3:1 contrast ratio
- **Interactive elements:** Clear visual differentiation

#### Verified Color Combinations ✅

**Light Mode:**
```
✅ slate-900 on white        → 18.4:1  (Max contrast)
✅ slate-700 on white        → 11.2:1  (Headings)
✅ slate-600 on white        → 7.0:1   (Body text ⭐)
✅ slate-500 on white        → 4.6:1   (Secondary text)
✅ orange-600 on white       → 4.5:1   (Links, CTAs ⭐)
✅ white on orange-500       → 4.8:1   (Button text ⭐)
✅ emerald-600 on white      → 4.5:1   (Success)
✅ red-600 on white          → 4.5:1   (Errors)
```

**Dark Mode:**
```
✅ slate-50 on slate-900     → 17.3:1  (Max contrast)
✅ slate-200 on slate-900    → 11.5:1  (Headings)
✅ slate-300 on slate-900    → 7.2:1   (Body text ⭐)
✅ slate-400 on slate-900    → 4.6:1   (Secondary text)
✅ orange-400 on slate-900   → 5.1:1   (Links ⭐)
✅ emerald-400 on slate-900  → 5.3:1   (Success)
✅ red-400 on slate-900      → 4.9:1   (Errors)
```

### Focus Indicators

```tsx
// ✅ Standard focus ring
focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2

// ✅ Visible focus for keyboard users
focus-visible:ring-2 focus-visible:ring-orange-500

// ✅ Focus within (for containers)
focus-within:ring-2 focus-within:ring-orange-500
```

### Touch Targets (Mobile)

**Minimum Sizes:**
- iOS Guidelines: 44 x 44 px
- Material Design: 48 x 48 px
- **Our Standard:** 48 x 48 px minimum ⭐

```tsx
// ✅ Proper touch target
<button className="min-h-[48px] min-w-[48px] px-6 py-3">

// ✅ Icon button with adequate size
<button className="w-10 h-10 flex items-center justify-center">
  <Icon className="w-5 h-5" />
</button>

// ❌ Too small for touch
<button className="w-6 h-6">  {/* 24px - too small! */}
```

### Semantic HTML

```tsx
// ✅ Use semantic elements
<nav>, <main>, <article>, <section>, <aside>, <header>, <footer>

// ✅ Proper heading hierarchy
<h1> → <h2> → <h3> (don't skip levels)

// ✅ Button for actions
<button onClick={handleClick}>Click me</button>

// ✅ Link for navigation
<a href="/profile">View Profile</a>

// ❌ Div soup
<div onClick={handleClick}>Click me</div>  {/* Use <button> */}
```

### ARIA Labels

```tsx
// ✅ Icon-only buttons
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// ✅ Status indicators
<div role="status" aria-live="polite">
  Loading...
</div>

// ✅ Hidden decorative elements
<svg aria-hidden="true" focusable="false">
  {/* Decorative icon */}
</svg>
```

### Keyboard Navigation

**Requirements:**
- All interactive elements must be keyboard accessible
- Tab order follows logical reading order
- Escape closes modals/dropdowns
- Enter/Space activates buttons
- Arrow keys navigate lists/menus

```tsx
// ✅ Keyboard accessible modal
<Dialog
  onEscapeKeyDown={handleClose}
  onPointerDownOutside={handleClose}
>
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm:  640px   /* Small tablets, large phones */
md:  768px   /* Tablets portrait ⭐ */
lg:  1024px  /* Tablets landscape, small laptops ⭐ */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Design for 375px First

**Target Devices:**
- iPhone SE: 375 x 667
- iPhone 12/13 Mini: 375 x 812
- Samsung Galaxy S21: 360 x 800

```tsx
// ✅ Mobile-first typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* 24px → 30px → 36px */}
</h1>

// ✅ Mobile-first layout
<div className="px-4 md:px-6 lg:px-8">
  {/* 16px → 24px → 32px padding */}
</div>

// ✅ Mobile-first grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 col → 2 cols → 3 cols */}
</div>
```

### Responsive Patterns

#### Stack to Grid
```tsx
<div className="flex flex-col md:flex-row gap-6">
  {/* Vertical on mobile, horizontal on desktop */}
</div>
```

#### Hide/Show by Breakpoint
```tsx
// Mobile navigation
<nav className="md:hidden">
  {/* Only visible on mobile */}
</nav>

// Desktop navigation
<nav className="hidden md:block">
  {/* Only visible on desktop */}
</nav>
```

#### Responsive Padding
```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* 16px → 24px → 32px */}
</div>
```

---

## 🚀 Implementation Best Practices

### Component Checklist

Before marking a component "done," ensure:

- [ ] **Light mode** styled with proper colors
- [ ] **Dark mode** styled (`dark:` variants on all colors)
- [ ] **Mobile responsive** (test at 375px width)
- [ ] **Hover states** for interactive elements
- [ ] **Focus states** for keyboard navigation
- [ ] **Loading states** for async operations
- [ ] **Error states** with helpful messaging
- [ ] **Empty states** when no data
- [ ] **Accessibility audit** (contrast, ARIA, semantics)
- [ ] **Touch targets** minimum 48x48px
- [ ] **Transitions** smooth (200-300ms)
- [ ] **Performance** optimized (no unnecessary re-renders)

### Code Quality Standards

#### ✅ Good Examples

```tsx
// Typography with dark mode
<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
  Section Heading
</h2>
<p className="text-base text-slate-600 dark:text-slate-300">
  Body text with proper contrast and readability
</p>

// Card with complete styling
<Card className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-700/30 rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-slate-600 dark:text-slate-300">
      Card content
    </p>
  </CardContent>
</Card>

// Button with accessibility
<Button 
  className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
  aria-label="Start career assessment"
>
  Get Started
</Button>

// Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>
```

#### ❌ Bad Examples (What NOT to do)

```tsx
// ❌ No dark mode
<p className="text-slate-600">
  This will be unreadable in dark mode
</p>

// ❌ Inconsistent spacing
<div className="p-3">  {/* Should be p-4 or p-6 */}
  <div className="mt-5">  {/* Should be mt-4 or mt-6 */}

// ❌ Wrong colors
<Button className="bg-red-500 text-white">
  Primary Action  {/* Should use orange */}
</Button>

// ❌ Poor contrast
<p className="text-slate-300 bg-white">
  Can't read this  {/* Only 2.8:1 contrast */}
</p>

// ❌ Missing transitions
<Card className="hover:shadow-lg">
  {/* No transition duration - will be jarring */}
</Card>

// ❌ Small touch targets
<button className="w-6 h-6">
  ×  {/* Only 24px - too small for touch */}
</button>

// ❌ No focus indicator
<button className="focus:outline-none">
  {/* Keyboard users can't see focus */}
</button>
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Base components (Button, Card, Badge)
│   ├── cards/           # Composite card components
│   ├── navigation/      # Nav components
│   ├── layouts/         # Layout wrappers
│   └── common/          # Shared components
├── styles/
│   ├── globals.css      # Base styles, design tokens
│   └── components/      # Component-specific styles
└── lib/
    └── utils.ts         # cn() helper, utilities
```

### CSS Architecture

```css
/* globals.css Structure */

/* 1. CSS Variables & Design Tokens */
:root {
  --font-sans: -apple-system, ...;
  --radius: 0.625rem;
  /* ... */
}

/* 2. Base Styles */
* { box-sizing: border-box; }
html, body { font-family: var(--font-sans); }

/* 3. Typography Defaults */
h1, h2, h3, h4, h5, h6 { font-weight: 600; }
p { line-height: 1.5; }

/* 4. Component Classes (if needed) */
.card-hover { /* Custom hover effects */ }

/* 5. Utility Classes */
.text-gradient { /* Custom gradients */ }

/* 6. Dark Mode Overrides */
.dark { /* Dark mode adjustments */ }
```

---

## 📊 Role-Based Component Examples

### Student Dashboard Components

```tsx
// Student Hero Banner
<Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg">
  <CardContent className="p-6 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
      Welcome back, Student! 👋
    </h1>
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        Profile 85% Complete
      </Badge>
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        Focus: Form 4
      </Badge>
    </div>
    <p className="text-white/80 text-sm mt-2">
      AI-powered career journey tracking
    </p>
  </CardContent>
</Card>

// Student Stat Cards
<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
  <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow hover:scale-105 transition-transform">
    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
      5
    </div>
    <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
      Completed
    </div>
  </div>
</div>

// Student CTA Button
<Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg">
  Take Career Assessment
</Button>

// Student Progress Badge
<Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 px-2.5 py-1 rounded-md text-xs font-medium">
  In Progress
</Badge>
```

### Counselor Dashboard Components

```tsx
// Counselor Hero Banner
<Card className="border-0 bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg">
  <CardContent className="p-6 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
      Welcome, Counselor! 👋
    </h1>
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        24 Active Students
      </Badge>
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        5 Sessions Today
      </Badge>
    </div>
    <p className="text-white/80 text-sm mt-2">
      Professional guidance dashboard
    </p>
  </CardContent>
</Card>

// Counselor Stat Cards
<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
  <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow hover:scale-105 transition-transform">
    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
      24
    </div>
    <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
      Active Students
    </div>
  </div>
  <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow hover:scale-105 transition-transform">
    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
      18
    </div>
    <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
      Completed Sessions
    </div>
  </div>
</div>

// Counselor CTA Button
<Button className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg">
  View Student Roster
</Button>

// Counselor Session Badge
<Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2.5 py-1 rounded-md text-xs font-medium">
  Session Scheduled
</Badge>

// Counselor Navigation (Active)
<nav className="fixed bottom-0 md:hidden bg-white dark:bg-slate-900">
  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
    <Calendar className="h-5 w-5" />
    <span className="text-xs font-medium">Sessions</span>
  </button>
</nav>
```

### Admin Dashboard Components

```tsx
// Admin Hero Banner
<Card className="border-0 bg-gradient-to-r from-purple-500 to-purple-400 shadow-lg">
  <CardContent className="p-6 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
      Admin Dashboard 👑
    </h1>
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        1,247 Total Users
      </Badge>
      <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
        System Healthy
      </Badge>
    </div>
    <p className="text-white/80 text-sm mt-2">
      Platform management & analytics
    </p>
  </CardContent>
</Card>

// Admin Stat Cards
<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
  <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow hover:scale-105 transition-transform">
    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
      1,247
    </div>
    <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
      Total Users
    </div>
  </div>
  <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow hover:scale-105 transition-transform">
    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
      98.5%
    </div>
    <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
      System Uptime
    </div>
  </div>
</div>

// Admin CTA Button
<Button className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg">
  Manage Users
</Button>

// Admin Status Badge
<Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2.5 py-1 rounded-md text-xs font-medium">
  System Admin
</Badge>

// Admin Navigation (Active)
<nav className="fixed bottom-0 md:hidden bg-white dark:bg-slate-900">
  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg">
    <BarChart className="h-5 w-5" />
    <span className="text-xs font-medium">Analytics</span>
  </button>
</nav>
```

### Multi-Role Component (Dynamic Theming)

```tsx
import { cn } from '@/lib/utils';

type UserRole = 'student' | 'counselor' | 'admin';

interface RoleThemedCardProps {
  role: UserRole;
  title: string;
  description: string;
  stat: number;
  statLabel: string;
}

const getRoleTheme = (role: UserRole) => {
  const themes = {
    student: {
      gradient: 'from-orange-500 to-orange-400',
      statColor: 'text-orange-600 dark:text-orange-400',
      statBg: 'bg-orange-100 dark:bg-orange-900',
      statText: 'text-orange-700 dark:text-orange-300',
      button: 'bg-orange-500 hover:bg-orange-600',
    },
    counselor: {
      gradient: 'from-yellow-500 to-yellow-400',
      statColor: 'text-yellow-600 dark:text-yellow-400',
      statBg: 'bg-yellow-100 dark:bg-yellow-900',
      statText: 'text-yellow-700 dark:text-yellow-300',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    },
    admin: {
      gradient: 'from-purple-500 to-purple-400',
      statColor: 'text-purple-600 dark:text-purple-400',
      statBg: 'bg-purple-100 dark:bg-purple-900',
      statText: 'text-purple-700 dark:text-purple-300',
      button: 'bg-purple-500 hover:bg-purple-600',
    },
  };
  return themes[role];
};

export const RoleThemedCard: React.FC<RoleThemedCardProps> = ({
  role,
  title,
  description,
  stat,
  statLabel,
}) => {
  const theme = getRoleTheme(role);

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <Card className={cn('border-0 bg-gradient-to-r shadow-lg', theme.gradient)}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/80 text-sm">{description}</p>
        </CardContent>
      </Card>

      {/* Stat Card */}
      <div className={cn('p-4 rounded-xl text-center shadow', theme.statBg)}>
        <div className={cn('text-3xl font-bold', theme.statColor)}>
          {stat}
        </div>
        <div className={cn('text-sm font-medium', theme.statText)}>
          {statLabel}
        </div>
      </div>

      {/* CTA Button */}
      <Button className={cn('w-full text-white font-semibold', theme.button)}>
        Take Action
      </Button>
    </div>
  );
};
```

---

## 📊 Component Usage Examples

### Dashboard Page Layout

```tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, Student! 👋
          </h1>
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
              Profile 85% Complete
            </Badge>
            <Badge className="bg-white/20 text-white font-semibold backdrop-blur-sm">
              Focus: Form 4
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white/90 dark:bg-slate-900 p-4 rounded-xl text-center shadow hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            5
          </div>
          <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Completed
          </div>
        </div>
        {/* More stat cards */}
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assessments.map(assessment => (
          <AssessmentCard key={assessment.id} {...assessment} />
        ))}
      </div>
    </div>
  );
}
```

### Form Pattern

```tsx
<form className="space-y-6">
  {/* Input Field */}
  <div className="space-y-2">
    <label 
      htmlFor="email" 
      className="text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      Email Address
    </label>
    <input
      id="email"
      type="email"
      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
      placeholder="you@example.com"
    />
    <p className="text-xs text-slate-500 dark:text-slate-400">
      We'll never share your email
    </p>
  </div>

  {/* Submit Button */}
  <Button 
    type="submit"
    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
  >
    Sign In
  </Button>
</form>
```

### Modal/Dialog Pattern

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-md">
    <DialogHeader>
      <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Confirm Action
      </DialogTitle>
      <DialogDescription className="text-sm text-slate-600 dark:text-slate-300">
        Are you sure you want to proceed? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-2">
      <Button variant="secondary">
        Cancel
      </Button>
      <Button className="bg-orange-500 hover:bg-orange-600">
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🎓 Design System Governance

### When to Update This Document

- Adding new color tokens or semantic colors
- Changing spacing or typography scales
- Creating new component patterns
- Updating accessibility requirements
- Major design direction changes

### How to Propose Changes

1. Create issue in GitHub with `design-system` label
2. Provide rationale and examples
3. Show impact on existing components
4. Get approval from design lead
5. Update documentation
6. Implement across codebase

### Version History

- **v2.0 (Oct 2025)** - Comprehensive rewrite, mobile-first, removed glassmorphism
- **v1.0 (Sept 2025)** - Initial design system with basic tokens

---

## 📚 Resources & References

### Design Inspiration
- **Material Design 3** - https://m3.material.io/
- **Apple HIG** - https://developer.apple.com/design/human-interface-guidelines/
- **Tailwind UI** - https://tailwindui.com/
- **shadcn/ui** - https://ui.shadcn.com/

### Accessibility Tools
- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **WAVE** - https://wave.webaim.org/
- **axe DevTools** - Browser extension for a11y testing

### Color Tools
- **Coolors** - https://coolors.co/ (palette generation)
- **Accessible Color Palette** - https://accessible-colors.com/
- **ColorBox** - https://colorbox.io/ (color scale generation)

### Typography
- **Modular Scale** - https://www.modularscale.com/
- **Type Scale** - https://typescale.com/
- **Google Fonts** - https://fonts.google.com/

---

**End of Design System Documentation v2.0**

*For questions or clarifications, contact the design team.*
