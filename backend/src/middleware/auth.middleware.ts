import { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * Express augmentation — every authenticated request gets `req.user`.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      /** Raw Supabase access_token forwarded by the frontend. */
      accessToken?: string;
    }
  }
}

/**
 * Verifies the Supabase JWT carried in the `Authorization: Bearer <token>` header.
 * On success, populates `req.user` with `{ id, email, role }` from the JWT.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' },
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify with Supabase — returns the user record if valid
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn('Auth failed:', error?.message || 'no user');
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role || 'authenticated',
    };
    req.accessToken = token;

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-based authorisation guard.
 * Usage: `router.use(authenticate, authorize('admin'))`.
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
      return;
    }

    next();
  };
};
