import { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/note.service';
import { createTripNoteSchema, updateTripNoteSchema } from '../validators/schemas';

export class NoteController {
  static async listByTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await NoteService.listByTrip(req.params.tripId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.getById(req.params.id);
      if (!note) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Note not found' } }); return; }
      res.json({ success: true, data: note });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createTripNoteSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const note = await NoteService.create(value);
      res.status(201).json({ success: true, data: note });
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updateTripNoteSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const note = await NoteService.update(req.params.id, value);
      res.json({ success: true, data: note });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await NoteService.delete(req.params.id);
      res.json({ success: true, message: 'Note deleted' });
    } catch (err) { next(err); }
  }
}
