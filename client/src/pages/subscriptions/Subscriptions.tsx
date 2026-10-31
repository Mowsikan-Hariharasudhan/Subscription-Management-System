import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Repeat } from 'lucide-react';
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

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const columns: Column<Subscription>[] = [
    {
      header: 'SUBSCRIPTION #',
      cell: (s) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-bold text-plum-primary">{s.number}</span>
        </div>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (s) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F5E6EE] text-plum-primary font-bold text-xs flex items-center justify-center shrink-0 border border-plum-border">
            {getInitials(s.customer?.name)}
          </div>
          <div>
            <p className="font-bold text-xs text-text-primary">{s.customer?.name}</p>
            <p className="text-[11px] text-text-secondary">{s.customer?.companyName || 'Individual'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'PLAN',
      cell: (s) => (
        <div>
          <p className="font-bold text-xs text-text-primary">{s.plan?.name}</p>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">{s.plan?.billingFrequency}</p>
        </div>
      ),
    },
    {
      header: 'STATUS',
      cell: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: 'START DATE',
      cell: (s) => <span className="text-xs text-text-secondary font-mono">{formatDate(s.startDate)}</span>,
    },
    {
      header: 'NEXT BILLING',
      cell: (s) => (
        <span className="text-xs text-text-secondary font-mono">
          {s.nextBillingDate ? formatDate(s.nextBillingDate) : '—'}
        </span>
      ),
    },
    {
      header: 'TOTAL',
      cell: (s) => <CurrencyDisplay amount={s.total} size="sm" className="font-bold font-mono text-text-primary" />,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Active Subscriptions"
        description="Manage the complete recurring contract lifecycle from draft proposals to active service fulfillment"
        actions={
          <Button onClick={() => navigate('/quotations')} size="md">
            <Plus className="w-4 h-4 mr-1.5" /> New Subscription
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Input
            placeholder="Search by number or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10 text-xs rounded-xl"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-xl border border-border-main bg-white px-4 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
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
