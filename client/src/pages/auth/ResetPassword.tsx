import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CheckCircle2, Lock, ShieldAlert, Check, X } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Password validation checks
  const hasMinLength = password.length > 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not satisfy all enterprise security rules.');
      return;
    }

    if (!token) {
      setError('Reset token is missing from the URL link.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-main flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-10 h-10 rounded-md bg-plum-deep text-white font-bold text-lg items-center justify-center shadow-sm border border-white/20 mb-2">
            B
          </div>
          <h1 className="text-2xl font-extrabold text-plum-deep tracking-tight font-serif">
            BRIGHTLOOP
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Enterprise Security · Set New Password
          </p>
        </div>

        <Card className="border-border-main shadow-lg rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-surface-main/50 border-b border-border-main/60 py-4 px-6 text-center">
            <CardTitle className="text-base font-bold text-text-primary">
              Set New Password
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Configure a new strong password satisfying enterprise compliance
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {success ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">Password Reset Successful</h4>
                <p className="text-xs text-text-secondary">Redirecting you to the console...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <Label htmlFor="reset-new-password" required className="text-xs font-semibold">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="reset-new-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-9 h-10 text-xs"
                    />
                    <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  </div>

                  {/* Password Checklist */}
                  <div className="mt-2 p-2 rounded-lg bg-surface-main border border-border-main text-[11px] grid grid-cols-2 gap-1">
                    <div className={`flex items-center space-x-1 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                      {hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-500" />}
                      <span>&gt;8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                      {hasUpper ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-500" />}
                      <span>1+ uppercase</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${hasLower ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                      {hasLower ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-500" />}
                      <span>1+ lowercase</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                      {hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-500" />}
                      <span>1+ special</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reset-confirm-password" required className="text-xs font-semibold">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="reset-confirm-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-9 h-10 text-xs"
                    />
                    <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-plum-deep hover:bg-plum-primary text-white font-semibold text-xs tracking-wide transition-colors mt-2"
                  isLoading={loading}
                >
                  Confirm & Update Password
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Sign In</span>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
