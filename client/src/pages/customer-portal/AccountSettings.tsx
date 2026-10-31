import React from 'react';
import { Building2, CalendarDays, Mail, MapPin, Phone, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatDate } from '../../lib/utils';

const Detail: React.FC<{ icon: React.ReactNode; label: string; value?: string | null }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 py-3">
    <div className="mt-0.5 text-text-secondary">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-0.5 break-words text-sm text-text-primary">{value || 'Not provided'}</p>
    </div>
  </div>
);

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const customer = user?.customer;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Account</h1>
        <p className="mt-0.5 text-sm text-text-secondary">Your account and contact information</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border-main/60 py-2">
            <Detail icon={<User className="h-4 w-4" />} label="Name" value={customer?.name} />
            <Detail icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email} />
            <Detail icon={<Phone className="h-4 w-4" />} label="Phone" value={customer?.phone} />
            <Detail
              icon={<CalendarDays className="h-4 w-4" />}
              label="Account created"
              value={user?.createdAt ? formatDate(user.createdAt) : null}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border-main/60 py-2">
            <Detail
              icon={<Building2 className="h-4 w-4" />}
              label="Company"
              value={customer?.companyName}
            />
            <Detail
              icon={<MapPin className="h-4 w-4" />}
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
