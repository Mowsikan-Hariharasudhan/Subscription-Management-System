import { useState, useEffect } from 'react'
import { PAYMENTS, INVOICES, CUSTOMERS, formatPaise, type Payment, type PaymentMethod } from '../data/seed'
import { Badge, Btn, SearchInput, TableSkeleton } from '../components/ui'
import { Plus, CreditCard, Check, X, ShieldCheck, CheckCircle } from 'lucide-react'

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [paymentsList, setPaymentsList] = useState<Payment[]>(PAYMENTS)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // Record payment form state
  const pendingInvoices = INVOICES.filter(i => i.state !== 'PAID')
  const defaultInvoiceId = pendingInvoices[0]?.id || INVOICES[0]?.id || ''
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(defaultInvoiceId)
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [paymentAmountRupees, setPaymentAmountRupees] = useState('')
  const [refNote, setRefNote] = useState('UPI/2610/REC001')
  const [successToast, setSuccessToast] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const activeInvoice = INVOICES.find(i => i.id === selectedInvoiceId) || INVOICES[0]
  const outstandingBalancePaise = activeInvoice ? activeInvoice.total - activeInvoice.amountPaid : 0

  useEffect(() => {
    if (activeInvoice && outstandingBalancePaise > 0) {
      setPaymentAmountRupees((outstandingBalancePaise / 100).toString())
    }
  }, [selectedInvoiceId])

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
    setFormError('')
    const enteredPaise = Math.round(parseFloat(paymentAmountRupees || '0') * 100)

    if (enteredPaise <= 0) {
      setFormError('Please enter a valid payment amount greater than zero.')
      return
    }
    if (enteredPaise > outstandingBalancePaise) {
      setFormError(`Cannot overpay. Outstanding balance is ${formatPaise(outstandingBalancePaise)}`)
      return
    }

    const nextPaymentNum = `PAY-2026-0000${paymentsList.length + 26}`
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      number: nextPaymentNum,
      invoiceId: activeInvoice.id,
      customerId: activeInvoice.customerId,
      method,
      amount: enteredPaise,
      paidAt: '2026-10-31',
      reference: refNote || `REF-${Date.now().toString().slice(-6)}`,
    }

    // Atomic update
    setPaymentsList([newPayment, ...paymentsList])
    activeInvoice.amountPaid += enteredPaise
    if (activeInvoice.amountPaid >= activeInvoice.total) {
      activeInvoice.state = 'PAID'
    } else {
      activeInvoice.state = 'PARTIALLY_PAID'
    }

    setModalOpen(false)
    setSuccessToast(`Payment receipt ${nextPaymentNum} (${formatPaise(enteredPaise)}) recorded for invoice ${activeInvoice.number}.`)
    setTimeout(() => setSuccessToast(''), 4500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Payments & Settlements</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Cash Accounting · UPI, NEFT, RTGS & Card Rails Reconciliation
          </p>
        </div>
        <Btn variant="primary" size="md" onClick={() => {
          setFormError('')
          setModalOpen(true)
        }}>
          <Plus size={15} strokeWidth={2.5} /> Record Payment
        </Btn>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 anim-spring stagger-1">
        <div className="glass-panel rounded-2xl p-6">
          <span className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider font-mono">TOTAL SETTLED CASH</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">{formatPaise(totalCollected)}</p>
          <span className="text-[10px] text-gray-400 font-mono">Verified clearance into corporate bank accounts</span>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <span className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider font-mono">TRANSACTIONS COUNT</span>
          <p className="text-2xl font-bold text-[#4A3043] font-mono tabular-nums mt-1">{paymentsList.length} Receipts</p>
          <span className="text-[10px] text-gray-400 font-mono">Zero unallocated suspense entries</span>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <span className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider font-mono">RECONCILIATION INTEGRITY</span>
          <p className="text-2xl font-bold text-[#714B67] font-mono tabular-nums mt-1">100.0% Match</p>
          <span className="text-[10px] text-gray-400 font-mono">Double-entry ledger verified</span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-emerald-800 flex justify-between items-center anim-spring">
          <span className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            {successToast}
          </span>
          <button onClick={() => setSuccessToast('')} className="font-bold text-gray-500 hover:text-black cursor-pointer">×</button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex justify-between items-center anim-spring stagger-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by payment or reference..." />
        <span className="text-xs font-mono text-gray-500">
          {filtered.length} settled payments
        </span>
      </div>

      {/* Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
          <table className="w-full text-left border-collapse">
            <thead className="border-b-[1.5px] border-black bg-white/60">
              <tr>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">PAYMENT NUMBER</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CUSTOMER</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">SETTLED INVOICE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">METHOD</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">BANK / GATEWAY REF</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">DATE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">AMOUNT SETTLED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filtered.map(p => {
                const cust = CUSTOMERS.find(c => c.id === p.customerId)
                const inv = INVOICES.find(i => i.id === p.invoiceId)
                return (
                  <tr key={p.id} className="table-row">
                    <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{p.number}</td>
                    <td className="px-6 py-4 font-bold text-sm text-[#4A3043]">{cust?.company || 'Enterprise'}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">{inv?.number || 'INV-REF'}</td>
                    <td className="px-6 py-4">
                      <Badge variant="ok">{p.method}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">{p.reference}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.paidAt}</td>
                    <td className="px-6 py-4 text-right font-bold font-mono text-emerald-700">
                      {formatPaise(p.amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden modal-panel p-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#714B67]">Cash Reconciliation</span>
                <h3 className="text-lg font-bold text-[#4A3043]">Record Payment Receipt</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={15} />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="py-5 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-800 uppercase mb-1">Select Pending Invoice</label>
                <select
                  value={selectedInvoiceId}
                  onChange={e => setSelectedInvoiceId(e.target.value)}
                  className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                >
                  {INVOICES.filter(i => i.state !== 'PAID').map(i => {
                    const c = CUSTOMERS.find(x => x.id === i.customerId)
                    const bal = i.total - i.amountPaid
                    return (
                      <option key={i.id} value={i.id}>
                        {i.number} — {c?.company} (Bal: {formatPaise(bal)})
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={e => setMethod(e.target.value as PaymentMethod)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  >
                    <option value="UPI">UPI / Instant</option>
                    <option value="BANK_TRANSFER">NEFT / RTGS</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-800 uppercase mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentAmountRupees}
                    onChange={e => setPaymentAmountRupees(e.target.value)}
                    placeholder="2560"
                    required
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-800 uppercase mb-1">Bank Reference / UTR</label>
                <input
                  type="text"
                  value={refNote}
                  onChange={e => setRefNote(e.target.value)}
                  placeholder="UPI/2610/REC001 or UTR98234123"
                  className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-black/10">
                <span className="text-[11px] text-gray-500">
                  Remaining: <span className="font-bold text-[#4A3043]">{formatPaise(outstandingBalancePaise)}</span>
                </span>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={14} /> Settle Receipt
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
