import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Layers, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { productService } from '../../services/productService';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [variantForm, setVariantForm] = useState({
    name: '',
    attributeName: 'Tier',
    additionalPriceRupees: '0',
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: any) =>
      productService.update(id!, {
        ...data,
        salesPrice: Math.round(parseFloat(data.salesPriceRupees) * 100),
        costPrice: Math.round(parseFloat(data.costPriceRupees) * 100),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setIsEditOpen(false);
    },
  });

  const addVariantMutation = useMutation({
    mutationFn: (v: any) =>
      productService.createVariant({
        productId: id!,
        name: v.name,
        attributeName: v.attributeName,
        additionalPrice: Math.round(parseFloat(v.additionalPriceRupees || '0') * 100),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setIsAddVariantOpen(false);
      setVariantForm({ name: '', attributeName: 'Tier', additionalPriceRupees: '0' });
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: string) => productService.deleteVariant(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });

  const handleEditClick = () => {
    if (product) {
      setEditFormData({
        name: product.name,
        type: product.type,
        salesPriceRupees: (product.salesPrice / 100).toFixed(2),
        costPriceRupees: (product.costPrice / 100).toFixed(2),
        notes: product.notes || '',
      });
      setIsEditOpen(true);
    }
  };

  if (isLoading || !product) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`Base Catalog Product (${product.type})`}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Product
            </Button>
            <Button size="sm" onClick={() => setIsAddVariantOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Tier / Variant
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Classification</p>
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant={product.type === 'SOFTWARE' ? 'default' : 'secondary'}>
              {product.type}
            </Badge>
            <Badge variant={product.isActive ? 'success' : 'danger'}>
              {product.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Base Sales Price</p>
          <div className="mt-1">
            <CurrencyDisplay amount={product.salesPrice} size="xl" className="text-plum-deep" />
            <span className="text-xs text-text-secondary ml-1">/ billing cycle</span>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Unit Cost Price</p>
          <div className="mt-1">
            <CurrencyDisplay amount={product.costPrice} size="xl" className="text-text-secondary" />
          </div>
        </Card>
      </div>

      {/* Variants Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle className="text-base flex items-center space-x-2">
              <Layers className="w-4 h-4 text-plum-primary" />
              <span>Product Tiers & Variants</span>
            </CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Customers can choose from these configured plan tiers during subscription setup
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsAddVariantOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                <tr>
                  <th className="px-5 py-3">Variant Name</th>
                  <th className="px-5 py-3">Attribute</th>
                  <th className="px-5 py-3 text-right">Additional Price</th>
                  <th className="px-5 py-3 text-right">Total Tier Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/60">
                {(!product.variants || product.variants.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                      No tiers or variants added yet. Click "Add Variant" to configure tiers (e.g., Professional, Enterprise).
                    </td>
                  </tr>
                ) : (
                  product.variants.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-main/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-text-primary">{v.name}</td>
                      <td className="px-5 py-3.5 text-text-secondary">{v.attributeName || 'Tier'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <CurrencyDisplay amount={v.additionalPrice} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-plum-primary">
                        <CurrencyDisplay amount={product.salesPrice + v.additionalPrice} size="sm" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={v.isActive ? 'success' : 'danger'}>
                          {v.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {v.isActive && (
                          <button
                            onClick={() => deleteVariantMutation.mutate(v.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Deactivate variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Product"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProductMutation.mutate(editFormData);
          }}
          className="space-y-3.5"
        >
          <div>
            <Label htmlFor="edit-p-name" required>
              Product Name
            </Label>
            <Input
              id="edit-p-name"
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-p-sales" required>
                Sales Price (₹)
              </Label>
              <Input
                id="edit-p-sales"
                type="number"
                step="0.01"
                value={editFormData.salesPriceRupees || ''}
                onChange={(e) => setEditFormData({ ...editFormData, salesPriceRupees: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-p-cost">Cost Price (₹)</Label>
              <Input
                id="edit-p-cost"
                type="number"
                step="0.01"
                value={editFormData.costPriceRupees || ''}
                onChange={(e) => setEditFormData({ ...editFormData, costPriceRupees: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-p-notes">Notes</Label>
            <Input
              id="edit-p-notes"
              value={editFormData.notes || ''}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
            />
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={updateProductMutation.isPending}>
              Save Product
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Add Variant Dialog */}
      <Dialog
        isOpen={isAddVariantOpen}
        onClose={() => setIsAddVariantOpen(false)}
        title="Add Variant / Tier"
        description={`Add a tier to ${product.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addVariantMutation.mutate(variantForm);
          }}
          className="space-y-3.5"
        >
          <div>
            <Label htmlFor="var-name" required>
              Variant Name
            </Label>
            <Input
              id="var-name"
              placeholder="e.g. Enterprise Edition"
              value={variantForm.name}
              onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="var-attr">Attribute Name</Label>
              <Input
                id="var-attr"
                placeholder="Tier, Edition, etc."
                value={variantForm.attributeName}
                onChange={(e) => setVariantForm({ ...variantForm, attributeName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="var-price" required>
                Additional Price (₹)
              </Label>
              <Input
                id="var-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="500.00"
                value={variantForm.additionalPriceRupees}
                onChange={(e) => setVariantForm({ ...variantForm, additionalPriceRupees: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddVariantOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={addVariantMutation.isPending}>
              Create Variant
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

