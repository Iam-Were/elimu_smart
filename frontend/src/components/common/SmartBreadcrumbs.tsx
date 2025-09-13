import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronRightIcon,
  DotsHorizontalIcon,
  HomeIcon,
  ChevronDownIcon,
  ClockIcon,
  BookmarkIcon,
} from '@radix-ui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { BreadcrumbItem } from '../../hooks/useBreadcrumbs';

// Re-export the type for backward compatibility
export type { BreadcrumbItem };

interface SmartBreadcrumbsProps {
  items: BreadcrumbItem[];
  actions?: BreadcrumbAction[];
  metadata?: {
    lastVisited?: Date;
    frequency?: number;
    isBookmarked?: boolean;
  };
}

interface BreadcrumbAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  description?: string;
}

interface SmartBreadcrumbsProps {
  items: BreadcrumbItem[];
  maxVisible?: number;
  showActions?: boolean;
  showMetadata?: boolean;
  className?: string;
}

export const SmartBreadcrumbs: React.FC<SmartBreadcrumbsProps> = ({
  items,
  maxVisible = 3,
  showActions = true,
  showMetadata = false,
  className,
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which items to show and which to collapse
  const shouldCollapse = items.length > maxVisible;
  const visibleItems = shouldCollapse 
    ? [items[0], ...items.slice(-maxVisible + 1)]
    : items;
  
  const collapsedItems = shouldCollapse 
    ? items.slice(1, items.length - maxVisible + 1)
    : [];

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.path && item.path !== location.pathname) {
      navigate(item.path);
    }
  };

  const handleBookmark = (item: BreadcrumbItem) => {
    // In real app, this would update the bookmark status
    console.log('Bookmark toggled for:', item.label);
  };

  const renderBreadcrumbItem = (item: BreadcrumbItem, isLast: boolean) => {
    const isActive = item.path === location.pathname;
    const hasActions = showActions && item.actions && item.actions.length > 0;

    return (
      <div key={item.id} className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-muted ${
            isActive ? 'bg-muted text-primary' : ''
          } ${isLast ? 'cursor-default' : ''}`}
          onClick={() => !isLast && handleItemClick(item)}
          onMouseEnter={() => setExpandedItem(item.id)}
          onMouseLeave={() => setExpandedItem(null)}
        >
          {item.icon && (
            <div className={isActive ? 'text-primary' : 'text-muted-foreground'}>
              {typeof item.icon === 'function' ? React.createElement(item.icon as React.ComponentType<{ size: number }>, { size: 16 }) : item.icon}
            </div>
          )}
          
          <span
            className={`text-sm ${
              isActive ? 'font-semibold text-primary' : isLast ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </span>

          {/* Metadata indicators */}
          {showMetadata && (
            <div className="flex items-center gap-1">
              {item.metadata?.isBookmarked && (
                <BookmarkIcon
                  width={12}
                  height={12}
                  className="text-primary"
                />
              )}
              
              {item.metadata?.frequency && item.metadata.frequency > 5 && (
                <Badge variant="outline" className="text-xs">
                  {item.metadata.frequency}
                </Badge>
              )}
            </div>
          )}

          {/* Actions dropdown */}
          {hasActions && expandedItem === item.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ChevronDownIcon width={12} height={12} />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-48">
                {item.actions!.map(action => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                    className="flex items-center gap-2"
                  >
                    {React.createElement(action.icon as React.ComponentType<{ size: number }>, { size: 16 })}
                    <span className="text-sm">{action.label}</span>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => handleBookmark(item)}
                  className="flex items-center gap-2"
                >
                  <BookmarkIcon width={14} height={14} />
                  {item.metadata?.isBookmarked ? 'Remove Bookmark' : 'Bookmark Page'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {!isLast && (
          <ChevronRightIcon
            width={14}
            height={14}
            className="text-muted-foreground"
          />
        )}
      </div>
    );
  };

  const renderCollapsedMenu = () => {
    if (collapsedItems.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-muted rounded-md"
            >
              <DotsHorizontalIcon width={14} height={14} />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">
                  Navigation History
                </span>
                <Badge variant="secondary" className="text-xs">
                  {collapsedItems.length}
                </Badge>
              </div>
            </DropdownMenuLabel>
            
            {collapsedItems.map(item => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {item.icon ? (item.icon as React.ReactNode) : <HomeIcon width={14} height={14} />}
                  <div>
                    <div className="text-sm">{item.label}</div>
                    {item.metadata?.frequency && (
                      <div className="text-xs text-muted-foreground">
                        Visited {item.metadata.frequency} times
                      </div>
                    )}
                  </div>
                </div>
                {item.metadata?.lastVisited && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <ClockIcon width={12} height={12} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Last visited: {item.metadata.lastVisited.toLocaleDateString()}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ChevronRightIcon
          width={14}
          height={14}
          className="text-muted-foreground"
        />
      </div>
    );
  };

  return (
    <div className={`smart-breadcrumbs ${className || ''} p-3 bg-muted border-b border-border overflow-auto`}>
      <div className="flex items-center gap-2 flex-nowrap">
        {shouldCollapse && (
          <>
            {renderBreadcrumbItem(visibleItems[0], false)}
            {renderCollapsedMenu()}
            {visibleItems.slice(1).map((item, index) =>
              renderBreadcrumbItem(item, index === visibleItems.length - 2)
            )}
          </>
        )}
        
        {!shouldCollapse && visibleItems.map((item, index) =>
          renderBreadcrumbItem(item, index === visibleItems.length - 1)
        )}
      </div>
    </div>
  );
};


// Context menu breadcrumb component for complex navigation
export const ContextBreadcrumbs: React.FC<{
  relatedPages?: Array<{
    label: string;
    path: string;
    description: string;
  }>;
}> = ({ relatedPages = [] }) => {
  const navigate = useNavigate();

  if (relatedPages.length === 0) return null;

  return (
    <div className="px-4 py-2 bg-muted/50 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          Related:
        </span>
        
        {relatedPages.slice(0, 3).map((page, index) => (
          <React.Fragment key={page.path}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span
                    className="text-xs text-primary cursor-pointer underline hover:no-underline"
                    onClick={() => navigate(page.path)}
                  >
                    {page.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {page.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {index < Math.min(relatedPages.length - 1, 2) && (
              <span className="text-xs text-muted-foreground">•</span>
            )}
          </React.Fragment>
        ))}
        
        {relatedPages.length > 3 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                +{relatedPages.length - 3} more
              </span>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-48">
              {relatedPages.slice(3).map(page => (
                <DropdownMenuItem
                  key={page.path}
                  onClick={() => navigate(page.path)}
                >
                  <div>
                    <div className="text-sm">{page.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {page.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};