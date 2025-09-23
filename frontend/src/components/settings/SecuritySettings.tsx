import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { LockClosedIcon } from '@radix-ui/react-icons';

const SecuritySettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockClosedIcon className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Setup 2FA</Button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Login Sessions</h4>
              <p className="text-sm text-muted-foreground">Manage your active sessions</p>
            </div>
            <Button variant="outline">View Sessions</Button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Security Log</h4>
              <p className="text-sm text-muted-foreground">View recent security events</p>
            </div>
            <Button variant="outline">View Log</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;