import React from 'react';
import { UnifiedInboxV2 } from '@/components/messaging/UnifiedInboxV2';
import { useThemeContext } from '@/hooks/useThemeContext';
import type { ThemeRole } from '@/types';

const UnifiedInboxPage: React.FC = () => {
  const { currentTheme } = useThemeContext();

  // Theme-specific page titles
  const getPageTitle = (theme: ThemeRole): string => {
    switch (theme) {
      case 'student':
        return 'Student Inbox';
      case 'counselor':
        return 'Counselor Inbox';
      case 'admin':
        return 'Admin Inbox';
      default:
        return 'Inbox';
    }
  };

  const getPageDescription = (theme: ThemeRole): string => {
    switch (theme) {
      case 'student':
        return 'Connect with counselors and mentors for guidance';
      case 'counselor':
        return 'Message your students and provide guidance';
      case 'admin':
        return 'Manage platform communications';
      default:
        return 'Your messages and conversations';
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Page Header - Optional, can be removed if using Sprint18Layout header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(currentTheme)}</h1>
        <p className="text-sm text-gray-600 mt-1">{getPageDescription(currentTheme)}</p>
      </div>

      {/* LinkedIn-Style Unified Inbox Component */}
      <div className="flex-1 overflow-hidden">
        <UnifiedInboxV2 />
      </div>
    </div>
  );
};

export default UnifiedInboxPage;
