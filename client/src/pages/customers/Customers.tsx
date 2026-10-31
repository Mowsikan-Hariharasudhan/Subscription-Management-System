import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { formatDate } from '../../lib/utils';

export const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: '',
    billingAddress: '',
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['customers', { page, search }],
    queryFn: () => customerService.list({ page, limit: 10, search }),
  });

  const createMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: (newCust) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsCreateOpen(false);
      setFormData({ name: '', email: '', companyName: '', phone: '', billingAddress: '' });
      navigate(`/customers/${newCust.id}`);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer',
      cell: (c) => (
        <div>
          <span className="font-semibold text-text-primary hover:text-plum-primary transition-colors block">
            {c.name}
          </span>
          {c.companyName && (
            <span className="text-xs text-text-secondary flex items-center space-x-1 mt-0.5">
              <Building2 className="w-3 h-3 text-text-secondary/70" />
              <span>{c.companyName}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Contact',
      cell: (c) => (
        <div className="space-y-0.5 text-xs text-text-secondary">
          {c.user?.email && (
            <div className="flex items-center space-x-1.5">
              <Mail className="w-3 h-3 text-plum-primary" />
              <span>{c.user.email}</span>
            </div>
          )}
          {c.phone && (
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3 h-3 text-text-secondary/60" />
              <span>{c.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Subscriptions',
      cell: (c) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono bg-plum-surface text-plum-primary border border-plum-border">
          {c._count?.subscriptions || 0} active
        </span>
      ),
    },
    {
      header: 'Invoices',
      cell: (c) => (
        <span className="text-xs font-mono text-text-secondary">
          {c._count?.invoices || 0} total
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (c) => (
        <Badge variant={c.isActive ? 'success' : 'danger'}>
          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
    {
      header: 'Joined',
      cell: (c) => <span className="text-xs text-text-secondary font-mono">{formatDate(c.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Customers"
        description="Manage customer enterprise profiles, subscriptions, and billing accounts"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Customer
          </Button>
        }
      />

      {/* Filter / Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-border-main shadow-subtle flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search by name, company, phone or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9 text-xs"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customer Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(c) => navigate(`/customers/${c.id}`)}
        emptyTitle="No customers match your search"
        emptyDescription="Create a customer account or try modifying your search keywords."
      />

      {data?.pagination && (
        <Pagination
          page={page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          limit={data.pagination.limit}
          onPageChange={setPage}
        />
      )}

      {/* Create Customer Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Customer"
        description="Creates a customer record and creates a portal account"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <div>
            <Label htmlFor="cust-name" required>
              Customer / Contact Name
            </Label>
            <Input
              id="cust-name"
              placeholder="e.g. Wayne Enterprises"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="cust-company">Company Name</Label>
            <Input
              id="cust-company"
              placeholder="e.g. Wayne Enterprises Inc."
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cust-email" required>
                Login Email
              </Label>
              <Input
                id="cust-email"
                type="email"
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="cust-phone">Phone</Label>
              <Input
                id="cust-phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cust-addr">Billing Address</Label>
            <Input
              id="cust-addr"
              placeholder="10 Downing St, Floor 4"
              value={formData.billingAddress}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
            />
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-3 border-t border-border-main">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>
              Create Customer
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
