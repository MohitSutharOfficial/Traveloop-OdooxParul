import {
  AlertCircle,
  CheckCircle,
  Compass,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plane,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const travelStyles = ['Adventure', 'Relaxation', 'Cultural', 'Business'];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    travelStyle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Call backend auth endpoint with Resend email
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // Also create user profile in Supabase (after email verification)
      // For now, just show success
      if (data.success) {
        setSuccess(true);
      } else {
        throw new Error(data.message || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}`);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] p-4 dark:bg-stone-950">
        <div className="traveloop-card w-full max-w-md">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-400/10">
              <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h2 className="font-sora text-xl font-semibold text-[#1C1917] dark:text-stone-100">
              Account Created Successfully!
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-[10px] bg-blue-50 p-4 dark:bg-blue-500/10">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📧 Email Confirmation Required</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                A confirmation email has been sent to <strong>{formData.email}</strong>. Click the confirmation link in your email to activate your account.
              </p>
            </div>

            <div className="space-y-3 border-t border-[#E8E6E0] pt-4 dark:border-stone-700">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#714B67] text-xs font-semibold text-white">1</div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917] dark:text-stone-100">Check your email</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Look for the confirmation email (check spam folder if needed)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#714B67] text-xs font-semibold text-white">2</div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917] dark:text-stone-100">Click the confirmation link</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Verify your email by clicking the link in the message</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#714B67] text-xs font-semibold text-white">3</div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917] dark:text-stone-100">Start exploring</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">After confirmation, you can log in to your account</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="traveloop-button-primary flex-1"
              >
                Go to Login
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="traveloop-button-secondary flex-1"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] p-4 dark:bg-stone-950">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-4xl items-center justify-center">
        <div className="w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[14px] bg-fuchsia-50 text-[#714B67] dark:bg-fuchsia-400/10">
              <Plane size={28} />
            </div>
            <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">
              Join Traveloop
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Create your traveler profile
            </p>
          </div>

          <div className="traveloop-card mx-auto max-w-3xl p-6 sm:p-8">
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailSignUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="traveloop-label">
                  First Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Aarav"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="traveloop-label">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Mehta"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="traveloop-label">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="traveloop-label">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 555 0100"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="traveloop-label">
                  City <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Mumbai"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="traveloop-label">
                  Country <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="India"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="traveloop-label">
                  Password <span className="text-red-600">*</span>
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
                    placeholder="Enter password"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  8+ chars with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label htmlFor="travelStyle" className="traveloop-label">
                  Travel Style <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Compass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <select
                    id="travelStyle"
                    name="travelStyle"
                    value={formData.travelStyle}
                    onChange={handleChange}
                    required
                    className="traveloop-input w-full pl-9"
                  >
                    <option value="">Select style</option>
                    {travelStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="traveloop-button-primary mt-2 h-11 sm:col-span-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E6E0] dark:border-stone-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-stone-600 dark:bg-stone-900 dark:text-stone-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignUp('google')}
                disabled={loading}
                className="traveloop-button-secondary h-10 text-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Google</span>
                  </>
                ) : (
                  'Google'
                )}
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignUp('github')}
                disabled={loading}
                className="traveloop-button-secondary h-10 text-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>GitHub</span>
                  </>
                ) : (
                  'GitHub'
                )}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#5D3E55] hover:text-[#714B67]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
