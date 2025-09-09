// Enhanced RBAC System for 3 Admin Role Types
import type { AdminPermissions } from '../types';

// 3 Core Admin Role Types (matching existing AdminDashboardCards)
export type AdminRoleType = 'platform' | 'operations' | 'provider_safety';

// Role-Based Permission Matrix
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRoleType, AdminPermissions> = {
  // Platform Administrator - Business & Strategy Focus
  platform: {
    // Business Intelligence & Strategy - FULL ACCESS
    viewRevenue: true,
    managePricing: true,
    viewBusinessAnalytics: true,
    manageProviderCommissions: true,
    
    // Operations & Technical - VIEW ONLY
    manageSystemHealth: false,
    accessMaintenanceTools: false,
    manageUserSupport: false,
    viewSystemLogs: true, // Read-only for business insights
    
    // Safety & Compliance - COLLABORATIVE ACCESS
    manageProviderVerification: false, // Can view, not modify
    accessStudentSafety: false,
    manageTrustSafety: false,
    viewComplianceReports: true, // Business impact visibility
    
    // System Administration - LIMITED ACCESS
    manageUsers: false, // Business users only, not system users
    configureSystem: false,
    accessAuditLogs: true, // Financial audit access
    manageSecuritySettings: false,
    
    // Cross-cutting concerns
    viewCommonDashboard: true,
    escalateToSuperAdmin: true,
    collaborateAcrossRoles: true,
  },

  // Operations Administrator - Technical & Support Focus
  operations: {
    // Business Intelligence & Strategy - VIEW ONLY
    viewRevenue: false, // No financial access
    managePricing: false,
    viewBusinessAnalytics: true, // Usage metrics only
    manageProviderCommissions: false,
    
    // Operations & Technical - FULL ACCESS
    manageSystemHealth: true,
    accessMaintenanceTools: true,
    manageUserSupport: true,
    viewSystemLogs: true,
    
    // Safety & Compliance - SUPPORT ACCESS
    manageProviderVerification: false,
    accessStudentSafety: false,
    manageTrustSafety: false,
    viewComplianceReports: true, // Technical compliance only
    
    // System Administration - OPERATIONAL ACCESS
    manageUsers: true, // User support and technical issues
    configureSystem: true, // System performance and features
    accessAuditLogs: true, // Technical audit trails
    manageSecuritySettings: false, // Read-only security awareness
    
    // Cross-cutting concerns
    viewCommonDashboard: true,
    escalateToSuperAdmin: true,
    collaborateAcrossRoles: true,
  },

  // Provider & Safety Manager - Community & Safety Focus
  provider_safety: {
    // Business Intelligence & Strategy - NO ACCESS
    viewRevenue: false,
    managePricing: false,
    viewBusinessAnalytics: false, // Privacy-focused, no user tracking
    manageProviderCommissions: false,
    
    // Operations & Technical - SAFETY-RELATED ACCESS
    manageSystemHealth: false,
    accessMaintenanceTools: false,
    manageUserSupport: true, // Safety-related support issues
    viewSystemLogs: true, // Safety incident investigation
    
    // Safety & Compliance - FULL ACCESS
    manageProviderVerification: true,
    accessStudentSafety: true,
    manageTrustSafety: true,
    viewComplianceReports: true,
    
    // System Administration - SAFETY-FOCUSED ACCESS
    manageUsers: true, // Safety-related user management
    configureSystem: false,
    accessAuditLogs: true, // Safety and compliance audits
    manageSecuritySettings: true, // Child protection settings
    
    // Cross-cutting concerns
    viewCommonDashboard: true,
    escalateToSuperAdmin: true,
    collaborateAcrossRoles: true,
  },

};

// Role Hierarchy for Escalation Paths
export const ADMIN_ROLE_HIERARCHY: Record<AdminRoleType, AdminRoleType[]> = {
  platform: ['operations', 'provider_safety'], // Can escalate technical/safety issues
  operations: ['platform'], // Can escalate business decisions
  provider_safety: ['platform'], // Can escalate policy decisions
};

