import { useState } from 'react'
import { CUSTOMERS, SUBSCRIPTIONS, INVOICES, PAYMENTS, PLANS, formatPaise } from '../data/seed'
import { Badge } from '../components/ui'
import { ShieldCheck, Download, ArrowLeft, RefreshCw, X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CustomerPortalPage() {
  const navigate = useNavigate()
  // Scoped to customer CUS-001 (Zoho Corp India)
  const customer = CUSTOMERS[0]
  const mySubs = SUBSCRIPTIONS.filter(s => s.customerId === customer.id)
  const myInvs = INVOICES.filter(i => i.customerId === customer.id)
  const myPays = PAYMENTS.filter(p => p.customerId === customer.id)

  const [activeTab, setActiveTab] = useState<'subs' | 'invoices' | 'payments'>('subs')
  const [toast, setToast] = useState('')

  const outstanding = myInvs
    .filter(i => i.state !== 'PAID' && i.state !== 'CANCELLED')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0)

  const handleAction = (planId: string, action: 'pause' | 'close') => {
    const plan = PLANS.find(p => p.id === planId)
    if (action === 'pause' && plan && !plan.allowPause) {
      setToast('ACTION BLOCKED: PAUSE NOT ALLOWED ON THIS PLAN')
      setTimeout(() => setToast(''), 4000)
      return
    }
    setToast(`Requested ${action.toUpperCase()} on subscription. Processed successfully.`)
    setTimeout(() => setToast(''), 4000)
  }

  return (
    <div className="min-h-screen bg-[#f7f5f8] text-gray-900 flex flex-col items-center relative overflow-hidden select-none">
      <div className="bg-layer" />
      <div className="bg-glow" />

      {/* Top Header */}
      <header className="w-full border-b-[1.5px] border-black bg-white/60 backdrop-blur-xl h-20 flex items-center justify-between px-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base glass-odoo">
            P
          </div>
          <div>
            <span className="font-bold text-base text-[#4A3043]">PeoplePay360</span>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider ml-2 font-bold">
              Customer Self-Service
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-[#4A3043] font-bold">{customer.company} ({customer.code})</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white border-[1.5px] border-black rounded-xl font-bold text-[#4A3043] flex items-center gap-2 hover:shadow-[2px_2px_0_#000] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Operations
          </button>
        </div>
      </header>

      {toast && (
        <div className="w-full max-w-4xl mt-6 px-4 relative z-10">
          <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-[#4A3043] flex justify-between items-center anim-spring">
            <span>{toast}</span>
            <button onClick={() => setToast('')} className="font-bold cursor-pointer">×</button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-4xl px-4 py-8 space-y-6 relative z-10 anim-spring">
        {/* Account Banner */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-gray-500 tracking-wider">
              CLIENT WORKSPACE
            </span>
            <h1 className="text-3xl font-bold text-[#4A3043] tracking-tight mt-1">{customer.company}</h1>
            <p className="text-xs font-mono text-gray-600 mt-1">
              Authorized Representative: {customer.name} · GSTIN: {customer.gstin}
            </p>
          </div>

          <div className="p-4 bg-white/90 border-[1.5px] border-black rounded-2xl shadow-xs text-right font-mono min-w-[200px]">
            <span className="text-[10px] uppercase font-bold text-gray-500">Outstanding Balance</span>
            <p className="text-2xl font-bold text-red-600 tabular-nums mt-0.5">
              {formatPaise(outstanding)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('subs')}
            className={`px-4 py-2 rounded-xl border-[1.5px] border-black font-bold transition-all cursor-pointer ${
              activeTab === 'subs' ? 'glass-odoo text-white shadow-[2px_2px_0_#000]' : 'bg-white text-gray-700'
            }`}
          >
            My Subscriptions ({mySubs.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl border-[1.5px] border-black font-bold transition-all cursor-pointer ${
              activeTab === 'invoices' ? 'glass-odoo text-white shadow-[2px_2px_0_#000]' : 'bg-white text-gray-700'
            }`}
          >
            My Invoices ({myInvs.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl border-[1.5px] border-black font-bold transition-all cursor-pointer ${
              activeTab === 'payments' ? 'glass-odoo text-white shadow-[2px_2px_0_#000]' : 'bg-white text-gray-700'
            }`}
          >
            Settled Receipts ({myPays.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'subs' && (
          <div className="space-y-4">
            {mySubs.map(s => {
              const plan = PLANS.find(p => p.id === s.planId)
              return (
                <div key={s.id} className="glass-panel rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#714B67]">{s.number}</span>
                      <Badge variant={s.state === 'ACTIVE' ? 'ok' : 'warn'}>{s.state}</Badge>
                    </div>
                    <h3 className="font-bold text-[#4A3043] text-lg">{plan?.name}</h3>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      Billing Cycle: Every 30 Days · Next Charge: {s.nextBillingAt}
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-xl font-bold text-[#4A3043]">{formatPaise(s.totalAmount)}</p>
                    <p className="text-[10px] text-gray-400">per cycle (incl. GST)</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="border-b-[1.5px] border-black bg-white/60">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">INVOICE</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">DATE</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">DUE DATE</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800 text-right">TOTAL</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {myInvs.map(i => (
                  <tr key={i.id} className="table-row">
                    <td className="px-6 py-4 font-bold text-[#4A3043]">{i.number}</td>
                    <td className="px-6 py-4 text-gray-500">{i.issueDate}</td>
                    <td className="px-6 py-4 text-gray-500">{i.dueDate}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#4A3043]">{formatPaise(i.total)}</td>
                    <td className="px-6 py-4 text-right"><Badge variant={i.state === 'PAID' ? 'ok' : 'bad'}>{i.state}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="border-b-[1.5px] border-black bg-white/60">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">RECEIPT</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">METHOD</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">REFERENCE</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800">DATE</th>
                  <th className="px-6 py-4 font-bold uppercase text-gray-800 text-right">AMOUNT PAID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {myPays.map(p => (
                  <tr key={p.id} className="table-row">
                    <td className="px-6 py-4 font-bold text-[#4A3043]">{p.number}</td>
                    <td className="px-6 py-4"><Badge variant="ok">{p.method}</Badge></td>
                    <td className="px-6 py-4 text-gray-600">{p.reference}</td>
                    <td className="px-6 py-4 text-gray-500">{p.paidAt}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-700">{formatPaise(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
