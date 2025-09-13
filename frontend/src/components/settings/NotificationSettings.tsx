import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellIcon, EnvelopeClosedIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

interface NotificationSettingsProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onUnsavedChanges }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [assessmentReminders, setAssessmentReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [frequency, setFrequency] = useState('daily');

  const handleSettingChange = (setter: (value: boolean) => void, value: boolean) => {
    setter(value);
  onUnsavedChanges?.(true);
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  onUnsavedChanges?.(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Choose how you want to receive notifications and updates.
        </p>
      </div>

      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellIcon className="w-5 h-5" />
            <span>Communication Channels</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => handleSettingChange(setEmailNotifications, checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={(checked) => handleSettingChange(setPushNotifications, checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via SMS (charges may apply)
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={(checked) => handleSettingChange(setSmsNotifications, checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChatBubbleIcon className="w-5 h-5" />
            <span>Content Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="job-alerts">Job Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about relevant job opportunities
              </p>
            </div>
            <Switch
              id="job-alerts"
              checked={jobAlerts}
              onCheckedChange={(checked) => handleSettingChange(setJobAlerts, checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="assessment-reminders">Assessment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders for upcoming assessments and deadlines
              </p>
            </div>
            <Switch
              id="assessment-reminders"
              checked={assessmentReminders}
              onCheckedChange={(checked) => handleSettingChange(setAssessmentReminders, checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Weekly summary of your progress and new opportunities
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={weeklyDigest}
              onCheckedChange={(checked) => handleSettingChange(setWeeklyDigest, checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <EnvelopeClosedIcon className="w-5 h-5" />
            <span>Email Frequency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email-frequency">How often should we send email updates?</Label>
            <Select value={frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          You can unsubscribe from any email notifications at any time using the links in our emails.
        </AlertDescription>
      </Alert>
    </div>
  );
};
