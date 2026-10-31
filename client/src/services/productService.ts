import { api } from './api';
import { Product, ProductVariant } from '../types';

export const productService = {
  list: async (params?: any) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },
  create: async (data: any): Promise<Product> => {
    const res = await api.post('/products', data);
    return res.data.data;
  },
  update: async (id: string, data: any): Promise<Product> => {
    const res = await api.patch(`/products/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<Product> => {
    const res = await api.delete(`/products/${id}`);
    return res.data.data;
  },
  // Variants
  listVariants: async (productId?: string): Promise<ProductVariant[]> => {
    const res = await api.get('/product-variants', { params: { productId } });
    return res.data.data;
  },
  createVariant: async (data: any): Promise<ProductVariant> => {
    const res = await api.post('/product-variants', data);
    return res.data.data;
  },
  updateVariant: async (id: string, data: any): Promise<ProductVariant> => {
    const res = await api.patch(`/product-variants/${id}`, data);
    return res.data.data;
  },
  deleteVariant: async (id: string): Promise<ProductVariant> => {
    const res = await api.delete(`/product-variants/${id}`);
    return res.data.data;
  },
};

