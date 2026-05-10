import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        // ── Email confirmation link from Resend ──────────────────────────────
        if (token) {
          setMessage('Verifying your email address...');

          const res = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Email verification failed. The link may have expired.');
          }

          setStatus('success');
          setMessage('Email verified! Redirecting to login...');
          setTimeout(() => navigate('/login'), 1800);
          return;
        }

        // ── OAuth / Supabase magic-link callback ─────────────────────────────
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 1200);
          return;
        }

        // No session and no token — something went wrong
        throw new Error('Authentication session could not be established. Please try again.');
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');

        let userMessage = 'Authentication failed. Please try again.';
        if (err.message?.includes('Email not confirmed')) {
          userMessage = 'Please confirm your email before logging in.';
        } else if (err.message?.includes('Invalid credentials')) {
          userMessage = 'Invalid email or password.';
        } else if (err.message) {
          userMessage = err.message;
        }

        setMessage(userMessage);
        setErrorDetails(err.message);
        setTimeout(() => navigate('/login'), 4000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] p-4 dark:bg-stone-950">
      <div className="w-full max-w-md">
        <div className="traveloop-card text-center">

          {status === 'loading' && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-50 dark:bg-fuchsia-400/10">
                <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
              </div>
              <h2 className="mb-2 font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
                Authenticating...
              </h2>
              <p className="text-stone-600 dark:text-stone-300">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-400/10">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="mb-2 font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
                Success!
              </h2>
              <p className="mb-4 text-stone-600 dark:text-stone-300">{message}</p>
              <div className="flex items-center justify-center gap-2 text-[#714B67]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Redirecting...</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-400/10">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              <h2 className="mb-2 font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
                Verification Failed
              </h2>
              <p className="mb-3 text-stone-600 dark:text-stone-300">{message}</p>
              {errorDetails && (
                <p className="mb-4 text-xs text-red-600 dark:text-red-400">{errorDetails}</p>
              )}
              <p className="text-sm text-stone-500 dark:text-stone-400">Redirecting to login page...</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
