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
    <div className={cn('glass-panel rounded-xl overflow-hidden anim-slide-up flex flex-col flex-1 shadow-sm', className)}>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-[#f8f6f8] border-b-[1.5px] border-black">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    'px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, rowIdx) => (
              <tr
                key={item.id ? String(item.id) : rowIdx}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'table-row cursor-pointer bg-white group',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn('px-6 py-4.5', col.className)}>
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
    </div>
  );
}
