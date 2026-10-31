import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { Card, CardContent } from '../../components/ui/card';
import { formatDate } from '../../lib/utils';

const METHOD_COLORS: Record<string, string> = {
  CASH: 'bg-emerald-50 text-emerald-700',
  BANK_TRANSFER: 'bg-blue-50 text-blue-700',
  UPI: 'bg-violet-50 text-violet-700',
  CARD: 'bg-amber-50 text-amber-700',
  OTHER: 'bg-surface-main text-text-secondary',
};

export const MyPayments: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['portal-payments'],
    queryFn: portalService.getPayments,
  });

  if (isLoading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Payment History</h1>
        <p className="text-sm text-text-secondary mt-0.5">All payments recorded against your invoices</p>
      </div>

      {!payments || payments.length === 0 ? (
        <EmptyState title="No payments recorded" description="Your payment history will appear here." icon={<CreditCard className="w-8 h-8" />} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-main bg-surface-main">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Invoice #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Method</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border-main/60 hover:bg-surface-main/50">
                    <td className="px-4 py-3 text-xs text-text-secondary">{formatDate(p.paymentDate)}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-plum-primary">
                      {(p as any).invoice?.number || p.invoiceId.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${METHOD_COLORS[p.method] || METHOD_COLORS.OTHER}`}>
                        {p.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CurrencyDisplay amount={p.amount} size="sm" className="font-semibold text-emerald-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
