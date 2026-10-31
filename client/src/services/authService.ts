import { api } from './api';
import { User } from '../types';

export const authService = {
  login: async (dto: any) => {
    const res = await api.post('/auth/login', dto);
    return res.data;
  },
  register: async (dto: any) => {
    const res = await api.post('/auth/register', dto);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (dto: any) => {
    const res = await api.post('/auth/reset-password', dto);
    return res.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};

