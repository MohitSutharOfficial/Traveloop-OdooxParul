import { Request, Response, NextFunction } from 'express';
import { TripService } from '../services/trip.service';
import { createTripSchema, updateTripSchema } from '../validators/schemas';

export class TripController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        status: req.query.status as any,
        destination: req.query.destination as string,
        from_date: req.query.from_date as string,
        to_date: req.query.to_date as string,
      };
      const { data, total } = await TripService.listByOwner(req.user!.id, page, limit, filters);
      res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = await TripService.getById(req.params.id, req.user!.id);
      if (!trip) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }); return; }
      res.json({ success: true, data: trip });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createTripSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const trip = await TripService.create(req.user!.id, value);
      res.status(201).json({ success: true, data: trip });
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updateTripSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const trip = await TripService.update(req.params.id, req.user!.id, value);
      res.json({ success: true, data: trip });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TripService.delete(req.params.id, req.user!.id);
      res.json({ success: true, message: 'Trip deleted' });
    } catch (err) { next(err); }
  }

  static async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await TripService.getStats(req.user!.id);
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
}
