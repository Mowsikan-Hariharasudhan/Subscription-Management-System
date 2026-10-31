import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers, Calendar, Check, X } from 'lucide-react';
import { planService } from '../../services/planService';
import { SubscriptionPlan } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';

export const Plans: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    billingFrequency: 'MONTHLY',
    minimumQuantity: 1,
    allowPause: false,
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
      cell: (p) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-plum-light text-plum-primary flex items-center justify-center font-bold text-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-text-primary block">{p.name}</span>
            {p.description && <span className="text-xs text-text-secondary truncate max-w-xs block">{p.description}</span>}
          </div>
        </div>
      ),
    },
    {
      header: 'Frequency',
      cell: (p) => (
        <Badge variant={p.billingFrequency === 'YEARLY' ? 'default' : 'secondary'}>
          {p.billingFrequency}
        </Badge>
      ),
    },
    {
      header: 'Min Qty',
      cell: (p) => <span className="text-xs font-semibold text-text-primary">{p.minimumQuantity}</span>,
    },
    {
      header: 'Rules',
      cell: (p) => (
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              p.allowPause ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {p.allowPause ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>Pause</span>
          </span>
          <span
            className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              p.allowRenewal ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {p.allowRenewal ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>Renewal</span>
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (p) => (
        <Badge variant={p.isActive ? 'success' : 'danger'}>
          {p.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Subscription Plans"
        description="Billing cycle frequencies, renewal guidelines, and subscription lifecycle policies"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Plan
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={plans || []}
        isLoading={isLoading}
        onRowClick={(p) => navigate(`/plans/${p.id}`)}
        emptyTitle="No subscription plans configured"
        emptyDescription="Create your first recurring billing plan frequency."
      />

      {/* Create Plan Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Configure Subscription Plan"
        description="Define billing periodicity and subscription lifecycle rules"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <div>
            <Label htmlFor="plan-name" required>
              Plan Name
            </Label>
            <Input
              id="plan-name"
              placeholder="e.g. Monthly SaaS Plan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="plan-desc">Description</Label>
            <Input
              id="plan-desc"
              placeholder="Standard billing cadence with automatic renewal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="plan-freq" required>
                Billing Frequency
              </Label>
              <select
                id="plan-freq"
                value={formData.billingFrequency}
                onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20"
              >
                <option value="DAILY">DAILY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
              </select>
            </div>

            <div>
              <Label htmlFor="plan-min-qty" required>
                Minimum Quantity
              </Label>
              <Input
                id="plan-min-qty"
                type="number"
                min="1"
                value={formData.minimumQuantity}
                onChange={(e) => setFormData({ ...formData, minimumQuantity: parseInt(e.target.value, 10) || 1 })}
                required
              />
            </div>
          </div>

          {/* Lifecycle check boxes */}
          <div className="space-y-2 pt-2 border-t border-border-main/60">
            <span className="text-xs font-semibold text-text-primary block mb-1">
              Lifecycle Policies
            </span>

            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowPause}
                onChange={(e) => setFormData({ ...formData, allowPause: e.target.checked })}
                className="rounded border-border-main text-plum-primary focus:ring-plum-primary"
              />
              <span>Allow customer/staff to pause subscription</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowRenewal}
                onChange={(e) => setFormData({ ...formData, allowRenewal: e.target.checked })}
                className="rounded border-border-main text-plum-primary focus:ring-plum-primary"
              />
              <span>Allow renewal upon cycle expiration</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowEarlyClosure}
                onChange={(e) => setFormData({ ...formData, allowEarlyClosure: e.target.checked })}
                className="rounded border-border-main text-plum-primary focus:ring-plum-primary"
              />
              <span>Allow early termination before end date</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoClose}
                onChange={(e) => setFormData({ ...formData, autoClose: e.target.checked })}
                className="rounded border-border-main text-plum-primary focus:ring-plum-primary"
              />
              <span>Auto-close when expiration reached (Trial mode)</span>
            </label>
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>
              Create Plan
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

