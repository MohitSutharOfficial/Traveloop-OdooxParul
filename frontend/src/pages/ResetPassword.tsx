import { AlertCircle, CheckCircle, Loader2, Lock, Plane } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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
          <h2 className="font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
            Password Reset Successful
          </h2>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] p-4 dark:bg-stone-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[14px] bg-amber-50 text-[#EF9F27] dark:bg-amber-400/10">
            <Plane size={28} />
          </div>
          <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">Traveloop</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">Create a new password</p>
        </div>

        <div className="traveloop-card">
          <h2 className="font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">Set New Password</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            Please enter your new password.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="traveloop-label">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  className="traveloop-input w-full pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="traveloop-label">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  className="traveloop-input w-full pl-9"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="traveloop-button-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
