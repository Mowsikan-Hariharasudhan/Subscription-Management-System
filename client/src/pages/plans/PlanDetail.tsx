import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Edit3, Check, X, Shield, Clock } from 'lucide-react';
import { planService } from '../../services/planService';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

export const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => planService.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => planService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', id] });
      setIsEditOpen(false);
    },
  });

  const handleEditClick = () => {
    if (plan) {
      setEditFormData({
        name: plan.name,
        description: plan.description || '',
        billingFrequency: plan.billingFrequency,
        minimumQuantity: plan.minimumQuantity,
        allowPause: plan.allowPause,
        allowRenewal: plan.allowRenewal,
        allowEarlyClosure: plan.allowEarlyClosure,
        autoClose: plan.autoClose,
      });
      setIsEditOpen(true);
    }
  };

  if (isLoading || !plan) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={plan.name}
        description={`Plan Frequency: ${plan.billingFrequency}`}
        breadcrumbs={[
          { label: 'Plans', href: '/plans' },
          { label: plan.name },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Plan
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Frequency</p>
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="default" className="text-sm px-3 py-1">
              {plan.billingFrequency}
            </Badge>
            <Badge variant={plan.isActive ? 'success' : 'danger'}>
              {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Minimum Seats/Quantity</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{plan.minimumQuantity}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Linked Subscriptions</p>
          <p className="text-2xl font-bold text-plum-primary mt-1">
            {plan._count?.subscriptions || 0}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Shield className="w-4 h-4 text-plum-primary" />
            <span>Plan Policies & Lifecycles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border-main/70 bg-surface-main/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-primary">Pause Subscription</p>
                <p className="text-[11px] text-text-secondary">Allow pausing billing cycles</p>
              </div>
              <Badge variant={plan.allowPause ? 'success' : 'secondary'}>
                {plan.allowPause ? 'ALLOWED' : 'DISABLED'}
              </Badge>
            </div>

            <div className="p-4 rounded-lg border border-border-main/70 bg-surface-main/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-primary">Renewal</p>
                <p className="text-[11px] text-text-secondary">Extend expiry when due</p>
              </div>
              <Badge variant={plan.allowRenewal ? 'success' : 'secondary'}>
                {plan.allowRenewal ? 'ALLOWED' : 'DISABLED'}
              </Badge>
            </div>

            <div className="p-4 rounded-lg border border-border-main/70 bg-surface-main/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-primary">Early Termination</p>
                <p className="text-[11px] text-text-secondary">Close before agreed cycle end</p>
              </div>
              <Badge variant={plan.allowEarlyClosure ? 'success' : 'secondary'}>
                {plan.allowEarlyClosure ? 'ALLOWED' : 'DISABLED'}
              </Badge>
            </div>

            <div className="p-4 rounded-lg border border-border-main/70 bg-surface-main/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-primary">Auto-Closure</p>
                <p className="text-[11px] text-text-secondary">Auto close on expiration date</p>
              </div>
              <Badge variant={plan.autoClose ? 'warning' : 'secondary'}>
                {plan.autoClose ? 'AUTO-CLOSE ON' : 'DISABLED'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Subscription Plan"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate(editFormData);
          }}
          className="space-y-3.5"
        >
          <div>
            <Label htmlFor="edit-plan-name" required>
              Plan Name
            </Label>
            <Input
              id="edit-plan-name"
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-plan-desc">Description</Label>
            <Input
              id="edit-plan-desc"
              value={editFormData.description || ''}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border-main/60">
            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={editFormData.allowPause}
                onChange={(e) => setEditFormData({ ...editFormData, allowPause: e.target.checked })}
              />
              <span>Allow customer/staff to pause subscription</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={editFormData.allowRenewal}
                onChange={(e) => setEditFormData({ ...editFormData, allowRenewal: e.target.checked })}
              />
              <span>Allow renewal</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={editFormData.allowEarlyClosure}
                onChange={(e) => setEditFormData({ ...editFormData, allowEarlyClosure: e.target.checked })}
              />
              <span>Allow early termination</span>
            </label>
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={updateMutation.isPending}>
              Save Plan
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

