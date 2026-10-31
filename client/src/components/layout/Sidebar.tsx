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
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Customers', icon: Users, href: '/customers' },
    { label: 'Products & Tiers', icon: Package, href: '/products' },
    { label: 'Subscription Plans', icon: Layers, href: '/plans' },
    { label: 'Quotations', icon: FileText, href: '/quotations' },
    { label: 'Subscriptions', icon: Repeat, href: '/subscriptions' },
    { label: 'Invoices', icon: Receipt, href: '/invoices' },
    { label: 'Payment Ledger', icon: CreditCard, href: '/payments' },
    { label: 'Discount Rules', icon: Tag, href: '/discounts' },
  ];

  const adminItems = [
    { label: 'Tax Configuration', icon: Settings, href: '/settings/taxes' },
    { label: 'Staff Management', icon: ShieldCheck, href: '/settings/staff' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-border-main flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-[4.75rem]' : 'w-[16.25rem]'
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'h-16 flex items-center border-b border-border-main bg-white transition-all',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
          )}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-plum-primary text-white flex items-center justify-center font-bold text-base shadow-[2px_2px_0px_#3E2134] border border-[#522D46] shrink-0">
              B
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight text-text-primary block leading-tight truncate">
                  Brightloop
                </span>
                <span className="text-[10px] text-text-secondary leading-tight block mt-0.5 font-medium truncate uppercase tracking-wider">
                  Subscription Ops
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                'hidden lg:flex items-center justify-center w-7 h-7 rounded-lg border border-border-main bg-white hover:bg-surface-hover text-text-secondary hover:text-text-primary shadow-[1px_1px_0px_#E5DFE4] transition-all cursor-pointer',
                isCollapsed && 'mt-2'
              )}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-hover"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onClose()}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-xl text-xs transition-all select-none',
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5',
                    isActive
                      ? 'bg-plum-primary text-white font-semibold border border-[#522D46] shadow-[2px_2px_0px_#3E2134]'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary font-medium border border-transparent hover:border-border-main/60'
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {isAdmin && (
            <div className="pt-3 border-t border-border-main">
              {!isCollapsed && (
                <div className="px-3.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-text-muted">
                  Governance
                </div>
              )}
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-xl text-xs transition-all select-none',
                        isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5',
                        isActive
                          ? 'bg-plum-primary text-white font-semibold border border-[#522D46] shadow-[2px_2px_0px_#3E2134]'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary font-medium border border-transparent hover:border-border-main/60'
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-border-main bg-surface-main">
          {isCollapsed ? (
            <div className="flex justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-700" title="System Ready" />
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-border-main text-xs text-text-secondary shadow-[1px_1px_0px_#E5DFE4]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-700" />
                <span className="font-semibold text-text-primary text-[11px]">System Ready</span>
              </div>
              <span className="font-mono text-[10px] text-text-muted font-bold">v1.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
