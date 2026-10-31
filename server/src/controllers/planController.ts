import { Request, Response } from 'express';
import { PlanService } from '../services/planService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class PlanController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const plans = await PlanService.listPlans(includeInactive);
      sendSuccess(res, plans);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const plan = await PlanService.getPlanById(req.params.id);
      sendSuccess(res, plan);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const plan = await PlanService.createPlan(req.body, req.user?.userId);
      sendSuccess(res, plan, 'Subscription plan created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const plan = await PlanService.updatePlan(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, plan, 'Subscription plan updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const plan = await PlanService.deletePlan(req.params.id, req.user?.userId);
      sendSuccess(res, plan, 'Subscription plan deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

