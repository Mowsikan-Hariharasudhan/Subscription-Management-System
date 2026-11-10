import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { ArrowRight, Shield, ShieldCheck, Eye, EyeOff, Sparkles, Moon } from 'lucide-react';
import { AuthSkeleton } from '../../components/shared/LoadingSkeleton';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-main flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-plum-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
            B
          </div>
          <span className="font-bold text-text-primary text-base tracking-tight">Brightloop</span>
        </div>

        <button
          className="p-2 rounded-xl border border-border-main bg-white text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          title="Toggle appearance"
          aria-label="Toggle appearance"
        >
          <Moon className="w-4 h-4" />
        </button>
      </header>

      {/* Center Split Hero Card matching reference */}
      <main className="w-full max-w-4xl mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl border border-border-main shadow-card overflow-hidden flex flex-col md:flex-row">
          {/* Left Hero Pane (Deep Plum Gradient) */}
          <div className="bg-gradient-to-br from-[#6A3D5B] via-[#522A44] to-[#3A1B2E] p-8 sm:p-10 text-white flex flex-col justify-between md:w-1/2 relative">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block leading-none">
                    BILLING SUITE
                  </span>
                  <span className="text-sm font-bold text-white block mt-0.5 leading-none">
                    Brightloop
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white/90">
                  <Sparkles className="w-3 h-3 text-pink-300" /> REVENUE & SUBSCRIPTION OPS
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mt-6">
                  Manage subscriptions, recurring billing, and revenue in one place.
                </h1>
              </div>
            </div>

            {/* Quick Demo Logins Pill */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Instant Demo Logins
                </p>
                <span className="text-[9px] text-white/50">1-click fill</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@brightloop.io', 'Admin@1234')}
                  className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-white transition-colors cursor-pointer text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('sarah@brightloop.io', 'Staff@1234')}
                  className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-white transition-colors cursor-pointer text-center"
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('customer1@example.com', 'Customer@1234')}
                  className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-white transition-colors cursor-pointer text-center"
                >
                  Customer
                </button>
              </div>
              <p className="text-[10px] text-white/50 mt-2.5">
                Note: Backend wakes up on Render free-tier (~15s cold start if inactive).
              </p>
            </div>
          </div>

          {/* Right Pane: Active Skeleton Loader or Form */}
          {loading ? (
            <div className="md:w-1/2 flex flex-col justify-center">
              <AuthSkeleton title="Sign in" badge="ACCESS PORTAL" isRegister={false} />
            </div>
          ) : (
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center bg-white anim-fade">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-text-secondary uppercase">
                    ACCESS PORTAL
                  </p>
                  <h2 className="text-2xl font-bold text-text-primary mt-1">Sign in</h2>
                </div>
                <div className="w-9 h-9 rounded-xl border border-border-main flex items-center justify-center text-text-secondary bg-surface-main">
                  <Shield className="w-4 h-4 text-plum-primary" />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 anim-slide-up">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                    WORK EMAIL
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@brightloop.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                      PASSWORD
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] text-plum-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl text-sm pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-sm font-semibold mt-2 shadow-sm flex items-center justify-center gap-2"
                  isLoading={loading}
                >
                  Sign In <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-text-secondary">
                New user?{' '}
                <Link to="/register" className="font-semibold text-plum-primary hover:underline">
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-2">
        <p className="text-xs text-text-secondary">
          Brightloop Platform • Built for Odoo Hackathon 2026
        </p>
      </footer>
    </div>
  );
};
