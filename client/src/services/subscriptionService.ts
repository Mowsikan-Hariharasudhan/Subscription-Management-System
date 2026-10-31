import { api } from './api';
import { Subscription } from '../types';

export const subscriptionService = {
  list: async (params?: any) => {
    const res = await api.get('/subscriptions', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Subscription> => {
    const res = await api.get(`/subscriptions/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<Subscription> => {
    const res = await api.post('/subscriptions', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<Subscription> => {
    const res = await api.patch(`/subscriptions/${id}`, data);
    return res.data.data;
  },
  confirm: async (id: string): Promise<Subscription> => {
    const res = await api.post(`/subscriptions/${id}/confirm`);
    return res.data.data;
  },
  activate: async (id: string): Promise<Subscription> => {
    const res = await api.post(`/subscriptions/${id}/activate`);
    return res.data.data;
  },
  pause: async (id: string): Promise<Subscription> => {
    const res = await api.post(`/subscriptions/${id}/pause`);
    return res.data.data;
  },
  resume: async (id: string): Promise<Subscription> => {
    const res = await api.post(`/subscriptions/${id}/resume`);
    return res.data.data;
  },
  close: async (id: string): Promise<Subscription> => {
    const res = await api.post(`/subscriptions/${id}/close`);
    return res.data.data;
  },
  renew: async (id: string): Promise<Subscription> => {
    const res = await api.post(`/subscriptions/${id}/renew`);
    return res.data.data;
  },
};

