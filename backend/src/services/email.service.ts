import { Resend } from 'resend';
import { logger } from '../utils/logger';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
  logger.warn('⚠️  RESEND_API_KEY not configured. Email service disabled.');
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@traveloop.com';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

/**
 * Email templates for Resend
 */
const emailTemplates = {
  confirmEmail: (email: string, token: string, userName: string) => ({
    subject: '✉️ Confirm your Traveloop account',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #EF9F27; margin: 0;">✈️ Traveloop</h1>
        </div>
        
        <h2 style="color: #1C1917; margin-top: 0;">Welcome, ${userName}!</h2>
        <p style="color: #666; line-height: 1.6;">Thank you for signing up to Traveloop. Please confirm your email address to get started with planning your next adventure.</p>
        
        <div style="margin: 30px 0;">
          <a href="${APP_URL}/auth/callback?token=${token}" style="display: inline-block; padding: 12px 30px; background-color: #EF9F27; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Confirm Email
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px;">Or copy this link: <code style="background: #f5f5f5; padding: 2px 6px;">${APP_URL}/auth/callback?token=${token}</code></p>
        
        <hr style="border: none; border-top: 1px solid #E8E6E0; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          If you didn't sign up for Traveloop, you can safely ignore this email.
        </p>
      </div>
    `,
  }),

  resetPassword: (email: string, token: string) => ({
    subject: '🔐 Reset your Traveloop password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #EF9F27; margin: 0;">✈️ Traveloop</h1>
        </div>
        
        <h2 style="color: #1C1917; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
        
        <div style="margin: 30px 0;">
          <a href="${APP_URL}/reset-password?token=${token}" style="display: inline-block; padding: 12px 30px; background-color: #EF9F27; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px;">This link expires in 1 hour.</p>
        
        <hr style="border: none; border-top: 1px solid #E8E6E0; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  }),

  welcomeEmail: (userName: string, email: string) => ({
    subject: '🎉 Welcome to Traveloop!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #EF9F27; margin: 0;">✈️ Traveloop</h1>
        </div>
        
        <h2 style="color: #1C1917; margin-top: 0;">Welcome to Traveloop, ${userName}!</h2>
        <p style="color: #666; line-height: 1.6;">Your account has been verified and you're all set. Start planning your next adventure!</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #F5F4F0; border-radius: 6px;">
          <p style="color: #1C1917; margin-top: 0;"><strong>Get Started:</strong></p>
          <ul style="color: #666; line-height: 1.8;">
            <li>Create your first trip</li>
            <li>Plan your itinerary</li>
            <li>Track your budget</li>
            <li>Connect with travelers</li>
          </ul>
        </div>
        
        <p style="text-align: center;">
          <a href="${APP_URL}/dashboard" style="color: #EF9F27; text-decoration: none; font-weight: bold;">Go to Dashboard →</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #E8E6E0; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          Questions? Contact us at support@traveloop.com
        </p>
      </div>
    `,
  }),
};

/**
 * Send confirmation email
 */
export async function sendConfirmationEmail(
  email: string,
  token: string,
  userName: string
): Promise<boolean> {
  if (!resend) {
    logger.warn('Resend not configured. Email not sent.');
    return false;
  }

  try {
    const template = emailTemplates.confirmEmail(email, token, userName);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      ...template,
    });

    if (error) {
      logger.error('Failed to send confirmation email:', error);
      return false;
    }

    logger.info(`✅ Confirmation email sent to ${email}`);
    return true;
  } catch (err) {
    logger.error('Error sending confirmation email:', err);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  if (!resend) {
    logger.warn('Resend not configured. Email not sent.');
    return false;
  }

  try {
    const template = emailTemplates.resetPassword(email, token);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      ...template,
    });

    if (error) {
      logger.error('Failed to send password reset email:', error);
      return false;
    }

    logger.info(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (err) {
    logger.error('Error sending password reset email:', err);
    return false;
  }
}

/**
 * Send welcome email after email verification
 */
export async function sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
  if (!resend) {
    logger.warn('Resend not configured. Email not sent.');
    return false;
  }

  try {
    const template = emailTemplates.welcomeEmail(userName, email);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      ...template,
    });

    if (error) {
      logger.error('Failed to send welcome email:', error);
      return false;
    }

    logger.info(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (err) {
    logger.error('Error sending welcome email:', err);
    return false;
  }
}
