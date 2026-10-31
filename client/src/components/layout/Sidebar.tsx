import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  Repeat,
  Receipt,
  CreditCard,
  Tag,
  Settings,
  ShieldCheck,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Customers', icon: Users, href: '/customers' },
    { label: 'Products', icon: Package, href: '/products' },
    { label: 'Plans', icon: Layers, href: '/plans' },
    { label: 'Quotations', icon: FileText, href: '/quotations' },
    { label: 'Subscriptions', icon: Repeat, href: '/subscriptions' },
    { label: 'Invoices', icon: Receipt, href: '/invoices' },
    { label: 'Payments', icon: CreditCard, href: '/payments' },
    { label: 'Discounts', icon: Tag, href: '/discounts' },
  ];

  const adminItems = [
    { label: 'Tax Rules', icon: Settings, href: '/settings/taxes' },
    { label: 'Staff Management', icon: ShieldCheck, href: '/settings/staff' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden modal-backdrop"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-white/85 backdrop-blur-2xl border-r-[1.5px] border-black flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.04)]',
          isCollapsed ? 'w-[4.75rem]' : 'w-[16.25rem]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-4 sm:px-5 border-b-[1.5px] border-black bg-white/40">
          <div className="flex items-center min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base glass-odoo shrink-0 shadow-sm">
              B
            </div>
            {!isCollapsed && (
              <div className="flex flex-col ml-3 overflow-hidden">
                <span className="font-bold text-[0.9375rem] tracking-tight text-odoo-dark leading-tight truncate">
                  Brightloop
                </span>
                <span className="text-[0.625rem] text-gray-500 font-semibold tracking-wide truncate">
                  Subscription SaaS
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Arrow Button */}
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Close sidebar left'}
              className="hidden lg:flex w-7 h-7 bg-white border-[1.5px] border-black rounded-lg items-center justify-center text-odoo hover:text-odoo-dark hover:bg-gray-50 transition-all hover:shadow-[0_2px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <ChevronLeft
                className={cn(
                  'w-4 h-4 transition-transform duration-300',
                  isCollapsed && 'rotate-180'
                )}
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-gray-600 hover:text-black rounded-lg hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[0.6875rem] font-bold tracking-wider uppercase text-gray-400">
                Operations
              </div>
            )}
            <nav className="space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => onClose()}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-xl text-[0.8125rem] transition-all duration-200 group relative',
                      isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5',
                      isActive
                        ? 'glass-odoo text-white font-semibold shadow-md border-[1.5px] border-black scale-[1.01]'
                        : 'text-gray-700 font-medium hover:bg-white hover:text-odoo-dark border border-transparent hover:border-black hover:shadow-[2px_2px_0_#000]'
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                      !isCollapsed && 'mr-3'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div>
              {!isCollapsed && (
                <div className="px-3 mb-2 text-[0.6875rem] font-bold tracking-wider uppercase text-gray-400">
                  Administration
                </div>
              )}
              <nav className="space-y-1.5">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-xl text-[0.8125rem] transition-all duration-200 group relative',
                        isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5',
                        isActive
                          ? 'glass-odoo text-white font-semibold shadow-md border-[1.5px] border-black scale-[1.01]'
                          : 'text-gray-700 font-medium hover:bg-white hover:text-odoo-dark border border-transparent hover:border-black hover:shadow-[2px_2px_0_#000]'
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                        !isCollapsed && 'mr-3'
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer Status */}
        <div className="p-3.5 border-t-[1.5px] border-black bg-white/50 text-[0.6875rem] font-bold text-gray-600 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <span className="tracking-tight">Brightloop Core</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </>
          ) : (
            <div className="mx-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
