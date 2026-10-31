import { api } from './api';
import { Quotation, QuotationTemplate } from '../types';

export const quotationService = {
  list: async (params?: any) => {
    const res = await api.get('/quotations', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Quotation> => {
    const res = await api.get(`/quotations/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<Quotation> => {
    const res = await api.post('/quotations', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<Quotation> => {
    const res = await api.patch(`/quotations/${id}`, data);
    return res.data.data;
  },
  confirm: async (id: string): Promise<Quotation> => {
    const res = await api.post(`/quotations/${id}/confirm`);
    return res.data.data;
  },
  accept: async (id: string): Promise<Quotation> => {
    const res = await api.post(`/quotations/${id}/accept`);
    return res.data.data;
  },
  decline: async (id: string): Promise<Quotation> => {
    const res = await api.post(`/quotations/${id}/decline`);
    return res.data.data;
  },
  convert: async (id: string) => {
    const res = await api.post(`/quotations/${id}/convert`);
    return res.data.data;
  },
  // Templates
  listTemplates: async (includeInactive = false): Promise<QuotationTemplate[]> => {
    const res = await api.get('/quotation-templates', { params: { includeInactive } });
    return res.data.data;
  },
  getTemplateById: async (id: string): Promise<QuotationTemplate> => {
    const res = await api.get(`/quotation-templates/${id}`);
    return res.data.data;
  },
  createTemplate: async (data: any): Promise<QuotationTemplate> => {
    const res = await api.post('/quotation-templates', data);
    return res.data.data;
  },
  updateTemplate: async (id: string, data: any): Promise<QuotationTemplate> => {
    const res = await api.patch(`/quotation-templates/${id}`, data);
    return res.data.data;
  },
  deleteTemplate: async (id: string): Promise<QuotationTemplate> => {
    const res = await api.delete(`/quotation-templates/${id}`);
    return res.data.data;
  },
};

