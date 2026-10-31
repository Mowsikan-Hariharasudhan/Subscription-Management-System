import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, User, LogOut, Home, Menu, X, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PORTAL_NAV = [
  { to: '/portal', icon: Home, label: 'Overview', end: true },
  { to: '/portal/subscriptions', icon: Repeat, label: 'My Subscriptions', end: false },
  { to: '/portal/invoices', icon: Receipt, label: 'My Invoices', end: false },
  { to: '/portal/payments', icon: CreditCard, label: 'Payment History', end: false },
  { to: '/portal/account', icon: User, label: 'Account Profile', end: false },
];

export const PortalShell: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-border-main flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border-main bg-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-plum-dark text-white font-bold text-sm flex items-center justify-center border border-plum-deep shadow-xs">
            B
          </div>
          <div>
            <p className="text-text-primary font-bold text-sm leading-tight">Brightloop</p>
            <p className="text-text-secondary text-[10px] font-semibold uppercase tracking-widest leading-none mt-0.5">Subscriber Portal</p>
          </div>
        </div>
      </div>

      {/* Customer profile card */}
      <div className="px-3.5 py-3 border-b border-border-main bg-surface-main/50">
        <div className="flex items-center space-x-2.5 p-2 rounded-md bg-white border border-border-main shadow-xs">
          <div className="w-7 h-7 rounded-md bg-plum-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
            {user?.email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-primary text-xs font-semibold truncate leading-tight">
              {user?.customer?.name || user?.email}
            </p>
            <p className="text-text-secondary text-[10px] font-mono truncate leading-none mt-0.5">
              {user?.customer?.companyName || 'Personal'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-0.5">
        <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-text-secondary">
          Customer Area
        </div>
        {PORTAL_NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-plum-surface text-plum-primary font-semibold border-l-2 border-plum-primary rounded-l-none pl-2 shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-main'
              }`
            }
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Icon className="w-4 h-4 shrink-0 transition-colors" />
              <span className="truncate">{label}</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border-main bg-surface-main/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out of portal</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-surface-main flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile top bar */}
        <header className="h-14 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md text-text-secondary hover:bg-surface-main transition-colors cursor-pointer border border-border-main"
            aria-label="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-plum-dark text-white font-bold text-xs flex items-center justify-center">B</div>
            <span className="font-bold text-text-primary text-xs">Customer Portal</span>
          </div>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
