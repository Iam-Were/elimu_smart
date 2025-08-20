# Elimu Smart Design System - Complete Replication Guide

## 🎯 Purpose

This guide enables you to replicate the complete Elimu Smart design system (theme, components, landing page, and UI patterns) in any new project using Claude AI.

## 📋 What You'll Get

- **Role-based theming system** (Student=Orange, Counselor=Yellow, Admin=Purple)
- **Complete UI component library** with Mantine integration
- **Responsive landing page** with modern design
- **Production-ready authentication flow**
- **Design system documentation**
- **Accessibility standards**

## 🚀 Quick Start Instructions

### Step 1: Copy-Paste This Prompt to Claude AI

```
I want to create a web application using the Elimu Smart Design System. Please implement the following:

**DESIGN SYSTEM REQUIREMENTS:**
1. Role-based theming with three themes:
   - Student Theme: Orange (#f97316) - Default
   - Counselor Theme: Yellow (#eab308)
   - Admin Theme: Purple (#a855f7)

2. Use Mantine UI as the component library
3. Implement Tailwind V4 with CSS custom properties
4. Create a responsive landing page
5. Include authentication flow with role-based theming
6. Follow accessibility standards (WCAG 2.1 AA)

**TECHNICAL STACK:**
- React + TypeScript
- Mantine UI v7+
- Tailwind CSS v4
- Vite for build system
- Modern CSS with custom properties

**CORE FEATURES TO IMPLEMENT:**
1. Landing page with hero section, features, and call-to-action
2. Authentication system with login/signup
3. Role-based dashboard layouts
4. Theme switching functionality
5. Responsive design (mobile-first)
6. Dark mode support

Please create the complete file structure and implement all components following the design system standards.
```

### Step 2: Theme Configuration Files

After Claude creates the basic structure, provide these theme files:

**Copy this CSS configuration:**

```css
/* Paste the complete globals.css from /styles/globals.css */
```

**Copy this Mantine theme:**

```javascript
/* Paste the mantineTheme.js configuration */
```

### Step 3: Component Implementation

Use these component patterns as reference for Claude:

**Authentication Flow Pattern:**

```tsx
// Role-based theme application
const applyRoleTheme = (role) => {
  document.body.className = document.body.className.replace(/theme-\w+/g, "");
  document.body.style.transition = "all 0.3s ease-in-out";

  if (role === "admin") {
    document.body.classList.add("theme-admin");
  } else if (role === "counselor") {
    document.body.classList.add("theme-counselor");
  }
  // Student theme is default
};
```

## 📁 Complete File Structure Template

```
your-project/
├── src/
│   ├── components/
│   │   ├── AuthFlow.tsx
│   │   ├── LandingPage.tsx
│   │   ├── AppLayout.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ui/
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── authService.ts
│   ├── styles/
│   │   └── globals.css
│   ├── theme/
│   │   └── mantineTheme.js
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Design System Specifications

### Color System

```css
/* Student Theme (Default) */
--primary: #f97316; /* Orange 500 */
--secondary: #fef3c7; /* Orange 100 */
--accent: #fed7aa; /* Orange 200 */

/* Admin Theme */
--admin-primary: #a855f7; /* Purple 500 */
--admin-secondary: #f3e8ff; /* Purple 100 */
--admin-accent: #ddd6fe; /* Purple 200 */

/* Counselor Theme */
--counselor-primary: #eab308; /* Yellow 500 */
--counselor-secondary: #fef3c7; /* Yellow 100 */
--counselor-accent: #fde047; /* Yellow 300 */
```

### Typography Scale

```css
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px - Base */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
```

### Spacing System (8px grid)

```css
--space-1: 0.125rem; /* 2px */
--space-2: 0.25rem; /* 4px */
--space-3: 0.5rem; /* 8px - Base unit */
--space-4: 0.75rem; /* 12px */
--space-5: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
```

## 🧩 Component Patterns

### Button Component

```tsx
<Button
  className="bg-primary text-primary-foreground hover:opacity-90 transition-all"
  size="md"
>
  Primary Action
