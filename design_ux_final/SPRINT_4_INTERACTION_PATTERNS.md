# Sprint 4: Interaction Patterns - Final Implementation

## 🎯 Sprint Goal
Implement the complete interaction system with exact animation timings, hover effects, focus states, loading patterns, and micro-interactions that create the polished, responsive user experience that defines Elimu Smart.

## ⚡ Animation System Foundation (EXACT VALUES)

### Transition Timing Standards (NEVER CHANGE THESE)
```css
/* Animation timing system - EXACT VALUES */
:root {
  --transition-fast: 150ms;      /* Immediate feedback (buttons, hover states) */
  --transition-normal: 200ms;    /* Standard interactions (cards, inputs) */
  --transition-slow: 300ms;      /* Complex animations (modals, drawers) */
  --transition-extra-slow: 500ms; /* Page transitions, major state changes */
  
  /* Easing functions - EXACT CUBIC-BEZIER VALUES */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* Natural deceleration */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* Smooth both ways */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Playful bounce */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Spring effect */
}

/* Universal transition base class */
.transition-base {
  transition: all var(--transition-normal) var(--ease-out);
}

/* Specific transition classes */
.transition-fast {
  transition: all var(--transition-fast) var(--ease-out);
}

.transition-slow {
  transition: all var(--transition-slow) var(--ease-out);
}

.transition-colors {
  transition: color var(--transition-normal) var(--ease-out),
              background-color var(--transition-normal) var(--ease-out),
              border-color var(--transition-normal) var(--ease-out);
}

.transition-transform {
  transition: transform var(--transition-normal) var(--ease-out);
}

.transition-shadow {
  transition: box-shadow var(--transition-normal) var(--ease-out);
}
```

### Core Animation Classes (EXACT IMPLEMENTATIONS)
```css
/* Hover effects - EXACT transforms and shadows */
.hover-lift {
  transition: transform var(--transition-normal) var(--ease-out), 
              box-shadow var(--transition-normal) var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.hover-lift-subtle {
  transition: transform var(--transition-normal) var(--ease-out);
}

.hover-lift-subtle:hover {
  transform: translateY(-1px);
}

.hover-scale {
  transition: transform var(--transition-normal) var(--ease-out);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-scale-icon {
  transition: transform var(--transition-fast) var(--ease-out);
}

.hover-scale-icon:hover {
  transform: scale(1.1);
}

/* Focus states - EXACT ring styles */
.focus-ring {
  focus:outline-none;
  focus:ring-2;
  focus:ring-primary/50;
  focus:ring-offset-2;
}

.focus-ring-inset {
  focus:outline-none;
  focus:ring-2;
  focus:ring-primary/50;
  focus:ring-inset;
}

/* Loading animations */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

/* Entrance animations */
.animate-in {
  animation-duration: 300ms;
  animation-timing-function: var(--ease-out);
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-in-from-top {
  animation-name: slideInFromTop;
}

@keyframes slideInFromTop {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-from-bottom {
  animation-name: slideInFromBottom;
}

@keyframes slideInFromBottom {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-from-left {
  animation-name: slideInFromLeft;
}

@keyframes slideInFromLeft {
  from { 
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-from-right {
  animation-name: slideInFromRight;
}

@keyframes slideInFromRight {
  from { 
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.zoom-in {
  animation-name: zoomIn;
}

@keyframes zoomIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## 🔘 Button Interaction Patterns (EXACT IMPLEMENTATIONS)

### Enhanced Button Component with Exact Interactions
```tsx
// components/ui/InteractiveButton.tsx - EXACT IMPLEMENTATION
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  // Base classes - NEVER CHANGE THESE
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden';
  
  // Variant-specific styling with EXACT hover effects
  const variantClasses = {
    primary: `
      gradient-primary text-white shadow-sm
      transition-all duration-200 ease-out
      hover:shadow-lg hover:-translate-y-0.5
      active:translate-y-0 active:shadow-sm
      ${isPressed ? 'scale-95' : ''}
    `,
    secondary: `
      bg-white border-2 border-primary text-primary
      transition-all duration-200 ease-out
      hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0 active:scale-95
      ${isPressed ? 'scale-95' : ''}
    `,
    ghost: `
      bg-transparent text-primary
      transition-all duration-150 ease-out
      hover:bg-primary/10 hover:scale-105
      active:scale-95
      ${isPressed ? 'scale-95' : ''}
    `,
    destructive: `
      bg-destructive text-destructive-foreground shadow-sm
      transition-all duration-200 ease-out
      hover:bg-destructive/90 hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0 active:shadow-sm
      ${isPressed ? 'scale-95' : ''}
    `
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
  
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    onMouseDown?.(e);
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseUp?.(e);
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseLeave?.(e);
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
      
      {/* Button content */}
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} shrink-0 transition-transform duration-200 ${
              variant === 'ghost' ? 'group-hover:scale-110' : ''
            }`} />
          )}
          <span className="relative z-10">{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} shrink-0 transition-transform duration-200 ${
              variant === 'ghost' ? 'group-hover:scale-110' : ''
            }`} />
          )}
        </>
      )}
    </button>
  );
};

