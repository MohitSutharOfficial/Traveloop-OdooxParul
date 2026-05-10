import { Router } from 'express';
import {
  signup,
  login,
  verifyEmail,
  resendConfirmation,
  forgotPassword,
  resetPassword,
  health,
} from '../controllers/auth.controller';

const router = Router();

// Sign up with email (creates Supabase user + sends Resend confirmation email)
router.post('/signup', signup);

// Login with email and password
router.post('/login', login);

// Verify email from Resend confirmation link — GET /verify-email?token=<userId>
router.get('/verify-email', verifyEmail);

// Resend confirmation email
router.post('/resend-confirmation', resendConfirmation);

// Forgot password (sends Resend reset email)
router.post('/forgot-password', forgotPassword);

// Reset password (uses token to set new password)
router.post('/reset-password', resetPassword);

// Health check
router.get('/health', health);

export default router;
