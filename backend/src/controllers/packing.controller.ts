import { Request, Response, NextFunction } from 'express';
import { PackingService } from '../services/packing.service';
import { createPackingItemSchema, updatePackingItemSchema } from '../validators/schemas';

export class PackingController {
  static async listByTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PackingService.listByTrip(req.params.tripId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createPackingItemSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const item = await PackingService.create(value);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updatePackingItemSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const item = await PackingService.update(req.params.id, value);
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async togglePacked(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await PackingService.togglePacked(req.params.id);
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await PackingService.delete(req.params.id);
      res.json({ success: true, message: 'Item deleted' });
    } catch (err) { next(err); }
  }

  static async bulkCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'items array required' } }); return; }
      const data = await PackingService.bulkCreate(items);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  }
}
