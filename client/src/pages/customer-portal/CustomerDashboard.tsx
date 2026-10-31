import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Repeat, Receipt, AlertTriangle, ChevronRight } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatDate } from '../../lib/utils';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: overview, isLoading } = useQuery({
    queryKey: ['portal-overview'],
    queryFn: portalService.getOverview,
  });

  if (isLoading) return <LoadingSkeleton count={4} />;

  const customer = overview?.customer;
  const activeSubscriptions = overview?.activeSubscriptions ?? [];
  const recentInvoices = overview?.recentInvoices ?? [];
  const outstandingAmount = overview?.outstandingAmount ?? 0;

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="bg-plum-deep rounded-lg p-5 text-white border border-plum-dark shadow-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-white/70 text-xs uppercase tracking-wider font-semibold">Welcome back</p>
          <h1 className="text-xl font-bold mt-0.5">{customer?.name || user?.email}</h1>
          {customer?.companyName && <p className="text-white/80 text-xs mt-0.5">{customer.companyName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/10 border border-white/20 px-2.5 py-1 rounded text-white font-mono">
            Customer Portal
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Subscriptions</span>
              <Repeat className="w-4 h-4 text-plum-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2 font-mono">{activeSubscriptions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Outstanding</span>
              <AlertTriangle className={`w-4 h-4 ${outstandingAmount > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
            <CurrencyDisplay amount={outstandingAmount} size="lg" className={`mt-2 font-bold font-mono ${outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Invoices</span>
              <Receipt className="w-4 h-4 text-plum-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2 font-mono">{overview?.totalInvoices ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <Card>
          <CardHeader className="py-3 px-4 border-b border-border-main">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Active Subscriptions</CardTitle>
              <button onClick={() => navigate('/portal/subscriptions')} className="text-xs font-medium text-plum-primary hover:text-plum-deep hover:underline flex items-center gap-0.5 cursor-pointer">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-main bg-surface-subtle">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Subscription</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Next Billing</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {activeSubscriptions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-surface-subtle/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/portal/subscriptions')}>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-plum-primary">{sub.number}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-xs text-text-primary">{sub.plan?.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-mono">{sub.plan?.billingFrequency}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">{sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}</td>
                    <td className="px-4 py-2.5 text-right"><CurrencyDisplay amount={sub.total} size="sm" className="font-semibold" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices */}
      {recentInvoices.length > 0 && (
        <Card>
          <CardHeader className="py-3 px-4 border-b border-border-main">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Invoices</CardTitle>
              <button onClick={() => navigate('/portal/invoices')} className="text-xs font-medium text-plum-primary hover:text-plum-deep hover:underline flex items-center gap-0.5 cursor-pointer">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-main bg-surface-subtle">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Due Date</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-surface-subtle/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/portal/invoices')}>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-plum-primary">{inv.number}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <CurrencyDisplay amount={inv.total} size="sm" className="font-semibold" />
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
