import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

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
      setMessage(res.message || 'If that email address exists, a password reset link has been sent.');
    } catch (err: any) {
      setSubmitted(true);
      setMessage('If that email address exists, a password reset link has been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-main flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border-main">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email to receive recovery instructions
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-text-primary">Instructions Sent</h4>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">{message}</p>
                <div className="mt-6">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
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

                <Button type="submit" className="w-full mt-2" isLoading={loading}>
                  Send Recovery Link
                </Button>

                <div className="mt-4 text-center">
                  <Link to="/login" className="text-xs text-text-secondary hover:text-text-primary flex items-center justify-center space-x-1">
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

