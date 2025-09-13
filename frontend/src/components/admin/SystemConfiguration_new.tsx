import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  GearIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
  DownloadIcon,
  UploadIcon,
  LockClosedIcon,
  GlobeIcon,
  BellIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface SystemConfig {
  general: {
    platformName: string;
    platformDescription: string;
    supportEmail: string;
    maxFileUploadSize: number;
    sessionTimeout: number;
    maintenanceMode: boolean;
    allowUserRegistration: boolean;
    requireEmailVerification: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChar: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    encryptionEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    dailyDigest: boolean;
    systemAlerts: boolean;
    notificationRetentionDays: number;
  };
  content: {
    autoModeration: boolean;
    moderationStrictness: string;
    maxQuestionLength: number;
    maxAnswerLength: number;
    allowAnonymousQuestions: boolean;
    requireCounselorApproval: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheExpiration: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    maxConcurrentUsers: number;
    autoScaling: boolean;
  };
}

const defaultConfig: SystemConfig = {
  general: {
    platformName: 'Elimu Smart',
    platformDescription: 'Comprehensive career guidance platform for Kenyan students',
    supportEmail: 'support@elimu-smart.co.ke',
    maxFileUploadSize: 10,
    sessionTimeout: 60,
    maintenanceMode: false,
    allowUserRegistration: true,
    requireEmailVerification: true,
  },
  security: {
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
    encryptionEnabled: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyDigest: true,
    systemAlerts: true,
    notificationRetentionDays: 90,
  },
  content: {
    autoModeration: true,
    moderationStrictness: 'medium',
    maxQuestionLength: 1000,
    maxAnswerLength: 2000,
    allowAnonymousQuestions: true,
    requireCounselorApproval: false,
  },
  performance: {
    cacheEnabled: true,
    cacheExpiration: 3600,
    compressionEnabled: true,
    cdnEnabled: true,
    maxConcurrentUsers: 1000,
    autoScaling: true,
  },
};

