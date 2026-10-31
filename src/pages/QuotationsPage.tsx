import { useState } from 'react'
import { CUSTOMERS, PRODUCTS, PLANS, formatPaise } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { FileText, Check, ArrowRight, Plus, X } from 'lucide-react'

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
    const customer = CUSTOMERS.find(c => c.id === selectedCustomerId)
    const newQ: QuotationItem = {
      id: `q-${Date.now()}`,
      number: `QTN-2026-${String(quotes.length + 42).padStart(6, '0')}`,
      customerName: customer?.company || 'Enterprise Client',
      planName: `${activeProduct.name}${activeVariant ? ` (${activeVariant.name})` : ''}`,
      total: grandTotal,
      validUntil: '2026-12-31',
      state: 'DRAFT',
    }
    setQuotes([newQ, ...quotes])
    setSelectedQuote(newQ)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Quotations & Orders</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Status Pipeline: Draft → Quotation → Confirmed → Converted to Active Subscription
          </p>
        </div>
        <Btn variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus size={15} strokeWidth={2.5} /> Create Quotation
        </Btn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-spring stagger-2">
        {/* Left Column: Quotes List */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
            QUOTATIONS LIST ({quotes.length})
          </p>
          {quotes.map(q => (
            <div
              key={q.id}
              onClick={() => setSelectedQuote(q)}
              className={`p-5 glass-panel rounded-2xl cursor-pointer transition-all ${
                selectedQuote.id === q.id
                  ? '!border-black !bg-white shadow-[0_6px_0_0_#000] translate-x-1'
                  : 'hover:border-black/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold font-mono text-[#4A3043] text-sm">{q.number}</span>
                <Badge
                  variant={
                    q.state === 'ACTIVE'
                      ? 'ok'
                      : q.state === 'CONFIRMED'
                      ? 'info'
                      : q.state === 'QUOTATION'
                      ? 'warn'
                      : 'neutral'
                  }
                >
                  {q.state}
                </Badge>
              </div>
              <p className="font-bold text-[#4A3043]">{q.customerName}</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{q.planName}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/10 text-xs font-mono">
                <span className="font-bold text-black">{formatPaise(q.total)}</span>
                <span className="text-gray-400">Valid: {q.validUntil}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Quote Detail */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-black/10">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#714B67]">{selectedQuote.number}</span>
                <Badge variant={selectedQuote.state === 'ACTIVE' ? 'ok' : 'info'}>{selectedQuote.state}</Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#4A3043] mt-1">
                {selectedQuote.customerName}
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Commercial Offer Specification</p>
            </div>
            {selectedQuote.state !== 'ACTIVE' && (
              <button
                onClick={() => advanceStage(selectedQuote.id)}
                className="btn-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Advance to {selectedQuote.state === 'DRAFT' ? 'Quotation' : selectedQuote.state === 'QUOTATION' ? 'Confirmed' : 'Active Subscription'}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-6 bg-white border-[1.5px] border-black rounded-2xl shadow-xs space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Plan & Included Modules</span>
              <span className="font-bold text-[#4A3043]">{selectedQuote.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">GST (18% Statutory Rate)</span>
              <span className="font-bold text-gray-700">Included</span>
            </div>
            <div className="flex justify-between text-base pt-3 border-t border-black/10">
              <span className="font-bold text-black">Net Total (Payable)</span>
              <span className="font-bold text-[#4A3043] tabular-nums text-lg">{formatPaise(selectedQuote.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A3043]/60 backdrop-blur-md modal-backdrop" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-3xl shadow-[0_20px_60px_-10px_rgba(113,75,103,0.5)] overflow-hidden modal-panel p-8">
            <div className="flex justify-between items-center pb-4 border-b border-black">
              <h3 className="text-xl font-bold text-[#4A3043]">Create New Quotation</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg border border-black hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="py-6 space-y-4">
              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase font-mono mb-1">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs font-mono"
                >
                  {CUSTOMERS.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase font-mono mb-1">Base Product</label>
                <select
                  value={selectedProductId}
                  onChange={e => {
                    setSelectedProductId(e.target.value)
                    const p = PRODUCTS.find(x => x.id === e.target.value)
                    setSelectedVariantId(p?.variants[0]?.id || '')
                  }}
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs font-mono"
                >
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {formatPaise(p.salesPrice)}</option>
                  ))}
                </select>
              </div>

              {activeProduct.variants.length > 0 && (
                <div>
                  <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase font-mono mb-1">Additive Variant</label>
                  <select
                    value={selectedVariantId}
                    onChange={e => setSelectedVariantId(e.target.value)}
                    className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs font-mono"
                  >
                    <option value="">No variant (+₹0.00)</option>
                    {activeProduct.variants.map(v => (
                      <option key={v.id} value={v.id}>{v.name} (+{formatPaise(v.priceDelta)})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-4 bg-gray-50 border-[1.5px] border-black rounded-xl font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span className="font-bold">{formatPaise(unitPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST 18%:</span>
                  <span>{formatPaise(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#4A3043] pt-1 border-t border-black/10">
                  <span>Total Payable:</span>
                  <span>{formatPaise(grandTotal)}</span>
                </div>
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
                  Save & Generate Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
