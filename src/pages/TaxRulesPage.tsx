import { useState } from 'react'
import { TAX_RULES, PRODUCTS, formatPaise, type TaxRule } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { Plus, Check, HelpCircle, ShieldAlert } from 'lucide-react'

export default function TaxRulesPage() {
  const [taxes, setTaxes] = useState<TaxRule[]>(TAX_RULES)
  const [testProductId, setTestProductId] = useState(PRODUCTS[0].id)

  // Resolve which tax applies to a product
  const resolvedTax = taxes.find(t => t.isActive && t.applicableProducts.includes(testProductId)) || {
    name: 'Default SaaS GST (18%)',
    rate: 18,
    type: 'IGST',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Tax Rules & Fiscal Policies</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Admin Only · Indian GST Harmonized Schedule (IGST / CGST + SGST)
          </p>
        </div>
        <Btn variant="primary" size="sm" className="font-mono text-xs">
          <Plus size={13} /> Add Tax Rule
        </Btn>
      </div>

      {/* Interactive Tax Resolver Test Box */}
      <div className="p-4 border border-[var(--line-strong)] bg-white rounded-sm space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-[var(--accent)]" />
          <p className="font-bold uppercase tracking-wider text-[var(--ink)]">Automated Tax Priority Resolver</p>
        </div>
        <p className="text-[11px] text-[var(--ink-60)]">
          Select a catalog item to simulate server-side tax rule matching and fiscal precedence:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={testProductId}
            onChange={e => setTestProductId(e.target.value)}
            className="w-full sm:w-72 px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
          >
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
            ))}
          </select>
          <div className="p-2 bg-[var(--surface-2)] border border-[var(--line)] rounded text-xs">
            <span className="text-[var(--ink-40)]">Matched Rule: </span>
            <span className="font-bold text-[var(--accent)]">{resolvedTax.name}</span>
            <span className="text-[var(--ink-40)]"> · Applied Rate: </span>
            <span className="font-bold text-[var(--ok)]">{resolvedTax.rate}%</span>
          </div>
        </div>
      </div>

      {/* Tax Rules Table */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">TAX NAME</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3 text-right">PERCENTAGE</th>
              <th className="px-4 py-3">APPLICABLE PRODUCTS</th>
              <th className="px-4 py-3">EFFECTIVE DATES</th>
              <th className="px-4 py-3 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {taxes.map(t => (
              <tr key={t.id} className="hover:bg-[var(--surface-2)] transition-colors">
                <td className="px-4 py-3 font-bold text-[var(--ink)]">{t.name}</td>
                <td className="px-4 py-3 text-[var(--ink-60)]">{t.type}</td>
                <td className="px-4 py-3 text-right font-bold text-[var(--accent)] text-sm">{t.rate}%</td>
                <td className="px-4 py-3 text-[var(--ink-40)]">
                  {t.applicableProducts.length > 0 ? `${t.applicableProducts.length} Products Assigned` : 'Global Fallback'}
                </td>
                <td className="px-4 py-3 text-[var(--ink-40)]">{t.effectiveFrom} → {t.effectiveTo}</td>
                <td className="px-4 py-3 text-right">
                  <Badge variant={t.isActive ? 'ok' : 'neutral'}>
                    {t.isActive ? 'ACTIVE' : 'INACTIVE'}
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

