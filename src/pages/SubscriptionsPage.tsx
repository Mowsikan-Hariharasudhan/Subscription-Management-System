import { useState } from 'react'
import { SUBSCRIPTIONS, CUSTOMERS, PLANS, formatPaise, type Subscription, type SubscriptionState } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Play, Pause, RefreshCw, XCircle, ArrowUpRight, Check, X, ShieldAlert } from 'lucide-react'

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(SUBSCRIPTIONS)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<'ALL' | SubscriptionState>('ALL')
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [toastNotice, setToastNotice] = useState('')

  const filtered = subs.filter(s => {
    const cust = CUSTOMERS.find(c => c.id === s.customerId)
    const matchesSearch =
      s.number.toLowerCase().includes(search.toLowerCase()) ||
      cust?.company.toLowerCase().includes(search.toLowerCase()) ||
      cust?.name.toLowerCase().includes(search.toLowerCase())
    const matchesState = stateFilter === 'ALL' || s.state === stateFilter
    return matchesSearch && matchesState
  })

  const notify = (msg: string) => {
    setToastNotice(msg)
    setTimeout(() => setToastNotice(''), 3000)
  }

  // State Machine Transitions
  const handlePause = (id: string) => {
    const sub = subs.find(s => s.id === id)
    const plan = PLANS.find(p => p.id === sub?.planId)

    if (plan && !plan.allowPause) {
      notify('POLICY VIOLATION: Pause is strictly prohibited on this plan tier.')
      return
    }

    setSubs(prev =>
      prev.map(s => (s.id === id ? { ...s, state: 'PAUSED', mrr: 0 } : s))
    )
    if (selectedSub?.id === id) {
      setSelectedSub(prev => prev ? { ...prev, state: 'PAUSED', mrr: 0 } : null)
    }
    notify(`Subscription ${sub?.number} status transitioned to PAUSED.`)
  }

  const handleResume = (id: string) => {
    setSubs(prev =>
      prev.map(s => (s.id === id ? { ...s, state: 'ACTIVE', mrr: s.totalAmount } : s))
    )
    if (selectedSub?.id === id) {
      setSelectedSub(prev => prev ? { ...prev, state: 'ACTIVE', mrr: prev.totalAmount } : null)
    }
    notify(`Subscription resumed to ACTIVE state. Billing scheduled.`)
  }

  const handleCloseEarly = (id: string) => {
    const sub = subs.find(s => s.id === id)
    const plan = PLANS.find(p => p.id === sub?.planId)

    if (plan && !plan.allowEarlyClose) {
      notify('POLICY VIOLATION: Early closure not allowed on this annual contract.')
      return
    }

    setSubs(prev =>
      prev.map(s => (s.id === id ? { ...s, state: 'CLOSED', mrr: 0 } : s))
    )
    if (selectedSub?.id === id) {
      setSelectedSub(prev => prev ? { ...prev, state: 'CLOSED', mrr: 0 } : null)
    }
    notify(`Subscription closed early. Contract terminated and audit logged.`)
  }

  const handleRenew = (id: string) => {
    setSubs(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            state: 'ACTIVE',
            expiryDate: '2028-01-01',
            mrr: s.totalAmount,
          }
        }
        return s
      })
    )
    notify('Subscription contract renewed for another 12-month billing window.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Subscriptions Engine</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Finite State Machine: Draft → Quotation → Confirmed → Active → Closed (Paused)
          </p>
        </div>
      </div>

      {toastNotice && (
        <div className="p-3 bg-zinc-900 text-white text-xs font-mono rounded flex justify-between items-center shadow-lg border border-[var(--line-strong)]">
          <span className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-yellow-400" />
            {toastNotice}
          </span>
          <button onClick={() => setToastNotice('')} className="text-zinc-400 hover:text-white cursor-pointer">×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search subscription number..." />
          <div className="flex border border-[var(--line)] rounded bg-white p-0.5 text-xs font-mono overflow-x-auto max-w-md">
            {(['ALL', 'ACTIVE', 'PAUSED', 'CONFIRMED', 'CLOSED', 'EXPIRED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStateFilter(st)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  stateFilter === st ? 'bg-[var(--line-strong)] text-white font-bold' : 'text-[var(--ink-60)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-[var(--ink-40)]">
          Showing {filtered.length} subscriptions
        </span>
      </div>

      {/* Table */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">NUMBER</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">PLAN</th>
              <th className="px-4 py-3">STATE</th>
              <th className="px-4 py-3">START DATE</th>
              <th className="px-4 py-3">EXPIRY</th>
              <th className="px-4 py-3 text-right">MRR (PAISE)</th>
              <th className="px-4 py-3">NEXT INVOICE</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(s => {
              const cust = CUSTOMERS.find(c => c.id === s.customerId)
              const plan = PLANS.find(p => p.id === s.planId)
              return (
                <tr
                  key={s.id}
                  onClick={() => setSelectedSub(s)}
                  className="hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">{s.number}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--ink)] max-w-[140px] truncate">
                    {cust?.company || cust?.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-60)]">{plan?.name || 'ERP Plan'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.state === 'ACTIVE' ? 'ok' : s.state === 'PAUSED' ? 'warn' : s.state === 'CLOSED' ? 'neutral' : 'bad'}>
                      {s.state}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-40)]">{s.startDate}</td>
                  <td className="px-4 py-3 text-[var(--ink-40)]">{s.expiryDate}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--ink)]">{formatPaise(s.mrr)}</td>
                  <td className="px-4 py-3 text-[var(--accent)] font-semibold">{s.nextBillingAt}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {s.state === 'ACTIVE' && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handlePause(s.id)
                        }}
                        className="text-[10px] font-bold text-yellow-700 hover:underline"
                      >
                        Pause
                      </button>
                    )}
                    {s.state === 'PAUSED' && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleResume(s.id)
                        }}
                        className="text-[10px] font-bold text-green-700 hover:underline"
                      >
                        Resume
                      </button>
                    )}
                    {s.state !== 'CLOSED' && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleCloseEarly(s.id)
                        }}
                        className="text-[10px] font-bold text-red-700 hover:underline"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Subscription Detail 2-Column Slide-Over */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[var(--line-strong)]">
            <div className="p-6 border-b border-[var(--line)] flex justify-between items-start bg-[var(--surface-2)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">{selectedSub.number}</span>
                  <Badge variant={selectedSub.state === 'ACTIVE' ? 'ok' : 'warn'}>{selectedSub.state}</Badge>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] mt-1">
                  Contract Agreement Specification
                </h2>
                <p className="text-xs font-mono text-[var(--ink-40)]">
                  Customer ID: {selectedSub.customerId} · Plan: {selectedSub.planId}
                </p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 rounded hover:bg-zinc-200 text-[var(--ink-60)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2-Column Detail Layout */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              {/* Left Rail: Contract parameters & lines (2 Cols) */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 border border-[var(--line)] rounded bg-[var(--surface-2)] space-y-2">
                  <p className="text-[10px] uppercase font-bold text-[var(--ink-40)]">Billing & Schedule</p>
                  <div className="flex justify-between py-1 border-b border-[var(--line)]">
                    <span className="text-[var(--ink-60)]">Contract Start Date</span>
                    <span className="font-bold">{selectedSub.startDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--line)]">
                    <span className="text-[var(--ink-60)]">Expiry Date</span>
                    <span className="font-bold">{selectedSub.expiryDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--line)]">
                    <span className="text-[var(--ink-60)]">Next Recurring Billing Date</span>
                    <span className="font-bold text-[var(--accent)]">{selectedSub.nextBillingAt}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--ink-60)]">Payment Terms</span>
                    <span>NET 15 Days</span>
                  </div>
                </div>

                <div className="p-4 border border-[var(--line)] rounded bg-white space-y-2">
                  <p className="text-[10px] uppercase font-bold text-[var(--ink-40)]">Audit Trail Log Activity</p>
                  <div className="space-y-1.5 text-[11px] text-[var(--ink-60)]">
                    <p>• 2026-10-31 09:30: State transitioned to {selectedSub.state} by Admin</p>
                    <p>• 2026-09-01 00:00: Automatic billing cycle executed (paise safe)</p>
                    <p>• 2025-02-10 14:22: Subscription created from Quotation QTN-001</p>
                  </div>
                </div>
              </div>

              {/* Right Rail: Financial Actions (1 Col) */}
              <div className="space-y-4 border-l md:border-l border-[var(--line)] md:pl-4">
                <div className="p-3 border border-[var(--line-strong)] bg-[var(--surface-2)] rounded">
                  <span className="text-[10px] uppercase text-[var(--ink-40)] font-bold">MRR Value</span>
                  <p className="text-xl font-bold text-[var(--ink)] mt-0.5">{formatPaise(selectedSub.mrr)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-[var(--ink-40)]">Permitted Actions</p>

                  {selectedSub.state === 'ACTIVE' && (
                    <button
                      onClick={() => handlePause(selectedSub.id)}
                      className="w-full py-2 px-3 border border-yellow-600 bg-yellow-50 text-yellow-900 font-bold rounded flex items-center justify-center gap-1.5 hover:bg-yellow-100 transition-colors"
                    >
                      <Pause size={13} /> Pause Subscription
                    </button>
                  )}

                  {selectedSub.state === 'PAUSED' && (
                    <button
                      onClick={() => handleResume(selectedSub.id)}
                      className="w-full py-2 px-3 border border-green-600 bg-green-50 text-green-900 font-bold rounded flex items-center justify-center gap-1.5 hover:bg-green-100 transition-colors"
                    >
                      <Play size={13} /> Resume Subscription
                    </button>
                  )}

                  <button
                    onClick={() => handleRenew(selectedSub.id)}
                    className="w-full py-2 px-3 border border-[var(--line-strong)] bg-white text-[var(--ink)] font-bold rounded flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <RefreshCw size={13} /> Renew Contract
                  </button>

                  <button
                    onClick={() => handleCloseEarly(selectedSub.id)}
                    disabled={selectedSub.state === 'CLOSED'}
                    className="w-full py-2 px-3 border border-red-300 bg-red-50 text-red-900 font-bold rounded flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors disabled:opacity-40"
                  >
                    <XCircle size={13} /> Close Contract Early
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

