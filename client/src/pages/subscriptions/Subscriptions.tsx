import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Repeat } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { Subscription, SubscriptionStatus } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { formatDate } from '../../lib/utils';

const STATUS_OPTIONS: SubscriptionStatus[] = ['DRAFT', 'QUOTATION', 'CONFIRMED', 'ACTIVE', 'PAUSED', 'CLOSED'];

export const Subscriptions: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions', { page, search, status: statusFilter }],
    queryFn: () => subscriptionService.list({ page, limit: 10, search, status: statusFilter || undefined }),
  });

  const columns: Column<Subscription>[] = [
    {
      header: 'Subscription #',
      className: 'w-[20%]',
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <Repeat className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-bold text-odoo tracking-tight">{s.number}</span>
        </div>
      ),
    },
    {
      header: 'Customer',
      className: 'w-[24%]',
      cell: (s) => (
        <div>
          <p className="font-bold text-odoo-dark text-[0.875rem]">{s.customer?.name}</p>
          <p className="text-[0.75rem] text-gray-500 font-medium truncate mt-0.5">{s.customer?.companyName || 'Individual'}</p>
        </div>
      ),
    },
    {
      header: 'Plan',
      cell: (s) => (
        <div>
          <p className="font-semibold text-sm text-odoo-dark">{s.plan?.name}</p>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[0.6875rem] font-bold text-gray-600 font-mono uppercase">
            {s.plan?.billingFrequency}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (s) => (
        <div className="text-center">
          <StatusBadge status={s.status} />
        </div>
      ),
    },
    {
      header: 'Next Billing',
      className: 'text-center',
      cell: (s) => (
        <div className="text-center text-[0.8125rem] font-semibold text-gray-700 font-mono">
          {s.nextBillingDate ? formatDate(s.nextBillingDate) : '—'}
        </div>
      ),
    },
    {
      header: 'Total Value',
      className: 'text-right font-mono',
      cell: (s) => (
        <div className="text-right font-mono font-bold text-[0.875rem] text-odoo-dark">
          <CurrencyDisplay amount={s.total} size="sm" />
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
            Subscriptions
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Manage the complete recurring contract lifecycle from quotation to renewal
          </p>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative w-full sm:w-[24rem]">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by contract # or customer..."
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

        <button
          onClick={() => navigate('/quotations')}
          className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> New Subscription
        </button>
      </div>

      {/* Subscription Table */}
      <div className="flex flex-col flex-1">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(s) => navigate(`/subscriptions/${s.id}`)}
          emptyTitle="No subscriptions match this filter"
          emptyDescription="Create a quotation or adjust your search filter."
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
