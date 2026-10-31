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
  Sparkles,
  ChevronRight,
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
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
        <div className="h-14 flex items-center justify-between px-5 border-b border-border-main bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-plum-dark text-white flex items-center justify-center font-bold text-sm shadow-xs border border-plum-deep">
              B
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-text-primary block leading-none">
                Brightloop
              </span>
              <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest leading-none mt-1 block">
                Subscription Ops
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-main"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-text-secondary">
              Core Operations
            </div>
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-plum-surface text-plum-primary font-semibold border-l-2 border-plum-primary rounded-l-none pl-2 shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-main'
                    )
                  }
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <item.icon className="w-4 h-4 shrink-0 transition-colors" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                </NavLink>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div className="pt-2 border-t border-border-main">
              <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-text-secondary">
                Governance & Admin
              </div>
              <nav className="space-y-0.5">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group',
                        isActive
                          ? 'bg-plum-surface text-plum-primary font-semibold border-l-2 border-plum-primary rounded-l-none pl-2 shadow-xs'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-main'
                      )
                    }
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <item.icon className="w-4 h-4 shrink-0 transition-colors" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer info pill */}
        <div className="p-3 border-t border-border-main bg-surface-main/60">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white border border-border-main text-[11px] text-text-secondary">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-text-primary">System Ready</span>
            </div>
            <span className="font-mono text-[10px] text-text-secondary font-semibold">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
