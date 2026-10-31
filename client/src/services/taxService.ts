import { api } from './api';
import { TaxRule } from '../types';

export const taxService = {
  list: async (includeInactive = false): Promise<TaxRule[]> => {
    const res = await api.get('/taxes', { params: { includeInactive } });
    return res.data.data;
  },
  getById: async (id: string): Promise<TaxRule> => {
    const res = await api.get(`/taxes/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<TaxRule> => {
    const res = await api.post('/taxes', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<TaxRule> => {
    const res = await api.patch(`/taxes/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<TaxRule> => {
    const res = await api.delete(`/taxes/${id}`);
    return res.data.data;
  },
};

