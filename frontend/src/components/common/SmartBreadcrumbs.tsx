import React, { useState } from 'react';
import {
  Group,
  Text,
  ActionIcon,
  Menu,
  Badge,
  Tooltip,
} from '@mantine/core';
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
      <Group gap="xs" key={item.id} align="center">
        <Group
          gap="xs"
          style={{
            cursor: !isLast ? 'pointer' : 'default',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'background-color 0.2s ease',
            backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
          }}
          onClick={() => !isLast && handleItemClick(item)}
          onMouseEnter={() => setExpandedItem(item.id)}
          onMouseLeave={() => setExpandedItem(null)}
        >
          {item.icon && (
            <div style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {typeof item.icon === 'function' ? React.createElement(item.icon as any, { size: 16 }) : item.icon}
            </div>
          )}
          
          <Text
            size="sm"
            fw={isActive ? 600 : 400}
            style={{
              color: isActive ? 'var(--primary)' : isLast ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}
          >
            {item.label}
          </Text>

          {/* Metadata indicators */}
          {showMetadata && (
            <Group gap={4}>
              {item.metadata?.isBookmarked && (
                <BookmarkIcon
                  width={12}
                  height={12}
                  style={{ color: 'var(--primary)' }}
                />
              )}
              
              {item.metadata?.frequency && item.metadata.frequency > 5 && (
                <Badge size="xs" variant="dot" color="blue">
                  {item.metadata.frequency}
                </Badge>
              )}
            </Group>
          )}

          {/* Actions dropdown */}
          {hasActions && expandedItem === item.id && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon size="xs" variant="subtle">
                  <ChevronDownIcon width={12} height={12} />
                </ActionIcon>
              </Menu.Target>
              
              <Menu.Dropdown>
                {item.actions!.map(action => (
                  <Menu.Item
                    key={action.id}
                    leftSection={React.createElement(action.icon, { size: 16 })}
                    onClick={action.onClick}
                  >
                    <div>
                      <Text size="sm">{action.label}</Text>
                    </div>
                  </Menu.Item>
                ))}
                
                <Menu.Divider />
                
                <Menu.Item
                  leftSection={<BookmarkIcon width={14} height={14} />}
                  onClick={() => handleBookmark(item)}
                >
                  {item.metadata?.isBookmarked ? 'Remove Bookmark' : 'Bookmark Page'}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        {!isLast && (
          <ChevronRightIcon
            width={14}
            height={14}
            style={{ color: 'var(--muted-foreground)' }}
          />
        )}
      </Group>
    );
  };

  const renderCollapsedMenu = () => {
    if (collapsedItems.length === 0) return null;

    return (
      <Group gap="xs" align="center">
        <Menu shadow="md" width={250}>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              style={{
                backgroundColor: 'var(--muted)',
                borderRadius: '6px',
              }}
            >
              <DotsHorizontalIcon width={14} height={14} />
            </ActionIcon>
          </Menu.Target>
          
          <Menu.Dropdown>
            <Menu.Label>
              <Group gap="xs">
                <Text size="xs" fw={600}>
                  Navigation History
                </Text>
                <Badge size="xs" variant="light">
                  {collapsedItems.length}
                </Badge>
              </Group>
            </Menu.Label>
            
            {collapsedItems.map(item => (
              <Menu.Item
                key={item.id}
                leftSection={item.icon as React.ReactNode || <HomeIcon width={14} height={14} />}
                onClick={() => handleItemClick(item)}
                rightSection={
                  item.metadata?.lastVisited && (
                    <Tooltip label={`Last visited: ${item.metadata.lastVisited.toLocaleDateString()}`}>
                      <ClockIcon width={12} height={12} style={{ color: 'var(--muted-foreground)' }} />
                    </Tooltip>
                  )
                }
              >
                <div>
                  <Text size="sm">{item.label}</Text>
                  {item.metadata?.frequency && (
                    <Text size="xs" c="dimmed">
                      Visited {item.metadata.frequency} times
                    </Text>
                  )}
                </div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        
        <ChevronRightIcon
          width={14}
          height={14}
          style={{ color: 'var(--muted-foreground)' }}
        />
      </Group>
    );
  };

  return (
    <div
      className={`smart-breadcrumbs ${className || ''}`}
      style={{
        padding: '12px 16px',
        backgroundColor: 'var(--muted)',
        borderBottom: '1px solid var(--border)',
        overflow: 'auto',
      }}
    >
      <Group gap="xs" align="center" wrap="nowrap">
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
      </Group>
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
    <div
      style={{
        padding: '8px 16px',
        backgroundColor: 'var(--sidebar-accent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Group gap="sm" align="center">
        <Text size="xs" c="dimmed" fw={500}>
          Related:
        </Text>
        
        {relatedPages.slice(0, 3).map((page, index) => (
          <React.Fragment key={page.path}>
            <Tooltip label={page.description}>
              <Text
                size="xs"
                style={{
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => navigate(page.path)}
              >
                {page.label}
              </Text>
            </Tooltip>
            {index < Math.min(relatedPages.length - 1, 2) && (
              <Text size="xs" c="dimmed">•</Text>
            )}
          </React.Fragment>
        ))}
        
        {relatedPages.length > 3 && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Text
                size="xs"
                style={{
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                }}
              >
                +{relatedPages.length - 3} more
              </Text>
            </Menu.Target>
            
            <Menu.Dropdown>
              {relatedPages.slice(3).map(page => (
                <Menu.Item
                  key={page.path}
                  onClick={() => navigate(page.path)}
                >
                  <div>
                    <Text size="sm">{page.label}</Text>
                    <Text size="xs" c="dimmed">
                      {page.description}
                    </Text>
                  </div>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </div>
  );
};