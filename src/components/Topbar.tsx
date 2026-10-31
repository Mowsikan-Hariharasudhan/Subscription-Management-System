import { Bell, Search, Plus, ChevronDown, Check } from 'lucide-react'
import { useAuth } from '../auth'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { MODELS, type ModelId } from '../GatewayPage'

export default function Topbar({ breadcrumb }: { breadcrumb?: string }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  const [activeModel, setActiveModel] = useState<ModelId>(() => {
    return (localStorage.getItem('bl.provider') as ModelId) || 'deepseek'
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentModelObj = MODELS.find(m => m.id === activeModel) || MODELS[1]

  const switchModel = (id: ModelId) => {
    setActiveModel(id)
    localStorage.setItem('bl.provider', id)
    setSwitcherOpen(false)
  }

  return (
    <header className="h-[52px] border-b border-[var(--line)] bg-white flex items-center justify-between px-5 shrink-0 sticky top-0 z-30">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-mono font-semibold uppercase text-[var(--ink-40)] tracking-wider">
          BRIGHTLOOP / {breadcrumb || 'OPERATIONS'}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-40)]" />
          <input
            type="text"
            placeholder="Search (⌘K)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-7 pr-3 py-1 text-xs border border-[var(--line)] rounded bg-[var(--surface-2)] text-[var(--ink)] placeholder:text-[var(--ink-40)] focus:border-[var(--accent)] focus:bg-white focus:outline-none w-44 transition-all"
          />
        </div>

        {/* Quick Action */}
        <button
          onClick={() => navigate('/deepseek/subscriptions')}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--accent)] text-white rounded hover:bg-blue-900 transition-colors shadow-xs"
        >
          <Plus size={13} />
          <span>New Quote</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--ink-60)] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.75} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--bad)] rounded-full border border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[var(--line-strong)] rounded-lg shadow-lg p-3 z-50 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--line)] mb-2 font-mono uppercase text-[10px] text-[var(--ink-40)] font-semibold">
                <span>Alerts & Notifications</span>
                <span className="text-[var(--accent)]">3 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-[var(--surface-2)] rounded border border-[var(--line)]">
                  <p className="font-semibold text-[var(--ink)]">Billing Batch Executed</p>
                  <p className="text-[11px] text-[var(--ink-60)]">142 recurring invoices confirmed with zero errors.</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                  <p className="font-semibold text-yellow-900">Overdue Notice: CUS-010</p>
                  <p className="text-[11px] text-yellow-800">TCS Mumbai invoice INV-2025-000012 is 14 days overdue.</p>
                </div>
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <p className="font-semibold text-green-900">Payment Reconciled</p>
                  <p className="text-[11px] text-green-800">Razorpay Tech settled ₹94,400 via UPI.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI ROUTE HOT-SWAPPER BADGE */}
        <div className="relative" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent)] px-2.5 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <currentModelObj.Icon width={13} height={13} style={{ color: currentModelObj.iconColor }} />
            <span>ROUTE: {currentModelObj.name}</span>
            <ChevronDown size={11} />
          </button>

          {switcherOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[var(--line-strong)] rounded-md shadow-lg py-1 z-50 text-xs font-mono">
              <div className="px-3 py-1.5 border-b border-[var(--line)] text-[10px] text-[var(--ink-40)] uppercase font-semibold">
                Hot-Swap UI Route Engine
              </div>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => switchModel(m.id)}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[var(--surface-2)] transition-colors text-[var(--ink)]"
                >
                  <div className="flex items-center gap-2">
                    <m.Icon width={14} height={14} style={{ color: m.iconColor }} />
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-[9px] text-[var(--ink-40)]">{m.provider}</span>
                  </div>
                  {activeModel === m.id && <Check size={12} className="text-[var(--accent)]" />}
                </button>
              ))}
              <div className="p-2 border-t border-[var(--line)] bg-[var(--surface-2)] text-[9px] text-[var(--ink-40)]">
                Demo affordance: labels route session state without altering data contracts.
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--line)]">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)] flex items-center justify-center font-mono text-[10px] font-bold text-[var(--accent)]">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-none">{user.name}</p>
              <p className="text-[9px] font-mono text-[var(--ink-40)] uppercase mt-0.5">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
