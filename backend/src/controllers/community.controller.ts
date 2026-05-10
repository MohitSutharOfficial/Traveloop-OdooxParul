import { Request, Response, NextFunction } from 'express';
import { CommunityService } from '../services/community.service';
import { createCommunityPostSchema } from '../validators/schemas';

export class CommunityController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const destination = req.query.destination as string;
      const { data, total } = await CommunityService.list(page, limit, destination);
      res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await CommunityService.getById(req.params.id);
      if (!post) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } }); return; }
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error: vErr, value } = createCommunityPostSchema.validate(req.body);
      if (vErr) { res.status(400).json({ success: false, error: { code: 'VALIDATION', message: vErr.message } }); return; }
      const post = await CommunityService.create(req.user!.id, value);
      res.status(201).json({ success: true, data: post });
    } catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CommunityService.delete(req.params.id, req.user!.id);
      res.json({ success: true, message: 'Post deleted' });
    } catch (err) { next(err); }
  }

  static async like(req: Request, res: Response, next: NextFunction) {
    try {
      await CommunityService.like(req.params.id, req.user!.id);
      res.json({ success: true, message: 'Post liked' });
    } catch (err) { next(err); }
  }

  static async unlike(req: Request, res: Response, next: NextFunction) {
    try {
      await CommunityService.unlike(req.params.id, req.user!.id);
      res.json({ success: true, message: 'Post unliked' });
    } catch (err) { next(err); }
  }
}
