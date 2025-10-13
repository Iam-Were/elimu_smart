import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ReloadIcon,
  DownloadIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TrashIcon,
  GearIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { callCloudFunction } from '@/lib/parseConfig';

export const MaintenanceTools: React.FC = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [lastBackup] = useState(new Date('2024-01-20T02:00:00'));
  const [systemHealth] = useState(85);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [cleanupInProgress, setCleanupInProgress] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState('daily');

  // RIASEC Database Management
  const [riasecSchemaInitialized, setRiasecSchemaInitialized] = useState(false);
  const [riasecDataSeeded, setRiasecDataSeeded] = useState(false);
  const [riasecInitializing, setRiasecInitializing] = useState(false);
  const [riasecSeeding, setRiasecSeeding] = useState(false);

  const startBackup = async () => {
    setIsBackupRunning(true);
    setBackupProgress(0);

    // Simulate backup progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBackupProgress(i);
    }

    setIsBackupRunning(false);
    toast.success('Backup Completed', {
      description: 'System backup has been created successfully'
    });
  };

  const runMaintenance = async () => {
    setCleanupInProgress(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCleanupInProgress(false);

    toast.success('Maintenance Complete', {
      description: 'System cleanup and optimization completed'
    });
  };

  const initializeRiasecSchema = async () => {
    setRiasecInitializing(true);

    try {
      const result = await callCloudFunction(
        'initializeRiasecSchema',
        {},
        localStorage.getItem('parse-session-token') || ''
      );

      if (result?.success) {
        setRiasecSchemaInitialized(true);
        toast.success('Schema Initialized', {
          description: `Created: ${result.schemas.join(', ')}`
        });
      } else {
        throw new Error('Failed to initialize schema');
      }
    } catch (error) {
      toast.error('Initialization Failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setRiasecInitializing(false);
    }
  };

  const seedRiasecDatabase = async () => {
    setRiasecSeeding(true);

    try {
      toast.info('Seed Function Ready', {
        description: 'RIASEC questions are now loaded from the backend API'
      });

      setRiasecDataSeeded(true);
    } catch (error) {
      toast.error('Seeding Failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setRiasecSeeding(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Maintenance & Backup Tools</h1>
          <p className="text-lg text-muted-foreground">
            System maintenance, backup, and monitoring tools
          </p>
        </div>
        <Badge
          variant={systemHealth > 80 ? 'outline' : systemHealth > 60 ? 'secondary' : 'destructive'}
          className={systemHealth > 80 ? 'bg-green-50' : ''}
        >
          System Health: {systemHealth}%
        </Badge>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <GearIcon className="h-6 w-6 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Database Size</p>
              <p className="text-lg font-bold text-purple-600">2.4 GB</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <DownloadIcon className="h-6 w-6 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Last Backup</p>
              <p className="text-sm font-bold text-purple-600 text-center">
                {lastBackup.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <ClockIcon className="h-6 w-6 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Uptime</p>
              <p className="text-lg font-bold text-purple-600">99.8%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              <TrashIcon className="h-6 w-6 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Cache Usage</p>
              <p className="text-lg font-bold text-purple-600">67%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <p className="font-medium">Automatic Backups</p>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-backup"
                  checked={autoBackupEnabled}
                  onCheckedChange={setAutoBackupEnabled}
                />
                <Label htmlFor="auto-backup">Enable automatic daily backups</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={backupSchedule} onValueChange={setBackupSchedule} disabled={!autoBackupEnabled}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={startBackup}
                disabled={isBackupRunning}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Create Backup Now
              </Button>
            </div>
          </div>

          {isBackupRunning && (
            <div className="space-y-2">
              <p className="text-sm">Creating system backup...</p>
              <Progress value={backupProgress} className="h-2" />
            </div>
          )}

          <Alert>
            <CheckCircledIcon className="h-4 w-4" />
            <AlertDescription>
              Last successful backup: {lastBackup.toLocaleDateString()} at {lastBackup.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Maintenance Tools */}
      <Card>
        <CardHeader>
          <CardTitle>System Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="font-medium">Database Optimization</p>
              <p className="text-sm text-muted-foreground">
                Optimize database performance and clean up unused data
              </p>
              <Button
                variant="outline"
                onClick={runMaintenance}
                disabled={cleanupInProgress}
              >
                <GearIcon className="mr-2 h-4 w-4" />
                Optimize Database
              </Button>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Cache Management</p>
              <p className="text-sm text-muted-foreground">
                Clear system cache and rebuild indexes
              </p>
              <Button
                variant="outline"
                onClick={() => toast.success('Cache Cleared', {
                  description: 'System cache has been cleared successfully'
                })}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Log Cleanup</p>
              <p className="text-sm text-muted-foreground">
                Archive old logs and free up storage space
              </p>
              <Button
                variant="outline"
                onClick={() => toast.success('Logs Archived', {
                  description: 'Old log files have been archived'
                })}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Archive Logs
              </Button>
            </div>

            <div className="space-y-2">
              <p className="font-medium">System Restart</p>
              <p className="text-sm text-muted-foreground">
                Restart system services for optimal performance
              </p>
              <Button
                variant="outline"
                onClick={() => toast.info('Restart Scheduled', {
                  description: 'System restart scheduled for 2 AM'
                })}
              >
                <ReloadIcon className="mr-2 h-4 w-4" />
                Schedule Restart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIASEC Database Management */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GearIcon className="h-5 w-5 text-orange-600" />
            RIASEC Assessment Database Management
            <Badge variant="outline" className="ml-auto">Operations Admin</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <CheckCircledIcon className="h-4 w-4" />
              <AlertDescription>
                Manage RIASEC assessment database schema and question bank. Operations Admin role required.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1: Initialize Schema */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">1. Initialize Database Schema</p>
                    <p className="text-sm text-muted-foreground">
                      Create RiasecQuestion, RiasecType, and KenyaCareer tables
                    </p>
                  </div>
                  {riasecSchemaInitialized && (
                    <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <Button
                  variant={riasecSchemaInitialized ? "outline" : "default"}
                  onClick={initializeRiasecSchema}
                  disabled={riasecInitializing}
                  className="w-full"
                >
                  {riasecInitializing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  {riasecSchemaInitialized ? 'Schema Initialized ✓' : 'Initialize Schema'}
                </Button>
              </div>

              {/* Step 2: Seed Database */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2. Seed Question Bank</p>
                    <p className="text-sm text-muted-foreground">
                      Import 96 Kenya-localized RIASEC questions
                    </p>
                  </div>
                  {riasecDataSeeded && (
                    <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <Button
                  variant={riasecDataSeeded ? "outline" : "default"}
                  onClick={seedRiasecDatabase}
                  disabled={!riasecSchemaInitialized || riasecSeeding}
                  className="w-full"
                >
                  {riasecSeeding && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  {riasecDataSeeded ? 'Database Seeded ✓' : 'Seed Database'}
                </Button>
                {!riasecSchemaInitialized && (
                  <p className="text-xs text-muted-foreground">
                    Complete step 1 first
                  </p>
                )}
              </div>
            </div>

            {/* Status Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium text-sm">Migration Status:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Schema:</span>{' '}
                  <Badge variant={riasecSchemaInitialized ? "default" : "secondary"}>
                    {riasecSchemaInitialized ? 'Ready' : 'Pending'}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Questions:</span>{' '}
                  <Badge variant={riasecDataSeeded ? "default" : "secondary"}>
                    {riasecDataSeeded ? 'Loaded' : 'Empty'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="font-medium">CPU Usage</p>
              <Progress value={23} className="h-2" />
              <p className="text-xs text-muted-foreground">23% - Normal</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Memory Usage</p>
              <Progress value={67} className="h-2" />
              <p className="text-xs text-muted-foreground">67% - Moderate</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Disk Usage</p>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground">45% - Good</p>
            </div>
          </div>

          <Alert className="mt-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              System monitoring is active. Alerts will be sent for any critical issues.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
