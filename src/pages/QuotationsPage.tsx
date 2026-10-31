import { useState } from 'react'
import { CUSTOMERS, PRODUCTS, PLANS, formatPaise } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { FileText, Check, ArrowRight, Plus } from 'lucide-react'

interface QuotationItem {
  id: string
  number: string
  customerName: string
  planName: string
  total: number
  validUntil: string
  state: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE'
}

const INITIAL_QUOTES: QuotationItem[] = [
  { id: 'q1', number: 'QTN-2026-000041', customerName: 'CRED Fintech', planName: 'Support Desk Monthly', total: 53100, validUntil: '2026-11-15', state: 'QUOTATION' },
  { id: 'q2', number: 'QTN-2026-000042', customerName: 'Meesho Supply', planName: 'CRM Lite Monthly', total: 41300, validUntil: '2026-11-12', state: 'CONFIRMED' },
  { id: 'q3', number: 'QTN-2026-000043', customerName: 'ClearTax India', planName: 'ERP Monthly (Odoo)', total: 256000, validUntil: '2026-11-20', state: 'DRAFT' },
  { id: 'q4', number: 'QTN-2026-000044', customerName: 'Dunzo Digital', planName: 'Analytics Monthly', total: 70800, validUntil: '2026-11-05', state: 'ACTIVE' },
]

