import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';

export class UserController {
  /**
   * GET /api/v1/users
   * Get all users
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, full_name, role, is_active')
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      logger.error('User controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/users/:id
   * Get user by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, full_name, role, is_active')
        .eq('id', id)
        .single();

      if (error) {
        logger.error(`Error fetching user ${id}:`, error);
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      logger.error('User controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
