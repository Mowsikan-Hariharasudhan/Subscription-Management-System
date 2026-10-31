import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-surface-main flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-10 h-10 rounded-md bg-plum-dark text-white font-bold text-xl items-center justify-center border border-plum-deep shadow-xs mb-2.5">
            B
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Brightloop
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Enterprise Subscription & Recurring Billing Management
          </p>
        </div>

        <Card className="shadow-subtle border border-border-main rounded-lg">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-base font-semibold">Sign in to console</CardTitle>
            <CardDescription className="text-xs">
              Enter credentials to access your organization workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <Label htmlFor="email" required>
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-8 text-xs"
                  />
                  <Mail className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" required className="mb-0">
                    Password
                  </Label>
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
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-8 text-xs font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-2.5" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={loading}>
                Sign In <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-plum-primary hover:underline">
                Register customer portal
              </Link>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="mt-5 pt-3.5 border-t border-border-main">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2 text-center">
                Instant Demo Logins
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@brightloop.io', 'Admin@1234')}
                  className="px-2 py-1.5 bg-surface-subtle hover:bg-plum-light hover:border-plum-primary/40 border border-border-main rounded-md text-[11px] font-medium text-text-primary transition-colors cursor-pointer text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('sarah@brightloop.io', 'Staff@1234')}
                  className="px-2 py-1.5 bg-surface-subtle hover:bg-plum-light hover:border-plum-primary/40 border border-border-main rounded-md text-[11px] font-medium text-text-primary transition-colors cursor-pointer text-center"
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('customer1@example.com', 'Customer@1234')}
                  className="px-2 py-1.5 bg-surface-subtle hover:bg-plum-light hover:border-plum-primary/40 border border-border-main rounded-md text-[11px] font-medium text-text-primary transition-colors cursor-pointer text-center"
                >
                  Customer
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
