# Sprint 3: Layout Systems - Final Implementation

## 🎯 Sprint Goal
Implement the complete layout architecture with exact grid systems, spacing rules, responsive behavior, and page structure patterns that create consistent, professional interfaces across all Elimu Smart pages.

## 📐 Universal Layout Foundation (EXACT PATTERNS)

### Page Structure Template (MANDATORY STRUCTURE)
```tsx
// EVERY page in Elimu Smart MUST follow this exact structure
const UniversalPageLayout = ({ children, title, subtitle, breadcrumbs, actions }) => {
  return (
    <div className="min-h-screen bg-muted">
      {/* Navigation Header - ALWAYS at top */}
      <Header />
      
      {/* Page Header Section - CONDITIONAL but exact when present */}
      {(title || breadcrumbs) && (
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                {breadcrumbs && (
                  <Breadcrumbs items={breadcrumbs} />
                )}
                {title && (
                  <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="ml-4 flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content Area - EXACT container structure */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer - OPTIONAL for authenticated pages */}
      <Footer />
    </div>
  );
};
```

### Container System (EXACT MAX-WIDTHS)
```css
/* Container width system - NEVER use different values */
.container-sm   { max-width: 640px; }   /* Small content - forms, dialogs */
.container-md   { max-width: 768px; }   /* Medium content - articles, profiles */
.container-lg   { max-width: 1024px; }  /* Large content - dashboards */
.container-xl   { max-width: 1280px; }  /* Extra large content - main layouts */
.container-2xl  { max-width: 1536px; }  /* Maximum content - admin panels */

/* Standard container - MOST COMMONLY USED */
.container-standard {
  max-width: 1280px;  /* 7xl in Tailwind */
  margin: 0 auto;
  padding: 0 1rem;    /* 16px base padding */
}

/* Responsive container padding - EXACT VALUES */
@media (min-width: 640px) {
  .container-standard { padding: 0 1.5rem; }  /* 24px on tablet */
}

@media (min-width: 1024px) {
  .container-standard { padding: 0 2rem; }    /* 32px on desktop */
}
```

### App Layout Component (EXACT IMPLEMENTATION)
```tsx
// components/AppLayout.tsx - EXACT STRUCTURE
import React from 'react';
import { ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      {/* Page Header - EXACT STRUCTURE */}
      {(title || breadcrumbs) && (
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                {breadcrumbs && (
                  <nav className="flex mb-2" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                          {crumb.href ? (
                            <a 
                              href={crumb.href} 
                              className="hover:text-primary transition-colors font-medium"
                            >
                              {crumb.label}
                            </a>
                          ) : (
                            <span className="text-foreground font-medium">{crumb.label}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                
                {title && (
                  <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                )}
                
                {subtitle && (
                  <p className="text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              
              {actions && (
                <div className="ml-4 flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content - EXACT CONTAINER */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default AppLayout;
```

## 🗂️ Grid System Implementation (EXACT PATTERNS)

### Dashboard Grid Layout (EXACT IMPLEMENTATION)
```tsx
// Dashboard 3-column layout with sidebar - EXACT IMPLEMENTATION
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back to your career guidance center"
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="md" icon={Settings}>
            Settings
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            New Assessment
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats cards with exact spacing */}
            <StatsCard 
              title="Assessment Progress"
              value="85%"
              change="+15%"
              icon={Target}
              trend="up"
            />
            <StatsCard 
              title="Careers Explored"
              value="12"
              change="+3"
              icon={Briefcase}
              trend="up"
            />
            <StatsCard 
              title="Sessions Completed"
              value="8"
              change="+2"
              icon={MessageCircle}
              trend="up"
            />
          </div>
          
          {/* Main Dashboard Content */}
          <div className="space-y-6">
            {children}
          </div>
          
        </div>
        
        {/* Sidebar Area - 1/3 width on desktop */}
        <div className="space-y-6">
          <QuickActionsCard />
          <UpcomingEventsCard />
          <PerformanceSummaryCard />
        </div>
        
      </div>
    </AppLayout>
  );
};
```

