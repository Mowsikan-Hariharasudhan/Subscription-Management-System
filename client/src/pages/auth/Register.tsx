import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ArrowRight, ShieldAlert, Check, X, Building, Mail, User, Phone, MapPin, Lock } from 'lucide-react';

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

  // Password validation checks
  const password = formData.password;
  const hasMinLength = password.length > 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please satisfy all password security requirements before proceeding.');
      return;
    }

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
    <div className="min-h-screen bg-surface-main flex flex-col justify-center items-center p-4 py-10">
      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-10 h-10 rounded-md bg-plum-deep text-white font-bold text-lg items-center justify-center shadow-sm border border-white/20 mb-2">
            B
          </div>
          <h1 className="text-2xl font-extrabold text-plum-deep tracking-tight font-serif">
            BRIGHTLOOP
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Customer Self-Service Registration · Enterprise SaaS Portal
          </p>
        </div>

        <Card className="border-border-main shadow-lg rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-surface-main/50 border-b border-border-main/60 py-4 px-6">
            <CardTitle className="text-base font-bold text-text-primary">
              Register New Organization
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Create an account to manage your subscription plans, track recurring invoices, and view payment records.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-name" required className="text-xs font-semibold">
                    Primary Contact Name
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="reg-name"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="pl-9 h-9 text-xs"
                    />
                    <User className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-company" className="text-xs font-semibold">
                    Company / Organization
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="reg-company"
                      name="companyName"
                      placeholder="Acme Technologies"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-9 h-9 text-xs"
                    />
                    <Building className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-email" required className="text-xs font-semibold">
                    Work Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-9 h-9 text-xs"
                    />
                    <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-phone" className="text-xs font-semibold">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="reg-phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-9 h-9 text-xs"
                    />
                    <Phone className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reg-password" required className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-9 h-9 text-xs"
                  />
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                </div>

                {/* Password Criteria Checklist */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-surface-main/80 border border-border-main text-[11px] grid grid-cols-2 gap-1.5">
                  <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                    {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                    <span>More than 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                    {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                    <span>1+ uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasLower ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                    {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                    <span>1+ lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-text-secondary'}`}>
                    {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                    <span>1+ special character</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reg-billing" className="text-xs font-semibold">
                  Billing Address
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="reg-billing"
                    name="billingAddress"
                    placeholder="123 Technology Park, Floor 4, Bengaluru, Karnataka"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className="pl-9 h-9 text-xs"
                  />
                  <MapPin className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 mt-3 bg-plum-deep hover:bg-plum-primary text-white font-semibold text-xs tracking-wide"
                isLoading={loading}
              >
                Complete Organization Registration <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-text-secondary pt-4 border-t border-border-main/60">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-plum-primary hover:underline">
                Sign in to console
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
