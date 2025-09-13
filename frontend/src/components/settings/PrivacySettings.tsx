import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EyeNoneIcon, LockClosedIcon } from '@radix-ui/react-icons';

interface PrivacySettingsProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onUnsavedChanges }) => {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [shareAssessments, setShareAssessments] = useState(false);
  const [shareProgress, setShareProgress] = useState(true);
  const [allowContacting, setAllowContacting] = useState(true);
  const [analyticsOptOut, setAnalyticsOptOut] = useState(false);
  const [dataRetention, setDataRetention] = useState('5-years');

  const handleSettingChange = (setter: (value: boolean) => void, value: boolean) => {
    setter(value);
  onUnsavedChanges?.(true);
  };

  const handleSelectChange = (setter: (value: string) => void, value: string) => {
    setter(value);
  onUnsavedChanges?.(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Control how your information is shared and used on the platform.
        </p>
      </div>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <EyeNoneIcon className="w-5 h-5" />
            <span>Profile Visibility</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-visibility">Who can see your profile?</Label>
              <Select 
                value={profileVisibility} 
                onValueChange={(value) => handleSelectChange(setProfileVisibility, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="counselors">Counselors & Students</SelectItem>
                  <SelectItem value="private">Private - Only you</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="share-assessments">Share Assessment Results</Label>
                <p className="text-sm text-muted-foreground">
                  Allow counselors to see your assessment results
                </p>
              </div>
              <Switch
                id="share-assessments"
                checked={shareAssessments}
                onCheckedChange={(checked) => handleSettingChange(setShareAssessments, checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="share-progress">Share Learning Progress</Label>
                <p className="text-sm text-muted-foreground">
                  Show your learning milestones and achievements
                </p>
              </div>
              <Switch
                id="share-progress"
                checked={shareProgress}
                onCheckedChange={(checked) => handleSettingChange(setShareProgress, checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LockClosedIcon className="w-5 h-5" />
            <span>Communication Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-contacting">Allow Direct Contact</Label>
              <p className="text-sm text-muted-foreground">
                Let counselors and other students contact you directly
              </p>
            </div>
            <Switch
              id="allow-contacting"
              checked={allowContacting}
              onCheckedChange={(checked) => handleSettingChange(setAllowContacting, checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LockClosedIcon className="w-5 h-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics-opt-out">Opt-out of Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Disable anonymous usage analytics and tracking
              </p>
            </div>
            <Switch
              id="analytics-opt-out"
              checked={analyticsOptOut}
              onCheckedChange={(checked) => handleSettingChange(setAnalyticsOptOut, checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-retention">Data Retention Period</Label>
            <Select 
              value={dataRetention} 
              onValueChange={(value) => handleSelectChange(setDataRetention, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-year">1 Year</SelectItem>
                <SelectItem value="3-years">3 Years</SelectItem>
                <SelectItem value="5-years">5 Years (Recommended)</SelectItem>
                <SelectItem value="indefinite">Keep Indefinitely</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How long we keep your assessment and progress data
            </p>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          Your privacy is important to us. We only collect data necessary to provide our services. 
          You can request data deletion at any time by contacting our support team.
        </AlertDescription>
      </Alert>
    </div>
  );
};
