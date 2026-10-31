import { useState } from 'react'
import {
  calcMRR,
  calcARR,
  countActiveSubs,
  calcOutstanding,
  countOverdue,
  formatPaise,
  getRevenueByMonth,
  CUSTOMERS,
  SUBSCRIPTIONS,
  INVOICES,
  PAYMENTS,
} from '../data/seed'
import { PageHeader, Badge, Btn } from '../components/ui'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, AlertCircle, Clock, CheckCircle2, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [filterPeriod, setFilterPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d')
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchNotice, setBatchNotice] = useState('')

  const mrr = calcMRR()
  const arr = calcARR()
  const activeSubs = countActiveSubs()
  const totalCustomers = CUSTOMERS.filter(c => c.status === 'ACTIVE').length
  const outstanding = calcOutstanding()
  const overdueCount = countOverdue()

  const chartData = getRevenueByMonth()

  const handleRunBilling = () => {
    setBatchRunning(true)
    setTimeout(() => {
      setBatchRunning(false)
      setBatchNotice('Batch billing run completed. 142 recurring cycles processed, 0 duplicates.')
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Executive Revenue Command</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Brightloop Operations · INR (₹) Financial Ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center border border-[var(--line)] rounded bg-white p-0.5 text-xs font-mono">
            {(['today', '7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setFilterPeriod(p)}
                className={`px-2 py-1 rounded transition-colors uppercase cursor-pointer ${
                  filterPeriod === p
                    ? 'bg-[var(--line-strong)] text-white font-bold'
                    : 'text-[var(--ink-60)] hover:text-[var(--ink)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Btn
            variant="secondary"
            size="sm"
            onClick={handleRunBilling}
            disabled={batchRunning}
            className="font-mono text-xs"
          >
            <RefreshCw size={12} className={batchRunning ? 'animate-spin' : ''} />
            {batchRunning ? 'Billing...' : 'Run Billing Day'}
          </Btn>
        </div>
      </div>

      {batchNotice && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-900 text-xs font-mono rounded flex justify-between items-center">
          <span>{batchNotice}</span>
          <button onClick={() => setBatchNotice('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* KPI Band — Divided by 1px solid structural rules (Structural Brutalism) */}
      <div className="border border-[var(--line-strong)] bg-white grid grid-cols-2 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-[var(--line-strong)]">
        <div className="p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">MRR</p>
          <p className="text-xl font-bold font-mono text-[var(--ink)] mt-1">{formatPaise(mrr)}</p>
          <p className="text-[11px] font-mono text-[var(--ok)] mt-1 flex items-center">
            ↑ +12.4% <span className="text-[var(--ink-40)] ml-1">vs prev</span>
          </p>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">ARR (RUN-RATE)</p>
          <p className="text-xl font-bold font-mono text-[var(--ink)] mt-1">{formatPaise(arr)}</p>
          <p className="text-[11px] font-mono text-[var(--ok)] mt-1 flex items-center">
            ↑ +14.1% <span className="text-[var(--ink-40)] ml-1">YoY</span>
          </p>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">ACTIVE SUBS</p>
          <p className="text-xl font-bold font-mono text-[var(--ink)] mt-1">{activeSubs}</p>
          <p className="text-[11px] font-mono text-[var(--ink-60)] mt-1">98.2% retention</p>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">CUSTOMERS</p>
          <p className="text-xl font-bold font-mono text-[var(--ink)] mt-1">{totalCustomers}</p>
          <p className="text-[11px] font-mono text-[var(--ok)] mt-1">+4 this month</p>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">OUTSTANDING</p>
          <p className="text-xl font-bold font-mono text-[var(--warn)] mt-1">{formatPaise(outstanding)}</p>
          <p className="text-[11px] font-mono text-[var(--ink-40)] mt-1">Due in 30d</p>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">OVERDUE AT-RISK</p>
          <p className="text-xl font-bold font-mono text-[var(--bad)] mt-1">{overdueCount} INVOICES</p>
          <p className="text-[11px] font-mono text-[var(--bad)] mt-1 font-semibold">Immediate chase</p>
        </div>
      </div>

      {/* Analytics Chart & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flat Revenue Chart (2 Cols) */}
        <div className="lg:col-span-2 border border-[var(--line-strong)] bg-white p-5">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--line)]">
            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)]">12-Month Financial Performance</h2>
              <p className="text-[11px] text-[var(--ink-40)] font-mono">Recognized Revenue (paise) vs Cash Collected</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[var(--ink)]">
                <span className="w-2.5 h-2.5 bg-[var(--ink)] inline-block" /> Recognized
              </span>
              <span className="flex items-center gap-1.5 text-[var(--accent)]">
                <span className="w-2.5 h-2.5 bg-[var(--accent)] inline-block" /> Collected
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#8A8A8A" fontSize={11} tickLine={false} axisLine={{ stroke: '#171717' }} />
                <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#171717', borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="recognized" fill="#0A0A0A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="collected" fill="#1E40AF" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-right">
            <span className="font-mono text-[10px] text-[var(--ink-40)] uppercase">
              Financial Integrity: Stored in Paise minor units · Zero floating-point drift
            </span>
          </div>
        </div>

        {/* Needs Attention Queue (1 Col) */}
        <div className="border border-[var(--line-strong)] bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--line)]">
              <h2 className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5">
                <AlertCircle size={14} className="text-[var(--bad)]" />
                <span>Needs Attention</span>
              </h2>
              <span className="text-[10px] font-mono font-bold bg-red-100 text-[var(--bad)] px-1.5 py-0.5 rounded">
                CRITICAL
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 border border-[var(--line)] bg-[var(--surface-2)] rounded-sm">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-semibold">INV-2025-000012</span>
                  <span className="font-mono text-xs text-[var(--bad)] font-bold">₹44,800</span>
                </div>
                <p className="text-xs text-[var(--ink-60)] mt-1">TCS Mumbai · 14 Days Overdue</p>
                <button
                  onClick={() => navigate('/deepseek/invoices')}
                  className="mt-2 text-[10px] font-mono uppercase font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  Send Dunning Notice <ArrowUpRight size={10} />
                </button>
              </div>

              <div className="p-3 border border-[var(--line)] bg-[var(--surface-2)] rounded-sm">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-semibold">SUB-2025-000007</span>
                  <span className="font-mono text-[10px] px-1 bg-yellow-100 text-yellow-800 font-bold rounded">PAUSED</span>
                </div>
                <p className="text-xs text-[var(--ink-60)] mt-1">Swiggy Enterprise · ERP Monthly</p>
                <button
                  onClick={() => navigate('/deepseek/subscriptions')}
                  className="mt-2 text-[10px] font-mono uppercase font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  Resume Subscription <ArrowUpRight size={10} />
                </button>
              </div>

              <div className="p-3 border border-[var(--line)] bg-[var(--surface-2)] rounded-sm">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-semibold">SUB-2025-000001</span>
                  <span className="font-mono text-xs text-[var(--ok)] font-bold">₹2,36,000</span>
                </div>
                <p className="text-xs text-[var(--ink-60)] mt-1">Zoho Corp India · Renews in 10d</p>
                <button
                  onClick={() => navigate('/deepseek/subscriptions')}
                  className="mt-2 text-[10px] font-mono uppercase font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  Review Renewal Terms <ArrowUpRight size={10} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/deepseek/invoices')}
            className="w-full mt-4 py-2 border border-[var(--line-strong)] text-center text-xs font-mono uppercase font-semibold hover:bg-[var(--surface-2)] transition-colors"
          >
            View All Open Invoices ({INVOICES.filter(i => i.state !== 'PAID').length})
          </button>
        </div>
      </div>

      {/* Operational Data Grids: Recent Subscriptions & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="border border-[var(--line-strong)] bg-white p-5">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--line)]">
            <h3 className="text-sm font-semibold text-[var(--ink)]">Active Subscriptions Pipeline</h3>
            <button
              onClick={() => navigate('/deepseek/subscriptions')}
              className="text-xs font-mono text-[var(--accent)] hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--ink-40)]">
                  <th className="py-2">NUMBER</th>
                  <th className="py-2">CUSTOMER</th>
                  <th className="py-2">STATUS</th>
                  <th className="py-2 text-right">MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {SUBSCRIPTIONS.slice(0, 5).map(s => {
                  const cust = CUSTOMERS.find(c => c.id === s.customerId)
                  return (
                    <tr key={s.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="py-2.5 font-bold text-[var(--ink)]">{s.number}</td>
                      <td className="py-2.5 truncate max-w-[140px] text-[var(--ink-60)]">{cust?.company || cust?.name}</td>
                      <td className="py-2.5">
                        <Badge variant={s.state === 'ACTIVE' ? 'ok' : s.state === 'PAUSED' ? 'warn' : 'neutral'}>
                          {s.state}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right font-bold text-[var(--ink)]">{formatPaise(s.mrr)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Invoices & Payments */}
        <div className="border border-[var(--line-strong)] bg-white p-5">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--line)]">
            <h3 className="text-sm font-semibold text-[var(--ink)]">Recent Financial Settlements</h3>
            <button
              onClick={() => navigate('/deepseek/payments')}
              className="text-xs font-mono text-[var(--accent)] hover:underline"
            >
              View ledger →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--ink-40)]">
                  <th className="py-2">PAYMENT ID</th>
                  <th className="py-2">METHOD</th>
                  <th className="py-2">DATE</th>
                  <th className="py-2 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {PAYMENTS.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="py-2.5 font-bold text-[var(--ink)]">{p.number}</td>
                    <td className="py-2.5 text-[var(--ink-60)]">{p.method}</td>
                    <td className="py-2.5 text-[var(--ink-40)]">{p.paidAt}</td>
                    <td className="py-2.5 text-right font-bold text-[var(--ok)]">{formatPaise(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

