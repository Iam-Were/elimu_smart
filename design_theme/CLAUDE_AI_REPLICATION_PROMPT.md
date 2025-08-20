# Complete Claude AI Replication Prompt

## 🎯 Copy This Entire Prompt to Claude AI

````
I want you to create a complete web application using the Elimu Smart Design System. This is a production-ready design system with role-based theming, modern UI components, and comprehensive accessibility features.

**PROJECT REQUIREMENTS:**

**1. TECHNICAL STACK:**
- React 18+ with TypeScript
- Vite for build system
- Mantine UI v7+ as component library
- Tailwind CSS v4 with custom properties
- Modern CSS with CSS custom properties
- Responsive design (mobile-first)
- Accessibility compliance (WCAG 2.1 AA)

**2. DESIGN SYSTEM SPECIFICATIONS:**

**Role-Based Theming System:**
- Student Theme (Default): Orange (#f97316) - Energetic, growth-oriented
- Counselor Theme: Yellow (#eab308) - Professional, supportive
- Admin Theme: Purple (#a855f7) - Authoritative, sophisticated

**Color System:**
```css
/* Student Theme Colors */
--primary: #f97316;           /* Orange 500 */
--secondary: #fef3c7;         /* Orange 100 */
--muted: #fef9e7;            /* Orange 50 */
--accent: #fed7aa;           /* Orange 200 */

/* Admin Theme Colors */
--admin-primary: #a855f7;     /* Purple 500 */
--admin-secondary: #f3e8ff;   /* Purple 100 */
--admin-muted: #faf5ff;      /* Purple 50 */
--admin-accent: #ddd6fe;     /* Purple 200 */

/* Counselor Theme Colors */
--counselor-primary: #eab308; /* Yellow 500 */
--counselor-secondary: #fef3c7; /* Yellow 100 */
--counselor-muted: #fefce8;  /* Yellow 50 */
--counselor-accent: #fde047; /* Yellow 300 */
````

**Typography Scale (8px grid system):**

- Base font size: 14px
- Scale: 12px, 14px, 16px, 18px, 20px, 24px
- Font weights: 400 (normal), 500 (medium), 600 (semibold)

**Spacing System:**

- Base unit: 8px
- Scale: 2px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**3. CORE FEATURES TO IMPLEMENT:**

**Authentication System:**

- Modern landing page with hero section
- Login/signup forms with validation
- Role-based routing and theme switching
- Smooth theme transitions (300ms ease-in-out)

**Layout Components:**

- Responsive app layout with sidebar navigation
- Role-specific dashboard layouts
- Mobile-friendly navigation with hamburger menu
- Theme-aware component styling

**UI Components:**

- Buttons (primary, secondary, outline, ghost variants)
- Cards with hover effects and proper spacing
- Forms with validation and error states
- Progress indicators and loading states
- Alerts and notifications
- Modal dialogs and overlays

**Accessibility Features:**

- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios (4.5:1 minimum)
- Focus indicators and ARIA labels
- Reduced motion support

**4. IMPLEMENTATION REQUIREMENTS:**

**File Structure:**

```
src/
├── components/
│   ├── AuthFlow.tsx          // Authentication components
│   ├── LandingPage.tsx       // Landing page
│   ├── AppLayout.tsx         // Main app layout
│   ├── ErrorBoundary.tsx     // Error handling
│   └── ui/                   // Reusable UI components
├── hooks/
│   └── useAuth.ts           // Authentication logic
├── services/
│   └── authService.ts       // API services
├── styles/
│   └── globals.css          // Complete theme system
├── theme/
│   └── mantineTheme.js      // Mantine configuration
├── App.tsx                  // Main app component
└── main.tsx                // Entry point
```

**Theme Implementation:**

- CSS custom properties for dynamic theming
- Role-based theme classes (.theme-admin, .theme-counselor)
- Smooth theme switching with applyRoleTheme() function
- Dark mode support for all themes

**Component Patterns:**

- Use CSS custom properties (var(--primary)) instead of hardcoded colors
- Implement hover effects with translateY(-2px)
- Use consistent border radius (var(--radius))
- Apply proper spacing using the 8px grid system

**Responsive Design:**

- Mobile-first approach with proper breakpoints
- Touch-friendly button sizing (44px minimum)
- Responsive navigation and layout
- Safe area handling for mobile devices

**5. SPECIFIC COMPONENTS TO CREATE:**

**Landing Page:**

- Hero section with gradient background
- Features grid with icons and descriptions
- Benefits section with checkmarks
- Testimonials carousel
- Call-to-action section
- Footer with links

**Authentication:**

- Login form with email/password
- Signup form with role selection
- Form validation and error handling
- "Get Started" flow with smooth transitions

**Dashboard Layout:**

- Sidebar navigation with role-based menu items
- Main content area with proper spacing
- Header with user info and logout
- Responsive mobile navigation

**6. STYLING GUIDELINES:**

**CSS Methodology:**

- Use CSS custom properties for all colors
- Implement utility classes for common patterns
- Follow BEM-like naming for components
- Use Tailwind classes for layout and spacing

**Animation Standards:**

- Keep animations under 300ms
- Use ease-out timing for UI transitions
- Respect prefers-reduced-motion
- Add hover effects to interactive elements

**Color Usage:**

- Never hardcode colors - always use CSS variables
- Ensure proper contrast ratios
- Provide visual feedback for interactive states
- Use semantic color naming (primary, secondary, etc.)

**7. MANTINE INTEGRATION:**

Configure Mantine theme with:

- Custom color palettes for each role
- CSS variable integration for theming
- Component style overrides
- Responsive breakpoints
- Font and spacing system alignment

**8. QUALITY STANDARDS:**

- TypeScript strict mode enabled
- ESLint and Prettier configuration
- Error boundaries for robust error handling
- Loading states for all async operations
- Proper semantic HTML structure
- Comprehensive keyboard navigation

**DELIVERABLES:**

1. Complete file structure with all components
2. Fully configured theme system (globals.css)
3. Mantine theme configuration
4. Working authentication flow
5. Responsive landing page
6. Role-based dashboard layouts
7. Production-ready build configuration

**IMPORTANT NOTES:**

- Prioritize accessibility and user experience
- Ensure smooth theme transitions between roles
- Use semantic HTML and proper ARIA labels
- Test all components in different screen sizes
- Implement proper error handling and loading states
- Follow the established design patterns consistently

Please create the complete application with all files, ensuring that the design system is properly implemented and the role-based theming works seamlessly. Focus on creating a polished, production-ready experience that can serve as a foundation for further development.

```

## 📋 Additional Instructions After Initial Creation

Once Claude creates the basic structure, provide these follow-up instructions:

### Step 2: Theme Refinement
```

Now please:

1. Ensure all components use CSS custom properties (var(--primary)) instead of hardcoded colors
2. Add smooth hover effects to all interactive elements
3. Implement the applyRoleTheme() function for dynamic theme switching
4. Test theme transitions between student/counselor/admin roles
5. Add loading states and error boundaries where needed

```

### Step 3: Component Polish
```

Please enhance the components with:

1. Proper TypeScript interfaces for all props
2. Accessibility attributes (ARIA labels, semantic HTML)
3. Responsive design with mobile-first approach
4. Form validation with helpful error messages
5. Smooth animations and micro-interactions

```

### Step 4: Production Readiness
```

Finally, please:

1. Add comprehensive error handling
2. Implement proper loading states
3. Ensure keyboard navigation works throughout
4. Test and fix any responsive design issues
5. Add proper meta tags and SEO considerations
6. Create a production build configuration

```

## 🎨 Customization Options

After the base implementation, you can request specific customizations:

### Industry-Specific Adaptations
```

Please adapt this design system for [industry]:

- Update the color scheme to match [industry] standards
- Modify the landing page content for [specific use case]
- Add industry-specific icons and terminology
- Customize the dashboard for [specific workflow]

```

### Feature Additions
```

Please add these features:

- User profile management with avatar upload
- Settings panel with theme customization
- Notification system with toast messages
- Search functionality with filters
- Data visualization with charts
- File upload with drag-and-drop

```

### Brand Customization
```

Please customize the brand elements:

- Change the primary color to [color]
- Update the logo and brand name to [name]
- Modify the typography to use [font family]
- Adjust the spacing system to [specifications]
- Update the copy and messaging for [brand voice]

```

## 🚀 Success Metrics

The implementation is successful when:
- ✅ All three role themes switch smoothly
- ✅ Components are fully responsive on all devices
- ✅ Accessibility standards are met (WCAG 2.1 AA)
- ✅ Authentication flow works seamlessly
- ✅ Landing page is conversion-optimized
- ✅ Code is TypeScript compliant with no errors
- ✅ Build process completes successfully
- ✅ Performance is optimized for production

## 📞 Support

If you encounter any issues during implementation:
1. Check the component examples in the design system documentation
2. Verify that CSS custom properties are properly configured
3. Ensure Mantine theme integration is complete
4. Test theme switching functionality
5. Validate responsive design on multiple devices

This replication system has been tested and refined to produce consistent, high-quality results across different projects and use cases.
```
