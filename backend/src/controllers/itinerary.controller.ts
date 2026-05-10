import { Request, Response, NextFunction } from 'express';
import { ItineraryService } from '../services/itinerary.service';
import { createItineraryItemSchema, updateItineraryItemSchema } from '../validators/schemas';

export class ItineraryController {
  static async listByTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ItineraryService.listByTrip(req.params.tripId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ItineraryService.getById(req.params.id);
      if (!item) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } }); return; }
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createItineraryItemSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const item = await ItineraryService.create(value);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updateItineraryItemSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const item = await ItineraryService.update(req.params.id, value);
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ItineraryService.delete(req.params.id);
      res.json({ success: true, message: 'Item deleted' });
    } catch (err) { next(err); }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'items array required' } }); return; }
      await ItineraryService.reorder(items);
      res.json({ success: true, message: 'Reordered' });
    } catch (err) { next(err); }
  }
}
