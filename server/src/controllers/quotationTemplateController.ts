import { Request, Response } from 'express';
import { QuotationTemplateService } from '../services/quotationTemplateService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class QuotationTemplateController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const templates = await QuotationTemplateService.listTemplates(includeInactive);
      sendSuccess(res, templates);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const template = await QuotationTemplateService.getTemplateById(req.params.id);
      sendSuccess(res, template);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const template = await QuotationTemplateService.createTemplate(req.body, req.user?.userId);
      sendSuccess(res, template, 'Quotation template created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const template = await QuotationTemplateService.updateTemplate(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, template, 'Quotation template updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const template = await QuotationTemplateService.deleteTemplate(req.params.id, req.user?.userId);
      sendSuccess(res, template, 'Quotation template deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

