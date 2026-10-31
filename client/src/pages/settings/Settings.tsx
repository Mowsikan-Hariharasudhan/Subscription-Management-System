import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Percent, Users, ChevronRight } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {settingsItems.map((item) => (
          <Card
            key={item.href}
            className="cursor-pointer hover:border-plum-primary transition-colors brutal-card-interactive"
            onClick={() => navigate(item.href)}
          >
            <CardContent className="p-4 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-md bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs text-text-primary">{item.title}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2.5 mb-3">
            <Shield className="w-4 h-4 text-plum-primary" />
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-wider">System Information</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-2.5 bg-surface-subtle rounded-md border border-border-main">
              <p className="text-text-secondary text-[10px] uppercase font-semibold mb-0.5">Application</p>
              <p className="font-mono font-semibold text-text-primary">Brightloop v1.0</p>
            </div>
            <div className="p-2.5 bg-surface-subtle rounded-md border border-border-main">
              <p className="text-text-secondary text-[10px] uppercase font-semibold mb-0.5">Database</p>
              <p className="font-mono font-semibold text-text-primary">SQLite (Prisma 7)</p>
            </div>
            <div className="p-2.5 bg-surface-subtle rounded-md border border-border-main">
              <p className="text-text-secondary text-[10px] uppercase font-semibold mb-0.5">Currency</p>
              <p className="font-mono font-semibold text-text-primary">INR (₹)</p>
            </div>
            <div className="p-2.5 bg-surface-subtle rounded-md border border-border-main">
              <p className="text-text-secondary text-[10px] uppercase font-semibold mb-0.5">Billing Engine</p>
              <p className="font-mono font-semibold text-text-primary">node-cron (Daily 00:01)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
