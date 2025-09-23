import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/button';
import {
  DownloadIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

interface AccountManagementProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

const AccountManagement: React.FC<AccountManagementProps> = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // Simulate file download
    const element = document.createElement('a');
    element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ message: 'Your data export' }));
    element.download = 'elimu-smart-data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteAccount = () => {
    if (confirmText === 'DELETE') {
      console.log('Account deletion confirmed');
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DownloadIcon width={20} height={20} className="text-primary" />
            <span>Export Your Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download a copy of all your data including profile information, assessment results, 
            and activity history. This may take a few minutes to prepare.
          </p>

          <Alert>
            <AlertDescription>
              Your data export will include your profile, assessment results, messages, and activity logs. 
              This information will be provided in JSON format.
            </AlertDescription>
          </Alert>

          <div className="flex justify-start">
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              <DownloadIcon width={16} height={16} />
              <span>{isExporting ? 'Preparing Export...' : 'Export My Data'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deactivation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExclamationTriangleIcon width={20} height={20} className="text-yellow-600" />
            <span>Deactivate Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Temporarily deactivate your account. You can reactivate it anytime by logging back in. 
            Your data will be preserved.
          </p>

          <Alert>
            <AlertDescription>
              Deactivating your account will hide your profile and prevent others from seeing your information. 
              You can reactivate anytime by logging in again.
            </AlertDescription>
          </Alert>

          <div className="flex justify-start">
            <Button
              variant="outline"
              className="flex items-center space-x-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              <ExclamationTriangleIcon width={16} height={16} />
              <span>Deactivate Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-2 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <TrashIcon width={20} height={20} />
            <span>Delete Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Warning: This action is permanent!</p>
                <p className="text-sm">
                  Deleting your account will permanently remove all your data including:
                </p>
                <ul className="ml-4 mt-2 text-sm list-disc space-y-1">
                  <li>Profile information and settings</li>
                  <li>Assessment results and progress</li>
                  <li>Messages and conversation history</li>
                  <li>All activity logs and preferences</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex justify-start">
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <TrashIcon width={16} height={16} />
                  <span>Delete My Account</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">This action cannot be undone!</p>
                        <p className="text-sm">
                          All your data will be permanently deleted and cannot be recovered.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-delete">Type 'DELETE' to confirm</Label>
                    <Input
                      id="confirm-delete"
                      placeholder="DELETE"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                    />
                    {confirmText && confirmText !== 'DELETE' && (
                      <p className="text-sm text-destructive">Please type DELETE exactly</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDeleteModalOpen(false);
                        setConfirmText('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={confirmText !== 'DELETE'}
                      className="flex items-center space-x-2"
                    >
                      <TrashIcon width={16} height={16} />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManagement;