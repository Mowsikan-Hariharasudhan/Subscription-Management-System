import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Repeat,
  Calendar,
  RefreshCw,
  Pause,
  Play,
  XCircle,
  Sparkles,
  ShieldAlert,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { portalService } from '../../services/portalService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';

export const MySubscriptions: React.FC = () => {
  const queryClient = useQueryClient();
  const [actionDialog, setActionDialog] = useState<{
    type: 'PAUSE' | 'RESUME' | 'CANCEL';
    subscriptionId: string;
    subNumber: string;
  } | null>(null);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['portal-subscriptions'],
    queryFn: portalService.getSubscriptions,
  });

  const pauseMutation = useMutation({
    mutationFn: (id: string) => portalService.pauseSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['portal-overview'] });
      setActionDialog(null);
    },
    onError: (err: any) => {
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (id: string) => portalService.resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['portal-overview'] });
      setActionDialog(null);
    },
    onError: (err: any) => {
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => portalService.cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['portal-overview'] });
      setActionDialog(null);
    },
    onError: (err: any) => {
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleConfirmAction = () => {
    if (!actionDialog) return;
    if (actionDialog.type === 'PAUSE') {
      pauseMutation.mutate(actionDialog.subscriptionId);
    } else if (actionDialog.type === 'RESUME') {
      resumeMutation.mutate(actionDialog.subscriptionId);
    } else if (actionDialog.type === 'CANCEL') {
      cancelMutation.mutate(actionDialog.subscriptionId);
    }
  };

  const isPending =
    pauseMutation.isPending || resumeMutation.isPending || cancelMutation.isPending;

  if (isLoading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      {/* Page Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
            My Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Active contracts, recurring intervals, renewal dates, and line entitlements
          </p>
        </div>

        <Link
          to="/portal/explore"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-plum-primary text-white text-xs font-bold shadow-plum-btn hover:bg-plum-hover transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore & Buy More Apps</span>
        </Link>
      </div>

      {!subscriptions || subscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions active"
          description="You don't have any active subscriptions yet. Browse our applications to get started."
          icon={<Repeat className="w-8 h-8" />}
          action={
            <Link
              to="/portal/explore"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-plum-primary text-white text-xs font-bold shadow-sm"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl border border-border-main bg-white shadow-card p-6 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-main gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-plum-primary tracking-tight block">
                      {sub.number}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary block mt-0.5">
                      {sub.plan?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <StatusBadge status={sub.status} />

                  {/* Customer Self-Service Actions */}
                  {sub.status === 'ACTIVE' && (
                    <div className="flex items-center space-x-1.5 pl-2 border-l border-border-main">
                      <button
                        onClick={() =>
                          setActionDialog({
                            type: 'PAUSE',
                            subscriptionId: sub.id,
                            subNumber: sub.number,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg border border-border-main text-[11px] font-semibold text-text-secondary hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200 transition-colors cursor-pointer flex items-center space-x-1"
                        title="Pause automatic billing temporarily"
                      >
                        <Pause className="w-3 h-3" />
                        <span>Pause</span>
                      </button>
                      <button
                        onClick={() =>
                          setActionDialog({
                            type: 'CANCEL',
                            subscriptionId: sub.id,
                            subNumber: sub.number,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg border border-border-main text-[11px] font-semibold text-text-secondary hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer flex items-center space-x-1"
                        title="Cancel subscription"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  {sub.status === 'PAUSED' && (
                    <div className="flex items-center space-x-1.5 pl-2 border-l border-border-main">
                      <button
                        onClick={() =>
                          setActionDialog({
                            type: 'RESUME',
                            subscriptionId: sub.id,
                            subNumber: sub.number,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center space-x-1"
                        title="Resume subscription"
                      >
                        <Play className="w-3 h-3" />
                        <span>Resume</span>
                      </button>
                      <button
                        onClick={() =>
                          setActionDialog({
                            type: 'CANCEL',
                            subscriptionId: sub.id,
                            subNumber: sub.number,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg border border-border-main text-[11px] font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Cancel subscription"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mt-5">
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Billing Cycle
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-plum-surface border border-plum-border text-[11px] font-bold text-plum-primary font-mono uppercase">
                    {sub.plan?.billingFrequency}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Start Date
                  </p>
                  <p className="font-semibold text-text-primary flex items-center font-mono">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-plum-primary opacity-60" />
                    {formatDate(sub.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Expiry Date
                  </p>
                  <p className="font-semibold text-text-primary font-mono">
                    {sub.expiryDate ? formatDate(sub.expiryDate) : 'Perpetual renewal'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Next Billing
                  </p>
                  <p className="font-bold font-mono text-plum-primary flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 mr-1 opacity-70" />
                    {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}
                  </p>
                </div>
              </div>

              {/* Lines & Entitlements */}
              {sub.lines && sub.lines.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border-main">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <Layers className="w-3 h-3 text-plum-primary" />
                    <span>Contract Entitlements & Lines</span>
                  </p>
                  <div className="space-y-1.5">
                    {sub.lines.map((line) => (
                      <div
                        key={line.id}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-surface-main/60 border border-border-main/70"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-text-primary">{line.product?.name}</span>
                          {line.variant && (
                            <span className="text-[10px] font-mono text-text-secondary px-1.5 py-0.5 rounded bg-white border border-border-main">
                              {line.variant.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 font-mono font-bold">
                          <span className="text-text-secondary text-[11px]">Qty: {line.quantity}</span>
                          <CurrencyDisplay amount={line.lineTotal} size="sm" className="text-text-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Lifecycle Actions */}
      <Dialog
        isOpen={!!actionDialog}
        onClose={() => setActionDialog(null)}
        title={
          actionDialog?.type === 'PAUSE'
            ? 'Pause Subscription?'
            : actionDialog?.type === 'RESUME'
            ? 'Resume Subscription?'
            : 'Cancel Subscription?'
        }
        description={
          actionDialog?.type === 'PAUSE'
            ? `Subscription ${actionDialog.subNumber} will be paused. Recurring invoices will not be generated until resumed.`
            : actionDialog?.type === 'RESUME'
            ? `Subscription ${actionDialog.subNumber} will be reactivated with an updated billing cycle.`
            : `Are you sure you want to cancel subscription ${actionDialog?.subNumber}? This will terminate recurring services.`
        }
        maxWidth="sm"
      >
        <div className="pt-2 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div className="pt-4 border-t border-border-main flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setActionDialog(null)}
              disabled={isPending}
            >
              Back
            </Button>
            <Button
              variant={actionDialog?.type === 'CANCEL' ? 'danger' : 'primary'}
              onClick={handleConfirmAction}
              disabled={isPending}
              isLoading={isPending}
            >
              {actionDialog?.type === 'PAUSE' && 'Confirm Pause'}
              {actionDialog?.type === 'RESUME' && 'Confirm Resume'}
              {actionDialog?.type === 'CANCEL' && 'Yes, Cancel Subscription'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
