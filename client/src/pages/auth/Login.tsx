import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldAlert,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Layers,
  Zap,
  Repeat,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<'admin' | 'staff' | 'customer' | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user.role === 'CUSTOMER') {
        navigate('/portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Authentication failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (role: 'admin' | 'staff' | 'customer', demoEmail: string, demoPass: string) => {
    setSelectedDemoRole(role);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-main flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Container with Corporate Brutalist Split Layout */}
      <div className="w-full max-w-5xl bg-white border border-border-main rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Hero Panel (Corporate Brutalism Plum Identity) */}
        <div className="lg:col-span-5 bg-plum-deep text-white p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#4A3750] relative overflow-hidden">
          {/* Subtle geometric background element */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-plum-primary/10 blur-2xl pointer-events-none" />

          <div>
            {/* Brand Monogram */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-plum-primary flex items-center justify-center font-bold text-white text-xl border border-white/20 shadow-md">
                B
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight font-serif text-white block">
                  BRIGHTLOOP
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-plum-muted font-semibold block">
                  Enterprise SaaS
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h2 className="text-2xl font-bold text-white leading-tight font-serif">
                Unified Subscription & Billing Engine
              </h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Centralized recurring revenue backbone powering plans, quotations, automated invoice cycles, and customer self-service.
              </p>
            </div>

            {/* Feature Highlights with Clean Brutalist Cards */}
            <div className="space-y-2.5 mt-8">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start space-x-3">
                <Zap className="w-4 h-4 text-[#D1ECF1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Idempotent Billing Engine</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">Automated node-cron scheduler with database-level duplicate prevention.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start space-x-3">
                <Repeat className="w-4 h-4 text-[#D1ECF1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Full Lifecycle Management</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">Draft, Quotation, Confirmed, Active, Paused, and Closed state transitions.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start space-x-3">
                <Shield className="w-4 h-4 text-[#D1ECF1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Multi-Tenant RBAC Security</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">Complete authorization boundaries between Admin, Staff, and Customer portals.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hackathon Badge */}
          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-[11px] font-mono text-white/50">
            <span>Odoo Hackathon Kochi</span>
            <span className="text-[#D1ECF1] font-bold">2026</span>
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-text-primary tracking-tight font-serif">
                  Console Sign In
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Authenticate with your registered enterprise credentials
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Online</span>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2.5 animate-in fade-in duration-150">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="login-email" required className="text-xs font-semibold text-text-primary mb-1">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@brightloop.io"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedDemoRole(null);
                    }}
                    required
                    className="pl-9 h-10 text-xs font-medium border-border-main focus:border-plum-primary focus:ring-1 focus:ring-plum-primary/20"
                  />
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="login-password" required className="text-xs font-semibold text-text-primary mb-0">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-medium text-plum-primary hover:text-plum-deep hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setSelectedDemoRole(null);
                    }}
                    required
                    className="pl-9 pr-9 h-10 text-xs font-medium border-border-main focus:border-plum-primary focus:ring-1 focus:ring-plum-primary/20"
                  />
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-plum-deep hover:bg-plum-primary text-white font-semibold text-xs tracking-wide transition-colors mt-2"
                isLoading={loading}
              >
                Sign In to Console <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-text-secondary">
              Need customer access?{' '}
              <Link to="/register" className="font-semibold text-plum-primary hover:underline">
                Create new customer account
              </Link>
            </div>

            {/* Quick Demo Credentials Bar with Interactive Selector */}
            <div className="mt-6 pt-5 border-t border-border-main">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary">
                  One-Click Demo Logins
                </span>
                <span className="text-[10px] text-plum-primary font-medium flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Ready to Evaluate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('admin', 'admin@brightloop.io', 'Admin@1234')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedDemoRole === 'admin'
                      ? 'border-plum-primary bg-plum-light/50 ring-1 ring-plum-primary/30'
                      : 'border-border-main bg-surface-main/60 hover:bg-surface-main hover:border-plum-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">Admin</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-plum-deep text-white font-mono font-semibold">
                      Full Access
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 font-mono truncate">admin@brightloop.io</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('staff', 'sarah@brightloop.io', 'Staff@1234')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedDemoRole === 'staff'
                      ? 'border-plum-primary bg-plum-light/50 ring-1 ring-plum-primary/30'
                      : 'border-border-main bg-surface-main/60 hover:bg-surface-main hover:border-plum-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">Staff</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">
                      Operations
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 font-mono truncate">sarah@brightloop.io</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('customer', 'customer1@example.com', 'Customer@1234')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedDemoRole === 'customer'
                      ? 'border-plum-primary bg-plum-light/50 ring-1 ring-plum-primary/30'
                      : 'border-border-main bg-surface-main/60 hover:bg-surface-main hover:border-plum-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">Customer</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-semibold">
                      Portal
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 font-mono truncate">customer1@example.com</p>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-main/60 flex items-center justify-between text-[11px] text-text-secondary">
            <span>Enterprise Subscription Platform</span>
            <span>Local SQLite Backend</span>
          </div>
        </div>

      </div>
    </div>
  );
};
