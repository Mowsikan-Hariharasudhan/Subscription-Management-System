import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Repeat, Receipt, CreditCard, User, LogOut, Home, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PortalShell: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', to: '/portal', icon: Home, end: true },
    { label: 'My Subscriptions', to: '/portal/subscriptions', icon: Repeat },
    { label: 'My Invoices', to: '/portal/invoices', icon: Receipt },
    { label: 'Payment History', to: '/portal/payments', icon: CreditCard },
    { label: 'Account Profile', to: '/portal/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-main text-text-primary flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-border-main sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border-main"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-plum-primary flex items-center justify-center text-white font-bold text-xs">
                BL
              </div>
              <span className="font-bold text-base text-text-primary tracking-tight">Brightloop</span>
              <span className="text-xs text-text-secondary font-mono bg-surface-subtle px-2 py-0.5 rounded-full border border-border-subtle hidden sm:inline">
                Customer Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-plum-surface text-plum-primary border border-plum-border'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User & Actions */}
          <div className="flex items-center space-x-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-text-primary leading-tight truncate max-w-[150px]">
                {user?.customer?.name || user?.email}
              </p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Subscriber</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-border-main text-text-secondary hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-main bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-plum-surface text-plum-primary border border-plum-border'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};
