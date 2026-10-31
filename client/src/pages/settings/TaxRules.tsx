import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Percent, Check, X, ShieldAlert } from 'lucide-react';
import { taxService } from '../../services/taxService';
import { TaxRule } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { formatDate, cn } from '../../lib/utils';

export const TaxRules: React.FC = () => {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ratePercent: '18',
    description: '',
    effectiveFrom: '',
    effectiveTo: '',
  });

  const { data: taxes, isLoading } = useQuery({
    queryKey: ['taxes'],
    queryFn: () => taxService.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => taxService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxes'] });
      setIsCreateOpen(false);
      setForm({ name: '', ratePercent: '18', description: '', effectiveFrom: '', effectiveTo: '' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => taxService.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['taxes'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: form.name,
      rate: Math.round(parseFloat(form.ratePercent || '0') * 100), // basis points
      description: form.description || undefined,
      effectiveFrom: form.effectiveFrom || undefined,
      effectiveTo: form.effectiveTo || undefined,
    });
  };

  const columns: Column<TaxRule>[] = [
    {
      header: 'Tax Rule',
      className: 'w-[35%]',
      cell: (tx) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <Percent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[0.875rem] font-bold text-odoo-dark truncate">{tx.name}</div>
            {tx.description && (
              <div className="text-[0.75rem] text-gray-500 font-medium truncate mt-0.5 max-w-xs">
                {tx.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Tax Rate',
      className: 'text-center font-mono',
      cell: (tx) => (
        <div className="text-center font-mono font-bold text-[0.875rem] text-odoo-dark">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-odoo/10 border border-odoo/20 text-odoo-dark font-bold">
            {(tx.rate / 100).toFixed(2)}% GST
          </span>
        </div>
      ),
    },
    {
      header: 'Validity Period',
      className: 'text-center font-mono',
      cell: (tx) => (
        <div className="text-center text-[0.8125rem] text-gray-600 font-medium">
          {tx.effectiveFrom ? formatDate(tx.effectiveFrom) : 'Universal'} – {tx.effectiveTo ? formatDate(tx.effectiveTo) : 'Perpetual'}
        </div>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (tx) => (
        <div className="text-center">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded border-[1.5px] border-black text-[0.625rem] font-bold uppercase tracking-widest shadow-[2px_2px_0_#000]',
              tx.isActive ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#b91c1c]'
            )}
          >
            {tx.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      ),
    },
    {
      header: 'Toggle',
      className: 'text-right',
      cell: (tx) => (
        <div className="text-right">
          {role === 'ADMIN' && (
            <button
              onClick={() => toggleMutation.mutate({ id: tx.id, isActive: !tx.isActive })}
              className="px-3 py-1 bg-white border-[1.5px] border-black rounded-lg text-xs font-bold text-odoo-dark hover:bg-gray-50 transition-all hover:shadow-[0_2px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              {tx.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
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
            Tax Configuration
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Indian GST compliance schedules, tax rules, and snapshot engines
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Tax Rule
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="flex flex-col flex-1 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <DataTable
          columns={columns}
          data={taxes || []}
          isLoading={isLoading}
          emptyTitle="No tax rules configured"
          emptyDescription="Configure Indian GST rules (18%, 12%, 5%) for automated invoice generation."
        />
      </div>

      {/* Create Tax Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add GST Tax Rule"
        description="Configure tax rate basis points and validity schedules"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Rule Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. IGST 18% Standard SaaS"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Tax Rate Percentage (%) <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="18.00"
              value={form.ratePercent}
              onChange={(e) => setForm({ ...form, ratePercent: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Effective From
              </label>
              <input
                type="date"
                value={form.effectiveFrom}
                onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Effective To
              </label>
              <input
                type="date"
                value={form.effectiveTo}
                onChange={(e) => setForm({ ...form, effectiveTo: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="Interstate GST for electronic software downloads"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
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
              {createMutation.isPending ? 'Saving...' : 'Deploy Rule'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
