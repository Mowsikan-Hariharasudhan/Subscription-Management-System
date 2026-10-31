import { api } from './api';
import { Invoice } from '../types';

export const invoiceService = {
  list: async (params?: any) => {
    const res = await api.get('/invoices', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Invoice> => {
    const res = await api.get(`/invoices/${id}`);
    return res.data.data;
  },
  confirm: async (id: string): Promise<Invoice> => {
    const res = await api.post(`/invoices/${id}/confirm`);
    return res.data.data;
  },
  cancel: async (id: string): Promise<Invoice> => {
    const res = await api.post(`/invoices/${id}/cancel`);
    return res.data.data;
  },
  runBillingNow: async (subscriptionId?: string) => {
    const res = await api.post('/invoices/billing/run', { subscriptionId });
    return res.data;
  },
};

