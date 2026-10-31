import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CheckCircle2, Mail, ShieldAlert } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSubmitted(true);
      setMessage(res.message || 'If an account exists for that email, recovery instructions have been dispatched.');
    } catch (err: any) {
      setSubmitted(true);
      setMessage('If an account exists for that email, recovery instructions have been dispatched.');
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
            Enterprise Password Recovery & Account Verification
          </p>
        </div>

        <Card className="border-border-main shadow-lg rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-surface-main/50 border-b border-border-main/60 py-4 px-6 text-center">
            <CardTitle className="text-base font-bold text-text-primary">
              Password Recovery
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Enter your work email address to receive secure reset credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {submitted ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">Recovery Link Dispatched</h4>
                <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">{message}</p>
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email" required className="text-xs font-semibold">
                    Registered Work Email
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9 h-10 text-xs"
                    />
                    <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-plum-deep hover:bg-plum-primary text-white font-semibold text-xs tracking-wide transition-colors"
                  isLoading={loading}
                >
                  Send Password Reset Link
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
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
