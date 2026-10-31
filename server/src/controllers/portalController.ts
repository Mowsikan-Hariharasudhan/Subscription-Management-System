import { Response } from 'express';
import { PortalService } from '../services/portalService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class PortalController {
  static async getOverview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const overview = await PortalService.getOverview(req.user.userId);
      sendSuccess(res, overview);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getSubscriptions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const subs = await PortalService.getSubscriptions(req.user.userId);
      sendSuccess(res, subs);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getSubscriptionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const sub = await PortalService.getSubscriptionById(req.user.userId, req.params.id);
      sendSuccess(res, sub);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async getInvoices(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const invoices = await PortalService.getInvoices(req.user.userId);
      sendSuccess(res, invoices);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getInvoiceById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const invoice = await PortalService.getInvoiceById(req.user.userId, req.params.id);
      sendSuccess(res, invoice);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async getPayments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const payments = await PortalService.getPayments(req.user.userId);
      sendSuccess(res, payments);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const account = await PortalService.getAccount(req.user.userId);
      sendSuccess(res, account);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async updateAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const updated = await PortalService.updateAccount(req.user.userId, req.body);
      sendSuccess(res, updated, 'Account updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

