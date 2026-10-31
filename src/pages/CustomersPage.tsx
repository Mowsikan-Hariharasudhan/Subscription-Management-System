import { useState } from 'react'
import { CUSTOMERS, SUBSCRIPTIONS, INVOICES, PAYMENTS, formatPaise, type Customer } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Plus, X, ExternalLink, Mail, Phone, MapPin, Building, CreditCard } from 'lucide-react'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'invoices' | 'payments'>('overview')

  const filtered = CUSTOMERS.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Data linked to selected customer
  const customerSubs = selectedCustomer
    ? SUBSCRIPTIONS.filter(s => s.customerId === selectedCustomer.id)
    : []
  const customerInvs = selectedCustomer
    ? INVOICES.filter(i => i.customerId === selectedCustomer.id)
    : []
  const customerPays = selectedCustomer
    ? PAYMENTS.filter(p => p.customerId === selectedCustomer.id)
    : []

  const lifetimeValue = customerInvs
    .filter(i => i.state === 'PAID')
    .reduce((sum, i) => sum + i.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Customer Directory</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            30 Enterprise Accounts · Indian GSTIN Verified
          </p>
        </div>
        <Btn variant="primary" size="sm" className="font-mono text-xs">
          <Plus size={13} /> Add Customer
        </Btn>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
          <div className="flex border border-[var(--line)] rounded bg-white p-0.5 text-xs font-mono">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  statusFilter === s ? 'bg-[var(--line-strong)] text-white font-bold' : 'text-[var(--ink-60)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--ink-40)]">
          Showing {filtered.length} of {CUSTOMERS.length} customers
        </div>
      </div>

      {/* Table */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">CODE</th>
              <th className="px-4 py-3">NAME & COMPANY</th>
              <th className="px-4 py-3">CITY</th>
              <th className="px-4 py-3">GSTIN (TAX ID)</th>
              <th className="px-4 py-3">PHONE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(c => (
              <tr
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-bold text-[var(--ink)]">{c.code}</td>
                <td className="px-4 py-3">
                  <p className="font-sans font-semibold text-[var(--ink)] text-sm">{c.company}</p>
                  <p className="text-[11px] text-[var(--ink-40)]">{c.name} · {c.email}</p>
                </td>
                <td className="px-4 py-3 text-[var(--ink-60)]">{c.city}</td>
                <td className="px-4 py-3 text-[var(--ink-60)]">{c.gstin}</td>
                <td className="px-4 py-3 text-[var(--ink-40)]">{c.phone}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.status === 'ACTIVE' ? 'ok' : 'neutral'}>{c.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[10px] font-bold text-[var(--accent)] hover:underline">
                    View 360° →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer 360 Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[var(--line-strong)]">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[var(--line)] flex justify-between items-start bg-[var(--surface-2)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">{selectedCustomer.code}</span>
                  <Badge variant={selectedCustomer.status === 'ACTIVE' ? 'ok' : 'neutral'}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--ink)] mt-1">
                  {selectedCustomer.company}
                </h2>
                <p className="text-xs text-[var(--ink-60)] mt-0.5">Primary Contact: {selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded hover:bg-zinc-200 text-[var(--ink-60)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-3 divide-x divide-[var(--line)] border-b border-[var(--line)] bg-white text-xs font-mono p-3">
              <div className="px-3">
                <span className="text-[10px] text-[var(--ink-40)] uppercase">LTV (Paid)</span>
                <p className="font-bold text-[var(--ink)] text-sm">{formatPaise(lifetimeValue)}</p>
              </div>
              <div className="px-3">
                <span className="text-[10px] text-[var(--ink-40)] uppercase">Subscriptions</span>
                <p className="font-bold text-[var(--ink)] text-sm">{customerSubs.length} Contracts</p>
              </div>
              <div className="px-3">
                <span className="text-[10px] text-[var(--ink-40)] uppercase">Invoices</span>
                <p className="font-bold text-[var(--ink)] text-sm">{customerInvs.length} Invoices</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--line)] px-6 bg-white font-mono text-xs">
              {(['overview', 'subscriptions', 'invoices', 'payments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--ink-40)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 border border-[var(--line)] rounded bg-[var(--surface-2)] space-y-2">
                    <p className="text-[10px] uppercase font-bold text-[var(--ink-40)]">Account Specifications</p>
                    <div className="flex justify-between py-1 border-b border-[var(--line)]">
                      <span className="text-[var(--ink-60)]">Email</span>
                      <span className="font-semibold text-[var(--ink)]">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--line)]">
                      <span className="text-[var(--ink-60)]">Phone</span>
                      <span className="font-semibold text-[var(--ink)]">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--line)]">
                      <span className="text-[var(--ink-60)]">City</span>
                      <span className="font-semibold text-[var(--ink)]">{selectedCustomer.city}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--ink-60)]">GST Identification</span>
                      <span className="font-semibold text-[var(--ink)]">{selectedCustomer.gstin}</span>
                    </div>
                  </div>

                  <div className="p-4 border border-[var(--line)] rounded bg-white">
                    <p className="text-[10px] uppercase font-bold text-[var(--ink-40)] mb-2">Customer Portal Access</p>
                    <p className="text-xs text-[var(--ink-60)] mb-3">
                      Authorized self-service portal route locked strictly to customer session ID.
                    </p>
                    <a
                      href="/portal"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line-strong)] text-xs font-mono uppercase font-semibold hover:bg-[var(--surface-2)]"
                    >
                      Test Portal Session <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div className="space-y-3 font-mono text-xs">
                  {customerSubs.length === 0 ? (
                    <p className="text-zinc-500 py-4 text-center">No subscriptions for this customer.</p>
                  ) : (
                    customerSubs.map(s => (
                      <div key={s.id} className="p-3 border border-[var(--line)] rounded bg-[var(--surface-2)] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[var(--ink)]">{s.number}</p>
                          <p className="text-[11px] text-[var(--ink-40)]">Next bill: {s.nextBillingAt}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={s.state === 'ACTIVE' ? 'ok' : 'warn'}>{s.state}</Badge>
                          <p className="font-bold text-[var(--ink)] mt-1">{formatPaise(s.totalAmount)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-3 font-mono text-xs">
                  {customerInvs.length === 0 ? (
                    <p className="text-zinc-500 py-4 text-center">No invoices issued.</p>
                  ) : (
                    customerInvs.map(i => (
                      <div key={i.id} className="p-3 border border-[var(--line)] rounded bg-[var(--surface-2)] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[var(--ink)]">{i.number}</p>
                          <p className="text-[11px] text-[var(--ink-40)]">Due: {i.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={i.state === 'PAID' ? 'ok' : i.state === 'OVERDUE' ? 'bad' : 'warn'}>
                            {i.state}
                          </Badge>
                          <p className="font-bold text-[var(--ink)] mt-1">{formatPaise(i.total)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3 font-mono text-xs">
                  {customerPays.length === 0 ? (
                    <p className="text-zinc-500 py-4 text-center">No recorded payment receipts.</p>
                  ) : (
                    customerPays.map(p => (
                      <div key={p.id} className="p-3 border border-[var(--line)] rounded bg-[var(--surface-2)] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[var(--ink)]">{p.number}</p>
                          <p className="text-[11px] text-[var(--ink-40)]">{p.method} · {p.paidAt}</p>
                        </div>
                        <p className="font-bold text-[var(--ok)]">{formatPaise(p.amount)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

