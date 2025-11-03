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
  Calendar,
  MessageSquare,
  Search,
  X,
  Compass,
  BarChart,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import type { ThemeRole, User as UserType } from '../../types';
import { NotificationCenter } from '../common/NotificationCenter';
import { getRoleColor } from '../../constants/theme';
import { useChat } from '../../hooks/useChat';

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
  const { unreadCount: unreadMessageCount } = useChat();
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        className={cn("bg-white sticky top-0 z-50 w-full border-b shadow-sm transition-shadow duration-200", className)}
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
        role="banner"
        aria-label={`Navigation for ${user?.role || 'user'} role`}
      >
        <div className="container flex h-16 max-w-5xl mx-auto items-center justify-between">
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

          {/* Desktop Search Bar - LinkedIn-style with subtle borders */}
          <div className={cn("hidden md:flex flex-1 max-w-md ml-4 transition-opacity duration-300", isScrolling ? "opacity-60" : "opacity-100")}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search careers, courses, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setSearchQuery('');
                  }
                }}
                className="pl-9 pr-4 h-9 w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-300 focus:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all"
                aria-label="Search"
              />
            </div>
          </div>
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
                    "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                    (isActive("/dashboard") || isActive("/counselor") || isActive("/admin")) && "text-primary"
                  )}
                >
                  <Home className="h-5 w-5 mb-1" />
                  <span className="text-xs font-light">{user?.role === 'admin' ? 'Admin Panel' : 'Home'}</span>
                  {(isActive("/dashboard") || isActive("/counselor") || isActive("/admin")) && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                      style={{ backgroundColor: getThemeColor(currentTheme) }}
                    />
                  )}
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
                      "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                      isActive("/assessment") && "text-primary"
                    )}
                  >
                    <GraduationCap className="h-5 w-5 mb-1" />
                    <span className="text-xs font-light">Assessment</span>
                    {isActive("/assessment") && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                        style={{ backgroundColor: getThemeColor(currentTheme) }}
                      />
                    )}
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
                      "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                      isActive("/guidance") && "text-primary"
                    )}
                  >
                    <Compass className="h-5 w-5 mb-1" />
                    <span className="text-xs font-light">Guidance</span>
                    {isActive("/guidance") && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                        style={{ backgroundColor: getThemeColor(currentTheme) }}
                      />
                    )}
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
                    "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                    isActive("/inbox") && "text-primary"
                  )}
                >
                  <div className="relative">
                    <MessageSquare className="h-5 w-5 mb-1" />
                    {unreadMessageCount > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold bg-slate-900 text-white border-2 border-white shadow-md"
                      >
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-light">Messages</span>
                  {isActive("/inbox") && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                      style={{ backgroundColor: getThemeColor(currentTheme) }}
                    />
                  )}
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
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                        isActive("/counselor/students") && "text-primary"
                      )}
                    >
                      <Users className="h-5 w-5 mb-1" />
                      <span className="text-xs font-light">Students</span>
                      {isActive("/counselor/students") && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                          style={{ backgroundColor: getThemeColor(currentTheme) }}
                        />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/counselor/sessions"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                        isActive("/counselor/sessions") && "text-primary"
                      )}
                    >
                      <Calendar className="h-5 w-5 mb-1" />
                      <span className="text-xs font-light">Sessions</span>
                      {isActive("/counselor/sessions") && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                          style={{ backgroundColor: getThemeColor(currentTheme) }}
                        />
                      )}
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
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                        isActive("/admin/users") && "text-primary"
                      )}
                    >
                      <UserCog className="h-5 w-5 mb-1" />
                      <span className="text-xs font-light">User Mgmt</span>
                      {isActive("/admin/users") && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                          style={{ backgroundColor: getThemeColor(currentTheme) }}
                        />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/analytics"
                      className={cn(
                        "group inline-flex flex-col items-center justify-center h-auto w-max px-4 py-2 text-sm transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
                        isActive("/admin/analytics") && "text-primary"
                      )}
                    >
                      <BarChart className="h-5 w-5 mb-1" />
                      <span className="text-xs font-light">Analytics</span>
                      {isActive("/admin/analytics") && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                          style={{ backgroundColor: getThemeColor(currentTheme) }}
                        />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

          </NavigationMenuList>
        </NavigationMenu>

        {/* LinkedIn-Style Profile Section - Sprint 18 Requirement - Scroll-based animations */}
        <div className={cn("flex items-center space-x-2 transition-opacity duration-300", isScrolling ? "opacity-0" : "opacity-100")}>
          {/* Messages - Desktop */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/inbox')}
              className="relative p-2"
              aria-label="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              {unreadMessageCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-slate-900 text-white border-2 border-white shadow-md hover:bg-slate-800"
                >
                  {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Notifications - Desktop */}
          <div className="hidden md:block">
            <NotificationCenter />
          </div>

          {/* Mobile Search - LinkedIn Style */}
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