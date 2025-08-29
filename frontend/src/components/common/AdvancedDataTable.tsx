import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  Card,
  Group,
  Text,
  Button,
  Checkbox,
  ActionIcon,
  Badge,
  Menu,
  TextInput,
  Pagination,
  Stack,
  Modal,
  Progress,
} from '@mantine/core';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  DotsVerticalIcon,
  DownloadIcon,
  TrashIcon,
  Pencil1Icon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';

export interface TableColumn<T = any> {
  id: keyof T;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'action' | 'custom';
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: number | 'auto';
  render?: (value: any, row: T) => React.ReactNode;
  filterOptions?: { value: any; label: string }[];
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  column: string;
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

interface BulkAction<T = any> {
  id: string;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  action: (selectedItems: T[]) => void | Promise<void>;
  confirmation?: {
    title: string;
    message: string;
    confirmLabel: string;
  };
}

interface AdvancedDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  bulkActions?: BulkAction<T>[];
  onRowClick?: (row: T) => void;
  onRowEdit?: (row: T) => void;
  onRowDelete?: (row: T) => void;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  title?: string;
  loading?: boolean;
}

export const AdvancedDataTable = <T extends Record<string, any>>({
  data,
  columns,
  bulkActions = [],
  onRowClick,
  onRowEdit,
  onRowDelete,
  pageSize = 10,
  searchable = true,
  exportable = true,
  selectable = true,
  title,
  loading = false,
}: AdvancedDataTableProps<T>) => {
  // State management
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    action?: BulkAction<T>;
    isProcessing: boolean;
  }>({ isOpen: false, isProcessing: false });

  // Get unique ID for each row (assuming 'id' field exists)
  const getRowId = useCallback((row: T): string => {
    return row.id?.toString() || JSON.stringify(row);
  }, []);

  // Filtering logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search query
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(column => {
          const value = row[column.id];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply column filters
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.column];
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return value?.toString().toLowerCase().includes(filter.value.toLowerCase());
          case 'startsWith':
            return value?.toString().toLowerCase().startsWith(filter.value.toLowerCase());
          case 'endsWith':
            return value?.toString().toLowerCase().endsWith(filter.value.toLowerCase());
          case 'greaterThan':
            return Number(value) > Number(filter.value);
          case 'lessThan':
            return Number(value) < Number(filter.value);
          default:
            return true;
        }
      });
    });

    return result;
  }, [data, searchQuery, filters, columns]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Selection logic
  const isAllSelected = selectedRows.size === paginatedData.length && paginatedData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  const handleSort = (columnId: string) => {
    setSortConfig(current => {
      if (current?.key === columnId) {
        return {
          key: columnId,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      const allIds = paginatedData.map(getRowId);
      setSelectedRows(new Set(allIds));
    }
  };

  const handleRowSelect = (row: T) => {
    const rowId = getRowId(row);
    const newSelected = new Set(selectedRows);
    
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    
    setSelectedRows(newSelected);
  };

  const handleBulkAction = async (action: BulkAction<T>) => {
    const selectedItems = paginatedData.filter(row => selectedRows.has(getRowId(row)));
    
    if (action.confirmation) {
      setBulkActionModal({ isOpen: true, action, isProcessing: false });
      return;
    }

    setBulkActionModal({ isOpen: false, isProcessing: true });
    try {
      await action.action(selectedItems);
      setSelectedRows(new Set());
    } finally {
      setBulkActionModal({ isOpen: false, isProcessing: false });
    }
  };

  const confirmBulkAction = async () => {
    if (!bulkActionModal.action) return;

    const selectedItems = paginatedData.filter(row => selectedRows.has(getRowId(row)));
    setBulkActionModal(prev => ({ ...prev, isProcessing: true }));
    
    try {
      await bulkActionModal.action.action(selectedItems);
      setSelectedRows(new Set());
      setBulkActionModal({ isOpen: false, isProcessing: false });
    } catch {
      setBulkActionModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // const addFilter = (column: string, value: any, operator: FilterConfig['operator']) => {
  //   setFilters(prev => [
  //     ...prev.filter(f => f.column !== column),
  //     { column, value, operator }
  //   ]);
  // };

  const removeFilter = (column: string) => {
    setFilters(prev => prev.filter(f => f.column !== column));
  };

  const exportData = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row =>
        columns.map(col => {
          const value = row[col.id];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}-export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSortIcon = (columnId: string) => {
    if (sortConfig?.key !== columnId) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon width={14} height={14} /> : 
      <ChevronDownIcon width={14} height={14} />;
  };

  const renderCellContent = (column: TableColumn<T>, row: T) => {
    const value = row[column.id];

    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'badge':
        return (
          <Badge size="sm" variant="light">
            {value}
          </Badge>
        );
      case 'boolean':
        return value ? '✓' : '✗';
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return value?.toString() || '';
    }
  };

  return (
    <Card
      className="advanced-data-table"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Table Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--muted)',
        }}
      >
        <Group justify="space-between" align="center">
          <div>
            {title && (
              <Text size="lg" fw={600} mb="xs">
                {title}
              </Text>
            )}
            <Group gap="sm">
              {searchable && (
                <TextInput
                  placeholder="Search..."
                  leftSection={<MagnifyingGlassIcon width={16} height={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 250 }}
                />
              )}
              
              {/* Active Filters */}
              {filters.map(filter => (
                <Badge
                  key={filter.column}
                  variant="light"
                  rightSection={
                    <ActionIcon size="xs" onClick={() => removeFilter(filter.column)}>
                      <Cross2Icon width={10} height={10} />
                    </ActionIcon>
                  }
                >
                  {filter.column}: {filter.value}
                </Badge>
              ))}
            </Group>
          </div>

          <Group gap="sm">
            {/* Bulk Actions */}
            {selectedRows.size > 0 && bulkActions.length > 0 && (
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {selectedRows.size} selected
                </Text>
                {bulkActions.map(action => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant={action.danger ? 'filled' : 'light'}
                    color={action.danger ? 'red' : undefined}
                    leftSection={action.icon}
                    onClick={() => handleBulkAction(action)}
                    className="btn-secondary-linkedin btn-sm"
                  >
                    {action.label}
                  </Button>
                ))}
              </Group>
            )}

            {/* Table Actions */}
            <Group gap="xs">
              {exportable && (
                <Button
                  size="sm"
                  variant="light"
                  leftSection={<DownloadIcon width={16} height={16} />}
                  onClick={exportData}
                  className="btn-ghost-linkedin btn-sm"
                >
                  Export
                </Button>
              )}
              
              <ActionIcon variant="light" size="lg">
                <MixerHorizontalIcon width={16} height={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </div>

      {/* Table Content */}
      <div style={{ overflow: 'auto' }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {selectable && (
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </Table.Th>
              )}
              
              {columns.map(column => (
                <Table.Th
                  key={column.id.toString()}
                  style={{
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    width: column.width,
                  }}
                  onClick={() => column.sortable && handleSort(column.id.toString())}
                >
                  <Group gap="xs" justify="space-between">
                    <Text fw={600}>{column.label}</Text>
                    {column.sortable && getSortIcon(column.id.toString())}
                  </Group>
                </Table.Th>
              ))}
              
              <Table.Th style={{ width: 60 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + 1}>
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </Table.Td>
              </Table.Tr>
            ) : paginatedData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + 1}>
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Text c="dimmed">No data available</Text>
                  </div>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedData.map(row => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.has(rowId);
                
                return (
                  <Table.Tr
                    key={rowId}
                    style={{
                      backgroundColor: isSelected ? 'var(--sidebar-accent)' : 'transparent',
                      cursor: onRowClick ? 'pointer' : 'default',
                    }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <Table.Td>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleRowSelect(row)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Table.Td>
                    )}
                    
                    {columns.map(column => (
                      <Table.Td key={column.id.toString()}>
                        {renderCellContent(column, row)}
                      </Table.Td>
                    ))}
                    
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon
                            variant="subtle"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DotsVerticalIcon width={16} height={16} />
                          </ActionIcon>
                        </Menu.Target>
                        
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<EyeOpenIcon width={14} height={14} />}
                            onClick={() => onRowClick?.(row)}
                          >
                            View
                          </Menu.Item>
                          
                          {onRowEdit && (
                            <Menu.Item
                              leftSection={<Pencil1Icon width={14} height={14} />}
                              onClick={() => onRowEdit(row)}
                            >
                              Edit
                            </Menu.Item>
                          )}
                          
                          {onRowDelete && (
                            <Menu.Item
                              leftSection={<TrashIcon width={14} height={14} />}
                              color="red"
                              onClick={() => onRowDelete(row)}
                            >
                              Delete
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text size="sm" c="dimmed">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </Text>
          
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            size="sm"
          />
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      <Modal
        opened={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, isProcessing: false })}
        title={bulkActionModal.action?.confirmation?.title || 'Confirm Action'}
      >
        <Stack gap="md">
          <Text>
            {bulkActionModal.action?.confirmation?.message || 
             `Are you sure you want to perform this action on ${selectedRows.size} item(s)?`}
          </Text>
          
          {bulkActionModal.isProcessing && (
            <Progress value={100} animated />
          )}
          
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => setBulkActionModal({ isOpen: false, isProcessing: false })}
              disabled={bulkActionModal.isProcessing}
            >
              Cancel
            </Button>
            <Button
              color={bulkActionModal.action?.danger ? 'red' : undefined}
              onClick={confirmBulkAction}
              loading={bulkActionModal.isProcessing}
            >
              {bulkActionModal.action?.confirmation?.confirmLabel || 'Confirm'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};