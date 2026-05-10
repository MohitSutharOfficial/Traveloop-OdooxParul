import { supabase, supabaseAdmin } from '../config/supabase';
import { sendConfirmationEmail, sendPasswordResetEmail } from './email.service';
import { logger } from '../utils/logger';

/**
 * Handle user signup with email verification via Resend
 * Creates a real Supabase Auth user (unconfirmed), then sends a custom email via Resend.
 */
export async function handleSignupWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<{
  success: boolean;
  message: string;
  userId?: string;
  error?: string;
}> {
  try {
    // Create user in Supabase Auth — email_confirm: false keeps them unconfirmed
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: false, // We confirm manually after Resend link is clicked
    });

    if (error) {
      // Handle duplicate email gracefully
      if (error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already been registered') ||
          error.message.toLowerCase().includes('unique constraint')) {
        return {
          success: false,
          message: 'An account with this email already exists. Please login or reset your password.',
          error: 'EMAIL_ALREADY_EXISTS',
        };
      }
      logger.error('Supabase createUser error:', error);
      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }

    const userId = data.user.id;
    logger.info(`Supabase user created: ${email} (ID: ${userId})`);

    // Send confirmation email via Resend — token IS the Supabase user ID
    const emailSent = await sendConfirmationEmail(email, userId, fullName);

    if (!emailSent) {
      logger.warn(`User created (${userId}) but confirmation email failed`);
      return {
        success: true,
        message: 'Account created but confirmation email failed to send. Please use "Resend confirmation".',
        userId,
      };
    }

    return {
      success: true,
      message: 'Account created! Please check your email to confirm your account.',
      userId,
    };
  } catch (err) {
    logger.error('Signup error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Verify email using the token from the Resend confirmation link.
 * The token equals the Supabase user ID set during signup.
 */
export async function verifyEmailToken(
  token: string
): Promise<{
  success: boolean;
  message: string;
  userId?: string;
  error?: string;
}> {
  try {
    if (!token || token.length < 10) {
      return {
        success: false,
        message: 'Invalid verification token',
        error: 'INVALID_TOKEN',
      };
    }

    // Mark the user's email as confirmed in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(token, {
      email_confirm: true,
    });

    if (error) {
      logger.error('Email verification error:', error.message);
      return {
        success: false,
        message: 'Invalid or expired verification link. Please request a new confirmation email.',
        error: error.message,
      };
    }

    logger.info(`Email verified for user: ${data.user.email} (ID: ${token})`);

    return {
      success: true,
      message: 'Email verified successfully! You can now log in.',
      userId: data.user.id,
    };
  } catch (err) {
    logger.error('Email verification error:', err);
    return {
      success: false,
      message: 'Failed to verify email',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Handle login with email and password using Supabase Auth.
 * Returns access_token + refresh_token so the frontend can establish a session.
 */
export async function handleLogin(
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      logger.warn(`Login failed for ${email}: ${error.message}`);

      // Provide user-friendly messages
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return {
          success: false,
          message: 'Please verify your email before logging in. Check your inbox for the confirmation link.',
          error: 'EMAIL_NOT_CONFIRMED',
        };
      }
      if (error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials')) {
        return {
          success: false,
          message: 'Invalid email or password.',
          error: 'INVALID_CREDENTIALS',
        };
      }
      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }

    if (!data.session) {
      return {
        success: false,
        message: 'Login failed — no session returned.',
        error: 'NO_SESSION',
      };
    }

    logger.info(`User logged in: ${email} (ID: ${data.user.id})`);

    return {
      success: true,
      message: 'Login successful',
      userId: data.user.id,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  } catch (err) {
    logger.error('Login error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Resend confirmation email to an existing unconfirmed Supabase user.
 */
export async function resendConfirmationEmail(
  email: string
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    // Find user by email
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError || !usersData?.users) {
      return {
        success: false,
        message: 'Failed to process request',
        error: 'Unable to look up user',
      };
    }

    const user = usersData.users.find((u: any) => u.email === email);

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address.',
        error: 'USER_NOT_FOUND',
      };
    }

    if (user.email_confirmed_at) {
      return {
        success: false,
        message: 'This email is already confirmed. Please login.',
        error: 'ALREADY_CONFIRMED',
      };
    }

    const userName = (user.user_metadata as any)?.full_name || email.split('@')[0];
    const emailSent = await sendConfirmationEmail(email, user.id, userName);

    if (!emailSent) {
      return {
        success: false,
        message: 'Failed to send confirmation email. Please try again.',
        error: 'EMAIL_SEND_FAILED',
      };
    }

    return {
      success: true,
      message: 'Confirmation email sent! Please check your inbox.',
    };
  } catch (err) {
    logger.error('Resend confirmation error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Handle password reset request — sends reset link via Resend.
 */
export async function handlePasswordResetRequest(
  email: string
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    // Always return success to avoid email enumeration
    if (listError || !usersData?.users) {
      return {
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      };
    }

    const user = usersData.users.find((u: any) => u.email === email);

    if (!user) {
      return {
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      };
    }

    // Use user ID as the reset token
    const emailSent = await sendPasswordResetEmail(email, user.id);

    if (!emailSent) {
      return {
        success: false,
        message: 'Failed to send reset email. Please try again.',
        error: 'EMAIL_SEND_FAILED',
      };
    }

    return {
      success: true,
      message: 'Password reset link sent! Check your inbox.',
    };
  } catch (err) {
    logger.error('Password reset request error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
