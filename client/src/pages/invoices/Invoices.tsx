import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Receipt, Zap } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { Invoice, InvoiceStatus } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';

const STATUS_OPTIONS: InvoiceStatus[] = ['DRAFT', 'CONFIRMED', 'PAID', 'CANCELLED'];

export const Invoices: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', { page, search, status: statusFilter }],
    queryFn: () => invoiceService.list({ page, limit: 10, search, status: statusFilter || undefined }),
  });

  const billingMutation = useMutation({
    mutationFn: () => invoiceService.runBillingNow(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      alert(`Billing complete. Created: ${res.data?.created ?? 0} invoices, Skipped: ${res.data?.skipped ?? 0}`);
    },
    onError: (err: any) => {
      alert(`Billing failed: ${err.response?.data?.message || err.message}`);
    },
  });

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      className: 'w-[18%]',
      cell: (inv) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-bold text-odoo tracking-tight">{inv.number}</span>
        </div>
      ),
    },
    {
      header: 'Customer & Subscription',
      className: 'w-[26%]',
      cell: (inv) => (
        <div>
          <p className="font-bold text-odoo-dark text-[0.875rem]">{inv.customer?.name}</p>
          <p className="text-[0.75rem] text-gray-500 font-mono mt-0.5">{inv.subscription?.number || 'Direct Order'}</p>
        </div>
      ),
    },
    {
      header: 'Period Covered',
      className: 'text-xs text-gray-600 font-medium',
      cell: (inv) => (
        <span className="text-xs text-gray-600 font-medium font-mono">
          {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
        </span>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (inv) => (
        <div className="text-center">
          <StatusBadge status={inv.status} />
        </div>
      ),
    },
    {
      header: 'Total Value',
      className: 'font-mono text-right',
      cell: (inv) => (
        <div className="text-right font-mono font-bold text-[0.875rem] text-odoo-dark">
          <CurrencyDisplay amount={inv.total} size="sm" />
        </div>
      ),
    },
    {
      header: 'Outstanding',
      className: 'font-mono text-right',
      cell: (inv) => (
        <div className="text-right font-mono font-bold text-[0.875rem]">
          <CurrencyDisplay
            amount={inv.outstanding}
            size="sm"
            className={inv.outstanding > 0 && inv.status === 'CONFIRMED' ? 'text-rose-600 font-bold' : 'text-gray-500'}
          />
        </div>
      ),
    },
    {
      header: 'Due Date',
      className: 'text-right',
      cell: (inv) => {
        const isOverdue = inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date();
        return (
          <div className="text-right">
            <span className={`text-xs font-bold font-mono ${isOverdue ? 'text-rose-600' : 'text-gray-500'}`}>
              {formatDate(inv.dueDate)}
              {isOverdue && ' ⚠️'}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-end anim-slide-up">
        <div>
          <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
            Invoices & Billing
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Automated recurring invoices, tax snapshots, and accounts receivable
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative w-full sm:w-[24rem]">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice # or customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-focus w-full pl-11 pr-4 py-2.5 bg-white border-[1.5px] border-black rounded-lg text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => { setStatusFilter(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-[1.5px] border-black cursor-pointer ${
                !statusFilter ? 'bg-odoo text-white shadow-[2px_2px_0_#000]' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              ALL
            </button>
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-[1.5px] border-black cursor-pointer ${
                  statusFilter === st ? 'bg-odoo text-white shadow-[2px_2px_0_#000]' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => billingMutation.mutate()}
            disabled={billingMutation.isPending}
            className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4" />
            {billingMutation.isPending ? 'Executing node-cron...' : 'Run Billing Now'}
          </button>
        )}
      </div>

      {/* Invoice Table Container */}
      <div className="flex flex-col flex-1">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(inv) => navigate(`/invoices/${inv.id}`)}
          emptyTitle="No invoices match this filter"
          emptyDescription="Invoices are generated automatically by the recurring billing engine or on quotation acceptance."
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