export const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateConfig = (section: keyof SystemConfig, key: string, value: unknown) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Configuration Saved", {
      description: 'System configuration has been updated successfully',
    });
    
    setHasChanges(false);
    setIsLoading(false);
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
    toast.success("Reset to Defaults", {
      description: 'Configuration has been reset to default values',
    });
  };

  const exportConfiguration = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elimu-smart-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = () => {
    toast.success("Import Configuration", {
      description: 'File picker functionality would be implemented here',
    });
  };

  const restartSystem = () => {
    toast.success("System Restart Scheduled", {
      description: 'System will restart in 5 minutes to apply changes',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">System Configuration</h1>
            <p className="text-lg text-muted-foreground">
              Configure platform settings and system behavior
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Badge variant="secondary">Unsaved Changes</Badge>
            )}
            <Button variant="outline" onClick={exportConfiguration} className="gap-2">
              <DownloadIcon className="w-4 h-4" />
              Export Config
            </Button>
            <Button variant="outline" onClick={importConfiguration} className="gap-2">
              <UploadIcon className="w-4 h-4" />
              Import Config
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button
                  onClick={saveConfiguration}
                  disabled={!hasChanges || isLoading}
                  className="gap-2"
                >
                  <CheckCircledIcon className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
                <Button variant="outline" onClick={resetToDefaults} className="gap-2">
                  <ReloadIcon className="w-4 h-4" />
                  Reset to Defaults
                </Button>
              </div>
              <div className="flex gap-4 items-center">
                {config.general.maintenanceMode && (
                  <Alert className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <AlertDescription>Maintenance Mode Active</AlertDescription>
                  </Alert>
                )}
                <Button variant="outline" onClick={restartSystem} className="gap-2">
                  <ReloadIcon className="w-4 h-4" />
                  Restart System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="gap-2">
              <GearIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <LockClosedIcon className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <BellIcon className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <GlobeIcon className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <ReloadIcon className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={config.general.platformName}
                      onChange={(e) => updateConfig('general', 'platformName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      value={config.general.supportEmail}
                      onChange={(e) => updateConfig('general', 'supportEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={config.general.platformDescription}
                    onChange={(e) => updateConfig('general', 'platformDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                    <Input
                      id="maxFileUploadSize"
                      type="number"
                      min="1"
                      max="100"
                      value={config.general.maxFileUploadSize}
                      onChange={(e) => updateConfig('general', 'maxFileUploadSize', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="480"
                      value={config.general.sessionTimeout}
                      onChange={(e) => updateConfig('general', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">User Registration</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowUserRegistration"
                      checked={config.general.allowUserRegistration}
                      onCheckedChange={(checked) => updateConfig('general', 'allowUserRegistration', checked)}
                    />
                    <Label htmlFor="allowUserRegistration">Allow User Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireEmailVerification"
                      checked={config.general.requireEmailVerification}
                      onCheckedChange={(checked) => updateConfig('general', 'requireEmailVerification', checked)}
                      disabled={!config.general.allowUserRegistration}
                    />
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">System Status</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenanceMode"
                      checked={config.general.maintenanceMode}
                      onCheckedChange={(checked) => updateConfig('general', 'maintenanceMode', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, only administrators can access the platform
                      </p>
                    </div>
                  </div>
                  {config.general.maintenanceMode && (
                    <Alert>
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <AlertDescription>
                        Maintenance mode will prevent regular users from accessing the platform
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Password Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        min="6"
                        max="32"
                        value={config.security.passwordMinLength}
                        onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="passwordRequireSpecialChar"
                        checked={config.security.passwordRequireSpecialChar}
                        onCheckedChange={(checked) => updateConfig('security', 'passwordRequireSpecialChar', checked)}
                      />
                      <Label htmlFor="passwordRequireSpecialChar">Require Special Characters</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Login Security</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={config.security.maxLoginAttempts}
                        onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                      <Input
                        id="lockoutDuration"
                        type="number"
                        min="5"
                        max="120"
                        value={config.security.lockoutDuration}
                        onChange={(e) => updateConfig('security', 'lockoutDuration', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Advanced Security</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="twoFactorEnabled"
                      checked={config.security.twoFactorEnabled}
                      onCheckedChange={(checked) => updateConfig('security', 'twoFactorEnabled', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin and counselor accounts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encryptionEnabled"
                      checked={config.security.encryptionEnabled}
                      onCheckedChange={(checked) => updateConfig('security', 'encryptionEnabled', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="encryptionEnabled">Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt sensitive data at rest
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Notification Channels</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={config.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateConfig('notifications', 'emailNotifications', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smsNotifications"
                      checked={config.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateConfig('notifications', 'smsNotifications', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pushNotifications"
                      checked={config.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateConfig('notifications', 'pushNotifications', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Notification Types</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dailyDigest"
                      checked={config.notifications.dailyDigest}
                      onCheckedChange={(checked) => updateConfig('notifications', 'dailyDigest', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="dailyDigest">Daily Digest</Label>
                      <p className="text-sm text-muted-foreground">Send daily summary emails to users</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="systemAlerts"
                      checked={config.notifications.systemAlerts}
                      onCheckedChange={(checked) => updateConfig('notifications', 'systemAlerts', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="systemAlerts">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Send critical system alerts to administrators</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="notificationRetentionDays">Notification Retention (days)</Label>
                  <Input
                    id="notificationRetentionDays"
                    type="number"
                    min="30"
                    max="365"
                    value={config.notifications.notificationRetentionDays}
                    onChange={(e) => updateConfig('notifications', 'notificationRetentionDays', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">How long to keep notification records</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Content Moderation</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoModeration"
                      checked={config.content.autoModeration}
                      onCheckedChange={(checked) => updateConfig('content', 'autoModeration', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="autoModeration">Automatic Moderation</Label>
                      <p className="text-sm text-muted-foreground">Automatically review content using AI</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moderationStrictness">Moderation Strictness</Label>
                    <Select
                      value={config.content.moderationStrictness}
                      onValueChange={(value) => updateConfig('content', 'moderationStrictness', value)}
                      disabled={!config.content.autoModeration}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minimal filtering</SelectItem>
                        <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                        <SelectItem value="high">High - Strict filtering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Content Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxQuestionLength">Max Question Length (characters)</Label>
                      <Input
                        id="maxQuestionLength"
                        type="number"
                        min="100"
                        max="5000"
                        value={config.content.maxQuestionLength}
                        onChange={(e) => updateConfig('content', 'maxQuestionLength', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAnswerLength">Max Answer Length (characters)</Label>
                      <Input
                        id="maxAnswerLength"
                        type="number"
                        min="100"
                        max="10000"
                        value={config.content.maxAnswerLength}
                        onChange={(e) => updateConfig('content', 'maxAnswerLength', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Content Policies</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowAnonymousQuestions"
                      checked={config.content.allowAnonymousQuestions}
                      onCheckedChange={(checked) => updateConfig('content', 'allowAnonymousQuestions', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="allowAnonymousQuestions">Allow Anonymous Questions</Label>
                      <p className="text-sm text-muted-foreground">
                        Users can submit questions without revealing identity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireCounselorApproval"
                      checked={config.content.requireCounselorApproval}
                      onCheckedChange={(checked) => updateConfig('content', 'requireCounselorApproval', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="requireCounselorApproval">Require Counselor Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        All answers must be approved by counselors
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance & Scaling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Caching</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cacheEnabled"
                      checked={config.performance.cacheEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="cacheEnabled">Enable Caching</Label>
                      <p className="text-sm text-muted-foreground">Cache frequently accessed data</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cacheExpiration">Cache Expiration (seconds)</Label>
                    <Input
                      id="cacheExpiration"
                      type="number"
                      min="300"
                      max="86400"
                      value={config.performance.cacheExpiration}
                      onChange={(e) => updateConfig('performance', 'cacheExpiration', parseInt(e.target.value))}
                      disabled={!config.performance.cacheEnabled}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Optimization</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compressionEnabled"
                      checked={config.performance.compressionEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'compressionEnabled', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="compressionEnabled">Enable Compression</Label>
                      <p className="text-sm text-muted-foreground">Compress responses to reduce bandwidth</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cdnEnabled"
                      checked={config.performance.cdnEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'cdnEnabled', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="cdnEnabled">Enable CDN</Label>
                      <p className="text-sm text-muted-foreground">
                        Use content delivery network for static assets
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Scaling</h4>
                  <div className="space-y-2">
                    <Label htmlFor="maxConcurrentUsers">Max Concurrent Users</Label>
                    <Input
                      id="maxConcurrentUsers"
                      type="number"
                      min="100"
                      max="10000"
                      value={config.performance.maxConcurrentUsers}
                      onChange={(e) => updateConfig('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoScaling"
                      checked={config.performance.autoScaling}
                      onCheckedChange={(checked) => updateConfig('performance', 'autoScaling', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="autoScaling">Auto Scaling</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically scale resources based on demand
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircledIcon className="w-4 h-4" />
                  <AlertDescription>
                    Performance changes may require a system restart to take effect
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
