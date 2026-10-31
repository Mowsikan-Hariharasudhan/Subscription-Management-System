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
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-plum-deep text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-plum-primary flex items-center justify-center font-bold text-white text-lg shadow-sm">
              B
            </div>
            <span className="text-xl font-bold tracking-tight font-serif text-white">
              Brightloop
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-plum-muted">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-plum-primary/30 text-white border-l-4 border-plum-primary font-semibold pl-2'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-plum-muted">
                Administration
              </div>
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                        isActive
                          ? 'bg-plum-primary/30 text-white border-l-4 border-plum-primary font-semibold pl-2'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-black/10 text-xs text-white/50 flex items-center justify-between">
          <span>Brightloop v1.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </aside>
    </>
  );
};

