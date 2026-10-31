import { useState } from 'react'
import { CUSTOMERS, SUBSCRIPTIONS, INVOICES, PAYMENTS, PLANS, formatPaise } from '../data/seed'
import { Badge } from '../components/ui'
import { ShieldCheck, Download, AlertTriangle, ArrowLeft, RefreshCw, Pause, Play, Check } from 'lucide-react'
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col items-center">
      {/* Customer Portal Top Bar */}
      <header className="w-full border-b border-[var(--line)] bg-white h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[var(--ink)] rounded flex items-center justify-center font-mono text-white font-bold text-sm">
            B
          </div>
          <div>
            <span className="font-bold text-sm">Brightloop</span>
            <span className="text-[10px] font-mono text-[var(--ink-40)] uppercase ml-2">Customer Self-Service</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[var(--ink-60)]">{customer.company} ({customer.code})</span>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1 text-[var(--accent)] hover:underline"
          >
            <ArrowLeft size={12} /> Staff Console
          </button>
        </div>
      </header>

      {toast && (
        <div className="w-full max-w-4xl mt-4 px-4">
          <div className="p-3 bg-zinc-900 text-white text-xs font-mono rounded flex justify-between items-center shadow-md">
            <span>{toast}</span>
            <button onClick={() => setToast('')} className="cursor-pointer">×</button>
          </div>
        </div>
      )}

      {/* Centered 960px Column (per spec §7.12) */}
      <main className="w-full max-w-[960px] p-6 space-y-6">
        {/* Account Header */}
        <div className="border border-[var(--line-strong)] bg-white p-6 rounded-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--accent)]">
                AUTHENTICATED CUSTOMER SESSION
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
                {customer.company}
              </h1>
              <p className="text-xs text-[var(--ink-60)] font-mono mt-1">
                GSTIN: {customer.gstin} · Account Lead: {customer.name} ({customer.email})
              </p>
            </div>

            <div className="p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded text-right font-mono">
              <span className="text-[10px] text-[var(--ink-40)] uppercase">Current Outstanding Balance</span>
              <p className={`text-xl font-bold mt-0.5 ${outstanding > 0 ? 'text-[var(--warn)]' : 'text-[var(--ok)]'}`}>
                {outstanding > 0 ? formatPaise(outstanding) : '₹0.00 (All Clear)'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--line-strong)] gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('subs')}
            className={`py-2 px-4 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'subs'
                ? 'border-[var(--line-strong)] text-[var(--ink)] bg-white'
                : 'border-transparent text-[var(--ink-40)]'
            }`}
          >
            My Subscriptions ({mySubs.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-2 px-4 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'invoices'
                ? 'border-[var(--line-strong)] text-[var(--ink)] bg-white'
                : 'border-transparent text-[var(--ink-40)]'
            }`}
          >
            Invoices & Tax Receipts ({myInvs.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-4 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'payments'
                ? 'border-[var(--line-strong)] text-[var(--ink)] bg-white'
                : 'border-transparent text-[var(--ink-40)]'
            }`}
          >
            Payment History ({myPays.length})
          </button>
        </div>

        {/* Tab 1: Subscriptions */}
        {activeTab === 'subs' && (
          <div className="space-y-4">
            {mySubs.map(s => {
              const plan = PLANS.find(p => p.id === s.planId)
              return (
                <div key={s.id} className="border border-[var(--line)] bg-white p-5 rounded-sm font-mono text-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[var(--ink)]">{s.number}</span>
                        <Badge variant={s.state === 'ACTIVE' ? 'ok' : 'warn'}>{s.state}</Badge>
                      </div>
                      <p className="text-xs text-[var(--ink-60)] mt-1 font-sans">{plan?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--ink-40)] uppercase">Recurring Charge</span>
                      <p className="text-lg font-bold text-[var(--ink)]">{formatPaise(s.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-[var(--surface-2)] rounded text-[11px]">
                    <div>
                      <span className="text-[var(--ink-40)]">Start Date:</span>
                      <p className="font-bold">{s.startDate}</p>
                    </div>
                    <div>
                      <span className="text-[var(--ink-40)]">Expiry Date:</span>
                      <p className="font-bold">{s.expiryDate}</p>
                    </div>
                    <div>
                      <span className="text-[var(--ink-40)]">Next Scheduled Invoice:</span>
                      <p className="font-bold text-[var(--accent)]">{s.nextBillingAt}</p>
                    </div>
                  </div>

                  {/* Self-Serve Policy Gated Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--line)]">
                    <button
                      onClick={() => handleAction(s.planId, 'pause')}
                      className="px-3 py-1.5 border border-[var(--line)] hover:border-[var(--line-strong)] rounded text-xs font-semibold bg-white flex items-center gap-1 cursor-pointer"
                    >
                      <Pause size={12} /> Pause Contract
                    </button>
                    <button
                      onClick={() => handleAction(s.planId, 'close')}
                      className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded text-xs font-semibold bg-white cursor-pointer"
                    >
                      Close Early
                    </button>
                    <button
                      onClick={() => setToast('Renewal request logged with sales representative.')}
                      className="px-3 py-1.5 bg-[var(--accent)] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Request Plan Upgrade
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tab 2: Invoices */}
        {activeTab === 'invoices' && (
          <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
                  <th className="px-4 py-3">INVOICE NO</th>
                  <th className="px-4 py-3">BILLING CYCLE</th>
                  <th className="px-4 py-3">DUE DATE</th>
                  <th className="px-4 py-3 text-right">TOTAL</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3 text-right">DOCUMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {myInvs.map(inv => (
                  <tr key={inv.id} className="hover:bg-[var(--surface-2)]">
                    <td className="px-4 py-3 font-bold">{inv.number}</td>
                    <td className="px-4 py-3 text-[var(--ink-60)]">{inv.periodStart} → {inv.periodEnd}</td>
                    <td className="px-4 py-3">{inv.dueDate}</td>
                    <td className="px-4 py-3 text-right font-bold">{formatPaise(inv.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={inv.state === 'PAID' ? 'ok' : 'warn'}>{inv.state}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="text-[10px] text-[var(--accent)] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={11} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === 'payments' && (
          <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
                  <th className="px-4 py-3">PAYMENT REF</th>
                  <th className="px-4 py-3">METHOD</th>
                  <th className="px-4 py-3">DATE</th>
                  <th className="px-4 py-3">TRANSACTION REF</th>
                  <th className="px-4 py-3 text-right">AMOUNT SETTLED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {myPays.map(p => (
                  <tr key={p.id} className="hover:bg-[var(--surface-2)]">
                    <td className="px-4 py-3 font-bold">{p.number}</td>
                    <td className="px-4 py-3 text-[var(--ink-60)]">{p.method}</td>
                    <td className="px-4 py-3 text-[var(--ink-40)]">{p.paidAt}</td>
                    <td className="px-4 py-3 text-[var(--ink-40)]">{p.reference}</td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--ok)]">
                      {formatPaise(p.amount)}
                    </td>
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

