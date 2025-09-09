// Icon Intelligence System - Constants and Types
// Separated from components to fix Fast Refresh warnings
import {
  // Progress & Achievement Icons  
  ClipboardCheck, BarChart3, Flame, Trophy, Target, Map,
  
  // Learning & Education Icons
  BookOpen, PenTool,
  
  // Communication & Social Icons
  Mail, Bell, Users, HelpCircle,
  
  // Action & Navigation Icons
  User,
  
  // Professional & Career Icons
  Building, Compass
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

// Interface for icon configuration
export interface IconConfig {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  size?: IconSize;
  containerClass?: string;
  semantic?: string;
  description?: string;
  hoverEffect?: string;
  ariaLabel?: string;
  animation?: string;
  pulse?: string;
  sparkle?: string;
  interactive?: string;
  rotation?: string;
  pageFlip?: string;
  unfold?: string;
  badge?: boolean;
  group?: string;
  helpful?: string;
  label?: string;
  styling?: string;
  timing?: string;
  feedback?: string;
  subtle?: string;
  premium?: string;
}

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

// Utility function to get icon class based on role theme
export const getIconThemeClass = (role?: string) => {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'text-admin-400';
    case 'counselor':
    case 'career_counselor':
      return 'text-counselor-400';
    default:
      return 'text-primary-400';
  }
};

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

// Icon Category Utilities
export const getIconsByCategory = (category: keyof typeof ICON_INTELLIGENCE_SYSTEM) => {
  return Object.keys(ICON_INTELLIGENCE_SYSTEM[category]);
};

export const getIconConfig = (category: keyof typeof ICON_INTELLIGENCE_SYSTEM, type: string) => {
  return ICON_INTELLIGENCE_SYSTEM[category]?.[type as keyof typeof ICON_INTELLIGENCE_SYSTEM[typeof category]];
};

// Accessibility Helper - moved to iconIntelligence.tsx since it uses JSX