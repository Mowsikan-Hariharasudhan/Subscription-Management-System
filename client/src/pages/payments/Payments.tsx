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

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const columns: Column<Payment>[] = [
    {
      header: 'PAYMENT ID',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-text-primary">
          PAY-{p.id.slice(0, 6).toUpperCase()}
        </span>
      ),
    },
    {
      header: 'INVOICE #',
      cell: (p) => (
        <button
          className="font-mono text-xs font-bold text-plum-primary hover:underline cursor-pointer"
          onClick={(e) => { e.stopPropagation(); navigate(`/invoices/${p.invoiceId}`); }}
        >
          {(p as any).invoice?.number || p.invoiceId.slice(0, 8)}
        </button>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (p) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-[#F5E6EE] text-plum-primary font-bold text-[11px] flex items-center justify-center shrink-0 border border-plum-border">
            {getInitials((p as any).invoice?.customer?.name)}
          </div>
          <span className="text-xs font-bold text-text-primary">{(p as any).invoice?.customer?.name || '—'}</span>
        </div>
      ),
    },
    {
      header: 'METHOD',
      cell: (p) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold border font-mono ${METHOD_COLORS[p.method] || METHOD_COLORS.OTHER}`}>
          {p.method.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'AMOUNT',
      cell: (p) => <CurrencyDisplay amount={p.amount} size="sm" className="font-bold text-emerald-600 font-mono" />,
    },
    {
      header: 'PAYMENT DATE',
      cell: (p) => <span className="text-xs text-text-secondary font-mono">{formatDate(p.paymentDate)}</span>,
    },
    {
      header: 'RECORDED BY',
      cell: (p) => (
        <span className="text-xs text-text-secondary font-mono">{p.createdBy?.email?.split('@')[0] || '—'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payment Ledger"
        description="Audit trail of all settled transactions and recorded receipts against confirmed invoices"
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Input
            placeholder="Search payments by invoice or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10 text-xs rounded-xl"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
        </div>
        <div className="ml-auto flex items-center space-x-1.5 text-xs text-text-secondary font-mono">
          <CreditCard className="w-4 h-4 text-plum-primary" />
          <span>{data?.pagination?.total ?? 0} payments recorded</span>
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
