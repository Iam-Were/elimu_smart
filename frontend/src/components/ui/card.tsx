import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  gradient?: boolean;
  variant?: 'default' | 'featured' | 'success' | 'warning';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  gradient = false,
  variant = 'default',
  onClick,
  ...props
}) => {
  // Base card styling - NEVER CHANGE THESE VALUES
  const baseClasses = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm';
  
  // Padding variants - EXACT SPACING
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',  // DEFAULT - Most commonly used
    lg: 'p-8'
  };
  
  // Variant-specific styling
  const variantClasses = {
    default: gradient ? 'gradient-card-subtle' : '',
    featured: 'border-orange-200 dark:border-orange-800 gradient-card-subtle shadow-gradient-primary',
    success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10',
    warning: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
  };
  
  // Interactive states - EXACT HOVER EFFECTS
  const interactiveClasses = hover || clickable ? 
    'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5' : '';
  
  const clickableClasses = clickable ? 'cursor-pointer group' : '';
  
  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${variantClasses[variant]} ${interactiveClasses} ${clickableClasses} ${className}`}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component - FLEXIBLE PATTERN
interface CardHeaderProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  gradient?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  action,
  gradient = false,
  className = '',
  children
}) => {
  // If children are provided, use them directly (shadcn pattern)
  if (children) {
    return (
      <div className={`mb-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  // Otherwise use the original structured pattern
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${gradient ? 'gradient-primary' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
            <Icon className={`h-5 w-5 ${gradient ? 'text-white' : 'text-orange-600'}`} />
          </div>
        )}
        <div>
          <h3 className={`font-semibold ${gradient ? 'text-gradient-primary' : 'text-gray-900 dark:text-gray-100'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
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
    <div className={`flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

// Enhanced Stats Card Component
interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  gradient?: boolean;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  change,
  changeType = 'neutral',
  gradient = false,
  onClick
}) => {
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <Card hover={true} clickable={!!onClick} onClick={onClick} gradient={gradient}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${gradient ? 'text-gradient-primary' : 'text-gray-900 dark:text-gray-100'}`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
          gradient ? 'gradient-primary shadow-gradient-primary' : 'bg-orange-100 dark:bg-orange-900/30'
        }`}>
          <Icon className={`h-6 w-6 ${gradient ? 'text-white' : 'text-orange-600'}`} />
        </div>
      </div>
    </Card>
  );
};

// Additional shadcn-style components
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
};

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, StatsCard };