import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, RefreshCw, Package, Calendar, Tag, Receipt,
  CreditCard, BarChart2, Wand2, Activity, Settings, ChevronLeft, ChevronRight,
  LogOut, Percent,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../auth'

interface NavItem { label: string; to: string; icon: React.ElementType; roles?: string[] }

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', to: '/deepseek/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Sales',
    items: [
      { label: 'Customers',      to: '/deepseek/customers',     icon: Users },
      { label: 'Quotations',     to: '/deepseek/quotations',    icon: FileText },
      { label: 'Subscriptions',  to: '/deepseek/subscriptions', icon: RefreshCw },
    ],
  },
  {
    section: 'Catalog',
    items: [
      { label: 'Products',   to: '/deepseek/products',   icon: Package },
      { label: 'Plans',      to: '/deepseek/plans',      icon: Calendar },
      { label: 'Discounts',  to: '/deepseek/discounts',  icon: Percent, roles: ['ADMIN'] },
      { label: 'Tax Rules',  to: '/deepseek/taxes',      icon: Tag, roles: ['ADMIN'] },
    ],
  },
  {
    section: 'Finance',
    items: [
      { label: 'Invoices',  to: '/deepseek/invoices',  icon: Receipt },
      { label: 'Payments',  to: '/deepseek/payments',  icon: CreditCard },
      { label: 'Reports',   to: '/deepseek/reports',   icon: BarChart2 },
    ],
  },
  {
    section: 'Workspace',
    items: [
      { label: 'AI Studio',       to: '/deepseek/studio',   icon: Wand2, roles: ['ADMIN'] },
      { label: 'Activity Logs',   to: '/deepseek/activity', icon: Activity, roles: ['ADMIN'] },
    ],
  },
  {
    section: 'Config',
    items: [
      { label: 'Settings', to: '/deepseek/settings', icon: Settings, roles: ['ADMIN'] },
    ],
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const loc = useLocation()

  const w = collapsed ? 'w-14' : 'w-[232px]'

  return (
    <aside className={`${w} shrink-0 h-screen flex flex-col border-r border-[var(--line)] bg-white transition-all duration-150 overflow-hidden`}>
      {/* Brand */}
      <div className={`flex items-center h-[52px] border-b border-[var(--line)] shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-2.5'}`}>
        <div className="w-7 h-7 bg-[var(--ink)] rounded flex items-center justify-center shrink-0">
          <span className="font-mono text-xs font-semibold text-white">B</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-[var(--ink)] leading-none">Brightloop</p>
            <p className="text-[9px] font-mono font-medium uppercase tracking-widest text-[var(--ink-40)] mt-0.5">DeepSeek Edition</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV.map(group => {
          const visibleItems = group.items.filter(item =>
            !item.roles || (user && item.roles.includes(user.role))
          )
          if (visibleItems.length === 0) return null
          return (
            <div key={group.section}>
              {!collapsed && (
                <p className="px-2 mb-1 text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--ink-40)]">
                  {group.section}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon
                  const active = loc.pathname === item.to || loc.pathname.startsWith(item.to + '/')
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 px-2 py-1.5 rounded text-sm font-medium transition-colors
                        ${collapsed ? 'justify-center' : ''}
                        ${active
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-l-2 border-[var(--accent)] pl-[6px]'
                          : 'text-[var(--ink-60)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
                        }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={15} strokeWidth={1.75} className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-[var(--line)] p-2 shrink-0">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-mono font-semibold text-[var(--accent)]">{user.name[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--ink)] truncate leading-none">{user.name}</p>
              <p className="text-[9px] font-mono text-[var(--ink-40)] uppercase tracking-wide mt-0.5">{user.role}</p>
            </div>
            <button onClick={logout} title="Sign out" className="text-[var(--ink-40)] hover:text-[var(--bad)] transition-colors p-1">
              <LogOut size={13} strokeWidth={1.75} />
            </button>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center w-full py-1 rounded hover:bg-[var(--surface-2)] text-[var(--ink-40)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  )
}

