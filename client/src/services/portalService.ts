import { api } from './api';
import { Customer, Subscription, Invoice, Payment } from '../types';

export const portalService = {
  getOverview: async () => {
    const res = await api.get('/customer-portal/overview');
    return res.data.data;
  },
  getSubscriptions: async (): Promise<Subscription[]> => {
    const res = await api.get('/customer-portal/subscriptions');
    return res.data.data;
  },
  getSubscriptionById: async (id: string): Promise<Subscription> => {
    const res = await api.get(`/customer-portal/subscriptions/${id}`);
    return res.data.data;
  },
  getInvoices: async (): Promise<Invoice[]> => {
    const res = await api.get('/customer-portal/invoices');
    return res.data.data;
  },
  getInvoiceById: async (id: string): Promise<Invoice> => {
    const res = await api.get(`/customer-portal/invoices/${id}`);
    return res.data.data;
  },
  getPayments: async (): Promise<Payment[]> => {
    const res = await api.get('/customer-portal/payments');
    return res.data.data;
  },
  getAccount: async (): Promise<Customer> => {
    const res = await api.get('/customer-portal/account');
    return res.data.data;
  },
  updateAccount: async (data: any): Promise<Customer> => {
    const res = await api.patch('/customer-portal/account', data);
    return res.data.data;
  },
};

