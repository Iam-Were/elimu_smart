import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  UserIcon, 
  LockIcon, 
  BellIcon, 
  EyeIcon, 
  SettingsIcon, 
  CameraIcon,
  SaveIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsTab {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSettingsProps {
  onSave?: (settings: AdminSettingsData) => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
  className?: string;
}

interface AdminSettingsData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    role: string;
    profileImage?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    ipRestrictionEnabled: boolean;
    allowedIPs: string[];
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    systemMaintenance: boolean;
    securityAlerts: boolean;
    userReports: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityLogging: boolean;
    dataRetention: number;
    analyticsSharing: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  onSave,
  onUnsavedChanges,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  // Initial settings data - in real app this would come from props or API
  const [settings, setSettings] = useState<AdminSettingsData>({
    profile: {
      firstName: 'Admin',
      lastName: 'User', 
      email: 'admin@elimu.com',
      department: 'Platform Operations',
      role: 'Platform Administrator',
      profileImage: undefined
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      ipRestrictionEnabled: false,
      allowedIPs: []
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      systemMaintenance: true,
      securityAlerts: true,
      userReports: true
    },
    privacy: {
      profileVisible: false,
      activityLogging: true,
      dataRetention: 90,
      analyticsSharing: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light'
    }
  });

  const settingsTabs: SettingsTab[] = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage personal information and profile settings',
      icon: UserIcon,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Password, two-factor authentication, and access control',
      icon: LockIcon,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Alert preferences and communication settings',
      icon: BellIcon,
    },
    {
      id: 'privacy',
      label: 'Privacy',
      description: 'Data handling and visibility settings',
      icon: EyeIcon,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Language, timezone, and interface settings',
      icon: SettingsIcon,
    },
  ];

  const updateSettings = (section: keyof AdminSettingsData, field: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
    onUnsavedChanges?.(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(settings);
      setHasUnsavedChanges(false);
      setSavedSuccessfully(true);
      onUnsavedChanges?.(false);
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
            {settings.profile.profileImage ? (
              <img src={settings.profile.profileImage} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <UserIcon className="h-8 w-8 text-purple-600" />
            )}
          </div>
          <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700">
            <CameraIcon className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {settings.profile.firstName} {settings.profile.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{settings.profile.role}</p>
          <Badge className="mt-1 bg-purple-100 text-purple-800 border border-purple-200">
            {settings.profile.department}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
          <Input
            value={settings.profile.firstName}
            onChange={(e) => updateSettings('profile', 'firstName', e.target.value)}
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
          <Input
            value={settings.profile.lastName}
            onChange={(e) => updateSettings('profile', 'lastName', e.target.value)}
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <Input
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateSettings('profile', 'email', e.target.value)}
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
          <Input
            value={settings.profile.department}
            onChange={(e) => updateSettings('profile', 'department', e.target.value)}
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={settings.security.twoFactorEnabled}
            onCheckedChange={(checked) => updateSettings('security', 'twoFactorEnabled', checked)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout (minutes)</label>
          <Input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">IP Address Restrictions</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Restrict access to specific IP addresses</p>
          </div>
          <Switch
            checked={settings.security.ipRestrictionEnabled}
            onCheckedChange={(checked) => updateSettings('security', 'ipRestrictionEnabled', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      {Object.entries(settings.notifications).map(([key, value]) => {
        const labels: Record<string, string> = {
          emailAlerts: 'Email Alerts',
          smsAlerts: 'SMS Alerts',
          systemMaintenance: 'System Maintenance Notifications',
          securityAlerts: 'Security Alerts',
          userReports: 'User Report Notifications'
        };

        return (
          <div key={key} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{labels[key]}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive {labels[key].toLowerCase()} for important updates
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => updateSettings('notifications', key, checked)}
            />
          </div>
        );
      })}
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Profile Visibility</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to other administrators</p>
        </div>
        <Switch
          checked={settings.privacy.profileVisible}
          onCheckedChange={(checked) => updateSettings('privacy', 'profileVisible', checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Activity Logging</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Log your administrative actions for audit purposes</p>
        </div>
        <Switch
          checked={settings.privacy.activityLogging}
          onCheckedChange={(checked) => updateSettings('privacy', 'activityLogging', checked)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Retention (days)</label>
        <Input
          type="number"
          value={settings.privacy.dataRetention}
          onChange={(e) => updateSettings('privacy', 'dataRetention', parseInt(e.target.value))}
          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select
            value={settings.preferences.language}
            onChange={(e) => updateSettings('preferences', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
          <select
            value={settings.preferences.timezone}
            onChange={(e) => updateSettings('preferences', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="UTC">UTC</option>
            <option value="EAT">East Africa Time</option>
            <option value="EST">Eastern Standard Time</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
          <select
            value={settings.preferences.dateFormat}
            onChange={(e) => updateSettings('preferences', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <select
            value={settings.preferences.theme}
            onChange={(e) => updateSettings('preferences', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={cn("bg-white dark:bg-gray-800", className)}>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-purple-900 dark:text-purple-100">
              Admin Settings
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your administrative account and preferences
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {savedSuccessfully && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-sm">Saved successfully</span>
              </div>
            )}
            
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertTriangleIcon className="h-4 w-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <SaveIcon className="h-4 w-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-purple-50 dark:bg-purple-900/20">
            {settingsTabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile" className="space-y-4">
              {renderProfileTab()}
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              {renderSecurityTab()}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              {renderNotificationsTab()}
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              {renderPrivacyTab()}
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              {renderPreferencesTab()}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;