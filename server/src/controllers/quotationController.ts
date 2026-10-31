import { Request, Response } from 'express';
import { QuotationService } from '../services/quotationService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class QuotationController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await QuotationService.listQuotations(req.query);
      sendPaginated(res, result.quotations, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const quotation = await QuotationService.getQuotationById(req.params.id);
      sendSuccess(res, quotation);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quotation = await QuotationService.createQuotation(req.body, req.user?.userId);
      sendSuccess(res, quotation, 'Quotation created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quotation = await QuotationService.updateQuotation(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, quotation, 'Quotation updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async confirm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quotation = await QuotationService.confirmQuotation(req.params.id, req.user?.userId);
      sendSuccess(res, quotation, 'Quotation confirmed (sent)');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async accept(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quotation = await QuotationService.acceptQuotation(req.params.id, req.user?.userId);
      sendSuccess(res, quotation, 'Quotation accepted');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async decline(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quotation = await QuotationService.declineQuotation(req.params.id, req.user?.userId);
      sendSuccess(res, quotation, 'Quotation declined');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async convert(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const subscription = await QuotationService.convertToSubscription(req.params.id, req.user?.userId);
      sendSuccess(res, subscription, 'Quotation successfully converted to active subscription', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

