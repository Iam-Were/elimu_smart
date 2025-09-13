import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UploadIcon,
  ExclamationTriangleIcon,
  Pencil1Icon,
  EyeOpenIcon,
  Cross1Icon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'counselor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
  metadata: {
    loginCount: number;
    lastActivity: Date;
    deviceInfo: string;
    ipAddress: string;
  };
  permissions: string[];
}

interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'update' | 'delete';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results: string[];
  createdBy: string;
  createdAt: Date;
}

// Mock data
const mockUsers: UserRecord[] = [
  {
    id: '1',
    email: 'john.student@elimu.com',
    name: 'John Mwangi',
    role: 'student',
    status: 'active',
    lastLogin: new Date('2024-08-19T10:30:00'),
    createdAt: new Date('2024-07-15T09:00:00'),
    metadata: {
      loginCount: 45,
      lastActivity: new Date('2024-08-19T15:20:00'),
      deviceInfo: 'Chrome 126.0 on Windows',
      ipAddress: '192.168.1.100',
    },
    permissions: ['read_content', 'submit_questions'],
  },
  {
    id: '2',
    email: 'mary.counselor@elimu.com',
    name: 'Mary Wanjiku',
    role: 'counselor',
    status: 'active',
    lastLogin: new Date('2024-08-19T08:15:00'),
    createdAt: new Date('2024-06-01T14:30:00'),
    metadata: {
      loginCount: 120,
      lastActivity: new Date('2024-08-19T16:45:00'),
      deviceInfo: 'Firefox 128.0 on macOS',
      ipAddress: '192.168.1.150',
    },
    permissions: ['read_content', 'manage_sessions', 'view_analytics', 'counsel_students'],
  },
  {
    id: '3',
    email: 'james.admin@elimu.com',
    name: 'James Kiprotich',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2024-08-19T07:00:00'),
    createdAt: new Date('2024-05-01T10:00:00'),
    metadata: {
      loginCount: 200,
      lastActivity: new Date('2024-08-19T17:00:00'),
      deviceInfo: 'Chrome 126.0 on Linux',
      ipAddress: '192.168.1.200',
    },
    permissions: ['full_access', 'manage_users', 'system_admin', 'view_all_data'],
  },
  {
    id: '4',
    email: 'grace.student@elimu.com',
    name: 'Grace Akinyi',
    role: 'student',
    status: 'suspended',
    lastLogin: new Date('2024-08-15T14:20:00'),
    createdAt: new Date('2024-07-20T11:15:00'),
    metadata: {
      loginCount: 25,
      lastActivity: new Date('2024-08-15T14:20:00'),
      deviceInfo: 'Safari 17.0 on iOS',
      ipAddress: '192.168.1.180',
    },
    permissions: ['read_content'],
  },
];

