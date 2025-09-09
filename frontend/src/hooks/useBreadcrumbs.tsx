import React from 'react';
import { useLocation } from 'react-router-dom';
import { HomeIcon } from '@radix-ui/react-icons';

interface BreadcrumbItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  actions?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    description?: string;
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
        path: '/dashboard',
        icon: <HomeIcon width={14} height={14} />,
        metadata: {
          isBookmarked: true,
          frequency: 50,
          lastVisited: new Date(),
        },
      },
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Generate human-readable labels from path segments
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        id: currentPath,
        label,
        path: currentPath,
        metadata: {
          frequency: Math.floor(Math.random() * 20) + 1,
          lastVisited: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          isBookmarked: Math.random() > 0.7,
        },
      });
    });

    return breadcrumbs;
  };

  return generateBreadcrumbs();
};