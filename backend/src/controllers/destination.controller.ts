import { Request, Response, NextFunction } from 'express';
import { DestinationService } from '../services/destination.service';
import { createDestinationSchema } from '../validators/schemas';

export class DestinationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const { data, total } = await DestinationService.list(page, limit, search);
      res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const dest = await DestinationService.getById(req.params.id);
      if (!dest) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Destination not found' } }); return; }
      res.json({ success: true, data: dest });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createDestinationSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const dest = await DestinationService.create(value);
      res.status(201).json({ success: true, data: dest });
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dest = await DestinationService.update(req.params.id, req.body);
      res.json({ success: true, data: dest });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DestinationService.delete(req.params.id);
      res.json({ success: true, message: 'Destination deleted' });
    } catch (err) { next(err); }
  }
}
