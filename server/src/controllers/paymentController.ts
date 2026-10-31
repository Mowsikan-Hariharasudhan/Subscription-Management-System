import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class PaymentController {
  static async record(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const payment = await PaymentService.recordPayment(req.body, req.user.userId);
      sendSuccess(res, payment, 'Payment recorded successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await PaymentService.listPayments(req.query);
      sendPaginated(res, result.payments, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id);
      sendSuccess(res, payment);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }
}

