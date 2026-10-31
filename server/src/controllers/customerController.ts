import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class CustomerController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await CustomerService.listCustomers(req.query);
      sendPaginated(res, result.customers, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      sendSuccess(res, customer);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const customer = await CustomerService.createCustomer(req.body, req.user?.userId);
      sendSuccess(res, customer, 'Customer created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const customer = await CustomerService.updateCustomer(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, customer, 'Customer updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const subs = await CustomerService.getCustomerSubscriptions(req.params.id);
      sendSuccess(res, subs);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await CustomerService.getCustomerInvoices(req.params.id);
      sendSuccess(res, invoices);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async getPayments(req: Request, res: Response): Promise<void> {
    try {
      const payments = await CustomerService.getCustomerPayments(req.params.id);
      sendSuccess(res, payments);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

