import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  DownloadIcon, 
  TrashIcon, 
  EditIcon, 
  EyeIcon, 
  SearchIcon,
  SettingsIcon,
  XIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface AdminDataTableProps<T> {
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
  className?: string;
}

export const AdminDataTable = <T extends Record<string, unknown>>({
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
  className = '',
}: AdminDataTableProps<T>) => {
  // State management
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />;
  };

  const renderCellContent = (column: TableColumn<T>, row: T) => {
    const value = row[column.id];

    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'badge':
        return (
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border border-purple-100">
            {String(value || '')}
          </Badge>
        );
      case 'boolean':
        return (
          <Badge variant={value ? "default" : "secondary"} className={value ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>
            {value ? '✓' : '✗'}
          </Badge>
        );
      case 'date':
        return value ? new Date(value as string | number | Date).toLocaleDateString() : '';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value || '');
      default:
        return (
          <span className="text-gray-900 dark:text-gray-100">
            {String(value || '')}
          </span>
        );
    }
  };


  return (
    <Card className={cn("bg-white dark:bg-gray-800", className)}>
      {/* Table Header */}
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {title && (
              <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                {title}
              </CardTitle>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {searchable && (
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              )}
              
              {/* Active Filters */}
              {filters.map(filter => (
                <Badge
                  key={filter.column}
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 border border-purple-200"
                >
                  {filter.column}: {String(filter.value)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-purple-200"
                    onClick={() => removeFilter(filter.column)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            {selectedRows.size > 0 && bulkActions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRows.size} selected
                </span>
                {bulkActions.slice(0, 2).map(action => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant={action.danger ? "destructive" : "secondary"}
                    className={action.danger ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700 text-white"}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Table Actions */}
            <div className="flex items-center gap-1">
              {exportable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportData}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Table Content */}
      <CardContent className="p-0">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </TableHead>
                )}
                
                {columns.map(column => (
                  <TableHead
                    key={column.id.toString()}
                    className={cn(
                      "font-semibold text-purple-900 dark:text-purple-100",
                      column.sortable && "cursor-pointer select-none hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.id.toString())}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.sortable && getSortIcon(column.id.toString())}
                    </div>
                  </TableHead>
                ))}
                
                <TableHead className="w-16 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1} className="h-32">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1} className="h-32">
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No data available
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
                      className={cn(
                        "hover:bg-purple-50 dark:hover:bg-purple-900/10",
                        isSelected && "bg-purple-100 dark:bg-purple-900/20",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRowSelect(row)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </TableCell>
                      )}
                      
                      {columns.map(column => (
                        <TableCell key={String(column.id)}>
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}
                      
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              onRowClick?.(row);
                            }}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          
                          {onRowEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onRowEdit(row);
                              }}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {onRowDelete && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onRowDelete(row);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 
                        "bg-purple-600 hover:bg-purple-700 text-white" : 
                        "border-purple-200 text-purple-700 hover:bg-purple-50"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDataTable;