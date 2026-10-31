import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, XCircle, CreditCard, AlertTriangle } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatDate } from '../../lib/utils';

const PAYMENT_METHODS = ['CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'OTHER'] as const;

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'CASH',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data: inv, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getById(id!),
    enabled: !!id,
  });

  const confirmMutation = useMutation({
    mutationFn: () => invoiceService.confirm(id!),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['invoice', id] }); queryClient.invalidateQueries({ queryKey: ['invoices'] }); },
  });

  const cancelMutation = useMutation({
    mutationFn: () => invoiceService.cancel(id!),
    onSuccess: () => { setConfirmCancel(false); queryClient.invalidateQueries({ queryKey: ['invoice', id] }); queryClient.invalidateQueries({ queryKey: ['invoices'] }); },
  });

  const paymentMutation = useMutation({
    mutationFn: (data: any) => paymentService.record(data),
    onSuccess: () => {
      setPaymentOpen(false);
      setPaymentForm({ amount: '', method: 'CASH', paymentDate: new Date().toISOString().split('T')[0], notes: '' });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Payment failed');
    }
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    paymentMutation.mutate({
      invoiceId: id,
      amount: Math.round(parseFloat(paymentForm.amount) * 100),
      method: paymentForm.method,
      paymentDate: paymentForm.paymentDate,
      notes: paymentForm.notes || undefined,
    });
  };

  if (isLoading) return <LoadingSkeleton count={6} />;
  if (error || !inv) return (
    <EmptyState title="Invoice not found" description="This invoice does not exist." icon={<AlertTriangle className="w-8 h-8" />} />
  );

  const canConfirm = inv.status === 'DRAFT';
  const canCancel = ['DRAFT', 'CONFIRMED'].includes(inv.status);
  const canRecordPayment = inv.status === 'CONFIRMED' && inv.outstanding > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2.5">
        <button onClick={() => navigate('/invoices')} className="p-1.5 rounded-md hover:bg-surface-subtle transition-colors cursor-pointer border border-border-main bg-white">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <PageHeader title={`Invoice ${inv.number}`} description={`${inv.customer?.name} · Period: ${formatDate(inv.periodStart)} – ${formatDate(inv.periodEnd)}`} />
      </div>

      {/* Action bar */}
      <div className="bg-white border border-border-main rounded-lg shadow-subtle p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <StatusBadge status={inv.status} size="lg" />
          {inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date() && (
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono">
              ⚠️ OVERDUE
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canConfirm && (
            <Button size="sm" onClick={() => confirmMutation.mutate()} isLoading={confirmMutation.isPending}>
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Confirm Invoice
            </Button>
          )}
          {canRecordPayment && (
            <Button size="sm" variant="outline" onClick={() => setPaymentOpen(true)}>
              <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Record Payment
            </Button>
          )}
          {canCancel && (role === 'ADMIN' || role === 'STAFF') && (
            <Button size="sm" variant="danger" onClick={() => setConfirmCancel(true)}>
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border-main">
              <CardTitle className="text-sm font-semibold">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs mb-1">
                <InfoRow label="Invoice #" value={inv.number} isMono />
                <InfoRow label="Issue Date" value={formatDate(inv.issueDate)} isMono />
                <InfoRow label="Due Date" value={formatDate(inv.dueDate)} isMono />
                <InfoRow label="Customer" value={inv.customer?.name} />
                <InfoRow label="Subscription" value={inv.subscription?.number} isMono />
                <InfoRow label="Payment Terms" value={(inv as any).subscription?.paymentTerms || '—'} />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border-main">
              <CardTitle className="text-sm font-semibold">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-main bg-surface-subtle">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Qty</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Unit Price</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tax</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {inv.lines?.map((line) => (
                    <tr key={line.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-text-primary">{line.product?.name}</p>
                        {line.variant && <p className="text-[11px] text-text-secondary">{line.variant.name}</p>}
                        {line.description && <p className="text-[11px] text-text-secondary">{line.description}</p>}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">{line.quantity}</td>
                      <td className="px-4 py-2.5 text-right"><CurrencyDisplay amount={line.unitPrice + line.variantPrice} size="sm" /></td>
                      <td className="px-4 py-2.5 text-right text-text-secondary"><CurrencyDisplay amount={line.taxAmount} size="sm" /></td>
                      <td className="px-4 py-2.5 text-right font-semibold"><CurrencyDisplay amount={line.lineTotal} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Totals + Payments */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border-main">
              <CardTitle className="text-sm font-semibold">Amount Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Subtotal</span>
                <CurrencyDisplay amount={inv.subtotal} size="sm" />
              </div>
              {inv.discountAmt > 0 && (
                <div className="flex justify-between py-1 text-emerald-600">
                  <span>Discount</span>
                  <span>- <CurrencyDisplay amount={inv.discountAmt} size="sm" className="inline" /></span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Tax</span>
                <CurrencyDisplay amount={inv.taxAmount} size="sm" />
              </div>
              <div className="flex justify-between py-2 border-t border-border-main font-bold text-sm">
                <span>Total</span>
                <CurrencyDisplay amount={inv.total} size="md" className="font-bold" />
              </div>
              <div className="flex justify-between py-1 text-emerald-600">
                <span>Amount Paid</span>
                <CurrencyDisplay amount={inv.amountPaid} size="sm" />
              </div>
              <div className={`flex justify-between py-2 border-t border-border-main font-semibold ${inv.outstanding > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                <span>Outstanding</span>
                <CurrencyDisplay amount={inv.outstanding} size="sm" className="font-semibold" />
              </div>
            </CardContent>
          </Card>

          {/* Payment history */}
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border-main">
              <CardTitle className="text-sm font-semibold">Payments ({inv.payments?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {inv.payments && inv.payments.length > 0 ? (
                <div className="space-y-2">
                  {inv.payments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-1.5 border-b border-border-main last:border-0">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{p.method}</p>
                        <p className="text-[11px] text-text-secondary font-mono">{formatDate(p.paymentDate)}</p>
                      </div>
                      <CurrencyDisplay amount={p.amount} size="sm" className="font-semibold text-emerald-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-secondary text-center py-2 font-mono">No payments recorded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Record Payment" description={`Outstanding: ₹${(inv.outstanding / 100).toFixed(2)}`}>
        <form onSubmit={handleRecordPayment} className="space-y-3.5">
          <div>
            <Label htmlFor="pay-amount" required>Amount (₹)</Label>
            <Input
              id="pay-amount"
              type="number"
              step="0.01"
              min="0.01"
              max={(inv.outstanding / 100).toFixed(2)}
              placeholder={(inv.outstanding / 100).toFixed(2)}
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="pay-method" required>Payment Method</Label>
            <select
              id="pay-method"
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              className="flex h-9 w-full rounded-md border border-border-main bg-white px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-plum-primary focus:ring-1 focus:ring-plum-primary"
            >
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="pay-date" required>Payment Date</Label>
            <Input
              id="pay-date"
              type="date"
              value={paymentForm.paymentDate}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="pay-notes">Notes</Label>
            <Input
              id="pay-notes"
              placeholder="Reference number, remarks..."
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-border-main">
            <Button type="button" variant="outline" size="sm" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={paymentMutation.isPending}>Record Payment</Button>
          </div>
        </form>
      </Dialog>

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Invoice"
        description="This will cancel the invoice. This action cannot be undone."
        isLoading={cancelMutation.isPending}
        confirmLabel="Cancel Invoice"
        variant="danger"
      />
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value?: string | null; isMono?: boolean }> = ({ label, value, isMono }) => (
  <div className="flex justify-between py-1">
    <span className="text-text-secondary">{label}</span>
    <span className={`font-medium text-text-primary ${isMono ? 'font-mono' : ''}`}>{value || '—'}</span>
  </div>
);
