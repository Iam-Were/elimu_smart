import React, { useState } from 'react';
import {
  Group,
  ActionIcon,
  TextInput,
  Badge,
  Title,
  Burger,
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleIcon,
  HomeIcon,
} from '@radix-ui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProfileDropdown } from './ProfileDropdown';
import { GlobalSearch, useGlobalSearchShortcut } from './GlobalSearch';
import { HeaderNavigation } from '../navigation/HeaderNavigation';
import { useDisclosure } from '@mantine/hooks';

interface IntelligentHeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  notificationCount?: number;
  messageCount?: number;
  onToggleSidebar?: () => void;
  showNavigation?: boolean;
}

export const IntelligentHeader: React.FC<IntelligentHeaderProps> = ({
  showSearch = true,
  searchPlaceholder = "Search Elimu Smart...",
  notificationCount = 0,
  messageCount = 0,
  onToggleSidebar,
  showNavigation = true,
}) => {
  const [, setSearchFocused] = useState(false);
  const [searchOpened, { toggle: toggleSearch }] = useDisclosure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add global search shortcut
  useGlobalSearchShortcut(toggleSearch);

  const handleNotificationClick = () => {
    // Navigate to notifications page or open notifications panel
    navigate('/notifications');
  };

  const handleMessageClick = () => {
    // Navigate to messages page or open messages panel
    navigate('/messages');
  };

  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <>
      <header
        className="app-header linkedin-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '52px',
          backgroundColor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.2s ease',
          boxShadow: '0 0 0 1px var(--border)',
        }}
      >
        <div
          className="header-container"
          style={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Left Section - Logo, Brand and Navigation */}
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {onToggleSidebar && (
            <Burger
              onClick={onToggleSidebar}
              hiddenFrom="sm"
              size="sm"
              style={{ marginRight: '0.5rem' }}
            />
          )}
          
            <Group gap="sm" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <div
                className="logo"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                E
              </div>
              <Title
                order={3}
                className="app-title"
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  margin: 0,
                  display: 'none',
                }}
              >
                Elimu Smart
              </Title>
            </Group>
            
            {/* Navigation */}
            {showNavigation && (
              <HeaderNavigation className="desktop-nav" />
            )}
          </div>

          {/* Center Section - Global Search */}
          {showSearch && (
            <div
              className="header-center"
              style={{
                flex: 1,
                maxWidth: '400px',
                margin: '0 2rem',
              }}
            >
              <div className="global-search" style={{ position: 'relative', width: '100%' }}>
                <TextInput
                  placeholder={searchPlaceholder}
                  leftSection={<MagnifyingGlassIcon width={16} height={16} />}
                  onFocus={() => {
                    setSearchFocused(true);
                    toggleSearch();
                  }}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    width: '100%',
                  }}
                  styles={{
                    input: {
                      borderRadius: '4px',
                      backgroundColor: 'var(--muted)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s ease',
                      paddingLeft: '2.5rem',
                      fontSize: '14px',
                      height: '36px',
                      '&::placeholder': {
                        color: 'var(--muted-foreground)',
                      },
                      '&:focus': {
                        borderColor: 'var(--primary)',
                        backgroundColor: 'var(--background)',
                        boxShadow: 'inset 0 0 0 1px var(--primary)',
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Right Section - Actions and Profile */}
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Navigation for smaller screens */}
          {!isHomePage && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => navigate('/dashboard')}
              style={{
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
              }}
              aria-label="Go to Dashboard"
            >
              <HomeIcon width={20} height={20} />
            </ActionIcon>
          )}

          {/* Notifications */}
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={handleNotificationClick}
            style={{
              position: 'relative',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease',
            }}
            aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount})` : ''}`}
          >
            <BellIcon width={20} height={20} />
            {notificationCount > 0 && (
              <Badge
                size="xs"
                variant="filled"
                color="red"
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </ActionIcon>

          {/* Messages */}
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={handleMessageClick}
            style={{
              position: 'relative',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease',
            }}
            aria-label={`Messages ${messageCount > 0 ? `(${messageCount})` : ''}`}
          >
            <ChatBubbleIcon width={20} height={20} />
            {messageCount > 0 && (
              <Badge
                size="xs"
                variant="filled"
                color="blue"
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {messageCount > 99 ? '99+' : messageCount}
              </Badge>
            )}
          </ActionIcon>

            {/* Profile Dropdown */}
            {user && <ProfileDropdown />}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpened && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10vh',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out',
          }}
          onClick={toggleSearch}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '600px',
              height: 'fit-content',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlobalSearch className="w-full" />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          
          .header-container {
            padding: 0 16px !important;
          }
        }

        @media (max-width: 768px) {
          .header-left .app-title {
            display: none !important;
          }

          .header-center {
            margin: 0 0.75rem !important;
            max-width: 200px !important;
          }

          .header-right {
            gap: 0.25rem !important;
          }
        }

        @media (max-width: 640px) {
          .header-center {
            display: none !important;
          }
          
          .header-container {
            padding: 0 12px !important;
          }
        }
      `}</style>
    </>
  );
};