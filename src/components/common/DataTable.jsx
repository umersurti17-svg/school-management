import { useState, useMemo } from 'react';
import {
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineSelector,
} from 'react-icons/hi';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import Loader from './Loader';
import { cn } from '../../utils/helpers';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No data available',
  emptyMessage = 'No records match your criteria.',
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  pagination = true,
  pageSize = 10,
  stickyHeader = false,
  className = '',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const from = (currentPage - 1) * pageSize;
    return sortedData.slice(from, from + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="p-12">
        <Loader size="md" text="Loading table data..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={cn('w-full flex flex-col', className)}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm border-collapse">
          <thead
            className={cn(
              'bg-slate-50/80 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200/80 dark:border-slate-800/80',
              stickyHeader && 'sticky top-0 z-10 backdrop-blur-md'
            )}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  className={cn(
                    'px-5 py-3.5 select-none',
                    col.sortable && 'cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.headerClassName
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5',
                      col.align === 'right' && 'justify-end w-full',
                      col.align === 'center' && 'justify-center w-full'
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <HiOutlineChevronUp className="w-3.5 h-3.5 text-primary-600" />
                          ) : (
                            <HiOutlineChevronDown className="w-3.5 h-3.5 text-primary-600" />
                          )
                        ) : (
                          <HiOutlineSelector className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedData.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.header}
                    className={cn(
                      'px-5 py-3.5',
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                      col.className
                    )}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
