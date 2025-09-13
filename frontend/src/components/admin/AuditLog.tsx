import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MagnifyingGlassIcon,
  EyeOpenIcon,
  DownloadIcon,
  PersonIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  ActivityLogIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  category: 'authentication' | 'user_management' | 'content' | 'system' | 'security';
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure' | 'warning';
  details: Record<string, string | number | boolean | null>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sessionId: string;
}

// Mock data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-20T10:30:00'),
    userId: 'admin1',
    username: 'james.admin@elimu-smart.co.ke',
    userRole: 'admin',
    action: 'USER_CREATED',
    category: 'user_management',
    resource: 'User',
    resourceId: 'user_123',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    outcome: 'success',
    details: {
      newUser: 'john.student@elimu-smart.co.ke',
      role: 'student',
      method: 'admin_portal',
    },
    severity: 'low',
    sessionId: 'sess_abc123',
  },
  {
    id: '2',
    timestamp: new Date('2024-01-20T09:15:00'),
    userId: 'user_456',
    username: 'suspicious.user@example.com',
    userRole: 'student',
    action: 'LOGIN_FAILED',
    category: 'authentication',
    resource: 'Authentication',
    ipAddress: '185.220.100.240',
    userAgent: 'curl/7.68.0',
    outcome: 'failure',
    details: {
      reason: 'invalid_credentials',
      attempts: 5,
      locked: true,
    },
    severity: 'high',
    sessionId: 'sess_failed',
  },
  {
    id: '3',
    timestamp: new Date('2024-01-20T08:45:00'),
    userId: 'counselor1',
    username: 'mary.counselor@elimu-smart.co.ke',
    userRole: 'counselor',
    action: 'CONTENT_MODERATED',
    category: 'content',
    resource: 'Question',
    resourceId: 'q_789',
    ipAddress: '192.168.1.150',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    outcome: 'success',
    details: {
      moderationAction: 'approved',
      previousStatus: 'pending',
      notes: 'Content meets quality standards',
    },
    severity: 'low',
    sessionId: 'sess_xyz789',
  },
  {
    id: '4',
    timestamp: new Date('2024-01-20T07:30:00'),
    userId: 'admin1',
    username: 'james.admin@elimu-smart.co.ke',
    userRole: 'admin',
    action: 'SYSTEM_CONFIG_CHANGED',
    category: 'system',
    resource: 'SystemConfiguration',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    outcome: 'success',
    details: {
      setting: 'max_login_attempts',
      oldValue: 3,
      newValue: 5,
      section: 'security',
    },
    severity: 'medium',
    sessionId: 'sess_config1',
  },
  {
    id: '5',
    timestamp: new Date('2024-01-19T18:20:00'),
    userId: 'system',
    username: 'system',
    userRole: 'system',
    action: 'SECURITY_SCAN_COMPLETED',
    category: 'security',
    resource: 'SecurityScanner',
    ipAddress: '127.0.0.1',
    userAgent: 'Internal System',
    outcome: 'warning',
    details: {
      vulnerabilities: 2,
      severity: 'medium',
      scanType: 'automated',
      fixes_applied: 1,
    },
    severity: 'medium',
    sessionId: 'sys_scan_001',
  },
];

