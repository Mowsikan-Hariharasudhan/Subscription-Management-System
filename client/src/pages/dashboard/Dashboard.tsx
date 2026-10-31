import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  RotateCw,
  ChevronDown,
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
  const queryClient = useQueryClient();
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterTime, setFilterTime] = useState('All Time');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const PIE_COLORS = ['#6A3D5B', '#8A5F7C', '#059669', '#DC2626', '#D97706'];

  if (kpisLoading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Filters & Actions matching reference */}
      <PageHeader
        title="Subscription & Revenue Operations Dashboard"
        description="Real-time aggregate data across subscription runs, recurring invoices, payments, and discounts"
        actions={
          <div className="flex items-center gap-2">
            {/* Filter Dropdown 1 */}
            <div className="relative">
              <button
                type="button"
                className="h-9 px-3.5 rounded-xl border border-border-main bg-white text-xs font-medium text-text-primary flex items-center gap-2 hover:bg-surface-hover shadow-sm"
              >
                <span>{filterPlan}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>

            {/* Filter Dropdown 2 */}
            <div className="relative">
              <button
                type="button"
                className="h-9 px-3.5 rounded-xl border border-border-main bg-white text-xs font-medium text-text-primary flex items-center gap-2 hover:bg-surface-hover shadow-sm"
              >
                <span>{filterTime}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="h-9 px-3.5 rounded-xl border border-border-main bg-white text-xs font-medium text-text-primary flex items-center gap-1.5 hover:bg-surface-hover shadow-sm transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 text-text-secondary ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards Row (5 Cards matching reference layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Net Paid / Collected */}
        <Card className="hover:border-plum-primary/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                TOTAL NET PAID
              </span>
              <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <CurrencyDisplay amount={kpis?.collectedRevenue} size="lg" className="font-bold text-text-primary font-mono tracking-tight" />
            </div>
            <p className="text-xs text-text-secondary mt-1">Processed subscription revenue</p>
          </CardContent>
        </Card>

        {/* Invoices Generated */}
        <Card className="hover:border-plum-primary/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                INVOICES BILLED
              </span>
              <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-text-primary font-mono tracking-tight">
                {kpis?.totalInvoiced ? `₹${(kpis.totalInvoiced / 100).toLocaleString('en-IN')}` : '₹0'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">Total recurring billing statements</p>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="hover:border-plum-primary/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                ACTIVE SUBSCRIPTIONS
              </span>
              <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-text-primary font-mono tracking-tight">
                {kpis?.activeSubscriptions ?? 0}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">Active customer contract cycles</p>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card className="hover:border-plum-primary/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                OUTSTANDING DUE
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <CurrencyDisplay amount={kpis?.outstandingAmount} size="lg" className="font-bold text-amber-800 font-mono tracking-tight" />
            </div>
            <p className="text-xs text-text-secondary mt-1">Awaiting customer clearance</p>
          </CardContent>
        </Card>

        {/* Customers / Health Rate */}
        <Card className="hover:border-plum-primary/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                CUSTOMER BASE
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-text-primary font-mono tracking-tight">
                {kpis?.totalCustomers ?? 0}
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">✓ Active enterprise accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue Chart (2/3 width) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border-main">
            <div>
              <CardTitle className="text-sm font-bold text-text-primary">Monthly Revenue Expenditure Trend</CardTitle>
              <p className="text-xs text-text-secondary mt-0.5">Gross billings vs net collections over recent periods</p>
            </div>
            <span className="text-[10px] font-bold text-plum-primary bg-plum-surface border border-plum-border px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              LIVE DATA
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6A3D5B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6A3D5B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE4E8" vertical={false} />
                  <XAxis dataKey="month" stroke="#756C73" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#756C73"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#EAE4E8',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Collected Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenueRupees"
                    stroke="#6A3D5B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Status Distribution Chart (1/3 width) */}
        <Card>
          <CardHeader className="py-4 px-6 border-b border-border-main">
            <CardTitle className="text-sm font-bold text-text-primary">Status Distribution</CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">Logged invoice states (current window)</p>
          </CardHeader>
          <CardContent className="p-6">
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
                    outerRadius={74}
                    paddingAngle={3}
                  >
                    {(distData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#EAE4E8',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(value, name) => [`${value} invoices`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 border-t border-border-main pt-3">
              {(distData || []).map((item, idx) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 border-b border-border-main">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <CardTitle className="text-sm font-bold text-text-primary">Overdue Invoices Requiring Follow-Up</CardTitle>
            </div>
            <Link to="/invoices" className="text-xs text-plum-primary font-semibold hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF7F9] text-text-secondary uppercase border-b border-border-main font-semibold text-[10px] tracking-wider select-none">
                  <tr>
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Due Date</th>
                    <th className="px-5 py-3 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/70">
                  {(!overdueInvoices || overdueInvoices.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center text-text-secondary text-xs">
                        No overdue invoices! All payments are up to date.
                      </td>
                    </tr>
                  ) : (
                    overdueInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="px-5 py-3 font-mono font-semibold text-plum-primary">
                          <Link to="/invoices" className="hover:underline">
                            {inv.number}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-text-primary font-medium truncate max-w-[140px]">
                          {inv.customer.name}
                        </td>
                        <td className="px-5 py-3 text-rose-700 font-semibold font-mono">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="px-5 py-3 text-right">
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
          <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 border-b border-border-main">
            <CardTitle className="text-sm font-bold text-text-primary">Active Subscriptions</CardTitle>
            <Link to="/subscriptions" className="text-xs text-plum-primary font-semibold hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF7F9] text-text-secondary uppercase border-b border-border-main font-semibold text-[10px] tracking-wider select-none">
                  <tr>
                    <th className="px-5 py-3">Subscription #</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/70">
                  {(!recentSubscriptions || recentSubscriptions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-text-secondary text-xs">
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    recentSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-hover/60 transition-colors">
                        <td className="px-5 py-3 font-mono font-semibold text-plum-primary">
                          <Link to={`/subscriptions/${sub.id}`} className="hover:underline">
                            {sub.number}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-text-primary font-medium truncate max-w-[120px]">
                          {sub.customer.name}
                        </td>
                        <td className="px-5 py-3 text-text-secondary truncate max-w-[100px]">{sub.plan.name}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-5 py-3 text-right font-mono">
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
