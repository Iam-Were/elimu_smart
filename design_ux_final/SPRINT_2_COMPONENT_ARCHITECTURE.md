# Sprint 2: Component Architecture - Final Implementation

## 🎯 Sprint Goal
Implement the complete component architecture with exact styling patterns, interaction behaviors, and composition rules that create the recognizable Elimu Smart interface experience.

## 📋 Universal Component DNA (EXACT PATTERN)

### Base Component Template (MANDATORY STRUCTURE)
```tsx
// EVERY Elimu Smart component MUST follow this exact structure
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  className = '',
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  ...props
}) => {
  // MANDATORY: Base classes that EVERY component must have
  const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50';
  
  // MANDATORY: Variant classes - EXACT styling for each variant
  const variantClasses = {
    default: 'bg-white border border-border text-foreground',
    primary: 'gradient-primary text-primary-foreground hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
    ghost: 'bg-transparent text-primary hover:bg-primary/10'
  };
  
  // MANDATORY: Size classes - EXACT spacing for each size
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg'
  };
  
  // MANDATORY: State classes - EXACT styling for each state
  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    loading: 'cursor-wait'
  };
  
  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? stateClasses.disabled : ''}
        ${loading ? stateClasses.loading : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </div>
  );
};
```

## 🔘 Button Component (EXACT IMPLEMENTATION)

### Complete Button Implementation
```tsx
// components/ui/Button.tsx - EXACT IMPLEMENTATION
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes - NEVER CHANGE THESE
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none';
  
  // Variant-specific styling - EXACT GRADIENTS AND COLORS
  const variantClasses = {
    primary: 'gradient-primary text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-sm',
    secondary: 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 hover:scale-105 active:scale-95',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md'
  };
  
  // Size-specific spacing - EXACT PIXEL VALUES
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
    md: 'h-10 px-4 text-base rounded-lg gap-2',
    lg: 'h-12 px-6 text-lg rounded-lg gap-2.5'
  };
  
  // Icon size mapping
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} shrink-0`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} shrink-0`} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
```

### Button Usage Examples (EXACT PATTERNS)
```tsx
import { Plus, ArrowLeft, Settings, Download } from 'lucide-react';

// Primary CTA - MOST IMPORTANT ACTIONS
<Button variant="primary" size="lg" icon={Plus}>
  Get Started
</Button>

// Secondary Action - SUPPORTING ACTIONS  
<Button variant="secondary" size="md" icon={ArrowLeft}>
  Back
</Button>

// Ghost Button - SUBTLE ACTIONS
<Button variant="ghost" size="sm" icon={Settings}>
  Settings
</Button>

// Loading State - PROCESSING ACTIONS
<Button variant="primary" loading={true}>
  Creating Account...
</Button>

// Icon Right Position
<Button variant="secondary" icon={Download} iconPosition="right">
  Download Report
</Button>
```

## 🃏 Card Component (EXACT IMPLEMENTATION)

### Complete Card System
```tsx
// components/ui/Card.tsx - EXACT IMPLEMENTATION
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick
}) => {
  // Base card styling - NEVER CHANGE THESE VALUES
  const baseClasses = 'bg-card border border-border rounded-lg shadow-sm';
  
  // Padding variants - EXACT SPACING
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',  // DEFAULT - Most commonly used
    lg: 'p-8'
  };
  
  // Interactive states - EXACT HOVER EFFECTS
  const interactiveClasses = hover || clickable ? 
    'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5' : '';
  
  const clickableClasses = clickable ? 'cursor-pointer group' : '';
  
  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${interactiveClasses} ${clickableClasses} ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
};

// Card Header Component - EXACT PATTERN
interface CardHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  action,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action && action}
    </div>
  );
};

// Card Content Component - EXACT PATTERN
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

// Card Footer Component - EXACT PATTERN
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between mt-4 pt-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
```

