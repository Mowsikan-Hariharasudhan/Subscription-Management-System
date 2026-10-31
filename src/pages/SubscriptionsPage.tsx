import { useState } from 'react'
import { SUBSCRIPTIONS, CUSTOMERS, PLANS, formatPaise, type Subscription, type SubscriptionState } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Play, Pause, RefreshCw, XCircle, X, ShieldAlert, Check } from 'lucide-react'

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
    setTimeout(() => setToastNotice(''), 4000)
  }

  // State Machine Transitions
  const handlePause = (id: string) => {
    const sub = subs.find(s => s.id === id)
    const plan = PLANS.find(p => p.id === sub?.planId)

    if (plan && !plan.allowPause) {
      notify('POLICY VIOLATION: Pausing is disabled by plan terms.')
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
      notify('POLICY VIOLATION: Early closure prohibited on this annual contract.')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Subscriptions Engine</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Finite State Transitions · Automated Recurring Invoicing Pipeline
          </p>
        </div>
        <Btn variant="primary" size="md">
          + New Subscription
        </Btn>
      </div>

      {toastNotice && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-[#4A3043] flex justify-between items-center anim-spring">
          <span className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-500" />
            {toastNotice}
          </span>
          <button onClick={() => setToastNotice('')} className="font-bold text-gray-500 hover:text-black cursor-pointer">×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center anim-spring stagger-2">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search contract or company..." />
          <div className="flex border-[1.5px] border-black rounded-xl bg-white p-1 text-xs font-mono shadow-[2px_2px_0_#000] overflow-x-auto">
            {(['ALL', 'ACTIVE', 'PAUSED', 'CONFIRMED', 'CLOSED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStateFilter(st as any)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  stateFilter === st
                    ? 'glass-odoo text-white font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-gray-500">
          Showing {filtered.length} subscriptions
        </span>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
        <table className="w-full text-left border-collapse">
          <thead className="border-b-[1.5px] border-black bg-white/60">
            <tr>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CONTRACT</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CUSTOMER</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">PLAN</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">STATE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">MRR (PAISE)</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">NEXT INVOICE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {filtered.map(s => {
              const cust = CUSTOMERS.find(c => c.id === s.customerId)
              const plan = PLANS.find(p => p.id === s.planId)
              return (
                <tr
                  key={s.id}
                  onClick={() => setSelectedSub(s)}
                  className="table-row cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{s.number}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#4A3043] text-sm">{cust?.company || cust?.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{s.startDate} - {s.expiryDate}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-700">{plan?.name || 'ERP Plan'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={s.state === 'ACTIVE' ? 'ok' : s.state === 'PAUSED' ? 'warn' : 'neutral'}>
                      {s.state}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold font-mono text-[#4A3043]">{formatPaise(s.mrr)}</td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-[#714B67]">{s.nextBillingAt}</td>
                  <td className="px-6 py-4 text-right space-x-2 font-mono text-xs">
                    {s.state === 'ACTIVE' && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handlePause(s.id)
                        }}
                        className="font-bold text-amber-700 hover:underline cursor-pointer"
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
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
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
                        className="font-bold text-red-600 hover:underline cursor-pointer"
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

      {/* Subscription Drawer Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#4A3043]/60 backdrop-blur-md modal-backdrop"
            onClick={() => setSelectedSub(null)}
          />
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl h-full shadow-[0_20px_60px_-10px_rgba(113,75,103,0.5)] flex flex-col border-l-[1.5px] border-black z-10 anim-spring">
            {/* Drawer Header */}
            <div className="p-6 border-b-[1.5px] border-black flex justify-between items-start bg-white/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#714B67]">{selectedSub.number}</span>
                  <Badge variant={selectedSub.state === 'ACTIVE' ? 'ok' : 'warn'}>{selectedSub.state}</Badge>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#4A3043]">
                  Subscription Contract Agreement
                </h2>
                <p className="text-xs font-mono text-gray-500 mt-0.5">
                  Start: {selectedSub.startDate} · Expiry: {selectedSub.expiryDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="w-8 h-8 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5 font-mono text-xs">
              <div className="p-4 border-[1.5px] border-black rounded-xl bg-white shadow-xs space-y-2">
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Financial Breakdown</p>
                <div className="flex justify-between py-1 border-b border-black/10">
                  <span className="text-gray-500">Total Recurring Price</span>
                  <span className="font-bold text-[#4A3043]">{formatPaise(selectedSub.totalAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/10">
                  <span className="text-gray-500">Normalized MRR</span>
                  <span className="font-bold text-[#4A3043]">{formatPaise(selectedSub.mrr)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Next Scheduled Billing</span>
                  <span className="font-bold text-emerald-700">{selectedSub.nextBillingAt}</span>
                </div>
              </div>

              {/* State Controls */}
              <div className="p-4 border-[1.5px] border-black rounded-xl bg-white shadow-xs space-y-3">
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Lifecycle Actions</p>
                <div className="flex gap-2">
                  {selectedSub.state === 'ACTIVE' && (
                    <button
                      onClick={() => handlePause(selectedSub.id)}
                      className="px-4 py-2 border-[1.5px] border-black rounded-xl font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 shadow-[2px_2px_0_#000] cursor-pointer"
                    >
                      Pause Subscription
                    </button>
                  )}
                  {selectedSub.state === 'PAUSED' && (
                    <button
                      onClick={() => handleResume(selectedSub.id)}
                      className="px-4 py-2 border-[1.5px] border-black rounded-xl font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 shadow-[2px_2px_0_#000] cursor-pointer"
                    >
                      Resume Subscription
                    </button>
                  )}
                  {selectedSub.state !== 'CLOSED' && (
                    <button
                      onClick={() => handleCloseEarly(selectedSub.id)}
                      className="px-4 py-2 border-[1.5px] border-black rounded-xl font-bold text-red-800 bg-red-50 hover:bg-red-100 shadow-[2px_2px_0_#000] cursor-pointer"
                    >
                      Terminate Contract
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t-[1.5px] border-black bg-white/80 flex justify-end">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
