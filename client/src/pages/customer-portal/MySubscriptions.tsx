import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Repeat, Calendar, RefreshCw } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatDate } from '../../lib/utils';

export const MySubscriptions: React.FC = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['portal-subscriptions'],
    queryFn: portalService.getSubscriptions,
  });

  if (isLoading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      <div className="anim-slide-up">
        <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
          My Subscriptions
        </h1>
        <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
          Active contracts, recurring intervals, renewal dates, and line entitlements
        </p>
      </div>

      {!subscriptions || subscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions"
          description="You don't have any active subscriptions yet."
          icon={<Repeat className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-5">
          {subscriptions.map((sub, idx) => (
            <div
              key={sub.id}
              className="glass-panel rounded-2xl p-6 anim-spring"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-[1.5px] border-black/10 gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl glass-odoo text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-odoo tracking-tight block">
                      {sub.number}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 block mt-0.5">
                      {sub.plan?.name}
                    </span>
                  </div>
                </div>
                <div>
                  <StatusBadge status={sub.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-5">
                <div>
                  <p className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Billing Cycle
                  </p>
                  <span className="inline-block px-2.5 py-1 rounded bg-odoo/10 border border-odoo/20 text-xs font-bold text-odoo-dark font-mono uppercase">
                    {sub.plan?.billingFrequency}
                  </span>
                </div>
                <div>
                  <p className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Start Date
                  </p>
                  <p className="font-semibold text-odoo-dark flex items-center font-mono text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-odoo opacity-60" />
                    {formatDate(sub.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Expiry Date
                  </p>
                  <p className="font-semibold text-odoo-dark font-mono text-xs">
                    {sub.expiryDate ? formatDate(sub.expiryDate) : 'Perpetual renewal'}
                  </p>
                </div>
                <div>
                  <p className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Next Billing
                  </p>
                  <p className="font-bold font-mono text-xs flex items-center text-odoo">
                    <RefreshCw className="w-3.5 h-3.5 mr-1 opacity-70" />
                    {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}
                  </p>
                </div>
              </div>

              {sub.lines && sub.lines.length > 0 && (
                <div className="mt-5 pt-4 border-t-[1.5px] border-black/10">
                  <p className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Contract Entitlements & Lines
                  </p>
                  <div className="space-y-2">
                    {sub.lines.map((line) => (
                      <div
                        key={line.id}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white/60 border border-black/10"
                      >
                        <span className="font-semibold text-odoo-dark">{line.product?.name}</span>
                        <div className="flex items-center gap-4 font-mono font-bold">
                          <span className="text-gray-500">Qty: {line.quantity}</span>
                          <CurrencyDisplay amount={line.lineTotal} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
