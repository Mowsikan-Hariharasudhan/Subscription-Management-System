import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class ProductController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await ProductService.listProducts(req.query);
      sendPaginated(res, result.products, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.params.id);
      sendSuccess(res, product);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body, req.user?.userId);
      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, product, 'Product updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const product = await ProductService.deleteProduct(req.params.id, req.user?.userId);
      sendSuccess(res, product, 'Product deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  // Variants
  static async listVariants(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.query.productId as string | undefined;
      const variants = await ProductService.listVariants(productId);
      sendSuccess(res, variants);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async createVariant(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const variant = await ProductService.createVariant(req.body, req.user?.userId);
      sendSuccess(res, variant, 'Variant created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async updateVariant(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const variant = await ProductService.updateVariant(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, variant, 'Variant updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async deleteVariant(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const variant = await ProductService.deleteVariant(req.params.id, req.user?.userId);
      sendSuccess(res, variant, 'Variant deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

