import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { updateProfileSchema } from '../validators/schemas';

export class ProfileController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await ProfileService.getById(req.user!.id);
      if (!profile) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } });
        return;
      }
      res.json({ success: true, data: profile });
    } catch (err) { next(err); }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updateProfileSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const profile = await ProfileService.update(req.user!.id, value);
      res.json({ success: true, data: profile });
    } catch (err) { next(err); }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { data, total } = await ProfileService.list(page, limit);
      res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (err) { next(err); }
  }
}
