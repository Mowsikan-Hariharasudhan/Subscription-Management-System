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
    <div className={cn('glass-panel rounded-xl overflow-hidden anim-slide-up flex flex-col flex-1', className)}>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[900px]">
          <thead className="bg-odoo text-white">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    'px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black',
                    idx === 0 && 'rounded-tl-[10px]',
                    idx === columns.length - 1 && 'rounded-tr-[10px]',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIdx) => (
              <tr
                key={item.id ? String(item.id) : rowIdx}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'table-row bg-white group',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn(
                      'px-6 py-4.5 border-b-[1.5px] border-black group-last:border-b-0',
                      colIdx === 0 && 'group-last:rounded-bl-[10px]',
                      colIdx === columns.length - 1 && 'group-last:rounded-br-[10px]',
                      col.className
                    )}
                  >
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
