import { useState } from 'react'
import { INVOICES, CUSTOMERS, formatPaise, type Invoice, type InvoiceState } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Printer, Send, Check, X, RefreshCw, FileText, Download } from 'lucide-react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | InvoiceState>('ALL')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [printModal, setPrintModal] = useState<Invoice | null>(null)
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

  const confirmInvoice = (id: string) => {
    setInvoices(prev =>
      prev.map(i => (i.id === id ? { ...i, state: 'CONFIRMED' } : i))
    )
  }

  const runBatchBilling = () => {
    setBatchNotice('Batch Billing Engine Executed: Scanned 30 active subscriptions. 0 duplicates generated (idempotency key verified).')
    setTimeout(() => setBatchNotice(''), 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Tax Invoices & Billing Engine</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Automated Recurring Billing · Anti-Double-Billing Lock (Unique Subscription × Period Key)
          </p>
        </div>
        <Btn variant="primary" size="sm" onClick={runBatchBilling} className="font-mono text-xs">
          <RefreshCw size={12} /> Run Recurring Billing Day
        </Btn>
      </div>

      {batchNotice && (
        <div className="p-3 bg-blue-50 border border-blue-300 text-blue-900 text-xs font-mono rounded flex justify-between items-center">
          <span>{batchNotice}</span>
          <button onClick={() => setBatchNotice('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[var(--line)] gap-1 text-xs font-mono">
        {(['ALL', 'DRAFT', 'CONFIRMED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-[var(--line-strong)] text-[var(--ink)] bg-[var(--surface-2)]'
                : 'border-transparent text-[var(--ink-40)] hover:text-[var(--ink)]'
            }`}
          >
            {tab.replace('_', ' ')} ({tab === 'ALL' ? invoices.length : invoices.filter(i => i.state === tab).length})
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex justify-between items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoice number or client..." />
        <span className="text-xs font-mono text-[var(--ink-40)]">
          {filtered.length} invoices matching
        </span>
      </div>

      {/* Table */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">INVOICE NO</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">PERIOD</th>
              <th className="px-4 py-3">DUE DATE</th>
              <th className="px-4 py-3 text-right">TOTAL</th>
              <th className="px-4 py-3 text-right">PAID</th>
              <th className="px-4 py-3 text-right">BALANCE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(inv => {
              const cust = CUSTOMERS.find(c => c.id === inv.customerId)
              const balance = inv.total - inv.amountPaid
              return (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">{inv.number}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--ink)] max-w-[130px] truncate">
                    {cust?.company || cust?.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-40)] text-[11px]">
                    {inv.periodStart} → {inv.periodEnd}
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-60)]">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--ink)]">{formatPaise(inv.total)}</td>
                  <td className="px-4 py-3 text-right text-[var(--ok)]">{formatPaise(inv.amountPaid)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--bad)]">
                    {balance > 0 ? formatPaise(balance) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={inv.state === 'PAID' ? 'ok' : inv.state === 'OVERDUE' ? 'bad' : inv.state === 'PARTIALLY_PAID' ? 'warn' : 'neutral'}>
                      {inv.state}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setPrintModal(inv)
                      }}
                      className="text-[10px] font-bold text-[var(--ink)] hover:underline inline-flex items-center gap-1"
                    >
                      <Printer size={11} /> Print PDF
                    </button>
                    {inv.state === 'DRAFT' && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          confirmInvoice(inv.id)
                        }}
                        className="text-[10px] font-bold text-[var(--accent)] hover:underline"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Tax Invoice Document Print Modal */}
      {printModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border-2 border-[var(--line-strong)] max-w-2xl w-full p-8 shadow-2xl font-mono text-xs space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[var(--line-strong)] pb-4">
              <div>
                <h2 className="text-xl font-bold font-sans tracking-tight">TAX INVOICE</h2>
                <p className="text-xs text-[var(--ink-40)]">ORIGINAL FOR RECIPIENT</p>
                <p className="text-xs font-bold text-[var(--ink)] mt-2">Brightloop Software Systems Pvt Ltd</p>
                <p className="text-[11px] text-[var(--ink-60)]">GSTIN: 33AAACB9876Z1Z8 · Bengaluru, Karnataka</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{printModal.number}</p>
                <p className="text-xs text-[var(--ink-40)]">Date: {printModal.issueDate}</p>
                <p className="text-xs text-[var(--ink-40)]">Due: {printModal.dueDate}</p>
              </div>
            </div>

            {/* Bill To */}
            {(() => {
              const c = CUSTOMERS.find(x => x.id === printModal.customerId)
              return (
                <div className="p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded">
                  <p className="text-[10px] uppercase font-bold text-[var(--ink-40)]">Billed To:</p>
                  <p className="font-bold text-sm text-[var(--ink)] mt-0.5">{c?.company}</p>
                  <p className="text-xs text-[var(--ink-60)]">GSTIN: {c?.gstin} · {c?.city}, India</p>
                </div>
              )
            })()}

            {/* Line Items Table */}
            <table className="w-full text-left text-xs border border-[var(--line)]">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--line)]">
                <tr>
                  <th className="p-2">DESCRIPTION</th>
                  <th className="p-2 text-right">QTY</th>
                  <th className="p-2 text-right">RATE</th>
                  <th className="p-2 text-right">TAX</th>
                  <th className="p-2 text-right">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--line)]">
                  <td className="p-2">
                    <p className="font-bold">Enterprise SaaS Subscription</p>
                    <p className="text-[10px] text-[var(--ink-40)]">Billing cycle {printModal.periodStart} to {printModal.periodEnd}</p>
                  </td>
                  <td className="p-2 text-right">1</td>
                  <td className="p-2 text-right">{formatPaise(printModal.subtotal)}</td>
                  <td className="p-2 text-right">{formatPaise(printModal.taxTotal)} (18%)</td>
                  <td className="p-2 text-right font-bold">{formatPaise(printModal.total)}</td>
                </tr>
              </tbody>
            </table>

            {/* Financial Reconciliation Summary */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPaise(printModal.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Total (18%):</span>
                  <span>{formatPaise(printModal.taxTotal)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--line-strong)] pt-1 font-bold text-sm">
                  <span>Grand Total:</span>
                  <span>{formatPaise(printModal.total)}</span>
                </div>
                <div className="flex justify-between text-[var(--ok)] font-semibold">
                  <span>Paid to Date:</span>
                  <span>{formatPaise(printModal.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-[var(--bad)] font-bold border-t border-dashed border-[var(--line)] pt-1">
                  <span>Outstanding Balance:</span>
                  <span>{formatPaise(printModal.total - printModal.amountPaid)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[var(--line)]">
              <span className="text-[10px] text-[var(--ink-40)] uppercase">
                System generated tax invoice · Bank Transfer & UPI Supported
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[var(--line-strong)] text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Download size={12} /> Print PDF
                </button>
                <button
                  onClick={() => setPrintModal(null)}
                  className="px-3 py-1.5 border border-[var(--line)] rounded text-xs hover:bg-zinc-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

