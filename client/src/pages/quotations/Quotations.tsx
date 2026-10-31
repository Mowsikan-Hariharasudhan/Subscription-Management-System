import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, LayoutTemplate, FileText } from 'lucide-react';
import { quotationService } from '../../services/quotationService';
import { customerService } from '../../services/customerService';
import { planService } from '../../services/planService';
import { productService } from '../../services/productService';
import { taxService } from '../../services/taxService';
import { Quotation } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
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

  const columns: Column<Quotation>[] = [
    {
      header: 'Quotation #',
      className: 'w-[18%]',
      cell: (q) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-bold text-odoo tracking-tight">{q.number}</span>
        </div>
      ),
    },
    {
      header: 'Customer',
      className: 'w-[26%]',
      cell: (q) => (
        <div>
          <span className="font-bold text-odoo-dark text-[0.875rem] block">{q.customer?.name}</span>
          <span className="text-[0.75rem] text-gray-500 font-medium truncate mt-0.5 block">
            {q.customer?.companyName || 'Individual'}
          </span>
        </div>
      ),
    },
    {
      header: 'Subscription Plan',
      cell: (q) => (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[0.6875rem] font-bold text-gray-700 font-mono uppercase">
          {q.plan?.name || 'Custom Blueprint'}
        </span>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (q) => (
        <div className="text-center">
          <StatusBadge status={q.status} />
        </div>
      ),
    },
    {
      header: 'Total Value',
      className: 'font-mono text-right',
      cell: (q) => (
        <div className="text-right font-mono font-bold text-[0.875rem] text-odoo-dark">
          <CurrencyDisplay amount={q.total} size="sm" />
        </div>
      ),
    },
    {
      header: 'Issued Date',
      className: 'text-right',
      cell: (q) => (
        <div className="text-right text-[0.8125rem] font-medium text-gray-500 font-mono">
          {formatDate(q.createdAt)}
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
            Quotations & Proposals
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Draft proposals, configure billing line items, and convert accepted quotes to active subscriptions
          </p>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="relative w-full sm:w-[28rem]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotes by number or client..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-focus w-full pl-11 pr-4 py-2.5 bg-white border-[1.5px] border-black rounded-lg text-[0.875rem] font-medium text-odoo-dark shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/quotations/templates"
            className="px-4 py-2.5 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-[0.875rem] rounded-lg hover:bg-gray-50 transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center gap-2"
          >
            <LayoutTemplate className="w-4 h-4" /> Templates
          </Link>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Quotation
          </button>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="flex flex-col flex-1">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(q) => navigate(`/quotations/${q.id}`)}
          emptyTitle="No quotations found"
          emptyDescription="Create your first proposal or blueprint template."
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

      {/* Create Quotation Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Draft Quotation Proposal"
        description="Select customer, recurring billing plan, and line items"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              >
                <option value="">Select customer...</option>
                {customers?.data?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Subscription Plan
              </label>
              <select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              >
                <option value="">No recurring plan (One-time)</option>
                {plans?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.billingFrequency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Line Item Product <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => {
                  const sel = products?.data?.find((p: any) => p.id === e.target.value);
                  setFormData({
                    ...formData,
                    productId: e.target.value,
                    unitPriceRupees: sel ? (sel.salesPrice / 100).toFixed(2) : formData.unitPriceRupees,
                  });
                }}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              >
                <option value="">Select product...</option>
                {products?.data?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{(p.salesPrice / 100).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Unit Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.unitPriceRupees}
                onChange={(e) => setFormData({ ...formData, unitPriceRupees: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Applicable Tax Rule
              </label>
              <select
                value={formData.taxRuleId}
                onChange={(e) => setFormData({ ...formData, taxRuleId: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              >
                <option value="">No tax (0%)</option>
                {taxes?.map((tx: any) => (
                  <option key={tx.id} value={tx.id}>
                    {tx.name} ({tx.rate}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t-[1.5px] border-black/10">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-2.5 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-[0.875rem] rounded-xl hover:bg-gray-50 transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 text-white font-bold text-[0.875rem] rounded-xl btn-primary cursor-pointer"
            >
              {createMutation.isPending ? 'Drafting...' : 'Create Quotation'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
