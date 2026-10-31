import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2, Shield, Percent, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent } from '../../components/ui/card';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const settingsItems = [
    {
      icon: <Percent className="w-5 h-5" />,
      title: 'Tax Configuration',
      description: 'Manage tax rules, rates, and effective date ranges',
      href: '/settings/taxes',
      adminOnly: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Staff Management',
      description: 'Create and manage staff accounts and permissions',
      href: '/settings/staff',
      adminOnly: true,
    },
  ].filter((item) => !item.adminOnly || role === 'ADMIN');

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Configure system-wide settings, tax rules, and team management"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsItems.map((item) => (
          <Card
            key={item.href}
            className="cursor-pointer hover:border-plum-primary/50 hover:shadow-sm transition-all"
            onClick={() => navigate(item.href)}
          >
            <CardContent className="p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-plum-light text-plum-primary flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary">{item.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-plum-primary" />
            <h3 className="font-semibold text-text-primary">System Information</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-text-secondary text-xs mb-1">Application</p>
              <p className="font-semibold text-text-primary">Brightloop v1.0</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">Database</p>
              <p className="font-semibold text-text-primary">SQLite (Prisma 7)</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">Currency</p>
              <p className="font-semibold text-text-primary">INR (₹)</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">Billing Engine</p>
              <p className="font-semibold text-text-primary">node-cron (Daily 00:01)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
