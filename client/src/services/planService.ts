import { api } from './api';
import { SubscriptionPlan } from '../types';

export const planService = {
  list: async (includeInactive = false): Promise<SubscriptionPlan[]> => {
    const res = await api.get('/plans', { params: { includeInactive } });
    return res.data.data;
  },
  getById: async (id: string): Promise<SubscriptionPlan> => {
    const res = await api.get(`/plans/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<SubscriptionPlan> => {
    const res = await api.post('/plans', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<SubscriptionPlan> => {
    const res = await api.patch(`/plans/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<SubscriptionPlan> => {
    const res = await api.delete(`/plans/${id}`);
    return res.data.data;
  },
};

