import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { formatDate } from '../../lib/utils';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

const METHOD_BADGES: Record<string, string> = {
  CREDIT_CARD: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  BANK_TRANSFER: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  UPI: 'bg-purple-50 text-purple-700 border border-purple-200',
  OTHER: 'bg-gray-50 text-gray-700 border border-gray-200',
};

export const MyPayments: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['portal-payments'],
    queryFn: portalService.getPayments,
  });

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      <div className="anim-slide-up">
        <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
          Payment History
        </h1>
        <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
          Complete ledger of recorded settlements and receipts
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
        <div className="w-full bg-white border-[1.5px] border-black rounded-2xl shadow-sm overflow-hidden anim-slide-up flex flex-col flex-1" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto flex-1 px-8 pb-8 pt-2">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest w-[25%]">
                    Payment Date
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest w-[25%]">
                    Invoice #
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest text-center">
                    Method
                  </th>
                  <th className="py-4 text-[0.75rem] font-bold text-gray-600 uppercase tracking-widest text-right">
                    Amount Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-t border-gray-100 group hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="py-4 text-xs text-gray-600 font-mono font-medium">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-odoo/10 text-odoo font-bold flex items-center justify-center text-xs border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-odoo tracking-tight">
                          {(p as any).invoice?.number || p.invoiceId.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider ${
                          METHOD_BADGES[p.method] || METHOD_BADGES.OTHER
                        }`}
                      >
                        {p.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-emerald-700 text-sm">
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
