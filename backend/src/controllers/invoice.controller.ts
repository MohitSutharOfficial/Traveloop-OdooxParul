import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/schemas';

export class InvoiceController {
  static async listByTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await InvoiceService.listByTrip(req.params.tripId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await InvoiceService.getById(req.params.id);
      if (!invoice) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Invoice not found' } }); return; }
      res.json({ success: true, data: invoice });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createInvoiceSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const invoice = await InvoiceService.create(value);
      res.status(201).json({ success: true, data: invoice });
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = updateInvoiceSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const invoice = await InvoiceService.update(req.params.id, value);
      res.json({ success: true, data: invoice });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await InvoiceService.delete(req.params.id);
      res.json({ success: true, message: 'Invoice deleted' });
    } catch (err) { next(err); }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { description, amount } = req.body;
      if (!description || amount == null) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'description and amount required' } }); return; }
      const item = await InvoiceService.addItem(req.params.id, description, amount);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      await InvoiceService.removeItem(req.params.itemId, req.params.id);
      res.json({ success: true, message: 'Item removed' });
    } catch (err) { next(err); }
  }
}
