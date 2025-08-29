// Icon Intelligence System Constants
export const ICON_CATEGORIES = {
  PROGRESS_INDICATORS: 'PROGRESS_INDICATORS',
  LEARNING_GOALS: 'LEARNING_GOALS',
  SYSTEM_MANAGEMENT: 'SYSTEM_MANAGEMENT',
  COMMUNICATION: 'COMMUNICATION',
  DATA_VISUALIZATION: 'DATA_VISUALIZATION',
} as const;

export type IconCategory = keyof typeof ICON_CATEGORIES;

export const ICON_TYPES = {
  // Progress types
  completion: 'completion',
  assessments: 'assessments',
  achievements: 'achievements',
  planning: 'planning',
  currentTarget: 'currentTarget',
  careerMatches: 'careerMatches',
  
  // System types
  settings: 'settings',
  security: 'security',
  analytics: 'analytics',
  monitoring: 'monitoring',
  
  // Communication types
  messages: 'messages',
  notifications: 'notifications',
  collaboration: 'collaboration',
} as const;

export type IconType = typeof ICON_TYPES[keyof typeof ICON_TYPES];

export const ANIMATION_PRESETS = {
  bounce: 'bounce',
  pulse: 'pulse',
  spin: 'spin',
  fade: 'fade',
  scale: 'scale',
} as const;

export type AnimationPreset = typeof ANIMATION_PRESETS[keyof typeof ANIMATION_PRESETS];

export const SIZE_MAPPING = {
  xs: { width: 16, height: 16 },
  sm: { width: 20, height: 20 },
  md: { width: 24, height: 24 },
  lg: { width: 32, height: 32 },
  xl: { width: 40, height: 40 },
  '2xl': { width: 48, height: 48 },
} as const;

export type SizeKey = keyof typeof SIZE_MAPPING;