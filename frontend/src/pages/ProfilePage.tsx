import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Form components not available yet
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Save, X, User, Settings, Shield, Bell } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const handleSaveProfile = async (data: ProfileFormValues) => {
    console.log('Profile data:', data);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'counselor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'student': return 'from-orange-500 to-orange-600';
      case 'counselor': return 'from-yellow-500 to-yellow-600';
      case 'admin': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className={`bg-gradient-to-br ${getThemeColor(currentTheme)} text-white text-xl`}>
                    {(user?.firstName || 'U')[0]}{(user?.lastName || 'U')[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <CardTitle className="text-2xl">
                    {user?.firstName} {user?.lastName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user?.role || '')}>
                      {user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User'}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
              
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                        <Input 
                          id="firstName"
                          placeholder="Enter your first name" 
                          {...form.register('firstName')}
                          className={form.formState.errors.firstName ? 'border-red-500' : ''}
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                        <Input 
                          id="lastName"
                          placeholder="Enter your last name" 
                          {...form.register('lastName')}
                          className={form.formState.errors.lastName ? 'border-red-500' : ''}
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input 
                        id="email"
                        placeholder="Enter your email" 
                        type="email" 
                        {...form.register('email')}
                        className={form.formState.errors.email ? 'border-red-500' : ''}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-gradient-to-r ${getThemeColor(currentTheme)} hover:opacity-90 gap-2`}
                      >
                        <Save className="h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                        <p className="mt-1 text-sm">{user?.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                        <p className="mt-1 text-sm">{user?.lastName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <p className="mt-1 text-sm">{user?.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                      <p className="mt-1 text-sm">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Security features are currently being developed. Stay tuned for password management and two-factor authentication.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" disabled>
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" disabled>
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    Notification settings will be available in the next update. You'll be able to customize email and push notifications.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>
                  Customize your app experience and theme settings
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Current Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Theme
                    </p>
                  </div>
                  <Badge className={getRoleColor(currentTheme)}>
                    Active
                  </Badge>
                </div>

                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Additional preference settings including language, timezone, and accessibility options will be added soon.
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

export default ProfilePage;