</Button>
```

### Card Component

```tsx
<Card className="bg-card border border-border shadow-sm">
  <Card.Section className="p-6">
    <h3 className="font-medium text-foreground">Card Title</h3>
    <p className="text-sm text-muted-foreground">Description</p>
  </Card.Section>
</Card>
```

### Form Component

```tsx
<TextInput
  label="Field Label"
  placeholder="Enter value"
  className="bg-input-background border-border"
  styles={{
    input: {
      backgroundColor: "var(--input-background)",
      borderColor: "var(--border)",
      color: "var(--foreground)",
    },
  }}
/>
```

## 📱 Landing Page Template

### Hero Section

```tsx
const HeroSection = () => (
  <section className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center">
    <div className="container mx-auto px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Your Platform Name
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Platform description and value proposition
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  </section>
);
```

### Features Section

```tsx
const FeaturesSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Key Features
        </h2>
        <p className="text-muted-foreground">
          Everything you need in one platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card border border-border p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
```

## 🔧 Implementation Checklist

### Initial Setup

- [ ] Create React + Vite project
- [ ] Install Mantine UI and dependencies
- [ ] Configure Tailwind CSS v4
- [ ] Set up CSS custom properties
- [ ] Create theme configuration

### Core Components

- [ ] Implement AuthFlow component
- [ ] Create LandingPage component
- [ ] Build AppLayout with sidebar
- [ ] Add ErrorBoundary wrapper
- [ ] Set up routing system

### Theme System

- [ ] Configure role-based CSS variables
- [ ] Implement theme switching logic
- [ ] Add Mantine theme integration
- [ ] Test dark mode functionality
- [ ] Validate accessibility standards

### Authentication

- [ ] Create login/signup forms
- [ ] Implement role-based routing
- [ ] Add form validation
- [ ] Set up protected routes
- [ ] Test theme switching on login

### Responsive Design

- [ ] Mobile-first CSS implementation
- [ ] Touch-friendly button sizing
- [ ] Responsive navigation
- [ ] Mobile menu implementation
- [ ] Cross-device testing

## 📦 Package Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "@mantine/notifications": "^7.0.0",
    "@tabler/icons-react": "^2.40.0",
    "tailwindcss": "^4.0.0-alpha.1",
    "framer-motion": "^10.16.0"
  }
}
```

## 🎯 Advanced Features

### Production/Demo Mode Toggle

```tsx
const [platformMode, setPlatformMode] = useState("demo");

const toggleMode = () => {
  setPlatformMode((prev) => (prev === "demo" ? "production" : "demo"));
};
```

### Theme Persistence

```tsx
useEffect(() => {
  const savedTheme = localStorage.getItem("user-role");
  if (savedTheme) {
    applyRoleTheme(savedTheme);
  }
}, []);
```

### Loading States

```tsx
<LoadingOverlay
  visible={loading}
  overlayProps={{
    backgroundOpacity: 0.3,
    color: "var(--primary)",
  }}
/>
```

## 🔄 Customization Guide

### Adding New Themes

1. Define new CSS variables in `:root`
2. Create theme class (e.g., `.theme-teacher`)
3. Update theme switching function
4. Add Mantine color variants

### Modifying Colors

1. Update CSS custom properties
2. Adjust Tailwind theme mapping
3. Update Mantine theme configuration
4. Test contrast ratios

### Adding Components

1. Follow established naming conventions
2. Use CSS custom properties
3. Implement responsive design
4. Add accessibility attributes

## 📚 Resources

- [Elimu Smart Live Demo](https://your-demo-url.com)
- [Design System Documentation](./01_design_principles/design_system.md)
- [Component Examples](./02_component_library/)
- [Theme Configuration](./03_theme_system/)

## 🤝 Support

For questions or issues:

1. Check the troubleshooting guide
2. Review component examples
3. Test in different browsers
4. Validate responsive behavior

---

**🎨 This design system has been battle-tested in production and provides:**

- Excellent user experience across all devices
- Accessibility compliance (WCAG 2.1 AA)
- Role-based personalization
- Modern, professional appearance
- Maintainable, scalable code structure

Copy the prompt above to Claude AI and follow the implementation steps to recreate this design system in your new project!
