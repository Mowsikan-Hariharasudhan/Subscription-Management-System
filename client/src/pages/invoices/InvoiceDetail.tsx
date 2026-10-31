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
    <div className="space-y-5">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/invoices')} className="p-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer border border-border-main bg-white shadow-sm">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <PageHeader title={`Invoice ${inv.number}`} description={`${inv.customer?.name} · Period: ${formatDate(inv.periodStart)} – ${formatDate(inv.periodEnd)}`} />
      </div>

      {/* Action bar matching reference banner */}
      <div className="bg-white border border-border-main rounded-2xl shadow-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <StatusBadge status={inv.status} size="lg" />
          {inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date() && (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-mono">
              ⚠️ OVERDUE
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {canConfirm && (
            <Button size="md" onClick={() => confirmMutation.mutate()} isLoading={confirmMutation.isPending}>
              <CheckCircle className="w-4 h-4 mr-1.5" /> Confirm Invoice
            </Button>
          )}
          {canRecordPayment && (
            <Button size="md" variant="outline" onClick={() => setPaymentOpen(true)}>
              <CreditCard className="w-4 h-4 mr-1.5" /> Record Payment
            </Button>
          )}
          {canCancel && (role === 'ADMIN' || role === 'STAFF') && (
            <Button size="md" variant="danger" onClick={() => setConfirmCancel(true)}>
              <XCircle className="w-4 h-4 mr-1.5" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="py-4 px-6 border-b border-border-main">
              <CardTitle className="text-sm font-bold text-text-primary">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
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
            <CardHeader className="py-4 px-6 border-b border-border-main">
              <CardTitle className="text-sm font-bold text-text-primary">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-main bg-[#FAF7F9]">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Qty</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Unit Price</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Tax</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/70">
                  {inv.lines?.map((line) => (
                    <tr key={line.id} className="hover:bg-surface-hover/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-text-primary text-xs">{line.product?.name}</p>
                        {line.variant && <p className="text-[11px] text-text-secondary">{line.variant.name}</p>}
                        {line.description && <p className="text-[11px] text-text-secondary">{line.description}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono">{line.quantity}</td>
                      <td className="px-5 py-3.5 text-right font-mono"><CurrencyDisplay amount={line.unitPrice + line.variantPrice} size="sm" /></td>
                      <td className="px-5 py-3.5 text-right text-text-secondary font-mono"><CurrencyDisplay amount={line.taxAmount} size="sm" /></td>
                      <td className="px-5 py-3.5 text-right font-bold font-mono"><CurrencyDisplay amount={line.lineTotal} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Totals + Payments */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="py-4 px-6 border-b border-border-main">
              <CardTitle className="text-sm font-bold text-text-primary">Amount Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2.5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Subtotal</span>
                <CurrencyDisplay amount={inv.subtotal} size="sm" className="font-mono" />
              </div>
              {inv.discountAmt > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>- <CurrencyDisplay amount={inv.discountAmt} size="sm" className="inline font-mono" /></span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Tax</span>
                <CurrencyDisplay amount={inv.taxAmount} size="sm" className="font-mono" />
              </div>
              <div className="flex justify-between py-2.5 border-t border-border-main font-bold text-sm">
                <span className="text-text-primary">Total</span>
                <CurrencyDisplay amount={inv.total} size="md" className="font-bold font-mono text-text-primary" />
              </div>
              <div className="flex justify-between py-1 text-emerald-600 font-medium">
                <span>Amount Paid</span>
                <CurrencyDisplay amount={inv.amountPaid} size="sm" className="font-mono" />
              </div>
              <div className={`flex justify-between py-2 border-t border-border-main font-bold ${inv.outstanding > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                <span>Outstanding</span>
                <CurrencyDisplay amount={inv.outstanding} size="sm" className="font-bold font-mono" />
              </div>
            </CardContent>
          </Card>

          {/* Payment history */}
          <Card>
            <CardHeader className="py-4 px-6 border-b border-border-main">
              <CardTitle className="text-sm font-bold text-text-primary">Payments ({inv.payments?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {inv.payments && inv.payments.length > 0 ? (
                <div className="space-y-2.5">
                  {inv.payments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-2 border-b border-border-main/70 last:border-0">
                      <div>
                        <p className="text-xs font-bold text-text-primary">{p.method}</p>
                        <p className="text-[11px] text-text-secondary font-mono">{formatDate(p.paymentDate)}</p>
                      </div>
                      <CurrencyDisplay amount={p.amount} size="sm" className="font-bold text-emerald-600 font-mono" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-secondary text-center py-3 font-mono">No payments recorded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Record Payment" description={`Outstanding: ₹${(inv.outstanding / 100).toFixed(2)}`}>
        <form onSubmit={handleRecordPayment} className="space-y-4">
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
              className="rounded-xl font-mono"
            />
          </div>
          <div>
            <Label htmlFor="pay-method" required>Payment Method</Label>
            <select
              id="pay-method"
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-border-main bg-white px-3.5 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
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
              className="rounded-xl font-mono"
            />
          </div>
          <div>
            <Label htmlFor="pay-notes">Notes</Label>
            <Input
              id="pay-notes"
              placeholder="Reference number, remarks..."
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="rounded-xl"
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
  <div className="flex justify-between py-1.5 border-b border-border-main/50 last:border-0">
    <span className="text-text-secondary">{label}</span>
    <span className={`font-bold text-text-primary ${isMono ? 'font-mono' : ''}`}>{value || '—'}</span>
  </div>
);
