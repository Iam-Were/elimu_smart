// Sprint 15: Icon Intelligence System - Universal Component DNA Integration
// @ts-nocheck
import React from 'react';
import {
  // Progress & Achievement Icons
  ClipboardCheck, BarChart3, Flame, Trophy, Target, Flag, Clock, Map,
  
  // Learning & Education Icons
  BookOpen, GraduationCap, PenTool, Library, MessageSquare, Lightbulb,
  
  // Communication & Social Icons
  Mail, Bell, Users, HelpCircle, MessageCircle, Phone,
  
  // Action & Navigation Icons
  Search, Home, Settings, User, Plus, ArrowRight, ChevronRight,
  
  // Status & System Icons
  CheckCircle, AlertTriangle, Info, Star, Heart, Eye,
  
  // Professional & Career Icons
  Building, Briefcase, Compass, Calendar, FileText,
  
  // Interface & Utility Icons
  Menu, X, ChevronDown, Edit, Trash2, Download
} from 'lucide-react';

// Universal Component DNA - Icon Size System
export const iconSizes = {
  xs: 'h-3.5 w-3.5',     // 14px - Micro contextual icons
  sm: 'h-4 w-4',         // 16px - Small interface icons
  base: 'h-5 w-5',       // 20px - Standard dashboard icons
  lg: 'h-6 w-6',         // 24px - Prominent feature icons
  xl: 'h-8 w-8',         // 32px - Hero/stat card icons
  '2xl': 'h-10 w-10',    // 40px - Large display icons
  '3xl': 'h-12 w-12',    // 48px - Extra large hero icons
} as const;

export type IconSize = keyof typeof iconSizes;

