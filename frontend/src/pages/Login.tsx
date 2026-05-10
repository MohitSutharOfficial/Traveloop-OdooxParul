import { AlertCircle, Loader2, Lock, Mail, Plane } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const destinationImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: 'select_account' },
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || `Failed to login with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] p-4 dark:bg-stone-950">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[18px] border border-[#E8E6E0] bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-full overflow-hidden lg:block">
          <img src={destinationImage} alt="Open road through a mountain destination" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1C1917]/75 via-[#1C1917]/20 to-[#EF9F27]/30" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/15 backdrop-blur">
              <Plane size={24} />
            </div>
            <h2 className="font-sora text-4xl font-bold">Plan lighter. Travel better.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
              Build trips, track budgets, and keep every itinerary detail moving with you.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-amber-50 text-[#EF9F27] dark:bg-amber-400/10 lg:mx-0">
                <Plane size={28} />
              </div>
              <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">
                Welcome to Traveloop
              </h1>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                Your intelligent travel companion
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="traveloop-label">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="you@example.com"
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
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="Enter your password"
                    className="traveloop-input w-full pl-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#E8E6E0] text-[#EF9F27] focus:ring-[#EF9F27]"
                  />
                  <span className="ml-2 text-stone-600 dark:text-stone-300">Remember me</span>
                </label>
                <Link to="/forgot-password" className="font-medium text-[#BA7517] hover:text-[#EF9F27]">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="traveloop-button-primary h-11 w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Login'
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
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="traveloop-button-secondary h-10 text-xs"
              >
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
                className="traveloop-button-secondary h-10 text-xs"
              >
                GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[#BA7517] hover:text-[#EF9F27]">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
