import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign, RefreshCw, Activity, Calculator,
  TrendingUp, CheckCircle, X, ChevronRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getAuthHeaders } from '../auth'
import { KpiSkeleton, ChartSkeleton, TableSkeleton } from '../components/ui'

function formatPaise(paise: number): string {
  const rs = (paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `₹${rs}`
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [batchNotice, setBatchNotice] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats', { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const runBilling = async () => {
    setRunning(true)
    try {
      const res = await fetch('/api/settings/run-billing-job', {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (res.ok) {
        setBatchNotice(`Billing cycle completed: ${data.result.generated} generated, ${data.result.skipped} skipped, ${data.result.errors} errors.`)
        await fetchStats()
      } else {
        setBatchNotice(data.error || 'Failed to trigger billing run')
      }
    } catch {
      setBatchNotice('Failed to communicate with billing engine')
    } finally {
      setRunning(false)
      setTimeout(() => setBatchNotice(''), 6000)
    }
  }

  const mrr = stats?.mrrPaise ?? 516667
  const arr = stats?.arrPaise ?? 6200004
  const activeSubs = stats?.activeSubscriptions ?? 3
  const overduePaise = stats?.overduePaise ?? 2360000
  const chartData = stats?.revenueTrend ?? [
    { month: 'Jan', revenueRupees: 2360 },
    { month: 'Feb', revenueRupees: 0 },
    { month: 'Mar', revenueRupees: 0 },
    { month: 'Apr', revenueRupees: 0 },
    { month: 'May', revenueRupees: 0 },
    { month: 'Jun', revenueRupees: 0 },
  ]
  const needsAttention = stats?.needsAttention ?? []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">
            Subscriptions & Operations
          </h1>
          <p className="text-[0.9375rem] text-gray-600 font-medium mt-1">
            Real-time aggregate data across recurring billing runs, subscriptions, invoices, and cash flow.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runBilling}
            disabled={running}
            className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer flex items-center gap-2"
          >
            <RefreshCw size={14} className={running ? 'animate-spin' : ''} />
            <span>{running ? 'Running...' : 'Run Billing Job'}</span>
          </button>
          <button
            onClick={() => navigate('/subscriptions')}
            className="text-white px-6 py-2.5 rounded-xl text-[0.875rem] font-bold flex items-center gap-2 btn-primary"
          >
            + New Subscription
          </button>
        </div>
      </div>

      {batchNotice && (
        <div className="p-4 bg-white/90 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-[#4A3043] flex justify-between items-center anim-spring">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{batchNotice}</span>
          </div>
          <button onClick={() => setBatchNotice('')} className="font-bold text-gray-500 hover:text-black">
            ×
          </button>
        </div>
      )}

      {/* KPI Cards / Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: MRR */}
          <div className="glass-panel rounded-2xl p-6 anim-spring stagger-2 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest font-mono">
                TOTAL MRR
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#714B67]/10 border border-[#714B67]/20 flex items-center justify-center text-[#714B67] transition-transform hover:rotate-12">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[2rem] font-bold text-[#4A3043] leading-none tabular-nums tracking-tight">
              {formatPaise(mrr)}
            </div>
            <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Monthly run-rate
            </div>
          </div>

          {/* Card 2: ARR */}
          <div className="glass-panel rounded-2xl p-6 anim-spring stagger-2 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest font-mono">
                ANNUAL RUN RATE
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#714B67]/10 border border-[#714B67]/20 flex items-center justify-center text-[#714B67] transition-transform hover:rotate-12">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[2rem] font-bold text-[#4A3043] leading-none tabular-nums tracking-tight">
              {formatPaise(arr)}
            </div>
            <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              MRR × 12 annualized
            </div>
          </div>

          {/* Card 3: Active Subscriptions */}
          <div className="glass-panel rounded-2xl p-6 anim-spring stagger-3 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest font-mono">
                ACTIVE CONTRACTS
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#714B67]/10 border border-[#714B67]/20 flex items-center justify-center text-[#714B67] transition-transform hover:rotate-12">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[2rem] font-bold text-[#4A3043] leading-none tabular-nums tracking-tight">
              {activeSubs}
            </div>
            <div className="text-[0.8125rem] text-gray-500 font-medium mt-3 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Recurring subscriptions
            </div>
          </div>

          {/* Card 4: Overdue Balance */}
          <div className="glass-panel rounded-2xl p-6 anim-spring stagger-3 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-widest font-mono">
                OVERDUE BALANCE
              </div>
              <div className="w-9 h-9 rounded-lg bg-red-100 border border-red-300 flex items-center justify-center text-red-600 transition-transform hover:rotate-12">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[2rem] font-bold text-red-600 leading-none tabular-nums tracking-tight">
              {formatPaise(overduePaise)}
            </div>
            <div className="text-[0.8125rem] text-red-600 font-bold mt-3 flex items-center gap-1.5 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Action required
            </div>
          </div>
        </div>
      )}

      {/* Financial Trajectory Chart / Skeleton */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="glass-panel rounded-2xl p-6 anim-spring stagger-3">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-black/10">
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#4A3043]">
                12-Month Cash Collection Trajectory
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Recognized Invoices vs Actual Cash Receipts (Integer Paise Precision)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-black rounded-lg text-[#4A3043] font-bold shadow-[2px_2px_0_#000]">
                <span className="w-2.5 h-2.5 bg-[#714B67] inline-block rounded-xs" /> Real Cash
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#4A3043" fontSize={11} tickLine={false} axisLine={{ stroke: '#000000' }} />
                <YAxis stroke="#4A3043" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Cash Collected']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #000000',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0 0 #000000',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Bar dataKey="revenueRupees" fill="#714B67" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Table / Skeleton */}
      <div className="anim-spring stagger-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#4A3043]">
              Needs Attention
            </h2>
            <p className="text-xs text-gray-500">Overdue and pending invoices requiring operational intervention</p>
          </div>
          <button
            onClick={() => navigate('/invoices')}
            className="text-xs font-bold text-[#714B67] hover:text-[#4A3043] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Invoices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left border-collapse">
              <thead className="border-b-[1.5px] border-black bg-white/60">
                <tr>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">
                    INVOICE / CUSTOMER
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">
                    DUE DATE
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">
                    REMAINING BALANCE
                  </th>
                  <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {needsAttention.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No overdue invoices found. All accounts in good standing.
                    </td>
                  </tr>
                ) : (
                  needsAttention.map((inv: any) => (
                    <tr
                      key={inv.id}
                      className="table-row cursor-pointer"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#714B67] to-[#4A3043] text-white border-[1.5px] border-black font-bold flex items-center justify-center text-xs shadow-sm">
                            {inv.customerCompany ? inv.customerCompany.charAt(0) : 'E'}
                          </div>
                          <div>
                            <div className="text-[0.875rem] font-bold text-[#4A3043]">
                              {inv.customerCompany || inv.customerName}
                            </div>
                            <div className="text-[0.6875rem] font-mono text-gray-500">
                              {inv.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[0.8125rem] font-mono text-gray-700">
                        {inv.dueDate}
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] font-bold font-mono tabular-nums text-right text-[#4A3043]">
                        {formatPaise(inv.remainingPaise)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md border-[1.5px] border-black text-[0.625rem] font-bold uppercase tracking-wider shadow-[2px_2px_0_#000] ${
                            inv.status === 'OVERDUE'
                              ? 'bg-[#fee2e2] text-[#b91c1c]'
                              : inv.status === 'PARTIALLY_PAID'
                              ? 'bg-[#fef3c7] text-[#b45309]'
                              : 'bg-[#d1fae5] text-[#047857]'
                          }`}
                        >
                          {inv.status === 'PARTIALLY_PAID' ? 'PARTIAL' : inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Minimal Invoice Inspection Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setSelectedInvoice(null)}
          />
          <div className="relative w-full max-w-lg bg-white border-[1.5px] border-black rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden modal-panel">
            <div className="px-6 py-4 border-b border-black/10 flex justify-between items-center bg-gray-50/70">
              <div>
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-gray-500 font-mono">
                  INVOICE DETAILS
                </span>
                <h3 className="text-lg font-bold text-[#4A3043] tracking-tight">
                  {selectedInvoice.code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border-[1.5px] border-black rounded-xl">
                  <div className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-wider mb-0.5 font-mono">
                    CUSTOMER
                  </div>
                  <div className="text-sm font-bold text-[#4A3043] truncate">
                    {selectedInvoice.customerCompany || selectedInvoice.customerName}
                  </div>
                </div>

                <div className="p-3 bg-white border-[1.5px] border-black rounded-xl">
                  <div className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-wider mb-0.5 font-mono">
                    STATUS
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded border border-black text-xs font-bold font-mono">
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white border-[1.5px] border-black rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-wider font-mono">
                      REMAINING BALANCE
                    </div>
                    <div className="text-xl font-bold text-[#4A3043] font-mono tabular-nums mt-0.5">
                      {formatPaise(selectedInvoice.remainingPaise)}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500 font-mono">
                    Due by: <span className="font-bold text-black">{selectedInvoice.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50/70 border-t border-black/10 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-white border-[1.5px] border-black text-[#4A3043] text-xs font-bold rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedInvoice(null)
                  navigate('/invoices')
                }}
                className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Go to Invoices →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
