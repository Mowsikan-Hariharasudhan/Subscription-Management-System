import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, Shield, CheckCircle2, ChevronDown, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/badge';

interface TopNavProps {
  onOpenSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSidebar }) => {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (email?: string) => {
    if (!email) return 'BL';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left section: mobile hamburger & breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-main transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-plum-primary tracking-wider uppercase">
            Brightloop Core
          </span>
          <span className="text-border-main font-bold">/</span>
          <span className="text-xs text-text-secondary font-medium">
            Recurring Billing & Subscriptions
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* System telemetry indicator pill */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-surface-main border border-border-main text-[11px] font-mono text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Billing Engine: 00:01 Cron</span>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg border border-transparent hover:border-border-main hover:bg-surface-main transition-all cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-md bg-plum-deep text-white font-bold text-xs flex items-center justify-center border border-white/20 shadow-xs">
              {getInitials(user?.email)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-primary truncate max-w-[140px]">
                {user?.customer?.name || user?.email}
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-plum-light text-plum-primary font-bold">
                  {role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-border-main py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-border-main/60 bg-surface-main/40">
                <p className="text-[10px] font-mono text-text-secondary uppercase">Signed in as</p>
                <p className="text-xs font-bold text-text-primary truncate mt-0.5">{user?.email}</p>
                <div className="mt-1.5 flex items-center space-x-1.5">
                  <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px]">
                    {role}
                  </Badge>
                  {user?.customer?.companyName && (
                    <span className="text-[11px] text-text-secondary truncate">
                      {user.customer.companyName}
                    </span>
                  )}
                </div>
              </div>

              <div className="py-1 text-xs">
                <div className="px-4 py-2 text-text-secondary flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-plum-primary" />
                  <span>Brightloop Enterprise 2.0</span>
                </div>
                <div className="px-4 py-2 text-text-secondary flex items-center space-x-2">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Role: {role}</span>
                </div>
              </div>

              <div className="border-t border-border-main/60 pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors cursor-pointer"
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
