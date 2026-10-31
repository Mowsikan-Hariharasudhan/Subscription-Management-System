import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, AlertTriangle } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { Card, CardContent } from '../../components/ui/card';
import { formatDate } from '../../lib/utils';

export const MyInvoices: React.FC = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: portalService.getInvoices,
  });

  if (isLoading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">My Invoices</h1>
        <p className="text-sm text-text-secondary mt-0.5">Your billing history and outstanding invoices</p>
      </div>

      {!invoices || invoices.length === 0 ? (
        <EmptyState title="No invoices yet" description="Your invoices will appear here after your first billing cycle." icon={<Receipt className="w-8 h-8" />} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-main bg-surface-main">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Invoice #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Billing Period</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Due Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Total</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const isOverdue = inv.status === 'CONFIRMED' && inv.outstanding > 0 && new Date(inv.dueDate) < new Date();
                  return (
                    <tr key={inv.id} className="border-b border-border-main/60 hover:bg-surface-main/50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-plum-primary">{inv.number}</td>
                      <td className="px-4 py-3 text-xs text-text-secondary">
                        {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${isOverdue ? 'text-rose-600 font-semibold' : 'text-text-secondary'}`}>
                          {formatDate(inv.dueDate)}
                          {isOverdue && (
                            <span className="ml-1 inline-flex items-center text-rose-500">
                              <AlertTriangle className="w-3 h-3" />
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right"><CurrencyDisplay amount={inv.total} size="sm" className="font-semibold" /></td>
                      <td className="px-4 py-3 text-right">
                        <CurrencyDisplay
                          amount={inv.outstanding}
                          size="sm"
                          className={inv.outstanding > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600'}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
