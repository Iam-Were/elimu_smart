import { useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  path?: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ size?: number }> | React.ReactNode;
  actions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    onClick: () => void;
  }>;
  metadata?: {
    lastVisited?: Date;
    frequency?: number;
    isBookmarked?: boolean;
  };
}

// Hook to generate breadcrumbs from current route
export const useBreadcrumbs = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        id: 'home',
        label: 'Dashboard',
        href: '/dashboard',
        isActive: location.pathname === '/dashboard'
      }
    ];

    // Route mapping for better breadcrumb labels
    const routeLabels: Record<string, string> = {
      'assessment': 'Career Assessment',
      'career-hub': 'Career Hub',
      'subject-mapper': 'Subject Mapper',
      'profile': 'Profile',
      'settings': 'Settings',
      'account': 'Account Settings',
      'admin': 'Admin',
      'counselor': 'Counselor',
      'students': 'Students',
      'sessions': 'Sessions',
      'analytics': 'Analytics'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        id: segment,
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  return generateBreadcrumbs();
};