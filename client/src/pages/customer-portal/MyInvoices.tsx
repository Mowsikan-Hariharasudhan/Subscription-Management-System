import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

export const MyInvoices: React.FC = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: portalService.getInvoices,
  });

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      <div className="anim-slide-up">
        <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
          My Invoices
        </h1>
        <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
          Review your account billing statements, open dues, and historical receipts
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
        <div className="glass-panel rounded-xl overflow-hidden anim-slide-up flex flex-col flex-1 shadow-sm" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-separate border-spacing-0 min-w-[900px]">
              <thead className="bg-odoo text-white">
                <tr>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black rounded-tl-[10px] w-[20%]">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black">
                    Billing Period
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black text-center">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black text-right">
                    Total
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-white uppercase tracking-widest border-b-[1.5px] border-black rounded-tr-[10px] text-right">
                    Outstanding
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => {
                  const isOverdue = inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date();
                  return (
                    <tr key={inv.id} className="table-row cursor-pointer bg-white group">
                      <td className="px-6 py-4.5 border-b-[1.5px] border-black group-last:border-b-0 group-last:rounded-bl-[10px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <span className="font-mono text-xs font-bold text-odoo tracking-tight">{inv.number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-gray-600 font-mono font-medium border-b-[1.5px] border-black group-last:border-b-0">
                        {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
                      </td>
                      <td className="px-6 py-4.5 text-center border-b-[1.5px] border-black group-last:border-b-0">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4.5 text-center border-b-[1.5px] border-black group-last:border-b-0">
                        <span className={`text-xs font-bold font-mono ${isOverdue ? 'text-rose-600' : 'text-gray-600'}`}>
                          {formatDate(inv.dueDate)}
                          {isOverdue && ' ⚠️'}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right font-mono font-bold text-odoo-dark text-sm border-b-[1.5px] border-black group-last:border-b-0">
                        <CurrencyDisplay amount={inv.total} size="sm" />
                      </td>
                      <td className="px-6 py-4.5 text-right font-mono font-bold text-sm border-b-[1.5px] border-black group-last:border-b-0 group-last:rounded-br-[10px]">
                        <CurrencyDisplay
                          amount={inv.outstanding}
                          size="sm"
                          className={inv.outstanding > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
