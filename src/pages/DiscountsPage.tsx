import { useState, useEffect } from 'react'
import { DISCOUNTS, formatPaise, type Discount } from '../data/seed'
import { Badge, Btn, TableSkeleton } from '../components/ui'
import { Plus, X } from 'lucide-react'

export default function DiscountsPage() {
  const [loading, setLoading] = useState(true)
  const [discountsList, setDiscountsList] = useState<Discount[]>(DISCOUNTS)
  const [modalOpen, setModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [type, setType] = useState<'FIXED' | 'PERCENT'>('PERCENT')
  const [value, setValue] = useState('15')
  const [maxRedemptions, setMaxRedemptions] = useState(50)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const val = type === 'FIXED' ? Math.round(parseFloat(value) * 100) : parseInt(value)
    const newD: Discount = {
      id: `d-${Date.now()}`,
      name,
      type,
      value: val,
      minPurchaseAmount: 0,
      minQuantity: 1,
      startsAt: '2026-10-01',
      endsAt: '2027-12-31',
      maxRedemptions,
      timesUsed: 0,
      scope: 'SUBSCRIPTION',
      productIds: [],
      isActive: true,
    }
    setDiscountsList([newD, ...discountsList])
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Discount Promotions</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Automated Discount Redemption · Server-Verified Redemption Quotas
          </p>
        </div>
        <Btn variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus size={15} strokeWidth={2.5} /> Add Discount Rule
        </Btn>
      </div>

      {/* Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-2">
          <table className="w-full text-left border-collapse">
            <thead className="border-b-[1.5px] border-black bg-white/60">
              <tr>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">RULE NAME</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">TYPE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">BENEFIT</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">SCOPE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">REDEMPTION PROGRESS</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">VALIDITY</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {discountsList.map(d => {
                const progressPct = Math.min(100, Math.round((d.timesUsed / d.maxRedemptions) * 100))
                return (
                  <tr key={d.id} className="table-row">
                    <td className="px-6 py-4 font-bold text-sm text-[#4A3043]">{d.name}</td>
                    <td className="px-6 py-4 text-xs font-mono"><Badge variant="info">{d.type}</Badge></td>
                    <td className="px-6 py-4 text-right font-bold font-mono text-emerald-700 text-sm">
                      {d.type === 'PERCENT' ? `${d.value}% OFF` : `-${formatPaise(d.value)}`}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{d.scope}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 w-36">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#4A3043]">{d.timesUsed} used</span>
                          <span className="text-gray-400">{d.maxRedemptions} cap</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 border border-black/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${progressPct >= 100 ? 'bg-red-500' : 'bg-[#714B67]'}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{d.startsAt} → {d.endsAt}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={d.isActive && progressPct < 100 ? 'ok' : 'neutral'}>
                        {d.isActive && progressPct < 100 ? 'ELIGIBLE' : 'EXHAUSTED'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden modal-panel p-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
              <h3 className="text-lg font-bold text-[#4A3043]">Deploy Discount Rule</h3>
              <button onClick={() => setModalOpen(false)} className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="py-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">Discount Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Founder Early Access"
                  required
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">Calculation Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as 'FIXED' | 'PERCENT')}
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs"
                >
                  <option value="PERCENT">Percentage Discount (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">
                  Discount Value ({type === 'PERCENT' ? '%' : '₹ INR'})
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  required
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">Max Redemptions Cap</label>
                <input
                  type="number"
                  value={maxRedemptions}
                  onChange={e => setMaxRedemptions(parseInt(e.target.value) || 1)}
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl"
                >
                  Deploy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
