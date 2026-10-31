import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, RefreshCw, Package, Calendar, Tag, Receipt,
  CreditCard, BarChart2, ShieldCheck, Settings, LogOut
} from 'lucide-react'
import { useAuth } from '../auth'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  roles?: string[]
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Sales',
    items: [
      { label: 'Customers',     to: '/customers',     icon: Users },
      { label: 'Quotations',    to: '/quotations',    icon: FileText },
      { label: 'Subscriptions', to: '/subscriptions', icon: RefreshCw },
    ],
  },
  {
    section: 'Catalog',
    items: [
      { label: 'Products',      to: '/products',      icon: Package },
      { label: 'Plans',         to: '/plans',         icon: Calendar },
      { label: 'Discounts',     to: '/discounts',     icon: Tag, roles: ['ADMIN'] },
      { label: 'Tax Rules',     to: '/taxes',         icon: ShieldCheck, roles: ['ADMIN'] },
    ],
  },
  {
    section: 'Finance',
    items: [
      { label: 'Invoices',      to: '/invoices',      icon: Receipt },
      { label: 'Payments',      to: '/payments',      icon: CreditCard },
      { label: 'Reports',       to: '/reports',       icon: BarChart2 },
    ],
  },
  {
    section: 'Workspace',
    items: [
      { label: 'Activity Logs', to: '/activity',      icon: ShieldCheck, roles: ['ADMIN'] },
      { label: 'Settings',      to: '/settings',      icon: Settings, roles: ['ADMIN'] },
    ],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const loc = useLocation()

  return (
    <aside className="w-64 bg-[#724B68] text-white flex flex-col shrink-0 border-r border-[#36283B] h-screen select-none">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="w-6 h-6 bg-white text-[#724B68] flex items-center justify-center font-bold text-sm rounded-sm mr-3">
          B
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-wide">BRIGHTLOOP</span>
          <span className="text-[9px] font-mono text-white/50 tracking-wider">ENTERPRISE SAAS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-5">
        {NAV.map(group => {
          const visibleItems = group.items.filter(item =>
            !item.roles || (user && item.roles.includes(user.role))
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={group.section}>
              <div className="px-6 mb-2 text-xs font-mono text-white/50 tracking-widest uppercase">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon
                  const active = loc.pathname === item.to || loc.pathname.startsWith(item.to + '/')
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-6 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-[#36283B] text-white border-l-2 border-white font-medium'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={15} strokeWidth={1.75} className="shrink-0 text-white/70" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      {user && (
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#36283B]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center font-mono text-xs font-bold border border-white/20">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate leading-none">{user.name}</p>
                <p className="text-[10px] font-mono text-white/50 uppercase mt-0.5">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
