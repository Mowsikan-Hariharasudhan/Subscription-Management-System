import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, Shield, Sparkles, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@brightloop.io');
  const [password, setPassword] = useState('Admin@1234');
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
    <div className="w-full min-h-screen flex flex-col relative z-10">
      {/* Top Header */}
      <header className="h-20 px-8 sm:px-12 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 anim-fade">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg glass-odoo">
            B
          </div>
          <span className="font-bold text-[1.125rem] tracking-tight text-odoo-dark">Brightloop</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
            Odoo x Make-A-Ton 9.0
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 -mt-6">
        <div className="w-full max-w-[64rem] bg-white/70 backdrop-blur-2xl border-[1.5px] border-black rounded-3xl flex flex-col md:flex-row overflow-hidden anim-spring stagger-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
          {/* Left Side: Deep Odoo Plum Glass */}
          <div className="w-full md:w-[52%] p-8 sm:p-12 md:p-14 flex flex-col justify-between relative glass-odoo text-white">
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-12 sm:mb-16">
                <div className="w-14 h-14 border-[1.5px] border-white/30 rounded-2xl flex items-center justify-center text-white font-bold text-2xl bg-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                  B
                </div>
                <div>
                  <div className="text-[0.6875rem] font-bold text-white/70 tracking-[0.2em] uppercase mb-1">
                    ENTERPRISE SUITE
                  </div>
                  <div className="text-[1.5rem] font-bold text-white tracking-tight">Brightloop</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 border-[1.5px] border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-white/90" />
                <span className="text-[0.6875rem] font-bold text-white tracking-[0.15em] uppercase">
                  SUBSCRIPTION CONTROL CENTER
                </span>
              </div>

              <h1 className="text-[2.25rem] sm:text-[2.75rem] font-bold text-white leading-[1.08] tracking-tight drop-shadow-md">
                Manage products, plans,
                and recurring billing in
                one place.
              </h1>
            </div>

            <div className="relative z-10 pt-10 text-[0.75rem] text-white/60 font-medium">
              Strict minor paise math • Wal-mode SQLite • Idempotent node-cron billing
            </div>
          </div>

          {/* Right Side: Sign-in Form */}
          <div className="w-full md:w-[48%] p-8 sm:p-12 md:p-14 flex flex-col justify-center relative bg-white/40 backdrop-blur-md">
            <div className="max-w-[24rem] w-full mx-auto">
              {/* Form Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-[0.6875rem] font-bold text-gray-500 tracking-[0.2em] uppercase mb-2">
                    ACCESS PORTAL
                  </div>
                  <h2 className="text-[2rem] font-bold text-odoo-dark tracking-tight">Sign in</h2>
                </div>
                <div className="w-12 h-12 border-[1.5px] border-black rounded-xl flex items-center justify-center text-odoo bg-white shadow-[2px_2px_0_#000]">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border-[1.5px] border-rose-500 text-rose-800 text-xs font-semibold shadow-xs">
                  {error}
                </div>
              )}

              {/* Skeleton Loader during submission */}
              {loading ? (
                <div className="space-y-5 py-4">
                  <div className="skeleton h-4 w-28" />
                  <div className="skeleton h-12 w-full" />
                  <div className="skeleton h-4 w-24 mt-2" />
                  <div className="skeleton h-12 w-full" />
                  <div className="skeleton h-12 w-full mt-4" />
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-[0.1em] uppercase mb-2">
                      WORK EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@brightloop.io"
                      className="input-focus w-full px-4 py-3 bg-white border-[1.5px] border-black rounded-xl text-[0.9375rem] font-medium text-odoo-dark shadow-sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-[0.1em] uppercase">
                        PASSWORD
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[0.6875rem] font-bold text-odoo hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="input-focus w-full px-4 py-3 bg-white border-[1.5px] border-black rounded-xl text-[0.9375rem] font-medium text-odoo-dark shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white font-bold text-[0.9375rem] py-3.5 rounded-xl btn-primary flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Demo Credentials Quick-Fill Pills */}
              <div className="mt-8 pt-6 border-t-[1.5px] border-black/10">
                <div className="text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  Instant Demo Accounts:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemo('admin@brightloop.io', 'Admin@1234')}
                    className="px-3 py-1.5 bg-white border-[1.5px] border-black rounded-lg text-xs font-bold text-odoo-dark hover:bg-gray-50 shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    👑 Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('sarah@brightloop.io', 'Staff@1234')}
                    className="px-3 py-1.5 bg-white border-[1.5px] border-black rounded-lg text-xs font-bold text-odoo-dark hover:bg-gray-50 shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    💼 Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('customer1@example.com', 'Customer@1234')}
                    className="px-3 py-1.5 bg-white border-[1.5px] border-black rounded-lg text-xs font-bold text-odoo-dark hover:bg-gray-50 shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    👤 Customer
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-[0.8125rem] font-medium text-gray-600">
                New tenant?{' '}
                <Link to="/register" className="text-odoo font-bold hover:underline ml-1">
                  Create customer account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
