import { Request, Response } from 'express';
import {
  handleSignupWithEmail,
  resendConfirmationEmail,
  handlePasswordResetRequest,
  handleLogin,
  verifyEmailToken,
} from '../services/auth.service';
import { logger } from '../utils/logger';
import Joi from 'joi';

/**
 * Sign up with email
 * POST /api/v1/auth/signup
 */
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      fullName: Joi.string().min(2).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const result = await handleSignupWithEmail(value.email, value.password, value.fullName);
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    logger.error('Signup error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Login with email and password
 * POST /api/v1/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const result = await handleLogin(value.email, value.password);
    res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Verify email token from Resend confirmation link
 * GET /api/v1/auth/verify-email?token=<userId>
 */
export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const token = req.query.token as string;

    if (!token) {
      res.status(400).json({ success: false, message: 'Verification token is required' });
      return;
    }

    const result = await verifyEmailToken(token);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    logger.error('Verify email error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Resend confirmation email
 * POST /api/v1/auth/resend-confirmation
 */
export async function resendConfirmation(req: Request, res: Response): Promise<void> {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const result = await resendConfirmationEmail(value.email);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    logger.error('Resend confirmation error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Request password reset
 * POST /api/v1/auth/forgot-password
 */
export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const result = await handlePasswordResetRequest(value.email);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    logger.error('Forgot password error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Reset password using token
 * POST /api/v1/auth/reset-password
 */
export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(8).required()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const { supabaseAdmin } = await import('../config/supabase');
    const { data, error: resetError } = await supabaseAdmin.auth.admin.updateUserById(value.token, {
      password: value.password,
    });

    if (resetError) {
      logger.error('Password reset error:', resetError);
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token, or password too weak.',
        error: resetError.message,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (err) {
    logger.error('Reset password error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Health check
 * GET /api/v1/auth/health
 */
export function health(req: Request, res: Response): void {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
