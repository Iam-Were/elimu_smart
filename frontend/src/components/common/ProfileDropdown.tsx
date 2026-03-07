import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PersonIcon,
  GearIcon,
  ExitIcon,
  LockClosedIcon,
  ActivityLogIcon,
  DashboardIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { CreditCard, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';

interface ProfileDropdownProps {
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  const { user, logout } = useAuth();
  const { currentTheme, isDark, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/?logout=' + Date.now();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'career_counselor':
        return 'Licensed Career Counselor';
      case 'counselor':
        return 'Licensed Counselor';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getThemeColor = () => {
    switch (currentTheme) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'counselor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getAvatarColor = () => {
    switch (currentTheme) {
      case 'admin':
        return 'bg-purple-600 text-white';
      case 'counselor':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-orange-600 text-white';
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* LinkedIn-style: avatar only, no text in trigger */}
        <Button
          variant="ghost"
          className="p-1 h-auto rounded-full hover:bg-accent"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback className={getAvatarColor()}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 border border-border shadow-lg"
      >
        {/* User Header — solid, no glassmorphism */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className={`${getAvatarColor()} text-lg font-semibold`}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-semibold truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <Badge className={getThemeColor()}>
                {user.role && getRoleDisplayName(user.role)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile */}
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2">Profile</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleNavigation('/profile')} className="cursor-pointer">
          <PersonIcon className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2">Settings</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleNavigation('/settings/preferences')} className="cursor-pointer">
          <GearIcon className="mr-2 h-4 w-4" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/settings/security')} className="cursor-pointer">
          <LockClosedIcon className="mr-2 h-4 w-4" />
          Privacy & Security
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/subscription')} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          Billing & Subscription
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation('/help')} className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help Center
        </DropdownMenuItem>

        {/* Admin */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2">Administration</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleNavigation('/admin/dashboard')} className="cursor-pointer">
              <DashboardIcon className="mr-2 h-4 w-4" />
              System Administration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/admin/users')} className="cursor-pointer">
              <PersonIcon className="mr-2 h-4 w-4" />
              User Management
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/admin/audit-log')} className="cursor-pointer">
              <ActivityLogIcon className="mr-2 h-4 w-4" />
              Audit Logs
            </DropdownMenuItem>
          </>
        )}

        {/* Dark Mode */}
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          <div
            className="flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent text-sm"
            onClick={toggleDarkMode}
          >
            <div className="flex items-center gap-2">
              {isDark ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={toggleDarkMode}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Sign Out */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
        >
          <ExitIcon className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
