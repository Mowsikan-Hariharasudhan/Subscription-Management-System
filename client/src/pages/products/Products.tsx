import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Package, Layers } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { Dialog } from '../../components/ui/dialog';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { cn } from '../../lib/utils';

export const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'SOFTWARE',
    salesPriceRupees: '',
    costPriceRupees: '',
    notes: '',
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, search }],
    queryFn: () => productService.list({ page, limit: 10, search }),
  });

  const createMutation = useMutation({
    mutationFn: (newP: any) =>
      productService.create({
        name: newP.name,
        type: newP.type,
        salesPrice: Math.round(parseFloat(newP.salesPriceRupees || '0') * 100),
        costPrice: Math.round(parseFloat(newP.costPriceRupees || '0') * 100),
        notes: newP.notes,
        isActive: true,
      }),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsCreateOpen(false);
      setFormData({ name: '', type: 'SOFTWARE', salesPriceRupees: '', costPriceRupees: '', notes: '' });
      navigate(`/products/${p.id}`);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const columns: Column<Product>[] = [
    {
      header: 'Product Name',
      className: 'w-[32%]',
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-odoo/10 text-odoo font-bold flex items-center justify-center text-[0.75rem] border border-odoo/20 group-hover:bg-odoo group-hover:text-white transition-colors shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[0.875rem] font-bold text-odoo-dark truncate">{p.name}</div>
            {p.notes && (
              <div className="text-[0.75rem] text-gray-500 font-medium truncate mt-0.5 max-w-xs">
                {p.notes}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      className: 'text-center',
      cell: (p) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-odoo/10 border border-odoo/20 text-[0.75rem] font-bold text-odoo-dark font-mono uppercase">
            {p.type}
          </span>
        </div>
      ),
    },
    {
      header: 'Sales Price',
      className: 'font-mono',
      cell: (p) => (
        <div className="font-mono font-bold text-[0.875rem] text-odoo-dark">
          <CurrencyDisplay amount={p.salesPrice} size="sm" />
        </div>
      ),
    },
    {
      header: 'Cost Price',
      className: 'font-mono',
      cell: (p) => (
        <div className="font-mono text-[0.8125rem] text-gray-500">
          <CurrencyDisplay amount={p.costPrice} size="sm" />
        </div>
      ),
    },
    {
      header: 'Variants',
      className: 'text-center',
      cell: (p) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-[0.75rem] font-bold text-gray-600 font-mono gap-1">
            <Layers className="w-3.5 h-3.5 opacity-60" />
            <span>{p.variants?.length || 0} tier(s)</span>
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      className: 'text-center',
      cell: (p) => (
        <div className="text-center">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded border-[1.5px] border-black text-[0.625rem] font-bold uppercase tracking-widest shadow-[2px_2px_0_#000]',
              p.isActive ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#b91c1c]'
            )}
          >
            {p.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
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
            Products & Services
          </h1>
          <p className="text-[0.9375rem] text-gray-500 font-medium mt-1">
            Catalogue of billable software subscription tiers and standalone service packages
          </p>
        </div>
      </div>

      {/* Action Bar (Search + Add) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 anim-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="relative w-full sm:w-[28rem]">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or description..."
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
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Product Data Table Container */}
      <div className="flex flex-col flex-1">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          onRowClick={(p) => navigate(`/products/${p.id}`)}
          emptyTitle="No products found"
          emptyDescription="Create your first subscription product or adjust your filter."
        />

        {data?.pagination && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              limit={data.pagination.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Create Product Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Catalog Product"
        description="Define a new base product with pricing and classification"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Brightloop ERP Core"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              >
                <option value="SOFTWARE">SOFTWARE</option>
                <option value="SERVICE">SERVICE</option>
                <option value="HARDWARE">HARDWARE</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Sales Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="2000.00"
                value={formData.salesPriceRupees}
                onChange={(e) => setFormData({ ...formData, salesPriceRupees: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                Cost Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="800.00"
                value={formData.costPriceRupees}
                onChange={(e) => setFormData({ ...formData, costPriceRupees: e.target.value })}
                className="input-focus w-full px-4 py-2.5 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-odoo-dark shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Core ERP subscription with modules for finance, inventory, and HR..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {createMutation.isPending ? 'Saving...' : 'Create Product'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
