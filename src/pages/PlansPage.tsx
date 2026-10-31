import { useState } from 'react'
import { PLANS, PRODUCTS, formatPaise, type Plan } from '../data/seed'
import { Badge, Btn, FlagBadge, SearchInput } from '../components/ui'
import { Plus, Lock } from 'lucide-react'
import { useAuth } from '../auth'

export default function PlansPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [plansList, setPlansList] = useState<Plan[]>(PLANS)
  const [search, setSearch] = useState('')
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'D' | 'W' | 'M' | 'Y'>('ALL')

  const filtered = plansList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
    const matchesPeriod = periodFilter === 'ALL' || p.billingPeriod === periodFilter
    return matchesSearch && matchesPeriod
  })

  const toggleFlag = (planId: string, flag: 'autoCloseOnEnd' | 'allowEarlyClose' | 'allowPause' | 'allowRenew') => {
    if (!isAdmin) return
    setPlansList(prev =>
      prev.map(p => {
        if (p.id === planId) {
          return { ...p, [flag]: !p[flag] }
        }
        return p
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Subscription Plans</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Recurrence Schedules & Policy Flags · {isAdmin ? 'Administrator Access' : 'Staff Read-Only'}
          </p>
        </div>

        {isAdmin ? (
          <Btn variant="primary" size="md">
            <Plus size={15} strokeWidth={2.5} /> Create Plan
          </Btn>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-black bg-white text-gray-500 text-xs font-mono rounded-xl shadow-xs">
            <Lock size={12} /> Staff Protected
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center anim-spring stagger-2">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search plans..." />
          <div className="flex border-[1.5px] border-black rounded-xl bg-white p-1 text-xs font-mono shadow-[2px_2px_0_#000]">
            {(['ALL', 'D', 'W', 'M', 'Y'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodFilter(p)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  periodFilter === p
                    ? 'glass-odoo text-white font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {p === 'ALL' ? 'ALL' : p === 'D' ? 'DAILY' : p === 'W' ? 'WEEKLY' : p === 'M' ? 'MONTHLY' : 'ANNUAL'}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-gray-500">{filtered.length} active plans</span>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
        <table className="w-full text-left border-collapse">
          <thead className="border-b-[1.5px] border-black bg-white/60">
            <tr>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CODE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">PLAN NAME</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">PRODUCT</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CYCLE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">PRICE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-center">POLICY FLAGS</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {filtered.map(pl => {
              const prod = PRODUCTS.find(p => p.id === pl.productId)
              return (
                <tr key={pl.id} className="table-row">
                  <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{pl.code}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[#4A3043]">{pl.name}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">{prod?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 border-[1.5px] border-black rounded-md bg-white font-bold text-[10px] font-mono shadow-[1px_1px_0_#000]">
                      {pl.billingPeriod === 'D' ? 'DAILY' : pl.billingPeriod === 'W' ? 'WEEKLY' : pl.billingPeriod === 'M' ? 'MONTHLY' : 'ANNUAL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-sm font-mono text-[#4A3043]">
                    {formatPaise(pl.price)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-white/70 border-[1.5px] border-black">
                      <button
                        onClick={() => toggleFlag(pl.id, 'autoCloseOnEnd')}
                        disabled={!isAdmin}
                        title="Auto-close on end"
                        className="cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FlagBadge on={pl.autoCloseOnEnd} label="AUTOCLOSE" />
                      </button>
                      <button
                        onClick={() => toggleFlag(pl.id, 'allowEarlyClose')}
                        disabled={!isAdmin}
                        title="Allow early cancellation"
                        className="cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FlagBadge on={pl.allowEarlyClose} label="EARLYCLOSE" />
                      </button>
                      <button
                        onClick={() => toggleFlag(pl.id, 'allowPause')}
                        disabled={!isAdmin}
                        title="Allow customer pause"
                        className="cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FlagBadge on={pl.allowPause} label="PAUSE" />
                      </button>
                      <button
                        onClick={() => toggleFlag(pl.id, 'allowRenew')}
                        disabled={!isAdmin}
                        title="Allow renewal"
                        className="cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FlagBadge on={pl.allowRenew} label="RENEW" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={pl.isActive ? 'ok' : 'neutral'}>
                      {pl.isActive ? 'ACTIVE' : 'ARCHIVED'}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
