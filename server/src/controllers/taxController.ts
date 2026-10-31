import { Request, Response } from 'express';
import { TaxService } from '../services/taxService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class TaxController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const taxes = await TaxService.listTaxes(includeInactive);
      sendSuccess(res, taxes);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const tax = await TaxService.getTaxById(req.params.id);
      sendSuccess(res, tax);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tax = await TaxService.createTax(req.body, req.user?.userId);
      sendSuccess(res, tax, 'Tax rule created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tax = await TaxService.updateTax(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, tax, 'Tax rule updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tax = await TaxService.deleteTax(req.params.id, req.user?.userId);
      sendSuccess(res, tax, 'Tax rule deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

