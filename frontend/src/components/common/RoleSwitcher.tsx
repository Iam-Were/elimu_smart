import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useThemeContext } from '../../hooks/useThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { ChevronDown, User, Users, Shield, AlertTriangle } from 'lucide-react';
import { getRoleBadgeColor } from '../../constants/theme';

/**
 * RoleSwitcher Component
 * 
 * ⚠️  DEVELOPMENT/DEMO ONLY - REMOVE FOR PRODUCTION
 * 
 * This component allows switching between user role themes for development
 * and demonstration purposes. In production, user roles should be determined
 * by authentication and permissions, not UI theme switching.
 * 
 * TODO: Remove this component before production deployment
 */
export const RoleSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useThemeContext();
  const { user } = useAuth();

  // Check if we're in development mode
  const isDevelopment = import.meta.env?.DEV ?? true;
  
  // Don't render in production
  if (!isDevelopment) {
    return null;
  }

  // Only allow switching to roles that the user actually has access to
  const hasRoleAccess = (role?: string) => {
    if (!user) return false;
    // For demo purposes, all users can switch themes, but in production
    // this should check actual user permissions/roles
    // Currently unused but prepared for future role-based access control
    console.debug('Checking role access for:', role);
    return true;
  };

  const handleThemeSwitch = (theme: string) => {
    if (hasRoleAccess(theme)) {
      setTheme(theme as 'student' | 'counselor' | 'admin');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <User className="h-4 w-4" />;
      case 'counselor': return <Users className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    return getRoleBadgeColor(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {getRoleIcon(currentTheme)}
          <Badge variant="secondary" className={getRoleColor(currentTheme)}>
            {currentTheme}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleThemeSwitch('student')}
          disabled={currentTheme === 'student' || !hasRoleAccess('student')}
        >
          <User className="h-4 w-4 mr-2" />
          Student View
          {currentTheme === 'student' && <Badge className="ml-auto">Current</Badge>}
          {!hasRoleAccess('student') && <AlertTriangle className="h-3 w-3 ml-auto text-red-500" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeSwitch('counselor')}
          disabled={currentTheme === 'counselor' || !hasRoleAccess('counselor')}
        >
          <Users className="h-4 w-4 mr-2" />
          Counselor View
          {currentTheme === 'counselor' && <Badge className="ml-auto">Current</Badge>}
          {!hasRoleAccess('counselor') && <AlertTriangle className="h-3 w-3 ml-auto text-red-500" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleThemeSwitch('admin')}
          disabled={currentTheme === 'admin' || !hasRoleAccess('admin')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin View
          {!hasRoleAccess('admin') && <AlertTriangle className="h-3 w-3 ml-auto text-red-500" />}
          {currentTheme === 'admin' && <Badge className="ml-auto">Current</Badge>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};