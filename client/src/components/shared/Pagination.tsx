import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) => {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="border-t-[1.5px] border-black bg-[#f8f6f8] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-[0.8125rem] font-medium text-gray-500">
        Showing <span className="font-bold text-odoo-dark">{start}</span> to{' '}
        <span className="font-bold text-odoo-dark">{end}</span> of{' '}
        <span className="font-bold text-odoo-dark">{total}</span> entries
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-[0.8125rem] rounded-lg transition-all hover:bg-gray-50 hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none cursor-pointer flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </button>

        <div className="text-[0.8125rem] font-bold text-odoo-dark px-2">
          Page {page} of {Math.max(1, totalPages)}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-[0.8125rem] rounded-lg transition-all hover:bg-gray-50 hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none cursor-pointer flex items-center"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
