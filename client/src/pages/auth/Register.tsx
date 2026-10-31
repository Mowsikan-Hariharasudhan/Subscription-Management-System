import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { ArrowRight, ShieldCheck, Sparkles, Moon, Shield } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    billingAddress: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        ...formData,
        role: 'CUSTOMER',
      });
      navigate('/portal');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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

      {/* Center Split Hero Card */}
      <main className="w-full max-w-4xl mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl border border-border-main shadow-card overflow-hidden flex flex-col md:flex-row">
          {/* Left Hero Pane (Deep Plum Gradient) */}
          <div className="bg-gradient-to-br from-[#6A3D5B] via-[#522A44] to-[#3A1B2E] p-8 sm:p-10 text-white flex flex-col justify-between md:w-[45%] relative">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block leading-none">
                    CUSTOMER PORTAL
                  </span>
                  <span className="text-sm font-bold text-white block mt-0.5 leading-none">
                    Brightloop
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white/90">
                  <Sparkles className="w-3 h-3 text-pink-300" /> SELF-SERVICE SUITE
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mt-6">
                  Access your subscriptions, view invoices, and make payments seamlessly.
                </h1>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/70">
              <p>Instant portal activation with verified billing account creation.</p>
            </div>
          </div>

          {/* Right Form Pane */}
          <div className="p-8 sm:p-10 md:w-[55%] flex flex-col justify-center bg-white">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-text-secondary uppercase">
                  REGISTRATION
                </p>
                <h2 className="text-2xl font-bold text-text-primary mt-1">Create account</h2>
              </div>
              <div className="w-9 h-9 rounded-xl border border-border-main flex items-center justify-center text-text-secondary bg-surface-main">
                <Shield className="w-4 h-4 text-plum-primary" />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    FULL NAME *
                  </label>
                  <Input
                    name="name"
                    placeholder="Bruce Wayne"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-10 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    COMPANY NAME
                  </label>
                  <Input
                    name="companyName"
                    placeholder="Wayne Enterprises"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="h-10 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                  WORK EMAIL *
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="bruce@wayne.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                  PASSWORD *
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="At least 8 chars (upper, lower, num, symbol)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-10 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    PHONE NUMBER
                  </label>
                  <Input
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    BILLING ADDRESS
                  </label>
                  <Input
                    name="billingAddress"
                    placeholder="Gotham City"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className="h-10 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-semibold mt-2 shadow-sm flex items-center justify-center gap-2"
                isLoading={loading}
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-plum-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
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
