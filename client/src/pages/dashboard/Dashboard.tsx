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
  Calculator,
  Activity,
  Calendar,
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
import { CardSkeleton } from '../../components/shared/LoadingSkeleton';
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

  const PIE_COLORS = ['#714B67', '#4A3043', '#10B981', '#EF4444', '#F59E0B'];

  if (kpisLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="skeleton h-8 w-64" />
            <div className="skeleton h-4 w-96" />
          </div>
          <div className="skeleton h-12 w-44" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Subscription Operations & Revenue"
        description="Real-time aggregate data across subscription contracts, recurring billing, GST invoices, and collections"
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/subscriptions"
              className="px-5 py-2.5 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-xs rounded-xl hover:bg-gray-50 transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              Browse Subscriptions →
            </Link>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* Active Subscriptions */}
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-1 cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest">
              ACTIVE SUBS
            </div>
            <div className="w-9 h-9 rounded-lg bg-odoo/10 border border-odoo/20 flex items-center justify-center text-odoo transition-transform hover:rotate-12">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[2rem] font-bold text-odoo-dark leading-none tabular-nums tracking-tight">
            {kpis?.activeSubscriptions ?? 0}
          </div>
          <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live contracts
          </div>
        </div>

        {/* Total Customers */}
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-2 cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest">
              CUSTOMERS
            </div>
            <div className="w-9 h-9 rounded-lg bg-odoo/10 border border-odoo/20 flex items-center justify-center text-odoo transition-transform hover:rotate-12">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[2rem] font-bold text-odoo-dark leading-none tabular-nums tracking-tight">
            {kpis?.totalCustomers ?? 0}
          </div>
          <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Verified accounts
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-3 cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest">
              COLLECTED
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 transition-transform hover:rotate-12">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[1.75rem] font-bold text-emerald-700 leading-none tabular-nums tracking-tight">
            <CurrencyDisplay amount={kpis?.collectedRevenue} size="lg" className="text-emerald-700" />
          </div>
          <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Settled payments
          </div>
        </div>

        {/* Total Invoiced */}
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-3 cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest">
              INVOICED
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 transition-transform hover:rotate-12">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[1.75rem] font-bold text-odoo-dark leading-none tabular-nums tracking-tight">
            <CurrencyDisplay amount={kpis?.totalInvoiced} size="lg" />
          </div>
          <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            GST total billed
          </div>
        </div>

        {/* Outstanding Amount */}
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-4 cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest">
              OUTSTANDING
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 transition-transform hover:rotate-12">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[1.75rem] font-bold text-amber-700 leading-none tabular-nums tracking-tight">
            <CurrencyDisplay amount={kpis?.outstandingAmount} size="lg" className="text-amber-700" />
          </div>
          <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Awaiting clearance
          </div>
        </div>

        {/* Overdue Invoices */}
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-4 cursor-default border-rose-600">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[0.6875rem] font-bold text-rose-700 uppercase tracking-widest">
              OVERDUE
            </div>
            <div className="w-9 h-9 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 transition-transform hover:rotate-12">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[2rem] font-bold text-rose-700 leading-none tabular-nums tracking-tight">
            {kpis?.overdueInvoices ?? 0}
          </div>
          <div className="text-[0.8125rem] text-rose-600 font-bold mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            Action required
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 sm:px-5">
            <div>
              <CardTitle className="text-base">Revenue Inflow</CardTitle>
              <p className="text-xs text-gray-500">Monthly cash collections for current fiscal period</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4 px-4 sm:px-5 pb-5">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#714B67" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#714B67" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.08} vertical={false} />
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
                    stroke="#714B67"
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
            <p className="text-xs text-gray-500">Distribution across all lifecycle states</p>
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
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
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
            <div className="mt-3 space-y-1.5">
              {(distData || []).map((item, idx) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-xs"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-gray-600 font-medium">{item.status}</span>
                  </div>
                  <span className="font-bold text-odoo-dark font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row with .table-row hover treatment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices Alert Table */}
        <Card className="border-rose-400">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-rose-50/40">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-base text-rose-950">Overdue Invoices Requiring Follow-Up</CardTitle>
            </div>
            <Link to="/invoices" className="text-xs text-rose-700 font-bold hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-white/50 text-gray-700 uppercase border-b-[1.5px] border-black/10 font-bold">
                  <tr>
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Due Date</th>
                    <th className="px-5 py-3 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {(!overdueInvoices || overdueInvoices.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-500 font-medium">
                        No overdue invoices! All accounts are settled.
                      </td>
                    </tr>
                  ) : (
                    overdueInvoices.map((inv) => (
                      <tr key={inv.id} className="table-row cursor-pointer">
                        <td className="px-5 py-3.5 font-bold text-odoo">
                          <Link to="/invoices" className="hover:underline">
                            {inv.number}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-odoo-dark font-semibold truncate max-w-[150px]">
                          {inv.customer.name}
                        </td>
                        <td className="px-5 py-3.5 text-rose-600 font-bold">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono">
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
            <Link to="/subscriptions" className="text-xs text-odoo font-bold hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-white/50 text-gray-700 uppercase border-b-[1.5px] border-black/10 font-bold">
                  <tr>
                    <th className="px-5 py-3">Subscription #</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {(!recentSubscriptions || recentSubscriptions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-500 font-medium">
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    recentSubscriptions.map((sub) => (
                      <tr key={sub.id} className="table-row cursor-pointer">
                        <td className="px-5 py-3.5 font-bold text-odoo">
                          <Link to={`/subscriptions/${sub.id}`} className="hover:underline">
                            {sub.number}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-odoo-dark font-semibold truncate max-w-[130px]">
                          {sub.customer.name}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 font-medium">{sub.plan.name}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold">
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
