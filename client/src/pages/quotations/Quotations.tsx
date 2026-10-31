import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, LayoutTemplate } from 'lucide-react';
import { quotationService } from '../../services/quotationService';
import { customerService } from '../../services/customerService';
import { planService } from '../../services/planService';
import { productService } from '../../services/productService';
import { taxService } from '../../services/taxService';
import { Quotation } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { formatDate } from '../../lib/utils';

export const Quotations: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: '',
    planId: '',
    paymentTerms: 'Net 15',
    productId: '',
    quantity: 1,
    unitPriceRupees: '2000.00',
    taxRuleId: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['quotations', { page, status: statusFilter, search }],
    queryFn: () => quotationService.list({ page, limit: 10, status: statusFilter || undefined, search }),
  });

  const { data: customers } = useQuery({
    queryKey: ['customers-list-all'],
    queryFn: () => customerService.list({ limit: 100 }),
  });

  const { data: plans } = useQuery({
    queryKey: ['plans-list-all'],
    queryFn: () => planService.list(),
  });

  const { data: products } = useQuery({
    queryKey: ['products-list-all'],
    queryFn: () => productService.list({ limit: 100 }),
  });

  const { data: taxes } = useQuery({
    queryKey: ['taxes-list-all'],
    queryFn: () => taxService.list(),
  });

  const createMutation = useMutation({
    mutationFn: (form: any) =>
      quotationService.create({
        customerId: form.customerId,
        planId: form.planId || null,
        paymentTerms: form.paymentTerms,
        lines: [
          {
            productId: form.productId,
            quantity: parseInt(String(form.quantity), 10) || 1,
            unitPrice: Math.round(parseFloat(form.unitPriceRupees || '0') * 100),
            taxRuleId: form.taxRuleId || null,
          },
        ],
      }),
    onSuccess: (qt) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      setIsCreateOpen(false);
      navigate(`/quotations/${qt.id}`);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const columns: Column<Quotation>[] = [
    {
      header: 'QUOTATION #',
      cell: (q) => (
        <span className="font-mono text-xs font-bold text-plum-primary hover:underline">
          {q.number}
        </span>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (q) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F5E6EE] text-plum-primary font-bold text-xs flex items-center justify-center shrink-0 border border-plum-border">
            {getInitials(q.customer?.name)}
          </div>
          <div>
            <span className="font-bold text-xs text-text-primary block">{q.customer?.name}</span>
            {q.customer?.companyName && (
              <span className="text-[11px] text-text-secondary">{q.customer.companyName}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'SUBSCRIPTION PLAN',
      cell: (q) => (
        <span className="text-xs text-text-secondary font-medium">{q.plan?.name || 'Manual'}</span>
      ),
    },
    {
      header: 'STATUS',
      cell: (q) => <StatusBadge status={q.status} />,
    },
    {
      header: 'TOTAL AMOUNT',
      cell: (q) => <CurrencyDisplay amount={q.total} size="sm" className="font-bold text-text-primary font-mono" />,
    },
    {
      header: 'DATE',
      cell: (q) => <span className="text-xs text-text-secondary font-mono">{formatDate(q.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quotations"
        description="Draft and manage client pricing proposals and convert accepted quotes to active subscriptions"
        actions={
          <div className="flex items-center space-x-2">
            <Link to="/quotations/templates">
              <Button variant="outline" size="md">
                <LayoutTemplate className="w-4 h-4 mr-1.5" /> Templates
              </Button>
            </Link>
            <Button onClick={() => setIsCreateOpen(true)} size="md">
              <Plus className="w-4 h-4 mr-1.5" /> New Quotation
            </Button>
          </div>
        }
      />

      {/* Filter Bar matching reference */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Input
            placeholder="Search quotation # or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 text-xs rounded-xl"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs p-1 bg-white border border-border-main rounded-xl shadow-sm">
          {['', 'DRAFT', 'SENT', 'ACCEPTED', 'EXPIRED', 'DECLINED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-plum-primary text-white shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {st || 'All Statuses'}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(q) => navigate(`/quotations/${q.id}`)}
        emptyTitle="No quotations found"
        emptyDescription="Create a new quote proposal for a customer."
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

      {/* New Quotation Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Quotation"
        description="Select a customer, plan, and initial product"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="q-customer" required>
                Target Customer
              </Label>
              <select
                id="q-customer"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                className="flex h-10 w-full rounded-xl border border-border-main bg-white px-3.5 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
              >
                <option value="">Select customer...</option>
                {(customers?.data || []).map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="q-plan">Subscription Plan</Label>
              <select
                id="q-plan"
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-border-main bg-white px-3.5 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
              >
                <option value="">Select plan cadence...</option>
                {(plans || []).map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.billingFrequency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-surface-main rounded-2xl border border-border-main space-y-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block">
              Primary Line Item
            </span>

            <div>
              <Label htmlFor="q-prod" required>
                Product
              </Label>
              <select
                id="q-prod"
                value={formData.productId}
                onChange={(e) => {
                  const selProd = (products?.data || []).find((p: any) => p.id === e.target.value);
                  setFormData({
                    ...formData,
                    productId: e.target.value,
                    unitPriceRupees: selProd ? (selProd.salesPrice / 100).toFixed(2) : formData.unitPriceRupees,
                  });
                }}
                required
                className="flex h-10 w-full rounded-xl border border-border-main bg-white px-3.5 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
              >
                <option value="">Select product...</option>
                {(products?.data || []).map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="q-qty" required>
                  Quantity
                </Label>
                <Input
                  id="q-qty"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="q-price" required>
                  Unit Price (₹)
                </Label>
                <Input
                  id="q-price"
                  type="number"
                  step="0.01"
                  value={formData.unitPriceRupees}
                  onChange={(e) => setFormData({ ...formData, unitPriceRupees: e.target.value })}
                  required
                  className="rounded-xl font-mono"
                />
              </div>

              <div>
                <Label htmlFor="q-tax">Tax Rule</Label>
                <select
                  id="q-tax"
                  value={formData.taxRuleId}
                  onChange={(e) => setFormData({ ...formData, taxRuleId: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-border-main bg-white px-3.5 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
                >
                  <option value="">No tax (0%)</option>
                  {(taxes || []).map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({(t.rate / 100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="q-terms">Payment Terms</Label>
            <Input
              id="q-terms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-3 border-t border-border-main">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>
              Create Quotation
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
