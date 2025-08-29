// Hero component constants
export const HERO_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
} as const;

export type HeroVariant = typeof HERO_VARIANTS[keyof typeof HERO_VARIANTS];

export const HERO_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

export type HeroSize = typeof HERO_SIZES[keyof typeof HERO_SIZES];

export const DEFAULT_HERO_CONFIG = {
  variant: HERO_VARIANTS.PRIMARY,
  size: HERO_SIZES.MD,
  showBadge: true,
  animated: true,
} as const;