// Semantic Icon Categories with Intelligence
export const ICON_INTELLIGENCE_SYSTEM = {
  PROGRESS_INDICATORS: {
    assessments: {
      icon: ClipboardCheck,
      size: 'xl' as IconSize,
      containerClass: 'icon-progress-success',
      semantic: 'Assessment Progress Tracking',
      description: 'Shows completion status of educational assessments',
      hoverEffect: 'hover:scale-110 transition-transform duration-150',
      ariaLabel: 'Assessment completion progress'
    },
    completion: {
      icon: BarChart3,
      size: 'xl' as IconSize,
      containerClass: 'icon-container-enhanced',
      semantic: 'Overall Completion Rate',
      description: 'Displays overall learning progress percentage',
      animation: 'hover:-translate-y-0.5 hover:shadow-lg',
      ariaLabel: 'Overall completion percentage'
    },
    streak: {
      icon: Flame,
      size: 'xl' as IconSize,
      containerClass: 'icon-progress-warning',
      semantic: 'Learning Streak Counter',
      description: 'Shows consecutive days of learning activity',
      pulse: 'animate-pulse-gentle',
      ariaLabel: 'Learning streak counter'
    },
    achievements: {
      icon: Trophy,
      size: 'xl' as IconSize,
      containerClass: 'icon-progress-success',
      semantic: 'Achievements Earned',
      description: 'Display of earned educational achievements',
      sparkle: 'hover:animate-bounce',
      ariaLabel: 'Achievement count'
    }
  },

  LEARNING_GOALS: {
    currentTarget: {
      icon: Target,
      size: 'xl' as IconSize,
      containerClass: 'icon-container-enhanced',
      semantic: 'Current Learning Goal',
      description: 'Shows the active learning objective',
      interactive: 'hover:bg-primary/20 cursor-pointer',
      ariaLabel: 'Current learning target'
    },
    careerMatches: {
      icon: Compass,
      size: 'xl' as IconSize,
      containerClass: 'icon-progress-info',
      semantic: 'Career Match Discovery',
      description: 'Number of career paths matching student profile',
      rotation: 'hover:rotate-12 transition-transform',
      ariaLabel: 'Career matches found'
    },
    subjectMapping: {
      icon: BookOpen,
      size: 'xl' as IconSize,
      containerClass: 'icon-progress-info',
      semantic: 'Subject-Career Mapping',
      description: 'Connection between subjects and career paths',
      pageFlip: 'hover:scale-105 transition-all',
      ariaLabel: 'Subject to career mapping'
    },
    planning: {
      icon: Map,
      size: 'xl' as IconSize,
      containerClass: 'icon-progress-info',
      semantic: 'Career Planning Progress',
      description: 'Overall career planning journey status',
      unfold: 'hover:scale-110 transition-transform',
      ariaLabel: 'Career planning progress'
    }
  },

  QUICK_ACTIONS: {
    assessment: {
      icon: PenTool,
      size: 'base' as IconSize,
      label: 'Take Assessment',
      styling: 'quick-action-button',
      timing: 'transition-all duration-200',
      semantic: 'Start New Assessment',
      ariaLabel: 'Take career assessment'
    },
    subjectMapper: {
      icon: Map,
      size: 'base' as IconSize,
      label: 'Subject Mapper',
      styling: 'quick-action-button',
      feedback: 'focus:ring-2 focus:ring-primary/50',
      semantic: 'Explore Subject-Career Connections',
      ariaLabel: 'Open subject mapper tool'
    },
    profile: {
      icon: User,
      size: 'base' as IconSize,
      label: 'Complete Profile',
      styling: 'quick-action-button',
      subtle: 'minimal-visual-weight',
      semantic: 'Update Profile Information',
      ariaLabel: 'Complete user profile'
    },
    careerHub: {
      icon: Building,
      size: 'base' as IconSize,
      label: 'Career Hub',
      styling: 'quick-action-button',
      premium: 'group hover effects with icon animation',
      semantic: 'Explore Career Opportunities',
      ariaLabel: 'Open career exploration hub'
    }
  },

  COMMUNICATION: {
    messages: {
      icon: Mail,
      size: 'base' as IconSize,
      semantic: 'New Messages',
      description: 'Unread message count from counselors',
      badge: true,
      ariaLabel: 'New messages'
    },
    notifications: {
      icon: Bell,
      size: 'base' as IconSize,
      semantic: 'System Notifications',
      description: 'Important updates and reminders',
      pulse: 'animate-pulse when has notifications',
      ariaLabel: 'System notifications'
    },
    collaboration: {
      icon: Users,
      size: 'base' as IconSize,
      semantic: 'Team Collaboration',
      description: 'Group activities and peer connections',
      group: 'hover:scale-105',
      ariaLabel: 'Collaboration features'
    },
    support: {
      icon: HelpCircle,
      size: 'base' as IconSize,
      semantic: 'Help & Support',
      description: 'Get assistance and guidance',
      helpful: 'hover:text-info',
      ariaLabel: 'Help and support'
    }
  }
} as const;

// Universal Icon Component with Component DNA Pattern
interface UniversalIconProps {
  category: keyof typeof ICON_INTELLIGENCE_SYSTEM;
  type: string;
  className?: string;
  showContainer?: boolean;
  animate?: boolean;
  size?: IconSize;
  onClick?: () => void;
  ariaHidden?: boolean;
}