export default function QuotationsPage() {
  const [quotes, setQuotes] = useState<QuotationItem[]>(INITIAL_QUOTES)
  const [selectedQuote, setSelectedQuote] = useState<QuotationItem>(INITIAL_QUOTES[0])

  // New quote creation modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState(CUSTOMERS[0].id)
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id)
  const [selectedVariantId, setSelectedVariantId] = useState(PRODUCTS[0].variants[1]?.id || '')
  const [quantity, setQuantity] = useState(1)

  const activeProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0]
  const activeVariant = activeProduct.variants.find(v => v.id === selectedVariantId)
  const unitPrice = activeProduct.salesPrice + (activeVariant ? activeVariant.priceDelta : 0)
  const subtotal = unitPrice * quantity
  const taxAmount = Math.round(subtotal * 0.18) // 18% GST
  const grandTotal = subtotal + taxAmount

  const advanceStage = (id: string) => {
    const nextMap: Record<string, 'QUOTATION' | 'CONFIRMED' | 'ACTIVE'> = {
      DRAFT: 'QUOTATION',
      QUOTATION: 'CONFIRMED',
      CONFIRMED: 'ACTIVE',
    }
    setQuotes(prev =>
      prev.map(q => {
        if (q.id === id && q.state !== 'ACTIVE') {
          const updated = { ...q, state: nextMap[q.state] }
          if (selectedQuote.id === id) setSelectedQuote(updated)
          return updated
        }
        return q
      })
    )
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const cust = CUSTOMERS.find(c => c.id === selectedCustomerId)
    const newQuote: QuotationItem = {
      id: `q-${Date.now()}`,
      number: `QTN-2026-0000${quotes.length + 45}`,
      customerName: cust?.company || 'Enterprise Client',
      planName: `${activeProduct.name} ${activeVariant ? `(${activeVariant.name})` : ''}`,
      total: grandTotal,
      validUntil: '2026-11-30',
      state: 'DRAFT',
    }
    setQuotes([newQuote, ...quotes])
    setSelectedQuote(newQuote)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Quotations & Order Proposals</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Pre-Configured B2B Sales Templates · 5-Stage Conversion Stepper
          </p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setModalOpen(true)} className="font-mono text-xs">
          <Plus size={13} /> New Quotation
        </Btn>
      </div>

      {/* 5-Stage Stepper for Selected Quote */}
      <div className="border border-[var(--line-strong)] bg-white p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <span className="font-mono text-xs font-bold text-[var(--accent)]">{selectedQuote.number}</span>
            <span className="text-xs text-[var(--ink-40)] ml-2">for {selectedQuote.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedQuote.state !== 'ACTIVE' && (
              <button
                onClick={() => advanceStage(selectedQuote.id)}
                className="px-3 py-1 bg-[var(--accent)] text-white text-xs font-mono font-bold uppercase rounded hover:bg-blue-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Advance to Next Stage <ArrowRight size={12} />
              </button>
            )}
            {selectedQuote.state === 'ACTIVE' && (
              <span className="font-mono text-xs font-bold text-[var(--ok)] flex items-center gap-1">
                <Check size={14} /> Converted to Active Subscription
              </span>
            )}
          </div>
        </div>

        {/* Structural Stepper Bar */}
        <div className="grid grid-cols-4 divide-x divide-[var(--line-strong)] border border-[var(--line-strong)] font-mono text-xs">
          {[
            { label: '1. DRAFT', key: 'DRAFT' },
            { label: '2. QUOTATION', key: 'QUOTATION' },
            { label: '3. CONFIRMED', key: 'CONFIRMED' },
            { label: '4. ACTIVE SUB', key: 'ACTIVE' },
          ].map((st, idx) => {
            const stages = ['DRAFT', 'QUOTATION', 'CONFIRMED', 'ACTIVE']
            const currentIdx = stages.indexOf(selectedQuote.state)
            const isCompleted = idx <= currentIdx
            const isCurrent = idx === currentIdx

            return (
              <div
                key={st.key}
                className={`p-3 text-center transition-colors ${
                  isCurrent
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                    : isCompleted
                    ? 'bg-zinc-100 text-[var(--ink)]'
                    : 'bg-white text-[var(--ink-40)]'
                }`}
              >
                {st.label}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quotations List */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">QUOTATION ID</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">PROPOSAL PLAN</th>
              <th className="px-4 py-3">VALIDITY</th>
              <th className="px-4 py-3 text-right">TOTAL AMOUNT</th>
              <th className="px-4 py-3">LIFECYCLE STATE</th>
              <th className="px-4 py-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {quotes.map(q => (
              <tr
                key={q.id}
                onClick={() => setSelectedQuote(q)}
                className={`hover:bg-[var(--surface-2)] transition-colors cursor-pointer ${
                  selectedQuote.id === q.id ? 'bg-[var(--accent-soft)]' : ''
                }`}
              >
                <td className="px-4 py-3 font-bold text-[var(--ink)]">{q.number}</td>
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{q.customerName}</td>
                <td className="px-4 py-3 text-[var(--ink-60)]">{q.planName}</td>
                <td className="px-4 py-3 text-[var(--ink-40)]">{q.validUntil}</td>
                <td className="px-4 py-3 text-right font-bold text-[var(--ink)]">{formatPaise(q.total)}</td>
                <td className="px-4 py-3">
                  <Badge variant={q.state === 'ACTIVE' ? 'ok' : q.state === 'CONFIRMED' ? 'info' : 'warn'}>
                    {q.state}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      advanceStage(q.id)
                    }}
                    disabled={q.state === 'ACTIVE'}
                    className="text-[10px] font-bold text-[var(--accent)] hover:underline disabled:opacity-30 disabled:no-underline"
                  >
                    {q.state === 'ACTIVE' ? 'Active Sub' : 'Advance →'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Quote Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-[var(--line-strong)] rounded-lg p-6 max-w-lg w-full shadow-2xl font-mono text-xs">
            <h2 className="text-base font-bold text-[var(--ink)] font-sans">Draft B2B Quotation Template</h2>
            <p className="text-[11px] text-[var(--ink-40)] mt-0.5">Automated tax & variant calculations</p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Customer Account</label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                >
                  {CUSTOMERS.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Product</label>
                <select
                  value={selectedProductId}
                  onChange={e => {
                    setSelectedProductId(e.target.value)
                    const p = PRODUCTS.find(x => x.id === e.target.value)
                    setSelectedVariantId(p?.variants[0]?.id || '')
                  }}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                >
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - Base: {formatPaise(p.salesPrice)}</option>
                  ))}
                </select>
              </div>

              {activeProduct.variants.length > 0 && (
                <div>
                  <label className="block text-[11px] text-[var(--ink-60)] mb-1">Variant Configuration</label>
                  <select
                    value={selectedVariantId}
                    onChange={e => setSelectedVariantId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                  >
                    <option value="">No Variant (+₹0)</option>
                    {activeProduct.variants.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} (+{formatPaise(v.priceDelta)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Seats / Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                />
              </div>

              {/* Order Lines Calculation Strip */}
              <div className="p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Effective Unit Price:</span>
                  <span className="font-bold">{formatPaise(unitPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} seats):</span>
                  <span>{formatPaise(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST (18%):</span>
                  <span>{formatPaise(taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--line)] pt-1 font-bold text-sm text-[var(--accent)]">
                  <span>Grand Total (Paise):</span>
                  <span>{formatPaise(grandTotal)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

