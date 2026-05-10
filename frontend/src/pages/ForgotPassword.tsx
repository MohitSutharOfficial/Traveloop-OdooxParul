import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Mail, Plane } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(email);
      if (!response.success) throw new Error(response.message);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] p-4 dark:bg-stone-950">
        <div className="traveloop-card w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-400/10">
            <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-300" />
          </div>
          <h2 className="font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">Check Your Email</h2>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">
            We've sent password reset instructions to <strong>{email}</strong>.
          </p>
          <Link to="/login" className="traveloop-button-primary mt-6 w-full">
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] p-4 dark:bg-stone-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[14px] bg-fuchsia-50 text-[#714B67] dark:bg-fuchsia-400/10">
            <Plane size={28} />
          </div>
          <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">Traveloop</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">Reset your password</p>
        </div>

        <div className="traveloop-card">
          <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 transition hover:text-[#714B67] dark:text-stone-300">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <h2 className="font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">Forgot Password?</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="traveloop-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="traveloop-input w-full pl-9"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="traveloop-button-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
