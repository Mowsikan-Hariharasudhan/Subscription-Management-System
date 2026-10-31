import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, User, LogOut, Home, Menu, X, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent flex relative">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden modal-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Portal Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-white/85 backdrop-blur-2xl border-r-[1.5px] border-black flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.04)]',
          isCollapsed ? 'w-[4.75rem]' : 'w-[16.25rem]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
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
                  Subscriber Portal
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
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
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-black rounded-lg hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Card */}
        {!isCollapsed && (
          <div className="px-5 py-4 border-b-[1.5px] border-black/10 bg-white/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full glass-odoo text-white text-xs font-bold flex items-center justify-center shadow-xs">
                {user?.email?.substring(0, 2).toUpperCase() || 'CU'}
              </div>
              <div className="min-w-0">
                <p className="text-odoo-dark text-xs font-bold truncate">
                  {user?.customer?.name || user?.email}
                </p>
                <p className="text-gray-500 text-[0.6875rem] truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {PORTAL_NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={isCollapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
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
              <Icon className={cn('w-4 h-4 shrink-0 transition-transform group-hover:scale-110', !isCollapsed && 'mr-3')} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-3.5 border-t-[1.5px] border-black bg-white/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-[1.5px] border-black bg-white text-xs font-bold text-rose-600 hover:bg-rose-50 shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isCollapsed ? 'lg:pl-[4.75rem]' : 'lg:pl-[16.25rem]'
        )}
      >
        {/* Top Navbar */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b-[1.5px] border-black sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border-[1.5px] border-black text-odoo-dark hover:bg-gray-50 shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[0.8125rem] font-medium text-gray-500">
              <span className="hover:text-odoo cursor-pointer transition-colors">Customer Portal</span>
              <span className="text-gray-400">/</span>
              <span className="text-odoo-dark font-bold">My Account</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border-[1.5px] border-black shadow-[2px_2px_0_#000] text-[0.6875rem] font-bold text-odoo-dark uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Tenant
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[85rem] w-full mx-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
