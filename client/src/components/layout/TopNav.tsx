import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User as UserIcon, Shield } from 'lucide-react';
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
      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-main transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="hidden sm:inline-block text-xs font-semibold text-text-secondary uppercase tracking-widest">
          Enterprise Subscription Manager
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-surface-main transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-plum-primary text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {getInitials(user?.email)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-primary truncate max-w-[150px]">
                {user?.customer?.name || user?.email}
              </span>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                {role}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border-main py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-border-main/60">
                <p className="text-xs font-bold text-text-primary truncate">{user?.email}</p>
                <div className="mt-1">
                  <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>{role}</Badge>
                </div>
              </div>

              <div className="py-1">
                <div className="px-4 py-2 text-xs text-text-secondary flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-plum-primary" />
                  <span>Brightloop Cloud</span>
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

