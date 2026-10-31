import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Repeat, Play, Pause, StopCircle, RefreshCw,
  CheckCircle, Receipt, AlertTriangle
} from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { invoiceService } from '../../services/invoiceService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatDate } from '../../lib/utils';

export const SubscriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const { data: sub, isLoading, error } = useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionService.getById(id!),
    enabled: !!id,
  });

  const { data: invoicesData } = useQuery({
    queryKey: ['subscription-invoices', id],
    queryFn: () => invoiceService.list({ subscriptionId: id, limit: 20 }),
    enabled: !!id,
  });

  const actionMutation = useMutation({
    mutationFn: async (action: string) => {
      switch (action) {
        case 'confirm': return subscriptionService.confirm(id!);
        case 'activate': return subscriptionService.activate(id!);
        case 'pause': return subscriptionService.pause(id!);
        case 'resume': return subscriptionService.resume(id!);
        case 'close': return subscriptionService.close(id!);
        case 'renew': return subscriptionService.renew(id!);
        default: throw new Error('Unknown action');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setConfirmAction(null);
    },
  });

  if (isLoading) return <LoadingSkeleton count={6} />;
  if (error || !sub) return (
    <EmptyState
      title="Subscription not found"
      description="This subscription may have been deleted or you don't have access."
      icon={<AlertTriangle className="w-8 h-8" />}
    />
  );

  const canConfirm = sub.status === 'DRAFT';
  const canActivate = sub.status === 'CONFIRMED';
  const canPause = sub.status === 'ACTIVE' && sub.plan?.allowPause;
  const canResume = sub.status === 'PAUSED';
  const canClose = ['ACTIVE', 'PAUSED', 'CONFIRMED'].includes(sub.status) && (sub.plan?.allowEarlyClosure || role === 'ADMIN');
  const canRenew = sub.status === 'ACTIVE' && sub.plan?.allowRenewal;

  const actionConfigs: Record<string, { title: string; description: string; variant?: string }> = {
    confirm: { title: 'Confirm Subscription', description: 'Move this subscription from draft to confirmed status.' },
    activate: { title: 'Activate Subscription', description: 'Activate this subscription and begin the billing cycle.' },
    pause: { title: 'Pause Subscription', description: 'Suspend billing temporarily. No invoices will be generated while paused.' },
    resume: { title: 'Resume Subscription', description: 'Resume the subscription and restart the billing schedule.' },
    close: { title: 'Close Subscription', description: 'Permanently close this subscription. No future invoices will be generated.', variant: 'danger' },
    renew: { title: 'Renew Subscription', description: 'Extend the subscription expiry date for another billing period.' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2.5">
        <button onClick={() => navigate('/subscriptions')} className="p-1.5 rounded-md hover:bg-surface-subtle transition-colors cursor-pointer border border-border-main bg-white">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <PageHeader
          title={`Subscription ${sub.number}`}
          description={`${sub.customer?.name} · ${sub.plan?.name}`}
        />
      </div>

      {/* Status + Actions Bar */}
      <div className="bg-white border border-border-main rounded-lg shadow-subtle p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-text-secondary">Subscription ID</p>
            <p className="font-mono text-xs font-bold text-text-primary">{sub.number}</p>
          </div>
          <StatusBadge status={sub.status} size="lg" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canConfirm && (
            <Button size="sm" variant="outline" onClick={() => setConfirmAction('confirm')}>
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Confirm
            </Button>
          )}
          {canActivate && (
            <Button size="sm" onClick={() => setConfirmAction('activate')}>
              <Play className="w-3.5 h-3.5 mr-1.5" /> Activate
            </Button>
          )}
          {canPause && (
            <Button size="sm" variant="outline" onClick={() => setConfirmAction('pause')}>
              <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause
            </Button>
          )}
          {canResume && (
            <Button size="sm" onClick={() => setConfirmAction('resume')}>
              <Play className="w-3.5 h-3.5 mr-1.5" /> Resume
            </Button>
          )}
          {canRenew && (
            <Button size="sm" variant="outline" onClick={() => setConfirmAction('renew')}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Renew
            </Button>
          )}
          {canClose && (
            <Button size="sm" variant="danger" onClick={() => setConfirmAction('close')}>
              <StopCircle className="w-3.5 h-3.5 mr-1.5" /> Close
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lines">Line Items</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({invoicesData?.pagination?.total ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-border-main">
                <CardTitle className="text-sm font-semibold">Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5 text-xs">
                <InfoRow label="Customer" value={sub.customer?.name} />
                <InfoRow label="Company" value={sub.customer?.companyName || '—'} />
                <InfoRow label="Plan" value={sub.plan?.name} />
                <InfoRow label="Billing Frequency" value={sub.plan?.billingFrequency} isMono />
                <InfoRow label="Start Date" value={formatDate(sub.startDate)} isMono />
                <InfoRow label="Expiry Date" value={sub.expiryDate ? formatDate(sub.expiryDate) : 'No expiry'} isMono />
                <InfoRow label="Next Billing" value={sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'} isMono />
                <InfoRow label="Payment Terms" value={sub.paymentTerms || '—'} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-border-main">
                <CardTitle className="text-sm font-semibold">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Subtotal</span>
                  <CurrencyDisplay amount={sub.subtotal} size="sm" />
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Tax</span>
                  <CurrencyDisplay amount={sub.taxAmount} size="sm" />
                </div>
                <div className="flex justify-between py-2 border-t border-border-main font-bold">
                  <span className="text-text-primary">Total (per cycle)</span>
                  <CurrencyDisplay amount={sub.total} size="sm" className="font-bold text-text-primary" />
                </div>
                <div className="pt-2 border-t border-border-main">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">Plan Rules</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.plan?.allowPause && <Badge variant="secondary" className="text-[10px]">Pause allowed</Badge>}
                    {sub.plan?.allowRenewal && <Badge variant="secondary" className="text-[10px]">Renewable</Badge>}
                    {sub.plan?.allowEarlyClosure && <Badge variant="secondary" className="text-[10px]">Early closure</Badge>}
                    {sub.plan?.autoClose && <Badge variant="warning" className="text-[10px]">Auto-close</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lines" className="mt-3.5">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-main bg-surface-subtle">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Variant</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Qty</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Unit Price</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tax</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {sub.lines?.map((line) => (
                    <tr key={line.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-text-primary">{line.product?.name}</td>
                      <td className="px-4 py-2.5 text-text-secondary">{line.variant?.name || '—'}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{line.quantity}</td>
                      <td className="px-4 py-2.5 text-right"><CurrencyDisplay amount={line.unitPrice} size="sm" /></td>
                      <td className="px-4 py-2.5 text-right text-text-secondary font-mono">{(line.taxRate / 100).toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-right font-semibold"><CurrencyDisplay amount={line.lineTotal} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!sub.lines || sub.lines.length === 0) && (
                <div className="p-8 text-center text-text-secondary text-xs">No line items</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-3.5">
          {invoicesData?.data && invoicesData.data.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-main bg-surface-subtle">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Invoice #</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Period</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Total</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Outstanding</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main">
                    {invoicesData.data.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-surface-subtle/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/invoices/${inv.id}`)}>
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold text-plum-primary">{inv.number}</td>
                        <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">
                          {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
                        </td>
                        <td className="px-4 py-2.5"><StatusBadge status={inv.status} /></td>
                        <td className="px-4 py-2.5 text-right"><CurrencyDisplay amount={inv.total} size="sm" /></td>
                        <td className="px-4 py-2.5 text-right">
                          <CurrencyDisplay amount={inv.outstanding} size="sm"
                            className={inv.outstanding > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600'} />
                        </td>
                        <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">{formatDate(inv.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              title="No invoices yet"
              description="Invoices are generated automatically when the billing date arrives."
              icon={<Receipt className="w-8 h-8" />}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Confirm Action Dialog */}
      {confirmAction && actionConfigs[confirmAction] && (
        <ConfirmDialog
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => actionMutation.mutate(confirmAction)}
          title={actionConfigs[confirmAction].title}
          description={actionConfigs[confirmAction].description}
          isLoading={actionMutation.isPending}
          confirmLabel={actionConfigs[confirmAction].title}
          variant={confirmAction === 'close' ? 'danger' : 'default'}
        />
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value?: string | null; isMono?: boolean }> = ({ label, value, isMono }) => (
  <div className="flex justify-between py-1 border-b border-border-main last:border-0">
    <span className="text-text-secondary">{label}</span>
    <span className={`font-medium text-text-primary ${isMono ? 'font-mono' : ''}`}>{value || '—'}</span>
  </div>
);