export default InteractiveButton;
```

### Loading Button States (EXACT IMPLEMENTATIONS)
```tsx
// Loading button with exact animation and state management
const LoadingButton: React.FC<{
  loading: boolean; 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  loadingText?: string;
}> = ({ 
  loading, 
  children,
  variant = 'primary',
  loadingText = 'Loading...'
}) => {
  return (
    <InteractiveButton
      variant={variant}
      disabled={loading}
      className={`
        transition-all duration-200
        ${loading ? 'cursor-wait' : ''}
      `}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {loading ? loadingText : children}
    </InteractiveButton>
  );
};

// Progress button with exact progress indication
const ProgressButton: React.FC<{
  progress: number;
  children: React.ReactNode;
  onComplete?: () => void;
}> = ({ progress, children, onComplete }) => {
  const isComplete = progress >= 100;
  
  React.useEffect(() => {
    if (isComplete && onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);
  
  return (
    <InteractiveButton
      variant={isComplete ? 'secondary' : 'primary'}
      className="relative overflow-hidden"
    >
      {/* Progress background */}
      <div 
        className="absolute inset-0 bg-white/20 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      
      {/* Button content */}
      <span className="relative z-10">
        {isComplete ? 'Complete!' : children}
      </span>
    </InteractiveButton>
  );
};
```

## 🃏 Card Interaction Patterns (EXACT IMPLEMENTATIONS)

### Enhanced Card Component with Exact Hover Behaviors
```tsx
// components/ui/InteractiveCard.tsx - EXACT IMPLEMENTATION
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Base card styling - NEVER CHANGE THESE VALUES
  const baseClasses = 'bg-card rounded-lg transition-all duration-200 ease-out';
  
  // Variant styling
  const variantClasses = {
    default: 'border border-border shadow-sm',
    elevated: 'shadow-md border-0',
    outlined: 'border-2 border-border shadow-none'
  };
  
  // Padding variants - EXACT SPACING
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',  // DEFAULT - Most commonly used
    lg: 'p-8'
  };
  
  // Interactive states - EXACT HOVER EFFECTS
  const getInteractiveClasses = () => {
    if (!hover && !clickable) return '';
    
    let classes = '';
    
    if (isHovered) {
      classes += ' shadow-lg -translate-y-1';
      if (variant === 'outlined') {
        classes += ' border-primary/50';
      }
    }
    
    if (isPressed && clickable) {
      classes += ' scale-98 translate-y-0';
    }
    
    return classes;
  };
  
  const clickableClasses = clickable ? 'cursor-pointer select-none' : '';
  
  return (
    <div
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${paddingClasses[padding]} 
        ${getInteractiveClasses()}
        ${clickableClasses} 
        ${className}
        group
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => clickable && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
};

// Feature card with exact icon animation
const FeatureCard: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}> = ({ icon: Icon, title, description, href, badge }) => {
  return (
    <InteractiveCard hover={true} clickable={!!href} onClick={() => href && window.location.href = href}>
      <div className="text-center space-y-4">
        
        {/* Badge - if present */}
        {badge && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {badge}
          </div>
        )}
        
        {/* Icon with exact animation */}
        <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
          <Icon className="h-8 w-8 text-primary transform group-hover:scale-110 transition-transform duration-200" />
        </div>
        
        {/* Content with exact typography */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        {/* CTA with exact slide animation */}
        {href && (
          <div className="flex items-center justify-center text-primary font-medium">
            <span>Learn More</span>
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        )}
      </div>
    </InteractiveCard>
  );
};

