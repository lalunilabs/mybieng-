'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedButton } from './AnimatedButton';
import { LoadingSpinner } from './LoadingSpinner';
import { Badge } from './Badge';
import { useStaggeredAnimation } from '@/lib/animations';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = false,
  exportable = false,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onRowSelect,
  className
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const tableRef = useStaggeredAnimation(50);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [data, searchTerm]);

  // Sort data
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

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const newSelected = checked
      ? [...selectedRows, row]
      : selectedRows.filter(selected => selected !== row);
    
    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? [...paginatedData] : [];
    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" variant="gradient" />
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      {(searchable || filterable || exportable) && (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  />
                </div>
              )}
              {filterable && (
                <AnimatedButton variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
                  Filters
                </AnimatedButton>
              )}
            </div>
            <div className="flex items-center gap-2">
              {exportable && (
                <AnimatedButton variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                  Export
                </AnimatedButton>
              )}
              {selectedRows.length > 0 && (
                <Badge variant="brand" size="sm">
                  {selectedRows.length} selected
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            'w-3 h-3 -mb-1',
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-brand-600' 
                              : 'text-gray-300'
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            'w-3 h-3',
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-brand-600' 
                              : 'text-gray-300'
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-16 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody ref={tableRef as React.RefObject<HTMLTableSectionElement>} className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  'opacity-0 hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  selectedRows.includes(row) && 'bg-brand-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={(e) => handleSelectRow(row, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-900">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || '-')
                    }
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <AnimatedButton
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </AnimatedButton>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'px-3 py-1 text-sm rounded transition-colors',
                        currentPage === page
                          ? 'bg-brand-600 text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <AnimatedButton
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