### Card Implementation Examples (EXACT PATTERNS)
```tsx
import { Target, MoreVertical, CheckCircle, ArrowRight, Zap } from 'lucide-react';

// Dashboard Widget Card - MOST COMMON PATTERN
<Card hover={true} padding="md">
  <CardHeader
    icon={Target}
    title="Career Assessment"
    subtitle="Complete your profile"
    action={
      <Button variant="ghost" size="sm" icon={MoreVertical} />
    }
  />
  
  <CardContent>
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">Progress</span>
      <span className="text-sm font-medium text-primary">75%</span>
    </div>
    <div className="w-full bg-muted rounded-full h-2">
      <div className="gradient-primary h-2 rounded-full w-3/4"></div>
    </div>
  </CardContent>
  
  <CardFooter>
    <span className="text-sm text-muted-foreground">3 questions left</span>
    <Button variant="primary" size="sm">Continue</Button>
  </CardFooter>
</Card>

// Feature Card - MARKETING/LANDING PAGES
<Card hover={true} clickable={true} onClick={() => console.log('Feature clicked')}>
  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center mb-4">
    <Zap className="h-12 w-12 text-primary" />
  </div>
  
  <h3 className="font-semibold text-card-foreground mb-2">AI Career Matching</h3>
  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
    Advanced algorithms analyze your interests, skills, and goals to recommend perfect career paths.
  </p>
  
  <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
    <span>Learn More</span>
    <ArrowRight className="ml-2 h-4 w-4" />
  </div>
</Card>

// Stats Card - DASHBOARD METRICS
<Card>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Assessment Progress</p>
      <p className="text-2xl font-semibold text-card-foreground">85%</p>
      <p className="text-sm text-success">+15% this month</p>
    </div>
    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
      <Target className="h-6 w-6 text-primary" />
    </div>
  </div>
</Card>
```

## 📝 Form Component System (EXACT IMPLEMENTATION)

### Input Field Implementation
```tsx
// components/ui/Input.tsx - EXACT IMPLEMENTATION
import React, { useState } from 'react';
import { LucideIcon, AlertCircle, CheckCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'filled' | 'borderless';
  success?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon: Icon,
  variant = 'default',
  success = false,
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Base input styling - EXACT BORDER AND FOCUS STYLES
  const baseClasses = 'w-full px-3 py-2 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50';
  
  // Variant-specific styling
  const variantClasses = {
    default: 'bg-background border border-border rounded-lg focus:border-primary',
    filled: 'bg-muted border border-transparent rounded-lg focus:border-primary focus:bg-background',
    borderless: 'bg-transparent border-0 border-b-2 border-border rounded-none focus:border-primary'
  };
  
  // State-based styling
  const stateClasses = error 
    ? 'border-destructive focus:border-destructive focus:ring-destructive/50' 
    : success 
      ? 'border-success focus:border-success focus:ring-success/50'
      : '';
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused ? 'text-primary' : 'text-foreground'
        } ${error ? 'text-destructive' : ''}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        
        <input
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${stateClasses}
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {/* Status icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {error ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : success ? (
            <CheckCircle className="h-4 w-4 text-success" />
          ) : null}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-muted-foreground">{helper}</p>
      )}
    </div>
  );
};

export default Input;
```

### Select Component Implementation
```tsx
// components/ui/Select.tsx - EXACT IMPLEMENTATION
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused ? 'text-primary' : 'text-foreground'
        } ${error ? 'text-destructive' : ''}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          className={`
            w-full px-3 py-2 text-base text-left bg-background border border-border rounded-lg
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        >
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    w-full px-3 py-2 text-left text-base transition-colors duration-150
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'}
                    ${value === option.value ? 'bg-primary text-primary-foreground' : 'text-popover-foreground'}
                  `}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
```

