import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag, Trash2, Calendar, ShoppingCart } from 'lucide-react';
import { discountService } from '../../services/discountService';
import { DiscountRule } from '../../types';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Dialog } from '../../components/ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { formatDate, cn } from '../../lib/utils';

export const Discounts: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '',
    type: 'PERCENTAGE',
    valuePercent: '',
    valueFixed: '',
    minPurchaseAmount: '',
    minQuantity: '1',
    startDate: '',
    endDate: '',
    maxUsageCount: '',
  });

  const { data: discounts, isLoading } = useQuery({
    queryKey: ['discounts', showInactive],
    queryFn: () => discountService.list(showInactive),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => discountService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      setIsCreateOpen(false);
      setForm({
        name: '',
        type: 'PERCENTAGE',
        valuePercent: '',
        valueFixed: '',
        minPurchaseAmount: '',
        minQuantity: '1',
        startDate: '',
        endDate: '',
        maxUsageCount: '',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => discountService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value =
      form.type === 'PERCENTAGE'
        ? Math.round(parseFloat(form.valuePercent || '0') * 100) // basis points
        : Math.round(parseFloat(form.valueFixed || '0') * 100); // paise

    createMutation.mutate({
      name: form.name.trim(),
      type: form.type,
      value,
      minPurchaseAmount: form.minPurchaseAmount ? Math.round(parseFloat(form.minPurchaseAmount) * 100) : 0,
      minQuantity: parseInt(form.minQuantity) || 1,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      maxUsageCount: form.maxUsageCount ? parseInt(form.maxUsageCount) : undefined,
    });
  };

  if (isLoading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-end anim-slide-up">
        <div>
          <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
            Discount Rules
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Configure automatic promotional discounts applied during customer checkout and billing
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Discount
          </button>
        )}
      </div>

      {/* Filter / Meta bar */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <label className="flex items-center space-x-2 cursor-pointer font-medium">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-gray-300 text-odoo focus:ring-odoo"
          />
          <span>Show inactive rules</span>
        </label>
        <span className="font-semibold">{discounts?.length ?? 0} total rules</span>
      </div>

      {/* Table Container */}
      {!discounts || discounts.length === 0 ? (
        <EmptyState
          title="No discount rules"
          description="Create discount rules to automatically apply promotional savings during billing."
          icon={<Tag className="w-8 h-8" />}
        />
      ) : (
        <div className="w-full bg-white border-[1.5px] border-black rounded-2xl shadow-sm overflow-hidden anim-slide-up flex flex-col flex-1">
          <div className="overflow-x-auto flex-1 px-8 pb-8 pt-2">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest w-[25%]">
                    Discount Rule
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest text-center w-[12%]">
                    Type
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest text-right w-[15%]">
                    Benefit
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest w-[18%]">
                    Conditions
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest w-[15%]">
                    Validity
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest text-center w-[10%]">
                    Status
                  </th>
                  {role === 'ADMIN' && (
                    <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest text-right w-[5%]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount: DiscountRule) => {
                  const isPercentage = discount.type === 'PERCENTAGE';
                  return (
                    <tr
                      key={discount.id}
                      className={cn(
                        'border-t border-gray-100 group hover:bg-gray-50/50 transition-colors',
                        !discount.isActive && 'opacity-60'
                      )}
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-xs border border-odoo/20 shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-odoo-dark text-[0.9375rem]">{discount.name}</p>
                            <p className="text-[0.75rem] text-gray-500 font-mono">
                              Usage: {discount.currentUsageCount}
                              {discount.maxUsageCount ? ` / ${discount.maxUsageCount}` : ' (unlimited)'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider border',
                            isPercentage
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          )}
                        >
                          {discount.type}
                        </span>
                      </td>

                      <td className="py-4 text-right">
                        <span className="text-[1rem] font-bold font-sans text-odoo-dark">
                          {isPercentage ? (
                            `${(discount.value / 100).toFixed(1)}% OFF`
                          ) : (
                            <CurrencyDisplay amount={discount.value} size="md" className="font-bold text-emerald-700" />
                          )}
                        </span>
                      </td>

                      <td className="py-4 text-xs text-gray-600 space-y-0.5">
                        {discount.minPurchaseAmount > 0 && (
                          <div className="flex items-center gap-1.5">
                            <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                            <span>Min: <CurrencyDisplay amount={discount.minPurchaseAmount} size="sm" className="inline font-semibold" /></span>
                          </div>
                        )}
                        {discount.minQuantity > 1 && (
                          <p>Min Qty: {discount.minQuantity} units</p>
                        )}
                        {discount.minPurchaseAmount === 0 && discount.minQuantity <= 1 && (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>

                      <td className="py-4 text-xs text-gray-600">
                        {discount.startDate || discount.endDate ? (
                          <div className="flex items-center gap-1.5 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>
                              {discount.startDate ? formatDate(discount.startDate) : 'Now'}
                              {' → '}
                              {discount.endDate ? formatDate(discount.endDate) : 'Indefinite'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Always valid</span>
                        )}
                      </td>

                      <td className="py-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-3.5 py-1 rounded-full border-[1.5px] border-black text-[0.6875rem] font-bold uppercase tracking-wider',
                            discount.isActive ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#b91c1c]'
                          )}
                        >
                          {discount.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      {role === 'ADMIN' && (
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete discount "${discount.name}"?`)) {
                                deleteMutation.mutate(discount.id);
                              }
                            }}
                            title="Delete Discount"
                            className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Discount Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Discount Rule"
        description="Define automatic discount conditions"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {createMutation.isError && (
            <div className="p-3 rounded-xl bg-red-50 border-[1.5px] border-red-300 text-xs font-bold text-red-700">
              ⚠️ {(createMutation.error as any)?.response?.data?.error || (createMutation.error as any)?.message || 'Failed to create discount rule'}
            </div>
          )}

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Discount Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Early Bird 10% Off"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </div>

          {form.type === 'PERCENTAGE' ? (
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                placeholder="10.00"
                value={form.valuePercent}
                onChange={(e) => setForm({ ...form, valuePercent: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Fixed Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                placeholder="500.00"
                value={form.valueFixed}
                onChange={(e) => setForm({ ...form, valueFixed: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Min Purchase (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={form.minPurchaseAmount}
                onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Min Quantity
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={form.minQuantity}
                onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Max Usage Count (empty = unlimited)
            </label>
            <input
              type="number"
              min="1"
              placeholder="Unlimited"
              value={form.maxUsageCount}
              onChange={(e) => setForm({ ...form, maxUsageCount: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t-[1.5px] border-black/10">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-2.5 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-[0.875rem] rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 text-white font-bold text-[0.875rem] rounded-xl btn-primary cursor-pointer"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Rule'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
