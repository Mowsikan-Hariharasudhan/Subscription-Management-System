import { api } from './api';
import { Payment } from '../types';

export const paymentService = {
  list: async (params?: any) => {
    const res = await api.get('/payments', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Payment> => {
    const res = await api.get(`/payments/${id}`);
    return res.data.data;
  },
  record: async (data: any): Promise<Payment> => {
    const res = await api.post('/payments', data);
    return res.data.data;
  },
};

