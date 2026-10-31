import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Repeat, Receipt, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
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
      {/* Welcome Hero Banner (Deep Plum Gradient like reference) */}
      <div className="bg-gradient-to-br from-[#6A3D5B] via-[#522A44] to-[#3A1B2E] rounded-3xl p-6 sm:p-8 text-white border border-border-main shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/90 font-medium">
            <Sparkles className="w-3 h-3 text-pink-300" /> SUBSCRIBER ACCOUNT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 text-white">
            Welcome back, {customer?.name || user?.email}
          </h1>
          {customer?.companyName && (
            <p className="text-white/80 text-sm mt-1">{customer.companyName}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
          <button
            onClick={() => navigate('/portal/explore')}
            className="px-4 py-2 rounded-xl bg-white text-[#3E2134] text-xs font-bold shadow-sm hover:bg-white/90 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-plum-primary" />
            <span>Explore & Buy Apps</span>
          </button>
          <span className="text-xs bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-xl text-white font-mono font-medium">
            Active Member
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Active Subscriptions</span>
              <div className="w-8 h-8 rounded-xl bg-plum-surface border border-plum-border flex items-center justify-center">
                <Repeat className="w-4 h-4 text-plum-deep stroke-[2.2]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2.5 font-mono">{activeSubscriptions.length}</p>
            <p className="text-xs text-text-secondary mt-1">Ongoing billing commitments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Outstanding Balance</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <CurrencyDisplay amount={outstandingAmount} size="lg" className={`mt-2.5 font-bold font-mono ${outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
            <p className="text-xs text-text-secondary mt-1">Pending invoice settlements</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Total Invoices</span>
              <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2.5 font-mono">{overview?.totalInvoices ?? 0}</p>
            <p className="text-xs text-text-secondary mt-1">Statements generated to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscriptions Table */}
      {activeSubscriptions.length > 0 && (
        <Card>
          <CardHeader className="py-4 px-6 border-b border-border-main">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-text-primary">Active Subscriptions</CardTitle>
              <button onClick={() => navigate('/portal/subscriptions')} className="text-xs font-semibold text-plum-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-main bg-[#FAF7F9]">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Subscription</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Plan</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Next Billing</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/70">
                {activeSubscriptions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-surface-hover/60 transition-colors cursor-pointer"
                    onClick={() => navigate('/portal/subscriptions')}>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-plum-primary">{sub.number}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-xs text-text-primary">{sub.plan?.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-mono">{sub.plan?.billingFrequency}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-text-secondary font-mono">{sub.nextBillingDate ? formatDate(sub.nextBillingDate) : '—'}</td>
                    <td className="px-5 py-3.5 text-right"><CurrencyDisplay amount={sub.total} size="sm" className="font-bold font-mono" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices Table */}
      {recentInvoices.length > 0 && (
        <Card>
          <CardHeader className="py-4 px-6 border-b border-border-main">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-text-primary">Recent Invoices</CardTitle>
              <button onClick={() => navigate('/portal/invoices')} className="text-xs font-semibold text-plum-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-main bg-[#FAF7F9]">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Due Date</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/70">
                {recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-surface-hover/60 transition-colors cursor-pointer"
                    onClick={() => navigate('/portal/invoices')}>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-plum-primary">{inv.number}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-text-secondary font-mono">{formatDate(inv.dueDate)}</td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      <CurrencyDisplay amount={inv.total} size="sm" className="font-bold" />
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
