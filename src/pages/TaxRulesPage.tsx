import { useState, useEffect } from 'react'
import { TAX_RULES, PRODUCTS, type TaxRule } from '../data/seed'
import { Badge, Btn, TableSkeleton } from '../components/ui'
import { Plus, HelpCircle, X, CheckCircle } from 'lucide-react'

export default function TaxRulesPage() {
  const [loading, setLoading] = useState(true)
  const [taxes, setTaxes] = useState<TaxRule[]>(TAX_RULES)
  const [testProductId, setTestProductId] = useState(PRODUCTS[0].id)
  const [toastNotice, setToastNotice] = useState('')

  // Add Tax Rule Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('IGST')
  const [newRate, setNewRate] = useState('18')
  const [effectiveFrom, setEffectiveFrom] = useState('2026-11-01')
  const [effectiveTo, setEffectiveTo] = useState('2027-10-31')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Resolve which tax applies to a product
  const resolvedTax = taxes.find(t => t.isActive && t.applicableProducts.includes(testProductId)) || {
    name: 'Default SaaS GST (18%)',
    rate: 18,
    type: 'IGST',
  }

  const handleCreateTax = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newRule: TaxRule = {
      id: `TAX-${String(taxes.length + 1).padStart(3, '0')}`,
      name: newName.trim(),
      rate: parseFloat(newRate || '18'),
      type: newType,
      effectiveFrom,
      effectiveTo,
      applicableProducts: [testProductId],
      isActive: true,
    }

    setTaxes([newRule, ...taxes])
    setCreateModalOpen(false)
    setNewName('')
    setToastNotice(`Tax Rule ${newRule.name} (${newRule.rate}%) activated in precedence engine.`)
    setTimeout(() => setToastNotice(''), 4500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Tax Rules & Policies</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Admin Controlled · Indian GST Schedule (IGST / CGST + SGST Precedence)
          </p>
        </div>
        <Btn variant="primary" size="md" onClick={() => setCreateModalOpen(true)}>
          <Plus size={15} strokeWidth={2.5} /> Add Tax Rule
        </Btn>
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

      {/* Tax Resolver Test Box */}
      <div className="glass-panel rounded-2xl p-6 space-y-3 font-mono text-xs anim-spring stagger-2">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-[#714B67]" />
          <p className="font-bold uppercase tracking-wider text-[#4A3043]">Automated Tax Priority Resolver</p>
        </div>
        <p className="text-xs text-gray-600">
          Select a catalog item to test real-time server-side tax rule matching and fiscal precedence:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center pt-1">
          <select
            value={testProductId}
            onChange={e => setTestProductId(e.target.value)}
            className="input-focus w-full sm:w-80 px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs"
          >
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
            ))}
          </select>
          <div className="p-3 bg-white/80 border-[1.5px] border-black rounded-xl text-xs shadow-xs">
            <span className="text-gray-500">Matched Rule: </span>
            <span className="font-bold text-[#714B67]">{resolvedTax.name}</span>
            <span className="text-gray-500"> · Applied Rate: </span>
            <span className="font-bold text-emerald-700">{resolvedTax.rate}%</span>
          </div>
        </div>
      </div>

      {/* Tax Rules Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
          <table className="w-full text-left border-collapse">
            <thead className="border-b-[1.5px] border-black bg-white/60">
              <tr>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">RULE ID</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">TAX RULE NAME</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">TYPE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">RATE %</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">VALIDITY PERIOD</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {taxes.map(t => (
                <tr key={t.id} className="table-row">
                  <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{t.id}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[#4A3043]">{t.name}</td>
                  <td className="px-6 py-4 text-xs font-mono"><Badge variant="info">{t.type}</Badge></td>
                  <td className="px-6 py-4 text-right font-bold font-mono text-emerald-700 text-sm">{t.rate}%</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{t.effectiveFrom} to {t.effectiveTo}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={t.isActive ? 'ok' : 'neutral'}>
                      {t.isActive ? 'ACTIVE' : 'ARCHIVED'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Tax Rule Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden modal-panel p-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#714B67]">Statutory Taxation</span>
                <h3 className="text-lg font-bold text-[#4A3043]">Configure Indian GST Rule</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateTax} className="py-5 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Export / SEZ Zero-Rated GST"
                  className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Tax Category</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  >
                    <option value="IGST">IGST (Inter-State 18%)</option>
                    <option value="CGST+SGST">CGST + SGST (Intra-State 9% + 9%)</option>
                    <option value="EXEMPT">Exempted / Zero-Rated (0%)</option>
                    <option value="REDUCED">Reduced Rate (12%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Tax Percentage (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={newRate}
                    onChange={e => setNewRate(e.target.value)}
                    placeholder="18"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Effective Start</label>
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={e => setEffectiveFrom(e.target.value)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Effective End</label>
                  <input
                    type="date"
                    value={effectiveTo}
                    onChange={e => setEffectiveTo(e.target.value)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
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
                  <Plus size={14} /> Add Tax Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
