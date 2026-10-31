import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Layers,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { planService } from '../../services/planService';
import { portalService } from '../../services/portalService';
import { Product, ProductVariant } from '../../types';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';

export const ExplorePlans: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'SOFTWARE' | 'SERVICE'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Fetch Products
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['portal-products'],
    queryFn: () => productService.list({ limit: 100 }),
  });

  // Fetch Plans
  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ['portal-plans'],
    queryFn: () => planService.list(),
  });

  const products: Product[] = productsData?.data || [];

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: (payload: {
      planId: string;
      productId: string;
      variantId?: string;
      quantity?: number;
      notes?: string;
    }) => portalService.subscribeNew(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['portal-overview'] });
      setIsSubscribeDialogOpen(false);
      navigate('/portal/subscriptions');
    },
    onError: (err: any) => {
      alert(`Failed to subscribe: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleOpenSubscribe = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
    if (plans && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
    setNotes('');
    setIsSubscribeDialogOpen(true);
  };

  const handleConfirmSubscription = () => {
    if (!selectedProduct || !selectedPlanId) return;
    subscribeMutation.mutate({
      productId: selectedProduct.id,
      planId: selectedPlanId,
      variantId: selectedVariant?.id,
      quantity: 1,
      notes,
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'ALL' || p.type === selectedType;
    return p.isActive && matchesSearch && matchesType;
  });

  if (loadingProducts || loadingPlans) {
    return <LoadingSkeleton count={4} />;
  }

  const selectedPlan = plans?.find((p) => p.id === selectedPlanId);
  const calculatedPrice =
    (selectedProduct?.salesPrice || 0) + (selectedVariant?.additionalPrice || 0);

  return (
    <div className="space-y-7 pb-12">
      {/* Hero Header */}
      <div className="rounded-2xl border border-border-main bg-white shadow-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-plum-surface text-plum-primary text-xs font-bold border border-plum-border">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product & Subscription Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Get Applications & Manage Services
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Expand your corporate workspace with additional software licenses, analytics tools,
            and dedicated cloud services. Choose a plan frequency and activate in seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/portal/subscriptions')}
            className="px-4 py-2.5 rounded-xl border border-border-main bg-surface-main text-xs font-bold text-text-primary hover:bg-white transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>View Active Subscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border-main bg-white text-xs text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-plum-primary transition-all shadow-xs"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-white border border-border-main rounded-xl shadow-xs self-start sm:self-auto">
          {(['ALL', 'SOFTWARE', 'SERVICE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-plum-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {type === 'ALL' ? 'All Products' : type === 'SOFTWARE' ? 'Software Suites' : 'Services'}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-border-main bg-white p-12 text-center shadow-card">
          <Package className="w-10 h-10 text-text-secondary/50 mx-auto mb-3" />
          <h3 className="text-base font-bold text-text-primary">No products match your search</h3>
          <p className="text-xs text-text-secondary mt-1">
            Try adjusting your search query or switching filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const hasVariants = product.variants && product.variants.length > 0;
            return (
              <div
                key={product.id}
                className="rounded-2xl border border-border-main bg-white shadow-card hover:shadow-elevated transition-all flex flex-col justify-between p-5 space-y-4"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center font-bold shadow-xs">
                      <Package className="w-5 h-5" />
                    </div>
                    <Badge variant={product.type === 'SOFTWARE' ? 'default' : 'secondary'}>
                      {product.type}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-text-primary leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1 min-h-[2rem]">
                      {product.notes || 'Full enterprise subscription license with continuous updates and dedicated support.'}
                    </p>
                  </div>

                  {/* Highlights / Features */}
                  <div className="pt-2 border-t border-border-main/70 space-y-1.5 text-xs text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant provisioning upon confirmation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Automated recurring invoicing & receipts</span>
                    </div>
                    {hasVariants && (
                      <div className="flex items-center space-x-2 text-plum-primary font-medium">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span>{product.variants!.length} edition tier(s) available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="pt-4 border-t border-border-main flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-secondary font-bold block">
                      Starting at
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <CurrencyDisplay
                        amount={product.salesPrice}
                        size="md"
                        className="font-bold font-mono text-text-primary"
                      />
                      <span className="text-[11px] text-text-secondary font-medium">/ mo</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleOpenSubscribe(product)}
                    size="sm"
                    className="cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <Zap className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscription Checkout Dialog */}
      <Dialog
        isOpen={isSubscribeDialogOpen}
        onClose={() => setIsSubscribeDialogOpen(false)}
        title={`Subscribe to ${selectedProduct?.name || 'Product'}`}
        description="Configure your subscription tier and recurring cadence."
        maxWidth="md"
      >
        {selectedProduct && (
          <div className="space-y-4 py-2">
            {/* Product Summary Card */}
            <div className="p-3.5 rounded-xl border border-border-main bg-surface-main/60 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-plum-surface text-plum-primary border border-plum-border flex items-center justify-center font-bold shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text-primary truncate">
                  {selectedProduct.name}
                </p>
                <p className="text-[11px] text-text-secondary capitalize">
                  {selectedProduct.type.toLowerCase()} product license
                </p>
              </div>
            </div>

            {/* Variant Selector (if available) */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Select Edition / Tier
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {selectedProduct.variants.map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'border-plum-primary bg-plum-surface/50 text-text-primary font-bold shadow-xs'
                          : 'border-border-main bg-white text-text-secondary hover:bg-surface-main'
                      }`}
                    >
                      <div>
                        <span>{v.name}</span>
                        {v.attributeName && (
                          <span className="text-[10px] text-text-secondary block">
                            {v.attributeName}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-semibold">
                        {v.additionalPrice > 0 ? (
                          <>
                            +<CurrencyDisplay amount={v.additionalPrice} size="sm" />
                          </>
                        ) : (
                          'Included'
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Plan Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Billing Plan Cadence
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border-main bg-white text-xs text-text-primary focus:outline-none focus:border-plum-primary"
              >
                {plans?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — ({plan.billingFrequency.toLowerCase()} billing)
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Subscription Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sales team deployment, Branch office"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border-main bg-white text-xs text-text-primary focus:outline-none focus:border-plum-primary"
              />
            </div>

            {/* Summary Breakdown */}
            <div className="p-3.5 rounded-xl border border-border-main bg-plum-surface/30 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Base Price</span>
                <CurrencyDisplay amount={selectedProduct.salesPrice} size="sm" />
              </div>
              {selectedVariant && selectedVariant.additionalPrice > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Variant Extra ({selectedVariant.name})</span>
                  <CurrencyDisplay amount={selectedVariant.additionalPrice} size="sm" />
                </div>
              )}
              <div className="pt-2 border-t border-border-main flex justify-between font-bold text-text-primary">
                <span>Recurring Total</span>
                <div className="text-right">
                  <CurrencyDisplay amount={calculatedPrice} size="md" className="text-plum-primary font-mono" />
                  <span className="text-[10px] text-text-secondary font-normal block">
                    per {selectedPlan?.billingFrequency.toLowerCase() || 'cycle'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You can pause, resume, or cancel this subscription at any time.</span>
            </div>

            <div className="pt-4 border-t border-border-main flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsSubscribeDialogOpen(false)}
                disabled={subscribeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmSubscription}
                disabled={subscribeMutation.isPending}
                isLoading={subscribeMutation.isPending}
              >
                Confirm Subscription
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
