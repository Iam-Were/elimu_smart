import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/hooks/useAuth';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PersonIcon className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Name</h4>
            <p className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <h4 className="font-medium">Email</h4>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div>
            <h4 className="font-medium">Role</h4>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <div className="pt-4">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;