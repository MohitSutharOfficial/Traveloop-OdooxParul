import { NextFunction, Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { createAdminUserSchema, updateAdminUserSchema } from '../validators/schemas';

const ALLOWED_SORT_FIELDS = new Set(['created_at', 'email', 'first_name', 'last_name']);

export class AdminController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createAdminUserSchema.validate(req.body);
      if (vErr) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION', message: vErr.message },
        });
        return;
      }

      const user = await AdminService.createUser(value);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  static async dashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getDashboard();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const search = String(req.query.search || '').trim();
      const sortByInput = String(req.query.sortBy || 'created_at');
      const sortOrder = String(req.query.sortOrder || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

      const sortBy = ALLOWED_SORT_FIELDS.has(sortByInput) ? (sortByInput as 'created_at' | 'email' | 'first_name' | 'last_name') : 'created_at';

      const { data, total } = await AdminService.listUsers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updateAdminUserSchema.validate(req.body);
      if (vErr) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION', message: vErr.message },
        });
        return;
      }

      const user = await AdminService.updateUser(req.params.id, value);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.id === req.params.id) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION', message: 'You cannot delete your own account from admin panel' },
        });
        return;
      }

      await AdminService.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
