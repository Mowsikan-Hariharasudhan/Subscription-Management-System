import { useState } from 'react'
import { PLANS, PRODUCTS, formatPaise, type Plan } from '../data/seed'
import { Badge, Btn, FlagBadge, SearchInput } from '../components/ui'
import { Plus, Lock, Calendar } from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Subscription Plans</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Recurrence Schedules & Policy Flags · {isAdmin ? 'Full Administrator Access' : 'Staff Read-Only View'}
          </p>
        </div>

        {isAdmin ? (
          <Btn variant="primary" size="sm" className="font-mono text-xs">
            <Plus size={13} /> Create Plan
          </Btn>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-40)] text-xs font-mono rounded">
            <Lock size={12} /> Staff Protected
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search plans..." />
          <div className="flex border border-[var(--line)] rounded bg-white p-0.5 text-xs font-mono">
            {(['ALL', 'D', 'W', 'M', 'Y'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodFilter(p)}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  periodFilter === p ? 'bg-[var(--line-strong)] text-white font-bold' : 'text-[var(--ink-60)]'
                }`}
              >
                {p === 'ALL' ? 'ALL' : p === 'D' ? 'DAILY' : p === 'W' ? 'WEEKLY' : p === 'M' ? 'MONTHLY' : 'ANNUAL'}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-[var(--ink-40)]">{filtered.length} active plans</span>
      </div>

      {/* Table with the 4 structural brutalist flag toggles */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">CODE</th>
              <th className="px-4 py-3">PLAN NAME</th>
              <th className="px-4 py-3">ATTACHED PRODUCT</th>
              <th className="px-4 py-3">CYCLE</th>
              <th className="px-4 py-3 text-right">PRICE</th>
              <th className="px-4 py-3 text-center">POLICY FLAGS (AUTOCLOSE · EARLYCLOSE · PAUSE · RENEW)</th>
              <th className="px-4 py-3 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(pl => {
              const prod = PRODUCTS.find(p => p.id === pl.productId)
              return (
                <tr key={pl.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">{pl.code}</td>
                  <td className="px-4 py-3 font-sans font-semibold text-sm text-[var(--ink)]">{pl.name}</td>
                  <td className="px-4 py-3 text-[var(--ink-60)]">{prod?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 border border-[var(--line)] rounded bg-[var(--surface-2)] font-semibold text-[10px]">
                      {pl.billingPeriod === 'D' ? 'DAILY' : pl.billingPeriod === 'W' ? 'WEEKLY' : pl.billingPeriod === 'M' ? 'MONTHLY' : 'ANNUAL'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-sm text-[var(--ink)]">
                    {formatPaise(pl.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-[var(--surface-2)] p-1 rounded border border-[var(--line)]">
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
                  <td className="px-4 py-3 text-right">
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

