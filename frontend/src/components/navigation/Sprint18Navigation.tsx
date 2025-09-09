import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  GraduationCap,
  Users,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  Shield,
  LogOut,
  Brain,
  BarChart3,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import type { ThemeRole, User as UserType } from '../../types';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { getRoleColor } from '../../constants/theme';

interface Sprint18NavigationProps {
  className?: string;
}

export const Sprint18Navigation: React.FC<Sprint18NavigationProps> = ({
  className,
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentTheme } = useThemeContext();

  const getThemeColor = (theme: ThemeRole) => {
    return getRoleColor(theme);
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const getSubscriptionStatus = () => {
    // Counselors are professional service providers, not subscription users
    if (user?.role === 'counselor') {
      return 'Professional Coach';
    }
    // Mock subscription status for students/other roles - replace with actual logic
    return (user as UserType & { subscription?: string })?.subscription || 'Free';
  };

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'professional coach':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'student':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Screen reader announcement for role context */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        role="status"
      >
        {user?.role && `Switched to ${user.role} mode`}
      </div>
      
      <header 
        className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}
        role="banner"
        aria-label={`Navigation for ${user?.role || 'user'} role`}
      >
        <div className="container flex h-16 max-w-5xl mx-auto items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Elimu Smart
            </span>
          </Link>
        </div>

        {/* 4-Section Navigation - Sprint 18 Requirement */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {/* Home Section */}
            <NavigationMenuItem>
              <Link to={user?.role === 'counselor' ? '/counselor/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                <NavigationMenuLink 
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    (isActive("/dashboard") || isActive("/counselor") || isActive("/admin")) && `bg-gradient-to-r from-${getThemeColor(currentTheme).replace('#', '')}-500 to-${getThemeColor(currentTheme).replace('#', '')}-600 text-white hover:from-${getThemeColor(currentTheme).replace('#', '')}-600 hover:to-${getThemeColor(currentTheme).replace('#', '')}-700`
                  )}
                  style={
                    (isActive("/dashboard") || isActive("/counselor") || isActive("/admin")) ? {
                      background: `linear-gradient(to right, ${getThemeColor(currentTheme)}, ${getThemeColor(currentTheme)}dd)`,
                      color: 'white'
                    } : {}
                  }
                >
                  <Home className="mr-2 h-4 w-4" />
                  {user?.role === 'counselor' ? 'Counselor Hub' : user?.role === 'admin' ? 'Admin Panel' : 'Home'}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Role-specific navigation sections */}
            {user?.role !== 'counselor' && user?.role !== 'admin' && (
              /* Assessment Section - Students Only - Simplified Single Link */
              <NavigationMenuItem>
                <Link to="/assessment">
                  <NavigationMenuLink 
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isActive("/assessment") && "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    )}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Assessment
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

            {user?.role !== 'counselor' && user?.role !== 'admin' && (
              /* Guidance Section - Students Only */
              <NavigationMenuItem>
                <Link to="/guidance">
                  <NavigationMenuLink 
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isActive("/guidance") && "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    )}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Guidance
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

            {/* Messages Section - All Users */}
            <NavigationMenuItem>
              <Link to="/inbox">
                <NavigationMenuLink 
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    isActive("/inbox") && "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  )}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>



            {/* Counselor-specific navigation */}
            {user?.role === 'counselor' && (
              <>
                <NavigationMenuItem>
                  <Link to="/counselor/dashboard#students">
                    <NavigationMenuLink 
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive("/counselor") && "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                      )}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      My Students
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/counselor/dashboard#sessions">
                    <NavigationMenuLink 
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname.includes("counselor") && location.hash === "#sessions" && "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Sessions
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/counselor/dashboard#analytics">
                    <NavigationMenuLink 
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname.includes("counselor") && location.hash === "#analytics" && "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                      )}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}

            {/* Admin-specific navigation */}
            {user?.role === 'admin' && (
              <>
                <NavigationMenuItem>
                  <Link to="/admin/users">
                    <NavigationMenuLink 
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive("/admin/users") && "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                      )}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      User Management
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/admin/analytics">
                    <NavigationMenuLink 
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive("/admin/analytics") && "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                      )}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      System Analytics
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}

          </NavigationMenuList>
        </NavigationMenu>

        {/* LinkedIn-Style Profile Section - Sprint 18 Requirement */}
        <div className="flex items-center space-x-4">
          {/* TODO: Remove RoleSwitcher for production - dev/demo only */}
          <RoleSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative h-10 px-3"
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={(user as UserType & { avatar?: string })?.avatar} alt={getUserDisplayName()} />
                    <AvatarFallback 
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: getThemeColor(currentTheme),
                        color: 'white',
                      }}
                    >
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={(user as UserType & { avatar?: string })?.avatar} alt={getUserDisplayName()} />
                  <AvatarFallback
                    style={{
                      backgroundColor: getThemeColor(currentTheme),
                      color: 'white',
                    }}
                  >
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{getUserDisplayName()}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {/* Subscription Status - Sprint 18 Requirement */}
              <div className="px-4 pb-2">
                <Badge className={cn("text-xs font-medium", getSubscriptionBadgeColor(getSubscriptionStatus()))}>
                  {getSubscriptionStatus()} Plan
                </Badge>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Profile Button - LinkedIn Style Navigation */}
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/profile/edit" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/settings/privacy" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Only show subscription for non-counselor users */}
              {user?.role !== 'counselor' && (
                <DropdownMenuItem asChild>
                  <Link to="/subscription" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription Status</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem asChild>
                <Link to="/help" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    </>
  );
};

export default Sprint18Navigation;