// Dashboard metric card with exact number animation
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}> = ({ title, value, change, trend = 'neutral', icon: Icon }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseInt(value) : value;
  
  React.useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60; // 60fps
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setAnimatedValue(numericValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [numericValue]);
  
  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };
  
  return (
    <InteractiveCard hover={true}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground">
            {typeof value === 'string' && value.includes('%') 
              ? `${animatedValue}%` 
              : animatedValue
            }
          </p>
          {change && (
            <p className={`text-sm ${trendColors[trend]}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
          <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
        </div>
      </div>
    </InteractiveCard>
  );
};

export { InteractiveCard, FeatureCard, MetricCard };
```

## 📝 Form Interaction Patterns (EXACT IMPLEMENTATIONS)

### Enhanced Input with Exact Focus and Validation Behaviors
```tsx
// components/ui/InteractiveInput.tsx - EXACT IMPLEMENTATION
import React, { useState, useRef } from 'react';
import { LucideIcon, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface InteractiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helper?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'filled' | 'borderless';
  showPasswordToggle?: boolean;
}

const InteractiveInput: React.FC<InteractiveInputProps> = ({
  label,
  error,
  success = false,
  helper,
  icon: Icon,
  variant = 'default',
  showPasswordToggle = false,
  type: initialType = 'text',
  className = '',
  onFocus,
  onBlur,
  onChange,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const inputType = showPasswordToggle && initialType === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : initialType;
  
  // Base input styling - EXACT BORDER AND FOCUS STYLES
  const baseClasses = 'w-full px-3 py-2 text-base transition-all duration-200 focus:outline-none';
  
  // Variant-specific styling
  const variantClasses = {
    default: 'bg-background border border-border rounded-lg',
    filled: 'bg-muted border border-transparent rounded-lg focus:bg-background',
    borderless: 'bg-transparent border-0 border-b-2 border-border rounded-none'
  };
  
  // State-based styling with exact focus ring
  const getStateClasses = () => {
    if (error) {
      return 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20';
    }
    if (success) {
      return 'border-success focus:border-success focus:ring-2 focus:ring-success/20';
    }
    return 'focus:border-primary focus:ring-2 focus:ring-primary/20';
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          className={`
            block text-sm font-medium transition-colors duration-200
            ${isFocused ? 'text-primary' : 'text-foreground'}
            ${error ? 'text-destructive' : ''}
          `}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <div className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200
            ${isFocused ? 'text-primary' : 'text-muted-foreground'}
            ${error ? 'text-destructive' : ''}
          `}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={inputRef}
          type={inputType}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${getStateClasses()}
            ${Icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          {...props}
        />
        
        {/* Right icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Password toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {/* Status icons */}
          {error ? (
            <AlertCircle className="h-4 w-4 text-destructive animate-in zoom-in-50 duration-200" />
          ) : success ? (
            <CheckCircle className="h-4 w-4 text-success animate-in zoom-in-50 duration-200" />
          ) : null}
        </div>
        
        {/* Animated border for borderless variant */}
        {variant === 'borderless' && (
          <div className={`
            absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-transform duration-200
            ${isFocused ? 'scale-x-100' : 'scale-x-0'}
          `} />
        )}
      </div>
      
      {/* Error message with slide animation */}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {helper && !error && (
        <p className="text-sm text-muted-foreground">{helper}</p>
      )}
    </div>
  );
};

export default InteractiveInput;
```

### Real-time Validation with Exact Animation
```tsx
// Real-time validation component with exact timing
const ValidatedInput: React.FC<{
  label: string;
  value: string;
  validate: (value: string) => string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
}> = ({ label, value, validate, onChange, placeholder, icon }) => {
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationTimer, setValidationTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    // Clear existing timer
    if (validationTimer) {
      clearTimeout(validationTimer);
    }
    
    // Set new timer for delayed validation
    const timer = setTimeout(() => {
      if (newValue.length > 0) {
        setShowValidation(true);
        const validationError = validate(newValue);
        setError(validationError);
      } else {
        setShowValidation(false);
        setError(null);
      }
    }, 500); // 500ms delay for better UX
    
    setValidationTimer(timer);
  };
  
  const handleBlur = () => {
    if (value.length > 0) {
      setShowValidation(true);
      const validationError = validate(value);
      setError(validationError);
    }
  };
  
  return (
    <InteractiveInput
      label={label}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
      icon={icon}
      error={showValidation ? error || undefined : undefined}
      success={showValidation && !error && value.length > 0}
    />
  );
};
```

## 🔄 Loading States (EXACT IMPLEMENTATIONS)

### Page Loading with Brand Elements
```tsx
// components/PageLoading.tsx - EXACT IMPLEMENTATION
import React from 'react';
import { GraduationCap } from 'lucide-react';

interface PageLoadingProps {
  message?: string;
  progress?: number;
}

const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = "Loading Elimu Smart...",
  progress 
}) => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center">
      <div className="text-center space-y-6 max-w-sm mx-auto px-4">
        
        {/* Logo with exact pulse animation */}
        <div className="h-16 w-16 gradient-primary rounded-xl flex items-center justify-center mx-auto animate-pulse">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          <p className="text-muted-foreground">Preparing your career guidance experience...</p>
        </div>
        
        {/* Progress bar with exact animation */}
        <div className="w-64 h-2 bg-border rounded-full overflow-hidden">
          {progress !== undefined ? (
            <div 
              className="h-full gradient-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          ) : (
            <div className="h-full gradient-primary animate-loading-bar" />
          )}
        </div>
        
        {progress !== undefined && (
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        )}
      </div>
    </div>
  );
};

