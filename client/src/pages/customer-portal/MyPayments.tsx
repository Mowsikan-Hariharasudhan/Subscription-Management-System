import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { formatDate } from '../../lib/utils';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { Badge } from '../../components/ui/badge';

export const MyPayments: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['portal-payments'],
    queryFn: portalService.getPayments,
  });

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
          Payment History
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Complete ledger of recorded settlements, transaction dates, and official receipts
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : !payments || payments.length === 0 ? (
        <EmptyState
          title="No payments recorded"
          description="Your payment history will appear here once an invoice is settled."
          icon={<CreditCard className="w-8 h-8" />}
        />
      ) : (
        <div className="w-full bg-white border border-border-main rounded-2xl shadow-card overflow-hidden flex flex-col flex-1">
          <div className="overflow-x-auto flex-1 px-6 pb-6 pt-2">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="border-b border-border-main/80 select-none">
                <tr>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                    Method
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-4 px-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Amount Settled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/60">
                {payments.map((p: any) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-surface-hover/50 transition-colors"
                  >
                    <td className="py-3.5 px-3 text-xs text-text-secondary font-mono font-medium">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border font-bold flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-bold text-plum-primary">
                          {p.invoice?.number || p.invoiceId.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {p.method.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-semibold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SETTLED</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-xs text-emerald-700">
                      <CurrencyDisplay amount={p.amount} size="sm" className="font-bold text-emerald-700" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
