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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-border-main flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border-main bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-plum-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
              B
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-text-primary block leading-tight">
                Brightloop
              </span>
              <span className="text-[11px] text-text-secondary leading-tight block mt-0.5">
                Integrated Subscriptions
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-hover"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors',
                    isActive
                      ? 'bg-plum-primary text-white font-medium shadow-sm'
                      : 'text-[#6B636A] hover:bg-surface-hover hover:text-text-primary font-medium'
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {isAdmin && (
            <div className="pt-3 border-t border-border-main">
              <div className="px-3.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-text-secondary">
                Governance & Admin
              </div>
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors',
                        isActive
                          ? 'bg-plum-primary text-white font-medium shadow-sm'
                          : 'text-[#6B636A] hover:bg-surface-hover hover:text-text-primary font-medium'
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-border-main bg-surface-main">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-border-main text-xs text-text-secondary shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-text-primary text-[11px]">System Ready</span>
            </div>
            <span className="font-mono text-[10px] text-text-secondary font-semibold">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
