import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Receipt, Zap, ChevronDown } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { Invoice, InvoiceStatus } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
      alert(`Billing cycle complete. Created: ${res.data?.created ?? 0} invoices.`);
    },
    onError: (err: any) => {
      alert(`Billing failed: ${err.response?.data?.message || err.message}`);
    },
  });

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'INVOICE #',
      cell: (inv) => (
        <span className="font-mono text-xs font-bold text-plum-primary">{inv.number}</span>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (inv) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F5E6EE] text-plum-primary font-bold text-xs flex items-center justify-center shrink-0 border border-plum-border">
            {getInitials(inv.customer?.name)}
          </div>
          <div>
            <p className="font-bold text-xs text-text-primary">{inv.customer?.name}</p>
            <p className="text-[11px] text-text-secondary font-mono">{inv.subscription?.number}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'BILLING PERIOD',
      cell: (inv) => (
        <span className="text-xs text-text-secondary font-mono">
          {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      header: 'TOTAL',
      cell: (inv) => <CurrencyDisplay amount={inv.total} size="sm" className="font-bold font-mono text-text-primary" />,
    },
    {
      header: 'OUTSTANDING',
      cell: (inv) => (
        <CurrencyDisplay
          amount={inv.outstanding}
          size="sm"
          className={`font-mono font-bold ${inv.outstanding > 0 && inv.status === 'CONFIRMED' ? 'text-rose-600' : 'text-emerald-600'}`}
        />
      ),
    },
    {
      header: 'DUE DATE',
      cell: (inv) => {
        const isOverdue = inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date();
        return (
          <span className={`text-xs font-mono ${isOverdue ? 'text-rose-600 font-bold' : 'text-text-secondary'}`}>
            {formatDate(inv.dueDate)}
            {isOverdue && ' ⚠️'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recurring Invoices"
        description="Automated recurring billing statements generated from active subscription cycles"
        actions={
          role === 'ADMIN' ? (
            <Button
              size="md"
              onClick={() => billingMutation.mutate()}
              isLoading={billingMutation.isPending}
            >
              <Zap className="w-4 h-4 mr-1.5 text-amber-300" /> Run Billing Cycle
            </Button>
          ) : undefined
        }
      />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Input
            placeholder="Search by invoice # or customer..."
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

        <div className="ml-auto hidden sm:flex items-center space-x-1.5 text-xs text-text-secondary font-mono">
          <Receipt className="w-4 h-4" />
          <span>{data?.pagination?.total ?? 0} total invoices</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(inv) => navigate(`/invoices/${inv.id}`)}
        emptyTitle="No invoices found"
        emptyDescription="Invoices are generated automatically by the billing engine."
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
