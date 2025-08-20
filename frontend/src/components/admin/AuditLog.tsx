import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Badge,
  Alert,
  Table,
  Pagination,
  Modal,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
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
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

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
  details: Record<string, any>;
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
  const [opened, { open, close }] = useDisclosure(false);
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

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      case 'warning':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  };

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
    open();
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

    notifications.show({
      title: 'Export Complete',
      message: 'Audit logs have been exported successfully',
      color: 'green',
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
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="2rem">
              Audit Log
            </Title>
            <Text size="lg" c="dimmed">
              Monitor and track all system activities and user actions
            </Text>
          </Stack>
          <Group gap="sm">
            {stats.critical > 0 && (
              <Badge size="lg" color="red" variant="filled">
                {stats.critical} Critical
              </Badge>
            )}
            {stats.failures > 0 && (
              <Badge size="lg" color="orange" variant="filled">
                {stats.failures} Failures
              </Badge>
            )}
            <Button
              leftSection={<DownloadIcon width={16} height={16} />}
              variant="light"
              onClick={exportLogs}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              Export Logs
            </Button>
          </Group>
        </Group>

        {/* Statistics Cards */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ActivityLogIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Total Events</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {stats.total}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <CheckCircledIcon width={20} height={20} style={{ color: 'var(--success)' }} />
              <Text size="xs" c="dimmed" ta="center">Successful</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--success)' }}>
                {stats.success}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={20} height={20} style={{ color: '#ef4444' }} />
              <Text size="xs" c="dimmed" ta="center">Failures</Text>
              <Text fw={700} size="lg" style={{ color: '#ef4444' }}>
                {stats.failures}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={20} height={20} style={{ color: '#eab308' }} />
              <Text size="xs" c="dimmed" ta="center">Warnings</Text>
              <Text fw={700} size="lg" style={{ color: '#eab308' }}>
                {stats.warnings}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <ExclamationTriangleIcon width={20} height={20} style={{ color: 'var(--destructive)' }} />
              <Text size="xs" c="dimmed" ta="center">Critical</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--destructive)' }}>
                {stats.critical}
              </Text>
            </Stack>
          </Card>

          <Card padding="sm" radius="md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack gap="xs" align="center">
              <LockClosedIcon width={20} height={20} style={{ color: 'var(--primary)' }} />
              <Text size="xs" c="dimmed" ta="center">Security</Text>
              <Text fw={700} size="lg" style={{ color: 'var(--primary)' }}>
                {stats.security}
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            border: '1px solid var(--border)',
          }}
        >
          <Group gap="md">
            <TextInput
              placeholder="Search by user, action, resource, or IP address..."
              leftSection={<MagnifyingGlassIcon width={16} height={16} />}
              value={searchQuery}
              onChange={e => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Category"
              value={filterCategory}
              onChange={setFilterCategory}
              data={[
                { value: 'authentication', label: 'Authentication' },
                { value: 'user_management', label: 'User Management' },
                { value: 'content', label: 'Content' },
                { value: 'system', label: 'System' },
                { value: 'security', label: 'Security' },
              ]}
              clearable
              style={{ minWidth: 150 }}
            />
            <Select
              placeholder="Outcome"
              value={filterOutcome}
              onChange={setFilterOutcome}
              data={[
                { value: 'success', label: 'Success' },
                { value: 'failure', label: 'Failure' },
                { value: 'warning', label: 'Warning' },
              ]}
              clearable
              style={{ minWidth: 120 }}
            />
            <Select
              placeholder="Severity"
              value={filterSeverity}
              onChange={setFilterSeverity}
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
              clearable
              style={{ minWidth: 120 }}
            />
            <Select
              value={dateRange}
              onChange={value => setDateRange(value || 'last-7-days')}
              data={[
                { value: 'last-24-hours', label: 'Last 24 Hours' },
                { value: 'last-7-days', label: 'Last 7 Days' },
                { value: 'last-30-days', label: 'Last 30 Days' },
                { value: 'last-90-days', label: 'Last 90 Days' },
              ]}
              style={{ minWidth: 150 }}
            />
          </Group>
        </Card>

        {/* Critical Events Alert */}
        {stats.critical > 0 && (
          <Alert
            icon={<ExclamationTriangleIcon width={16} height={16} />}
            title="Critical Events Detected"
            color="red"
          >
            <Text size="sm">
              {stats.critical} critical security event(s) require immediate attention. 
              Review these events and take appropriate action.
            </Text>
          </Alert>
        )}

        {/* Audit Log Table */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            border: '1px solid var(--border)',
          }}
        >
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Audit Events</Title>
              <Text size="sm" c="dimmed">
                {filteredLogs.length} events found
              </Text>
            </Group>

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Resource</Table.Th>
                  <Table.Th>Outcome</Table.Th>
                  <Table.Th>Severity</Table.Th>
                  <Table.Th>IP Address</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedLogs.map(log => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="sm">{formatDate(log.timestamp)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>{log.username}</Text>
                        <Badge size="xs" variant="outline">
                          {log.userRole}
                        </Badge>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatAction(log.action)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {getCategoryIcon(log.category)}
                        <Text size="sm">{log.category.replace('_', ' ')}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.resource}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color={getOutcomeColor(log.outcome)} variant="light">
                        {log.outcome}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color={getSeverityColor(log.severity)} variant="filled">
                        {log.severity}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{fontFamily: 'monospace'}}>{log.ipAddress}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <EyeOpenIcon width={14} height={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {totalPages > 1 && (
              <Group justify="center">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={totalPages}
                  size="sm"
                />
              </Group>
            )}
          </Stack>
        </Card>

        {/* Log Details Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title="Audit Log Details"
          size="lg"
        >
          {selectedLog && (
            <Stack gap="md">
              <Group gap="sm">
                {getCategoryIcon(selectedLog.category)}
                <Badge color={getOutcomeColor(selectedLog.outcome)}>
                  {selectedLog.outcome}
                </Badge>
                <Badge color={getSeverityColor(selectedLog.severity)}>
                  {selectedLog.severity}
                </Badge>
              </Group>

              <SimpleGrid cols={2} spacing="md">
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Timestamp</Text>
                  <Text size="sm">{formatDate(selectedLog.timestamp)}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Session ID</Text>
                  <Text size="sm" style={{fontFamily: 'monospace'}}>{selectedLog.sessionId}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>User</Text>
                  <Text size="sm">{selectedLog.username}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Role</Text>
                  <Text size="sm">{selectedLog.userRole}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Action</Text>
                  <Text size="sm">{formatAction(selectedLog.action)}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Category</Text>
                  <Text size="sm">{selectedLog.category.replace('_', ' ')}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Resource</Text>
                  <Text size="sm">{selectedLog.resource}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Resource ID</Text>
                  <Text size="sm" style={{fontFamily: 'monospace'}}>{selectedLog.resourceId || 'N/A'}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>IP Address</Text>
                  <Text size="sm" style={{fontFamily: 'monospace'}}>{selectedLog.ipAddress}</Text>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>User Agent</Text>
                  <Text size="sm" lineClamp={2}>{selectedLog.userAgent}</Text>
                </Stack>
              </SimpleGrid>

              <Stack gap="xs">
                <Text size="sm" fw={500}>Additional Details</Text>
                <Card padding="sm" style={{ backgroundColor: 'var(--muted)' }}>
                  <pre style={{ 
                    fontSize: '12px', 
                    margin: 0, 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                  }}>
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </Card>
              </Stack>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};