// Loading bar animation keyframes
const loadingBarKeyframes = `
  @keyframes loading-bar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }

  .animate-loading-bar {
    animation: loading-bar 2s ease-in-out infinite;
  }
`;

export default PageLoading;
```

### Component Loading States (EXACT PATTERNS)
```tsx
// Skeleton loading components with exact animations
const CardSkeleton: React.FC<{
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
}> = ({ 
  showHeader = true, 
  showFooter = true, 
  lines = 3 
}) => {
  return (
    <Card padding="md">
      <div className="animate-pulse space-y-4">
        
        {/* Header skeleton */}
        {showHeader && (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        )}
        
        {/* Content skeleton */}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index}
              className="h-4 bg-muted rounded"
              style={{ 
                width: index === lines - 1 ? '60%' : '100%' 
              }}
            />
          ))}
        </div>
        
        {/* Footer skeleton */}
        {showFooter && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-20" />
          </div>
        )}
      </div>
    </Card>
  );
};

// List loading with exact staggered animation
const ListSkeleton: React.FC<{
  count: number;
  showAvatar?: boolean;
}> = ({ count, showAvatar = true }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse p-4 bg-card border border-border rounded-lg"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationDuration: '2s'
          }}
        >
          <div className="flex items-center space-x-4">
            {showAvatar && (
              <div className="h-12 w-12 bg-muted rounded-full" />
            )}
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="h-6 bg-muted rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Button loading state with exact spinner
const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-6 w-6'
  };
  
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
  );
};

