import { api } from './api';
import { Customer } from '../types';

export const customerService = {
  list: async (params?: any) => {
    const res = await api.get('/customers', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Customer> => {
    const res = await api.get(`/customers/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<Customer> => {
    const res = await api.post('/customers', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<Customer> => {
    const res = await api.patch(`/customers/${id}`, data);
    return res.data.data;
  },
  getSubscriptions: async (id: string) => {
    const res = await api.get(`/customers/${id}/subscriptions`);
    return res.data.data;
  },
  getInvoices: async (id: string) => {
    const res = await api.get(`/customers/${id}/invoices`);
    return res.data.data;
  },
  getPayments: async (id: string) => {
    const res = await api.get(`/customers/${id}/payments`);
    return res.data.data;
  },
};

