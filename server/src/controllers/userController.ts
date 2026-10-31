import { Response } from 'express';
import { UserService } from '../services/userService';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class UserController {
  static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await UserService.listUsers(req.query);
      sendPaginated(res, result.users, result.total, result.page, result.limit);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body, req.user?.userId);
      sendSuccess(res, user, 'User created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body, req.user?.userId);
      sendSuccess(res, user, 'User updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.deleteUser(req.params.id, req.user?.userId);
      sendSuccess(res, user, 'User deactivated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}

