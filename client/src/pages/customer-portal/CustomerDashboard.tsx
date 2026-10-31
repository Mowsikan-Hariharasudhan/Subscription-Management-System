import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, AlertTriangle, ChevronRight } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-plum-deep rounded-2xl p-6 text-white">
        <p className="text-white/60 text-sm">Welcome back,</p>
        <h1 className="text-2xl font-bold mt-1">{customer?.name || user?.email}</h1>
        {customer?.companyName && <p className="text-white/70 text-sm mt-1">{customer.companyName}</p>}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Subscriptions</span>
              <Repeat className="w-4 h-4 text-plum-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2">{activeSubscriptions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Outstanding</span>
              <AlertTriangle className={`w-4 h-4 ${outstandingAmount > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
            <CurrencyDisplay amount={outstandingAmount} size="lg" className={`mt-2 font-bold ${outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Invoices</span>
              <Receipt className="w-4 h-4 text-plum-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2">{overview?.totalInvoices ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Subscriptions</CardTitle>
              <button onClick={() => navigate('/portal/subscriptions')} className="text-xs text-plum-primary hover:underline flex items-center cursor-pointer">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-main bg-surface-main">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Subscription</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Next Billing</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeSubscriptions.map((sub: any) => (
                  <tr key={sub.id} className="border-b border-border-main/60 hover:bg-surface-main/50 cursor-pointer"
                    onClick={() => navigate('/portal/subscriptions')}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-plum-primary">{sub.number}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{sub.plan?.name}</p>
                      <p className="text-xs text-text-secondary uppercase">{sub.plan?.billingFrequency}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}</td>
                    <td className="px-4 py-3 text-right"><CurrencyDisplay amount={sub.total} size="sm" className="font-semibold" /></td>
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <button onClick={() => navigate('/portal/invoices')} className="text-xs text-plum-primary hover:underline flex items-center cursor-pointer">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-main bg-surface-main">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Invoice #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Due Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-border-main/60 hover:bg-surface-main/50 cursor-pointer"
                    onClick={() => navigate('/portal/invoices')}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-plum-primary">{inv.number}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3 text-right">
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
