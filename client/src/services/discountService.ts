import { api } from './api';
import { DiscountRule } from '../types';

export const discountService = {
  list: async (includeInactive = false): Promise<DiscountRule[]> => {
    const res = await api.get('/discounts', { params: { includeInactive } });
    return res.data.data;
  },
  getById: async (id: string): Promise<DiscountRule> => {
    const res = await api.get(`/discounts/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<DiscountRule> => {
    const res = await api.post('/discounts', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<DiscountRule> => {
    const res = await api.patch(`/discounts/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<DiscountRule> => {
    const res = await api.delete(`/discounts/${id}`);
    return res.data.data;
  },
  getRedemptions: async (id: string) => {
    const res = await api.get(`/discounts/${id}/redemptions`);
    return res.data.data;
  },
};

