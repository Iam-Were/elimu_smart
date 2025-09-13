import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  description?: string;
  path: string;
  icon?: React.ComponentType<{ width?: number; height?: number }>;
  roleRequired?: string[];
}

interface NavigationDropdownProps {
  label: string;
  items: NavigationItem[];
  userRole?: string;
  className?: string;
  icon?: React.ComponentType<{ width?: number; height?: number }>;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
  label,
  items,
  userRole,
  className = '',
  icon: Icon,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Filter items based on user role
  const visibleItems = items.filter(item => 
    !item.roleRequired || 
    (userRole && item.roleRequired.includes(userRole))
  );

  if (visibleItems.length === 0) return null;

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex flex-col items-center p-2 min-w-[60px] h-auto bg-transparent hover:bg-black/5 data-[state=open]:bg-black/5">
            <div className="flex items-center space-x-1">
              {Icon && (
                <div className="text-foreground">
                  <Icon width={20} height={20} />
                </div>
              )}
              <ChevronDownIcon width={12} height={12} className="text-foreground" />
            </div>
            <span className="text-xs font-normal text-foreground mt-0.5">
              {label}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-80 p-2">
            <div className="space-y-1">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-start space-x-3 w-full p-3 rounded-md hover:bg-muted text-left transition-colors"
                >
                  {item.icon && (
                    <div className="text-primary mt-0.5 flex-shrink-0">
                      <item.icon width={20} height={20} />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground leading-tight">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1 leading-tight">
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
