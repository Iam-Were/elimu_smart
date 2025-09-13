import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { Card as Paper } from '@/components/ui/card';
import { Separator as Divider } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  PersonIcon,
  LockClosedIcon,
  BellIcon,
  EyeOpenIcon,
  GearIcon,
  TrashIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../hooks/useAuth';
// import type { User } from '../types'; // Unused after refactoring
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import PreferencesSettings from '../components/settings/PreferencesSettings';
import AccountManagement from '../components/settings/AccountManagement';

import type { User } from '../types';

interface SettingsTabComponentProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
  user?: User;
  profileImage?: string | null;
}

interface SettingsTab {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
  component: React.ComponentType<SettingsTabComponentProps>;
}

export const AccountSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profileImage] = useState<string | null>(user?.profileImage || null);

  const settingsTabs: SettingsTab[] = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage your personal information and profile settings',
      icon: PersonIcon,
      component: ProfileSettings,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Password, two-factor authentication, and session management',
      icon: LockClosedIcon,
      component: SecuritySettings,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Email and push notification preferences',
      icon: BellIcon,
      component: NotificationSettings,
    },
    {
      id: 'privacy',
      label: 'Privacy',
      description: 'Data sharing and profile visibility settings',
      icon: EyeOpenIcon,
      component: PrivacySettings,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Language, timezone, and appearance settings',
      icon: GearIcon,
      component: PreferencesSettings,
    },
    {
      id: 'account',
      label: 'Account Management',
      description: 'Export data, deactivate, or delete your account',
      icon: TrashIcon,
      component: AccountManagement,
    },
  ];

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  const handleTabChange = (tabId: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this section?'
      );
      if (!confirmed) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  // (Avatar upload functionality removed in shadcn migration; can be re-added later)

  const handleExportData = async () => {
    // TODO: Implement data export functionality
    console.log('Exporting user data...');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <Paper className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex gap-6">
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl font-semibold text-orange-600">
                {user?.firstName?.[0] || 'U'}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold">{user ? `${user.firstName} ${user.lastName}` : 'Your Name'}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.email || 'your.email@example.com'}</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="secondary">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member since {new Date().getFullYear()}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Profile Completion</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">85%</p>
                </div>
                <Progress value={85} />
                <p className="text-xs text-gray-500 mt-1">Complete your profile to unlock all features</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleExportData} className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </Paper>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Paper className="p-4 w-full md:w-64 h-fit sticky top-24 space-y-2">
          {settingsTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'primary' : 'ghost'}
                className={`w-full justify-start flex items-center gap-2 ${isActive ? '' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon width={16} height={16} />
                {tab.label}
              </Button>
            );
          })}
        </Paper>

        {/* Main content */}
        <div className="flex-1 space-y-6">
          <Paper className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {activeTabData?.icon && <activeTabData.icon width={24} height={24} />}
                <h2 className="text-xl font-semibold">{activeTabData?.label}</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{activeTabData?.description}</p>
            </div>
            <Divider />
            {ActiveComponent && (
              <ActiveComponent
                onUnsavedChanges={setHasUnsavedChanges}
                user={user || undefined}
                profileImage={profileImage}
              />
            )}
          </Paper>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4">
          <div>
            <p className="font-semibold">Unsaved Changes</p>
            <p className="text-sm opacity-90">You have unsaved changes that will be lost if you navigate away.</p>
          </div>
          <Button variant="secondary" onClick={() => setHasUnsavedChanges(false)}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};