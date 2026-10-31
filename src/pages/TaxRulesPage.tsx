import { useState } from 'react'
import { TAX_RULES, PRODUCTS, type TaxRule } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { Plus, HelpCircle } from 'lucide-react'

export default function TaxRulesPage() {
  const [taxes] = useState<TaxRule[]>(TAX_RULES)
  const [testProductId, setTestProductId] = useState(PRODUCTS[0].id)

  // Resolve which tax applies to a product
  const resolvedTax = taxes.find(t => t.isActive && t.applicableProducts.includes(testProductId)) || {
    name: 'Default SaaS GST (18%)',
    rate: 18,
    type: 'IGST',
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
        <Btn variant="primary" size="md">
          <Plus size={15} strokeWidth={2.5} /> Add Tax Rule
        </Btn>
      </div>

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

      {/* Tax Rules Table */}
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
    </div>
  )
}
