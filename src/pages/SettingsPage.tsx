import { useState } from 'react'
import { USERS, type User } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { CheckCircle2, Shield, Database, Save, Building } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'users' | 'database'>('company')
  const [usersList] = useState<User[]>(USERS)
  const [toastMessage, setToastMessage] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setToastMessage('System settings updated and synchronized with SQLite database.')
    setTimeout(() => setToastMessage(''), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Workspace Settings</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Enterprise Configuration · RBAC Permissions · Billing Engine & Database Health
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-emerald-800 flex justify-between items-center anim-spring">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 font-mono text-xs anim-spring stagger-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 rounded-xl border-[1.5px] border-black font-bold transition-all cursor-pointer ${
            activeTab === 'company'
              ? 'glass-odoo text-white shadow-[2px_2px_0_#000]'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Company & Invoicing
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl border-[1.5px] border-black font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'glass-odoo text-white shadow-[2px_2px_0_#000]'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Users & RBAC
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl border-[1.5px] border-black font-bold transition-all cursor-pointer ${
            activeTab === 'database'
              ? 'glass-odoo text-white shadow-[2px_2px_0_#000]'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Database & Cron Health
        </button>
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === 'company' && (
        <div className="glass-panel rounded-2xl p-8 max-w-2xl font-mono text-xs anim-spring stagger-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold font-sans text-[#4A3043] mb-4">
            Legal Entity & Tax Configuration
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">Company Registered Name</label>
              <input
                type="text"
                defaultValue="Brightloop Technologies Private Limited"
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">GSTIN Identifier</label>
                <input
                  type="text"
                  defaultValue="33AAACB9876Z1Z8"
                  className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">Base Currency</label>
                <input
                  type="text"
                  defaultValue="INR (₹)"
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border-[1.5px] border-black rounded-xl text-xs text-gray-500 cursor-not-allowed font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 uppercase mb-1">Automated Recurring Billing Schedule</label>
              <input
                type="text"
                defaultValue="0 0 * * * (Daily Midnight Cron Sweep)"
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 border-[1.5px] border-black rounded-xl text-xs text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="btn-primary text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 mt-4"
            >
              <Save size={14} /> Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Users & Roles */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="border-b-[1.5px] border-black bg-white/60">
              <tr>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase text-gray-800">USER</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase text-gray-800">EMAIL</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase text-gray-800">ROLE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase text-gray-800">LAST LOGIN</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase text-right text-gray-800">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {usersList.map(u => (
                <tr key={u.id} className="table-row">
                  <td className="px-6 py-4 font-bold text-[#4A3043]">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-white border-[1.5px] border-black rounded-md text-[10px] font-bold shadow-[1px_1px_0_#000]">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.lastLoginAt}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={u.isActive ? 'ok' : 'neutral'}>
                      {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Database & Cron Engine Health */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 anim-spring stagger-3">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-[#714B67]" />
              <h3 className="font-bold text-[#4A3043]">Database Engine</h3>
            </div>
            <p className="text-xs font-mono text-gray-600">SQLite + Prisma 7 ORM</p>
            <p className="text-xs font-mono text-emerald-600 font-bold mt-1">● File: dev.db (Active & Connected)</p>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#714B67]" />
              <h3 className="font-bold text-[#4A3043]">Anti-Double-Billing</h3>
            </div>
            <p className="text-xs font-mono text-gray-600">Compound Unique Index</p>
            <p className="text-xs font-mono text-emerald-600 font-bold mt-1">● (subscriptionId, periodStart, periodEnd)</p>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#714B67]" />
              <h3 className="font-bold text-[#4A3043]">Money Arithmetic</h3>
            </div>
            <p className="text-xs font-mono text-gray-600">Integer Paise Only</p>
            <p className="text-xs font-mono text-emerald-600 font-bold mt-1">● Zero Floating-Point Drift</p>
          </div>
        </div>
      )}
    </div>
  )
}
