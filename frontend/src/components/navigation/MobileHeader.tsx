import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Settings,
  LogOut,
  HelpCircle,
  CreditCard,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useThemeContext } from '@/hooks/useThemeContext';
import { getRoleColor } from '@/constants/theme';
import { NotificationCenter } from '@/components/common/NotificationCenter';

/**
 * LinkedIn-style Mobile Header
 * - Logo
 * - Search bar (expandable)
 * - Notification bell with badge
 * - Avatar menu dropdown
 */
export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentTheme, isDark, toggleDarkMode } = useThemeContext();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const themeColor = getRoleColor(currentTheme);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(to bottom right, ${themeColor}, ${themeColor}dd)` }}
          >
            <span className="text-white font-bold text-sm">ES</span>
          </div>
        </div>

        {/* Right Side: Search, Notifications, Avatar */}
        <div className="flex items-center gap-3">
          {/* Search - Expandable */}
          {isSearchExpanded ? (
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
                onBlur={() => {
                  if (!searchQuery.trim()) {
                    setIsSearchExpanded(false);
                  }
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Notifications */}
          <NotificationCenter />

          {/* Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={user?.profileImage} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* User Info */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="font-semibold text-sm text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Menu Items - Matching Desktop */}
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/profile/edit')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/settings/privacy')} className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {user?.role === 'student' && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/subscription')} className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription Status</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/billing')} className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing & Invoices</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem onClick={() => navigate('/help')} className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
                {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
