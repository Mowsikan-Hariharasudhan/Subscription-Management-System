import { api } from './api';
import {
  DashboardKpis,
  MonthlyRevenueItem,
  SubscriptionGrowthItem,
  PaymentDistributionItem,
  Subscription,
  Invoice,
  Payment,
} from '../types';

export const dashboardService = {
  getKpis: async (): Promise<DashboardKpis> => {
    const res = await api.get('/dashboard/kpis');
    return res.data.data;
  },
  getMonthlyRevenue: async (year?: number): Promise<MonthlyRevenueItem[]> => {
    const res = await api.get('/dashboard/monthly-revenue', { params: { year } });
    return res.data.data;
  },
  getSubscriptionGrowth: async (): Promise<SubscriptionGrowthItem[]> => {
    const res = await api.get('/dashboard/subscription-growth');
    return res.data.data;
  },
  getPaymentDistribution: async (): Promise<PaymentDistributionItem[]> => {
    const res = await api.get('/dashboard/payment-distribution');
    return res.data.data;
  },
  getRecentSubscriptions: async (limit = 5): Promise<Subscription[]> => {
    const res = await api.get('/dashboard/recent-subscriptions', { params: { limit } });
    return res.data.data;
  },
  getRecentInvoices: async (limit = 5): Promise<Invoice[]> => {
    const res = await api.get('/dashboard/recent-invoices', { params: { limit } });
    return res.data.data;
  },
  getRecentPayments: async (limit = 5): Promise<Payment[]> => {
    const res = await api.get('/dashboard/recent-payments', { params: { limit } });
    return res.data.data;
  },
  getOverdueInvoices: async (limit = 5): Promise<Invoice[]> => {
    const res = await api.get('/dashboard/overdue-invoices', { params: { limit } });
    return res.data.data;
  },
};

