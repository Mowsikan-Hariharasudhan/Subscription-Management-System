import { useState, useEffect } from 'react'
import { PLANS, PRODUCTS, formatPaise, type Plan } from '../data/seed'
import { Badge, Btn, FlagBadge, SearchInput, TableSkeleton } from '../components/ui'
import { Plus, Lock, X, CheckCircle } from 'lucide-react'
import { useAuth } from '../auth'

export default function PlansPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [loading, setLoading] = useState(true)
  const [plansList, setPlansList] = useState<Plan[]>(PLANS)
  const [search, setSearch] = useState('')
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'D' | 'W' | 'M' | 'Y'>('ALL')
  const [toastNotice, setToastNotice] = useState('')

  // Create Plan Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newProductId, setNewProductId] = useState(PRODUCTS[0].id)
  const [newPeriod, setNewPeriod] = useState<'D' | 'W' | 'M' | 'Y'>('M')
  const [newPriceRupees, setNewPriceRupees] = useState('1499')
  const [flagAutoClose, setFlagAutoClose] = useState(false)
  const [flagEarlyClose, setFlagEarlyClose] = useState(true)
  const [flagPause, setFlagPause] = useState(true)
  const [flagRenew, setFlagRenew] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

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

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const code = newCode.trim() || `PLN-${newPeriod}-${String(plansList.length + 1).padStart(3, '0')}`
    const pricePaise = Math.round(parseFloat(newPriceRupees || '0') * 100)

    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      code,
      name: newName.trim(),
      productId: newProductId,
      billingPeriod: newPeriod,
      price: pricePaise,
      minQuantity: 1,
      availableFrom: '2026-01-01',
      availableTo: '2027-12-31',
      autoCloseOnEnd: flagAutoClose,
      allowEarlyClose: flagEarlyClose,
      allowPause: flagPause,
      allowRenew: flagRenew,
      isActive: true,
    }

    setPlansList([newPlan, ...plansList])
    setCreateModalOpen(false)
    setNewName('')
    setNewCode('')
    setToastNotice(`Subscription Plan ${newPlan.name} (${code}) configured successfully.`)
    setTimeout(() => setToastNotice(''), 4500)
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
          <Btn variant="primary" size="md" onClick={() => setCreateModalOpen(true)}>
            <Plus size={15} strokeWidth={2.5} /> Create Plan
          </Btn>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-black bg-white text-gray-500 text-xs font-mono rounded-xl shadow-xs">
            <Lock size={12} /> Staff Protected
          </div>
        )}
      </div>

      {toastNotice && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-emerald-800 flex justify-between items-center anim-spring">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice('')} className="font-bold text-gray-500 hover:text-black cursor-pointer">×</button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 anim-spring stagger-2">
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

      {/* Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : (
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
      )}

      {/* Create Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden modal-panel p-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#714B67]">Recurrence Architecture</span>
                <h3 className="text-lg font-bold text-[#4A3043]">Create Subscription Plan</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="py-5 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Plan Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value.toUpperCase())}
                    placeholder="PLN-M-005"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Base Product *</label>
                  <select
                    value={newProductId}
                    onChange={e => setNewProductId(e.target.value)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Annual"
                  className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Billing Recurrence</label>
                  <select
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value as any)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  >
                    <option value="D">Daily Recurrence</option>
                    <option value="W">Weekly Recurrence</option>
                    <option value="M">Monthly Recurrence (30 days)</option>
                    <option value="Y">Annual Recurrence (365 days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Price per Cycle (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPriceRupees}
                    onChange={e => setNewPriceRupees(e.target.value)}
                    placeholder="1499"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-white border border-black/20 rounded-xl space-y-2">
                <span className="block text-[10px] uppercase font-bold text-gray-600 mb-1 font-mono">Contract Policy Flags</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flagAutoClose}
                      onChange={e => setFlagAutoClose(e.target.checked)}
                      className="accent-[#714B67]"
                    />
                    <span>AUTOCLOSE ON END</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flagEarlyClose}
                      onChange={e => setFlagEarlyClose(e.target.checked)}
                      className="accent-[#714B67]"
                    />
                    <span>ALLOW EARLY CLOSE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flagPause}
                      onChange={e => setFlagPause(e.target.checked)}
                      className="accent-[#714B67]"
                    />
                    <span>ALLOW PAUSE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flagRenew}
                      onChange={e => setFlagRenew(e.target.checked)}
                      className="accent-[#714B67]"
                    />
                    <span>ALLOW RENEWAL</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
