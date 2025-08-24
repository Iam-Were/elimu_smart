import React from 'react';
import { GraduationCap, Home, Briefcase, Target, MessageCircle, Bell, User, LogOut, Menu, Search } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  user?: { name: string; role: string; avatar?: string };
  onLogout?: () => void;
  onMenuToggle?: () => void;
  navGap?: 'tight' | 'normal' | 'wide'; // spacing control
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuToggle }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4 relative">
          {/* Left: Branding + Nav */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Elimu Smart</h1>
                <p className="text-xs text-primary font-medium">Career Guidance</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center space-x-6">
              <NavItem href="/dashboard" icon={Home} label="Dashboard" />
              <NavItem href="/careers" icon={Briefcase} label="Careers" />
              <NavItem href="/assessment" icon={Target} label="Assessment" />
              <NavItem href="/counselor" icon={MessageCircle} label="Counselor" />
            </nav>
          </div>
          {/* Center: Search (desktop) - MOVED TO MIDDLE */}
          <div className="justify-center hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="w-full">
              <label htmlFor="global-search" className="sr-only">Search</label>
              <div className="relative group">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search courses, careers, or resources..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-input-background text-base outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center space-x-3 justify-end">
            {/* Quick links for medium screens */}
            <div className="hidden md:flex lg:hidden items-center space-x-4">
              <NavItem href="/dashboard" icon={Home} label="Dashboard" hideLabel />
              <NavItem href="/careers" icon={Briefcase} label="Careers" hideLabel />
              <NavItem href="/assessment" icon={Target} label="Assessment" hideLabel />
            </div>
            {/* Mobile search trigger */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileSearchOpen(true)} aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Messenger">
              <MessageCircle className="h-4 w-4" />
            </Button>
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout} aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm">Sign In</Button>
            )}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={onMenuToggle} aria-label="Menu">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <MobileSearchOverlay onClose={() => setMobileSearchOpen(false)} />
      )}
    </header>
  );
};

interface NavItemProps { href: string; icon: React.ComponentType<{ className?: string }>; label: string; isActive?: boolean; hideLabel?: boolean; }
const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive = false, hideLabel = false }) => (
  <a
    href={href}
    className={`flex items-center ${hideLabel ? 'p-2' : 'space-x-2 px-3 py-2'} rounded-lg font-medium transition-all duration-200 ease-out ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'} group`}
    aria-label={hideLabel ? label : undefined}
  >
    <Icon className={`h-4 w-4 transform transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
    {hideLabel ? <span className="sr-only">{label}</span> : <span>{label}</span>}
  </a>
);

// Mobile search overlay component
const MobileSearchOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm px-4 pt-6 md:hidden">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h2 className="ml-2 text-sm font-medium text-muted-foreground">Search</h2>
          <button onClick={onClose} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">ESC</button>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="w-full h-11 pl-10 pr-4 rounded-md border border-border bg-muted/40 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-colors placeholder:text-muted-foreground/70"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
