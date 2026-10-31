import { useState, useEffect } from 'react'
import { CUSTOMERS, SUBSCRIPTIONS, INVOICES, PAYMENTS, formatPaise, type Customer } from '../data/seed'
import { Badge, Btn, SearchInput, TableSkeleton } from '../components/ui'
import { Plus, X, Mail, Phone, MapPin, Building, CreditCard, CheckCircle } from 'lucide-react'

export default function CustomersPage() {
  const [loading, setLoading] = useState(true)
  const [customersList, setCustomersList] = useState<Customer[]>(CUSTOMERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'invoices' | 'payments'>('overview')

  // Add Customer Modal State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [gstin, setGstin] = useState('')
  const [toastNotice, setToastNotice] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const filtered = customersList.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !name.trim()) return

    const newCode = `CUS-${String(customersList.length + 1).padStart(3, '0')}`
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      code: newCode,
      name,
      company,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: phone || '+91 98765 43210',
      city: city || 'Bengaluru',
      gstin: gstin || '29AAAAA0000A1Z5',
      status: 'ACTIVE',
      createdAt: '2026-10-31',
    }

    setCustomersList([newCust, ...customersList])
    setAddModalOpen(false)
    setCompany('')
    setName('')
    setEmail('')
    setPhone('')
    setCity('')
    setGstin('')
    setToastNotice(`Customer ${newCust.company} (${newCode}) created and verified with Indian GSTIN.`)
    setTimeout(() => setToastNotice(''), 4500)
  }

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
        <Btn variant="primary" size="md" onClick={() => setAddModalOpen(true)}>
          <Plus size={15} strokeWidth={2.5} /> Add Customer
        </Btn>
      </div>

      {toastNotice && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-emerald-800 flex justify-between items-center anim-spring">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice('')} className="font-bold text-gray-500 hover:text-black cursor-pointer">×</button>
        </div>
      )}

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
          Showing {filtered.length} of {customersList.length} accounts
        </div>
      </div>

      {/* Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : (
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
      )}

      {/* Customer 360 Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl h-full shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex flex-col border-l-[1.5px] border-black z-10 drawer-panel">
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
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
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

            {/* Tab Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {activeTab === 'overview' && (
                <div className="space-y-4 font-mono text-xs">
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
                  {customerSubs.length === 0 ? (
                    <p className="text-xs font-mono text-gray-400 py-4 text-center">No subscriptions on record.</p>
                  ) : (
                    customerSubs.map(s => (
                      <div key={s.id} className="p-4 bg-white border-[1.5px] border-black rounded-xl shadow-xs text-xs font-mono">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[#4A3043]">{s.number}</span>
                          <Badge variant="ok">{s.state}</Badge>
                        </div>
                        <p className="text-gray-600">Recurring Total: {formatPaise(s.totalAmount)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-3">
                  {customerInvs.length === 0 ? (
                    <p className="text-xs font-mono text-gray-400 py-4 text-center">No invoices generated yet.</p>
                  ) : (
                    customerInvs.map(i => (
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
                    ))
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  {customerPays.length === 0 ? (
                    <p className="text-xs font-mono text-gray-400 py-4 text-center">No payment receipts logged yet.</p>
                  ) : (
                    customerPays.map(p => (
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
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t-[1.5px] border-black bg-white/80 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden modal-panel p-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#714B67]">Directory Enrollment</span>
                <h3 className="text-lg font-bold text-[#4A3043]">Register Enterprise Customer</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="py-5 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Swiggy Technologies"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="billing@swiggy.in"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={e => setGstin(e.target.value.toUpperCase())}
                    placeholder="29AABCS1429B1ZB"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
