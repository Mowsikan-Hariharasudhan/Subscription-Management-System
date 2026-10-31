import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface TopNavProps {
  onOpenSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSidebar }) => {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/customers')) return 'Customers Directory';
    if (path.includes('/products')) return 'Product Catalogue';
    if (path.includes('/plans')) return 'Subscription Plans';
    if (path.includes('/quotations')) return 'Quotations & Blueprints';
    if (path.includes('/subscriptions')) return 'Active Subscriptions';
    if (path.includes('/invoices')) return 'Invoices & Billing';
    if (path.includes('/payments')) return 'Recorded Payments';
    if (path.includes('/discounts')) return 'Discounts & Promotions';
    if (path.includes('/settings/taxes')) return 'Tax Configuration';
    if (path.includes('/settings/staff')) return 'Staff Administration';
    return 'Console';
  };

  const getInitials = (email?: string) => {
    if (!email) return 'BL';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b-[1.5px] border-black sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8">
      {/* Breadcrumbs & Mobile Trigger */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border-[1.5px] border-black text-odoo-dark hover:bg-gray-50 shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[0.8125rem] font-medium text-gray-500">
          <span className="hover:text-odoo cursor-pointer transition-colors">Brightloop</span>
          <span className="text-gray-400">/</span>
          <span className="text-odoo-dark font-bold">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 anim-fade">
        {/* Quick status pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border-[1.5px] border-black shadow-[2px_2px_0_#000] text-[0.6875rem] font-bold text-odoo-dark uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>GST Ready (INR)</span>
        </div>

        <div className="h-8 w-px bg-black/15 mx-1 hidden sm:block" />

        {/* User Info & Actions */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/60 transition-all cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl glass-odoo text-white font-bold text-xs flex items-center justify-center shadow-sm border-[1.5px] border-black">
                {getInitials(user?.email)}
              </div>
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-[0.8125rem] font-bold text-odoo-dark leading-tight truncate max-w-[150px]">
                  {user?.customer?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-[0.5625rem] font-bold bg-white text-odoo border-[1.5px] border-black px-1.5 py-0.2 rounded uppercase tracking-wider mt-0.5 shadow-xs">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </button>

            {/* Direct Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="w-9 h-9 bg-white border-[1.5px] border-black rounded-xl flex items-center justify-center text-odoo hover:text-odoo-dark transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl border-[1.5px] border-black shadow-[0_15px_40px_rgba(0,0,0,0.15)] py-2 z-50 modal-panel">
              <div className="px-5 py-3 border-b-[1.5px] border-black/10">
                <p className="text-xs font-bold text-odoo-dark truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[0.625rem] font-bold uppercase bg-odoo/10 text-odoo px-2 py-0.5 rounded border border-odoo/20">
                    {role} Role
                  </span>
                  <span className="text-[0.625rem] text-gray-500">Node-Cron Active</span>
                </div>
              </div>

              <div className="px-5 py-3 text-xs text-gray-600 space-y-1.5 border-b-[1.5px] border-black/10">
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="w-4 h-4 text-odoo" />
                  <span>Verified Financial Tenant</span>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
