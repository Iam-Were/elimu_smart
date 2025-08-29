// Icon configuration constants
export const ICON_SIZES = {
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 32,
  XL: 40,
  XXL: 48,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export const ICON_VARIANTS = {
  SOLID: 'solid',
  OUTLINE: 'outline',
  FILLED: 'filled',
} as const;

export type IconVariant = typeof ICON_VARIANTS[keyof typeof ICON_VARIANTS];

export const DEFAULT_ICON_CONFIG = {
  size: 'MD' as IconSize,
  variant: ICON_VARIANTS.OUTLINE,
  color: 'currentColor',
} as const;

// Role-based icon mapping
export const ROLE_ICONS = {
  student: 'GraduationCap',
  counselor: 'Users',
  admin: 'Shield',
  super_admin: 'Crown',
} as const;

// Status icons
export const STATUS_ICONS = {
  active: 'CheckCircle',
  inactive: 'XCircle',
  pending: 'Clock',
  warning: 'AlertTriangle',
  error: 'AlertCircle',
  success: 'Check',
} as const;