import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Repeat, Calendar, RefreshCw } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
        <h1 className="text-xl font-bold text-text-primary">My Subscriptions</h1>
        <p className="text-sm text-text-secondary mt-0.5">View your current and past subscriptions</p>
      </div>

      {!subscriptions || subscriptions.length === 0 ? (
        <EmptyState title="No subscriptions" description="You don't have any active subscriptions yet." icon={<Repeat className="w-8 h-8" />} />
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-plum-light text-plum-primary flex items-center justify-center">
                      <Repeat className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-plum-primary">{sub.number}</p>
                      <p className="text-xs text-text-secondary">{sub.plan?.name}</p>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Billing Cycle</p>
                    <Badge variant="secondary" className="text-xs">{sub.plan?.billingFrequency}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Start Date</p>
                    <p className="font-medium text-text-primary flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                      {formatDate(sub.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Expiry Date</p>
                    <p className="font-medium text-text-primary">
                      {sub.expiryDate ? formatDate(sub.expiryDate) : 'No expiry'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Next Billing</p>
                    <p className={`font-medium flex items-center ${sub.nextBillingDate ? 'text-text-primary' : 'text-text-secondary'}`}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                      {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}
                    </p>
                  </div>
                </div>

                {sub.lines && sub.lines.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border-main/40">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Included Items</p>
                    <div className="space-y-1">
                      {sub.lines.map((line) => (
                        <div key={line.id} className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary">
                            {line.product?.name}
                            {line.variant && <span className="text-xs ml-1 text-plum-muted">({line.variant.name})</span>}
                            <span className="text-xs ml-1">× {line.quantity}</span>
                          </span>
                          <CurrencyDisplay amount={line.lineTotal} size="sm" className="font-medium" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-border-main/40 font-semibold">
                      <span className="text-sm">Per Billing Period</span>
                      <CurrencyDisplay amount={sub.total} size="sm" className="font-bold text-plum-primary" />
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
