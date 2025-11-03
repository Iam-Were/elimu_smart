import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ClipboardCheck,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/useChat';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  showBadge?: boolean;
  badgeCount?: number;
}

/**
 * LinkedIn-style Mobile Bottom Navigation
 * - Only 4 items (Home, Assessment, Messages, Guidance)
 * - Search, Notifications, Menu moved to top header
 * - Clean, simple design following mobile best practices
 */

export const MobileBottomNavOptimized: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount: unreadMessageCount } = useChat();

  // Primary 4 navigation items with dynamic unread count
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
    },
    {
      id: 'assessment',
      label: 'Assessment',
      icon: ClipboardCheck,
      path: '/assessment',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      path: '/inbox',
      showBadge: true,
      badgeCount: unreadMessageCount,
    },
    {
      id: 'guidance',
      label: 'Guidance',
      icon: Heart,
      path: '/guidance',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[72px] min-h-[52px]',
                active
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:bg-gray-50 active:scale-95 active:bg-gray-100'
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon with Badge Container - LinkedIn Style */}
              <div className="relative">
                <Icon className={cn('h-6 w-6', active ? 'drop-shadow-sm' : '')} />

                {/* Badge for messages - LinkedIn positioning (top-right of icon) */}
                {item.showBadge && item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-[9px] bg-red-500 hover:bg-red-500 flex items-center justify-center font-bold border border-white rounded-full">
                    {item.badgeCount > 9 ? '9+' : item.badgeCount}
                  </Badge>
                )}
              </div>

              <span className={cn('text-xs font-medium', active ? 'font-semibold' : '')}>
                {item.label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-white rounded-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
