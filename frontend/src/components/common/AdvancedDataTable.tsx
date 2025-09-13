import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

export interface TableColumn<T = Record<string, unknown>> {
  id: keyof T;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'action' | 'custom';
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: number | 'auto';
  render?: (value: unknown, row: T) => React.ReactNode;
  filterOptions?: { value: unknown; label: string }[];
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  column: string;
  value: unknown;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

interface BulkAction<T = Record<string, unknown>> {
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

export const AdvancedDataTable = <T extends Record<string, unknown>>({
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
            return value?.toString().toLowerCase().includes(String(filter.value).toLowerCase());
          case 'startsWith':
            return value?.toString().toLowerCase().startsWith(String(filter.value).toLowerCase());
          case 'endsWith':
            return value?.toString().toLowerCase().endsWith(String(filter.value).toLowerCase());
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

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

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
          <Badge variant="secondary">
            {String(value || '')}
          </Badge>
        );
      case 'boolean':
        return value ? '✓' : '✗';
      case 'date':
        return value ? new Date(value as string | number | Date).toLocaleDateString() : '';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value || '');
      default:
        return String(value || '');
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
        <div className="flex justify-between items-center">
          <div>
            {title && (
              <h3 className="text-lg font-semibold mb-2">
                {title}
              </h3>
            )}
            <div className="flex items-center gap-3">
              {searchable && (
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[250px] pl-10"
                  />
                </div>
              )}
              
              {/* Active Filters */}
              {filters.map(filter => (
                <Badge
                  key={filter.column}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter.column}: {String(filter.value)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFilter(filter.column)}
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            {selectedRows.size > 0 && bulkActions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.size} selected
                </span>
                {bulkActions.map(action => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant={action.danger ? 'destructive' : 'secondary'}
                    onClick={() => handleBulkAction(action)}
                    className="flex items-center gap-2"
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Table Actions */}
            <div className="flex items-center gap-2">
              {exportable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportData}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Export
                </Button>
              )}
              
              <Button variant="outline" size="sm">
                <MixerHorizontalIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflow: 'auto' }}>
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead style={{ width: 40 }}>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              
              {columns.map(column => (
                <TableHead
                  key={column.id.toString()}
                  style={{
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    width: column.width,
                  }}
                  onClick={() => column.sortable && handleSort(column.id.toString())}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{column.label}</span>
                    {column.sortable && getSortIcon(column.id.toString())}
                  </div>
                </TableHead>
              ))}
              
              <TableHead style={{ width: 60 }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1}>
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1}>
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <span className="text-muted-foreground">No data available</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(row => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.has(rowId);
                
                return (
                  <TableRow
                    key={rowId}
                    style={{
                      backgroundColor: isSelected ? 'var(--sidebar-accent)' : 'transparent',
                      cursor: onRowClick ? 'pointer' : 'default',
                    }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleRowSelect(row)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map(column => (
                      <TableCell key={String(column.id)}>
                        {renderCellContent(column, row)}
                      </TableCell>
                    ))}
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            <DotsVerticalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => onRowClick?.(row)}
                            className="flex items-center gap-2"
                          >
                            <EyeOpenIcon className="w-4 h-4" />
                            View
                          </DropdownMenuItem>
                          
                          {onRowEdit && (
                            <DropdownMenuItem
                              onClick={() => onRowEdit(row)}
                              className="flex items-center gap-2"
                            >
                              <Pencil1Icon className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          
                          {onRowDelete && (
                            <DropdownMenuItem
                              onClick={() => onRowDelete(row)}
                              className="flex items-center gap-2 text-destructive"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
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
          <span className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm">
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

      {/* Bulk Action Confirmation Modal */}
      <Dialog
        open={bulkActionModal.isOpen}
        onOpenChange={(open) => !open && setBulkActionModal({ isOpen: false, isProcessing: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkActionModal.action?.confirmation?.title || 'Confirm Action'}
            </DialogTitle>
            <DialogDescription>
              {bulkActionModal.action?.confirmation?.message || 
               `Are you sure you want to perform this action on ${selectedRows.size} item(s)?`}
            </DialogDescription>
          </DialogHeader>
          
          {bulkActionModal.isProcessing && (
            <Progress value={100} className="animate-pulse" />
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkActionModal({ isOpen: false, isProcessing: false })}
              disabled={bulkActionModal.isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={bulkActionModal.action?.danger ? 'destructive' : 'default'}
              onClick={confirmBulkAction}
              disabled={bulkActionModal.isProcessing}
            >
              {bulkActionModal.action?.confirmation?.confirmLabel || 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};