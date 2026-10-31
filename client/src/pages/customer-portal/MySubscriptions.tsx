import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Repeat, Calendar, RefreshCw } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatDate } from '../../lib/utils';

export const MySubscriptions: React.FC = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['portal-subscriptions'],
    queryFn: portalService.getSubscriptions,
  });

  if (isLoading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-text-primary">My Subscriptions</h1>
        <p className="text-xs text-text-secondary mt-0.5">View your current and past subscriptions</p>
      </div>

      {!subscriptions || subscriptions.length === 0 ? (
        <EmptyState title="No subscriptions" description="You don't have any active subscriptions yet." icon={<Repeat className="w-8 h-8" />} />
      ) : (
        <div className="space-y-3.5">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardHeader className="py-3 px-4 border-b border-border-main">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-md bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
                      <Repeat className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-plum-primary">{sub.number}</p>
                      <p className="text-xs text-text-secondary">{sub.plan?.name}</p>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-text-secondary text-[11px] font-semibold uppercase mb-1">Billing Cycle</p>
                    <Badge variant="secondary" className="text-[10px]">{sub.plan?.billingFrequency}</Badge>
                  </div>
                  <div>
                    <p className="text-text-secondary text-[11px] font-semibold uppercase mb-1">Start Date</p>
                    <p className="font-medium text-text-primary font-mono flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                      {formatDate(sub.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-[11px] font-semibold uppercase mb-1">Expiry Date</p>
                    <p className="font-medium text-text-primary font-mono">
                      {sub.expiryDate ? formatDate(sub.expiryDate) : 'No expiry'}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-[11px] font-semibold uppercase mb-1">Next Billing</p>
                    <p className={`font-medium font-mono flex items-center ${sub.nextBillingDate ? 'text-text-primary' : 'text-text-secondary'}`}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                      {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}
                    </p>
                  </div>
                </div>

                {sub.lines && sub.lines.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-border-main">
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Included Items</p>
                    <div className="space-y-1.5">
                      {sub.lines.map((line) => (
                        <div key={line.id} className="flex justify-between items-center text-xs">
                          <span className="text-text-secondary">
                            <span className="text-text-primary font-medium">{line.product?.name}</span>
                            {line.variant && <span className="text-[11px] ml-1 text-plum-muted">({line.variant.name})</span>}
                            <span className="text-[11px] ml-1 font-mono">× {line.quantity}</span>
                          </span>
                          <CurrencyDisplay amount={line.lineTotal} size="sm" className="font-medium font-mono" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-border-main font-semibold">
                      <span className="text-xs text-text-primary">Per Billing Period</span>
                      <CurrencyDisplay amount={sub.total} size="sm" className="font-bold text-plum-primary font-mono" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
