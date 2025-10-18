import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ClipboardCheck,
  MessageCircle,
  User,
  Menu,
  X,
  Library,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  Network,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  showBadge?: boolean;
  badgeCount?: number;
}

// Primary 4 navigation items (always visible)
const primaryNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    id: 'assessments',
    label: 'Assessments',
    icon: ClipboardCheck,
    path: '/assessment',
  },
  {
    id: 'guidance',
    label: 'Guidance',
    icon: MessageCircle,
    path: '/guidance',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
  },
];

// Secondary navigation items (inside hamburger menu)
const secondaryNavItems: NavItem[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: MessageCircle,
    path: '/inbox',
    showBadge: true,
    badgeCount: 3,
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: Library,
    path: '/guidance/resources',
  },
  {
    id: 'networking',
    label: 'Professional Network',
    icon: Network,
    path: '/guidance/professional-networking',
  },
  {
    id: 'crisis',
    label: 'Crisis Support',
    icon: Shield,
    path: '/guidance/crisis',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
    showBadge: true,
    badgeCount: 5,
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: HelpCircle,
    path: '/help',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sliding Menu Panel */}
      <div
        className={cn(
          'fixed bottom-20 right-0 w-80 max-w-[85vw] bg-white rounded-tl-2xl rounded-bl-2xl shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">Menu</h3>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="py-2 max-h-[60vh] overflow-y-auto">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-6 py-3.5 transition-all duration-200 relative',
                  active
                    ? 'bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500'
                    : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-orange-600' : 'text-gray-500')} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.showBadge && item.badgeCount && item.badgeCount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-500 text-white px-2 py-0.5 text-xs">
                    {item.badgeCount}
                  </Badge>
                )}
              </button>
            );
          })}

          {/* Logout Button */}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-red-600 hover:bg-red-50 transition-colors border-l-4 border-transparent"
            >
              <LogOut className="h-5 w-5" />
              <span className="flex-1 text-left font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2.5">
          {/* 4 Primary Navigation Items */}
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[70px] min-h-[56px] relative',
                  active
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-100 active:scale-95'
                )}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={cn('h-6 w-6', active ? 'drop-shadow-sm' : '')} />
                <span className={cn('text-xs font-medium', active ? 'font-semibold' : '')}>
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full shadow-sm" />
                )}
              </button>
            );
          })}

          {/* Hamburger Menu Button (5th item) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[70px] min-h-[56px] relative',
              isMenuOpen
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:bg-gray-100 active:scale-95'
            )}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 drop-shadow-sm" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className={cn('text-xs font-medium', isMenuOpen ? 'font-semibold' : '')}>
              Menu
            </span>

            {/* Notification badge on menu icon */}
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 hover:bg-red-500 flex items-center justify-center font-semibold ring-2 ring-white">
              8
            </Badge>

            {/* Active indicator dot */}
            {isMenuOpen && (
              <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full shadow-sm" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
