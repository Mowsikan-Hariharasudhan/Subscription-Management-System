import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { Payment } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { formatDate } from '../../lib/utils';

const METHOD_BADGES: Record<string, string> = {
  CASH: 'bg-[#d1fae5] text-[#047857] border-[1.5px] border-black',
  BANK_TRANSFER: 'bg-[#e0f2fe] text-[#0369a1] border-[1.5px] border-black',
  UPI: 'bg-[#f3e8ff] text-[#7e22ce] border-[1.5px] border-black',
  CARD: 'bg-[#fef3c7] text-[#b45309] border-[1.5px] border-black',
  OTHER: 'bg-gray-100 text-gray-700 border-[1.5px] border-black',
};

export const Payments: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['payments', { page, search }],
    queryFn: () => paymentService.list({ page, limit: 10, search }),
  });

  const columns: Column<Payment>[] = [
    {
      header: 'Payment Reference',
      className: 'w-[20%]',
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-odoo tracking-tight block">
              {p.id.slice(0, 10).toUpperCase()}…
            </span>
            <span className="text-[0.6875rem] text-gray-500 font-mono block">PAID</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Linked Invoice',
      className: 'w-[20%]',
      cell: (p) => (
        <button
          className="font-mono text-xs font-bold text-odoo-dark hover:text-odoo hover:underline cursor-pointer flex items-center gap-1.5"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/invoices/${p.invoiceId}`);
          }}
        >
          <span>{(p as any).invoice?.number || p.invoiceId.slice(0, 8)}</span>
        </button>
      ),
    },
    {
      header: 'Customer',
      className: 'w-[24%]',
      cell: (p) => (
        <span className="text-[0.875rem] font-bold text-odoo-dark">
          {(p as any).invoice?.customer?.name || 'Enterprise Customer'}
        </span>
      ),
    },
    {
      header: 'Settlement Method',
      className: 'text-center',
      cell: (p) => (
        <div className="text-center">
          <span
            className={`inline-flex px-2.5 py-1 rounded text-[0.625rem] font-bold uppercase tracking-widest shadow-[2px_2px_0_#000] ${
              METHOD_BADGES[p.method] || METHOD_BADGES.OTHER
            }`}
          >
            {p.method.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount Paid',
      className: 'font-mono text-right',
      cell: (p) => (
        <div className="text-right font-mono font-bold text-[0.875rem] text-emerald-700">
          <CurrencyDisplay amount={p.amount} size="sm" className="text-emerald-700 font-bold" />
        </div>
      ),
    },
    {
      header: 'Payment Date',
      className: 'text-right',
      cell: (p) => (
        <div className="text-right text-[0.8125rem] font-medium text-gray-500 font-mono">
          {formatDate(p.paymentDate)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-end anim-slide-up">
        <div>
          <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
            Recorded Payments
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Complete transaction ledger of cash, bank transfers, UPI, and manual ledger settlements
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="relative w-full sm:w-[28rem]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payments by reference or invoice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-focus w-full pl-11 pr-4 py-2.5 bg-white border-[1.5px] border-black rounded-lg text-[0.875rem] font-medium text-odoo-dark shadow-sm"
          />
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-[1.5px] border-black shadow-[2px_2px_0_#000] text-[0.6875rem] font-bold text-odoo-dark uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{data?.pagination?.total ?? 0} Recorded Payments</span>
        </div>
      </div>

      {/* Payment Table */}
      <div className="flex flex-col flex-1">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(p) => navigate(`/invoices/${p.invoiceId}`)}
          emptyTitle="No payments recorded"
          emptyDescription="Payments are recorded directly from confirmed invoices."
        />

        {data?.pagination && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              limit={data.pagination.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
