import { useState } from 'react'
import { USERS, type User } from '../data/seed'
import { Badge, Btn } from '../components/ui'
import { MODELS } from '../GatewayPage'
import { Settings, Shield, Key, Building2, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'users' | 'ai'>('company')
  const [usersList, setUsersList] = useState<User[]>(USERS)
  const [testResult, setTestResult] = useState<string>('')

  // AI Provider state
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    chatgpt: 'sk-proj-**********************',
    deepseek: 'sk-ds-**********************',
    gemini: 'AIzaSy**********************',
    claude: 'sk-ant-**********************',
    lovable: 'lvb_tok_**********************',
  })

  const testProvider = (name: string) => {
    setTestResult(`Connection to ${name} API validated successfully (latency: 142ms, status: 200 OK).`)
    setTimeout(() => setTestResult(''), 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Workspace Configuration & Security</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Admin Only · RBAC Permissions, Billing Engine Rules & AI Provider Credentials
          </p>
        </div>
      </div>

      {testResult && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-900 text-xs font-mono rounded flex justify-between items-center">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-700" />
            {testResult}
          </span>
          <button onClick={() => setTestResult('')} className="font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--line)] gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('company')}
          className={`py-2 px-3 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'company'
              ? 'border-[var(--line-strong)] text-[var(--ink)] bg-[var(--surface-2)]'
              : 'border-transparent text-[var(--ink-40)]'
          }`}
        >
          Company & Billing Rules
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-3 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'border-[var(--line-strong)] text-[var(--ink)] bg-[var(--surface-2)]'
              : 'border-transparent text-[var(--ink-40)]'
          }`}
        >
          Users & RBAC Matrix
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`py-2 px-3 uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ai'
              ? 'border-[var(--line-strong)] text-[var(--ink)] bg-[var(--surface-2)]'
              : 'border-transparent text-[var(--ink-40)]'
          }`}
        >
          AI Providers & API Endpoints
        </button>
      </div>

      {activeTab === 'company' && (
        <div className="border border-[var(--line-strong)] bg-white p-6 font-mono text-xs space-y-6">
          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-[11px] text-[var(--ink-60)] mb-1">Legal Entity Name</label>
              <input
                type="text"
                defaultValue="Brightloop Software Systems Private Limited"
                className="w-full px-3 py-2 border border-[var(--line)] rounded bg-[var(--surface-2)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Corporate GSTIN</label>
                <input
                  type="text"
                  defaultValue="33AAACB9876Z1Z8"
                  className="w-full px-3 py-2 border border-[var(--line)] rounded bg-[var(--surface-2)]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-60)] mb-1">Default Currency</label>
                <input
                  type="text"
                  defaultValue="INR (₹) - Indian Rupee"
                  disabled
                  className="w-full px-3 py-2 border border-[var(--line)] rounded bg-zinc-100 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-[var(--ink-60)] mb-1">Recurring Billing Execution Schedule</label>
              <input
                type="text"
                defaultValue="0 0 * * * (Every day at 00:00 UTC / 05:30 IST)"
                className="w-full px-3 py-2 border border-[var(--line)] rounded bg-[var(--surface-2)]"
              />
            </div>
            <button className="px-4 py-2 bg-[var(--accent)] text-white font-bold rounded cursor-pointer">
              Save Configuration Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="border border-[var(--line-strong)] bg-white p-6 font-mono text-xs space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-[var(--ink)]">Authorized User Accounts & Role Guard</h3>
            <span className="text-[10px] text-[var(--ink-40)]">Admin Only Action: Create Staff</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--line-strong)] text-[var(--ink-40)]">
                <th className="py-2">NAME</th>
                <th className="py-2">EMAIL</th>
                <th className="py-2">SYSTEM ROLE</th>
                <th className="py-2">LAST LOGIN</th>
                <th className="py-2 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-[var(--surface-2)]">
                  <td className="py-2.5 font-bold">{u.name}</td>
                  <td className="py-2.5 text-[var(--ink-60)]">{u.email}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 border border-[var(--line)] rounded bg-[var(--surface-2)] font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 text-[var(--ink-40)]">{u.lastLoginAt}</td>
                  <td className="py-2.5 text-right">
                    <Badge variant={u.isActive ? 'ok' : 'neutral'}>
                      {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="border border-[var(--line-strong)] bg-white p-6 font-mono text-xs space-y-4">
          <p className="text-[11px] text-[var(--ink-60)]">
            Configure server-side encrypted credentials for live AI generation in the AI Design Studio.
          </p>
          <div className="space-y-4 max-w-2xl">
            {MODELS.map(m => (
              <div key={m.id} className="p-4 border border-[var(--line)] rounded bg-[var(--surface-2)] space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <m.Icon width={16} height={16} style={{ color: m.iconColor }} />
                    <span className="font-bold text-sm text-[var(--ink)]">{m.name}</span>
                    <span className="text-[10px] text-[var(--ink-40)]">({m.provider})</span>
                  </div>
                  <button
                    onClick={() => testProvider(m.name)}
                    className="px-2.5 py-1 border border-[var(--line-strong)] text-[10px] uppercase font-bold bg-white rounded hover:bg-zinc-100 cursor-pointer"
                  >
                    Test Connection
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeys[m.id] || ''}
                    onChange={e => setApiKeys({ ...apiKeys, [m.id]: e.target.value })}
                    className="flex-1 px-3 py-1.5 border border-[var(--line)] rounded bg-white text-xs font-mono"
                  />
                  <button className="px-3 py-1.5 bg-[var(--line-strong)] text-white text-[10px] font-bold rounded">
                    Save Key
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

