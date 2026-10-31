import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Repeat, Filter } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { Subscription, SubscriptionStatus } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
      cell: (s) => (
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
            <Repeat className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs font-semibold text-plum-primary">{s.number}</span>
        </div>
      ),
    },
    {
      header: 'Customer',
      cell: (s) => (
        <div>
          <p className="font-medium text-xs text-text-primary">{s.customer?.name}</p>
          <p className="text-[11px] text-text-secondary">{s.customer?.companyName}</p>
        </div>
      ),
    },
    {
      header: 'Plan',
      cell: (s) => (
        <div>
          <p className="font-medium text-xs text-text-primary">{s.plan?.name}</p>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">{s.plan?.billingFrequency}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: 'Start Date',
      cell: (s) => <span className="text-xs text-text-secondary font-mono">{formatDate(s.startDate)}</span>,
    },
    {
      header: 'Next Billing',
      cell: (s) => (
        <span className="text-xs text-text-secondary font-mono">
          {s.nextBillingDate ? formatDate(s.nextBillingDate) : '—'}
        </span>
      ),
    },
    {
      header: 'Total',
      cell: (s) => <CurrencyDisplay amount={s.total} size="sm" className="font-semibold font-mono" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Subscriptions"
        description="Manage the complete subscription lifecycle from draft to closure"
        actions={
          <Button onClick={() => navigate('/quotations')} size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Subscription
          </Button>
        }
      />

      <div className="bg-white p-3 rounded-lg border border-border-main shadow-subtle flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Input
            placeholder="Search by number or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-xs"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border-main bg-white px-3 text-xs text-text-primary focus:outline-none focus:border-plum-primary focus:ring-1 focus:ring-plum-primary"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(s) => navigate(`/subscriptions/${s.id}`)}
        emptyTitle="No subscriptions found"
        emptyDescription="Subscriptions are created by converting accepted quotations."
      />

      {data?.pagination && (
        <Pagination
          page={page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          limit={data.pagination.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