### Form Layout Pattern (EXACT STRUCTURE)
```tsx
// Standard form layout - USE THIS STRUCTURE ALWAYS
const FormExample = () => {
  return (
    <form className="space-y-6 max-w-md mx-auto">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Create Account</h2>
        <p className="text-muted-foreground">Join Elimu Smart today</p>
      </div>
      
      {/* Form Fields - EXACT SPACING */}
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          icon={User}
          required
        />
        
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          required
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          icon={Lock}
          helper="Must be at least 8 characters long"
          required
        />
        
        <Select
          label="Role"
          placeholder="Select your role"
          options={[
            { value: 'student', label: 'Student' },
            { value: 'counselor', label: 'Counselor' },
            { value: 'admin', label: 'Administrator' }
          ]}
          required
        />
      </div>
      
      {/* Form Actions - EXACT BUTTON LAYOUT */}
      <div className="space-y-3">
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Create Account
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button type="button" className="text-primary hover:underline font-medium">
            Sign in here
          </button>
        </div>
      </div>
    </form>
  );
};
```

## 🗂️ Navigation Components (EXACT IMPLEMENTATION)

### Header Navigation Pattern
```tsx
// components/Header.tsx - EXACT IMPLEMENTATION
import React from 'react';
import { GraduationCap, Home, Briefcase, Target, MessageCircle, Bell, User, LogOut, Menu } from 'lucide-react';
import Button from './ui/Button';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuToggle }) => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section - EXACT STYLING */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Elimu Smart</h1>
              <p className="text-xs text-primary font-medium">Career Guidance</p>
            </div>
          </div>
          
          {/* Navigation Menu - EXACT ITEM SPACING */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem href="#dashboard" icon={Home} label="Dashboard" />
            <NavItem href="#careers" icon={Briefcase} label="Careers" />
            <NavItem href="#assessment" icon={Target} label="Assessment" />
            <NavItem href="#counselor" icon={MessageCircle} label="Counselor" />
          </nav>
          
          {/* User Actions - EXACT LAYOUT */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" icon={Bell} />
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <Button variant="ghost" size="sm" icon={LogOut} onClick={onLogout} />
              </div>
            ) : (
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" icon={Menu} onClick={onMenuToggle} />
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

// Navigation item component
interface NavItemProps {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive = false }) => {
  return (
    <a
      href={href}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
        transition-all duration-200 ease-out
        ${isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
        }
        group
      `}
    >
      <Icon className={`h-4 w-4 transform transition-transform duration-200 ${
        isActive ? '' : 'group-hover:scale-110'
      }`} />
      <span>{label}</span>
    </a>
  );
};

export default Header;
```

## ✅ Component Implementation Checklist

### Core Components (MUST IMPLEMENT ALL)
- [ ] Button component with exact variant styling and loading states
- [ ] Card component with hover effects and composition patterns
- [ ] Input component with error states, icons, and validation
- [ ] Select component with dropdown behavior and styling
- [ ] Header navigation with responsive behavior
- [ ] Form layouts with proper field grouping and spacing
- [ ] Loading states for all interactive components
- [ ] Focus management for accessibility

### Styling Requirements (MUST VALIDATE ALL)
- [ ] All components use CSS custom properties for colors
- [ ] Hover effects use exact transform values (hover:-translate-y-0.5)
- [ ] Focus rings use primary color with 50% opacity
- [ ] Border radius values match design system (rounded-lg = 10px)
- [ ] Typography uses system font weights (medium: 500, normal: 400)
- [ ] Transitions use 200ms duration for all animations
- [ ] Components adapt properly to role-based theming
- [ ] Dark mode variants work correctly

### Composition Requirements (MUST FOLLOW)
- [ ] Every component follows the Universal Component DNA pattern
- [ ] Card components use CardHeader, CardContent, CardFooter structure
- [ ] Forms use exact spacing patterns (space-y-4 for fields, space-y-6 for sections)
- [ ] Buttons include proper icon positioning and loading states
- [ ] Navigation items include hover and active state indicators
- [ ] All interactive elements have disabled and loading states
- [ ] Components accept className prop for customization
- [ ] TypeScript interfaces are properly defined with exact prop types

This component architecture ensures every interface element follows the established Elimu Smart design patterns, behaviors, and accessibility standards.