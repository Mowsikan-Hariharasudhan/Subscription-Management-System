import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, User, LogOut, Home, Menu, X, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PORTAL_NAV = [
  { to: '/portal', icon: Home, label: 'Portal Overview', end: true },
  { to: '/portal/subscriptions', icon: Repeat, label: 'My Subscriptions', end: false },
  { to: '/portal/invoices', icon: Receipt, label: 'Invoices & Billing', end: false },
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
    <aside className="w-64 bg-plum-deep text-white flex flex-col h-full border-r border-[#4A3750] select-none">
      {/* Brand area */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-[#2D2131]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-plum-primary text-white font-bold text-base flex items-center justify-center border border-white/20 shadow-xs">
            B
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight font-serif leading-tight">Brightloop</p>
            <p className="text-plum-muted text-[9px] uppercase tracking-widest font-mono font-semibold">Subscriber Portal</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Customer profile snippet */}
      <div className="px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-plum-primary/80 text-white text-xs font-bold flex items-center justify-center shrink-0 border border-white/10">
            {user?.email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate leading-tight">
              {user?.customer?.name || user?.email}
            </p>
            <p className="text-plum-muted text-[10px] truncate mt-0.5">
              {user?.customer?.companyName || user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[9px] font-mono font-bold tracking-wider uppercase text-plum-muted">
          Self-Service Menu
        </div>
        <nav className="space-y-0.5">
          {PORTAL_NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#4C364F] text-white font-semibold shadow-xs border-l-[3px] border-[#D1ECF1]'
                    : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105 text-white/70 group-hover:text-white" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-3 border-t border-white/10 bg-[#281C2C] space-y-2">
        <div className="flex items-center space-x-2 text-[10px] text-white/60 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Session</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium text-white/70 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer border border-white/5"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile top bar */}
        <header className="h-16 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-text-secondary hover:bg-surface-main transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-plum-deep text-white font-bold text-sm flex items-center justify-center">
              B
            </div>
            <span className="font-bold text-plum-deep text-sm font-serif">Brightloop Portal</span>
          </div>
          <div className="w-9" />
        </header>

        {/* Desktop top announcement / telemetry bar */}
        <div className="hidden lg:flex h-12 bg-white border-b border-border-main px-8 items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-text-primary">Welcome, {user?.customer?.name || user?.email}</span>
            <span className="text-border-main">•</span>
            <span>Self-service billing overview</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-plum-primary" />
            <span>Customer Portal Mode</span>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
