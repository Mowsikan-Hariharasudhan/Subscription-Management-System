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
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-plum-deep text-white font-bold text-2xl items-center justify-center shadow-md mb-3">
            B
          </div>
          <h1 className="text-3xl font-extrabold text-plum-deep tracking-tight font-serif">
            Brightloop
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Enterprise Subscription & Recurring Billing Management
          </p>
        </div>

        <Card className="shadow-lg border-border-main">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Sign In to Your Account</CardTitle>
            <CardDescription>
              Enter your credentials to access the console
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="pl-9"
                  />
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" required className="mb-0">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-plum-primary hover:underline"
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
                    className="pl-9"
                  />
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={loading}>
                Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-plum-primary hover:underline">
                Create one now
              </Link>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="mt-6 pt-4 border-t border-border-main/60">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2 text-center">
                Quick Demo Logins
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@brightloop.io', 'Admin@1234')}
                  className="px-2 py-1.5 bg-surface-main hover:bg-plum-light/50 border border-border-main rounded text-xs font-medium text-text-primary transition-colors cursor-pointer"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('sarah@brightloop.io', 'Staff@1234')}
                  className="px-2 py-1.5 bg-surface-main hover:bg-plum-light/50 border border-border-main rounded text-xs font-medium text-text-primary transition-colors cursor-pointer"
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('customer1@example.com', 'Customer@1234')}
                  className="px-2 py-1.5 bg-surface-main hover:bg-plum-light/50 border border-border-main rounded text-xs font-medium text-text-primary transition-colors cursor-pointer"
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