export const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [impersonationUser, setImpersonationUser] = useState<UserRecord | null>(null);

  // Dialog states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [bulkOpOpen, setBulkOpOpen] = useState(false);
  const [impersonateOpen, setImpersonateOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, selectedRole, selectedStatus]);

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected. Please select users to perform bulk actions.');
      return;
    }

    const operation: BulkOperation = {
      id: Date.now().toString(),
      type: action as BulkOperation['type'],
      status: 'processing',
      progress: 0,
      results: [],
      createdBy: 'current-admin',
      createdAt: new Date(),
    };

    setBulkOperations(prev => [...prev, operation]);
    
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBulkOperations(prev => 
        prev.map(op => 
          op.id === operation.id 
            ? { ...op, progress }
            : op
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setBulkOperations(prev => 
          prev.map(op => 
            op.id === operation.id 
              ? { ...op, status: 'completed' as const, progress: 100 }
              : op
          )
        );
        toast.success(`${action} completed for ${selectedUsers.length} users`);
        setSelectedUsers([]);
      }
    }, 500);
  };

  const handleImpersonate = (user: UserRecord) => {
    setImpersonationUser(user);
    setImpersonateOpen(true);
  };

  const confirmImpersonation = () => {
    if (impersonationUser) {
      toast.success(`Now viewing as ${impersonationUser.name}`);
      setImpersonateOpen(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'counselor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-600">User Management</h2>
          <div className="flex gap-2">
            <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="counselor">Counselor</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
                  <Button>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={bulkOpOpen} onOpenChange={setBulkOpOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UploadIcon className="h-4 w-4" />
                  Bulk Operations
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Bulk Operations</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="import">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="import">Import</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                    <TabsTrigger value="operations">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="import" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Upload CSV File</Label>
                      <Input type="file" accept=".csv" />
                    </div>
                    <Alert>
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>
                        CSV should include columns: name, email, role, status
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  <TabsContent value="export" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="operations">
                    {bulkOperations.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No operations found</p>
                    ) : (
                      <div className="space-y-2">
                        {bulkOperations.map((operation) => (
                          <Card key={operation.id}>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{operation.type.toUpperCase()}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {operation.createdAt.toLocaleString()}
                                  </p>
                                </div>
                                <Badge className={
                                  operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  operation.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  operation.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {operation.status}
                                </Badge>
                              </div>
                              {operation.status === 'processing' && (
                                <Progress value={operation.progress} className="mt-2" />
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBulkOpOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Filter by role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="counselor">Counselors</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Filter by status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{selectedUsers.length} users selected</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction('export')}>
                    Export Selected
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('update')}>
                    Bulk Update
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    Bulk Delete
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Login Count</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLogin.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.metadata.loginCount}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setEditUserOpen(true);
                          }}>
                            <Pencil1Icon className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                            <EyeOpenIcon className="mr-2 h-4 w-4" />
                            Impersonate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Cross1Icon className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-2xl font-bold text-green-600">
                {mockUsers.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Suspended</div>
              <div className="text-2xl font-bold text-red-600">
                {mockUsers.filter(u => u.status === 'suspended').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">New This Month</div>
              <div className="text-2xl font-bold text-blue-600">12</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Full Name</Label>
                    <Input id="editName" defaultValue={selectedUser.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Email</Label>
                    <Input id="editEmail" defaultValue={selectedUser.email} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select defaultValue={selectedUser.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="counselor">Counselor</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue={selectedUser.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-3">
                  {[
                    'read_content',
                    'submit_questions',
                    'manage_sessions',
                    'view_analytics',
                    'counsel_students',
                    'manage_users',
                    'system_admin'
                  ].map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        defaultChecked={selectedUser.permissions.includes(permission)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace('_', ' ').toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Last Login</Label>
                    <p className="text-sm">{selectedUser.lastLogin.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Logins</Label>
                    <p className="text-sm">{selectedUser.metadata.loginCount}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Device Info</Label>
                    <p className="text-sm">{selectedUser.metadata.deviceInfo}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">IP Address</Label>
                    <p className="text-sm">{selectedUser.metadata.ipAddress}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Impersonation Modal */}
      <Dialog open={impersonateOpen} onOpenChange={setImpersonateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Impersonation</DialogTitle>
            <DialogDescription>
              You are about to impersonate another user. This action will be logged for security purposes.
            </DialogDescription>
          </DialogHeader>
          {impersonationUser && (
            <div className="space-y-4">
              <Alert className="border-red-200">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Warning:</strong> This action will be logged for security purposes.
                </AlertDescription>
              </Alert>
              
              <div>
                <Label className="font-medium">Target User</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div>
                    <p className="font-medium">{impersonationUser.name}</p>
                    <p className="text-sm text-muted-foreground">{impersonationUser.email}</p>
                  </div>
                  <Badge className={getRoleColor(impersonationUser.role)}>
                    {impersonationUser.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="impersonationReason">Reason for Impersonation</Label>
                <Textarea
                  id="impersonationReason"
                  placeholder="Enter the reason for user impersonation (required for audit trail)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="impersonationAgreement" />
                <Label htmlFor="impersonationAgreement" className="text-sm">
                  I understand that this action will be logged and monitored
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImpersonateOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmImpersonation}>
              Start Impersonation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};