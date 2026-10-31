import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag, Percent, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { discountService } from '../../services/discountService';
import { DiscountRule } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';

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
      setForm({ name: '', type: 'PERCENTAGE', valuePercent: '', valueFixed: '', minPurchaseAmount: '', minQuantity: '1', startDate: '', endDate: '', maxUsageCount: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => discountService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = form.type === 'PERCENTAGE'
      ? Math.round(parseFloat(form.valuePercent || '0') * 100) // basis points
      : Math.round(parseFloat(form.valueFixed || '0') * 100); // paise

    createMutation.mutate({
      name: form.name,
      type: form.type,
      value,
      minPurchaseAmount: form.minPurchaseAmount ? Math.round(parseFloat(form.minPurchaseAmount) * 100) : 0,
      minQuantity: parseInt(form.minQuantity) || 1,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      maxUsageCount: form.maxUsageCount ? parseInt(form.maxUsageCount) : undefined,
    });
  };

  if (isLoading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Discount Rules"
        description="Configure automatic discount rules applied during invoice generation"
        actions={
          role === 'ADMIN' ? (
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create Discount
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-xs text-text-secondary cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded" />
          <span>Show inactive</span>
        </label>
        <span className="text-xs text-text-secondary">{discounts?.length ?? 0} rules</span>
      </div>

      {!discounts || discounts.length === 0 ? (
        <EmptyState title="No discount rules" description="Create discount rules to automatically apply savings during billing." icon={<Tag className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {discounts.map((discount) => (
            <DiscountCard
              key={discount.id}
              discount={discount}
              canEdit={role === 'ADMIN'}
              onDelete={() => {
                if (confirm(`Delete discount "${discount.name}"?`)) deleteMutation.mutate(discount.id);
              }}
            />
          ))}
        </div>
      )}

      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Discount Rule" description="Define automatic discount conditions">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="disc-name" required>Discount Name</Label>
            <Input id="disc-name" placeholder="e.g. New Customer 10% Off" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div>
            <Label htmlFor="disc-type" required>Discount Type</Label>
            <select id="disc-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </div>

          {form.type === 'PERCENTAGE' ? (
            <div>
              <Label htmlFor="disc-pct" required>Percentage (%)</Label>
              <Input id="disc-pct" type="number" step="0.01" min="0" max="100" placeholder="10.00" value={form.valuePercent} onChange={(e) => setForm({ ...form, valuePercent: e.target.value })} required />
            </div>
          ) : (
            <div>
              <Label htmlFor="disc-fixed" required>Fixed Amount (₹)</Label>
              <Input id="disc-fixed" type="number" step="0.01" min="0" placeholder="500.00" value={form.valueFixed} onChange={(e) => setForm({ ...form, valueFixed: e.target.value })} required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="disc-min-purchase">Min Purchase (₹)</Label>
              <Input id="disc-min-purchase" type="number" step="0.01" min="0" placeholder="0" value={form.minPurchaseAmount} onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="disc-min-qty">Min Quantity</Label>
              <Input id="disc-min-qty" type="number" min="1" placeholder="1" value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="disc-start">Start Date</Label>
              <Input id="disc-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="disc-end">End Date</Label>
              <Input id="disc-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="disc-max-usage">Max Usage Count (empty = unlimited)</Label>
            <Input id="disc-max-usage" type="number" min="1" placeholder="Unlimited" value={form.maxUsageCount} onChange={(e) => setForm({ ...form, maxUsageCount: e.target.value })} />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>Create Rule</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

const DiscountCard: React.FC<{ discount: DiscountRule; canEdit: boolean; onDelete: () => void }> = ({ discount, canEdit, onDelete }) => {
  const isPercentage = discount.type === 'PERCENTAGE';
  const displayValue = isPercentage
    ? `${(discount.value / 100).toFixed(1)}% off`
    : undefined;

  return (
    <Card className={`relative ${!discount.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPercentage ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isPercentage ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-text-primary">{discount.name}</p>
              <p className="text-xs text-text-secondary">{discount.type}</p>
            </div>
          </div>
          <Badge variant={discount.isActive ? 'success' : 'danger'}>{discount.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge>
        </div>

        <div className="text-2xl font-bold text-plum-primary mb-3">
          {isPercentage ? displayValue : <CurrencyDisplay amount={discount.value} size="md" className="font-bold text-plum-primary" />}
          {!isPercentage && <span className="text-base font-normal text-text-secondary ml-1">off</span>}
        </div>

        <div className="space-y-1 text-xs text-text-secondary">
          {discount.minPurchaseAmount > 0 && <p>Min purchase: <CurrencyDisplay amount={discount.minPurchaseAmount} size="sm" className="inline" /></p>}
          {discount.startDate && <p>From: {formatDate(discount.startDate)}</p>}
          {discount.endDate && <p>Until: {formatDate(discount.endDate)}</p>}
          {discount.maxUsageCount && (
            <p>Usage: {discount.currentUsageCount} / {discount.maxUsageCount}</p>
          )}
          {!discount.maxUsageCount && <p>Usage: {discount.currentUsageCount} (unlimited)</p>}
        </div>

        {canEdit && (
          <div className="flex justify-end mt-3 pt-2 border-t border-border-main/40">
            <button onClick={onDelete} className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
