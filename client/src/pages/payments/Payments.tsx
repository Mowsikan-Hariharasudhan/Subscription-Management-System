import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { Payment } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Input } from '../../components/ui/input';
import { formatDate } from '../../lib/utils';

const METHOD_COLORS: Record<string, string> = {
  CASH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BANK_TRANSFER: 'bg-blue-50 text-blue-700 border-blue-200',
  UPI: 'bg-violet-50 text-violet-700 border-violet-200',
  CARD: 'bg-amber-50 text-amber-700 border-amber-200',
  OTHER: 'bg-surface-subtle text-text-secondary border-border-main',
};

export const Payments: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['payments', { page, search }],
    queryFn: () => paymentService.list({ page, limit: 15, search }),
  });

  const columns: Column<Payment>[] = [
    {
      header: 'Payment ID',
      cell: (p) => (
        <span className="font-mono text-xs text-text-secondary">{p.id.slice(0, 8).toUpperCase()}…</span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (p) => (
        <button
          className="font-mono text-xs font-semibold text-plum-primary hover:underline cursor-pointer"
          onClick={(e) => { e.stopPropagation(); navigate(`/invoices/${p.invoiceId}`); }}
        >
          {(p as any).invoice?.number || p.invoiceId.slice(0, 8)}
        </button>
      ),
    },
    {
      header: 'Customer',
      cell: (p) => (
        <span className="text-xs font-medium text-text-primary">{(p as any).invoice?.customer?.name || '—'}</span>
      ),
    },
    {
      header: 'Method',
      cell: (p) => (
        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border font-mono ${METHOD_COLORS[p.method] || METHOD_COLORS.OTHER}`}>
          {p.method.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Amount',
      cell: (p) => <CurrencyDisplay amount={p.amount} size="sm" className="font-semibold text-emerald-600 font-mono" />,
    },
    {
      header: 'Payment Date',
      cell: (p) => <span className="text-xs text-text-secondary font-mono">{formatDate(p.paymentDate)}</span>,
    },
    {
      header: 'Recorded By',
      cell: (p) => (
        <span className="text-xs text-text-secondary">{p.createdBy?.email || '—'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Payment History"
        description="All recorded payments against confirmed invoices"
      />

      <div className="bg-white p-3 rounded-lg border border-border-main shadow-subtle flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Input
            placeholder="Search payments..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-xs"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
        </div>
        <div className="ml-auto flex items-center space-x-1.5 text-xs text-text-secondary font-mono">
          <CreditCard className="w-4 h-4" />
          <span>{data?.pagination?.total ?? 0} payments</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(p) => navigate(`/invoices/${p.invoiceId}`)}
        emptyTitle="No payments recorded"
        emptyDescription="Payments are recorded against confirmed invoices by staff."
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
