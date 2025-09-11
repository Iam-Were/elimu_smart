import React, { useState, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Button,
  TextInput,
  Select,
  Badge,
  Table,
  ActionIcon,
  Modal,
  MultiSelect,
  Checkbox,
  ScrollArea,
  Menu,
  FileInput,
  Progress,
  Textarea,
  Switch,
  Alert,
  Tabs,
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DownloadIcon,
  UploadIcon,
  ExclamationTriangleIcon,
  Pencil1Icon,
  EyeOpenIcon,
  PersonIcon,
  ClockIcon,
  Cross1Icon,
} from '@radix-ui/react-icons';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

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

// Mock data - moved outside component to avoid useMemo dependency issues
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
  const [sortBy] = useState<string>('createdAt');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [impersonationUser, setImpersonationUser] = useState<UserRecord | null>(null);

  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [bulkOpened, { open: openBulk, close: closeBulk }] = useDisclosure(false);
  const [impersonateOpened, { open: openImpersonate, close: closeImpersonate }] = useDisclosure(false);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
      const aValue = a[sortBy as keyof UserRecord];
      const bValue = b[sortBy as keyof UserRecord];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [searchQuery, selectedRole, selectedStatus, sortBy, sortOrder]);

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      notifications.show({
        title: 'No users selected',
        message: 'Please select users to perform bulk actions',
        color: 'yellow',
      });
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
        notifications.show({
          title: 'Bulk operation completed',
          message: `${action} completed for ${selectedUsers.length} users`,
          color: 'green',
        });
        setSelectedUsers([]);
      }
    }, 500);
  };

  const handleImpersonate = (user: UserRecord) => {
    setImpersonationUser(user);
    openImpersonate();
  };

  const confirmImpersonation = () => {
    if (impersonationUser) {
      notifications.show({
        title: 'Impersonation started',
        message: `Now viewing as ${impersonationUser.name}`,
        color: 'blue',
      });
      closeImpersonate();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'orange';
      case 'counselor': return 'yellow';
      case 'admin': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} c="purple.6">User Management</Title>
          <Group>
            <Button leftSection={<PlusIcon className="h-4 w-4" />} onClick={open}>
              Add User
            </Button>
            <Button variant="secondary" leftSection={<UploadIcon className="h-4 w-4" />} onClick={openBulk}>
              Bulk Operations
            </Button>
          </Group>
        </Group>

        {/* Search and Filters */}
        <Card withBorder>
          <Group grow>
            <TextInput
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
            <Select
              placeholder="Filter by role"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value || '')}
              data={[
                { value: '', label: 'All Roles' },
                { value: 'student', label: 'Students' },
                { value: 'counselor', label: 'Counselors' },
                { value: 'admin', label: 'Administrators' },
              ]}
            />
            <Select
              placeholder="Filter by status"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value || '')}
              data={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
          </Group>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Alert color="blue" title={`${selectedUsers.length} users selected`}>
            <Group>
              <Button size="xs" onClick={() => handleBulkAction('export')}>
                Export Selected
              </Button>
              <Button size="xs" color="orange" onClick={() => handleBulkAction('update')}>
                Bulk Update
              </Button>
              <Button size="xs" color="red" onClick={() => handleBulkAction('delete')}>
                Bulk Delete
              </Button>
            </Group>
          </Alert>
        )}

        {/* Bulk Operations Progress */}
        {bulkOperations.filter(op => op.status === 'processing').length > 0 && (
          <Card withBorder>
            <Stack gap="sm">
              <Text fw={500}>Active Operations</Text>
              {bulkOperations.filter(op => op.status === 'processing').map((operation) => (
                <div key={operation.id}>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">{operation.type.toUpperCase()}</Text>
                    <Text size="sm">{operation.progress}%</Text>
                  </Group>
                  <Progress value={operation.progress} />
                </div>
              ))}
            </Stack>
          </Card>
        )}

        {/* Users Table */}
        <Card withBorder>
          <ScrollArea>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                      onChange={(event) => {
                        if (event.currentTarget.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Last Login</Table.Th>
                  <Table.Th>Login Count</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{user.name}</Text>
                        <Text size="sm" c="dimmed">{user.email}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getRoleColor(user.role)} variant="light">
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(user.status)} variant="light">
                        {user.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {user.lastLogin.toLocaleDateString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.metadata.loginCount}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon variant="light" size="sm" onClick={() => {
                          setSelectedUser(user);
                          openEdit();
                        }}>
                          <Pencil1Icon width={16} height={16} />
                        </ActionIcon>
                        <ActionIcon variant="light" size="sm" color="blue" onClick={() => handleImpersonate(user)}>
                          <EyeOpenIcon width={16} height={16} />
                        </ActionIcon>
                        <Menu>
                          <Menu.Target>
                            <ActionIcon variant="light" size="sm">
                              <PersonIcon width={16} height={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<EyeOpenIcon width={16} height={16} />}>
                              View Details
                            </Menu.Item>
                            <Menu.Item leftSection={<ClockIcon width={16} height={16} />}>
                              Activity Log
                            </Menu.Item>
                            <Menu.Item leftSection={<PersonIcon width={16} height={16} />}>
                              Reset Password
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<Cross1Icon width={16} height={16} />}
                              color="red"
                            >
                              Suspend User
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>

        {/* Summary Stats */}
        <Group grow>
          <Card withBorder>
            <Text c="dimmed" size="sm">Total Users</Text>
            <Text size="xl" fw={700}>{mockUsers.length}</Text>
          </Card>
          <Card withBorder>
            <Text c="dimmed" size="sm">Active Users</Text>
            <Text size="xl" fw={700} c="green">
              {mockUsers.filter(u => u.status === 'active').length}
            </Text>
          </Card>
          <Card withBorder>
            <Text c="dimmed" size="sm">Suspended</Text>
            <Text size="xl" fw={700} c="red">
              {mockUsers.filter(u => u.status === 'suspended').length}
            </Text>
          </Card>
          <Card withBorder>
            <Text c="dimmed" size="sm">New This Month</Text>
            <Text size="xl" fw={700} c="blue">12</Text>
          </Card>
        </Group>
      </Stack>

      {/* Add User Modal */}
      <Modal opened={opened} onClose={close} title="Add New User" size="lg">
        <Stack gap="md">
          <TextInput label="Full Name" placeholder="Enter full name" required />
          <TextInput label="Email" placeholder="Enter email address" required />
          <Select
            label="Role"
            placeholder="Select user role"
            data={[
              { value: 'student', label: 'Student' },
              { value: 'counselor', label: 'Counselor' },
              { value: 'admin', label: 'Administrator' },
            ]}
            required
          />
          <MultiSelect
            label="Permissions"
            placeholder="Select permissions"
            data={[
              { value: 'read_content', label: 'Read Content' },
              { value: 'submit_questions', label: 'Submit Questions' },
              { value: 'manage_sessions', label: 'Manage Sessions' },
              { value: 'view_analytics', label: 'View Analytics' },
              { value: 'counsel_students', label: 'Counsel Students' },
              { value: 'manage_users', label: 'Manage Users' },
              { value: 'system_admin', label: 'System Admin' },
            ]}
          />
          <Group justify="flex-end">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button>Create User</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit User Modal */}
      <Modal opened={editOpened} onClose={closeEdit} title="Edit User" size="lg">
        {selectedUser && (
          <Tabs defaultValue="profile">
            <Tabs.List>
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
              <Tabs.Tab value="activity">Activity</Tabs.Tab>
              <Tabs.Tab value="audit">Audit Log</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="profile" pt="md">
              <Stack gap="md">
                <TextInput label="Full Name" defaultValue={selectedUser.name} />
                <TextInput label="Email" defaultValue={selectedUser.email} />
                <Select
                  label="Role"
                  defaultValue={selectedUser.role}
                  data={[
                    { value: 'student', label: 'Student' },
                    { value: 'counselor', label: 'Counselor' },
                    { value: 'admin', label: 'Administrator' },
                  ]}
                />
                <Select
                  label="Status"
                  defaultValue={selectedUser.status}
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'suspended', label: 'Suspended' },
                  ]}
                />
                <Group justify="flex-end">
                  <Button variant="secondary" onClick={closeEdit}>Cancel</Button>
                  <Button>Save Changes</Button>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="permissions" pt="md">
              <Stack gap="md">
                <Text fw={500}>Current Permissions</Text>
                <MultiSelect
                  defaultValue={selectedUser.permissions}
                  data={[
                    { value: 'read_content', label: 'Read Content' },
                    { value: 'submit_questions', label: 'Submit Questions' },
                    { value: 'manage_sessions', label: 'Manage Sessions' },
                    { value: 'view_analytics', label: 'View Analytics' },
                    { value: 'counsel_students', label: 'Counsel Students' },
                    { value: 'manage_users', label: 'Manage Users' },
                    { value: 'system_admin', label: 'System Admin' },
                  ]}
                />
                <Group justify="flex-end">
                  <Button variant="secondary" onClick={closeEdit}>Cancel</Button>
                  <Button>Update Permissions</Button>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="activity" pt="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Text fw={500}>User Activity</Text>
                  <Badge color="green">Online</Badge>
                </Group>
                <div>
                  <Text size="sm" c="dimmed">Last Login</Text>
                  <Text>{selectedUser.lastLogin.toLocaleString()}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">Total Logins</Text>
                  <Text>{selectedUser.metadata.loginCount}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">Device Info</Text>
                  <Text>{selectedUser.metadata.deviceInfo}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">IP Address</Text>
                  <Text>{selectedUser.metadata.ipAddress}</Text>
                </div>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="audit" pt="md">
              <Stack gap="md">
                <Text fw={500}>Recent Actions</Text>
                <ScrollArea h={200}>
                  <Stack gap="xs">
                    {[
                      { action: 'Login', timestamp: new Date(), ip: '192.168.1.100' },
                      { action: 'Profile Updated', timestamp: new Date(Date.now() - 86400000), ip: '192.168.1.100' },
                      { action: 'Password Changed', timestamp: new Date(Date.now() - 172800000), ip: '192.168.1.100' },
                    ].map((log, index) => (
                      <div key={index}>
                        <Group justify="space-between">
                          <Text size="sm">{log.action}</Text>
                          <Text size="xs" c="dimmed">{log.timestamp.toLocaleDateString()}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">IP: {log.ip}</Text>
                      </div>
                    ))}
                  </Stack>
                </ScrollArea>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        )}
      </Modal>

      {/* Bulk Operations Modal */}
      <Modal opened={bulkOpened} onClose={closeBulk} title="Bulk Operations" size="lg">
        <Tabs defaultValue="import">
          <Tabs.List>
            <Tabs.Tab value="import">Import Users</Tabs.Tab>
            <Tabs.Tab value="export">Export Users</Tabs.Tab>
            <Tabs.Tab value="operations">Active Operations</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="import" pt="md">
            <Stack gap="md">
              <FileInput
                label="Upload CSV File"
                placeholder="Select users CSV file"
                accept=".csv"
              />
              <Alert color="blue" title="CSV Format Requirements">
                <Text size="sm">
                  CSV should include columns: name, email, role, status
                </Text>
              </Alert>
              <Group justify="flex-end">
                <Button variant="secondary" onClick={closeBulk}>Cancel</Button>
                <Button>Import Users</Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="export" pt="md">
            <Stack gap="md">
              <MultiSelect
                label="Select Fields to Export"
                defaultValue={['name', 'email', 'role', 'status']}
                data={[
                  { value: 'name', label: 'Name' },
                  { value: 'email', label: 'Email' },
                  { value: 'role', label: 'Role' },
                  { value: 'status', label: 'Status' },
                  { value: 'lastLogin', label: 'Last Login' },
                  { value: 'loginCount', label: 'Login Count' },
                  { value: 'createdAt', label: 'Created Date' },
                ]}
              />
              <Select
                label="Export Format"
                defaultValue="csv"
                data={[
                  { value: 'csv', label: 'CSV' },
                  { value: 'excel', label: 'Excel' },
                  { value: 'json', label: 'JSON' },
                ]}
              />
              <Group justify="flex-end">
                <Button variant="secondary" onClick={closeBulk}>Cancel</Button>
                <Button leftSection={<DownloadIcon className="h-4 w-4" />}>
                  Export
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="operations" pt="md">
            <Stack gap="md">
              <Text fw={500}>Operation History</Text>
              {bulkOperations.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">No operations found</Text>
              ) : (
                <ScrollArea h={300}>
                  <Stack gap="sm">
                    {bulkOperations.map((operation) => (
                      <Card key={operation.id} withBorder>
                        <Group justify="space-between">
                          <div>
                            <Text fw={500}>{operation.type.toUpperCase()}</Text>
                            <Text size="sm" c="dimmed">
                              {operation.createdAt.toLocaleString()}
                            </Text>
                          </div>
                          <Badge color={
                            operation.status === 'completed' ? 'green' :
                            operation.status === 'failed' ? 'red' :
                            operation.status === 'processing' ? 'blue' : 'yellow'
                          }>
                            {operation.status}
                          </Badge>
                        </Group>
                        {operation.status === 'processing' && (
                          <Progress value={operation.progress} mt="sm" />
                        )}
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Modal>

      {/* User Impersonation Modal */}
      <Modal opened={impersonateOpened} onClose={closeImpersonate} title="User Impersonation" size="md">
        {impersonationUser && (
          <Stack gap="md">
            <Alert color="red" title="Security Warning" icon={<ExclamationTriangleIcon className="h-4 w-4" />}>
              You are about to impersonate another user. This action will be logged for security purposes.
            </Alert>
            
            <div>
              <Text fw={500}>Target User</Text>
              <Group>
                <div>
                  <Text>{impersonationUser.name}</Text>
                  <Text size="sm" c="dimmed">{impersonationUser.email}</Text>
                </div>
                <Badge color={getRoleColor(impersonationUser.role)}>
                  {impersonationUser.role}
                </Badge>
              </Group>
            </div>

            <Textarea
              label="Reason for Impersonation"
              placeholder="Enter the reason for user impersonation (required for audit trail)"
              required
            />

            <Switch
              label="I understand that this action will be logged and monitored"
              required
            />

            <Group justify="flex-end">
              <Button variant="secondary" onClick={closeImpersonate}>Cancel</Button>
              <Button color="red" onClick={confirmImpersonation}>
                Start Impersonation
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};