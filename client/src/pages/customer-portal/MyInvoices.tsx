import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, AlertTriangle } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatDate } from '../../lib/utils';

export const MyInvoices: React.FC = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: portalService.getInvoices,
  });

  if (isLoading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      <div className="anim-slide-up">
        <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
          My Invoices
        </h1>
        <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
          Your complete billing statements, tax breakdowns, and outstanding balances
        </p>
      </div>

      {!invoices || invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Your invoices will appear here after your first billing cycle."
          icon={<Receipt className="w-8 h-8" />}
        />
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden anim-slide-up flex flex-col flex-1 shadow-sm" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-[#f8f6f8] border-b-[1.5px] border-black">
                <tr>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest w-[20%]">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest">
                    Billing Period
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest text-center">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest text-right">
                    Total
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold text-gray-600 uppercase tracking-widest text-right">
                    Outstanding
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((inv) => {
                  const isOverdue = inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date();
                  return (
                    <tr key={inv.id} className="table-row cursor-pointer bg-white group">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <span className="font-mono text-xs font-bold text-odoo tracking-tight">{inv.number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-gray-600 font-mono font-medium">
                        {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className={`text-xs font-bold font-mono ${isOverdue ? 'text-rose-600' : 'text-gray-600'}`}>
                          {formatDate(inv.dueDate)}
                          {isOverdue && ' ⚠️'}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right font-mono font-bold text-odoo-dark text-sm">
                        <CurrencyDisplay amount={inv.total} size="sm" />
                      </td>
                      <td className="px-6 py-4.5 text-right font-mono font-bold text-sm">
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
