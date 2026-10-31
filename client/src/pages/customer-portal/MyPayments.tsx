import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { formatDate } from '../../lib/utils';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

const METHOD_BADGES: Record<string, string> = {
  CREDIT_CARD: 'bg-indigo-100 text-indigo-800 border-[1.5px] border-black',
  BANK_TRANSFER: 'bg-emerald-100 text-emerald-800 border-[1.5px] border-black',
  UPI: 'bg-purple-100 text-purple-800 border-[1.5px] border-black',
  OTHER: 'bg-gray-100 text-gray-800 border-[1.5px] border-black',
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
        <div className="glass-panel rounded-xl overflow-hidden anim-slide-up flex flex-col flex-1 shadow-sm" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-separate border-spacing-0 min-w-[700px]">
              <thead className="bg-odoo text-white">
                <tr>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black rounded-tl-[10px] w-[25%]">
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black w-[25%]">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black text-center">
                    Method
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black rounded-tr-[10px] text-right">
                    Amount Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="table-row cursor-pointer bg-white group">
                    <td className="px-6 py-4.5 text-xs text-gray-600 font-mono font-medium border-b-[1.5px] border-black group-last:border-b-0 group-last:rounded-bl-[10px]">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="px-6 py-4.5 border-b-[1.5px] border-black group-last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-odoo/10 text-odoo font-bold flex items-center justify-center text-xs border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-odoo tracking-tight">
                          {(p as any).invoice?.number || p.invoiceId.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center border-b-[1.5px] border-black group-last:border-b-0">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded text-[0.625rem] font-bold uppercase tracking-widest shadow-[2px_2px_0_#000] ${
                          METHOD_BADGES[p.method] || METHOD_BADGES.OTHER
                        }`}
                      >
                        {p.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right font-mono font-bold text-emerald-700 text-sm border-b-[1.5px] border-black group-last:border-b-0 group-last:rounded-br-[10px]">
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