### Feature Grid Layout (EXACT IMPLEMENTATION)
```tsx
// Landing page features - EXACT 3-column responsive grid
const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "AI Career Assessment",
      description: "Advanced psychometric testing powered by AI to identify your natural talents and interests."
    },
    {
      icon: BookOpen,
      title: "Subject Mapping",
      description: "Discover how your current subjects translate into specific career opportunities."
    },
    {
      icon: MessageCircle,
      title: "Expert Counseling",
      description: "Connect with certified career counselors for personalized guidance and support."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - EXACT SPACING */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Star className="h-4 w-4" />
            <span>Core Features</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
            Everything You Need for
            <span className="block text-transparent bg-clip-text gradient-primary">
              Career Success
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides students with AI-powered assessments, 
            expert guidance, and real-time market insights.
          </p>
        </div>
        
        {/* Features Grid - EXACT RESPONSIVE BEHAVIOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

// Feature Card Component - EXACT PATTERN
const FeatureCard: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => {
  return (
    <Card hover={true} padding="lg" className="group text-center">
      <div className="space-y-4">
        {/* Icon Container - EXACT SIZE AND STYLING */}
        <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
          <Icon className="h-8 w-8 text-primary transform group-hover:scale-110 transition-transform duration-200" />
        </div>
        
        {/* Feature Content - EXACT TEXT HIERARCHY */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* CTA Link - EXACT STYLING */}
        <div className="flex items-center justify-center text-primary font-medium">
          <span>Learn More</span>
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Card>
  );
};
```

### Form Layout System (EXACT PATTERNS)
```tsx
// Multi-column form layout - EXACT IMPLEMENTATION
const FormLayoutSystem: React.FC = () => {
  return (
    <AppLayout
      title="User Registration"
      subtitle="Create your Elimu Smart account"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Auth', href: '/auth' },
        { label: 'Register' }
      ]}
    >
      <Card padding="lg" className="max-w-4xl mx-auto">
        
        <form className="space-y-8">
          
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Basic information about yourself</p>
            </div>
            
            {/* Two-column grid - EXACT RESPONSIVE BEHAVIOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="First Name" 
                placeholder="Enter first name" 
                required 
              />
              <Input 
                label="Last Name" 
                placeholder="Enter last name" 
                required 
              />
            </div>
            
            {/* Single column for email */}
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            
            {/* Two-column grid for phone and date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Phone Number" 
                type="tel" 
                placeholder="+254 700 123 456" 
              />
              <Input 
                label="Date of Birth" 
                type="date" 
              />
            </div>
          </div>
          
          {/* Academic Information Section */}
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground">Academic Information</h3>
              <p className="text-sm text-muted-foreground">Your educational background</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Education Level" 
                placeholder="Select level"
                options={[
                  { value: 'form-4', label: 'Form 4 Student' },
                  { value: 'university', label: 'University Student' },
                  { value: 'graduate', label: 'Graduate' }
                ]}
                required 
              />
              
              <Input 
                label="School/Institution" 
                placeholder="Enter school name" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select 
                label="County" 
                placeholder="Select county"
                options={[
                  { value: 'nairobi', label: 'Nairobi' },
                  { value: 'mombasa', label: 'Mombasa' },
                  { value: 'kiambu', label: 'Kiambu' }
                ]}
              />
              
              <Input 
                label="Current Grade/Level" 
                placeholder="e.g., Form 4, Year 2" 
              />
              
              <Input 
                label="Expected Graduation" 
                type="month" 
              />
            </div>
          </div>
          
          {/* Form Actions - EXACT BUTTON LAYOUT */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Button variant="secondary" size="lg" className="sm:flex-1">
              Save as Draft
            </Button>
            <Button variant="primary" size="lg" className="sm:flex-1">
              Create Account
            </Button>
          </div>
          
        </form>
      </Card>
    </AppLayout>
  );
};
```

## 📏 Spacing System (EXACT VALUES)

### Spacing Scale Definition
```css
/* Elimu Smart spacing scale - NEVER use different values */
:root {
  --space-0: 0;           /* 0px - No spacing */
  --space-1: 0.25rem;     /* 4px - Tight spacing between related elements */
  --space-2: 0.5rem;      /* 8px - Icon-text gaps, small element spacing */
  --space-3: 0.75rem;     /* 12px - Small component internal spacing */
  --space-4: 1rem;        /* 16px - Standard element spacing, form fields */
  --space-5: 1.25rem;     /* 20px - Medium spacing between components */
  --space-6: 1.5rem;      /* 24px - Large element spacing, card sections */
  --space-8: 2rem;        /* 32px - Section spacing, major layout gaps */
  --space-10: 2.5rem;     /* 40px - Large section spacing */
  --space-12: 3rem;       /* 48px - Major section spacing */
  --space-16: 4rem;       /* 64px - Hero section spacing */
  --space-20: 5rem;       /* 80px - Page section spacing */
  --space-24: 6rem;       /* 96px - Large page sections */
  --space-32: 8rem;       /* 128px - Extra large spacing */
}
```

