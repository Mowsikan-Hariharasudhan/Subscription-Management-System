import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowLeft, Percent, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { taxService } from '../../services/taxService';
import { TaxRule } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';

export const TaxRules: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ratePercent: '',
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
      setForm({ name: '', ratePercent: '', description: '', effectiveFrom: '', effectiveTo: '' });
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

  if (isLoading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/settings')} className="p-2 rounded-lg hover:bg-surface-main transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <PageHeader
          title="Tax Configuration"
          description="Manage tax rules applied during invoice generation"
          actions={
            role === 'ADMIN' ? (
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create Tax Rule
              </Button>
            ) : undefined
          }
        />
      </div>

      {!taxes || taxes.length === 0 ? (
        <EmptyState title="No tax rules" description="Create tax rules to apply to invoices." icon={<Percent className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxes.map((tax) => (
            <Card key={tax.id} className={!tax.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{tax.name}</p>
                      <p className="text-xs text-text-secondary">{tax.description || 'Standard tax rule'}</p>
                    </div>
                  </div>
                  <Badge variant={tax.isActive ? 'success' : 'danger'}>
                    {tax.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-plum-primary mb-3">
                  {(tax.rate / 100).toFixed(1)}%
                </div>

                <div className="space-y-1 text-xs text-text-secondary">
                  {tax.effectiveFrom && <p>From: {formatDate(tax.effectiveFrom)}</p>}
                  {tax.effectiveTo && <p>Until: {formatDate(tax.effectiveTo)}</p>}
                  {!tax.effectiveFrom && !tax.effectiveTo && <p>No date restriction</p>}
                </div>

                {role === 'ADMIN' && (
                  <div className="mt-3 pt-2 border-t border-border-main/40 flex justify-end">
                    <button
                      onClick={() => toggleMutation.mutate({ id: tax.id, isActive: !tax.isActive })}
                      className="text-xs font-medium text-plum-primary hover:underline cursor-pointer"
                    >
                      {tax.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Tax Rule" description="Define a new tax rate for invoicing">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tax-name" required>Tax Name</Label>
            <Input id="tax-name" placeholder="e.g. GST 18%" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="tax-rate" required>Tax Rate (%)</Label>
            <Input id="tax-rate" type="number" step="0.01" min="0" max="100" placeholder="18.00" value={form.ratePercent} onChange={(e) => setForm({ ...form, ratePercent: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="tax-desc">Description</Label>
            <Input id="tax-desc" placeholder="e.g. Goods and Services Tax" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tax-from">Effective From</Label>
              <Input id="tax-from" type="date" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="tax-to">Effective To</Label>
              <Input id="tax-to" type="date" value={form.effectiveTo} onChange={(e) => setForm({ ...form, effectiveTo: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>Create Tax Rule</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
