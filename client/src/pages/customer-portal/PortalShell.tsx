import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, User, LogOut, Home, Menu, X, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PORTAL_NAV = [
  { to: '/portal', icon: Home, label: 'Overview', end: true },
  { to: '/portal/explore', icon: Sparkles, label: 'Explore & Buy Apps', end: false },
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
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border-main bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-plum-primary text-white font-bold text-base flex items-center justify-center shadow-sm">
            B
          </div>
          <div>
            <p className="text-text-primary font-bold text-sm leading-tight">Brightloop</p>
            <p className="text-text-secondary text-[11px] leading-tight block mt-0.5">Subscriber Portal</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Customer profile card */}
      <div className="p-3 border-b border-border-main bg-surface-main">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-border-main shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#F5E6EE] text-plum-primary text-xs font-bold flex items-center justify-center shrink-0 border border-plum-border">
            {user?.email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-primary text-xs font-bold truncate leading-tight">
              {user?.customer?.name || user?.email}
            </p>
            <p className="text-text-secondary text-[11px] font-mono truncate leading-none mt-0.5">
              {user?.customer?.companyName || 'Subscriber'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-1">
        {PORTAL_NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                isActive
                  ? 'bg-plum-primary text-white font-medium shadow-sm'
                  : 'text-[#6B636A] hover:bg-surface-hover hover:text-text-primary font-medium'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border-main bg-surface-main">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer border border-border-main lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">Subscriber Portal</span>
              <span>•</span>
              <span>{user?.customer?.name || user?.email}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-xl border border-border-main text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              title="Toggle appearance"
              aria-label="Toggle appearance"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-border-main text-text-secondary hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
