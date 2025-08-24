import React from 'react';
import { useLocation } from 'react-router-dom';
import { HomeIcon } from '@radix-ui/react-icons';

export interface BreadcrumbItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  metadata?: {
    isBookmarked?: boolean;
    frequency?: number;
    category?: string;
    description?: string;
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
        path: '/dashboard',
  icon: React.createElement(HomeIcon, { width: 14, height: 14 }),
        metadata: {
          isBookmarked: true,
          frequency: 50,
          category: 'navigation',
          description: 'Main dashboard view',
        },
      },
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip adding the first segment if it's 'dashboard' since we already have it
      if (segment === 'dashboard' && index === 0) return;
      
      breadcrumbs.push({
        id: `breadcrumb-${index}`,
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        path: currentPath,
        isActive: index === pathSegments.length - 1,
        metadata: {
          frequency: Math.floor(Math.random() * 30) + 1,
          category: 'page',
        },
      });
    });

    return breadcrumbs;
  };

  return {
    breadcrumbs: generateBreadcrumbs(),
    currentPath: location.pathname,
  };
};