export { CardSkeleton, ListSkeleton, LoadingSpinner };
```

## 🎯 Micro-Interactions (EXACT IMPLEMENTATIONS)

### Toast Notifications with Exact Slide Animation
```tsx
// components/Toast.tsx - EXACT IMPLEMENTATION
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(dismissTimer);
  }, [duration]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match exit animation duration
  };
  
  const typeConfig = {
    success: {
      icon: CheckCircle,
      classes: 'bg-success text-success-foreground',
      borderClass: 'border-success/20'
    },
    error: {
      icon: AlertCircle,
      classes: 'bg-destructive text-destructive-foreground',
      borderClass: 'border-destructive/20'
    },
    warning: {
      icon: AlertCircle,
      classes: 'bg-warning text-warning-foreground',
      borderClass: 'border-warning/20'
    },
    info: {
      icon: Info,
      classes: 'bg-info text-info-foreground',
      borderClass: 'border-info/20'
    }
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <div
      className={`
        ${config.classes} ${config.borderClass}
        p-4 rounded-lg shadow-lg border max-w-md
        flex items-center space-x-3
        transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="opacity-70 hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast container with exact positioning
const ToastContainer: React.FC<{
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>;
  onRemoveToast: (id: string) => void;
}> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 8}px)`,
            zIndex: toasts.length - index
          }}
        >
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
```

### Progress Feedback with Exact Animations
```tsx
// Progress components with exact animations
const ProgressBar: React.FC<{
  progress: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
}> = ({ 
  progress, 
  label, 
  showPercentage = true,
  variant = 'default',
  animated = true
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);
  
  const variantClasses = {
    default: 'gradient-primary',
    success: 'gradient-success', 
    warning: 'gradient-warning',
    danger: 'bg-destructive'
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">{label}</span>
          {showPercentage && (
            <span className="text-primary font-medium">{progress}%</span>
          )}
        </div>
      )}
      
      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${variantClasses[variant]} transition-all duration-500 ease-out`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  );
};

// Circular progress with exact SVG animation
const CircularProgress: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  showPercentage = true
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);
  
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-foreground">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
};

export { ProgressBar, CircularProgress };
```

## ✅ Interaction Implementation Checklist

### Core Animations (MUST IMPLEMENT ALL)
- [ ] Button hover effects with exact transform values (-translate-y-0.5, scale-95)
- [ ] Card hover states with shadow and lift effects (hover:shadow-lg hover:-translate-y-1)
- [ ] Input focus states with ring animations (focus:ring-2 focus:ring-primary/20)
- [ ] Loading animations (spin: 1s linear infinite, pulse: 2s cubic-bezier infinite)
- [ ] Page transition loading states with progress bars
- [ ] Success/error feedback with slide animations (animate-in slide-in-from-top-1)
- [ ] Progress bars with smooth fill animations (transition-all duration-500)
- [ ] Navigation active states with indicators

### Timing Requirements (MUST VALIDATE ALL)
- [ ] Fast interactions use 150ms duration (hover states, button presses)
- [ ] Standard interactions use 200ms duration (cards, inputs, general hover)
- [ ] Complex interactions use 300ms duration (modals, drawers, toast exit)
- [ ] Page transitions use 500ms duration (progress bars, major state changes)
- [ ] All animations use cubic-bezier(0.16, 1, 0.3, 1) easing function
- [ ] Loading states provide continuous feedback without jarring
- [ ] Micro-interactions feel immediate and responsive (< 100ms perceived delay)
- [ ] Animation delays create natural sequences (100ms stagger for lists)

### Accessibility Compliance (MUST TEST ALL)
- [ ] Focus states are clearly visible (2px ring, primary color, 50% opacity)
- [ ] Keyboard navigation works with all animations
- [ ] Reduced motion preference is respected (@media (prefers-reduced-motion: reduce))
- [ ] Color changes maintain contrast ratios (WCAG AA 4.5:1 minimum)
- [ ] Loading states announce progress to screen readers (aria-live regions)
- [ ] Interactive elements have proper ARIA labels and states
- [ ] Animation durations don't cause seizures (< 3 flashes per second)
- [ ] Focus management during state changes (focus trapping in modals)

### Performance Requirements (MUST OPTIMIZE)
- [ ] Animations use transform and opacity for hardware acceleration
- [ ] No layout thrashing during animations (avoid animating width/height)
- [ ] Debounced validation with 500ms delay for input fields
- [ ] Efficient re-renders using React.memo for animated components
- [ ] CSS animations preferred over JavaScript for simple effects
- [ ] Intersection Observer for scroll-triggered animations
- [ ] Animation cleanup on component unmount
- [ ] Frame rate monitoring in development (60fps target)

This interaction system ensures the interface feels polished, responsive, and professional while maintaining accessibility standards and optimal performance across all devices and user preferences.