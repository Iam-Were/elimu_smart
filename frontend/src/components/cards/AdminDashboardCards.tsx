import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Shield,
  Settings,
  BarChart3,
  FileText,
  AlertTriangle,
  Activity,
  Database,
  Server,
  Lock,
  UserCheck,
  HeadphonesIcon,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  Flag,
  CreditCard,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  type AdminRoleType, 
  getAccessibleCardIds
} from '../../utils/adminPermissions';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

interface AdminCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value?: string | number;
  change?: string;
  status?: 'normal' | 'warning' | 'critical' | 'good';
  link: string;
  badge?: string;
  details?: string[];
}

interface AdminDashboardCardsProps {
  maxCards?: number;
  adminRole?: AdminRoleType;
  size?: 'compact' | 'medium' | 'large';
  cardOffset?: number;
}

export const AdminDashboardCards: React.FC<AdminDashboardCardsProps> = ({ 
  maxCards = 12,
  adminRole = 'platform',
  size = 'medium',
  cardOffset = 0
}) => {
  const { 
    systemMetrics,
    securityMetrics,
    businessMetrics,
    contentMetrics,
    supportMetrics,
    recentAuditLogs,
    loading,
    error,
    logAdminActivity,
    getDerivedMetrics
  } = useAdminDashboard(adminRole);
  
  // Platform Administrator Cards (Strategic & Business Focus)
  const platformAdminCards: AdminCard[] = [
    {
      id: 'business-analytics',
      title: 'Business Intelligence',
      description: 'Revenue, growth metrics, and strategic insights for platform optimization',
      icon: <BarChart3 className="h-5 w-5" />,
      value: '₹4.2M',
      change: '+23%',
      status: 'good',
      link: '/admin/analytics',
      badge: 'Strategic',
      details: [
        'Monthly revenue tracking and forecasting',
        'User acquisition cost and lifetime value analysis', 
        'Service provider commission optimization',
        'Market expansion and growth opportunities'
      ]
    },
    {
      id: 'platform-overview',
      title: 'Platform Overview',
      description: 'High-level platform performance and user growth tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      value: '2,847',
      change: '+12%',
      status: 'good',
      link: '/admin/dashboard',
      badge: 'Growth',
      details: [
        'Total users across all roles',
        'Monthly active user growth',
        'Platform engagement metrics',
        'User retention and churn analysis'
      ]
    },
    {
      id: 'provider-management',
      title: 'Service Provider Network',
      description: 'Counselor verification, performance tracking, and network optimization',
      icon: <UserCheck className="h-5 w-5" />,
      value: '45',
      change: '+3',
      status: 'normal',
      link: '/admin/providers',
      badge: 'Quality',
      details: [
        'Provider verification and credentialing',
        'Performance metrics and quality scores',
        'Commission and payment management',
        'Professional development coordination'
      ]
    },
    {
      id: 'revenue-optimization',
      title: 'Revenue & Pricing',
      description: 'Platform monetization, pricing strategy, and financial performance',
      icon: <CreditCard className="h-5 w-5" />,
      value: '₹45.2K',
      change: '+18%',
      status: 'good',
      link: '/admin/revenue',
      badge: 'Financial',
      details: [
        'Dynamic pricing model optimization',
        'Commission structure management',
        'Payment processing and disputes',
        'Financial reporting and forecasting'
      ]
    }
  ];

  // Operations Administrator Cards (Technical & Support Focus)
  const operationsAdminCards: AdminCard[] = [
    {
      id: 'system-health',
      title: 'System Monitoring',
      description: 'Real-time system performance, uptime, and infrastructure monitoring',
      icon: <Server className="h-5 w-5" />,
      value: '99.7%',
      change: 'Uptime',
      status: 'good',
      link: '/admin/system-monitoring',
      badge: 'Critical',
      details: [
        'Server performance and resource usage',
        'Database optimization and query performance',
        'API response times and error rates',
        'Automated backup and recovery status'
      ]
    },
    {
      id: 'user-support',
      title: 'Customer Support',
      description: 'User assistance, technical troubleshooting, and support ticket management',
      icon: <HeadphonesIcon className="h-5 w-5" />,
      value: '23',
      change: 'Open',
      status: 'warning',
      link: '/admin/support',
      badge: 'Urgent',
      details: [
        'Student and provider technical support',
        'Platform onboarding assistance',
        'Bug reports and feature requests',
        'Community feedback and engagement'
      ]
    },
    {
      id: 'technical-maintenance',
      title: 'System Maintenance',
      description: 'Platform updates, security patches, and infrastructure optimization',
      icon: <Settings className="h-5 w-5" />,
      value: '4',
      change: 'Pending',
      status: 'normal',
      link: '/admin/maintenance-tools',
      badge: 'Scheduled',
      details: [
        'Security updates and patch management',
        'Performance optimization and scaling',
        'Database maintenance and cleanup',
        'Integration updates and monitoring'
      ]
    },
    {
      id: 'content-operations',
      title: 'Content Management',
      description: 'Content moderation, quality assurance, and policy enforcement',
      icon: <FileText className="h-5 w-5" />,
      value: '12',
      change: 'Flagged',
      status: 'warning',
      link: '/admin/content-moderation',
      badge: 'Review',
      details: [
        'Automated content moderation workflows',
        'Policy violation detection and response',
        'Quality assurance and content improvement',
        'Community guidelines enforcement'
      ]
    }
  ];

  // Provider & Safety Manager Cards (Community & Safety Focus)
  const providerSafetyCards: AdminCard[] = [
    {
      id: 'provider-verification',
      title: 'Provider Verification',
      description: 'Counselor credentialing, background checks, and professional validation',
      icon: <Shield className="h-5 w-5" />,
      value: '8',
      change: 'Pending',
      status: 'normal',
      link: '/admin/provider-verification',
      badge: 'Security',
      details: [
        'Professional credential verification',
        'Background check processing',
        'Continuous compliance monitoring',
        'Provider quality assurance reviews'
      ]
    },
    {
      id: 'student-safety',
      title: 'Student Safety',
      description: 'Child protection, safety monitoring, and incident response protocols',
      icon: <UserCheck className="h-5 w-5" />,
      value: '2,456',
      change: 'Protected',
      status: 'good',
      link: '/admin/student-safety',
      badge: 'Priority',
      details: [
        'Student age verification and parental consent',
        'Session safety monitoring and alerts',
        'Incident reporting and response protocols',
        'Child protection compliance management'
      ]
    },
    {
      id: 'trust-safety',
      title: 'Trust & Safety',
      description: 'Platform safety, abuse prevention, and community standards enforcement',
      icon: <Flag className="h-5 w-5" />,
      value: '3',
      change: 'Active',
      status: 'critical',
      link: '/admin/trust-safety',
      badge: 'Urgent',
      details: [
        'Abuse detection and prevention systems',
        'User behavior analysis and intervention',
        'Safety policy development and enforcement',
        'Crisis intervention and emergency response'
      ]
    },
    {
      id: 'provider-success',
      title: 'Provider Success',
      description: 'Counselor onboarding, training, performance tracking, and retention',
      icon: <Star className="h-5 w-5" />,
      value: '4.6',
      change: 'Avg Rating',
      status: 'good',
      link: '/admin/provider-success',
      badge: 'Growth',
      details: [
        'Provider onboarding and training programs',
        'Performance tracking and feedback systems',
        'Professional development opportunities',
        'Provider retention and satisfaction metrics'
      ]
    }
  ];

  // Common Admin Cards (Available to All Roles)
  const commonAdminCards: AdminCard[] = [
    {
      id: 'audit-log',
      title: 'Activity Audit',
      description: 'Complete audit trail of all admin actions and system events',
      icon: <Activity className="h-5 w-5" />,
      value: '1,234',
      change: 'Today',
      status: 'normal',
      link: '/admin/audit-log',
      badge: 'Compliance',
      details: [
        'Admin action tracking and logging',
        'System event monitoring and alerts',
        'Compliance reporting and documentation',
        'Forensic analysis and investigation tools'
      ]
    },
    {
      id: 'security-monitoring',
      title: 'Security Center',
      description: 'Threat detection, security alerts, and incident response management',
      icon: <Lock className="h-5 w-5" />,
      value: '2',
      change: 'Alerts',
      status: 'warning',
      link: '/admin/security-monitoring',
      badge: 'Security',
      details: [
        'Real-time threat detection and analysis',
        'Security alert management and response',
        'Vulnerability scanning and remediation',
        'Access control and permission management'
      ]
    },
    {
      id: 'user-management',
      title: 'User Administration',
      description: 'Comprehensive user management, roles, and access control',
      icon: <Users className="h-5 w-5" />,
      value: '2,847',
      change: 'Total',
      status: 'normal',
      link: '/admin/users',
      badge: 'Admin',
      details: [
        'User account creation and management',
        'Role assignment and permission control',
        'Bulk operations and data import/export',
        'User activity monitoring and analytics'
      ]
    },
    {
      id: 'system-configuration',
      title: 'Platform Settings',
      description: 'System configuration, feature flags, and platform customization',
      icon: <Database className="h-5 w-5" />,
      value: '156',
      change: 'Settings',
      status: 'normal',
      link: '/admin/system-configuration',
      badge: 'Config',
      details: [
        'Platform feature configuration and toggles',
        'Integration settings and API management',
        'Performance tuning and optimization',
        'Business rule and policy configuration'
      ]
    }
  ];

  // Transform static cards with dynamic data
  const transformCardsWithDynamicData = (cards: AdminCard[]): AdminCard[] => {
    return cards.map(card => {
      const transformedCard = { ...card };

      switch (card.id) {
        case 'business-analytics':
          if (businessMetrics) {
            transformedCard.value = `₹${(businessMetrics.monthlyRevenue / 100000).toFixed(1)}L`;
            transformedCard.change = `${businessMetrics.subscriptionGrowth > 0 ? '+' : ''}${businessMetrics.subscriptionGrowth.toFixed(1)}%`;
            transformedCard.status = businessMetrics.subscriptionGrowth > 10 ? 'good' : 
                                    businessMetrics.subscriptionGrowth < 0 ? 'critical' : 'normal';
          }
          break;

        case 'platform-overview':
          if (systemMetrics) {
            transformedCard.value = systemMetrics.totalUsers.toLocaleString();
            const growthRate = getDerivedMetrics.growthRate;
            transformedCard.change = `${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%`;
            transformedCard.status = growthRate > 5 ? 'good' : growthRate < -5 ? 'critical' : 'normal';
          }
          break;

        case 'system-health':
          if (systemMetrics) {
            transformedCard.value = `${getDerivedMetrics.systemHealth.toFixed(1)}%`;
            transformedCard.change = systemMetrics.serverLoad < 70 ? 'Optimal' : 
                                    systemMetrics.serverLoad < 85 ? 'High Load' : 'Critical';
            transformedCard.status = systemMetrics.serverLoad < 70 ? 'good' : 
                                    systemMetrics.serverLoad < 85 ? 'warning' : 'critical';
          }
          break;

        case 'security-center':
          if (securityMetrics) {
            transformedCard.value = securityMetrics.activeThreats.toString();
            transformedCard.change = `${securityMetrics.complianceScore}% compliance`;
            transformedCard.status = securityMetrics.activeThreats === 0 ? 'good' : 
                                    securityMetrics.activeThreats < 5 ? 'warning' : 'critical';
          }
          break;

        case 'user-administration':
          if (systemMetrics) {
            transformedCard.value = systemMetrics.activeUsers.toLocaleString();
            transformedCard.change = `${systemMetrics.newUsersToday} new today`;
            transformedCard.status = systemMetrics.newUsersToday > 0 ? 'good' : 'normal';
          }
          break;

        case 'content-moderation':
          if (contentMetrics) {
            transformedCard.value = contentMetrics.moderationQueue.toString();
            transformedCard.change = `${contentMetrics.averageReviewTime.toFixed(1)}h avg`;
            transformedCard.status = contentMetrics.moderationQueue < 10 ? 'good' : 
                                    contentMetrics.moderationQueue < 50 ? 'warning' : 'critical';
          }
          break;

        case 'user-support':
          if (supportMetrics) {
            transformedCard.value = supportMetrics.openTickets.toString();
            transformedCard.change = `${supportMetrics.averageResponseTime.toFixed(1)}h response`;
            transformedCard.status = supportMetrics.openTickets < 20 ? 'good' : 
                                    supportMetrics.openTickets < 50 ? 'warning' : 'critical';
          }
          break;

        case 'audit-logs':
          transformedCard.value = getDerivedMetrics.recentCriticalLogs.toString();
          transformedCard.change = recentAuditLogs.length > 0 ? 
            `Last: ${recentAuditLogs[0]?.timestamp.toLocaleTimeString()}` : 'No recent activity';
          transformedCard.status = getDerivedMetrics.recentCriticalLogs > 0 ? 'warning' : 'good';
          break;

        default:
          // Keep original static values for cards without dynamic data
          break;
      }

      return transformedCard;
    });
  };

  // Select cards based on admin role with RBAC filtering and dynamic data
  const getCardsForRole = (): AdminCard[] => {
    let roleCards: AdminCard[] = [];
    
    switch (adminRole) {
      case 'platform':
        roleCards = [...platformAdminCards];
        break;
      case 'operations':
        roleCards = [...operationsAdminCards];
        break;
      case 'provider_safety':
        roleCards = [...providerSafetyCards];
        break;
      default:
        roleCards = [...platformAdminCards];
    }
    
    // Add common cards to all roles
    roleCards = [...roleCards, ...commonAdminCards];
    
    // Transform cards with dynamic data
    const dynamicCards = transformCardsWithDynamicData(roleCards);
    
    // Apply RBAC filtering - only show cards the user has access to
    const accessibleCardIds = getAccessibleCardIds(adminRole);
    const filteredCards = dynamicCards.filter(card => accessibleCardIds.includes(card.id));
    
    return filteredCards.slice(cardOffset, cardOffset + maxCards);
  };

  const cards = getCardsForRole();

  // Handle card clicks with activity logging
  const handleCardClick = (card: AdminCard) => {
    logAdminActivity('admin_card_click', {
      cardId: card.id,
      cardTitle: card.title,
      status: card.status,
      adminRole: adminRole,
      value: card.value,
      systemHealth: getDerivedMetrics.systemHealth,
      criticalIssues: getDerivedMetrics.criticalIssues
    });
  };
  
  // Responsive card sizing with proper content space
  const getCardSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'p-4 min-h-[130px]'; // Sufficient space for metrics
      case 'large':
        return 'p-6 min-h-[220px]'; // Detailed information cards
      case 'medium':
      default:
        return 'p-5 min-h-[180px]'; // Standard information cards
    }
  };
  
  const getGridClasses = () => {
    switch (size) {
      case 'compact':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'large':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-5';
      case 'medium':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-5';
    }
  };
  

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good':
        return 'text-emerald-600';
      case 'warning':
        return 'text-amber-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Critical':
      case 'Urgent':
      case 'Priority':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'Security':
        return 'bg-orange-50 text-orange-700 border border-orange-100';
      case 'Strategic':
      case 'Growth':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Quality':
      case 'Financial':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  return (
    <>
      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className="border-slate-200">
              <CardHeader className="pb-3">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-20 mt-4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Unable to load admin dashboard data: {error}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Critical Issues Alert */}
          {getDerivedMetrics.criticalIssues > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span>
                    {getDerivedMetrics.criticalIssues} critical issue(s) detected. 
                    Immediate attention required.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className={getGridClasses()}>
      {cards.map((card) => (
        <Card key={card.id} className={`border-slate-200 hover:shadow-md transition-shadow ${getCardSizeClasses()}`}>
          <CardHeader title={card.title} className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                  {card.icon}
                </div>
                <div className="space-y-1">
                  {card.badge && (
                    <Badge className={cn("text-xs", getBadgeColor(card.badge))}>
                      {card.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {card.description}
            </p>
            
            {/* Key Metric */}
            {card.value && (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className={cn("text-2xl font-bold", getStatusColor(card.status))}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500">{card.change}</p>
                </div>
                {card.status && (
                  <div className={cn(
                    "p-1.5 rounded-full",
                    card.status === 'good' && "bg-green-100",
                    card.status === 'warning' && "bg-yellow-100", 
                    card.status === 'critical' && "bg-red-100",
                    card.status === 'normal' && "bg-slate-100"
                  )}>
                    {card.status === 'good' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {card.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {card.status === 'critical' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    {card.status === 'normal' && <Eye className="h-4 w-4 text-slate-600" />}
                  </div>
                )}
              </div>
            )}
            
            {/* Feature Details */}
            {card.details && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Key Functions:</p>
                <ul className="space-y-1">
                  {card.details.slice(0, 2).map((detail, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link 
                to={card.link}
                onClick={() => handleCardClick(card)}
              >
                Access {card.title}
                <ArrowRight className="h-3 w-3 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
          </div>
        </>
      )}
    </>
  );
};