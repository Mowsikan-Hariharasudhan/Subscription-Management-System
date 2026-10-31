import React from 'react';
import { Building2, CalendarDays, Mail, MapPin, Phone, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatDate } from '../../lib/utils';

const Detail: React.FC<{ icon: React.ReactNode; label: string; value?: string | null; isMono?: boolean }> = ({
  icon,
  label,
  value,
  isMono,
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="mt-0.5 text-text-secondary">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
      <p className={`mt-0.5 break-words text-xs font-medium text-text-primary ${isMono ? 'font-mono' : ''}`}>{value || 'Not provided'}</p>
    </div>
  </div>
);

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const customer = user?.customer;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Account</h1>
        <p className="mt-0.5 text-xs text-text-secondary">Your account and contact information</p>
      </div>

      <div className="grid gap-3.5 md:grid-cols-2">
        <Card>
          <CardHeader className="py-3 px-4 border-b border-border-main">
            <CardTitle className="text-sm font-semibold">Personal details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border-main p-4">
            <Detail icon={<User className="h-4 w-4 text-plum-primary" />} label="Name" value={customer?.name} />
            <Detail icon={<Mail className="h-4 w-4 text-plum-primary" />} label="Email" value={user?.email} />
            <Detail icon={<Phone className="h-4 w-4 text-plum-primary" />} label="Phone" value={customer?.phone} isMono />
            <Detail
              icon={<CalendarDays className="h-4 w-4 text-plum-primary" />}
              label="Account created"
              value={user?.createdAt ? formatDate(user.createdAt) : null}
              isMono
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4 border-b border-border-main">
            <CardTitle className="text-sm font-semibold">Business details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border-main p-4">
            <Detail
              icon={<Building2 className="h-4 w-4 text-plum-primary" />}
              label="Company"
              value={customer?.companyName}
            />
            <Detail
              icon={<MapPin className="h-4 w-4 text-plum-primary" />}
              label="Billing address"
              value={customer?.billingAddress}
            />
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-text-secondary">
        To update your account information, please contact your account administrator.
      </p>
    </div>
  );
};
