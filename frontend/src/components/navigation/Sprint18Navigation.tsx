import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
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
import Button from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Search,
  Menu,
  X,
  Library,
  Network,
  UserCircle,
  CalendarDays,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import type { ThemeRole, User as UserType } from '../../types';
import { NotificationCenter } from '../common/NotificationCenter';
import { getRoleColor } from '../../constants/theme';

interface Sprint18NavigationProps {
  className?: string;
}

export const Sprint18Navigation: React.FC<Sprint18NavigationProps> = ({
  className,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentTheme } = useThemeContext();
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query for live search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Escape key handler for search overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

  // Live search effect
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulated search results - replace with actual API call
    const mockSearch = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock results based on query
      const results = [
        `Career: ${debouncedSearchQuery}`,
        `Course: ${debouncedSearchQuery}`,
        `Resource: ${debouncedSearchQuery}`,
      ].filter(() => Math.random() > 0.3);

      setSearchResults(results);
      setIsSearching(false);
    };

    mockSearch();
  }, [debouncedSearchQuery]);

  const getThemeColor = (theme: ThemeRole) => {
    return getRoleColor(theme);
  };

  const getActiveNavStyles = () => {
    const baseColor = getThemeColor(currentTheme);
    return {
      background: `linear-gradient(to right, ${baseColor}, ${baseColor}dd)`,
      color: 'white'
    };
  };

  // Removed unused function - using getActiveNavStyles() with inline styles instead

  const getHeaderStyles = () => {
    const baseColor = getThemeColor(currentTheme);
    return {
      borderColor: `${baseColor}33`, // 20% opacity
      background: 'rgba(255, 255, 255, 0.8)'
    };
  };

  const getLogoStyles = () => {
    const baseColor = getThemeColor(currentTheme);
    return {
      background: `linear-gradient(to bottom right, ${baseColor}, ${baseColor}dd)`
    };
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const getSubscriptionStatus = () => {
    // Counselors are professional service providers, not subscription users
    if (user?.role === 'counselor') {
      return 'Licensed Counselor';
    }
    // Mock subscription status for students/other roles - replace with actual logic
    return (user as UserType & { subscription?: string })?.subscription || 'Free';
  };

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'licensed counselor':
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

  // Scroll detection for header animations (LinkedIn style)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to show header after scrolling stops
      const newTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      setScrollTimeout(newTimeout);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

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
        className={cn("bg-white sticky top-0 z-50 w-full border-b border-slate-200 shadow-sm relative overflow-hidden", className)}
        style={getHeaderStyles()}
        role="banner"
        aria-label={`Navigation for ${user?.role || 'user'} role`}
      >
        {/* Subtle floating background elements */}
        <div
          className="absolute top-0 left-1/4 w-32 h-32 rounded-full -mt-16 animate-pulse"
          style={{
            background: `linear-gradient(to bottom right, ${getThemeColor(currentTheme)}0d, ${getThemeColor(currentTheme)}08)`
          }}
        ></div>
        <div
          className="absolute top-0 right-1/3 w-24 h-24 rounded-full -mt-12"
          style={{
            background: `linear-gradient(to bottom left, ${getThemeColor(currentTheme)}14, ${getThemeColor(currentTheme)}0a)`
          }}
        ></div>
        <div className="container flex h-16 max-w-5xl mx-auto items-center justify-between relative z-10">
        {/* Enhanced Logo with solid background - Scroll-based animations */}
        <div className={cn("flex items-center space-x-4 transition-opacity duration-300", isScrolling ? "opacity-60" : "opacity-100")}>
          <Link to="/" className="flex items-center space-x-2 group">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={getLogoStyles()}
            >
              <Brain className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <span
              className="text-xl font-bold bg-clip-text text-transparent transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(to right, ${getThemeColor(currentTheme)}, ${getThemeColor(currentTheme)}cc)`
              }}
            >
              Elimu Smart
            </span>
          </Link>
        </div>

        {/* 4-Section Navigation - Sprint 18 Requirement - Scroll-based animations */}
        <NavigationMenu className={cn("hidden md:flex transition-opacity duration-300", isScrolling ? "opacity-0" : "opacity-100")}>
          <NavigationMenuList className="gap-1">
            {/* Home Section - Icon Above Label (LinkedIn Style) */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to={user?.role === 'counselor' ? '/counselor/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className={cn(
                    "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    (isActive("/dashboard") || isActive("/counselor") || isActive("/admin")) && "shadow-md scale-110"
                  )}
                  style={
                    (isActive("/dashboard") || isActive("/counselor") || isActive("/admin")) ? getActiveNavStyles() : {}
                  }
                >
                  <Home className="h-6 w-6" />
                  <span className="text-xs font-medium mt-1">{user?.role === 'admin' ? 'Admin Panel' : 'Home'}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Role-specific navigation sections */}
            {user?.role !== 'counselor' && user?.role !== 'admin' && (
              /* Assessment Section - Students Only - Icon Above Label */
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/assessment"
                    className={cn(
                      "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive("/assessment") && "shadow-md scale-110"
                    )}
                    style={isActive("/assessment") ? getActiveNavStyles() : {}}
                  >
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-xs font-medium mt-1">Assessment</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {user?.role !== 'counselor' && user?.role !== 'admin' && (
              /* Guidance Section - Students Only - Icon Above Label */
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/guidance"
                    className={cn(
                      "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive("/guidance") && "shadow-md scale-110"
                    )}
                    style={isActive("/guidance") ? getActiveNavStyles() : {}}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs font-medium mt-1">Guidance</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {/* Messages Section - All Users - Icon Above Label */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/inbox"
                  className={cn(
                    "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    isActive("/inbox") && "shadow-md scale-110"
                  )}
                  style={isActive("/inbox") ? getActiveNavStyles() : {}}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs font-medium mt-1">Messages</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>



            {/* Counselor-specific navigation - Icon Above Label */}
            {user?.role === 'counselor' && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/counselor/students"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive("/counselor") && "shadow-md scale-110"
                      )}
                      style={isActive("/counselor") ? getActiveNavStyles() : {}}
                    >
                      <Users className="h-6 w-6" />
                      <span className="text-xs font-medium mt-1">My Students</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/counselor/sessions"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname.includes("counselor") && location.hash === "#sessions" && "shadow-md scale-110"
                      )}
                      style={location.pathname.includes("counselor") && location.hash === "#sessions" ? getActiveNavStyles() : {}}
                    >
                      <Calendar className="h-6 w-6" />
                      <span className="text-xs font-medium mt-1">Sessions</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/counselor/analytics"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname.includes("counselor") && location.hash === "#analytics" && "shadow-md scale-110"
                      )}
                      style={location.pathname.includes("counselor") && location.hash === "#analytics" ? getActiveNavStyles() : {}}
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-xs font-medium mt-1">Analytics</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

            {/* Admin-specific navigation - Icon Above Label */}
            {user?.role === 'admin' && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/users"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive("/admin/users") && "shadow-md scale-110"
                      )}
                      style={isActive("/admin/users") ? getActiveNavStyles() : {}}
                    >
                      <Users className="h-6 w-6" />
                      <span className="text-xs font-medium mt-1">User Mgmt</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/analytics"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-3 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive("/admin/analytics") && "shadow-md scale-110"
                      )}
                      style={isActive("/admin/analytics") ? getActiveNavStyles() : {}}
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-xs font-medium mt-1">Analytics</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

          </NavigationMenuList>
        </NavigationMenu>

        {/* LinkedIn-Style Profile Section - Sprint 18 Requirement - Scroll-based animations */}
        <div className={cn("flex items-center space-x-2 transition-opacity duration-300", isScrolling ? "opacity-0" : "opacity-100")}>
          {/* Notifications - Desktop */}
          <div className="hidden md:block">
            <NotificationCenter />
          </div>

          {/* Mobile Search and Menu - LinkedIn Style */}
          <div className="flex md:hidden items-center gap-1">
            {/* Search Icon - Opens overlay - 44x44px touch target */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="h-11 w-11 p-0 touch-manipulation"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Hamburger Menu with Secondary Navigation - 44x44px touch target */}
            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  aria-label="Open menu"
                  className="h-11 w-11 p-0 touch-manipulation"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/guidance/book-session')}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Book Session
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/guidance/resources')}>
                  <Library className="mr-2 h-4 w-4" />
                  Career Resources
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/guidance/professional-networking')}>
                  <Network className="mr-2 h-4 w-4" />
                  Professional Network
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/guidance/crisis')}>
                  <Heart className="mr-2 h-4 w-4" />
                  Crisis Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative h-8 sm:h-10 px-2 sm:px-3"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                    <AvatarImage src={(user as UserType & { avatar?: string })?.avatar} alt={getUserDisplayName()} />
                    <AvatarFallback
                      className="text-[10px] sm:text-xs font-medium"
                      style={{
                        backgroundColor: getThemeColor(currentTheme),
                        color: 'white',
                      }}
                    >
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 sm:w-72" align="end" forceMount>
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
              
              {/* Only show subscription/billing for non-counselor users */}
              {user?.role !== 'counselor' && (
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
              
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={async () => {
                  await logout();
                  // Force navigation to landing page with cache-busting parameter
                  window.location.href = '/?logout=' + Date.now();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Overlay - LinkedIn Style with Live Search */}
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/80 md:hidden animate-in fade-in duration-200"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            aria-hidden="true"
          />
          
          {/* Search Container */}
          <div 
            ref={searchOverlayRef}
            className="fixed top-0 left-0 right-0 z-50 bg-background md:hidden animate-in slide-in-from-top duration-300 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-2 p-4 border-b">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                aria-label="Close search"
                className="h-10 w-10 p-0 shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search careers, courses, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                className="flex-1 text-base"
                autoFocus
                aria-describedby="search-help"
              />
            </div>

            {/* Search Results / Suggestions */}
            <div className="max-h-[70vh] overflow-y-auto">
              {isSearching ? (
                <div className="p-6 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    <span className="sr-only">Searching...</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
                </div>
              ) : searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="py-2">
                    <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Search Results
                    </p>
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:bg-accent focus:outline-none"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(result)}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">{result}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="mt-2 text-xs text-muted-foreground">Try different keywords</p>
                  </div>
                )
              ) : (
                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Popular Searches
                  </p>
                  {['Software Engineering', 'Medicine', 'Business Administration', 'Psychology', 'Data Science'].map((term, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:bg-accent focus:outline-none"
                      onClick={() => {
                        setSearchQuery(term);
                        searchInputRef.current?.focus();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{term}</span>
                      </div>
                    </button>
                  ))}
                  
                  <p id="search-help" className="px-4 py-4 text-xs text-muted-foreground">
                    Press Enter to search or ESC to close
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
    </>
  );
};

export default Sprint18Navigation;