import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, Shield, ChevronDown, Check, Building2 } from 'lucide-react';
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
    <header className="h-14 bg-white border-b border-border-main sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-main transition-colors cursor-pointer border border-border-main"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-surface-main border border-border-main text-[11px] font-medium text-text-secondary">
            <Building2 className="w-3 h-3 text-plum-primary" />
            <span>Brightloop Software Ltd</span>
          </span>
          <span className="hidden md:inline-block text-[11px] text-text-secondary">
            / Recurring Billing Engine
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Environment / Role pill */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Role:</span>
          <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-md text-[10px] py-0.5 px-2 font-mono uppercase">
            {role}
          </Badge>
        </div>

        <div className="h-4 w-px bg-border-main hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-md hover:bg-surface-main border border-transparent hover:border-border-main transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 rounded-md bg-plum-primary text-white font-semibold text-xs flex items-center justify-center border border-plum-deep shadow-xs">
              {getInitials(user?.email)}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-text-primary truncate max-w-[140px]">
                {user?.customer?.name || user?.email}
              </span>
              <span className="text-[10px] text-text-secondary font-mono">
                {role?.toLowerCase()}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-md shadow-sm border border-border-main py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border-main bg-surface-main/40">
                <p className="text-xs font-semibold text-text-primary truncate">{user?.email}</p>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Active Session</span>
                </div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1.5 text-xs text-text-secondary flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-plum-primary" />
                  <span className="text-[11px]">Production Environment</span>
                </div>
              </div>

              <div className="border-t border-border-main pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors cursor-pointer"
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
