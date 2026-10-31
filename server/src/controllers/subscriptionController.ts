import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class SubscriptionController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await SubscriptionService.listSubscriptions(req.query);
      sendPaginated(res, result.subscriptions, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.getSubscriptionById(req.params.id);
      sendSuccess(res, sub);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.createSubscription(req.body, req.user?.userId);
      sendSuccess(res, sub, 'Subscription created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.updateSubscription(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, sub, 'Subscription updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async confirm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.confirm(req.params.id, req.user?.userId);
      sendSuccess(res, sub, 'Subscription confirmed');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async activate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.activate(req.params.id, req.user?.userId);
      sendSuccess(res, sub, 'Subscription activated');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async pause(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.pause(req.params.id, req.user?.userId);
      sendSuccess(res, sub, 'Subscription paused');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async resume(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.resume(req.params.id, req.user?.userId);
      sendSuccess(res, sub, 'Subscription resumed');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async close(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.close(req.params.id, req.user?.userId);
      sendSuccess(res, sub, 'Subscription closed');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async renew(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sub = await SubscriptionService.renew(req.params.id, req.user?.userId);
      sendSuccess(res, sub, 'Subscription renewed successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

