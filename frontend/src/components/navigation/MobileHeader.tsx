import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,

  User,
  Settings,
  LogOut,
  HelpCircle,
  CreditCard,

} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ES</span>
          </div>
          {!isSearchExpanded && (
            <span className="font-bold text-lg text-gray-900">Elimu Smart</span>
          )}
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
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 text-[10px] bg-red-500 hover:bg-red-500 flex items-center justify-center font-semibold border border-white">
              5
            </Badge>
          </button>

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

              {/* Menu Items */}
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-3" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/subscription')}>
                <CreditCard className="h-4 w-4 mr-3" />
                Subscription
              </DropdownMenuItem>


              <DropdownMenuItem onClick={() => navigate('/help')}>
                <HelpCircle className="h-4 w-4 mr-3" />
                Help Center
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
