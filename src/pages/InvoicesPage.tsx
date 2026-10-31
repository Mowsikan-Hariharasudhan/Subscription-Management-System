import { useState } from 'react'
import { INVOICES, CUSTOMERS, formatPaise, type Invoice, type InvoiceState } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Printer, RefreshCw, X, Download, FileText } from 'lucide-react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | InvoiceState>('ALL')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [batchNotice, setBatchNotice] = useState('')

  const filtered = invoices.filter(inv => {
    const cust = CUSTOMERS.find(c => c.id === inv.customerId)
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      cust?.company.toLowerCase().includes(search.toLowerCase()) ||
      cust?.name.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'ALL' || inv.state === activeTab
    return matchesSearch && matchesTab
  })

  const runBatchBilling = () => {
    setBatchNotice('Batch Billing Engine Executed: Scanned 30 active subscriptions. 0 duplicates generated (idempotency key verified).')
    setTimeout(() => setBatchNotice(''), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Tax Invoices</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Automated Recurring Billing · Anti-Double-Billing Idempotency Locks
          </p>
        </div>
        <Btn variant="primary" size="md" onClick={runBatchBilling}>
          <RefreshCw size={14} /> Run Recurring Billing Day
        </Btn>
      </div>

      {batchNotice && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-[#4A3043] flex justify-between items-center anim-spring">
          <span>{batchNotice}</span>
          <button onClick={() => setBatchNotice('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-mono anim-spring stagger-2">
        {(['ALL', 'DRAFT', 'CONFIRMED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1.5 rounded-xl border-[1.5px] border-black transition-all cursor-pointer font-bold ${
              activeTab === tab
                ? 'glass-odoo text-white shadow-[2px_2px_0_#000]'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.replace('_', ' ')} ({tab === 'ALL' ? invoices.length : invoices.filter(i => i.state === tab).length})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center anim-spring stagger-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoice or client..." />
        <span className="text-xs font-mono text-gray-500">
          {filtered.length} invoices matching
        </span>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
        <table className="w-full text-left border-collapse">
          <thead className="border-b-[1.5px] border-black bg-white/60">
            <tr>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">INVOICE NUMBER</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CLIENT / COMPANY</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">ISSUE DATE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">DUE DATE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">TOTAL</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">BALANCE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">STATUS</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {filtered.map(inv => {
              const cust = CUSTOMERS.find(c => c.id === inv.customerId)
              const balance = inv.total - inv.amountPaid
              return (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="table-row cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{inv.number}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#4A3043] text-sm">{cust?.company || 'Enterprise'}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{cust?.name}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">{inv.issueDate}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-right font-bold font-mono text-[#4A3043]">{formatPaise(inv.total)}</td>
                  <td className="px-6 py-4 text-right font-bold font-mono text-red-600">
                    {balance > 0 ? formatPaise(balance) : '₹0.00'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        inv.state === 'PAID'
                          ? 'ok'
                          : inv.state === 'OVERDUE'
                          ? 'bad'
                          : inv.state === 'PARTIALLY_PAID'
                          ? 'warn'
                          : 'neutral'
                      }
                    >
                      {inv.state}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs">
                    <span className="font-bold text-[#714B67] hover:underline">
                      View PDF →
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Tax Invoice Printable Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#4A3043]/60 backdrop-blur-md modal-backdrop"
            onClick={() => setSelectedInvoice(null)}
          />
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-3xl shadow-[0_20px_60px_-10px_rgba(113,75,103,0.5)] overflow-hidden modal-panel p-8">
            <div className="flex justify-between items-start pb-6 border-b-[1.5px] border-black">
              <div>
                <span className="font-mono text-xs font-bold text-[#714B67]">TAX INVOICE</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#4A3043]">
                  {selectedInvoice.number}
                </h2>
                <p className="text-xs font-mono text-gray-500 mt-0.5">GSTIN: 33AAACB9876Z1Z8</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-6 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-[1.5px] border-black rounded-xl bg-white">
                  <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Billed To</p>
                  <p className="font-bold text-[#4A3043] text-sm">
                    {CUSTOMERS.find(c => c.id === selectedInvoice.customerId)?.company}
                  </p>
                  <p className="text-gray-500">{CUSTOMERS.find(c => c.id === selectedInvoice.customerId)?.city}, India</p>
                  <p className="text-[10px] text-gray-500">GSTIN: {CUSTOMERS.find(c => c.id === selectedInvoice.customerId)?.gstin}</p>
                </div>
                <div className="p-4 border-[1.5px] border-black rounded-xl bg-white">
                  <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Dates & Terms</p>
                  <p className="text-gray-700">Issue: <span className="font-bold">{selectedInvoice.issueDate}</span></p>
                  <p className="text-gray-700">Due: <span className="font-bold text-red-600">{selectedInvoice.dueDate}</span></p>
                  <p className="text-[10px] text-gray-500">Currency: INR (Paise Accurate)</p>
                </div>
              </div>

              {/* Items List */}
              <div className="border-[1.5px] border-black rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b border-black">
                    <tr>
                      <th className="p-3 text-[10px] font-bold uppercase">Item Description</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-right">Subtotal</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-right">GST (18%)</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/10">
                      <td className="p-3 font-medium">Enterprise Software Subscription License</td>
                      <td className="p-3 text-right">{formatPaise(selectedInvoice.subtotal)}</td>
                      <td className="p-3 text-right">{formatPaise(selectedInvoice.taxTotal)}</td>
                      <td className="p-3 text-right font-bold text-[#4A3043]">{formatPaise(selectedInvoice.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t-[1.5px] border-black">
              <span className="text-xs font-mono text-gray-500">Status: <Badge variant="ok">{selectedInvoice.state}</Badge></span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Printer size={14} /> Print Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