// Cross-Role Collaboration Matrix
export const ROLE_COLLABORATION_MATRIX: Record<AdminRoleType, AdminRoleType[]> = {
  platform: ['operations', 'provider_safety'], // Business collaborates with all
  operations: ['platform', 'provider_safety'], // Operations supports all functions
  provider_safety: ['platform', 'operations'], // Safety works with business and ops
};

// Permission Checking Utility Functions
export const hasPermission = (
  userRole: AdminRoleType, 
  permission: keyof AdminPermissions
): boolean => {
  return ADMIN_ROLE_PERMISSIONS[userRole][permission];
};

export const canEscalateToRole = (
  currentRole: AdminRoleType, 
  targetRole: AdminRoleType
): boolean => {
  return ADMIN_ROLE_HIERARCHY[currentRole].includes(targetRole);
};

export const canCollaborateWith = (
  currentRole: AdminRoleType, 
  targetRole: AdminRoleType
): boolean => {
  return ROLE_COLLABORATION_MATRIX[currentRole].includes(targetRole);
};

// Role Description for UI Display
export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRoleType, {
  title: string;
  description: string;
  primaryFocus: string;
  keyResponsibilities: string[];
  collaboratesWith: string[];
  escalatesTo: string[];
}> = {
  platform: {
    title: 'Platform Administrator',
    description: 'Strategic business oversight and platform growth management',
    primaryFocus: 'Business Strategy & Revenue Optimization',
    keyResponsibilities: [
      'Revenue analysis and pricing strategy',
      'Provider commission optimization', 
      'Market expansion and growth planning',
      'Business intelligence and forecasting'
    ],
    collaboratesWith: ['Operations', 'Provider Safety'],
    escalatesTo: ['Operations', 'Provider Safety']
  },
  operations: {
    title: 'Operations Administrator', 
    description: 'Technical operations and user support management',
    primaryFocus: 'System Operations & User Support',
    keyResponsibilities: [
      'System health monitoring and maintenance',
      'User support and technical troubleshooting',
      'Performance optimization and scaling',
      'Operational workflow management'
    ],
    collaboratesWith: ['Platform', 'Provider Safety'],
    escalatesTo: ['Platform']
  },
  provider_safety: {
    title: 'Provider & Safety Manager',
    description: 'Child protection, safety compliance, and community standards',
    primaryFocus: 'Student Safety & Provider Quality',
    keyResponsibilities: [
      'Student safety monitoring and protection',
      'Provider verification and credentialing',
      'Trust & safety policy enforcement',
      'Quality assurance and compliance'
    ],
    collaboratesWith: ['Platform', 'Operations'],
    escalatesTo: ['Platform']
  }
};

// Sensitivity Levels for Data and Operations
export type SensitivityLevel = 'public' | 'internal' | 'restricted' | 'confidential';

export const SENSITIVITY_LEVEL_ACCESS: Record<SensitivityLevel, AdminRoleType[]> = {
  public: ['platform', 'operations', 'provider_safety'],
  internal: ['platform', 'operations', 'provider_safety'],
  restricted: ['operations', 'provider_safety'], // Technical and safety data
  confidential: ['provider_safety'], // Child protection and safety data
};

export const canAccessSensitivityLevel = (
  userRole: AdminRoleType,
  sensitivityLevel: SensitivityLevel
): boolean => {
  return SENSITIVITY_LEVEL_ACCESS[sensitivityLevel].includes(userRole);
};

// Card Access Control - determines which cards each role can see
export const getAccessibleCardIds = (userRole: AdminRoleType): string[] => {
  const roleCardMap = {
    platform: [
      'business-analytics', 'platform-overview', 'provider-management', 'revenue-optimization',
      'audit-log', 'user-management', 'system-configuration' // Common cards with business focus
    ],
    operations: [
      'system-health', 'user-support', 'technical-maintenance', 'content-operations',
      'audit-log', 'security-monitoring', 'user-management', 'system-configuration' // Common cards with ops focus
    ],
    provider_safety: [
      'provider-verification', 'student-safety', 'trust-safety', 'provider-success',
      'audit-log', 'security-monitoring', 'user-management' // Common cards with safety focus
    ]
  };
  
  return roleCardMap[userRole] || [];
};