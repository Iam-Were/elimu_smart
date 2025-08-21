import React, { useState, useRef, useEffect } from 'react';
import {
  UnstyledButton,
  Paper,
  Stack,
  Text,
  Group,
} from '@mantine/core';
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
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpened(false);
      }
    };

    if (opened) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [opened]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && opened) {
        setOpened(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [opened]);

  const handleNavigation = (path: string) => {
    setOpened(false);
    navigate(path);
  };

  // Filter items based on user role
  const visibleItems = items.filter(item => 
    !item.roleRequired || 
    (userRole && item.roleRequired.includes(userRole))
  );

  if (visibleItems.length === 0) return null;

  return (
    <div ref={dropdownRef} className={`navigation-dropdown ${className}`} style={{ position: 'relative' }}>
      <UnstyledButton
        onClick={() => setOpened(!opened)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          backgroundColor: opened ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          minWidth: '60px',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          if (!opened) {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!opened) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Group gap="xs" style={{ alignItems: 'center' }}>
          {Icon && (
            <div style={{ color: 'var(--foreground)' }}>
              <Icon width={20} height={20} />
            </div>
          )}
          <div style={{ 
            transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--foreground)',
          }}>
            <ChevronDownIcon width={12} height={12} />
          </div>
        </Group>
        <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--foreground)', marginTop: '2px' }}>
          {label}
        </span>
      </UnstyledButton>

      {opened && (
        <Paper
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: '280px',
            maxWidth: '400px',
            zIndex: 1000,
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            animation: 'dropdownSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            marginTop: '4px',
          }}
        >
          <div style={{ padding: '8px' }}>
            {visibleItems.map((item) => (
              <UnstyledButton
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.icon && (
                  <div style={{ 
                    color: 'var(--primary)', 
                    marginTop: '2px',
                    flexShrink: 0,
                  }}>
                    <item.icon width={20} height={20} />
                  </div>
                )}
                
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Text 
                    size="sm" 
                    fw={500}
                    style={{ 
                      color: 'var(--foreground)',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.description && (
                    <Text 
                      size="xs" 
                      c="dimmed"
                      style={{ 
                        lineHeight: 1.3,
                        marginTop: '2px',
                      }}
                    >
                      {item.description}
                    </Text>
                  )}
                </Stack>
              </UnstyledButton>
            ))}
          </div>
        </Paper>
      )}

      <style>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};