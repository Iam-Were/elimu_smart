import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/button';
import {
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { useThemeContext } from '../../hooks/useThemeContext';

interface PreferencesSettingsProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ onUnsavedChanges }) => {
  const { isDark, toggleDarkMode } = useThemeContext();
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Africa/Nairobi');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
    onUnsavedChanges?.(false);
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Use dark theme for the interface</p>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language-select">Language</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Choose your preferred language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Kiswahili</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred language
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone-select">Timezone</Label>
            <Select value={timezone} onValueChange={(value) => setTimezone(value)}>
              <SelectTrigger id="timezone-select">
                <SelectValue placeholder="Your local timezone for scheduling" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Your local timezone for scheduling
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-format-select">Date Format</Label>
            <Select value={dateFormat} onValueChange={(value) => setDateFormat(value)}>
              <SelectTrigger id="date-format-select">
                <SelectValue placeholder="How dates should be displayed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How dates should be displayed
            </p>
          </div>
        </CardContent>
      </Card>

      {saveStatus === 'success' && (
        <Alert>
          <CheckCircledIcon width={16} height={16} />
          <AlertDescription>
            Preferences updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="flex items-center space-x-2"
        >
          <CheckCircledIcon width={16} height={16} />
          <span>Save Preferences</span>
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSettings;
