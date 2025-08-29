import React, { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  TextInput,
  Textarea,
  Button,
  Avatar,
  FileInput,
  Grid,
  Alert,
} from '@mantine/core';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';

interface ProfileSettingsProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onUnsavedChanges }) => {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    linkedIn: '',
    twitter: '',
    profileImage: null as File | null,
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    onUnsavedChanges(hasChanges);
  }, [formData, originalData, onUnsavedChanges]);

  const getThemeColor = () => {
    switch (currentTheme) {
      case 'admin':
        return '#a855f7';
      case 'counselor':
        return '#eab308';
      default:
        return '#f97316';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveStatus('idle');
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, profileImage: file }));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update original data to match current form data
      setOriginalData(formData);
      setSaveStatus('success');
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setSaveStatus('idle');
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  return (
    <Stack gap="xl">
      {/* Profile Picture Section */}
      <div>
        <Text size="lg" fw={600} mb="md">
          Profile Picture
        </Text>
        <Group gap="lg" align="flex-start">
          <Avatar
            size={80}
            radius="xl"
            color={currentTheme}
            style={{
              backgroundColor: getThemeColor(),
            }}
          >
            {formData.firstName?.[0]}{formData.lastName?.[0]}
          </Avatar>
          <Stack gap="sm" style={{ flex: 1 }}>
            <FileInput
              placeholder="Choose profile picture"
              accept="image/*"
              leftSection={<UploadIcon width={16} height={16} />}
              onChange={handleFileChange}
              clearable
            />
            <Text size="xs" c="dimmed">
              Recommended: Square image, at least 400x400px, max 5MB. Supported formats: JPG, PNG, GIF.
            </Text>
          </Stack>
        </Group>
      </div>

      {/* Basic Information */}
      <div>
        <Text size="lg" fw={600} mb="md">
          Basic Information
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              type="email"
              required
              description="This is your login email and cannot be changed here"
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              type="tel"
            />
          </Grid.Col>
        </Grid>
      </div>

      {/* Additional Information */}
      <div>
        <Text size="lg" fw={600} mb="md">
          Additional Information
        </Text>
        <Stack gap="md">
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            minRows={3}
            maxRows={6}
            autosize
            description="A brief description about yourself (max 500 characters)"
          />
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                type="url"
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </div>

      {/* Social Links */}
      <div>
        <Text size="lg" fw={600} mb="md">
          Social Links
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="LinkedIn Profile"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedIn}
              onChange={(e) => handleInputChange('linkedIn', e.target.value)}
              type="url"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Twitter Profile"
              placeholder="https://twitter.com/username"
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              type="url"
            />
          </Grid.Col>
        </Grid>
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <Alert
          icon={<CheckCircledIcon width={16} height={16} />}
          color="green"
          variant="light"
        >
          Profile updated successfully!
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert
          icon={<ExclamationTriangleIcon width={16} height={16} />}
          color="red"
          variant="light"
        >
          Failed to update profile. Please try again.
        </Alert>
      )}

      {/* Action Buttons */}
      <Group justify="flex-end" gap="sm">
        <Button
          variant="light"
          onClick={handleCancel}
          disabled={!hasChanges || isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          loading={isLoading}
          disabled={!hasChanges}
          leftSection={<CheckCircledIcon width={16} height={16} />}
        >
          Save Changes
        </Button>
      </Group>
    </Stack>
  );
};