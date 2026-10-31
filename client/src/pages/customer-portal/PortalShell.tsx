import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, User, LogOut, Home, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PORTAL_NAV = [
  { to: '/portal', icon: Home, label: 'Overview', end: true },
  { to: '/portal/subscriptions', icon: Repeat, label: 'My Subscriptions', end: false },
  { to: '/portal/invoices', icon: Receipt, label: 'My Invoices', end: false },
  { to: '/portal/payments', icon: CreditCard, label: 'Payment History', end: false },
  { to: '/portal/account', icon: User, label: 'Account', end: false },
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
    <aside className="w-64 bg-plum-deep flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold text-lg flex items-center justify-center">B</div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Brightloop</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Customer Portal</p>
          </div>
        </div>
      </div>

      {/* Customer info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-plum-primary text-white text-xs font-bold flex items-center justify-center">
            {user?.email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.customer?.name || user?.email}</p>
            <p className="text-white/50 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {PORTAL_NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 text-white font-semibold border-l-2 border-white/60'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
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
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Mobile top bar */}
        <header className="h-14 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-text-secondary hover:bg-surface-main transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-plum-deep text-white font-bold text-sm flex items-center justify-center">B</div>
            <span className="font-bold text-plum-deep text-sm">Brightloop Portal</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
