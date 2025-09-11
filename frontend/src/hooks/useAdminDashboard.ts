import { useState, useEffect } from 'react';
import Parse from 'parse';
import { type AdminRoleType } from '@/utils/adminPermissions';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalSessions: number;
  averageSessionDuration: number;
  systemUptime: number;
  serverLoad: number;
  databaseSize: number;
  responseTime: number;
}

interface SecurityMetrics {
  activeThreats: number;
  blockedAttempts: number;
  vulnerabilityScore: number;
  complianceScore: number;
  lastSecurityScan: Date;
  failedLoginAttempts: number;
}

interface BusinessMetrics {
  monthlyRevenue: number;
  conversionRate: number;
  customerSatisfaction: number;
  subscriptionGrowth: number;
  churnRate: number;
  activeSubscriptions: number;
}

interface ContentMetrics {
  flaggedContent: number;
  moderationQueue: number;
  approvedContent: number;
  rejectedContent: number;
  autoModerated: number;
  averageReviewTime: number;
}

interface SupportMetrics {
  openTickets: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  resolvedTickets: number;
  escalatedTickets: number;
  supportAgentLoad: number;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  ipAddress: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AdminActivity {
  activityType: string;
  adminId: string;
  data: any;
  timestamp: Date;
  duration?: number;
}

interface AdminDashboardData {
  systemMetrics: SystemMetrics | null;
  securityMetrics: SecurityMetrics | null;
  businessMetrics: BusinessMetrics | null;
  contentMetrics: ContentMetrics | null;
  supportMetrics: SupportMetrics | null;
  recentAuditLogs: AuditLog[];
  recentActivities: AdminActivity[];
  loading: boolean;
  error: string | null;
}

export const useAdminDashboard = (adminRole?: AdminRoleType) => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    systemMetrics: null,
    securityMetrics: null,
    businessMetrics: null,
    contentMetrics: null,
    supportMetrics: null,
    recentAuditLogs: [],
    recentActivities: [],
    loading: true,
    error: null
  });

  // Log admin activity
  const logAdminActivity = async (
    activityType: string,
    data: any = {},
    duration?: number
  ) => {
    try {
      await Parse.Cloud.run('logAdminActivity', {
        activityType,
        data,
        duration,
        adminRole
      });
    } catch (error) {
      console.warn('Failed to log admin activity:', error);
    }
  };

  // Get system metrics (for operations and platform admins)
  const getSystemMetrics = async (): Promise<SystemMetrics | null> => {
    if (adminRole === 'provider_safety') return null; // No system access for safety managers
    
    try {
      const result = await Parse.Cloud.run('getAdminSystemMetrics');
      return {
        totalUsers: result.totalUsers || 0,
        activeUsers: result.activeUsers || 0,
        newUsersToday: result.newUsersToday || 0,
        totalSessions: result.totalSessions || 0,
        averageSessionDuration: result.averageSessionDuration || 0,
        systemUptime: result.systemUptime || 0,
        serverLoad: result.serverLoad || 0,
        databaseSize: result.databaseSize || 0,
        responseTime: result.responseTime || 0
      };
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      return null;
    }
  };

  // Get security metrics (for operations and safety admins)
  const getSecurityMetrics = async (): Promise<SecurityMetrics | null> => {
    if (adminRole === 'platform' && !adminRole) return null; // Limited security access for platform admins
    
    try {
      const result = await Parse.Cloud.run('getAdminSecurityMetrics');
      return {
        activeThreats: result.activeThreats || 0,
        blockedAttempts: result.blockedAttempts || 0,
        vulnerabilityScore: result.vulnerabilityScore || 0,
        complianceScore: result.complianceScore || 0,
        lastSecurityScan: new Date(result.lastSecurityScan),
        failedLoginAttempts: result.failedLoginAttempts || 0
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return null;
    }
  };

  // Get business metrics (primarily for platform admins)
  const getBusinessMetrics = async (): Promise<BusinessMetrics | null> => {
    if (adminRole !== 'platform') return null; // Business data only for platform admins
    
    try {
      const result = await Parse.Cloud.run('getAdminBusinessMetrics');
      return {
        monthlyRevenue: result.monthlyRevenue || 0,
        conversionRate: result.conversionRate || 0,
        customerSatisfaction: result.customerSatisfaction || 0,
        subscriptionGrowth: result.subscriptionGrowth || 0,
        churnRate: result.churnRate || 0,
        activeSubscriptions: result.activeSubscriptions || 0
      };
    } catch (error) {
      console.error('Failed to get business metrics:', error);
      return null;
    }
  };

  // Get content moderation metrics (for operations and safety admins)
  const getContentMetrics = async (): Promise<ContentMetrics | null> => {
    if (adminRole === 'platform') return null; // Platform admins don't handle content
    
    try {
      const result = await Parse.Cloud.run('getAdminContentMetrics');
      return {
        flaggedContent: result.flaggedContent || 0,
        moderationQueue: result.moderationQueue || 0,
        approvedContent: result.approvedContent || 0,
        rejectedContent: result.rejectedContent || 0,
        autoModerated: result.autoModerated || 0,
        averageReviewTime: result.averageReviewTime || 0
      };
    } catch (error) {
      console.error('Failed to get content metrics:', error);
      return null;
    }
  };

  // Get support metrics (for operations admins)
  const getSupportMetrics = async (): Promise<SupportMetrics | null> => {
    if (adminRole !== 'operations') return null; // Support data only for operations
    
    try {
      const result = await Parse.Cloud.run('getAdminSupportMetrics');
      return {
        openTickets: result.openTickets || 0,
        averageResponseTime: result.averageResponseTime || 0,
        customerSatisfaction: result.customerSatisfaction || 0,
        resolvedTickets: result.resolvedTickets || 0,
        escalatedTickets: result.escalatedTickets || 0,
        supportAgentLoad: result.supportAgentLoad || 0
      };
    } catch (error) {
      console.error('Failed to get support metrics:', error);
      return null;
    }
  };

  // Get recent audit logs
  const getRecentAuditLogs = async (): Promise<AuditLog[]> => {
    try {
      const result = await Parse.Cloud.run('getAdminAuditLogs', { limit: 10 });
      return (result || []).map((log: any) => ({
        id: log.id,
        action: log.action,
        user: log.user,
        timestamp: new Date(log.timestamp),
        ipAddress: log.ipAddress,
        details: log.details,
        severity: log.severity
      }));
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  };

  // Get recent admin activities
  const getRecentActivities = async (): Promise<AdminActivity[]> => {
    try {
      const result = await Parse.Cloud.run('getAdminRecentActivities', { limit: 20 });
      return (result || []).map((activity: any) => ({
        activityType: activity.activityType,
        adminId: activity.adminId,
        data: activity.data,
        timestamp: new Date(activity.createdAt),
        duration: activity.duration
      }));
    } catch (error) {
      console.error('Failed to get recent activities:', error);
      return [];
    }
  };

  // Load all admin dashboard data based on role
  const loadAdminDashboard = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [
        systemMetrics,
        securityMetrics,
        businessMetrics,
        contentMetrics,
        supportMetrics,
        auditLogs,
        activities
      ] = await Promise.all([
        getSystemMetrics(),
        getSecurityMetrics(),
        getBusinessMetrics(),
        getContentMetrics(),
        getSupportMetrics(),
        getRecentAuditLogs(),
        getRecentActivities()
      ]);

      setDashboardData({
        systemMetrics,
        securityMetrics,
        businessMetrics,
        contentMetrics,
        supportMetrics,
        recentAuditLogs: auditLogs,
        recentActivities: activities,
        loading: false,
        error: null
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load admin dashboard data'
      }));
    }
  };

  // Refresh specific sections
  const refreshSystemMetrics = async () => {
    const metrics = await getSystemMetrics();
    setDashboardData(prev => ({ ...prev, systemMetrics: metrics }));
  };

  const refreshSecurityMetrics = async () => {
    const metrics = await getSecurityMetrics();
    setDashboardData(prev => ({ ...prev, securityMetrics: metrics }));
  };

  const refreshBusinessMetrics = async () => {
    const metrics = await getBusinessMetrics();
    setDashboardData(prev => ({ ...prev, businessMetrics: metrics }));
  };

  // Load data on mount
  useEffect(() => {
    const user = Parse.User.current();
    if (user && user.get('role') === 'admin') {
      loadAdminDashboard();
    }
  }, [adminRole]);

  // Auto-refresh every 10 minutes (less frequent for admins)
  useEffect(() => {
    const interval = setInterval(() => {
      const user = Parse.User.current();
      if (user && user.get('role') === 'admin') {
        loadAdminDashboard();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [adminRole]);

  // Calculate derived metrics based on role and data
  const getDerivedMetrics = () => {
    const criticalIssues = [
      dashboardData.securityMetrics?.activeThreats || 0,
      (dashboardData.systemMetrics?.serverLoad ?? 0) > 80 ? 1 : 0,
      dashboardData.contentMetrics?.flaggedContent || 0,
      dashboardData.supportMetrics?.escalatedTickets || 0
    ].reduce((sum, issue) => sum + issue, 0);

    const systemHealth = dashboardData.systemMetrics ? 
      100 - (dashboardData.systemMetrics.serverLoad + 
             (dashboardData.systemMetrics.responseTime > 500 ? 20 : 0)) : 0;

    const securityRating = dashboardData.securityMetrics ?
      Math.min(100, dashboardData.securityMetrics.complianceScore - 
               (dashboardData.securityMetrics.activeThreats * 10)) : 0;

    return {
      criticalIssues,
      systemHealth: Math.max(0, systemHealth),
      securityRating: Math.max(0, securityRating),
      needsAttention: criticalIssues > 0,
      totalUsers: dashboardData.systemMetrics?.totalUsers || 0,
      growthRate: dashboardData.businessMetrics?.subscriptionGrowth || 0,
      recentCriticalLogs: dashboardData.recentAuditLogs.filter(log => 
        log.severity === 'critical' || log.severity === 'high'
      ).length
    };
  };

  return {
    ...dashboardData,
    logAdminActivity,
    loadAdminDashboard,
    refreshSystemMetrics,
    refreshSecurityMetrics,
    refreshBusinessMetrics,
    getDerivedMetrics: getDerivedMetrics()
  };
};

export default useAdminDashboard;