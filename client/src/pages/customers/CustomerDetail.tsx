import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Mail, Phone, MapPin, Calendar, Edit3, Repeat, Receipt, CreditCard } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { formatDate } from '../../lib/utils';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(id!),
    enabled: !!id,
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['customer-subscriptions', id],
    queryFn: () => customerService.getSubscriptions(id!),
    enabled: !!id,
  });

  const { data: invoices } = useQuery({
    queryKey: ['customer-invoices', id],
    queryFn: () => customerService.getInvoices(id!),
    enabled: !!id,
  });

  const { data: payments } = useQuery({
    queryKey: ['customer-payments', id],
    queryFn: () => customerService.getPayments(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => customerService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      setIsEditOpen(false);
    },
  });

  const handleEditClick = () => {
    if (customer) {
      setEditData({
        name: customer.name,
        companyName: customer.companyName || '',
        phone: customer.phone || '',
        billingAddress: customer.billingAddress || '',
      });
      setIsEditOpen(true);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editData);
  };

  if (isLoading || !customer) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description={customer.companyName || 'Enterprise Customer'}
        breadcrumbs={[
          { label: 'Customers', href: '/customers' },
          { label: customer.name },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Profile
          </Button>
        }
      />

      {/* Top Customer Info Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-plum-light text-plum-primary flex items-center justify-center font-bold">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-text-secondary">Company</p>
              <p className="text-sm font-semibold text-text-primary truncate">
                {customer.companyName || '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Email</p>
              <p className="text-sm font-semibold text-text-primary truncate">
                {customer.user?.email}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Phone</p>
              <p className="text-sm font-semibold text-text-primary truncate">
                {customer.phone || '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Billing Address</p>
              <p className="text-sm font-semibold text-text-primary truncate">
                {customer.billingAddress || '—'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs View */}
      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">
            <Repeat className="w-3.5 h-3.5 mr-1.5" /> Subscriptions ({subscriptions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="w-3.5 h-3.5 mr-1.5" /> Invoices ({invoices?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Payments ({payments?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm font-semibold">Active & Historic Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                    <tr>
                      <th className="px-5 py-3">Number</th>
                      <th className="px-5 py-3">Plan</th>
                      <th className="px-5 py-3">Start Date</th>
                      <th className="px-5 py-3">Next Billing</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main/60">
                    {(!subscriptions || subscriptions.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                          No subscriptions recorded for this customer.
                        </td>
                      </tr>
                    ) : (
                      subscriptions.map((sub: any) => (
                        <tr key={sub.id} className="hover:bg-surface-main/50 transition-colors">
                          <td className="px-5 py-3 font-semibold text-plum-primary">
                            <Link to={`/subscriptions/${sub.id}`} className="hover:underline">
                              {sub.number}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-text-primary font-medium">{sub.plan?.name}</td>
                          <td className="px-5 py-3 text-text-secondary">{formatDate(sub.startDate)}</td>
                          <td className="px-5 py-3 text-text-secondary">{formatDate(sub.nextBillingDate)}</td>
                          <td className="px-5 py-3">
                            <StatusBadge status={sub.status} />
                          </td>
                          <td className="px-5 py-3 text-right">
                            <CurrencyDisplay amount={sub.total} size="sm" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm font-semibold">Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                    <tr>
                      <th className="px-5 py-3">Invoice #</th>
                      <th className="px-5 py-3">Issue Date</th>
                      <th className="px-5 py-3">Due Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Total</th>
                      <th className="px-5 py-3 text-right">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main/60">
                    {(!invoices || invoices.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                          No invoices recorded for this customer.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv: any) => (
                        <tr key={inv.id} className="hover:bg-surface-main/50 transition-colors">
                          <td className="px-5 py-3 font-semibold text-plum-primary">
                            <Link to={`/invoices`} className="hover:underline">
                              {inv.number}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-text-secondary">{formatDate(inv.issueDate)}</td>
                          <td className="px-5 py-3 text-text-secondary">{formatDate(inv.dueDate)}</td>
                          <td className="px-5 py-3">
                            <StatusBadge status={inv.status} />
                          </td>
                          <td className="px-5 py-3 text-right">
                            <CurrencyDisplay amount={inv.total} size="sm" />
                          </td>
                          <td className="px-5 py-3 text-right">
                            <CurrencyDisplay
                              amount={inv.outstanding}
                              size="sm"
                              className={inv.outstanding > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700'}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-main text-text-secondary uppercase border-b border-border-main font-semibold">
                    <tr>
                      <th className="px-5 py-3">Payment Date</th>
                      <th className="px-5 py-3">Invoice #</th>
                      <th className="px-5 py-3">Method</th>
                      <th className="px-5 py-3">Notes</th>
                      <th className="px-5 py-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main/60">
                    {(!payments || payments.length === 0) ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-text-secondary">
                          No payments recorded yet.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-surface-main/50 transition-colors">
                          <td className="px-5 py-3 text-text-secondary font-medium">
                            {formatDate(p.paymentDate)}
                          </td>
                          <td className="px-5 py-3 font-semibold text-plum-primary">
                            {p.invoice?.number}
                          </td>
                          <td className="px-5 py-3 text-text-secondary">{p.method}</td>
                          <td className="px-5 py-3 text-text-secondary truncate max-w-xs">
                            {p.notes || '—'}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <CurrencyDisplay amount={p.amount} size="sm" className="text-emerald-700 font-bold" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Customer Dialog */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Customer Profile"
      >
        <form onSubmit={handleEditSubmit} className="space-y-3.5">
          <div>
            <Label htmlFor="edit-name" required>
              Customer Name
            </Label>
            <Input
              id="edit-name"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-company">Company Name</Label>
            <Input
              id="edit-company"
              value={editData.companyName || ''}
              onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={editData.phone || ''}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="edit-addr">Billing Address</Label>
            <Input
              id="edit-addr"
              value={editData.billingAddress || ''}
              onChange={(e) => setEditData({ ...editData, billingAddress: e.target.value })}
            />
          </div>

          <div className="mt-5 flex justify-end space-x-2 pt-2 border-t border-border-main/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

