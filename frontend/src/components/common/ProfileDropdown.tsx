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
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
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
      // Force navigation to landing page with cache-busting parameter
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
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 p-2 h-auto hover:bg-accent"
        >
          <div className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-white/50 dark:ring-slate-700/50 shadow-lg">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className={getAvatarColor()}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator - Glassmorphism */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
          </div>

          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold truncate max-w-[120px]">
              {getUserDisplayName()}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.role && getRoleDisplayName(user.role)}
            </span>
          </div>

          <ChevronDownIcon className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl"
      >
        {/* User Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-slate-700 shadow-xl">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className={getAvatarColor()}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge className={getThemeColor()}>
                  {user.role && getRoleDisplayName(user.role)}
                </Badge>
                {isAdmin && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Online
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleNavigation('/profile')}
          className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <PersonIcon className="mr-2 h-4 w-4" />
          <div className="flex-1">
            <div className="text-sm font-medium">View Profile</div>
            <div className="text-xs text-muted-foreground">See your public profile</div>
          </div>
        </DropdownMenuItem>

        {/* Account Settings */}
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Settings</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleNavigation('/settings/preferences')}
          className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <GearIcon className="mr-2 h-4 w-4" />
          <div className="flex-1">
            <div className="text-sm font-medium">Preferences</div>
            <div className="text-xs text-muted-foreground">Language, timezone, notifications</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigation('/settings/security')}
          className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <LockClosedIcon className="mr-2 h-4 w-4" />
          <div className="flex-1">
            <div className="text-sm font-medium">Privacy & Security</div>
            <div className="text-xs text-muted-foreground">Password, 2FA, privacy settings</div>
          </div>
        </DropdownMenuItem>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
            <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Administration</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleNavigation('/admin/dashboard')}
              className="cursor-pointer transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <DashboardIcon className="mr-2 h-4 w-4" />
              <div className="flex-1">
                <div className="text-sm font-medium">System Administration</div>
                <div className="text-xs text-muted-foreground">Platform management</div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Admin</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation('/admin/users')}
              className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <PersonIcon className="mr-2 h-4 w-4" />
              <div className="flex-1">
                <div className="text-sm font-medium">User Management</div>
                <div className="text-xs text-muted-foreground">Manage users and roles</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation('/admin/audit-log')}
              className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ActivityLogIcon className="mr-2 h-4 w-4" />
              <div className="flex-1">
                <div className="text-sm font-medium">Audit Logs</div>
                <div className="text-xs text-muted-foreground">System activity logs</div>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* Preferences */}
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferences</DropdownMenuLabel>
        <div className="px-2 py-2">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div className="flex items-center gap-2">
              {isDark ? (
                <SunIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MoonIcon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>

        {/* Sign Out */}
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer transition-all"
        >
          <ExitIcon className="mr-2 h-4 w-4" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Sign Out</div>
            <div className="text-xs text-muted-foreground">Sign out of your account</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};