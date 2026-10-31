import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Package, Layers } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable, Column } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';

export const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'SERVICE',
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
      setFormData({ name: '', type: 'SERVICE', salesPriceRupees: '', costPriceRupees: '', notes: '' });
      navigate(`/products/${p.id}`);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const columns: Column<Product>[] = [
    {
      header: 'PRODUCT NAME',
      cell: (p) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center font-bold text-xs shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-text-primary block">{p.name}</span>
            {p.notes && <span className="text-[11px] text-text-secondary truncate max-w-xs block">{p.notes}</span>}
          </div>
        </div>
      ),
    },
    {
      header: 'TYPE',
      cell: (p) => (
        <Badge variant={p.type === 'SOFTWARE' ? 'default' : 'secondary'}>
          {p.type}
        </Badge>
      ),
    },
    {
      header: 'SALES PRICE',
      cell: (p) => <CurrencyDisplay amount={p.salesPrice} size="sm" className="font-bold font-mono text-text-primary" />,
    },
    {
      header: 'COST PRICE',
      cell: (p) => <CurrencyDisplay amount={p.costPrice} size="sm" className="text-text-secondary font-mono" />,
    },
    {
      header: 'VARIANTS',
      cell: (p) => (
        <span className="inline-flex items-center space-x-1 text-xs text-text-secondary font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>{p.variants?.length || 0} tier(s)</span>
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (p) => (
        <Badge variant={p.isActive ? 'success' : 'danger'}>
          {p.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products & Services"
        description="Catalogue of billable software subscription tiers and standalone service packages"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Add Product
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Input
            placeholder="Search products by title or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 text-xs rounded-xl"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(p) => navigate(`/products/${p.id}`)}
        emptyTitle="No products found"
        emptyDescription="Create your first subscription product or adjust your filter."
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

      {/* Create Product Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Billable Product"
        description="Define base catalog item and pricing"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <Label htmlFor="prod-name" required>
              Product Name
            </Label>
            <Input
              id="prod-name"
              placeholder="e.g. BrightCRM"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="prod-type" required>
              Product Classification
            </Label>
            <select
              id="prod-type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-border-main bg-white px-3.5 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-plum-primary/20 shadow-sm cursor-pointer"
            >
              <option value="SOFTWARE">SOFTWARE (Recurring License / SaaS)</option>
              <option value="SERVICE">SERVICE (One-time or Support Service)</option>
              <option value="HARDWARE">HARDWARE (Terminal / Device)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prod-sales-price" required>
                Sales Price (₹)
              </Label>
              <Input
                id="prod-sales-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="2000.00"
                value={formData.salesPriceRupees}
                onChange={(e) => setFormData({ ...formData, salesPriceRupees: e.target.value })}
                required
                className="rounded-xl font-mono"
              />
            </div>

            <div>
              <Label htmlFor="prod-cost-price">Cost Price (₹)</Label>
              <Input
                id="prod-cost-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="500.00"
                value={formData.costPriceRupees}
                onChange={(e) => setFormData({ ...formData, costPriceRupees: e.target.value })}
                className="rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prod-notes">Internal Notes</Label>
            <Input
              id="prod-notes"
              placeholder="Features, tier inclusions, support SLA..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-3 border-t border-border-main">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>
              Create Product
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
