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
