import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers, Check, X } from 'lucide-react';
import { planService } from '../../services/planService';
import { SubscriptionPlan } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Dialog } from '../../components/ui/dialog';
import { cn } from '../../lib/utils';

export const Plans: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    billingFrequency: 'MONTHLY',
    minimumQuantity: 1,
    allowPause: true,
    allowEarlyClosure: true,
    allowRenewal: true,
    autoClose: false,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => planService.list(true),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      planService.create({
        ...data,
        minimumQuantity: parseInt(String(data.minimumQuantity), 10) || 1,
        isActive: true,
      }),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsCreateOpen(false);
      navigate(`/plans/${p.id}`);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const columns: Column<SubscriptionPlan>[] = [
    {
      header: 'Plan Name',
      className: 'w-[35%]',
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[0.875rem] font-bold text-odoo-dark truncate">{p.name}</div>
            {p.description && (
              <div className="text-[0.75rem] text-gray-500 font-medium truncate mt-0.5 max-w-xs">
                {p.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Cycle',
      className: 'text-center',
      cell: (p) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-odoo/10 border border-odoo/20 text-[0.75rem] font-bold text-odoo-dark font-mono uppercase">
            {p.billingFrequency}
          </span>
        </div>
      ),
    },
    {
      header: 'Min Qty',
      className: 'text-center font-mono',
      cell: (p) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-[0.75rem] font-bold text-gray-700 font-mono">
            {p.minimumQuantity} units
          </span>
        </div>
      ),
    },
    {
      header: 'Rules & Privileges',
      cell: (p) => (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6875rem] font-bold border',
              p.allowPause
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            )}
          >
            {p.allowPause ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            Pause
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6875rem] font-bold border',
              p.allowRenewal
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            )}
          >
            {p.allowRenewal ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            Renew
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6875rem] font-bold border',
              p.allowEarlyClosure
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            )}
          >
            {p.allowEarlyClosure ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            Early Close
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (p) => (
        <div className="text-center">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded border-[1.5px] border-black text-[0.625rem] font-bold uppercase tracking-widest shadow-[2px_2px_0_#000]',
              p.isActive ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#b91c1c]'
            )}
          >
            {p.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
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
            Subscription Plans
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Configure recurring intervals, minimum commitments, and lifecycle state rules
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      {/* Plan Table Container */}
      <div className="flex flex-col flex-1 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <DataTable
          columns={columns}
          data={plans || []}
          isLoading={isLoading}
          onRowClick={(p) => navigate(`/plans/${p.id}`)}
          emptyTitle="No subscription plans configured"
          emptyDescription="Create your first recurring billing plan to attach to quotations."
        />
      </div>

      {/* Create Plan Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Subscription Plan"
        description="Define intervals, commitment quantities, and state transition permissions"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Plan Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. ERP Annual Commitment"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Billing Frequency
              </label>
              <select
                value={formData.billingFrequency}
                onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              >
                <option value="DAILY">DAILY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Minimum Seats / Qty
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.minimumQuantity}
                onChange={(e) => setFormData({ ...formData, minimumQuantity: parseInt(e.target.value, 10) || 1 })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-2">
              Lifecycle Governance Rules
            </label>
            <div className="space-y-2.5 p-4 rounded-xl border-[1.5px] border-black bg-[#f8f6f8]">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowPause}
                  onChange={(e) => setFormData({ ...formData, allowPause: e.target.checked })}
                  className="rounded border-gray-400 text-odoo focus:ring-odoo w-4 h-4"
                />
                <span className="text-xs font-bold text-odoo-dark">Allow Customer to Pause Subscription</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowRenewal}
                  onChange={(e) => setFormData({ ...formData, allowRenewal: e.target.checked })}
                  className="rounded border-gray-400 text-odoo focus:ring-odoo w-4 h-4"
                />
                <span className="text-xs font-bold text-odoo-dark">Allow Contract Automatic / Manual Renewal</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowEarlyClosure}
                  onChange={(e) => setFormData({ ...formData, allowEarlyClosure: e.target.checked })}
                  className="rounded border-gray-400 text-odoo focus:ring-odoo w-4 h-4"
                />
                <span className="text-xs font-bold text-odoo-dark">Allow Early Contract Termination</span>
              </label>
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
              {createMutation.isPending ? 'Saving...' : 'Deploy Plan'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