### Spacing Usage Rules (EXACT APPLICATIONS)
```typescript
// Component spacing patterns - EXACT IMPLEMENTATIONS
const SpacingPatterns = {
  // Icon-text combinations
  iconText: "space-x-2",           // 8px gap between icons and text
  
  // Navigation items
  navItems: "space-x-6",           // 24px gap for navigation items
  navItemsLarge: "space-x-8",      // 32px gap for main navigation
  
  // Button groups
  buttonGroups: "space-x-3",       // 12px gap between buttons
  buttonGroupsLarge: "space-x-4",  // 16px gap for primary button groups
  
  // Form elements
  formFields: "space-y-4",         // 16px vertical spacing between form fields
  formSections: "space-y-6",       // 24px between form sections
  formGroups: "space-y-8",         // 32px between major form groups
  
  // Card elements
  cardContent: "space-y-3",        // 12px between card content elements
  cardSections: "space-y-4",       // 16px between card sections
  cardMajorSections: "space-y-6",  // 24px between major card sections
  
  // Page layout
  pageContent: "space-y-8",        // 32px between page content sections
  majorSections: "space-y-12",     // 48px between major page sections
  heroSections: "space-y-16",      // 64px in hero areas
  
  // Grid gaps
  dashboardGrid: "gap-8",          // 32px gaps in dashboard grid
  featureGrid: "gap-6",            // 24px gaps in feature grids
  statsGrid: "gap-6",              // 24px gaps in stats grids
  formGrid: "gap-6",               // 24px gaps in form grids
  compactGrid: "gap-4",            // 16px gaps in compact layouts
  
  // Container padding
  containerPadding: "px-4 sm:px-6 lg:px-8",  // Responsive container padding
  sectionPadding: "py-8",          // Standard section padding
  majorSectionPadding: "py-12",    // Major section padding
  heroSectionPadding: "py-20 lg:py-28",  // Hero section padding
};
```

### Container and Padding Classes
```css
/* Standard container classes */
.container-standard {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container-standard { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container-standard { padding: 0 2rem; }
}

/* Section padding utilities */
.section-padding {
  padding-top: 2rem;    /* py-8 */
  padding-bottom: 2rem;
}

.section-padding-lg {
  padding-top: 3rem;    /* py-12 */
  padding-bottom: 3rem;
}

.section-padding-xl {
  padding-top: 5rem;    /* py-20 */
  padding-bottom: 5rem;
}

@media (min-width: 1024px) {
  .section-padding-xl {
    padding-top: 7rem;  /* lg:py-28 */
    padding-bottom: 7rem;
  }
}
```

## 📱 Responsive Layout Patterns (EXACT BREAKPOINTS)

### Breakpoint System
```css
/* Elimu Smart breakpoints - EXACT VALUES */
:root {
  --breakpoint-sm: 640px;    /* Small tablet - min-width for sm: */
  --breakpoint-md: 768px;    /* Large tablet - min-width for md: */
  --breakpoint-lg: 1024px;   /* Desktop - min-width for lg: */
  --breakpoint-xl: 1280px;   /* Large desktop - min-width for xl: */
  --breakpoint-2xl: 1536px;  /* Extra large desktop - min-width for 2xl: */
}

/* Mobile-first responsive approach - ALWAYS start with mobile */
/* Base styles apply to mobile (0px+) */
/* Then enhance for larger screens using min-width media queries */
```

