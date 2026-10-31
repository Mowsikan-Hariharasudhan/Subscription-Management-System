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
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

  const { data: growthData } = useQuery({
    queryKey: ['dashboard', 'growth'],
    queryFn: dashboardService.getSubscriptionGrowth,
  });

  const { data: distData } = useQuery({
    queryKey: ['dashboard', 'distribution'],
    queryFn: dashboardService.getPaymentDistribution,
  });

  const { data: recentInvoices } = useQuery({
    queryKey: ['dashboard', 'recent-invoices'],
    queryFn: () => dashboardService.getRecentInvoices(5),
  });

  const { data: overdueInvoices } = useQuery({
    queryKey: ['dashboard', 'overdue-invoices'],
    queryFn: () => dashboardService.getOverdueInvoices(5),
  });

  const { data: recentSubscriptions } = useQuery({
    queryKey: ['dashboard', 'recent-subscriptions'],
    queryFn: () => dashboardService.getRecentSubscriptions(5),
  });

  const PIE_COLORS = ['#724B68', '#36283B', '#10B981', '#EF4444', '#F59E0B'];

  if (kpisLoading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Comprehensive real-time metrics for recurring billing, revenue, and subscriptions"
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Active Subscriptions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Active Subs
              </span>
              <div className="w-8 h-8 rounded-lg bg-plum-light text-plum-primary flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-text-primary">
                {kpis?.activeSubscriptions ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Customers
              </span>
              <div className="w-8 h-8 rounded-lg bg-plum-light text-plum-primary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-text-primary">
                {kpis?.totalCustomers ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Collected Revenue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Collected
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <CurrencyDisplay amount={kpis?.collectedRevenue} size="lg" className="text-emerald-700" />
            </div>
          </CardContent>
        </Card>

        {/* Total Invoiced */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Invoiced
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <CurrencyDisplay amount={kpis?.totalInvoiced} size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Amount */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Outstanding
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <CurrencyDisplay amount={kpis?.outstandingAmount} size="lg" className="text-amber-700" />
            </div>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card className="hover:shadow-md transition-shadow border-rose-200 bg-rose-50/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Overdue
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-rose-700">
                {kpis?.overdueInvoices ?? 0}
              </span>
              <span className="text-[10px] text-rose-600 font-medium">Invoices</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Revenue Inflow</CardTitle>
              <p className="text-xs text-text-secondary">Cash collections by month for current fiscal year</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#724B68" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#724B68" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4DEE3" vertical={false} />
                  <XAxis dataKey="month" stroke="#746F75" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#746F75"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenueRupees"
                    stroke="#724B68"
                    strokeWidth={2.5}
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Invoice Status Breakdown</CardTitle>
            <p className="text-xs text-text-secondary">Distribution across all billing states</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distData || []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {(distData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} invoices`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {(distData || []).map((item, idx) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-text-secondary">{item.status}</span>
                  </div>
                  <span className="font-semibold text-text-primary">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices Alert Table */}
        <Card className="border-rose-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-rose-50/30">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <CardTitle className="text-base text-rose-950">Overdue Invoices Requiring Follow-Up</CardTitle>
            </div>
            <Link to="/invoices" className="text-xs text-rose-700 font-semibold hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                  <tr>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {(!overdueInvoices || overdueInvoices.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
                        No overdue invoices! All payments are up to date.
                      </td>
                    </tr>
                  ) : (
                    overdueInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="px-4 py-3 font-semibold text-plum-primary">
                          <Link to={`/invoices`} className="hover:underline">
                            {inv.number}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-text-primary font-medium truncate max-w-[150px]">
                          {inv.customer.name}
                        </td>
                        <td className="px-4 py-3 text-rose-600 font-semibold">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <CurrencyDisplay amount={inv.outstanding} size="sm" className="text-rose-700 font-bold" />
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
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Active Subscriptions</CardTitle>
            <Link to="/subscriptions" className="text-xs text-plum-primary font-semibold hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                  <tr>
                    <th className="px-4 py-3">Subscription #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {(!recentSubscriptions || recentSubscriptions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    recentSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-main/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-plum-primary">
                          <Link to={`/subscriptions/${sub.id}`} className="hover:underline">
                            {sub.number}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-text-primary font-medium truncate max-w-[130px]">
                          {sub.customer.name}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{sub.plan.name}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
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

