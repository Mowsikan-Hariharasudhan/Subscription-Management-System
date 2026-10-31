import { Request, Response } from 'express';
import { DiscountService } from '../services/discountService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class DiscountController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const discounts = await DiscountService.listDiscounts(includeInactive);
      sendSuccess(res, discounts);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const discount = await DiscountService.getDiscountById(req.params.id);
      sendSuccess(res, discount);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const discount = await DiscountService.createDiscount(req.body, req.user?.userId);
      sendSuccess(res, discount, 'Discount rule created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const discount = await DiscountService.updateDiscount(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, discount, 'Discount rule updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const discount = await DiscountService.deleteDiscount(req.params.id, req.user?.userId);
      sendSuccess(res, discount, 'Discount rule deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getRedemptions(req: Request, res: Response): Promise<void> {
    try {
      const redemptions = await DiscountService.getRedemptions(req.params.id);
      sendSuccess(res, redemptions);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