### Responsive Grid Patterns (EXACT IMPLEMENTATIONS)
```tsx
// Dashboard responsive layout - EXACT BREAKPOINT BEHAVIOR
const ResponsiveDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 
        Mobile (0-1023px): 1 column - all content stacks vertically
        Desktop (1024px+): 3 columns - main content spans 2, sidebar spans 1
      */}
      
      {/* Main Content - 2/3 width on desktop, full width on mobile */}
      <div className="lg:col-span-2">
        <div className="space-y-8">
          
          {/* Stats Grid - Responsive columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/*
              Mobile (0-767px): 1 column
              Tablet (768-1023px): 2 columns  
              Desktop (1024px+): 3 columns
            */}
            <StatsCard />
            <StatsCard />
            <StatsCard />
          </div>
          
          {/* Content Cards */}
          <div className="space-y-6">
            <MainContentCard />
            <SecondaryContentCard />
          </div>
          
        </div>
      </div>
      
      {/* Sidebar - 1/3 width on desktop, full width on mobile */}
      <div className="space-y-6">
        <SidebarCard />
        <SidebarCard />
      </div>
    </div>
  );
};

// Feature grid responsive behavior - EXACT PATTERN
const ResponsiveFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/*
        Mobile (0-767px): 1 column - features stack vertically
        Tablet (768-1023px): 2 columns - side by side layout
        Desktop (1024px+): 3 columns - three across layout
      */}
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

// Form responsive layout - EXACT FIELD BEHAVIOR
const ResponsiveForm: React.FC = () => {
  return (
    <form className="space-y-8">
      
      {/* Full width fields - always single column */}
      <Input label="Email Address" type="email" />
      
      {/* Two column fields on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/*
          Mobile (0-767px): 1 column - fields stack
          Tablet+ (768px+): 2 columns - side by side
        */}
        <Input label="First Name" />
        <Input label="Last Name" />
      </div>
      
      {/* Three column fields on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*
          Mobile (0-639px): 1 column
          Small tablet (640-1023px): 2 columns
          Desktop (1024px+): 3 columns
        */}
        <Select label="County" options={counties} />
        <Input label="City" />
        <Input label="Postal Code" />
      </div>
      
      {/* Responsive button layout */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/*
          Mobile (0-639px): Buttons stack vertically
          Tablet+ (640px+): Buttons side by side
        */}
        <Button variant="secondary" className="sm:flex-1">
          Cancel
        </Button>
        <Button variant="primary" className="sm:flex-1">
          Submit
        </Button>
      </div>
      
    </form>
  );
};
```

### Mobile-Specific Layout Adaptations
```tsx
// Mobile navigation adaptations - EXACT RESPONSIVE BEHAVIOR
const MobileNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Desktop navigation - hidden on mobile */}
      <nav className="hidden lg:flex items-center space-x-8">
        <NavItem href="/dashboard" label="Dashboard" icon={Home} />
        <NavItem href="/careers" label="Careers" icon={Briefcase} />
        <NavItem href="/assessment" label="Assessment" icon={Target} />
        <NavItem href="/counselor" label="Counselor" icon={MessageCircle} />
      </nav>
      
      {/* Mobile menu button - shown on mobile only */}
      <div className="lg:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          icon={Menu}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>
      
      {/* Mobile menu overlay - full screen on mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="text-lg font-semibold">Menu</span>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={X}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            
            {/* Mobile navigation items */}
            <nav className="flex-1 p-6 space-y-4">
              <MobileNavItem href="/dashboard" label="Dashboard" icon={Home} />
              <MobileNavItem href="/careers" label="Careers" icon={Briefcase} />
              <MobileNavItem href="/assessment" label="Assessment" icon={Target} />
              <MobileNavItem href="/counselor" label="Counselor" icon={MessageCircle} />
            </nav>
            
          </div>
        </div>
      )}
    </>
  );
};

// Mobile navigation item - EXACT STYLING
const MobileNavItem: React.FC<{
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}> = ({ href, label, icon: Icon, isActive = false }) => {
  return (
    <a
      href={href}
      className={`
        flex items-center space-x-4 px-4 py-3 rounded-lg
        transition-colors duration-200
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-muted'
        }
      `}
    >
      <Icon className="h-6 w-6" />
      <span className="text-lg font-medium">{label}</span>
    </a>
  );
};
```

## 🏗️ Section Layout Patterns (EXACT IMPLEMENTATIONS)

