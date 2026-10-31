import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { sendSuccess, sendError } from '../utils/response';

export class DashboardController {
  static async getKpis(req: Request, res: Response): Promise<void> {
    try {
      const kpis = await DashboardService.getKpis();
      sendSuccess(res, kpis);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getMonthlyRevenue(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
      const data = await DashboardService.getMonthlyRevenue(year);
      sendSuccess(res, data);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getSubscriptionGrowth(req: Request, res: Response): Promise<void> {
    try {
      const growth = await DashboardService.getSubscriptionGrowth();
      sendSuccess(res, growth);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getPaymentDistribution(req: Request, res: Response): Promise<void> {
    try {
      const dist = await DashboardService.getPaymentStatusDistribution();
      sendSuccess(res, dist);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getRecentSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const subs = await DashboardService.getRecentSubscriptions(limit);
      sendSuccess(res, subs);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getRecentInvoices(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const invs = await DashboardService.getRecentInvoices(limit);
      sendSuccess(res, invs);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getRecentPayments(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const payments = await DashboardService.getRecentPayments(limit);
      sendSuccess(res, payments);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  static async getOverdueInvoices(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const overdue = await DashboardService.getOverdueInvoices(limit);
      sendSuccess(res, overdue);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

