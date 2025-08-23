import React from 'react';
import type { LucideIcon } from 'lucide-react';

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
    primary: 'gradient-primary text-white hover:shadow-gradient-primary hover:-translate-y-0.5 active:translate-y-0 shadow-sm',
    secondary: 'bg-white border-2 border-orange-500 text-orange-600 hover:gradient-primary hover:text-white hover:shadow-gradient-primary hover:-translate-y-0.5 transition-all duration-200',
    ghost: 'bg-transparent text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:scale-105 active:scale-95',
    destructive: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
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