### Hero Section Layout (EXACT STRUCTURE)
```tsx
// Landing page hero - EXACT RESPONSIVE STRUCTURE
const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-primary/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Column - EXACT TEXT HIERARCHY */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Career Guidance</span>
              </div>
              
              {/* Main Headline - EXACT RESPONSIVE TYPOGRAPHY */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                Discover Your
                <span className="block text-transparent bg-clip-text gradient-primary">
                  Perfect Career
                </span>
                Path
              </h1>
              
              {/* Subtitle - EXACT RESPONSIVE SIZE */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                AI-powered career guidance platform designed specifically for Kenyan students 
                to discover their ideal career paths.
              </p>
            </div>
            
            {/* CTA Buttons - EXACT RESPONSIVE LAYOUT */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Start Your Journey
              </Button>
              <Button variant="secondary" size="lg" icon={Play}>
                Watch Demo
              </Button>
            </div>
            
            {/* Social Proof - EXACT RESPONSIVE STATS */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-semibold text-foreground">10K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Students Guided</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-semibold text-foreground">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Career Paths</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-semibold text-foreground">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Visual Column - EXACT RESPONSIVE BEHAVIOR */}
          <div className="relative order-first lg:order-last">
            <Card padding="lg" className="relative z-10">
              <CardHeader
                icon={Target}
                title="Career Assessment Preview"
                subtitle="See how it works"
              />
              <CardContent>
                {/* Assessment preview content */}
              </CardContent>
            </Card>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl transform rotate-2 scale-105 -z-10"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
```

### Stats Section Layout (EXACT GRID BEHAVIOR)
```tsx
// Dashboard stats overview - EXACT RESPONSIVE GRID
const StatsSection: React.FC = () => {
  const stats = [
    { label: "Assessment Progress", value: "85%", change: "+15%", icon: Target },
    { label: "Careers Explored", value: "12", change: "+3", icon: Briefcase },
    { label: "Sessions Completed", value: "8", change: "+2", icon: MessageCircle },
    { label: "Goals Achieved", value: "6", change: "+1", icon: CheckCircle }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/*
        Mobile (0-639px): 1 column - all stats stack
        Tablet (640-1023px): 2 columns - 2x2 grid
        Desktop (1024px+): 4 columns - all in a row
      */}
      {stats.map((stat, index) => (
        <Card key={index} padding="md" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-success">{stat.change} from last month</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
```

## ✅ Layout Implementation Checklist

### Core Layout Patterns (MUST IMPLEMENT ALL)
- [ ] Universal page structure with AppLayout wrapper
- [ ] Dashboard 3-column grid (lg:grid-cols-3 with lg:col-span-2 main area)
- [ ] Feature grid with 1-2-3 column responsive behavior (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- [ ] Form layouts with proper field grouping and responsive columns
- [ ] Hero section with content/visual split (grid-cols-1 lg:grid-cols-2)
- [ ] Stats overview with 4-column responsive grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
- [ ] Mobile navigation with overlay menu
- [ ] Responsive button layouts (flex-col sm:flex-row)

### Spacing Requirements (MUST VALIDATE ALL)
- [ ] Container padding uses exact responsive values (px-4 sm:px-6 lg:px-8)
- [ ] Grid gaps use specified values (gap-4, gap-6, gap-8)
- [ ] Section spacing uses space-y-8 for major sections
- [ ] Form field spacing uses space-y-4 pattern
- [ ] Form section spacing uses space-y-6 pattern
- [ ] Icon-text spacing uses space-x-2 pattern
- [ ] Navigation item spacing uses space-x-8 pattern
- [ ] Card content spacing uses space-y-4 pattern

### Responsive Behavior (MUST TEST ALL)
- [ ] All grids collapse properly at specified breakpoints
- [ ] Text sizing adapts correctly (text-4xl sm:text-5xl lg:text-6xl pattern)
- [ ] Button layouts stack on mobile (flex-col sm:flex-row)
- [ ] Navigation hides/shows at correct breakpoints (hidden lg:flex, lg:hidden)
- [ ] Container padding adjusts at each breakpoint
- [ ] Grid columns adapt at specified breakpoints (exact column counts)
- [ ] Hero content/visual layout switches properly (order-first lg:order-last)
- [ ] Dashboard sidebar moves below content on mobile (lg:col-span-2 structure)

### Container Requirements (MUST FOLLOW)
- [ ] All pages use max-w-7xl mx-auto container
- [ ] Responsive padding follows px-4 sm:px-6 lg:px-8 pattern
- [ ] Section spacing uses py-8 for standard, py-20 lg:py-28 for hero
- [ ] Content areas respect max-width constraints
- [ ] Nested containers don't exceed parent constraints
- [ ] Mobile layouts remain usable on 320px width
- [ ] Desktop layouts work up to 1536px width
- [ ] All content remains accessible on touch devices

This layout system ensures every page maintains the professional, organized structure that defines the Elimu Smart user experience across all devices and screen sizes.