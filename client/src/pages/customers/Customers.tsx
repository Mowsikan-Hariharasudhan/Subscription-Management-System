import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { Dialog } from '../../components/ui/dialog';
import { formatDate, cn } from '../../lib/utils';

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

  const getInitials = (name?: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer',
      className: 'w-[28%]',
      cell: (c) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-odoo to-odoo-dark text-white border-[1.5px] border-black font-bold flex items-center justify-center text-[0.875rem] shadow-[2px_2px_0_#000] shrink-0">
            {getInitials(c.companyName || c.name)}
          </div>
          <div className="min-w-0">
            <div className="text-[0.9375rem] font-bold text-odoo-dark group-hover:text-odoo transition-colors truncate">
              {c.name}
            </div>
            {c.companyName && (
              <div className="text-[0.8125rem] text-gray-500 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                <Building2 className="w-3.5 h-3.5 opacity-60 shrink-0" />
                <span className="truncate">{c.companyName}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Details',
      className: 'w-[28%]',
      cell: (c) => (
        <div className="space-y-1.5">
          {c.user?.email && (
            <div className="text-[0.8125rem] text-gray-700 font-medium flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-odoo opacity-60 shrink-0" />
              <span className="truncate">{c.user.email}</span>
            </div>
          )}
          {c.phone && (
            <div className="text-[0.8125rem] text-gray-500 font-medium flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-odoo opacity-60 shrink-0" />
              <span>{c.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Subscriptions',
      className: 'text-center',
      cell: (c) => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-[1.25rem] font-bold font-sans text-odoo-dark leading-none">
            {c._count?.subscriptions || 0}
          </span>
          <span className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Active
          </span>
        </div>
      ),
    },
    {
      header: 'Invoices',
      className: 'text-center',
      cell: (c) => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-[1.25rem] font-bold font-sans text-odoo-dark leading-none">
            {c._count?.invoices || 0}
          </span>
          <span className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Total
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (c) => (
        <div className="text-center">
          <span
            className={cn(
              'inline-flex items-center px-3.5 py-1 rounded-full border-[1.5px] border-black text-[0.6875rem] font-bold uppercase tracking-wider',
              c.isActive ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#b91c1c]'
            )}
          >
            {c.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      ),
    },
    {
      header: 'Joined',
      className: 'text-right',
      cell: (c) => (
        <div className="text-right text-[0.8125rem] font-medium text-gray-500">
          {formatDate(c.createdAt)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 flex flex-col flex-1 pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-end anim-slide-up">
        <div>
          <h1 className="text-[2.25rem] font-bold tracking-tight text-odoo-dark leading-tight">
            Customers
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Manage customer enterprise profiles, subscriptions, and billing accounts
          </p>
        </div>
      </div>

      {/* Action Bar (Search + Add) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="relative w-full sm:w-[28rem]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, phone or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-focus w-full pl-11 pr-4 py-2.5 bg-white border-[1.5px] border-black rounded-lg text-[0.875rem] font-medium text-odoo-dark shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="text-white px-5 py-2.5 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-2 btn-primary cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Customer Data Table Container */}
      <div className="flex flex-col flex-1">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(c) => navigate(`/customers/${c.id}`)}
          emptyTitle="No customers match your search"
          emptyDescription="Create a customer account or try modifying your search keywords."
        />

        {data?.pagination && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              limit={10}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Customer Account"
        description="Provision a new enterprise customer tenant into Brightloop"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Amanda Roberts"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                placeholder="amanda@cyberdyne.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Cyberdyne AI Inc."
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Billing Address
            </label>
            <input
              type="text"
              placeholder="Building 4, Tech Park, Whitefield, Bengaluru - 560066"
              value={formData.billingAddress}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t-[1.5px] border-black/10">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-2.5 bg-white border-[1.5px] border-black text-odoo-dark font-bold text-[0.875rem] rounded-xl hover:bg-gray-50 transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 text-white font-bold text-[0.875rem] rounded-xl btn-primary cursor-pointer"
            >
              {createMutation.isPending ? 'Provisioning...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
