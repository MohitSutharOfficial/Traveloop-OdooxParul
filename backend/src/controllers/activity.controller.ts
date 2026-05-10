import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { createActivitySchema } from '../validators/schemas';

export class ActivityController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        category: req.query.category as string,
        destination_id: req.query.destination_id as string,
        search: req.query.search as string,
      };
      const { data, total } = await ActivityService.list(page, limit, filters);
      res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const activity = await ActivityService.getById(req.params.id);
      if (!activity) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }); return; }
      res.json({ success: true, data: activity });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createActivitySchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const activity = await ActivityService.create(value);
      res.status(201).json({ success: true, data: activity });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ActivityService.delete(req.params.id);
      res.json({ success: true, message: 'Activity deleted' });
    } catch (err) { next(err); }
  }
}