export const AuditLog: React.FC = () => {
  const [auditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterOutcome, setFilterOutcome] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('last-7-days');
  const itemsPerPage = 10;

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    
    const matchesCategory = !filterCategory || log.category === filterCategory;
    const matchesOutcome = !filterOutcome || log.outcome === filterOutcome;
    const matchesSeverity = !filterSeverity || log.severity === filterSeverity;
    
    return matchesSearch && matchesCategory && matchesOutcome && matchesSeverity;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <LockClosedIcon width={16} height={16} />;
      case 'user_management':
        return <PersonIcon width={16} height={16} />;
      case 'content':
        return <ActivityLogIcon width={16} height={16} />;
      case 'system':
        return <ActivityLogIcon width={16} height={16} />;
      case 'security':
        return <ExclamationTriangleIcon width={16} height={16} />;
      default:
        return <ActivityLogIcon width={16} height={16} />;
    }
  };

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setOpened(true);
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,User,Action,Category,Resource,Outcome,Severity,IP Address',
      ...filteredLogs.map(log => 
        `${log.timestamp.toISOString()},${log.username},${log.action},${log.category},${log.resource},${log.outcome},${log.severity},${log.ipAddress}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Export Complete', {
      description: 'Audit logs have been exported successfully'
    });
  };

  const getLogStats = () => {
    const stats = {
      total: auditLogs.length,
      success: auditLogs.filter(log => log.outcome === 'success').length,
      failures: auditLogs.filter(log => log.outcome === 'failure').length,
      warnings: auditLogs.filter(log => log.outcome === 'warning').length,
      critical: auditLogs.filter(log => log.severity === 'critical').length,
      security: auditLogs.filter(log => log.category === 'security').length,
    };
    return stats;
  };

  const stats = getLogStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-purple-800">
              Audit Log
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor and track all system activities and user actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            {stats.critical > 0 && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {stats.critical} Critical
              </Badge>
            )}
            {stats.failures > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-sm px-3 py-1">
                {stats.failures} Failures
              </Badge>
            )}
            <Button
              onClick={exportLogs}
              variant="outline"
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <ActivityLogIcon className="w-5 h-5 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Total Events</p>
              <p className="text-lg font-bold text-purple-600">
                {stats.total}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <CheckCircledIcon className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground text-center">Successful</p>
              <p className="text-lg font-bold text-green-600">
                {stats.success}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <p className="text-xs text-muted-foreground text-center">Failures</p>
              <p className="text-lg font-bold text-red-600">
                {stats.failures}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              <p className="text-xs text-muted-foreground text-center">Warnings</p>
              <p className="text-lg font-bold text-yellow-600">
                {stats.warnings}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <p className="text-xs text-muted-foreground text-center">Critical</p>
              <p className="text-lg font-bold text-red-600">
                {stats.critical}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <LockClosedIcon className="w-5 h-5 text-purple-600" />
              <p className="text-xs text-muted-foreground text-center">Security</p>
              <p className="text-lg font-bold text-purple-600">
                {stats.security}
              </p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, resource, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory || 'all'} onValueChange={(value) => setFilterCategory(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="user_management">User Management</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterOutcome || 'all'} onValueChange={(value) => setFilterOutcome(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity || 'all'} onValueChange={(value) => setFilterSeverity(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-24-hours">Last 24 Hours</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Critical Events Alert */}
        {stats.critical > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
            <AlertTitle className="text-red-800">Critical Events Detected</AlertTitle>
            <AlertDescription className="text-red-700">
              {stats.critical} critical security event(s) require immediate attention. 
              Review these events and take appropriate action.
            </AlertDescription>
          </Alert>
        )}

        {/* Audit Log Table */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-purple-800">Audit Events</h3>
              <p className="text-sm text-muted-foreground">
                {filteredLogs.length} events found
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="text-sm">{formatDate(log.timestamp)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{log.username}</div>
                          <Badge variant="secondary" className="text-xs">
                            {log.userRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatAction(log.action)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="text-sm">{log.category.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.resource}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.outcome === 'success' ? 'default' : log.outcome === 'failure' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {log.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.severity === 'critical' ? 'destructive' : log.severity === 'high' ? 'secondary' : 'outline'}
                          className={`text-xs ${
                            log.severity === 'critical' ? 'bg-red-600 text-white' :
                            log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">{log.ipAddress}</span>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewDetails(log)}
                              >
                                <EyeOpenIcon className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Log Details Modal */}
        <Dialog open={opened} onOpenChange={setOpened}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedLog.category)}
                  <Badge 
                    variant={selectedLog.outcome === 'success' ? 'default' : selectedLog.outcome === 'failure' ? 'destructive' : 'secondary'}
                  >
                    {selectedLog.outcome}
                  </Badge>
                  <Badge 
                    variant={selectedLog.severity === 'critical' ? 'destructive' : 'secondary'}
                    className={selectedLog.severity === 'critical' ? 'bg-red-600 text-white' : ''}
                  >
                    {selectedLog.severity}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Timestamp</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedLog.timestamp)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Session ID</p>
                    <p className="text-sm font-mono text-muted-foreground">{selectedLog.sessionId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">User</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.username}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Role</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.userRole}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Action</p>
                    <p className="text-sm text-muted-foreground">{formatAction(selectedLog.action)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Category</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.category.replace('_', ' ')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Resource</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.resource}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">Resource ID</p>
                    <p className="text-sm font-mono text-muted-foreground">{selectedLog.resourceId || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">IP Address</p>
                    <p className="text-sm font-mono text-muted-foreground">{selectedLog.ipAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-800">User Agent</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{selectedLog.userAgent}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-purple-800">Additional Details</p>
                  <Card className="p-4 bg-muted">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};