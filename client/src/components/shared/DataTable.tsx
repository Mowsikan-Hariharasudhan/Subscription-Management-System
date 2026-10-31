import React from 'react';
import { cn } from '../../lib/utils';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items to display.',
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton count={5} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border-main bg-white shadow-subtle', className)}>
      <table className="w-full text-left text-sm text-text-primary border-collapse">
        <thead className="bg-surface-subtle text-[11px] uppercase tracking-wider text-text-secondary border-b border-border-main font-semibold select-none">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className={cn('px-4 py-3', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-main">
          {data.map((item, rowIdx) => (
            <tr
              key={item.id ? String(item.id) : rowIdx}
              onClick={() => onRowClick && onRowClick(item)}
              className={cn(
                'transition-colors hover:bg-surface-main/80',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={cn('px-4 py-3 text-xs sm:text-sm whitespace-nowrap', col.className)}>
                  {col.cell
                    ? col.cell(item)
                    : col.accessorKey
                    ? (item[col.accessorKey] as any)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
