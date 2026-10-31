import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, CheckCircle2, XCircle, ArrowRight, Repeat, FileText, Building2 } from 'lucide-react';
import { quotationService } from '../../services/quotationService';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { formatDate } from '../../lib/utils';

export const QuotationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: quotation, isLoading } = useQuery({
    queryKey: ['quotation', id],
    queryFn: () => quotationService.getById(id!),
    enabled: !!id,
  });

  const confirmMutation = useMutation({
    mutationFn: () => quotationService.confirm(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotation', id] }),
  });

  const acceptMutation = useMutation({
    mutationFn: () => quotationService.accept(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotation', id] }),
  });

  const declineMutation = useMutation({
    mutationFn: () => quotationService.decline(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotation', id] }),
  });

  const convertMutation = useMutation({
    mutationFn: () => quotationService.convert(id!),
    onSuccess: (newSub) => {
      queryClient.invalidateQueries({ queryKey: ['quotation', id] });
      navigate(`/subscriptions/${newSub.id}`);
    },
  });

  if (isLoading || !quotation) {
    return <LoadingSkeleton count={4} />;
  }

  const isDraft = quotation.status === 'DRAFT';
  const isSent = quotation.status === 'SENT';
  const isAccepted = quotation.status === 'ACCEPTED';
  const isConverted = !!quotation.subscription;

  return (
    <div className="space-y-6">
      <PageHeader
        title={quotation.number}
        description={`Created on ${formatDate(quotation.createdAt)}`}
        breadcrumbs={[
          { label: 'Quotations', href: '/quotations' },
          { label: quotation.number },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            {isDraft && (
              <Button
                size="sm"
                onClick={() => confirmMutation.mutate()}
                isLoading={confirmMutation.isPending}
              >
                <Send className="w-3.5 h-3.5 mr-1" /> Send Quotation
              </Button>
            )}

            {isSent && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => declineMutation.mutate()}
                  isLoading={declineMutation.isPending}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1 text-rose-500" /> Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => acceptMutation.mutate()}
                  isLoading={acceptMutation.isPending}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Accepted
                </Button>
              </>
            )}

            {isAccepted && !isConverted && (
              <Button
                size="sm"
                onClick={() => convertMutation.mutate()}
                isLoading={convertMutation.isPending}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                <Repeat className="w-3.5 h-3.5 mr-1" /> Convert to Subscription
              </Button>
            )}

            {isConverted && (
              <Link to={`/subscriptions/${quotation.subscription?.id}`}>
                <Button size="sm" variant="secondary">
                  <Repeat className="w-3.5 h-3.5 mr-1" /> View Subscription ({quotation.subscription?.number})
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer info */}
        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Customer</p>
          <div className="mt-1">
            <Link
              to={`/customers/${quotation.customer.id}`}
              className="text-sm font-bold text-plum-primary hover:underline block"
            >
              {quotation.customer.name}
            </Link>
            {quotation.customer.companyName && (
              <span className="text-xs text-text-secondary">{quotation.customer.companyName}</span>
            )}
            <p className="text-xs text-text-secondary mt-1">{quotation.customer.phone || '—'}</p>
          </div>
        </Card>

        {/* Plan & Terms */}
        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Plan & Terms</p>
          <div className="mt-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Cadence:</span>
              <span className="font-semibold text-text-primary">{quotation.plan?.name || 'Manual'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Terms:</span>
              <span className="font-semibold text-text-primary">{quotation.paymentTerms || 'Due on Receipt'}</span>
            </div>
          </div>
        </Card>

        {/* Status card */}
        <Card className="p-4">
          <p className="text-xs text-text-secondary uppercase font-semibold">Quotation State</p>
          <div className="mt-2 flex items-center space-x-2">
            <StatusBadge status={quotation.status} />
            {quotation.expiryDate && (
              <span className="text-xs text-text-secondary">
                Expires {formatDate(quotation.expiryDate)}
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Lines Table */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-semibold">Proposed Items & Line Pricing</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                <tr>
                  <th className="px-5 py-3">Item / Service</th>
                  <th className="px-5 py-3 text-center">Qty</th>
                  <th className="px-5 py-3 text-right">Unit Price</th>
                  <th className="px-5 py-3 text-right">Tax Rate</th>
                  <th className="px-5 py-3 text-right">Tax Amount</th>
                  <th className="px-5 py-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/60">
                {quotation.lines.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-main/30">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-text-primary block">{l.product.name}</span>
                      {l.variant && (
                        <span className="text-[11px] text-text-secondary block">
                          Tier: {l.variant.name}
                        </span>
                      )}
                      {l.description && (
                        <span className="text-[11px] text-text-secondary/80 block mt-0.5">
                          {l.description}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center font-medium">{l.quantity}</td>
                    <td className="px-5 py-3.5 text-right">
                      <CurrencyDisplay amount={l.unitPrice} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right text-text-secondary">
                      {(l.taxRate / 100).toFixed(0)}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <CurrencyDisplay amount={l.taxAmount} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-text-primary">
                      <CurrencyDisplay amount={l.lineTotal} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="p-6 bg-surface-main/40 border-t border-border-main/60 flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <CurrencyDisplay amount={quotation.subtotal} size="sm" />
              </div>
              {quotation.discountAmt > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-<CurrencyDisplay amount={quotation.discountAmt} size="sm" /></span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Tax (GST)</span>
                <CurrencyDisplay amount={quotation.taxAmount} size="sm" />
              </div>
              <div className="flex justify-between text-base font-bold text-plum-deep pt-2 border-t border-border-main">
                <span>Total Amount</span>
                <CurrencyDisplay amount={quotation.total} size="lg" className="text-plum-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

