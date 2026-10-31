import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, Shield, Moon, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../../services/invoiceService';

interface TopNavProps {
  onOpenSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSidebar }) => {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const billingMutation = useMutation({
    mutationFn: () => invoiceService.runBillingNow(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      alert(`Billing engine cycle completed: ${res.data?.created ?? 0} invoices generated.`);
    },
  });

  return (
    <header className="h-16 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer border border-border-main"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-text-secondary">
          <span className="font-bold text-text-primary">Brightloop Platform</span>
          <span>•</span>
          <span>Enterprise Subscription Management</span>
        </div>
      </div>

      {/* Right Controls matching reference style */}
      <div className="flex items-center space-x-3">
        {/* Quick action button (like "Punch In" in reference) */}
        {role === 'ADMIN' && (
          <button
            onClick={() => billingMutation.mutate()}
            disabled={billingMutation.isPending}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{billingMutation.isPending ? 'Processing...' : 'Run Billing'}</span>
          </button>
        )}

        {/* Theme pill outline button */}
        <button
          className="p-2 rounded-xl border border-border-main text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          title="Toggle appearance"
          aria-label="Toggle appearance"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* User profile & Role pill */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center space-x-2.5 pl-2 border-l border-border-main">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-text-primary truncate max-w-[140px] leading-tight">
                {user?.customer?.name || (user?.email?.split('@')[0] || 'User')}
              </span>
              <span className="inline-block mt-0.5 self-end">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-plum-surface text-plum-primary border border-plum-border font-mono">
                  {role}
                </span>
              </span>
            </div>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border-main transition-colors cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary font-bold text-xs flex items-center justify-center border border-plum-border">
                {user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl border border-border-main text-text-secondary hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-border-main py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 border-b border-border-main bg-surface-main/40">
                <p className="text-xs font-semibold text-text-primary truncate">{user?.email}</p>
                <div className="mt-1 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Active Session</span>
                </div>
              </div>

              <div className="py-1">
                <div className="px-3.5 py-2 text-xs text-text-secondary flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-plum-primary" />
                  <span className="text-[11px]">Production Environment</span>
                </div>
              </div>

              <div className="border-t border-border-main pt-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
