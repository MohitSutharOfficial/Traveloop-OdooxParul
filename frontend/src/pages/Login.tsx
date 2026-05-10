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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to login');
      }

      // Establish a real Supabase session so AuthContext + the whole app
      // recognises the authenticated user immediately.
      if (data.accessToken && data.refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
        });
        if (sessionError) {
          console.warn('setSession error (non-fatal):', sessionError.message);
        }
      }

      navigate('/dashboard');
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
      // Loading state will persist as OAuth redirects to provider
    } catch (err: any) {
      setError(err.message || `Failed to login with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[600px] bg-white dark:bg-stone-900 rounded-md shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden grid lg:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative hidden lg:block">
          <img src={destinationImage} alt="Travel destination" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917]/80 via-[#1C1917]/40 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-6 w-6" />
              <span className="font-bold text-xl">Traveloop</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Plan lighter.<br />Travel better.</h2>
            <p className="text-sm text-white/80 max-w-sm">
              Build trips, track budgets, and keep every itinerary detail moving with you.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="h-10 w-10 rounded-md bg-fuchsia-50 dark:bg-fuchsia-950 flex items-center justify-center">
                <Plane className="h-5 w-5 text-[#714B67]" />
              </div>
              <span className="font-bold text-xl text-stone-900 dark:text-white">Traveloop</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
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
                  className="w-full h-10 pl-9 pr-3 text-sm border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
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
                  className="w-full h-10 pl-9 pr-3 text-sm border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-stone-300 text-[#714B67] focus:ring-[#714B67]"
                />
                <span className="ml-2 text-stone-600 dark:text-stone-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-medium text-[#714B67] hover:text-[#8B5780]">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="w-full h-10 bg-[#714B67] hover:bg-[#8B5780] text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-stone-900 px-2 text-stone-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="h-9 flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="h-9 flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Demo Access */}
          <div className="rounded-md border border-fuchsia-200 dark:border-fuchsia-900 bg-fuchsia-50 dark:bg-fuchsia-950/30 p-3">
            <p className="text-xs font-medium text-fuchsia-900 dark:text-fuchsia-300 mb-2">
              Demo Access
            </p>
            <p className="text-xs text-fuchsia-800 dark:text-fuchsia-400 mb-2">
              Create account <Link to="/signup" className="underline font-medium">sign up</Link>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@traveloop.com');
                  setPassword('admin123');
                }}
                className="px-2 py-1.5 text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300 bg-white dark:bg-stone-900 border border-fuchsia-300 dark:border-fuchsia-800 rounded hover:bg-fuchsia-50 dark:hover:bg-stone-800 transition-colors"
              >
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@traveloop.com');
                  setPassword('demo123');
                }}
                className="px-2 py-1.5 text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300 bg-white dark:bg-stone-900 border border-fuchsia-300 dark:border-fuchsia-800 rounded hover:bg-fuchsia-50 dark:hover:bg-stone-800 transition-colors"
              >
                Fill Demo
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-stone-600 dark:text-stone-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#714B67] hover:text-[#8B5780]">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
