import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, RefreshCw, Package, Calendar, Tag, Receipt,
  CreditCard, BarChart2, ShieldCheck, Settings, LogOut, ChevronLeft
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
    section: 'Sales & Billing',
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
    section: 'Management',
    items: [
      { label: 'Activity Logs', to: '/activity',      icon: ShieldCheck, roles: ['ADMIN'] },
      { label: 'Settings',      to: '/settings',      icon: Settings, roles: ['ADMIN'] },
    ],
  },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ collapsed: propCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth()
  const loc = useLocation()
  const [internalCollapsed, setInternalCollapsed] = useState(false)

  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed
  const handleToggle = onToggle || (() => setInternalCollapsed(prev => !prev))

  return (
    <aside
      className={`relative bg-white/85 backdrop-blur-2xl border-r-[1.5px] border-black flex flex-col flex-shrink-0 z-20 h-screen select-none shadow-[4px_0_20px_rgba(0,0,0,0.02)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? 'w-[4.75rem]' : 'w-[16.25rem]'
      }`}
    >
      {/* Floating Arrow Toggle Button for closing / expanding left navbar */}
      <button
        onClick={handleToggle}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-white border-[1.5px] border-black shadow-[2px_2px_0_#000] flex items-center justify-center text-[#714B67] hover:text-[#4A3043] hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        <ChevronLeft
          size={14}
          strokeWidth={2.5}
          className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Brand Header */}
      <div
        className={`h-20 flex items-center border-b-[1.5px] border-black shrink-0 bg-white/40 transition-all duration-300 ${
          isCollapsed ? 'justify-center px-2' : 'px-6'
        }`}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 glass-odoo">
          B
        </div>
        {!isCollapsed && (
          <div className="flex flex-col ml-3 overflow-hidden transition-opacity duration-200">
            <span className="font-bold text-[0.9375rem] tracking-tight text-[#4A3043] leading-tight truncate">
              Brightloop
            </span>
            <span className="text-[0.625rem] text-gray-500 font-semibold tracking-wide mt-0.5 uppercase tracking-wider truncate">
              Enterprise Suite
            </span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className={`flex-1 py-4 overflow-y-auto space-y-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {NAV.map(group => {
          const visibleItems = group.items.filter(item =>
            !item.roles || (user && item.roles.includes(user.role))
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={group.section} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 mb-1.5 text-[0.6875rem] font-bold text-gray-500 tracking-[0.15em] uppercase font-mono truncate">
                  {group.section}
                </div>
              ) : (
                <div className="h-px bg-black/10 my-2 mx-2" />
              )}
              <div className="space-y-1">
                {visibleItems.map(item => {
                  const Icon = item.icon
                  const active = loc.pathname === item.to || loc.pathname.startsWith(item.to + '/')
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center rounded-xl text-[0.8125rem] transition-all duration-200 group ${
                        isCollapsed ? 'justify-center h-10 w-10 mx-auto p-0' : 'px-4 py-2.5'
                      } ${
                        active
                          ? 'glass-odoo text-white font-semibold shadow-md border-[1.5px] border-black translate-x-0.5'
                          : 'text-gray-700 hover:bg-white hover:text-[#4A3043] font-medium border border-transparent hover:border-black hover:shadow-[2px_2px_0_#000]'
                      }`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        className={`transition-transform duration-200 shrink-0 ${
                          !isCollapsed ? 'mr-3' : ''
                        } ${
                          active ? 'opacity-95' : 'opacity-60 group-hover:scale-110 group-hover:rotate-6 text-[#714B67]'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User Info & Logout Footer */}
      {user && (
        <div
          className={`border-t-[1.5px] border-black shrink-0 bg-white/60 transition-all duration-300 ${
            isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-4'
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#714B67] to-[#4A3043] text-white flex items-center justify-center font-mono text-xs font-bold border-[1.5px] border-black shadow-[1px_1px_0_#000] shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[0.8125rem] font-bold text-[#4A3043] truncate leading-tight">{user.name}</p>
                  <span className="inline-block text-[0.5625rem] font-bold bg-white text-[#714B67] border border-black px-1.5 py-0.2 rounded uppercase tracking-wider mt-0.5 shadow-xs">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="w-8 h-8 bg-white border-[1.5px] border-black rounded-lg flex items-center justify-center text-[#714B67] hover:text-[#4A3043] hover:shadow-[2px_2px_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer shrink-0"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                title={`${user.name} (${user.role})`}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#714B67] to-[#4A3043] text-white flex items-center justify-center font-mono text-xs font-bold border-[1.5px] border-black shadow-[1px_1px_0_#000] cursor-pointer"
              >
                {user.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="w-8 h-8 bg-white border-[1.5px] border-black rounded-lg flex items-center justify-center text-[#714B67] hover:text-[#4A3043] hover:shadow-[2px_2px_0_#000] transition-all cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
