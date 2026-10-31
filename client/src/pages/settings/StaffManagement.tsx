import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, ShieldCheck, UserX, Users } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { api } from '../../services/api';
import { formatDate } from '../../lib/utils';

const userService = {
  listStaff: async () => {
    const res = await api.get('/users', { params: { role: 'STAFF' } });
    return res.data.data;
  },
  createStaff: async (data: any) => {
    const res = await api.post('/users', data);
    return res.data.data;
  },
  deactivate: async (id: string) => {
    const res = await api.patch(`/users/${id}`, { isActive: false });
    return res.data.data;
  },
  activate: async (id: string) => {
    const res = await api.patch(`/users/${id}`, { isActive: true });
    return res.data.data;
  },
};

export const StaffManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [formError, setFormError] = useState('');

  const { data: staffList, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: userService.listStaff,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => userService.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setIsCreateOpen(false);
      setForm({ email: '', password: '', name: '' });
      setFormError('');
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to create staff account');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? userService.deactivate(id) : userService.activate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    createMutation.mutate({ email: form.email, password: form.password, name: form.name, role: 'STAFF' });
  };

  if (isLoading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/settings')} className="p-2 rounded-lg hover:bg-surface-main transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <PageHeader
          title="Staff Management"
          description="Create and manage staff accounts (Admin only)"
          actions={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <UserPlus className="w-4 h-4 mr-1" /> Add Staff Member
            </Button>
          }
        />
      </div>

      {!staffList || staffList.length === 0 ? (
        <EmptyState title="No staff accounts" description="Create staff accounts to allow team members to manage subscriptions." icon={<Users className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staffList.map((staff: any) => (
            <Card key={staff.id} className={!staff.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-plum-primary text-white font-bold text-sm flex items-center justify-center">
                      {staff.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{staff.email}</p>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-plum-muted" />
                        <span className="text-xs text-plum-muted font-medium">STAFF</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={staff.isActive ? 'success' : 'danger'}>
                    {staff.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary mb-3">Created: {formatDate(staff.createdAt)}</p>
                <div className="flex justify-end pt-2 border-t border-border-main/40">
                  <button
                    onClick={() => toggleMutation.mutate({ id: staff.id, isActive: staff.isActive })}
                    className={`text-xs font-medium cursor-pointer transition-colors ${staff.isActive ? 'text-rose-500 hover:text-rose-700' : 'text-emerald-600 hover:text-emerald-800'}`}
                  >
                    {staff.isActive ? (
                      <><UserX className="w-3 h-3 inline mr-1" />Deactivate</>
                    ) : 'Activate'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Staff Member" description="Staff can manage customers, quotations, subscriptions, invoices and payments.">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">{formError}</div>
          )}
          <div>
            <Label htmlFor="staff-name" required>Full Name</Label>
            <Input id="staff-name" placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="staff-email" required>Work Email</Label>
            <Input id="staff-email" type="email" placeholder="john@brightloop.io" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="staff-password" required>Initial Password</Label>
            <Input id="staff-password" type="password" placeholder="Min 8 chars, upper, lower, special" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>Create Staff Account</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
