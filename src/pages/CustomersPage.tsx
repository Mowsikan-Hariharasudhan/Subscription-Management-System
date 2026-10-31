import { useState } from 'react'
import { CUSTOMERS, SUBSCRIPTIONS, INVOICES, PAYMENTS, formatPaise, type Customer } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Plus, X, Mail, Phone, MapPin, Building, CreditCard } from 'lucide-react'

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Customer Directory</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Enterprise Accounts · Indian GSTIN Verified
          </p>
        </div>
        <Btn variant="primary" size="md">
          <Plus size={15} strokeWidth={2.5} /> Add Customer
        </Btn>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center anim-spring stagger-2">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
          <div className="flex border-[1.5px] border-black rounded-xl bg-white p-1 text-xs font-mono shadow-[2px_2px_0_#000]">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === s
                    ? 'glass-odoo text-white font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-gray-500">
          Showing {filtered.length} of {CUSTOMERS.length} accounts
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
        <table className="w-full text-left border-collapse">
          <thead className="border-b-[1.5px] border-black bg-white/60">
            <tr>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CODE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">NAME & COMPANY</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CITY</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">GSTIN</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">PHONE</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">STATUS</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {filtered.map(c => (
              <tr
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="table-row cursor-pointer"
              >
                <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{c.code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#714B67] to-[#4A3043] text-white border-[1.5px] border-black font-bold flex items-center justify-center text-xs shadow-sm">
                      {c.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#4A3043] text-sm">{c.company}</p>
                      <p className="text-[11px] text-gray-500 font-mono">{c.name} · {c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-600">{c.city}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-600">{c.gstin}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{c.phone}</td>
                <td className="px-6 py-4">
                  <Badge variant={c.status === 'ACTIVE' ? 'ok' : 'neutral'}>{c.status}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-bold text-[#714B67] hover:underline font-mono">
                    View 360° →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer 360 Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#4A3043]/60 backdrop-blur-md modal-backdrop"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl h-full shadow-[0_20px_60px_-10px_rgba(113,75,103,0.5)] flex flex-col border-l-[1.5px] border-black z-10 anim-spring">
            {/* Drawer Header */}
            <div className="p-6 border-b-[1.5px] border-black flex justify-between items-start bg-white/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#714B67]">{selectedCustomer.code}</span>
                  <Badge variant={selectedCustomer.status === 'ACTIVE' ? 'ok' : 'neutral'}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#4A3043]">
                  {selectedCustomer.company}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">Primary Contact: {selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-3 divide-x divide-black/10 border-b-[1.5px] border-black bg-white/60 text-xs font-mono p-4">
              <div className="px-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">LTV (Paid)</span>
                <p className="font-bold text-[#4A3043] text-sm mt-0.5">{formatPaise(lifetimeValue)}</p>
              </div>
              <div className="px-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Subscriptions</span>
                <p className="font-bold text-[#4A3043] text-sm mt-0.5">{customerSubs.length} Active</p>
              </div>
              <div className="px-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Invoices</span>
                <p className="font-bold text-[#4A3043] text-sm mt-0.5">{customerInvs.length} Invoiced</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-black/10 px-6 bg-white/40 font-mono text-xs">
              {(['overview', 'subscriptions', 'invoices', 'payments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3 uppercase font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'border-[#714B67] text-[#714B67]'
                      : 'border-transparent text-gray-500 hover:text-black'
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
                  <div className="p-4 border-[1.5px] border-black rounded-xl bg-white shadow-xs space-y-2">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Company Information</p>
                    <div className="flex justify-between py-1 border-b border-black/10">
                      <span className="text-gray-500">Email</span>
                      <span className="font-semibold text-gray-900">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/10">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-semibold text-gray-900">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/10">
                      <span className="text-gray-500">City</span>
                      <span className="font-semibold text-gray-900">{selectedCustomer.city}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">GSTIN</span>
                      <span className="font-semibold text-gray-900">{selectedCustomer.gstin}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div className="space-y-3">
                  {customerSubs.map(s => (
                    <div key={s.id} className="p-4 bg-white border-[1.5px] border-black rounded-xl shadow-xs text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#4A3043]">{s.number}</span>
                        <Badge variant="ok">{s.state}</Badge>
                      </div>
                      <p className="text-gray-600">Recurring Total: {formatPaise(s.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-3">
                  {customerInvs.map(i => (
                    <div key={i.id} className="p-4 bg-white border-[1.5px] border-black rounded-xl shadow-xs text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#4A3043]">{i.number}</span>
                        <Badge variant={i.state === 'PAID' ? 'ok' : 'bad'}>{i.state}</Badge>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Total: {formatPaise(i.total)}</span>
                        <span>Date: {i.issueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  {customerPays.map(p => (
                    <div key={p.id} className="p-4 bg-white border-[1.5px] border-black rounded-xl shadow-xs text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#4A3043]">{p.number}</span>
                        <Badge variant="ok">{p.method}</Badge>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Paid: {formatPaise(p.amount)}</span>
                        <span>{p.paidAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t-[1.5px] border-black bg-white/80 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