export const UniversalIcon: React.FC<UniversalIconProps> = ({
  category,
  type,
  className = '',
  showContainer = false,
  animate = true,
  size,
  onClick,
  ariaHidden = false
}) => {
  const iconConfig = ICON_INTELLIGENCE_SYSTEM[category as keyof typeof ICON_INTELLIGENCE_SYSTEM]?.[type as any];
  
  if (!iconConfig) {
    console.warn(`Icon not found: ${category}.${type}`);
    return null;
  }

  const IconComponent = iconConfig.icon;
  const effectiveSize = size || iconConfig.size || 'base';
  const sizeClass = iconSizes[effectiveSize as keyof typeof iconSizes];

  const iconElement = (
    <IconComponent
      className={`${sizeClass} ${className} ${animate ? iconConfig.hoverEffect || '' : ''}`}
      aria-hidden={ariaHidden}
      aria-label={!ariaHidden ? iconConfig.ariaLabel : undefined}
    />
  );

  if (showContainer && iconConfig.containerClass) {
    return (
      <div 
        className={`${iconConfig.containerClass} ${animate ? 'transition-all duration-200' : ''}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={iconConfig.ariaLabel}
      >
        {iconElement}
      </div>
    );
  }

  return onClick ? (
    <button
      onClick={onClick}
      className={`focus-enhanced ${className}`}
      aria-label={iconConfig.ariaLabel}
    >
      {iconElement}
    </button>
  ) : iconElement;
};

// Quick Action Button Component with Universal DNA
interface QuickActionProps {
  action: keyof typeof ICON_INTELLIGENCE_SYSTEM.QUICK_ACTIONS;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const QuickActionButton: React.FC<QuickActionProps> = ({
  action,
  onClick,
  disabled = false,
  className = ''
}) => {
  const actionConfig = ICON_INTELLIGENCE_SYSTEM.QUICK_ACTIONS[action];
  const IconComponent = actionConfig.icon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${actionConfig.styling} focus-enhanced ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label={actionConfig.ariaLabel}
    >
      <IconComponent className={iconSizes[actionConfig.size]} aria-hidden="true" />
      <span>{actionConfig.label}</span>
    </button>
  );
};

// Stat Card Icon Component with Intelligence
interface StatCardIconProps {
  category: 'PROGRESS_INDICATORS' | 'LEARNING_GOALS';
  type: string;
  value: string | number;
  label: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export const StatCardIcon: React.FC<StatCardIconProps> = ({
  category,
  type,
  value,
  label,
  description,
  trend,
  onClick
}) => {
  const iconConfig = ICON_INTELLIGENCE_SYSTEM[category as keyof typeof ICON_INTELLIGENCE_SYSTEM]?.[type as any];
  
  if (!iconConfig) return null;

  const IconComponent = iconConfig.icon;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div 
      className={`stat-card-enhanced ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={iconConfig.containerClass}>
        <IconComponent 
          className={iconSizes[iconConfig.size]} 
          aria-hidden="true"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {trend && (
            <span className={`text-xs ${trendColor}`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
          )}
        </div>
        
        <div className="mt-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
        
        {description && (
          <div className="progressive-info mt-2">
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Role-based Icon Theme Utilities
export const getRoleIconStyle = (role?: string): React.CSSProperties => ({
  color: role === 'admin' 
    ? 'var(--admin-primary)' 
    : role === 'counselor' 
      ? 'var(--counselor-primary)'
      : 'var(--primary)'
});

export const getRoleIconClass = (role?: string): string => {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'icon-role-admin';
    case 'counselor':
    case 'career_counselor':
      return 'icon-role-counselor';
    default:
      return 'icon-role-primary';
  }
};

// Icon Category Utilities
export const getIconsByCategory = (category: keyof typeof ICON_INTELLIGENCE_SYSTEM) => {
  return Object.keys(ICON_INTELLIGENCE_SYSTEM[category]);
};

export const getIconConfig = (category: keyof typeof ICON_INTELLIGENCE_SYSTEM, type: string) => {
  return ICON_INTELLIGENCE_SYSTEM[category]?.[type as keyof typeof ICON_INTELLIGENCE_SYSTEM[typeof category]];
};

// Accessibility Helper
export const createAccessibleIcon = (
  IconComponent: React.ComponentType<{ className?: string; 'aria-label'?: string; 'aria-hidden'?: boolean; role?: string }>,
  ariaLabel: string,
  size: IconSize = 'base',
  decorative = false
) => (
  <IconComponent
    className={iconSizes[size]}
    aria-label={decorative ? undefined : ariaLabel}
    aria-hidden={decorative}
    role={decorative ? 'presentation' : 'img'}
  />
);

// Export common icons for direct use
export {
  ClipboardCheck, BarChart3, Flame, Trophy, Target, Flag, Clock, Map,
  BookOpen, GraduationCap, PenTool, Library, MessageSquare, Lightbulb,
  Mail, Bell, Users, HelpCircle, MessageCircle, Phone,
  Search, Home, Settings, User, Plus, ArrowRight, ChevronRight,
  CheckCircle, AlertTriangle, Info, Star, Heart, Eye,
  Building, Briefcase, Compass, Calendar, FileText,
  Menu, X, ChevronDown, Edit, Trash2, Download
};