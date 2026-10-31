import { useState } from 'react'
import { PAYMENTS, INVOICES, CUSTOMERS, formatPaise, type Payment, type PaymentMethod } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Plus, CreditCard, Check, X, ShieldCheck } from 'lucide-react'

export default function PaymentsPage() {
  const [paymentsList, setPaymentsList] = useState<Payment[]>(PAYMENTS)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // Record payment form state
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(INVOICES.find(i => i.state !== 'PAID')?.id || INVOICES[0].id)
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [paymentAmountRupees, setPaymentAmountRupees] = useState('')
  const [refNote, setRefNote] = useState('UPI/2610/REC001')
  const [successToast, setSuccessToast] = useState('')

  const activeInvoice = INVOICES.find(i => i.id === selectedInvoiceId) || INVOICES[0]
  const outstandingBalancePaise = activeInvoice.total - activeInvoice.amountPaid

  const filtered = paymentsList.filter(p => {
    const cust = CUSTOMERS.find(c => c.id === p.customerId)
    return (
      p.number.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      cust?.company.toLowerCase().includes(search.toLowerCase())
    )
  })

  const totalCollected = paymentsList.reduce((sum, p) => sum + p.amount, 0)

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    const enteredPaise = Math.round(parseFloat(paymentAmountRupees || '0') * 100)

    if (enteredPaise <= 0) return
    if (enteredPaise > outstandingBalancePaise) {
      alert(`Cannot overpay. Outstanding balance is ${formatPaise(outstandingBalancePaise)}`)
      return
    }

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      number: `PAY-2026-0000${paymentsList.length + 26}`,
      invoiceId: activeInvoice.id,
      customerId: activeInvoice.customerId,
      method,
      amount: enteredPaise,
      paidAt: '2026-10-31',
      reference: refNote,
    }

    // Atomic update
    setPaymentsList([newPayment, ...paymentsList])
    activeInvoice.amountPaid += enteredPaise
    if (activeInvoice.amountPaid >= activeInvoice.total) {
      activeInvoice.state = 'PAID'
    } else {
      activeInvoice.state = 'PARTIALLY_PAID'
    }

    setSuccessToast(`Payment recorded: ${formatPaise(enteredPaise)} allocated to ${activeInvoice.number}. Invoice status updated.`)
    setTimeout(() => setSuccessToast(''), 4000)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Payments Ledger & Reconciliation</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Real-Time Settlement · Partial & Multi-Payment Allocation (Paise Exact)
          </p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => {
          setPaymentAmountRupees((outstandingBalancePaise / 100).toString())
          setModalOpen(true)
        }} className="font-mono text-xs">
          <Plus size={13} /> Record Payment Receipt
        </Btn>
      </div>

      {successToast && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-900 text-xs font-mono rounded flex justify-between items-center">
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-700" />
            {successToast}
          </span>
          <button onClick={() => setSuccessToast('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* KPI Band */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-[var(--line-strong)] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[var(--line-strong)] text-xs font-mono p-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[var(--ink-40)]">TOTAL CASH COLLECTED</span>
          <p className="text-2xl font-bold text-[var(--ok)] mt-1">{formatPaise(totalCollected)}</p>
        </div>
        <div className="sm:pl-4">
          <span className="text-[10px] uppercase font-bold text-[var(--ink-40)]">TRANSACTIONS LOGGED</span>
          <p className="text-2xl font-bold text-[var(--ink)] mt-1">{paymentsList.length} Receipts</p>
        </div>
        <div className="sm:pl-4">
          <span className="text-[10px] uppercase font-bold text-[var(--ink-40)]">PREFERRED RAILS</span>
          <p className="text-2xl font-bold text-[var(--accent)] mt-1">UPI & NEFT/RTGS</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search payments..." />
        <span className="text-xs font-mono text-[var(--ink-40)]">{filtered.length} entries in ledger</span>
      </div>

      {/* Table */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">PAYMENT REF</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">TARGET INVOICE</th>
              <th className="px-4 py-3">METHOD</th>
              <th className="px-4 py-3">PAYMENT DATE</th>
              <th className="px-4 py-3">TRANSACTION REF</th>
              <th className="px-4 py-3 text-right">AMOUNT SETTLED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(p => {
              const cust = CUSTOMERS.find(c => c.id === p.customerId)
              return (
                <tr key={p.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">{p.number}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--ink)]">{cust?.company}</td>
                  <td className="px-4 py-3 text-[var(--accent)] font-semibold">{p.invoiceId}</td>
                  <td className="px-4 py-3 text-[var(--ink-60)]">{p.method}</td>
                  <td className="px-4 py-3 text-[var(--ink-40)]">{p.paidAt}</td>
                  <td className="px-4 py-3 text-[var(--ink-40)]">{p.reference}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--ok)] text-sm">
                    {formatPaise(p.amount)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Record Payment Drawer / Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-[var(--line-strong)] rounded-lg p-6 max-w-md w-full shadow-2xl font-mono text-xs">
            <h2 className="text-base font-bold text-[var(--ink)] font-sans">Record Incoming Payment</h2>
            <p className="text-[11px] text-[var(--ink-40)] mt-0.5">
              Reconciles directly against open invoice balance
            </p>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Select Open Invoice</label>
                <select
                  value={selectedInvoiceId}
                  onChange={e => {
                    setSelectedInvoiceId(e.target.value)
                    const inv = INVOICES.find(x => x.id === e.target.value)
                    if (inv) {
                      setPaymentAmountRupees(((inv.total - inv.amountPaid) / 100).toString())
                    }
                  }}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                >
                  {INVOICES.filter(i => i.state !== 'PAID').map(inv => {
                    const c = CUSTOMERS.find(x => x.id === inv.customerId)
                    const bal = inv.total - inv.amountPaid
                    return (
                      <option key={inv.id} value={inv.id}>
                        {inv.number} - {c?.company} (Bal: {formatPaise(bal)})
                      </option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs"
                >
                  <option value="UPI">UPI (Instant settlement)</option>
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="CARD">Corporate Card</option>
                  <option value="CASH">Cash Deposit</option>
                  <option value="OTHER">Other Rail</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">
                  Settlement Amount in ₹ (Outstanding: {formatPaise(outstandingBalancePaise)})
                </label>
                <input
                  type="number"
                  value={paymentAmountRupees}
                  onChange={e => setPaymentAmountRupees(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Banking Transaction Reference</label>
                <input
                  type="text"
                  value={refNote}
                  onChange={e => setRefNote(e.target.value)}
                  placeholder="e.g. UTR / UPI Ref ID"
                  required
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
                  className="px-4 py-1.5 bg-[var(--ok)] text-white font-bold rounded hover:bg-green-700"
                >
                  Post Payment & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

