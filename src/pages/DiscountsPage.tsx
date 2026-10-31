import { useState } from 'react'
import { DISCOUNTS, formatPaise, type Discount } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { Plus, Percent } from 'lucide-react'

export default function DiscountsPage() {
  const [discountsList, setDiscountsList] = useState<Discount[]>(DISCOUNTS)
  const [modalOpen, setModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [type, setType] = useState<'FIXED' | 'PERCENT'>('PERCENT')
  const [value, setValue] = useState('15')
  const [maxRedemptions, setMaxRedemptions] = useState(50)

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Discount Rules & Promotions</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Admin Only · Auto-Applied during Invoice Generation with Usage Caps
          </p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setModalOpen(true)} className="font-mono text-xs">
          <Plus size={13} /> Add Discount Rule
        </Btn>
      </div>

      {/* Table */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">RULE NAME</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3 text-right">BENEFIT</th>
              <th className="px-4 py-3">SCOPE</th>
              <th className="px-4 py-3">REDEMPTION PROGRESS (USED / CAP)</th>
              <th className="px-4 py-3">VALIDITY WINDOW</th>
              <th className="px-4 py-3 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {discountsList.map(d => {
              const progressPct = Math.min(100, Math.round((d.timesUsed / d.maxRedemptions) * 100))
              return (
                <tr key={d.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">{d.name}</td>
                  <td className="px-4 py-3 text-[var(--ink-60)]">{d.type}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--ok)] text-sm">
                    {d.type === 'PERCENT' ? `${d.value}% OFF` : `-${formatPaise(d.value)}`}
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-40)]">{d.scope}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold">{d.timesUsed} used</span>
                        <span className="text-[var(--ink-40)]">{d.maxRedemptions} max</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressPct >= 100 ? 'bg-red-500' : 'bg-[var(--accent)]'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-40)]">{d.startsAt} → {d.endsAt}</td>
                  <td className="px-4 py-3 text-right">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-[var(--line-strong)] rounded-lg p-6 max-w-md w-full shadow-2xl font-mono text-xs">
            <h2 className="text-base font-bold text-[var(--ink)] font-sans">Create Promotional Discount</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Discount Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Q4 Growth Rebate"
                  required
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Calculation Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as 'FIXED' | 'PERCENT')}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                >
                  <option value="PERCENT">Percentage Discount (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">
                  Discount Value ({type === 'PERCENT' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Maximum Redemptions Cap</label>
                <input
                  type="number"
                  value={maxRedemptions}
                  onChange={e => setMaxRedemptions(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-[var(--line)] rounded hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--accent)] text-white font-bold rounded hover:bg-blue-900"
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

