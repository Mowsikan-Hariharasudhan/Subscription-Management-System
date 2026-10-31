import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Receipt, CreditCard, CheckCircle2 } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';

export const MyInvoices: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: portalService.getInvoices,
  });

  const payMutation = useMutation({
    mutationFn: (invoiceId: string) =>
      portalService.payInvoice(invoiceId, { method: 'CARD', notes: 'Online checkout payment' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['portal-payments'] });
      queryClient.invalidateQueries({ queryKey: ['portal-overview'] });
      setSelectedInvoice(null);
    },
    onError: (err: any) => {
      alert(`Payment failed: ${err.response?.data?.message || err.message}`);
    },
  });

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
          My Invoices
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Review your account billing statements, open dues, and settle outstanding balances
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : !invoices || invoices.length === 0 ? (
        <EmptyState
          title="No invoices issued yet"
          description="Your billing statements will appear here once generated for active subscriptions."
          icon={<Receipt className="w-8 h-8" />}
        />
      ) : (
        <div className="w-full bg-white border border-border-main rounded-2xl shadow-card overflow-hidden flex flex-col flex-1">
          <div className="overflow-x-auto flex-1 px-6 pb-6 pt-2">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="border-b border-border-main/80 select-none">
                <tr>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Billing Period
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                    Due Date
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Total
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Outstanding
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/60">
                {invoices.map((inv: any) => {
                  const isOverdue =
                    inv.status === 'CONFIRMED' &&
                    inv.outstanding > 0 &&
                    new Date(inv.dueDate) < new Date();
                  const canPay = inv.status === 'CONFIRMED' && inv.outstanding > 0;

                  return (
                    <tr
                      key={inv.id}
                      className="group hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border font-bold flex items-center justify-center shrink-0">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <span className="font-mono text-xs font-bold text-plum-primary">
                            {inv.number}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-text-secondary font-mono font-medium">
                        {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`text-xs font-bold font-mono ${
                            isOverdue ? 'text-rose-600' : 'text-text-secondary'
                          }`}
                        >
                          {formatDate(inv.dueDate)}
                          {isOverdue && ' (Overdue)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-xs text-text-primary">
                        <CurrencyDisplay amount={inv.total} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-xs">
                        <CurrencyDisplay
                          amount={inv.outstanding}
                          size="sm"
                          className={
                            inv.outstanding > 0
                              ? 'text-rose-600 font-bold'
                              : 'text-emerald-700 font-bold'
                          }
                        />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {canPay ? (
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1 rounded-lg bg-plum-primary text-white text-xs font-bold shadow-plum-btn hover:bg-plum-hover transition-all cursor-pointer inline-flex items-center space-x-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Settled</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Online Payment Checkout Dialog */}
      <Dialog
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Settle Invoice #${selectedInvoice?.number || ''}`}
        description="Complete payment using our simulated instant transaction gateway."
        maxWidth="md"
      >
        {selectedInvoice && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 rounded-xl border border-border-main bg-plum-surface/30 space-y-2">
              <div className="flex justify-between text-text-secondary">
                <span>Invoice Total</span>
                <CurrencyDisplay amount={selectedInvoice.total} size="sm" />
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Already Paid</span>
                <CurrencyDisplay amount={selectedInvoice.amountPaid} size="sm" />
              </div>
              <div className="pt-2 border-t border-border-main flex justify-between font-bold text-text-primary text-sm">
                <span>Due Amount to Pay</span>
                <CurrencyDisplay
                  amount={selectedInvoice.outstanding}
                  size="md"
                  className="text-plum-primary font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border-main bg-surface-main/60 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold block">
                Payment Method
              </span>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-white border border-border-main">
                <CreditCard className="w-4 h-4 text-plum-primary" />
                <span className="font-semibold text-text-primary">Corporate Visa / Mastercard •••• 4242</span>
                <span className="ml-auto text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  TEST GATEWAY
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border-main flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedInvoice(null)}
                disabled={payMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => selectedInvoice && payMutation.mutate(selectedInvoice.id)}
                disabled={payMutation.isPending}
                isLoading={payMutation.isPending}
              >
                Confirm & Pay Full Due
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
