import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, CalendarDays, Mail, MapPin, Phone, User, ShieldCheck } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatDate } from '../../lib/utils';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  isMono?: boolean;
}> = ({ icon, label, value, isMono }) => (
  <div className="flex items-start space-x-3.5 py-3">
    <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{label}</p>
      <p className={`mt-0.5 text-xs font-semibold text-text-primary ${isMono ? 'font-mono' : ''}`}>
        {value || 'Not provided'}
      </p>
    </div>
  </div>
);

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['portal-account'],
    queryFn: portalService.getAccount,
  });

  if (isLoading) return <LoadingSkeleton count={3} />;

  const customerData = customer || user?.customer;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Registered organization details, primary contact info, and billing coordinates
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Personal / Account Coordinates */}
        <Card>
          <CardHeader className="py-4 px-6 border-b border-border-main">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-plum-primary" />
              <CardTitle className="text-sm font-bold text-text-primary">
                Primary Contact Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border-main/70 p-6">
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Contact Person Name"
              value={customerData?.name}
            />
            <DetailRow
              icon={<Mail className="w-4 h-4" />}
              label="Registered Email Address"
              value={user?.email}
              isMono
            />
            <DetailRow
              icon={<Phone className="w-4 h-4" />}
              label="Direct Phone Number"
              value={customerData?.phone}
              isMono
            />
            <DetailRow
              icon={<CalendarDays className="w-4 h-4" />}
              label="Account Member Since"
              value={user?.createdAt ? formatDate(user.createdAt) : null}
              isMono
            />
          </CardContent>
        </Card>

        {/* Business Coordinates */}
        <Card>
          <CardHeader className="py-4 px-6 border-b border-border-main">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-plum-primary" />
              <CardTitle className="text-sm font-bold text-text-primary">
                Organization & Billing Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border-main/70 p-6">
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Company / Enterprise Name"
              value={customerData?.companyName || 'Individual Subscriber'}
            />
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Official Billing Address"
              value={customerData?.billingAddress}
            />
            <div className="pt-3 flex items-center space-x-2 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified customer account bound to enterprise billing ledger.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
