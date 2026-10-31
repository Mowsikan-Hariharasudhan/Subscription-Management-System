import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoiceService';
import { BillingService } from '../services/billingService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class InvoiceController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await InvoiceService.listInvoices(req.query);
      sendPaginated(res, result.invoices, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const invoice = await InvoiceService.getInvoiceById(req.params.id);
      sendSuccess(res, invoice);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async confirm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const invoice = await InvoiceService.confirmInvoice(req.params.id, req.user?.userId);
      sendSuccess(res, invoice, 'Invoice confirmed');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async cancel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const invoice = await InvoiceService.cancelInvoice(req.params.id, req.user?.userId);
      sendSuccess(res, invoice, 'Invoice cancelled');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async runBilling(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const subscriptionId = req.body?.subscriptionId as string | undefined;
      const result = await BillingService.runBillingCycle({ subscriptionId });
      sendSuccess(
        res,
        result,
        `Billing run complete: ${result.invoicesCreated} invoices generated, ${result.skipped} skipped`
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

