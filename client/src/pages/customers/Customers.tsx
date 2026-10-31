import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail, LayoutGrid, List, ChevronDown } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
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

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const columns: Column<Customer>[] = [
    {
      header: 'CODE',
      cell: (c) => (
        <span className="font-mono text-xs font-bold text-text-primary">
          CUST-{c.id.substring(0, 4).toUpperCase()}
        </span>
      ),
    },
    {
      header: 'CUSTOMER NAME',
      cell: (c) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#F5E6EE] text-plum-primary font-bold text-xs flex items-center justify-center shrink-0 border border-plum-border">
            {getInitials(c.name)}
          </div>
          <div>
            <span className="font-bold text-xs text-text-primary hover:text-plum-primary transition-colors block">
              {c.name}
            </span>
            {c.user?.email && (
              <span className="text-[11px] text-text-secondary block font-mono">
                {c.user.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'COMPANY / ORG',
      cell: (c) => (
        <span className="text-xs text-text-secondary font-medium">
          {c.companyName || 'Individual Account'}
        </span>
      ),
    },
    {
      header: 'PHONE',
      cell: (c) => (
        <span className="text-xs font-mono text-text-secondary">
          {c.phone || '—'}
        </span>
      ),
    },
    {
      header: 'SUBSCRIPTIONS',
      cell: (c) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold font-mono bg-plum-surface text-plum-primary border border-plum-border">
          {c._count?.subscriptions || 0} active
        </span>
      ),
    },
    {
      header: 'INVOICES',
      cell: (c) => (
        <span className="text-xs font-mono text-text-secondary font-medium">
          {c._count?.invoices || 0} total
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (c) => (
        <Badge variant={c.isActive ? 'success' : 'danger'}>
          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customer Directory"
        description="Central operational hub for customer master data, subscriptions, and billing accounts"
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle (Kanban | List) from reference */}
            <div className="inline-flex p-1 bg-white border border-border-main rounded-xl shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-plum-primary text-white shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-plum-primary text-white shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

            {/* Primary Action Button */}
            <Button onClick={() => setIsCreateOpen(true)} size="md">
              <Plus className="w-4 h-4 mr-1" /> New Customer
            </Button>
          </div>
        }
      />

      {/* Filter / Search Bar matching reference */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Input
            placeholder="Search by name, email, or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 text-xs rounded-xl"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
        </div>

        <div className="relative">
          <button
            type="button"
            className="h-10 px-4 rounded-xl border border-border-main bg-white text-xs font-medium text-text-primary flex items-center gap-2 hover:bg-surface-hover shadow-sm"
          >
            <span>All Statuses</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Customer Data Table / Kanban */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(c) => navigate(`/customers/${c.id}`)}
          emptyTitle="No customers match your search"
          emptyDescription="Create a customer account or try modifying your search keywords."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data || []).map((c: any) => (
            <div
              key={c.id}
              onClick={() => navigate(`/customers/${c.id}`)}
              className="bg-white rounded-2xl border border-border-main p-5 shadow-card hover:border-plum-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-full bg-[#F5E6EE] text-plum-primary font-bold text-sm flex items-center justify-center border border-plum-border">
                  {getInitials(c.name)}
                </div>
                <Badge variant={c.isActive ? 'success' : 'danger'}>
                  {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <h3 className="font-bold text-sm text-text-primary mt-3">{c.name}</h3>
              <p className="text-xs text-text-secondary">{c.companyName || 'Individual'}</p>
              <div className="mt-4 pt-3 border-t border-border-main flex items-center justify-between text-xs font-mono text-text-secondary">
                <span>{c.user?.email || 'No email'}</span>
                <span className="font-bold text-plum-primary">{c._count?.subscriptions || 0} subs</span>
              </div>
            </div>
          ))}
        </div>
      )}

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
        <form onSubmit={handleCreateSubmit} className="space-y-4">
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
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="cust-company">Company Name</Label>
            <Input
              id="cust-company"
              placeholder="e.g. Wayne Enterprises Inc."
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="rounded-xl"
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
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="cust-phone">Phone</Label>
              <Input
                id="cust-phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl"
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
              className="rounded-xl"
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
