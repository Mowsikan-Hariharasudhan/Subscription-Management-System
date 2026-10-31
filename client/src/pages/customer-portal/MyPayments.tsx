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
  CASH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BANK_TRANSFER: 'bg-blue-50 text-blue-700 border-blue-200',
  UPI: 'bg-violet-50 text-violet-700 border-violet-200',
  CARD: 'bg-amber-50 text-amber-700 border-amber-200',
  OTHER: 'bg-surface-subtle text-text-secondary border-border-main',
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
        <h1 className="text-lg font-bold text-text-primary">Payment History</h1>
        <p className="text-xs text-text-secondary mt-0.5">All payments recorded against your invoices</p>
      </div>

      {!payments || payments.length === 0 ? (
        <EmptyState title="No payments recorded" description="Your payment history will appear here." icon={<CreditCard className="w-8 h-8" />} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-main bg-surface-subtle">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Method</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">{formatDate(p.paymentDate)}</td>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-plum-primary">
                      {(p as any).invoice?.number || p.invoiceId.slice(0, 8)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border font-mono ${METHOD_COLORS[p.method] || METHOD_COLORS.OTHER}`}>
                        {p.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
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
