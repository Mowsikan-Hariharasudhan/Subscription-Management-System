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
  Percent,
  ShieldCheck,
  ScrollText,
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

  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Executive Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Customer Accounts', icon: Users, href: '/customers' },
      ],
    },
    {
      title: 'CATALOG & PLANS',
      items: [
        { label: 'Products & Variants', icon: Package, href: '/products' },
        { label: 'Subscription Plans', icon: Layers, href: '/plans' },
      ],
    },
    {
      title: 'COMMERCIAL',
      items: [
        { label: 'Quotation Blueprints', icon: ScrollText, href: '/quotation-templates' },
        { label: 'Quotations', icon: FileText, href: '/quotations' },
        { label: 'Subscriptions', icon: Repeat, href: '/subscriptions' },
      ],
    },
    {
      title: 'BILLING & FINANCE',
      items: [
        { label: 'Recurring Invoices', icon: Receipt, href: '/invoices' },
        { label: 'Payment Ledger', icon: CreditCard, href: '/payments' },
        { label: 'Discount Engine', icon: Tag, href: '/discounts' },
      ],
    },
  ];

  const adminGroup = {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Tax Rules & GST', icon: Percent, href: '/settings/taxes' },
      { label: 'Staff Management', icon: ShieldCheck, href: '/settings/staff' },
    ],
  };

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
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-plum-deep text-white flex flex-col border-r border-[#4A3750] transition-transform duration-300 ease-in-out lg:translate-x-0 select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-[#2D2131]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-plum-primary flex items-center justify-center font-bold text-white text-base shadow-sm border border-white/20 tracking-wider">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight font-serif text-white leading-none">
                BRIGHTLOOP
              </span>
              <span className="text-[9px] uppercase tracking-widest text-plum-muted font-mono font-semibold mt-0.5">
                Subscription Cloud
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links grouped */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 py-1 text-[9px] font-mono font-bold tracking-wider uppercase text-plum-muted/90">
                {group.title}
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-[#4C364F] text-white font-semibold shadow-xs border-l-[3px] border-[#D1ECF1]'
                          : 'text-white/75 hover:text-white hover:bg-white/[0.06]'
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105 text-white/70 group-hover:text-white" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}

          {isAdmin && (
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="px-3 py-1 text-[9px] font-mono font-bold tracking-wider uppercase text-plum-muted/90">
                {adminGroup.title}
              </div>
              <nav className="space-y-0.5">
                {adminGroup.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-[#4C364F] text-white font-semibold shadow-xs border-l-[3px] border-[#D1ECF1]'
                          : 'text-white/75 hover:text-white hover:bg-white/[0.06]'
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105 text-white/70 group-hover:text-white" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* System Telemetry Status Footer */}
        <div className="p-3 border-t border-white/10 bg-[#281C2C] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Billing Engine Active</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 text-[9px] font-bold">
              v1.0
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-white/40 font-mono">
            <span>SQLite WAL Mode</span>
            <span className="text-plum-muted font-semibold">Odoo Hackathon '26</span>
          </div>
        </div>
      </aside>
    </>
  );
};
