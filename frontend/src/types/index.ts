// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  adminRoleType?: 'platform' | 'operations' | 'provider_safety';
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'student'
  | 'counselor'
  | 'career_counselor'
  | 'admin'
  | 'super_admin';

// Theme Types
export type ThemeRole = 'student' | 'counselor' | 'admin';

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  roles?: UserRole[];
  requiresAuth?: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps extends BaseComponentProps {
  title?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// Admin Types
export type AdminRoleType = 'platform' | 'operations' | 'provider_safety';

export interface AdminPermissions {
  // Business Intelligence & Strategy
  viewRevenue: boolean;
  managePricing: boolean;
  viewBusinessAnalytics: boolean;
  manageProviderCommissions: boolean;
  
  // Operations & Technical
  manageSystemHealth: boolean;
  accessMaintenanceTools: boolean;
  manageUserSupport: boolean;
  viewSystemLogs: boolean;
  
  // Safety & Compliance
  manageProviderVerification: boolean;
  accessStudentSafety: boolean;
  manageTrustSafety: boolean;
  viewComplianceReports: boolean;
  
  // System Administration
  manageUsers: boolean;
  configureSystem: boolean;
  accessAuditLogs: boolean;
  manageSecuritySettings: boolean;
  
  // Cross-cutting concerns
  viewCommonDashboard: boolean;
  escalateToSuperAdmin: boolean;
  collaborateAcrossRoles: boolean;
}
