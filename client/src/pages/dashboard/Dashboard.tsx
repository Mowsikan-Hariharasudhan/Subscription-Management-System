import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Repeat,
  DollarSign,
  Receipt,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { formatDate } from '../../lib/utils';

export const Dashboard: React.FC = () => {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: dashboardService.getKpis,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['dashboard', 'monthly-revenue'],
    queryFn: () => dashboardService.getMonthlyRevenue(),
  });

  const { data: distData } = useQuery({
    queryKey: ['dashboard', 'distribution'],
    queryFn: dashboardService.getPaymentDistribution,
  });

  const { data: overdueInvoices } = useQuery({
    queryKey: ['dashboard', 'overdue-invoices'],
    queryFn: () => dashboardService.getOverdueInvoices(5),
  });

  const { data: recentSubscriptions } = useQuery({
    queryKey: ['dashboard', 'recent-subscriptions'],
    queryFn: () => dashboardService.getRecentSubscriptions(5),
  });

  const PIE_COLORS = ['#724B68', '#53364F', '#0F766E', '#BE123C', '#B45309'];

  if (kpisLoading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Executive Overview"
        description="Real-time operational metrics for subscriptions, billing throughput, and cash collections"
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Active Subscriptions */}
        <Card className="hover:border-plum-primary/40 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Active Subs
              </span>
              <div className="w-6 h-6 rounded-md bg-surface-subtle border border-border-main text-plum-primary flex items-center justify-center">
                <Repeat className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-xl font-bold text-text-primary font-mono tracking-tight">
                {kpis?.activeSubscriptions ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="hover:border-plum-primary/40 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Customers
              </span>
              <div className="w-6 h-6 rounded-md bg-surface-subtle border border-border-main text-plum-primary flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-xl font-bold text-text-primary font-mono tracking-tight">
                {kpis?.totalCustomers ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Collected Revenue */}
        <Card className="hover:border-emerald-400 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Cash Collected
              </span>
              <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <CurrencyDisplay amount={kpis?.collectedRevenue} size="md" className="text-emerald-700 font-bold font-mono" />
            </div>
          </CardContent>
        </Card>

        {/* Total Invoiced */}
        <Card className="hover:border-blue-400 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Total Invoiced
              </span>
              <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <CurrencyDisplay amount={kpis?.totalInvoiced} size="md" className="font-bold font-mono text-text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Amount */}
        <Card className="hover:border-amber-400 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Outstanding
              </span>
              <div className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <CurrencyDisplay amount={kpis?.outstandingAmount} size="md" className="text-amber-800 font-bold font-mono" />
            </div>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card className="border-rose-200 bg-rose-50/20 hover:border-rose-300 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                Overdue
              </span>
              <div className="w-6 h-6 rounded-md bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xl font-bold text-rose-700 font-mono">
                {kpis?.overdueInvoices ?? 0}
              </span>
              <span className="text-[10px] text-rose-600 font-medium">Invoices</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 sm:px-5">
            <div>
              <CardTitle className="text-sm font-semibold">Revenue Inflow</CardTitle>
              <p className="text-xs text-text-secondary">Cash collections by month for current fiscal period</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4 px-4 sm:px-5 pb-5">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#724B68" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#724B68" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#E8E4E7" vertical={false} />
                  <XAxis dataKey="month" stroke="#746F75" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#746F75"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E8E4E7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Collected Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenueRupees"
                    stroke="#724B68"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Status Distribution Chart */}
        <Card>
          <CardHeader className="py-3 px-4 sm:px-5">
            <CardTitle className="text-sm font-semibold">Invoice Status Breakdown</CardTitle>
            <p className="text-xs text-text-secondary">Distribution across all billing states</p>
          </CardHeader>
          <CardContent className="pt-2 px-4 sm:px-5 pb-5">
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distData || []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={2}
                  >
                    {(distData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E8E4E7',
                      borderRadius: '6px',
                      fontSize: '11px',
                    }}
                    formatter={(value, name) => [`${value} invoices`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5 border-t border-border-main pt-2.5">
              {(distData || []).map((item, idx) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-xs"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-text-secondary font-mono text-[11px]">{item.status}</span>
                  </div>
                  <span className="font-semibold text-text-primary font-mono text-xs">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Overdue Invoices Alert Table */}
        <Card className="border-rose-200">
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 bg-rose-50/30">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <CardTitle className="text-xs sm:text-sm text-rose-950 font-semibold">Overdue Invoices Requiring Follow-Up</CardTitle>
            </div>
            <Link to="/invoices" className="text-xs text-rose-700 font-semibold hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-subtle text-text-secondary uppercase border-b border-border-main font-semibold text-[10px] tracking-wider select-none">
                  <tr>
                    <th className="px-3.5 py-2.5">Invoice #</th>
                    <th className="px-3.5 py-2.5">Customer</th>
                    <th className="px-3.5 py-2.5">Due Date</th>
                    <th className="px-3.5 py-2.5 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {(!overdueInvoices || overdueInvoices.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-text-secondary text-xs">
                        No overdue invoices! All payments are up to date.
                      </td>
                    </tr>
                  ) : (
                    overdueInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-plum-primary">
                          <Link to="/invoices" className="hover:underline">
                            {inv.number}
                          </Link>
                        </td>
                        <td className="px-3.5 py-2.5 text-text-primary font-medium truncate max-w-[140px]">
                          {inv.customer.name}
                        </td>
                        <td className="px-3.5 py-2.5 text-rose-700 font-semibold font-mono">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="px-3.5 py-2.5 text-right">
                          <CurrencyDisplay amount={inv.outstanding} size="sm" className="text-rose-700 font-bold font-mono" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4">
            <CardTitle className="text-xs sm:text-sm font-semibold">Active Subscriptions</CardTitle>
            <Link to="/subscriptions" className="text-xs text-plum-primary font-semibold hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-subtle text-text-secondary uppercase border-b border-border-main font-semibold text-[10px] tracking-wider select-none">
                  <tr>
                    <th className="px-3.5 py-2.5">Subscription #</th>
                    <th className="px-3.5 py-2.5">Customer</th>
                    <th className="px-3.5 py-2.5">Plan</th>
                    <th className="px-3.5 py-2.5">Status</th>
                    <th className="px-3.5 py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {(!recentSubscriptions || recentSubscriptions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-text-secondary text-xs">
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    recentSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-main/60 transition-colors">
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-plum-primary">
                          <Link to={`/subscriptions/${sub.id}`} className="hover:underline">
                            {sub.number}
                          </Link>
                        </td>
                        <td className="px-3.5 py-2.5 text-text-primary font-medium truncate max-w-[120px]">
                          {sub.customer.name}
                        </td>
                        <td className="px-3.5 py-2.5 text-text-secondary truncate max-w-[100px]">{sub.plan.name}</td>
                        <td className="px-3.5 py-2.5">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono">
                          <CurrencyDisplay amount={sub.total} size="sm" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
